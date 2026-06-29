# Auto-Update Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Weekly Claude Code Scheduled Agent that autonomously researches new Payments content, stores proposals in Neon, notifies Sebastian via email + admin dashboard, and after approval/feedback generates MD content and reindexes the DB.

**Architecture:** Two-phase system — Phase 1 is a Claude Code cloud routine (weekly, Monday 08:00) that researches sources, generates proposals, writes them to DB via API, and sends an email. Phase 2 is a Next.js admin dashboard at `/admin/proposals` where Sebastian reviews, comments, requests revisions (Claude API call), approves items, triggers content generation, and confirms the reindex.

**Tech Stack:** Next.js 16 App Router, Drizzle + Neon Postgres, `@anthropic-ai/sdk`, `resend`, Vitest. Auth: NextAuth shared-password session for browser; `AGENT_API_KEY` bearer token for agent API calls.

## Global Constraints

- Next.js version: 16.2.3 — read `node_modules/next/dist/docs/` for breaking changes before writing route code
- Drizzle ORM `^0.45.2` — use `drizzle-orm/pg-core` imports, no raw SQL unless necessary
- All new API routes under `app/api/admin/` follow the existing `app/api/admin/reindex/route.ts` pattern: `auth()` check for browser, `validateApiKey()` for agent calls
- `maxDuration = 300` on routes that call Claude API or run reindex
- Tests: Vitest, `@` alias resolves to project root — see `vitest.config.ts`
- No automatic git commits — Sebastian commits manually

---

### Task 1: DB Schema + Migration

**Files:**
- Modify: `db/schema.ts`
- Create: `db/migrations/0016_proposals.sql`

**Interfaces:**
- Produces: `proposals` and `proposalItems` Drizzle table objects, exported from `db/schema.ts`

- [ ] **Step 1: Write migration SQL**

Create `db/migrations/0016_proposals.sql`:

```sql
CREATE TABLE proposals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_date  TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE proposal_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id       UUID REFERENCES proposals(id) ON DELETE CASCADE,
  topic             TEXT NOT NULL,
  target_file       TEXT NOT NULL,
  target_section    TEXT,
  reasoning         TEXT NOT NULL,
  sources           JSONB NOT NULL,
  content_outline   TEXT NOT NULL,
  comment           TEXT,
  generated_content TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  revised_at        TIMESTAMPTZ,
  executed_at       TIMESTAMPTZ
);
```

- [ ] **Step 2: Extend db/schema.ts**

Add after the existing table definitions:

```typescript
export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  week_date: text('week_date').notNull(),
  status: text('status').notNull().default('draft'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const proposalItems = pgTable('proposal_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  proposal_id: uuid('proposal_id').references(() => proposals.id, { onDelete: 'cascade' }),
  topic: text('topic').notNull(),
  target_file: text('target_file').notNull(),
  target_section: text('target_section'),
  reasoning: text('reasoning').notNull(),
  sources: jsonb('sources').notNull(),
  content_outline: text('content_outline').notNull(),
  comment: text('comment'),
  generated_content: text('generated_content'),
  status: text('status').notNull().default('pending'),
  revised_at: timestamp('revised_at', { withTimezone: true }),
  executed_at: timestamp('executed_at', { withTimezone: true }),
});
```

- [ ] **Step 3: Run migration against Neon**

```bash
pnpm drizzle-kit push
```

Expected: migration applied, no errors. If `drizzle-kit push` is not configured, run the SQL directly in the Neon console.

- [ ] **Step 4: Commit**

```bash
git add db/schema.ts db/migrations/0016_proposals.sql
git commit -m "feat(db): add proposals + proposal_items tables"
```

---

### Task 2: API Key Middleware + reindex fallback for new country files

**Files:**
- Create: `lib/api-auth.ts`
- Create: `tests/lib/api-auth.test.ts`
- Modify: `lib/ingest/reindex.ts` (add fallback for dynamically-named country files)

**Interfaces:**
- Produces: `validateApiKey(request: Request): boolean` from `lib/api-auth.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/lib/api-auth.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { validateApiKey } from '@/lib/api-auth';

function makeRequest(authHeader?: string): Request {
  return new Request('http://localhost', {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
}

describe('validateApiKey', () => {
  it('returns false when AGENT_API_KEY is not set', () => {
    vi.stubEnv('AGENT_API_KEY', '');
    expect(validateApiKey(makeRequest('Bearer secret'))).toBe(false);
    vi.unstubAllEnvs();
  });

  it('returns false when no Authorization header', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest())).toBe(false);
    vi.unstubAllEnvs();
  });

  it('returns false when token does not match', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest('Bearer wrong'))).toBe(false);
    vi.unstubAllEnvs();
  });

  it('returns true when token matches', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest('Bearer secret'))).toBe(true);
    vi.unstubAllEnvs();
  });

  it('returns false when format is not Bearer', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest('Token secret'))).toBe(false);
    vi.unstubAllEnvs();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm vitest run tests/lib/api-auth.test.ts
```

