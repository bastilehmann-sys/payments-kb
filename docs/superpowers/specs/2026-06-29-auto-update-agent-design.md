# GPDB Auto-Update Agent — Design

**Datum:** 2026-06-29  
**Autor:** Sebastian Lehmann  
**Status:** Approved for implementation planning

## Zweck

Wöchentlicher Claude Code Scheduled Agent, der autonom neue Payments-Inhalte recherchiert, Proposals erstellt und Sebastian zur Review vorlegt. Erst nach Freigabe wird die DB aktualisiert.

## Gesamtarchitektur

Zwei klar getrennte Phasen:

**Phase 1 — Agent (autonom):** Recherche + Proposal-Erstellung  
**Phase 2 — App (Sebastian im Loop):** Review, Feedback, Revision, Execution

```
Wöchentlich (Mo 08:00)
  Claude Code Scheduled Agent
  ├── GET /api/admin/content-summary  (aktueller DB-Stand)
  ├── Scannt feste Quellen + Web Search
  ├── Selektiert 5-8 Themen
  ├── POST /api/admin/proposals        (Batch in DB schreiben)
  └── POST /api/admin/notify-email     (E-Mail an Sebastian)

gpdb.norinit.de/admin/proposals
  ├── Review pro Item (Quellen, Begründung, Outline)
  ├── Kommentare → [Revision anfragen] → Claude API überarbeitet
  ├── Approve/Reject pro Item
  └── [Approved ausführen] → Execution Pipeline

Execution Pipeline (Next.js API Route)
  ├── Claude generiert MD-Content pro Item
  ├── Zeigt generierten Content zur Sichtprüfung
  └── Nach Bestätigung: MD-Update + Reindex (Embedding + pgvector)
```

## Scheduled Agent

### Trigger
- Wöchentlich, Montag 08:00
- Claude Code Scheduled Routine (schedule Skill)

### Recherche-Quellen

**Feste Quellen (immer gescannt):**
- EPC — `europeanpaymentscouncil.eu` (SEPA Rulebooks, Instant Payments Updates)
- BIS — Quarterly Reviews, CPMI Reports
- SWIFT — Standards Releases, MT→MX Migration Updates
- Bundesbank — Zahlungsverkehr-Nachrichten
- Nationale Zentralbanken und Regulatoren der Länder in der DB

**Web Search (für Lücken):**
- Gezielt auf Payments-Regulatorik, ISO 20022, SEPA, neue Zahlungssysteme
- Neue Länder/Märkte die noch nicht in der DB sind

### Agent-Ablauf
1. `GET /api/admin/content-summary` → aktueller DB-Stand (alle Länder, Sektionen, letztes Update)
2. Feste Quellen auf Neuigkeiten der letzten 7 Tage prüfen
3. Web Search für Lücken und neue Länder
4. Vergleich: Was fehlt in der DB? Was ist veraltet?
5. 5–8 Proposals formulieren (bestehende Updates + ggf. neue Länder)
6. `POST /api/admin/proposals` mit Batch
7. `POST /api/admin/notify-email` → Benachrichtigung

### Agent-Kontext (im Prompt)
- Aktueller DB-Stand aus content-summary
- Namen und Themenbereiche der MD-Dateien
- API-Key (Env-Variable `AGENT_API_KEY`)
- Aktuelle Kalenderwoche

## Datenbank-Schema

Zwei neue Tabellen (Drizzle Migration):

```sql
proposals (
  id          uuid primary key default gen_random_uuid(),
  week_date   date not null,
  status      text not null default 'draft',  -- draft | revision_requested | executed
  created_at  timestamp default now()
)

proposal_items (
  id              uuid primary key default gen_random_uuid(),
  proposal_id     uuid references proposals(id),
  topic           text not null,
  target_file     text not null,      -- "gpdb_01_regulatorik.md" oder "new"
  target_section  text,
  reasoning       text not null,
  sources         jsonb not null,     -- [{title, url, date}]
  content_outline text not null,
  comment         text,               -- Sebastians Feedback
  generated_content text,             -- Claude-generierter MD nach Execution
  status          text not null default 'pending',  -- pending | approved | rejected | executed
  revised_at      timestamp,
  executed_at     timestamp
)
```

