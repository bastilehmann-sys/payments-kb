# Payments KB (GPDB) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Internes Nachschlagewerk für Global Payments (Regulatorik, Formate, Clearing, IHB/POBO, 30 Länder) mit Dashboard, Browse und RAG-Chat für Sebastian + 1 Kollege.

**Architecture:** Next.js 15 App Router auf Vercel, Neon Postgres mit pgvector, NextAuth Google OAuth mit Email-Whitelist, Claude Sonnet 4.6 via Anthropic SDK für RAG-Chat. MD-Dateien als Source of Truth im Repo, manueller Reindex-Button auf /admin. Design identisch zu learning.norinit.de.

**Tech Stack:** Next.js 15, TypeScript, Tailwind, shadcn/ui, Drizzle ORM, Neon pgvector, NextAuth, Anthropic SDK, OpenAI text-embedding-3-small.

**Spec:** `docs/superpowers/specs/2026-04-13-payments-kb-design.md`

---

## Phase 0 — Vorbereitung (Sebastian-Tasks, nicht Code)

### Task 0.1: Accounts & Credentials bereitstellen

- [ ] **Step 1:** Neon Project anlegen, Connection-String notieren (`DATABASE_URL`) — DONE
- [ ] **Step 2:** Shared-Passwort wählen, per `scripts/hash-password.ts` hashen, `APP_PASSWORD_HASH` setzen
- [ ] **Step 3:** Anthropic + OpenAI Keys werden NICHT in Env gesetzt — Nutzer pflegt sie pro Session unter `/settings`
- [ ] **Step 4:** Vercel Projekt reservieren, Subdomain `gpdb.norinit.de` DNS-mäßig vorbereiten

### Task 0.2: Design-Tokens aus learning.norinit.de extrahieren

- [ ] **Step 1:** Zu https://learning.norinit.de navigieren, DevTools auf
- [ ] **Step 2:** Tailwind-Config / CSS-Variablen extrahieren (Colors, Fonts, Spacing, Shadows, Border-Radius, Dark-Mode-Tokens)
- [ ] **Step 3:** 4 Screenshots speichern: Startseite Desktop, Startseite Mobile, Content-Page, Dark-Mode
- [ ] **Step 4:** Abspeichern in `design-reference/` (Screenshots + `tokens.json` + `fonts.md`)

---

## Phase 1 — Projekt-Setup & Design-Foundation

### Task 1.1: Next.js Projekt initialisieren

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `.env.local.example`, `.gitignore`

- [ ] **Step 1:** Im Verzeichnis `/Users/sebastianlehmann/payments-kb` ausführen:
```bash
pnpm create next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --use-pnpm
```
- [ ] **Step 2:** Dependencies:
```bash
pnpm add drizzle-orm @neondatabase/serverless postgres next-auth @auth/drizzle-adapter @anthropic-ai/sdk openai zod react-markdown remark-gfm rehype-slug rehype-autolink-headings gray-matter
pnpm add -D drizzle-kit @types/node tsx
```
- [ ] **Step 3:** shadcn/ui init:
```bash
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button card input dialog dropdown-menu sheet table tabs badge separator skeleton sonner textarea
```
- [ ] **Step 4:** `.env.local.example` mit allen Keys anlegen:
```
DATABASE_URL=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
APP_PASSWORD_HASH=
```
- [ ] **Step 5:** Git init + commit:
```bash
git init && git add . && git commit -m "chore: bootstrap next.js project"
```

### Task 1.2: Design-Tokens übernehmen

**Files:**
- Modify: `tailwind.config.ts`, `app/globals.css`
- Create: `lib/theme/tokens.ts`

