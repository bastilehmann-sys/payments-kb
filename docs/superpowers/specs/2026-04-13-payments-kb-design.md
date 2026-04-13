# Global Payments Knowledge Base (payments-kb) — Design

**Datum:** 2026-04-13
**Autor:** Sebastian Lehmann
**Status:** Approved for implementation planning

## Zweck

Internes Nachschlagewerk für Global Payments Regulatorik, Formate, Clearing und Länderprofile. Nutzerkreis: Sebastian + ein Kollege. Kein öffentlicher Zugang, kein Marketing, keine Tiers.

Quelle der Inhalte: die fünf MD-Dateien `gpdb_01_regulatorik.md` bis `gpdb_05_italien.md` (~250 KB, ca. 30 Länder, feldgenaue Format-Doku, Regulatorik-Glossar, IHB/POBO-Matrix). Updates monatlich.

## Deployment

- **Domain:** interne Subdomain (Vorschlag: `gpdb.norinit.de`), nicht verlinkt, nicht indexiert (`robots: noindex`)
- **Host:** Vercel
- **Environment:** ein einzelnes Production-Environment reicht

## Tech-Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind + shadcn/ui
- Drizzle ORM
- Neon Postgres mit `pgvector`
- NextAuth.js Credentials Provider mit Shared Password
- Anthropic SDK (Claude Sonnet 4.6) mit Prompt-Caching
- Embeddings: `text-embedding-3-small` via OpenAI (1536 dim)

## Design-System

Identisch zu `learning.norinit.de`:
- Farben, Typographie, Spacing, Dark/Light-Toggle
- Komponentenstil (Cards, Tables, Navigation, Buttons)
- Layout-Patterns (Sidebar + Content, Breadcrumbs)

Vor Implementierung: Screenshots von `learning.norinit.de` einholen und Tailwind-Config/Design-Tokens extrahieren.

**Struktur-Entscheidung (YAGNI-bewusst):** UI-Primitives in `components/ui/` und Theme-Tokens in `lib/theme/` separat halten, damit eine spätere zweite Subdomain dasselbe Design ohne Kopieren übernehmen kann. Multi-Tenancy jetzt NICHT bauen — Entscheidung (A separates Repo, B Multi-Tenant-Monorepo) wird getroffen, wenn die zweite Subdomain konkret wird.

## Module

### 1. Dashboard (Startseite `/`)

- Länder-Komplexitäts-Matrix: 30 Länder als Grid-Cards mit Ampel-Farbe (grün/gelb/rot) basierend auf IHB/POBO/COBO-Komplexität
- Klick → Country-Profile-Page
- Quick-Stats-Zeile oben: Anzahl Formate, Regulatorik-Einträge, letzte Änderung
- Recent Updates (letzte 5 Änderungen aus `documents.updated_at`)

### 2. Browse

Sektionen als Top-Level-Nav:
- Regulatorik
- Formate
- Clearing & Zahlungsarten
- IHB/POBO/COBO
- Länder

Features:
- Volltextsuche über Postgres FTS (`tsvector` auf `chunks.content`)
- Filter nach Sektion
- Markdown-Renderer mit Anker-Links (h2/h3)
- "Last Updated"-Badge pro Dokument
- Feldgenaue Tabellen-Ansicht für pain/camt/MT (aus MD geparst)

### 3. KI-Chat (`/chat`)

- Claude Sonnet 4.6 via Anthropic SDK
- RAG: User-Frage → Embedding → pgvector cosine similarity → Top-8 Chunks → Claude-Call mit System-Prompt + Kontext
- Prompt-Caching auf System-Prompt + abgerufene Chunks
- Quellen-Zitate: jede Antwort listet Source-Chunks mit Deep-Link in Browse-View
- Chat-History persistiert pro User in Neon
- Chat-Liste in Sidebar, Neue-Chat-Button, Rename, Delete

### Content-Update-Workflow

Monatliche Updates via Git + manueller Reindex:

1. MD-Dateien liegen im Repo unter `content/`
2. Sebastian editiert MDs direkt (lokal oder GitHub Web UI)
3. Push zu `main` → Vercel-Deploy
4. Admin-Button "Reindex Content" (nur für Sebastian, geschützt via Email-Check) auf `/admin`:
   - Liest alle MDs aus `content/`
   - Chunkt nach H2/H3-Sections
   - Generiert Embeddings für neue/geänderte Chunks (Hash-Vergleich)
   - Upsert in `documents` + `chunks`