Expected: `FAIL` — cannot find module `@/lib/api-auth`

- [ ] **Step 3: Implement lib/api-auth.ts**

```typescript
export function validateApiKey(request: Request): boolean {
  const key = process.env.AGENT_API_KEY;
  if (!key) return false;
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return false;
  return header.slice(7) === key;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm vitest run tests/lib/api-auth.test.ts
```

Expected: 5 passing

- [ ] **Step 5: Fix reindex.ts to handle dynamically-named country files**

In `lib/ingest/reindex.ts`, update `filenameToSection` to fall back to `'laender'` for unknown file indices, and update `buildFileList` slug derivation to handle unknown keys. Find and replace:

```typescript
function filenameToSection(filename: string): string | null {
  // e.g. "gpdb_01_regulatorik.md" → "01_regulatorik"
  const m = filename.match(/^gpdb_(\d{2}_[^.]+)\.md$/);
  if (!m) return null;
  const key = m[1];
  return SECTION_MAP[key] ?? null;
}
```

Replace with:

```typescript
function filenameToSection(filename: string): string | null {
  const m = filename.match(/^gpdb_(\d{2}_[^.]+)\.md$/);
  if (!m) return null;
  const key = m[1];
  // Known sections from map; files 08+ are new country files → 'laender'
  return SECTION_MAP[key] ?? 'laender';
}
```

Also update the slug derivation in `reindex()`. Find:

```typescript
    const slug = SLUG_MAP[section] ?? slugify(filename);
```

This already falls back to `slugify(filename)` — no change needed there.

- [ ] **Step 6: Commit**

```bash
git add lib/api-auth.ts tests/lib/api-auth.test.ts lib/ingest/reindex.ts
git commit -m "feat(api-auth): API key middleware + reindex country file fallback"
```

---

### Task 3: Proposal Queries

**Files:**
- Create: `lib/queries/proposals.ts`

**Interfaces:**
- Produces:
  - `ProposalWithItems` type
  - `getAllProposals(): Promise<ProposalWithItems[]>`
  - `getProposalWithItems(id: string): Promise<ProposalWithItems | null>`

- [ ] **Step 1: Create lib/queries/proposals.ts**

```typescript
import { db } from '@/db/client';
import { proposals, proposalItems } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export type Proposal = typeof proposals.$inferSelect;
export type ProposalItem = typeof proposalItems.$inferSelect;
export type ProposalWithItems = Proposal & { items: ProposalItem[] };

export async function getAllProposals(): Promise<ProposalWithItems[]> {
  const allProposals = await db
    .select()
    .from(proposals)
    .orderBy(desc(proposals.created_at));

  return Promise.all(
    allProposals.map(async proposal => ({
      ...proposal,
      items: await db
        .select()
        .from(proposalItems)
        .where(eq(proposalItems.proposal_id, proposal.id)),
    }))
  );
}

export async function getProposalWithItems(id: string): Promise<ProposalWithItems | null> {
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1);
  if (!proposal) return null;

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposal_id, id));

  return { ...proposal, items };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/queries/proposals.ts
git commit -m "feat(queries): proposal + proposal_items query helpers"
```

---

### Task 4: Content Summary API + Proposals POST/GET

**Files:**
- Create: `app/api/admin/content-summary/route.ts`
- Create: `app/api/admin/proposals/route.ts`

**Interfaces:**
- Consumes: `validateApiKey` from `lib/api-auth.ts`, `getAllProposals` from `lib/queries/proposals.ts`
- Produces:
  - `GET /api/admin/content-summary` → `{ documents: [...], total: number }`
  - `POST /api/admin/proposals` → `{ proposal_id: string, items_created: number }`
  - `GET /api/admin/proposals` → `ProposalWithItems[]`

- [ ] **Step 1: Create app/api/admin/content-summary/route.ts**

```typescript
import { auth } from '@/auth';
import { validateApiKey } from '@/lib/api-auth';
import { db } from '@/db/client';
import { documents } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(request: Request) {
  const session = await auth();
  if (!session && !validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const docs = await db
    .select({
      source_file: documents.source_file,
      section: documents.section,
      slug: documents.slug,
      title: documents.title,
      updated_at: documents.updated_at,
    })
    .from(documents)
    .orderBy(asc(documents.section));

  return Response.json({ documents: docs, total: docs.length });
}
```

- [ ] **Step 2: Create app/api/admin/proposals/route.ts**