- [ ] **Step 1:** `tailwind.config.ts` — extrahierte Farben, Fonts, Spacing aus `design-reference/tokens.json` eintragen. Konkret: `theme.extend.colors`, `fontFamily`, `borderRadius`, `boxShadow`. Dark-Mode `class`.
- [ ] **Step 2:** `app/globals.css` — CSS-Variablen für Light + Dark aus den extrahierten Tokens übernehmen
- [ ] **Step 3:** Fonts via `next/font` in `app/layout.tsx` laden (Familien aus `design-reference/fonts.md`)
- [ ] **Step 4:** `lib/theme/tokens.ts` — Re-Export der Tokens für programmatische Nutzung (für Charts etc.)
- [ ] **Step 5:** Smoke-Test: `pnpm dev`, `/` rendert mit korrekten Fonts & Farben. Dark-Mode-Toggle (temporäre Button) funktioniert.
- [ ] **Step 6:** Commit: `feat(theme): adopt learning.norinit.de design tokens`

### Task 1.3: App-Shell Layout (Sidebar + Topbar)

**Files:**
- Create: `components/shell/app-shell.tsx`, `components/shell/sidebar.tsx`, `components/shell/topbar.tsx`, `components/shell/theme-toggle.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1:** `components/shell/sidebar.tsx` — Sektionen: Dashboard, Regulatorik, Formate, Clearing, IHB/POBO, Länder, Chat, Changelog. Aktiver Link hervorgehoben via `usePathname`.
- [ ] **Step 2:** `components/shell/topbar.tsx` — User-Avatar-Dropdown (Name, Email, Logout), Theme-Toggle, globaler Suche-Button.
- [ ] **Step 3:** `components/shell/theme-toggle.tsx` — `next-themes` Integration:
```bash
pnpm add next-themes
```
- [ ] **Step 4:** `app/layout.tsx` wrappt mit `<ThemeProvider>` + `<AppShell>`. AppShell prüft Auth und rendert Shell nur für eingeloggte User; anonyme sehen Login-Page.
- [ ] **Step 5:** Visuell gegen Screenshot aus `design-reference/` vergleichen. Abweichungen korrigieren.
- [ ] **Step 6:** Commit: `feat(shell): sidebar + topbar layout matching learning.norinit.de`

---

## Phase 2 — Database & Auth

### Task 2.1: Drizzle Schema

**Files:**
- Create: `db/schema.ts`, `db/client.ts`, `drizzle.config.ts`

- [ ] **Step 1:** `db/client.ts`:
```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```
- [ ] **Step 2:** `db/schema.ts` — Tables gemäß Spec: `users`, `documents`, `chunks` (mit `vector(1536)` via `customType`), `countries`, `chats`, `messages`. Dazu NextAuth Tables (`accounts`, `sessions`, `verificationTokens`).
- [ ] **Step 3:** `drizzle.config.ts`:
```ts
import type { Config } from 'drizzle-kit';
export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
```
- [ ] **Step 4:** pgvector Extension aktivieren (manuell oder als `sql` migration prefix):
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```
- [ ] **Step 5:** `pnpm drizzle-kit generate && pnpm drizzle-kit migrate`
- [ ] **Step 6:** Indexes als zusätzliche SQL-Migration: IVFFlat auf `chunks.embedding`, GIN auf `chunks.tsv`, B-Tree auf `documents.section` + `documents.slug`
- [ ] **Step 7:** Commit: `feat(db): schema and migrations`

### Task 2.2: NextAuth Credentials mit Shared Password