## API Endpoints

Alle Admin-Endpoints sind API-Key-geschützt (`Authorization: Bearer ${AGENT_API_KEY}`), zusätzlich NextAuth für Browser-Zugriff.

| Endpoint | Methode | Zweck |
|---|---|---|
| `/api/admin/content-summary` | GET | Aktueller DB-Stand für Agent |
| `/api/admin/proposals` | POST | Neuen Proposal-Batch anlegen |
| `/api/admin/notify-email` | POST | E-Mail-Benachrichtigung senden |
| `/api/admin/proposals/[id]/revise` | POST | Claude überarbeitet kommentierte Items |
| `/api/admin/proposals/[id]/execute` | POST | Content generieren + zur Sichtprüfung stellen |
| `/api/admin/proposals/[id]/confirm` | POST | Reindex bestätigen (MD-Update + Embedding) |

## Admin Dashboard (`/admin/proposals`)

NextAuth-geschützt (nur deine E-Mail-Whitelist).

**Pro Proposal-Batch (gruppiert nach KW):**
- Batch-Header: KW, Datum, Anzahl Items, Status
- Pro Item:
  - Thema + Ziel-Abschnitt (welche MD-Datei, welche Sektion)
  - Quellen (klickbar, mit Datum)
  - Begründung (warum relevant, was fehlt)
  - Content-Outline (grobe Gliederung)
  - Kommentarfeld (freier Text)
  - Approve / Reject Toggle
- Aktionen:
  - `[Revision anfragen]` — überarbeitet alle Items mit Kommentar
  - `[Approved ausführen]` — startet Execution für alle approved Items

**Nach Execution:** Dashboard zeigt generierten MD-Content pro Item zur Sichtprüfung. Erst nach `[Reindex bestätigen]` wird die DB aktualisiert.

## E-Mail-Benachrichtigung

- **Betreff:** `GPDB KW 27: 7 neue Themen zur Review`
- **Inhalt:** Liste der Themen mit Kurzbegründung (je 1-2 Sätze)
- **CTA:** Link direkt zu `/admin/proposals`
- **Versand:** Resend (`resend` npm package, neu zu installieren)

## Feedback-Revision Loop

1. Sebastian schreibt Kommentare auf einzelne Items (z.B. "Nicht Australien, lieber Kanada")
2. Klickt `[Revision anfragen]`
3. API Route: `POST /api/admin/proposals/[id]/revise`
   - Schickt kommentierte Items + Kommentare an Claude API
   - Claude überarbeitet nur die Items mit Kommentar
   - DB wird mit überarbeiteten Proposals aktualisiert
4. Dashboard aktualisiert sich — Sebastian gibt frei

## Execution Pipeline

`POST /api/admin/proposals/[id]/execute` pro approved Item:

1. **Content-Generierung:** Claude API Call
   - System-Prompt: Payments-Experte, strukturiertes Markdown
   - Input: topic + outline + sources + bestehender MD-Abschnitt (falls Update)
   - Output: neuer/erweiterter MD-Block

2. **Sichtprüfung:** Generierter Content wird im Dashboard angezeigt — Sebastian kann ablehnen oder direkt bestätigen

3. **Bestätigung (`POST /api/admin/proposals/[id]/confirm`):**
   - MD-Datei wird aktualisiert (Sektion ersetzt bei Update, neue Datei bei neuem Land)
   - Chunks aus geändertem Abschnitt neu erstellen
   - Embeddings generieren (`text-embedding-3-small`)
   - pgvector Update in Neon
   - `proposal_items.status` → `executed`
   - `proposal_items.executed_at` setzen

4. **Git:** Kein automatischer Commit — Sebastian committet die MD-Änderungen manuell.

## Umgebungsvariablen (neu)

```
AGENT_API_KEY=          # Secret für Agent → App API Calls
RESEND_API_KEY=         # E-Mail-Versand via Resend (neu einrichten)
NOTIFICATION_EMAIL=     # sebastian@... (Empfänger der Proposals-Mail)
```

## Out of Scope

- Automatische Git Commits
- Multi-User Approval (nur Sebastian)
- Mehrsprachige Content-Generierung
- Rollback von ausgeführten Proposals