```typescript
import { auth } from '@/auth';
import { validateApiKey } from '@/lib/api-auth';
import { db } from '@/db/client';
import { proposals, proposalItems } from '@/db/schema';
import { getAllProposals } from '@/lib/queries/proposals';

interface ProposalItemInput {
  topic: string;
  target_file: string;
  target_section?: string;
  reasoning: string;
  sources: Array<{ title: string; url: string; date: string }>;
  content_outline: string;
}

export async function POST(request: Request) {
  if (!validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { week_date: string; items: ProposalItemInput[] };

  if (!body.week_date || !Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: 'week_date and items required' }, { status: 400 });
  }

  const [proposal] = await db
    .insert(proposals)
    .values({ week_date: body.week_date, status: 'draft' })
    .returning();

  const inserted = await db
    .insert(proposalItems)
    .values(
      body.items.map(item => ({
        proposal_id: proposal.id,
        topic: item.topic,
        target_file: item.target_file,
        target_section: item.target_section ?? null,
        reasoning: item.reasoning,
        sources: item.sources,
        content_outline: item.content_outline,
        status: 'pending',
      }))
    )
    .returning({ id: proposalItems.id });

  return Response.json({ proposal_id: proposal.id, items_created: inserted.length });
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const all = await getAllProposals();
  return Response.json(all);
}
```

- [ ] **Step 3: Test manually with curl (after local dev server is running)**

```bash
# Test POST (agent writes proposals)
curl -X POST http://localhost:3000/api/admin/proposals \
  -H "Authorization: Bearer test-key" \
  -H "Content-Type: application/json" \
  -d '{"week_date":"2026-06-29","items":[{"topic":"Test","target_file":"gpdb_01_regulatorik.md","reasoning":"Test reason","sources":[{"title":"EPC","url":"https://example.com","date":"2026-06-29"}],"content_outline":"## Test\n\nContent here."}]}'
```

Expected: `{ "proposal_id": "<uuid>", "items_created": 1 }`

Note: set `AGENT_API_KEY=test-key` in `.env.local` for this test.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/content-summary/route.ts app/api/admin/proposals/route.ts
git commit -m "feat(api): content-summary + proposals POST/GET endpoints"
```

---

### Task 5: Item-Level PATCH + Email Notification

**Files:**
- Create: `app/api/admin/proposals/[id]/items/[itemId]/route.ts`
- Create: `lib/email/proposal-notification.ts`
- Create: `app/api/admin/notify-email/route.ts`

**Interfaces:**
- Consumes: `validateApiKey` from `lib/api-auth.ts`
- Produces:
  - `PATCH /api/admin/proposals/[id]/items/[itemId]` → `{ ok: true }`
  - `POST /api/admin/notify-email` → `{ ok: true }`

- [ ] **Step 1: Install Resend**

```bash
pnpm add resend
```

Expected: `resend` added to `package.json`

- [ ] **Step 2: Create app/api/admin/proposals/[id]/items/[itemId]/route.ts**

```typescript
import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface PatchBody {
  status?: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { itemId } = await params;
  const body = await request.json() as PatchBody;

  const update: Partial<typeof proposalItems.$inferInsert> = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.comment !== undefined) update.comment = body.comment;

  if (Object.keys(update).length === 0) {
    return Response.json({ error: 'Nothing to update' }, { status: 400 });
  }

  await db
    .update(proposalItems)
    .set(update)
    .where(eq(proposalItems.id, itemId));

  return Response.json({ ok: true });
}
```

- [ ] **Step 3: Create lib/email/proposal-notification.ts**

```typescript
import { Resend } from 'resend';

interface NotificationItem {
  topic: string;
  reasoning: string;
}