5. Changelog-Page `/changelog` zeigt neue/geänderte Dokumente chronologisch (aus `documents.updated_at`)

Alternative (später, falls gewünscht): Reindex automatisch via Vercel Deploy Hook.

## Datenmodell

```sql
documents (
  id uuid PK,
  source_file text,        -- 'gpdb_01_regulatorik.md'
  section text,            -- 'regulatorik' | 'formate' | 'clearing' | 'ihb' | 'laender'
  slug text unique,        -- 'psd3-uebersicht'
  title text,
  content_md text,
  content_hash text,       -- für Reindex-Diff
  updated_at timestamptz,
  created_at timestamptz
)

chunks (
  id uuid PK,
  document_id uuid FK → documents,
  chunk_index int,
  content text,
  embedding vector(1536),
  heading text,            -- nächste H2/H3 darüber, für Source-Links
  tsv tsvector,            -- für FTS
  metadata jsonb
)

countries (
  id uuid PK,
  code text unique,        -- 'IT', 'DE', 'FR'
  name text,
  complexity text,         -- 'low' | 'medium' | 'high' (Ampel)
  summary text,
  document_id uuid FK → documents  -- Link auf Country-Profile-Doc
)

chats (
  id uuid PK,
  title text,
  created_at timestamptz,
  updated_at timestamptz
)

messages (
  id uuid PK,
  chat_id uuid FK → chats,
  role text,               -- 'user' | 'assistant'
  content text,
  sources jsonb,           -- [{document_id, chunk_id, heading}]
  created_at timestamptz
)
```

Indexes:
- `chunks.embedding` IVFFlat cosine
- `chunks.tsv` GIN
- `documents.section`, `documents.slug`

## Auth-Details

- NextAuth Credentials Provider
- Shared Password in Env-Var `APP_PASSWORD_HASH` (bcrypt-Hash)
- Login-Page: nur Passwort-Feld, kein Email
- Session via Cookie, 30 Tage
- Admin-Funktionen (Reindex) nicht per User unterschieden — alle eingeloggten Nutzer können reindizieren
- Chat-History global geteilt zwischen beiden Nutzern (keine User-Tabelle)

## API-Keys (per Session)

- Anthropic + OpenAI Keys sind NICHT in Env-Vars (nicht in Vercel Settings, nicht committed)
- Nach Login: `/settings` Page fordert beide Keys an
- Keys werden AES-verschlüsselt (via `NEXTAUTH_SECRET`-abgeleitetem Key) in httpOnly Cookies gespeichert
- Server liest Cookies bei jedem Chat/Embed/Reindex-Call und entschlüsselt
- Cookie-Ablauf = Session-Ablauf (30 Tage)
- Chat/Reindex schlagen fehl mit "API-Keys fehlen — bitte unter /settings eintragen" wenn Cookies leer

## Error-Handling & Edge Cases

- Reindex-Job läuft idempotent: Hash-Vergleich überspringt unveränderte Chunks
- Chat ohne Retrieval-Treffer: Claude antwortet explizit "keine Quelle gefunden" statt zu halluzinieren (System-Prompt-Anweisung)
- Rate-Limiting auf Chat-Endpoint nicht nötig (interne Nutzung)

## Testing

- Drizzle Migrations gegen lokale Neon-Branch testen
- Chunking + Embedding-Pipeline mit kleinem Fixture-MD-File verifizieren
- Manueller Smoke-Test nach Deploy: Login → Dashboard → Browse → Chat mit Test-Query

## Nicht enthalten (explizit out of scope)

- Öffentliche Landing-Page / Marketing
- SEO / Sitemap
- Multi-Tenant / Organisationen
- Tiers / Billing
- Mobile-App
- Admin-UI zum Editieren von MDs (Editing läuft über Git)
- Zweite Subdomain (wird später als separate Entscheidung behandelt)

## Offene Punkte vor Implementation

- Finaler Projekt- und Subdomain-Name (Default: `gpdb.norinit.de`)
- Screenshots/Tokens von `learning.norinit.de` extrahieren
- Embeddings-Provider fix entscheiden (OpenAI `text-embedding-3-small` vs. Voyage)
