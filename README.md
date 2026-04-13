# Payments KB

Internes Nachschlagewerk für Global Payments (Regulatorik, Formate, Clearing, IHB/POBO, Länderprofile).

## Local Setup

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Configuration

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in required variables:
- `DATABASE_URL` — Neon Postgres connection string
- `NEXTAUTH_SECRET` — Generate with: `openssl rand -base64 32`
- `APP_PASSWORD_HASH` — Generate with: `pnpm tsx scripts/hash-password.ts 'YourPassword!'`

**Note:** Values containing `$` in `APP_PASSWORD_HASH` must be escaped as `\$` in `.env.local` (Next.js 16 @next/env interpolation).

### Database Setup

First-time setup applies migrations and seeds data:

```bash
pnpm db:setup
pnpm db:seed:countries
```

### Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

## API Keys

API keys (Anthropic, OpenAI) are **NOT** stored in environment variables. Users enter them via `/settings` after login.

## Content Updates

1. Edit markdown files in `content/`
2. Push to main → Vercel auto-deploys
3. After deploy: login → `/admin` → click "Inhalte neu indizieren"

## Available Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Run production server
- `pnpm test` — Run tests (Vitest)
- `pnpm db:setup` — Initialize database (first-time only)
- `pnpm db:generate` — Generate Drizzle schema
- `pnpm db:migrate` — Apply pending migrations
- `pnpm db:reindex` — Rebuild vector embeddings
- `pnpm db:seed:countries` — Seed country data
- `pnpm db:studio` — Open Drizzle Studio GUI

## Tech Stack

- **Framework:** Next.js 16
- **Database:** Neon Postgres with pgvector
- **ORM:** Drizzle
- **Auth:** NextAuth v5
- **AI:** Anthropic Claude, OpenAI embeddings
- **UI:** shadcn/ui + Tailwind CSS

## Deployment

Deployed at `gpdb.norinit.de` (Vercel subdomain). `noindex` directive applied — internal use only.

## Notes

For breaking changes and API updates in Next.js 16, see `AGENTS.md`.