function getKW(dateStr: string): number {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export async function sendProposalNotification({
  proposalId,
  weekDate,
  items,
}: {
  proposalId: string;
  weekDate: string;
  items: NotificationItem[];
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const kw = getKW(weekDate);
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://gpdb.norinit.de';

  const topicsList = items
    .map(item => `<li><strong>${item.topic}</strong><br>${item.reasoning}</li>`)
    .join('\n');

  await resend.emails.send({
    from: 'GPDB Agent <agent@norinit.de>',
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `GPDB KW ${kw}: ${items.length} neue Themen zur Review`,
    html: `
      <h2>GPDB Update-Agent — KW ${kw}</h2>
      <p>Der Agent hat <strong>${items.length} Themen</strong> zur Review vorbereitet:</p>
      <ul style="line-height:1.8">${topicsList}</ul>
      <p style="margin-top:24px">
        <a href="${baseUrl}/admin/proposals" style="background:#1a1a1a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
          → Zur Review-Seite
        </a>
      </p>
    `,
  });
}
```

- [ ] **Step 4: Create app/api/admin/notify-email/route.ts**

```typescript
import { validateApiKey } from '@/lib/api-auth';
import { sendProposalNotification } from '@/lib/email/proposal-notification';

export async function POST(request: Request) {
  if (!validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as {
    proposal_id: string;
    week_date: string;
    items: Array<{ topic: string; reasoning: string }>;
  };

  await sendProposalNotification({
    proposalId: body.proposal_id,
    weekDate: body.week_date,
    items: body.items,
  });

  return Response.json({ ok: true });
}
```

- [ ] **Step 5: Add env vars to .env.local**

Add to `.env.local`:
```
AGENT_API_KEY=<generate with: openssl rand -hex 32>
RESEND_API_KEY=<from resend.com dashboard>
NOTIFICATION_EMAIL=basti.lehmann@googlemail.com
```

Also add to Vercel environment variables (Production).

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/proposals/[id]/items/[itemId]/route.ts \
        lib/email/proposal-notification.ts \
        app/api/admin/notify-email/route.ts
git commit -m "feat(api): item PATCH, email notification via Resend"
```

---

### Task 6: Section Utils (pure functions + tests)

**Files:**
- Create: `lib/proposals/section-utils.ts`
- Create: `tests/lib/proposals/section-utils.test.ts`

**Interfaces:**
- Produces:
  - `extractSection(md: string, section: string): string`
  - `replaceSection(md: string, section: string, newContent: string): string`
  - `getNextFileIndex(contentDir: string): string`

- [ ] **Step 1: Write failing tests**

Create `tests/lib/proposals/section-utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { extractSection, replaceSection } from '@/lib/proposals/section-utils';

const SAMPLE_MD = `# Global Doc

## SEPA Credit Transfer

Old SEPA content here.

## Andere Sektion

Other content.
`;

describe('extractSection', () => {
  it('extracts an existing section', () => {
    const result = extractSection(SAMPLE_MD, 'SEPA Credit Transfer');
    expect(result).toContain('Old SEPA content here');
    expect(result).not.toContain('Other content');
  });

  it('returns empty string for unknown section', () => {
    expect(extractSection(SAMPLE_MD, 'Nicht vorhanden')).toBe('');
  });
});

describe('replaceSection', () => {
  it('replaces an existing section', () => {
    const result = replaceSection(SAMPLE_MD, 'SEPA Credit Transfer', '## SEPA Credit Transfer\n\nNew content.');
    expect(result).toContain('New content.');
    expect(result).not.toContain('Old SEPA content here');
    expect(result).toContain('Other content');
  });

  it('appends when section not found', () => {
    const result = replaceSection(SAMPLE_MD, 'Neue Sektion', '## Neue Sektion\n\nAppended.');
    expect(result).toContain('Old SEPA content here');
    expect(result).toContain('Appended.');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm vitest run tests/lib/proposals/section-utils.test.ts
```

Expected: `FAIL` — cannot find module

- [ ] **Step 3: Implement lib/proposals/section-utils.ts**

```typescript
import fs from 'node:fs';

export function extractSection(md: string, section: string): string {
  const lines = md.split('\n');
  let inSection = false;
  let sectionLevel = 2;
  const result: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3}) (.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      if (!inSection && title.toLowerCase().includes(section.toLowerCase())) {
        inSection = true;
        sectionLevel = level;
      } else if (inSection && level <= sectionLevel) {
        break;
      }
    }
    if (inSection) result.push(line);
  }

  return result.join('\n');
}

export function replaceSection(md: string, section: string, newContent: string): string {
  const lines = md.split('\n');
  let sectionStart = -1;
  let sectionEnd = lines.length;
  let sectionLevel = 2;

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^(#{1,3}) (.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      if (sectionStart === -1 && title.toLowerCase().includes(section.toLowerCase())) {
        sectionStart = i;
        sectionLevel = level;
      } else if (sectionStart !== -1 && level <= sectionLevel) {
        sectionEnd = i;
        break;
      }
    }
  }

  if (sectionStart === -1) {
    return md.trimEnd() + '\n\n' + newContent;
  }

  const before = lines.slice(0, sectionStart).join('\n');
  const after = lines.slice(sectionEnd).join('\n');
  return [before.trimEnd(), newContent, after.trimStart()].filter(Boolean).join('\n\n');
}

export function getNextFileIndex(contentDir: string): string {
  const files = fs.readdirSync(contentDir).filter(f => /^gpdb_\d{2}_/.test(f));
  if (files.length === 0) return '08';
  const indices = files.map(f => parseInt(f.match(/^gpdb_(\d{2})_/)![1], 10));
  return String(Math.max(...indices) + 1).padStart(2, '0');
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm vitest run tests/lib/proposals/section-utils.test.ts
```

Expected: 4 passing

- [ ] **Step 5: Commit**

```bash
git add lib/proposals/section-utils.ts tests/lib/proposals/section-utils.test.ts
git commit -m "feat(proposals): section-utils (extract, replace, getNextIndex) + tests"
```

---

### Task 7: Install SDK + Revision Endpoint

**Files:**
- Create: `app/api/admin/proposals/[id]/revise/route.ts`

**Interfaces:**
- Consumes: `getProposalWithItems` from `lib/queries/proposals.ts`
- Produces: `POST /api/admin/proposals/[id]/revise` → `{ revised: number }`

- [ ] **Step 1: Install @anthropic-ai/sdk**

```bash
pnpm add @anthropic-ai/sdk
```

Expected: added to `package.json`

- [ ] **Step 2: Create app/api/admin/proposals/[id]/revise/route.ts**

```typescript
import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems, proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';
import { getProposalWithItems } from '@/lib/queries/proposals';

export const maxDuration = 120;

interface RevisedItem {
  topic?: string;
  target_file?: string;
  target_section?: string;
  reasoning?: string;
  content_outline?: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const proposal = await getProposalWithItems(id);
  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });

  const toRevise = proposal.items.filter(item => item.comment && item.status === 'pending');
  if (toRevise.length === 0) {
    return Response.json({ error: 'No items with comments to revise' }, { status: 400 });
  }

  const client = new Anthropic();

  for (const item of toRevise) {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Du bist ein Payments-Wissens-Agent. Überarbeite diesen Proposal basierend auf dem Feedback.

Aktueller Proposal:
Thema: ${item.topic}
Ziel-Datei: ${item.target_file}${item.target_section ? ` / ${item.target_section}` : ''}
Begründung: ${item.reasoning}
Content-Outline: ${item.content_outline}
Quellen: ${JSON.stringify(item.sources)}

Feedback: ${item.comment}

Antworte nur mit einem JSON-Objekt (kein Markdown, kein Kommentar):
{"topic":"...","target_file":"...","target_section":"...","reasoning":"...","content_outline":"..."}`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    let revised: RevisedItem = {};
    try {
      revised = JSON.parse(text);
    } catch {
      continue;
    }

    await db
      .update(proposalItems)
      .set({
        topic: revised.topic ?? item.topic,
        target_file: revised.target_file ?? item.target_file,
        target_section: revised.target_section ?? item.target_section,
        reasoning: revised.reasoning ?? item.reasoning,
        content_outline: revised.content_outline ?? item.content_outline,
        comment: null,
        revised_at: new Date(),
      })
      .where(eq(proposalItems.id, item.id));
  }

  await db
    .update(proposals)
    .set({ status: 'draft' })
    .where(eq(proposals.id, id));

  return Response.json({ revised: toRevise.length });
}
```

- [ ] **Step 3: Add ANTHROPIC_API_KEY to .env.local and Vercel**

```
ANTHROPIC_API_KEY=<your key>
```

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/proposals/[id]/revise/route.ts
git commit -m "feat(api): proposal revision endpoint via Claude API"
```

---

### Task 8: Execute Endpoint

**Files:**
- Create: `app/api/admin/proposals/[id]/execute/route.ts`

**Interfaces:**
- Consumes: `getProposalWithItems`, `extractSection`, `@anthropic-ai/sdk`
- Produces: `POST /api/admin/proposals/[id]/execute` → `{ generated: number }`

- [ ] **Step 1: Create app/api/admin/proposals/[id]/execute/route.ts**

```typescript
import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';
import { getProposalWithItems } from '@/lib/queries/proposals';
import { extractSection } from '@/lib/proposals/section-utils';
import fs from 'node:fs';
import path from 'node:path';

export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const proposal = await getProposalWithItems(id);
  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });

  const approved = proposal.items.filter(item => item.status === 'approved');
  if (approved.length === 0) {
    return Response.json({ error: 'No approved items' }, { status: 400 });
  }

  const client = new Anthropic();
  const contentDir = path.join(process.cwd(), 'content');

  for (const item of approved) {
    let existingSection = '';
    if (item.target_file !== 'new') {
      const filePath = path.join(contentDir, item.target_file);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        existingSection = item.target_section
          ? extractSection(fileContent, item.target_section)
          : '';
      }
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Du bist ein Payments-Fachexperte. Schreibe strukturiertes Markdown für eine interne Wissensdatenbank.

Thema: ${item.topic}
Ziel-Datei: ${item.target_file !== 'new' ? item.target_file : 'Neue Länderdatei'}
${item.target_section ? `Abschnitt: ${item.target_section}` : ''}
Geplanter Inhalt: ${item.content_outline}
Quellen: ${JSON.stringify(item.sources)}
${existingSection ? `\nBestehender Abschnitt (wird ersetzt):\n${existingSection}` : ''}

Schreibe nur den Markdown-Block selbst. Kein Präambel, kein Kommentar.`,
        },
      ],
    });

    const generated = message.content[0].type === 'text' ? message.content[0].text : '';

    await db
      .update(proposalItems)
      .set({ generated_content: generated })
      .where(eq(proposalItems.id, item.id));
  }

  return Response.json({ generated: approved.length });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/proposals/[id]/execute/route.ts