**Files:**
- Create: `auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `middleware.ts`, `app/login/page.tsx`

- [ ] **Step 1:** Dependencies: `pnpm add bcryptjs && pnpm add -D @types/bcryptjs`
- [ ] **Step 2:** `auth.ts` — NextAuth v5 mit Credentials Provider. Authorize-Callback: `bcrypt.compare(input.password, process.env.APP_PASSWORD_HASH)`. Keine User-Tabelle, Session nur `{ authenticated: true }`. `session.strategy = 'jwt'`, maxAge 30 Tage.
- [ ] **Step 3:** `app/api/auth/[...nextauth]/route.ts` — `export const { GET, POST } = handlers`
- [ ] **Step 4:** `middleware.ts` — redirectet alle Routes außer `/login`, `/api/auth/*` nach `/login` wenn kein JWT-Cookie.
- [ ] **Step 5:** `app/login/page.tsx` — Card mit Passwort-Feld + Submit. Fehlermeldung bei falsch. Design-System.
- [ ] **Step 6:** Script `scripts/hash-password.ts` für initialen Hash:
```ts
import bcrypt from 'bcryptjs';
console.log(bcrypt.hashSync(process.argv[2], 10));
```
- [ ] **Step 7:** Manuelles Testing: richtiges Passwort → Dashboard, falsches → Fehler.
- [ ] **Step 8:** Commit: `feat(auth): shared password via credentials provider`

### Task 2.3: API-Key Settings (verschlüsselte Cookies)

**Files:**
- Create: `lib/crypto/cookie-crypto.ts`, `lib/api-keys/get-keys.ts`, `app/settings/page.tsx`, `app/api/settings/keys/route.ts`, `components/settings/keys-form.tsx`

- [ ] **Step 1:** `lib/crypto/cookie-crypto.ts` — AES-256-GCM encrypt/decrypt mit Key abgeleitet aus `NEXTAUTH_SECRET` via scrypt. Funktionen `encrypt(plain): string` (base64 iv+ciphertext+tag), `decrypt(cipher): string`.
- [ ] **Step 2:** `app/api/settings/keys/route.ts` — `POST { anthropicKey, openaiKey }`, verschlüsselt und setzt httpOnly Cookies `ak_anth`, `ak_oai`, Secure+SameSite=Lax, maxAge 30d. `GET` returned `{ hasAnthropic: boolean, hasOpenai: boolean }` (ohne Keys selbst).
- [ ] **Step 3:** `lib/api-keys/get-keys.ts`:
```ts
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/crypto/cookie-crypto';
export async function getApiKeys() {
  const c = await cookies();
  const a = c.get('ak_anth')?.value;
  const o = c.get('ak_oai')?.value;
  if (!a || !o) throw new Error('API-Keys fehlen — bitte unter /settings eintragen');
  return { anthropic: decrypt(a), openai: decrypt(o) };
}
```
- [ ] **Step 4:** `components/settings/keys-form.tsx` — zwei Password-Inputs (Anthropic, OpenAI), Submit, Status "gespeichert ✓" wenn `hasAnthropic && hasOpenai`. Test-Button der `/api/settings/keys/test` aufruft (simpler Anthropic-Ping).
- [ ] **Step 5:** `app/settings/page.tsx` rendert die Form + Anleitung wo die Keys zu bekommen sind.
- [ ] **Step 6:** Middleware: wenn Keys fehlen und User ruft `/chat` oder `/admin` → redirect `/settings` mit `?reason=missing-keys`.
- [ ] **Step 7:** Commit: `feat(auth): per-session api key management via encrypted cookies`

---

## Phase 3 — Content Pipeline (MDs → DB)

### Task 3.1: MD-Dateien importieren

**Files:**
- Create: `content/gpdb_01_regulatorik.md` … `content/gpdb_05_italien.md` (aus `~/Downloads/` kopieren)

- [ ] **Step 1:**
```bash
mkdir -p content && cp ~/Downloads/gpdb_0*.md content/
```
- [ ] **Step 2:** Commit: `chore(content): import gpdb md files`

### Task 3.2: Chunking + Hashing

**Files:**
- Create: `lib/ingest/chunk.ts`, `lib/ingest/hash.ts`, `tests/ingest/chunk.test.ts`

- [ ] **Step 1:** `tests/ingest/chunk.test.ts` — Testfall: kleines MD-Fixture mit 2 H2-Blöcken wird zu 2 Chunks mit korrektem `heading`, `chunk_index`, `content`.
```ts
import { chunkMarkdown } from '@/lib/ingest/chunk';
test('splits by H2 headings and preserves heading', () => {
  const md = '# Title\n\n## First\nAlpha\n\n## Second\nBeta';
  const chunks = chunkMarkdown(md);
  expect(chunks).toHaveLength(2);
  expect(chunks[0].heading).toBe('First');
  expect(chunks[0].content).toContain('Alpha');
});
```
- [ ] **Step 2:** Vitest einrichten:
```bash
pnpm add -D vitest @vitejs/plugin-react
```
Root `vitest.config.ts` mit alias `@` → `./`.
- [ ] **Step 3:** Run `pnpm vitest run` — fails (function fehlt).
- [ ] **Step 4:** `lib/ingest/chunk.ts` implementieren: Split nach H2 (regex `/^##\s+/m`), wenn Block >1500 Zeichen zusätzlich nach H3 splitten. Leere Chunks filtern. Rückgabe `{ heading, chunk_index, content }[]`.
- [ ] **Step 5:** `lib/ingest/hash.ts`: `export const hash = (s: string) => crypto.createHash('sha256').update(s).digest('hex')`
- [ ] **Step 6:** `pnpm vitest run` — pass.
- [ ] **Step 7:** Commit: `feat(ingest): markdown chunking + hashing`

### Task 3.3: Embeddings Provider

**Files:**
- Create: `lib/ingest/embed.ts`, `tests/ingest/embed.test.ts`

- [ ] **Step 1:** Test (mocked):
```ts
// Mock OpenAI client, verify batching to 100 inputs per call
```
- [ ] **Step 2:** `lib/ingest/embed.ts` — nimmt `apiKey` als Parameter (aus `getApiKeys()`), kein Env-Fallback:
```ts
import OpenAI from 'openai';
export async function embed(texts: string[], apiKey: string): Promise<number[][]> {
  const client = new OpenAI({ apiKey });
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += 100) {
    const batch = texts.slice(i, i + 100);
    const res = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch,
    });
    out.push(...res.data.map(d => d.embedding));
  }
  return out;
}
```
- [ ] **Step 3:** Commit: `feat(ingest): openai embeddings`

### Task 3.4: Reindex-Script (idempotent)

**Files:**
- Create: `lib/ingest/reindex.ts`, `scripts/reindex-local.ts`

- [ ] **Step 1:** `lib/ingest/reindex.ts`:
  - Liest alle `content/gpdb_*.md`
  - Parst Frontmatter (`gray-matter`) falls vorhanden; `section` aus Dateiname ableiten (`gpdb_01_regulatorik.md` → `regulatorik`)
  - Splittet in Dokumente nach H1 (jedes H1 = 1 document) oder nimmt ganze Datei als 1 doc wenn keine H1
  - Hash vergleicht mit `documents.content_hash`; überspringt unveränderte
  - Für geänderte/neue: upsert `documents`, delete alte `chunks`, chunkMarkdown, embed, insert `chunks`
  - Return `{ inserted, updated, skipped, chunks_created }`
- [ ] **Step 2:** `scripts/reindex-local.ts` — CLI-Wrapper:
```ts
import { reindex } from '@/lib/ingest/reindex';
reindex().then(r => { console.log(r); process.exit(0); });
```
- [ ] **Step 3:** `pnpm tsx scripts/reindex-local.ts` — prüft: Anzahl Chunks > 0, Embeddings in DB.
- [ ] **Step 4:** 2. Lauf → alle `skipped`, keine neuen Chunks. Content-Änderung in einer MD → nur dieses Doc wird neu eingespielt.
- [ ] **Step 5:** Commit: `feat(ingest): idempotent reindex pipeline`

### Task 3.5: Country-Seeds

**Files:**
- Create: `content/countries.json`, `scripts/seed-countries.ts`

- [ ] **Step 1:** `content/countries.json` — Array mit 30 Einträgen aus `gpdb_04_ihb_komplexitaet.md` Matrix: `{code, name, complexity, summary}`. Werte aus MD extrahieren (Ampel = complexity).
- [ ] **Step 2:** `scripts/seed-countries.ts` — upsert in `countries`-Tabelle. Wenn Doc für Land existiert (Slug `country-<code>`), via `document_id` verknüpfen.
- [ ] **Step 3:** `pnpm tsx scripts/seed-countries.ts` — verifiziere 30 Rows.
- [ ] **Step 4:** Commit: `feat(ingest): seed 30 countries`

---

## Phase 4 — Dashboard

### Task 4.1: Country-Matrix-Component

**Files:**
- Create: `app/page.tsx`, `components/dashboard/country-matrix.tsx`, `components/dashboard/stats-row.tsx`, `components/dashboard/recent-updates.tsx`, `lib/queries/dashboard.ts`

- [ ] **Step 1:** `lib/queries/dashboard.ts`:
  - `getCountries()` → alle Countries
  - `getStats()` → counts aus `documents` + max `updated_at`
  - `getRecentUpdates(limit = 5)` → documents sorted by `updated_at desc`
- [ ] **Step 2:** `components/dashboard/country-matrix.tsx` — Grid (6 cols desktop, 3 tablet, 2 mobile) von Cards. Card zeigt: Flagge (emoji via `code`), Name, Ampel-Dot (grün/gelb/rot je `complexity`). Link → `/laender/<code>`.
- [ ] **Step 3:** `components/dashboard/stats-row.tsx` — 4 Stat-Cards (Regulatorik, Formate, Clearing, Länder).
- [ ] **Step 4:** `components/dashboard/recent-updates.tsx` — Liste der letzten 5 Updates mit Zeitstempel + Link.
- [ ] **Step 5:** `app/page.tsx` Server Component die alle drei Queries parallel zieht und rendert.
- [ ] **Step 6:** Visual-Check im Browser, Abgleich mit Design-Referenz.
- [ ] **Step 7:** Commit: `feat(dashboard): country matrix + stats + recent updates`

---

## Phase 5 — Browse

### Task 5.1: Sektion-Routes + Detail-Routes

**Files:**
- Create: `app/(browse)/[section]/page.tsx`, `app/(browse)/[section]/[slug]/page.tsx`, `app/laender/page.tsx`, `app/laender/[code]/page.tsx`, `components/browse/document-list.tsx`, `components/browse/markdown.tsx`, `lib/queries/documents.ts`

- [ ] **Step 1:** `lib/queries/documents.ts`:
  - `listDocuments(section)`
  - `getDocumentBySlug(slug)`
  - `listCountries()`, `getCountry(code)` (letzteres auch das verknüpfte Document)
- [ ] **Step 2:** `components/browse/markdown.tsx` — `react-markdown` + `remark-gfm` + `rehype-slug` + `rehype-autolink-headings`. Tailwind Prose + `prose-invert` im Dark-Mode. Custom Table-Renderer mit shadcn Table.
- [ ] **Step 3:** `[section]/page.tsx` — Liste der Docs in der Sektion, "Last Updated"-Badge.
- [ ] **Step 4:** `[section]/[slug]/page.tsx` — Rendert Document via `<Markdown>`. TOC aus H2/H3 Sidebar rechts.
- [ ] **Step 5:** `/laender` — nutzt Country-Matrix-Component wiederverwendet. `/laender/[code]` rendert verknüpftes Document.
- [ ] **Step 6:** Commit: `feat(browse): section + detail routes`

### Task 5.2: Volltext-Suche

**Files:**
- Create: `app/api/search/route.ts`, `components/search/search-dialog.tsx`
- Modify: `db/schema.ts` (tsv trigger)

- [ ] **Step 1:** SQL-Migration `0002_search.sql`:
```sql
ALTER TABLE chunks ADD COLUMN tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED;
CREATE INDEX chunks_tsv_idx ON chunks USING gin(tsv);
```
- [ ] **Step 2:** `app/api/search/route.ts` — `GET ?q=...` → postgres FTS query, joined zu `documents`, returned `[{doc_slug, doc_title, section, heading, snippet}]` (Top 20). `ts_headline` für Snippet.
- [ ] **Step 3:** `components/search/search-dialog.tsx` — Command-K Dialog (shadcn `Command`), debounced Fetch, Gruppierung nach Section, Klick → Navigate mit Anchor.
- [ ] **Step 4:** In `topbar.tsx` Suche-Button + `cmdk` Hotkey.
- [ ] **Step 5:** Commit: `feat(search): postgres fts + command-k dialog`

---

## Phase 6 — KI-Chat (RAG)

### Task 6.1: RAG-Retrieval

**Files:**
- Create: `lib/chat/retrieve.ts`, `tests/chat/retrieve.test.ts`

- [ ] **Step 1:** Test (Integration, mit lokaler DB): seed 1 Doc+Chunks, query, erwarte den Chunk in Top-K.
- [ ] **Step 2:** `lib/chat/retrieve.ts`:
```ts
export async function retrieve(query: string, k = 8) {
  const [qEmbed] = await embed([query]);
  const rows = await db.execute(sql`
    SELECT c.id, c.content, c.heading, d.slug, d.title, d.section,
      1 - (c.embedding <=> ${qEmbed}::vector) AS score
    FROM chunks c JOIN documents d ON d.id = c.document_id
    ORDER BY c.embedding <=> ${qEmbed}::vector
    LIMIT ${k}
  `);
  return rows.rows;
}
```
- [ ] **Step 3:** Test läuft grün.
- [ ] **Step 4:** Commit: `feat(chat): pgvector retrieval`

### Task 6.2: Chat-API mit Claude + Streaming

**Files:**
- Create: `app/api/chat/route.ts`, `lib/chat/prompt.ts`

- [ ] **Step 1:** `lib/chat/prompt.ts` — System-Prompt (deutsch):
```
Du bist Assistent für die Global Payments Wissensdatenbank.
Antworte NUR basierend auf den bereitgestellten Quellen.
Wenn Quellen keine Antwort enthalten, sage explizit "Keine Quelle in der Datenbank".
Zitiere Quellen als [doc_slug#heading].
```
- [ ] **Step 2:** `app/api/chat/route.ts`:
  - `POST { chatId, message }` → auth check
  - Message speichern (role=user)
  - `retrieve(message, 8)`
  - Claude call mit `system` als Prompt-Cache (ephemeral cache control auf System + Quellen-Block), stream response
  - On finish: assistant-Message mit `sources: [{chunk_id, doc_slug, heading}]` speichern
  - Return SSE Stream
- [ ] **Step 3:** Env-Check + Test: curl sendet Frage, bekommt Stream.
- [ ] **Step 4:** Commit: `feat(chat): claude streaming api with rag`

### Task 6.3: Chat-UI

**Files:**
- Create: `app/chat/page.tsx`, `app/chat/[id]/page.tsx`, `components/chat/chat-view.tsx`, `components/chat/chat-list.tsx`, `components/chat/message-bubble.tsx`, `components/chat/source-pills.tsx`, `lib/queries/chats.ts`, `app/api/chats/route.ts`, `app/api/chats/[id]/route.ts`

- [ ] **Step 1:** `lib/queries/chats.ts` — CRUD: list, create, rename, delete, listMessages.
- [ ] **Step 2:** API-Routes `/api/chats` (GET list, POST create), `/api/chats/[id]` (PATCH rename, DELETE).
- [ ] **Step 3:** `components/chat/chat-list.tsx` — Sidebar-Liste aller Chats mit Rename/Delete Kontextmenü. "Neuer Chat"-Button.
- [ ] **Step 4:** `components/chat/message-bubble.tsx` — Markdown-Render, User rechts, Assistant links, Source-Pills unten.
- [ ] **Step 5:** `components/chat/source-pills.tsx` — kleine Badges mit Heading, Link zu `/[section]/[slug]#heading`.
- [ ] **Step 6:** `components/chat/chat-view.tsx` — Messages-Stream, Input mit Enter-to-Send, Shift+Enter Newline, Loading-State während Stream.
- [ ] **Step 7:** `app/chat/[id]/page.tsx` rendert ChatView, `app/chat/page.tsx` redirectet auf letzten Chat oder erstellt neuen.
- [ ] **Step 8:** Manuelles E2E: Login → neue Chat → Frage "Was ist PSD3?" → streamt + Sources.
- [ ] **Step 9:** Commit: `feat(chat): full chat ui with history and sources`

---

## Phase 7 — Admin & Changelog

### Task 7.1: Admin-Reindex-Button

**Files:**
- Create: `app/admin/page.tsx`, `app/api/admin/reindex/route.ts`

- [ ] **Step 1:** `app/api/admin/reindex/route.ts` — `POST` prüft auth session, führt `reindex()` aus, returned Stats-JSON.
- [ ] **Step 2:** `app/admin/page.tsx` — Button "Reindex Content", zeigt Ergebnis. Auth-geschützt via middleware.
- [ ] **Step 3:** Manuelles Testing: eingeloggt → Reindex läuft, ausgeloggt → Redirect zu /login.
- [ ] **Step 4:** Commit: `feat(admin): reindex button`

### Task 7.2: Changelog

**Files:**
- Create: `app/changelog/page.tsx`, `lib/queries/changelog.ts`

- [ ] **Step 1:** `lib/queries/changelog.ts`: Documents sortiert nach `updated_at desc`, gruppiert nach Monat.
- [ ] **Step 2:** `app/changelog/page.tsx` — Timeline-Layout, je Monat ein Block mit geänderten Docs.
- [ ] **Step 3:** Commit: `feat(changelog): monthly timeline`

---

## Phase 8 — Deployment

### Task 8.1: Vercel Deploy

- [ ] **Step 1:** Vercel Projekt an Repo binden, Env-Vars aus `.env.local` setzen (inkl. Prod-`NEXTAUTH_URL=https://gpdb.norinit.de`)
- [ ] **Step 2:** Google OAuth: Redirect URI `https://gpdb.norinit.de/api/auth/callback/google` ergänzen
- [ ] **Step 3:** Custom Domain `gpdb.norinit.de` in Vercel, DNS CNAME setzen
- [ ] **Step 4:** `noindex`-Meta + `robots.txt` (`Disallow: /`)
- [ ] **Step 5:** Deploy, erster Reindex via `/admin` durchführen
- [ ] **Step 6:** Smoke-Test: Login, Dashboard, Browse, Chat, Search, Changelog

### Task 8.2: README

**Files:**
- Create: `README.md`

- [ ] **Step 1:** Knapp: Setup, Env-Vars, Content-Update-Workflow (MD editieren → push → /admin Reindex).
- [ ] **Step 2:** Commit: `docs: readme`

---

## Akzeptanzkriterien

- [ ] Nur whitelisted Emails können einloggen
- [ ] Dashboard zeigt 30 Länder mit Ampel + Stats + Recent Updates
- [ ] Browse in 5 Sektionen + Volltextsuche Cmd-K funktioniert
- [ ] Chat streamt Claude-Antworten mit klickbaren Source-Pills
- [ ] Admin-Reindex läuft idempotent, zweiter Lauf ohne Änderung = 0 neue Chunks
- [ ] Design optisch deckungsgleich mit `learning.norinit.de` (Farben, Fonts, Spacing)
- [ ] Deploy auf `gpdb.norinit.de` mit `noindex`