git commit -m "feat(api): execute endpoint — Claude generates MD content per approved item"
```

---

### Task 9: Confirm Endpoint

**Files:**
- Create: `app/api/admin/proposals/[id]/confirm/route.ts`

**Interfaces:**
- Consumes: `getProposalWithItems`, `replaceSection`, `getNextFileIndex`, `reindex`
- Produces: `POST /api/admin/proposals/[id]/confirm` → `{ confirmed: number }`
- Request body: `{ item_ids: string[] }`

- [ ] **Step 1: Create app/api/admin/proposals/[id]/confirm/route.ts**

```typescript
import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems, proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getProposalWithItems } from '@/lib/queries/proposals';
import { replaceSection, getNextFileIndex } from '@/lib/proposals/section-utils';
import { reindex } from '@/lib/ingest/reindex';
import fs from 'node:fs';
import path from 'node:path';

export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { item_ids } = await request.json() as { item_ids: string[] };

  const proposal = await getProposalWithItems(id);
  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });

  const contentDir = path.join(process.cwd(), 'content');

  const toConfirm = proposal.items.filter(
    item => item_ids.includes(item.id) && item.generated_content
  );

  for (const item of toConfirm) {
    if (item.target_file === 'new') {
      // New country file
      const slug = item.topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const index = getNextFileIndex(contentDir);
      const filename = `gpdb_${index}_${slug}.md`;
      fs.writeFileSync(path.join(contentDir, filename), item.generated_content!, 'utf-8');
    } else {
      const filePath = path.join(contentDir, item.target_file);
      const existing = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

      const updated = item.target_section
        ? replaceSection(existing, item.target_section, item.generated_content!)
        : existing.trimEnd() + '\n\n' + item.generated_content!;

      fs.writeFileSync(filePath, updated, 'utf-8');
    }

    await db
      .update(proposalItems)
      .set({ status: 'executed', executed_at: new Date() })
      .where(eq(proposalItems.id, item.id));
  }

  // Reindex all changed content
  await reindex();

  // Mark proposal as executed if all items are done
  const updated = await getProposalWithItems(id);
  const allDone = updated?.items.every(
    item => item.status === 'executed' || item.status === 'rejected'
  );
  if (allDone) {
    await db.update(proposals).set({ status: 'executed' }).where(eq(proposals.id, id));
  }

  return Response.json({ confirmed: toConfirm.length });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/proposals/[id]/confirm/route.ts
git commit -m "feat(api): confirm endpoint — write MD files + reindex"
```

---

### Task 10: Admin Dashboard UI

**Files:**
- Create: `app/admin/proposals/page.tsx`
- Create: `app/admin/proposals/proposals-client.tsx`

**Interfaces:**
- Consumes: all proposal API endpoints above
- Produces: `/admin/proposals` page, protected by NextAuth session

- [ ] **Step 1: Create app/admin/proposals/page.tsx (server component)**

```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllProposals } from '@/lib/queries/proposals';
import { ProposalsClient } from './proposals-client';

export default async function ProposalsPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const proposals = await getAllProposals();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Content Proposals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Wöchentlich vom Update-Agent generiert. Kommentieren, freigeben oder ablehnen.
        </p>
      </div>
      <ProposalsClient initialProposals={proposals} />
    </div>
  );
}
```

- [ ] **Step 2: Create app/admin/proposals/proposals-client.tsx**

```typescript
'use client';

import { useState } from 'react';
import type { ProposalWithItems, ProposalItem } from '@/lib/queries/proposals';

interface Props {
  initialProposals: ProposalWithItems[];
}

export function ProposalsClient({ initialProposals }: Props) {
  const [proposals, setProposals] = useState(initialProposals);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function patchItem(proposalId: string, itemId: string, patch: { status?: string; comment?: string }) {
    await fetch(`/api/admin/proposals/${proposalId}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  }

  async function saveComments(proposal: ProposalWithItems) {
    for (const item of proposal.items) {
      const comment = comments[item.id];
      if (comment !== undefined) {
        await patchItem(proposal.id, item.id, { comment });
      }
    }
  }

  async function requestRevision(proposal: ProposalWithItems) {
    setLoading(l => ({ ...l, [`revise-${proposal.id}`]: true }));
    await saveComments(proposal);
    await fetch(`/api/admin/proposals/${proposal.id}/revise`, { method: 'POST' });
    const res = await fetch('/api/admin/proposals');
    setProposals(await res.json());
    setLoading(l => ({ ...l, [`revise-${proposal.id}`]: false }));
  }

  async function executeApproved(proposal: ProposalWithItems) {
    setLoading(l => ({ ...l, [`execute-${proposal.id}`]: true }));
    await fetch(`/api/admin/proposals/${proposal.id}/execute`, { method: 'POST' });
    const res = await fetch('/api/admin/proposals');
    setProposals(await res.json());
    setLoading(l => ({ ...l, [`execute-${proposal.id}`]: false }));
  }

  async function confirmItem(proposal: ProposalWithItems, itemId: string) {
    setLoading(l => ({ ...l, [`confirm-${itemId}`]: true }));
    await fetch(`/api/admin/proposals/${proposal.id}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_ids: [itemId] }),
    });
    const res = await fetch('/api/admin/proposals');
    setProposals(await res.json());
    setLoading(l => ({ ...l, [`confirm-${itemId}`]: false }));
  }

  async function toggleStatus(proposal: ProposalWithItems, item: ProposalItem, status: 'approved' | 'rejected' | 'pending') {
    const next = item.status === status ? 'pending' : status;
    await patchItem(proposal.id, item.id, { status: next });
    const res = await fetch('/api/admin/proposals');
    setProposals(await res.json());
  }

  if (proposals.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Noch keine Proposals. Der Agent läuft montags um 08:00.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {proposals.map(proposal => {
        const hasComments = proposal.items.some(item => comments[item.id] || item.comment);
        const hasApproved = proposal.items.some(item => item.status === 'approved');
        const hasGenerated = proposal.items.some(item => item.generated_content && item.status === 'approved');

        return (
          <div key={proposal.id} className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
              <div>
                <span className="font-medium text-sm">KW {getKW(proposal.week_date)}</span>
                <span className="text-muted-foreground text-xs ml-2">
                  {proposal.items.length} Proposals · {proposal.status}
                </span>
              </div>
              <div className="flex gap-2">
                {hasComments && (
                  <button
                    onClick={() => requestRevision(proposal)}
                    disabled={loading[`revise-${proposal.id}`]}
                    className="text-xs px-3 py-1.5 rounded border border-border hover:bg-accent disabled:opacity-50"
                  >
                    {loading[`revise-${proposal.id}`] ? 'Überarbeite…' : 'Revision anfragen'}
                  </button>
                )}
                {hasApproved && !hasGenerated && (
                  <button
                    onClick={() => executeApproved(proposal)}
                    disabled={loading[`execute-${proposal.id}`]}
                    className="text-xs px-3 py-1.5 rounded bg-foreground text-background hover:opacity-90 disabled:opacity-50"
                  >
                    {loading[`execute-${proposal.id}`] ? 'Generiere…' : 'Approved ausführen'}
                  </button>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-border">
              {proposal.items.map(item => (
                <div key={item.id} className="px-5 py-4 space-y-3">
                  {/* Topic + target */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{item.topic}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.target_file === 'new' ? 'Neues Land anlegen' : item.target_file}
                        {item.target_section && ` › ${item.target_section}`}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleStatus(proposal, item, 'approved')}
                        className={`text-xs px-2.5 py-1 rounded border ${item.status === 'approved' ? 'bg-green-600 text-white border-green-600' : 'border-border hover:bg-accent'}`}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => toggleStatus(proposal, item, 'rejected')}
                        className={`text-xs px-2.5 py-1 rounded border ${item.status === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'border-border hover:bg-accent'}`}
                      >
                        ✗
                      </button>
                    </div>
                  </div>

                  {/* Reasoning + sources */}
                  <p className="text-xs text-muted-foreground">{item.reasoning}</p>
                  <div className="flex flex-wrap gap-2">
                    {(item.sources as Array<{ title: string; url: string; date: string }>).map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline text-muted-foreground hover:text-foreground"
                      >
                        {src.title} ({src.date})
                      </a>
                    ))}
                  </div>

                  {/* Outline */}
                  <pre className="text-xs bg-muted/40 rounded p-3 whitespace-pre-wrap font-mono leading-relaxed">
                    {item.content_outline}
                  </pre>

                  {/* Comment */}
                  {item.status !== 'executed' && item.status !== 'rejected' && (
                    <textarea
                      placeholder="Kommentar (z.B. 'Nicht Australien, lieber Kanada')"
                      defaultValue={item.comment ?? ''}
                      onChange={e => setComments(c => ({ ...c, [item.id]: e.target.value }))}
                      rows={2}
                      className="w-full text-xs rounded border border-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  )}

                  {/* Generated content review */}
                  {item.generated_content && item.status === 'approved' && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-amber-600">Generierter Inhalt — bitte prüfen:</p>
                      <pre className="text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded p-3 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                        {item.generated_content}
                      </pre>
                      <button
                        onClick={() => confirmItem(proposal, item.id)}
                        disabled={loading[`confirm-${item.id}`]}
                        className="text-xs px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                      >
                        {loading[`confirm-${item.id}`] ? 'Reindex läuft…' : 'Reindex bestätigen'}
                      </button>
                    </div>
                  )}

                  {item.status === 'executed' && (
                    <p className="text-xs text-green-600 font-medium">✓ Ausgeführt und reindexiert</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getKW(dateStr: string): number {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}
```

- [ ] **Step 3: Add link to existing admin page**

In `app/admin/page.tsx`, add a link to `/admin/proposals` (read the file first, then add the link to match its existing style).

- [ ] **Step 4: Test the UI locally**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/admin/proposals`. Should show "Noch keine Proposals." if DB is empty.

Seed a test proposal via curl (use Task 4's curl command), then refresh. Verify the proposal appears with all fields.

- [ ] **Step 5: Commit**

```bash
git add app/admin/proposals/
git commit -m "feat(ui): admin proposals dashboard — review, feedback, revision, execution"
```

---

### Task 11: Deploy + Scheduled Agent Routine

**Files:**
- No new files — configure Vercel env vars, then set up Claude Code scheduled routine

**Interfaces:**
- Consumes: all API endpoints above (deployed to `gpdb.norinit.de`)

- [ ] **Step 1: Deploy to Vercel**

```bash
git push
```

Verify: `https://gpdb.norinit.de/admin/proposals` loads, session required.

- [ ] **Step 2: Set env vars in Vercel dashboard**

In Vercel → Project Settings → Environment Variables (Production):
```
AGENT_API_KEY=<same value as .env.local>
RESEND_API_KEY=<from resend.com>
NOTIFICATION_EMAIL=basti.lehmann@googlemail.com
ANTHROPIC_API_KEY=<your key>
```

Redeploy after adding vars.

- [ ] **Step 3: Set up the scheduled routine via `/schedule` skill**

In a new Claude Code session, invoke `/schedule` and provide this agent prompt:

---

**AGENT PROMPT FOR SCHEDULED ROUTINE:**

```
You are the GPDB Auto-Update Agent for the Global Payments Knowledge Base at gpdb.norinit.de.

Your task: Research new Payments-relevant content weekly, propose topics for Sebastian's review.

## Step 1 — Get current DB state

GET https://gpdb.norinit.de/api/admin/content-summary
Header: Authorization: Bearer <AGENT_API_KEY>

This returns all documents currently in the DB (source_file, section, slug, title, updated_at).
Note which sections exist and when they were last updated.

## Step 2 — Scan fixed sources (WebFetch each)

Check for updates from the last 7 days:
- https://www.europeanpaymentscouncil.eu/news-insights/news (EPC news)
- https://www.bis.org/cpmi/publications.htm (BIS CPMI publications)
- https://www.swift.com/standards/iso-20022/iso-20022-programme (SWIFT ISO 20022)
- https://www.bundesbank.de/de/aufgaben/unbarer-zahlungsverkehr (Bundesbank)
- https://www.ecb.europa.eu/paym/intro/html/index.en.html (ECB payments)

## Step 3 — Web Search for gaps

Search for recent news (last 7 days) using queries like:
- "SEPA payments regulation 2026"
- "ISO 20022 migration update June 2026"
- "pain.001 SWIFT 2026"
- "instant payments Europe 2026"
- "new payment system [country]" for countries NOT in the DB summary

## Step 4 — Compose 5-8 proposals

For each proposal, consider:
- Is this topic missing or outdated in the DB?
- Is this a regulatory change that affects one of the existing sections?
- Is this a new country that should be added?

Each proposal must have:
- topic: specific title (e.g. "SEPA Instant — neues 100k€ Limit ab Oktober 2026")
- target_file: filename like "gpdb_01_regulatorik.md" or "new" for a new country
- target_section: the H2/H3 heading to update, or null for new files
- reasoning: 1-2 sentences why this is relevant and what's missing
- sources: array of {title, url, date} for the sources found
- content_outline: Markdown outline of what the new content should cover

## Step 5 — Write proposals to DB

Get today's date for week_date (ISO format, Monday of current week).

POST https://gpdb.norinit.de/api/admin/proposals
Header: Authorization: Bearer <AGENT_API_KEY>
Header: Content-Type: application/json
Body: {"week_date":"<YYYY-MM-DD>","items":[...]}

Save the returned proposal_id.

## Step 6 — Send email notification

POST https://gpdb.norinit.de/api/admin/notify-email
Header: Authorization: Bearer <AGENT_API_KEY>
Header: Content-Type: application/json
Body: {"proposal_id":"<id>","week_date":"<YYYY-MM-DD>","items":[{"topic":"...","reasoning":"..."},...]}

Done. Sebastian will review at https://gpdb.norinit.de/admin/proposals
```

**Schedule:** Weekly, Monday 08:00 (Europe/Berlin)

---

- [ ] **Step 4: Verify first run**

After setting up the routine, trigger a manual run. Check:
1. `/admin/proposals` shows a new batch
2. Email arrives at `basti.lehmann@googlemail.com`
3. Proposals have sources, reasoning, and content outlines

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: auto-update agent — all endpoints, UI, and routine configured"
```
