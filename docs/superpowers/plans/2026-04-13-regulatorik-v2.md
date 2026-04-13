# Regulatorik v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Regulatorik-Bereich auf 34 Einträge erweitern, Schema um 5 Felder ergänzen, Management Summaries der 13 Bestands-Einträge überarbeiten.

**Architecture:** Drizzle-Migration fügt 5 nullable text-Spalten hinzu. UI liest diese via bestehendem `SplitView` in 3 neuen Sektionen. Content wird als YAML-Frontmatter-Markdowns in `content/expansion/regulatorik/` gepflegt. Seed-Script extendiert die existierende `seed-regulatorik-expansion.ts`-Logik mit Whitelist-basiertem Upsert (Bestand: nur neue Felder + Summary; Neu: Full insert).

**Tech Stack:** Next.js (custom fork — `AGENTS.md` beachten), Drizzle ORM, Postgres (Neon), `gray-matter`, `tsx`, `pnpm`. Env via `.env.local` laden mit `set -a && . ./.env.local && set +a` oder `DOTENV_CONFIG_PATH=.env.local`.

**Spec:** `docs/superpowers/specs/2026-04-13-regulatorik-v2-design.md`

---

## File Structure Overview

**Create:**
- `db/migrations/0009_regulatorik_v2.sql` — DDL für 5 neue Spalten + Unique-Index
- `content/expansion/regulatorik/_summaries-rewrite.md` — neue `beschreibung_einsteiger` für 13 Bestandseinträge
- `content/expansion/regulatorik/_addon-fields.md` — 5 neue Feldwerte für 13 Bestandseinträge
- `content/expansion/regulatorik/{zag,kwg,gwg,awv-awg,marisk,ao-146a,mifid-2,crr-crd,eba-sca-rts,eu-sanktionen,ofac,dual-use-vo,fatca,crs,dac7-dac8,pci-dss,eidas-2,nis2,ch-finfrag,uk-psr,us-ucc-4a}.md` — 21 Deep-Dives
- `scripts/seed-regulatorik-v2.ts` — neuer Seed
- `scripts/query-regulatorik.ts` — bereits vorhanden aus Brainstorming

**Modify:**
- `db/schema.ts` — 5 Spalten in `regulatorikEntries`
- `lib/queries/entries.ts` — `getRegulatorikEntries` select erweitern
- `app/(fullscreen)/regulatorik/page.tsx` — `COLUMNS` erweitern

---

## Phase 1: Schema & Migration

### Task 1: SQL-Migration schreiben

**Files:**
- Create: `db/migrations/0009_regulatorik_v2.sql`

- [ ] **Step 1: Datei anlegen**

```sql
-- Regulatorik v2: 5 neue Felder + Unique-Index auf kuerzel
ALTER TABLE regulatorik_entries
  ADD COLUMN IF NOT EXISTS verwandte_regulierungen text,
  ADD COLUMN IF NOT EXISTS sap_bezug text,
  ADD COLUMN IF NOT EXISTS bussgeld text,
  ADD COLUMN IF NOT EXISTS pruefpflicht text,
  ADD COLUMN IF NOT EXISTS aufwand_tshirt text;

CREATE UNIQUE INDEX IF NOT EXISTS regulatorik_entries_kuerzel_uniq
  ON regulatorik_entries (kuerzel)
  WHERE kuerzel IS NOT NULL;
```

- [ ] **Step 2: Migration ausführen**

```bash
cd ~/payments-kb
set -a && . ./.env.local && set +a
psql "$DATABASE_URL" -f db/migrations/0009_regulatorik_v2.sql
```

Expected: 1× `ALTER TABLE`, 1× `CREATE INDEX`, keine Errors.

- [ ] **Step 3: Verifizieren**

```bash
psql "$DATABASE_URL" -c "\d regulatorik_entries" | grep -E "verwandte|sap_bezug|bussgeld|pruefpflicht|aufwand"
```

Expected: 5 neue Spalten listed als `text`, alle nullable.

- [ ] **Step 4: Commit**

```bash
git add db/migrations/0009_regulatorik_v2.sql
git commit -m "feat(regulatorik): migration adds 5 v2 fields + kuerzel unique index"
```

### Task 2: Drizzle-Schema erweitern

**Files:**
- Modify: `db/schema.ts` (regulatorikEntries-Block, zwischen `risiken_einsteiger` und `source_row`)

- [ ] **Step 1: Felder ergänzen**

Vor der Zeile `source_row: integer('source_row'),` einfügen:

```ts
  verwandte_regulierungen: text('verwandte_regulierungen'),
  sap_bezug: text('sap_bezug'),
  bussgeld: text('bussgeld'),
  pruefpflicht: text('pruefpflicht'),
  aufwand_tshirt: text('aufwand_tshirt'),
```

- [ ] **Step 2: Type-Check**

```bash
cd ~/payments-kb && pnpm tsc --noEmit
```

Expected: PASS (keine neuen TS-Errors).

- [ ] **Step 3: Commit**

```bash
git add db/schema.ts
git commit -m "feat(regulatorik): schema.ts adds 5 v2 fields"
```

---

## Phase 2: Query + UI

### Task 3: `getRegulatorikEntries` erweitern

**Files:**
- Modify: `lib/queries/entries.ts` (Funktion `getRegulatorikEntries`)

- [ ] **Step 1: Select-Shape ergänzen**

In `getRegulatorikEntries`, den `select`-Aufruf um die 5 neuen Felder erweitern. Exakter Pattern ist das gleiche wie bei den anderen Feldern dort — Schema ist Single-Source.

Prüfen mit:

```bash
cd ~/payments-kb && grep -n "risiken_einsteiger\|source_row" lib/queries/entries.ts
```

Jeweils analog die 5 Felder einfügen: `verwandte_regulierungen`, `sap_bezug`, `bussgeld`, `pruefpflicht`, `aufwand_tshirt`.

- [ ] **Step 2: Type-Check**

```bash
pnpm tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/queries/entries.ts
git commit -m "feat(regulatorik): query selects 5 v2 fields"
```

### Task 4: UI-Columns ergänzen

**Files:**
- Modify: `app/(fullscreen)/regulatorik/page.tsx` (COLUMNS-Array, Ende der Risiken-Sektion)

- [ ] **Step 1: 5 neue Column-Einträge hinzufügen**

Nach dem letzten bestehenden Eintrag (`risiken_einsteiger`) und vor dem schließenden `];` einfügen:

```ts
  // Querverweise
  { key: 'verwandte_regulierungen', label: 'Verwandte Regulierungen', section: 'Querverweise' },
  // Compliance-Folgen
  { key: 'bussgeld',     label: 'Bußgeld / Sanktionshöhe',         section: 'Compliance-Folgen' },
  { key: 'pruefpflicht', label: 'Prüfpflicht / Audit-Relevanz',    section: 'Compliance-Folgen' },
  // SAP & System
  { key: 'sap_bezug', label: 'SAP-Bezug / System-Auswirkung', section: 'SAP & System' },
  // Umsetzung
  { key: 'aufwand_tshirt', label: 'Implementierungsaufwand (T-Shirt)', section: 'Umsetzung' },
```

- [ ] **Step 2: Dev-Server starten und prüfen**

```bash
cd ~/payments-kb && pnpm dev
```

Browser: `http://localhost:3000/regulatorik` → ein Eintrag öffnen → die 4 neuen Sektionen (Querverweise, Compliance-Folgen, SAP & System, Umsetzung) sollen sichtbar sein (mit leeren Werten, weil DB noch nicht befüllt).

- [ ] **Step 3: Commit**

```bash
git add 'app/(fullscreen)/regulatorik/page.tsx'
git commit -m "feat(regulatorik): UI shows 5 v2 fields in 4 new sections"
```

---

## Phase 3: Seed-Infrastruktur

### Task 5: Seed-Script v2 schreiben

**Files:**
- Create: `scripts/seed-regulatorik-v2.ts`

Orientiert sich an `scripts/seed-regulatorik-expansion.ts` (bereits existierend — unbedingt zuerst lesen).

- [ ] **Step 1: Grundgerüst anlegen**

```ts
/**
 * Seed regulatorik v2
 *
 * Drei Input-Quellen:
 *  1. content/expansion/regulatorik/*.md          — Deep-Dive-Files (21 neue + ggf. Bestand)
 *  2. content/expansion/regulatorik/_summaries-rewrite.md — rewritten beschreibung_einsteiger für 13 Bestands-Einträge
 *  3. content/expansion/regulatorik/_addon-fields.md      — 5 v2-Feldwerte für 13 Bestands-Einträge
 *
 * Upsert-Logik:
 *  - Bestand (kuerzel existiert in DB): UPDATE NUR auf Whitelist
 *     { beschreibung_einsteiger, verwandte_regulierungen, sap_bezug, bussgeld, pruefpflicht, aufwand_tshirt }
 *  - Neu (kuerzel existiert nicht): INSERT mit allen gelieferten Feldern, source_row = MAX+1
 *
 * Flags:
 *   --dry-run   Plant Changes, schreibt nichts
 *
 * Run:
 *   DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-v2.ts [--dry-run]
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
const envPath = process.env.DOTENV_CONFIG_PATH
  ? path.resolve(process.env.DOTENV_CONFIG_PATH)
  : path.join(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import fs from 'node:fs';
import matter from 'gray-matter';
import { db } from '@/db/client';
import { regulatorikEntries } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const DRY_RUN = process.argv.includes('--dry-run');
const BASE = path.join(process.cwd(), 'content/expansion/regulatorik');

const V2_FIELDS = [
  'verwandte_regulierungen',
  'sap_bezug',
  'bussgeld',
  'pruefpflicht',
  'aufwand_tshirt',
] as const;

const BESTAND_WHITELIST = [
  'beschreibung_einsteiger',
  ...V2_FIELDS,
] as const;

const ALL_FIELDS = [
  'kuerzel', 'name', 'kategorie', 'typ',
  'beschreibung_experte', 'beschreibung_einsteiger',
  'geltungsbereich', 'status_version', 'in_kraft_seit', 'naechste_aenderung',
  'behoerde_link', 'betroffene_abteilungen',
  'auswirkungen_experte', 'auswirkungen_einsteiger',
  'pflichtmassnahmen_experte', 'pflichtmassnahmen_einsteiger',
  'best_practice_experte', 'best_practice_einsteiger',
  'risiken_experte', 'risiken_einsteiger',
  ...V2_FIELDS,
] as const;

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}
```

- [ ] **Step 2: Parser für `_summaries-rewrite.md`**

Erwartetes Format:

```markdown
## PSD2
<Text für Management Summary, Leerzeile getrennt>

## PSD3
<...>
```

Parser:

```ts
function parseSummariesFile(): Map<string, string> {
  const file = path.join(BASE, '_summaries-rewrite.md');
  if (!fs.existsSync(file)) return new Map();
  const content = fs.readFileSync(file, 'utf-8');
  const map = new Map<string, string>();
  const parts = content.split(/^## /m).slice(1); // first split-part is preamble
  for (const part of parts) {
    const [header, ...rest] = part.split('\n');
    const kuerzel = header.trim();
    const body = rest.join('\n').trim();
    if (kuerzel && body) map.set(kuerzel, body);
  }
  return map;
}
```

- [ ] **Step 3: Parser für `_addon-fields.md`**

Format: YAML-Frontmatter-Blöcke, einer pro Kürzel:

```markdown
---
kuerzel: PSD2
verwandte_regulierungen: PSD3, DORA, AMLR
sap_bezug: FI-BL, TRM-TM
bussgeld: bis zu 5 Mio € ...
pruefpflicht: WP-Testat ...
aufwand_tshirt: L
---

---
kuerzel: PSD3
...
---
```

Parser splittet an `\n---\n` und parst jeden Block mit `matter`:

```ts
function parseAddonFile(): Map<string, Record<string, string | null>> {
  const file = path.join(BASE, '_addon-fields.md');
  if (!fs.existsSync(file)) return new Map();
  const content = fs.readFileSync(file, 'utf-8');
  const blocks = content.split(/\n---\n/).map(b => b.trim()).filter(Boolean);
  const map = new Map<string, Record<string, string | null>>();
  for (const block of blocks) {
    const wrapped = block.startsWith('---') ? block : `---\n${block}\n---\n`;
    const parsed = matter(wrapped);
    const fm = parsed.data as Record<string, unknown>;
    const kuerzel = strOrNull(fm.kuerzel);
    if (!kuerzel) continue;
    const fields: Record<string, string | null> = {};
    for (const f of V2_FIELDS) fields[f] = strOrNull(fm[f]);
    map.set(kuerzel, fields);
  }
  return map;
}
```

- [ ] **Step 4: Parser für Deep-Dive-MDs**

Analog `seed-regulatorik-expansion.ts`: alle `*.md` außer `_*` und Bestand (dora/mica/gdpr-payments/wtr-tfr/ecb-sepa-rulebook), extrahiert `matter(content).data` und filtert auf `ALL_FIELDS`.

```ts
const BESTAND_FILES = new Set(['dora.md','mica.md','gdpr-payments.md','wtr-tfr.md','ecb-sepa-rulebook.md']);

function parseDeepDiveFiles(): Array<Record<string, string | null>> {
  const files = fs.readdirSync(BASE).filter(f =>
    f.endsWith('.md') && !f.startsWith('_') && !BESTAND_FILES.has(f)
  );
  return files.map(f => {
    const parsed = matter(fs.readFileSync(path.join(BASE, f), 'utf-8'));
    const fm = parsed.data as Record<string, unknown>;
    const rec: Record<string, string | null> = {};
    for (const field of ALL_FIELDS) rec[field] = strOrNull(fm[field]);
    return rec;
  });
}
```

- [ ] **Step 5: Upsert-Logik**

```ts
async function main() {
  const summaries = parseSummariesFile();
  const addons = parseAddonFile();
  const newEntries = parseDeepDiveFiles();

  const existing = await db
    .select({ id: regulatorikEntries.id, kuerzel: regulatorikEntries.kuerzel, source_row: regulatorikEntries.source_row })
    .from(regulatorikEntries);
  const existingByKuerzel = new Map(existing.filter(e => e.kuerzel).map(e => [e.kuerzel!, e]));
  let maxRow = Math.max(0, ...existing.map(e => e.source_row ?? 0));

  // 1) Updates auf Bestand: Summary + 5 addon fields
  for (const [kuerzel, row] of existingByKuerzel) {
    const patch: Record<string, string | null> = {};
    if (summaries.has(kuerzel)) patch.beschreibung_einsteiger = summaries.get(kuerzel)!;
    const addon = addons.get(kuerzel);
    if (addon) for (const f of V2_FIELDS) if (addon[f] !== null) patch[f] = addon[f];
    if (Object.keys(patch).length === 0) continue;
    console.log(`UPDATE ${kuerzel}:`, Object.keys(patch).join(', '));
    if (!DRY_RUN) {
      await db.update(regulatorikEntries).set(patch).where(eq(regulatorikEntries.id, row.id));
    }
  }

  // 2) Inserts für neue Deep-Dives
  for (const rec of newEntries) {
    const kuerzel = rec.kuerzel;
    if (!kuerzel) { console.warn('SKIP: no kuerzel in deep-dive'); continue; }
    if (existingByKuerzel.has(kuerzel)) {
      console.log(`SKIP INSERT ${kuerzel} (already exists)`); continue;
    }
    maxRow += 1;
    const insertRow = { ...rec, source_row: maxRow };
    console.log(`INSERT ${kuerzel} (source_row ${maxRow})`);
    if (!DRY_RUN) {
      // @ts-expect-error — dynamic insert
      await db.insert(regulatorikEntries).values(insertRow);
    }
  }

  console.log(DRY_RUN ? '(dry run, nothing written)' : 'Done.');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
```

- [ ] **Step 6: Dry-Run mit leeren Content-Files**

Zunächst leere Platzhalter-Dateien anlegen damit Script durchläuft:

```bash
cd ~/payments-kb
touch content/expansion/regulatorik/_summaries-rewrite.md
touch content/expansion/regulatorik/_addon-fields.md
DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-v2.ts --dry-run
```

Expected: Script läuft fehlerfrei durch, printed `(dry run, nothing written)`, 0 updates, 0 inserts.

- [ ] **Step 7: Commit**

```bash
git add scripts/seed-regulatorik-v2.ts content/expansion/regulatorik/_summaries-rewrite.md content/expansion/regulatorik/_addon-fields.md
git commit -m "feat(regulatorik): seed-v2 script with whitelist upsert"
```

---

## Phase 4: Content — Bestands-Updates

### Task 6: Management-Summaries rewriten (13 Einträge)

**Files:**
- Modify: `content/expansion/regulatorik/_summaries-rewrite.md`

Regeln (aus Spec §3.3):
- 3–5 vollständige Sätze, keine abgehackten Halbsätze
- Struktur: „Was regelt das?" (1 S.) → „Warum relevant fürs Unternehmen?" (1–2 S.) → „Was ist die konkrete Anforderung?" (1–2 S.)
- Keine Fachbegriffe ohne Erklärung
- Tonalität analog `dora.md` (`beschreibung_einsteiger`)

- [ ] **Step 1: Datei mit allen 13 Sektionen anlegen**

Vorgaben für Rewrite (Kürzel + Quellmaterial):

| Kürzel | Quelle für Fakten | Kern-Aussage |
|---|---|---|
| PSD2 | `excel_01_regulatorik_glossar.md` + DB current | Banken-APIs öffnen, SCA, TPP |
| PSD3 | Entwurf 2023/0209 | IBAN-Name-Check, SCA-Reform, PSD→VO |
| SEPA-VO | 260/2012 | Einheitliches EU-Format, IBAN-only |
| SEPA-Instant-VO | 2024/886 | 10s, 24/7, Preisparität, IBAN-Check |
| AMLR | 2024/1624 | EU-einheitl. KYC, UBO-Register |
| ISO 20022 | — | pain.001/camt.053, MT→MX Nov-2025 |
| FATF-Empf. | — | 40 Empfehlungen, FATF-Listen |
| EMIR | 648/2012 | Derivate, LEI, Clearing, Reporting |
| DORA | `dora.md` | (nur geringfügig glätten wenn nötig) |
| EPC-SEPA-2025 | `ecb-sepa-rulebook.md` | Rulebook 2025, R-Messages |
| DSGVO-ZV | `gdpr-payments.md` | Aufbewahrung, Drittland-Transfer |
| MiCA | `mica.md` | (glätten) |
| TFR | `wtr-tfr.md` | Travel Rule, Krypto-Erweiterung |

Format:

```markdown
## PSD2
Die Payment Services Directive 2 ist die EU-Richtlinie, die den Zahlungsverkehrsmarkt für Drittanbieter geöffnet hat. Für Ihr Unternehmen heißt das: Treasury-Software kann mit Ihrer Freigabe Kontostände direkt von der Bank abrufen und Zahlungen auslösen, ohne dass jemand manuell in die Bank-Portale einloggen muss. Bei Zahlungsfreigaben im Online-Banking ist eine Zwei-Faktor-Authentifizierung Pflicht (z. B. Passwort plus App-Bestätigung). Für B2B-Zahlungen gibt es eine Ausnahme — diese muss aber schriftlich mit jeder Hausbank einzeln vereinbart werden.

## PSD3
...
```

Alle 13 Kürzel in der Tabelle oben abarbeiten. Jeder Text 3–5 vollständige Sätze, kein Halbsatz am Ende.

- [ ] **Step 2: Dry-Run des Seeds**

```bash
DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-v2.ts --dry-run
```

Expected: 13× `UPDATE <kuerzel>: beschreibung_einsteiger`, 0 inserts.

- [ ] **Step 3: Commit**

```bash
git add content/expansion/regulatorik/_summaries-rewrite.md
git commit -m "content(regulatorik): rewrite 13 management summaries"
```

### Task 7: Addon-Fields für 13 Bestands-Einträge

**Files:**
- Modify: `content/expansion/regulatorik/_addon-fields.md`

- [ ] **Step 1: 13 Frontmatter-Blöcke schreiben**

Pro Kürzel ein Block mit 5 Feldern. Qualitätsanforderungen:

- `verwandte_regulierungen`: mindestens 2, maximal 6 Kürzel, komma-getrennt, nur existierende Kürzel referenzieren
- `sap_bezug`: konkrete Module (FI-BL, TRM-TM, BC-SEC, ...) und Customizing-TCODEs wenn bekannt
- `bussgeld`: absolute Höhe (€) oder % vom Umsatz, mit Rechtsgrundlage
- `pruefpflicht`: Art (WP, interne Revision, Aufsichts-Audit) + Frequenz
- `aufwand_tshirt`: S / M / L / XL (Perspektive: Corporate-Treasury-Einführungsprojekt)

Beispiel:

```markdown
---
kuerzel: PSD2
verwandte_regulierungen: PSD3, DORA, AMLR, DSGVO-ZV, EBA-SCA-RTS
sap_bezug: FI-BL (Bankbuchhaltung), TRM-TM (Treasury), BC-SEC (Identity), Bank Communication Management (BCM), EBICS/H2H-Connector
bussgeld: national unterschiedlich; DE via ZAG §§ 60 ff. bis zu 5 Mio € bzw. 10% Jahresumsatz
pruefpflicht: jährlicher IT-Audit der SCA-Implementierung (BaFin/EBA-Guideline); WP-Testat §317 HGB bei materieller Relevanz
aufwand_tshirt: L
---

---
kuerzel: PSD3
...
---
```

Alle 13 Kürzel abarbeiten (s. Tabelle Task 6).

- [ ] **Step 2: Dry-Run**

```bash
DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-v2.ts --dry-run
```

Expected: 13× `UPDATE <kuerzel>: beschreibung_einsteiger, verwandte_regulierungen, sap_bezug, bussgeld, pruefpflicht, aufwand_tshirt`, 0 inserts.

- [ ] **Step 3: Commit**

```bash
git add content/expansion/regulatorik/_addon-fields.md
git commit -m "content(regulatorik): 5 v2 fields for 13 existing entries"
```

---

## Phase 5: Content — 21 neue Deep-Dives

**Wichtig:** Jede Deep-Dive-Datei muss alle 25 Felder als YAML-Frontmatter enthalten, exakt im Schema wie `content/expansion/regulatorik/dora.md`. Basis-Template unten. Für jedes `_experte`-Feld: Artikel-/§-Referenzen, konkrete Fristen/Beträge. Für jedes `_einsteiger`-Feld: klares Corporate-Treasury-Deutsch ohne unerklärte Fachbegriffe.

### Basis-Template (in JEDER der 21 Dateien verwenden)

```markdown
---
kuerzel: <KUERZEL>
name: <Vollständiger Name>
typ: <EU-Verordnung | EU-Richtlinie | nationales Gesetz | Standard | Rulebook>
kategorie: <Kategorie>
in_kraft_seit: "<DD.MM.YYYY>"
naechste_aenderung: "<Datum oder Beschreibung offener Novellen>"
behoerde_link: <URL primäre Quelle>
betroffene_abteilungen: <komma-getrennt>
geltungsbereich: <EU-weit | DE | CH | UK | US | global>
status_version: <Fassung, Zeitstempel>
beschreibung_experte: |
  <200-400 Wörter, mit Artikel/§-Refs>
beschreibung_einsteiger: |
  <3-5 vollständige Sätze, Corporate-Treasury-Deutsch>
auswirkungen_experte: |
  1) ...
  2) ...
auswirkungen_einsteiger: |
  <verständlich>
pflichtmassnahmen_experte: |
  • ...
pflichtmassnahmen_einsteiger: |
  <...>
best_practice_experte: |
  • ...
best_practice_einsteiger: |
  <...>
risiken_experte: |
  • ...
risiken_einsteiger: |
  <...>
verwandte_regulierungen: <komma-liste kürzel>
sap_bezug: <konkret>
bussgeld: <höhe + rechtsgrundlage>
pruefpflicht: <art + frequenz>
aufwand_tshirt: <S|M|L|XL>
---

# <Name>

<optional zusätzlicher Markdown-Body>
```

### Task 8: DE-national — ZAG

**Files:**
- Create: `content/expansion/regulatorik/zag.md`

- [ ] **Step 1: File mit Template anlegen**, Kerninhalt:
  - Zahlungsdiensteaufsichtsgesetz, Umsetzung PSD2 in DE
  - BaFin als Aufsicht, Erlaubnispflicht für PSPs
  - Für Industrie-Corporate relevant: §§ 2-3 (Gewerbsmäßigkeit), § 675f BGB-Querbezug, interne Zahlungsfabriken können erlaubnispflichtig werden (Payment-Factory-Risiko)
  - verwandte: PSD2, PSD3, KWG, GwG
  - sap_bezug: relevant wenn konzerninterne Zahlungs-on-behalf-of-Strukturen (POBO/COBO) → In-House-Cash (FSCM-IHC)
  - bussgeld: bis zu 5 Mio € / 10% Jahresumsatz (§ 63 ZAG)
  - aufwand_tshirt: M (Governance-Review)

- [ ] **Step 2: Dry-Run**: `1 INSERT zag (source_row 14)` erwartet.
- [ ] **Step 3: Commit** `content(regulatorik): add zag deep-dive`

### Task 9: DE-national — KWG

**Files:**
- Create: `content/expansion/regulatorik/kwg.md`

- [ ] **Step 1:** Kreditwesengesetz. Relevant für Corporates: §§ 1, 32 (Kreditgeschäft-Erlaubnis), § 2a Gruppenfreistellung, Tochter-Finanzierung. verwandte: ZAG, CRR-CRD, MaRisk. sap_bezug: FI-LA/TR-LO bei konzerninternen Darlehen. bussgeld: bis zu 5 Mio € / 10% Umsatz. aufwand_tshirt: M.
- [ ] **Step 2:** Dry-Run → `1 INSERT kwg`
- [ ] **Step 3:** Commit.

### Task 10: DE-national — GwG

**Files:** Create: `content/expansion/regulatorik/gwg.md`

- [ ] **Step 1:** Geldwäschegesetz, § 10 ff. KYC-Pflichten, § 20 UBO-Transparenzregister, §§ 43/44 Meldepflicht. Verpflichtete i.d.R. Banken — für Corporates über Lieferanten-/Vertriebs-KYC relevant. verwandte: AMLR, FATF-Empf., TFR. sap_bezug: Geschäftspartner-Stammdaten (MM/SD), Compliance-Screening über GTS. bussgeld: bis 5 Mio € / 10% Umsatz (§ 56). aufwand_tshirt: L.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 11: DE-national — AWV/AWG

**Files:** Create: `content/expansion/regulatorik/awv-awg.md`

- [ ] **Step 1:** Außenwirtschaftsgesetz + -verordnung. §§ 67 ff. AWV Meldepflichten grenzüberschreitender Zahlungen > 12.500 €, Kapital-/Ausgleichsmeldungen Z4/Z8/Z10. Sanktions-Querbezug §§ 4, 6 AWG. verwandte: EU-Sanktionen, Dual-Use-VO, Bundesbank. sap_bezug: AWV-Meldewesen über Bundesbank-Portal, SAP FI automatische Meldung via Add-on. bussgeld: bis 500.000 € pro Verstoß (§ 19 AWG OWi), Straftat-Tatbestand bei Sanktionsumgehung. aufwand_tshirt: M.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 12: DE-national — MaRisk

**Files:** Create: `content/expansion/regulatorik/marisk.md`

- [ ] **Step 1:** BaFin-Rundschreiben 05/2023 (MaRisk), Mindestanforderungen Risikomanagement. Für Corporates nicht direkt bindend, aber über Kreditverträge/Covenants indirekt (Banken reichen Anforderungen weiter). Treasury-Governance-Referenz. verwandte: KWG, CRR-CRD, DORA. sap_bezug: TRM Risk Management, Limit-Management. bussgeld: n/a direkt. pruefpflicht: bei KWG-Instituten jährl. WP-Prüfung. aufwand_tshirt: S (Awareness).
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 13: DE-national — §146a AO

**Files:** Create: `content/expansion/regulatorik/ao-146a.md`

- [ ] **Step 1:** Abgabenordnung § 146a, TSE-Pflicht bei elektronischen Aufzeichnungssystemen (Kassen). Für Industrieunternehmen nur relevant bei B2C-Verkäufen/Werksverkauf/Kantinen. verwandte: GoBD, DSGVO-ZV. sap_bezug: SAP Customer Checkout + TSE-Zertifikat, Cloud-Connector. bussgeld: bis 25.000 € § 379 AO. aufwand_tshirt: S.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 14: EU-Finanzmarkt — MiFID II

**Files:** Create: `content/expansion/regulatorik/mifid-2.md`

- [ ] **Step 1:** 2014/65/EU + MiFIR. Für Corporate-Treasury: Kundenkategorisierung als „Professional/Eligible Counterparty", Best Execution bei FX/IR-Derivaten, LEI-Pflicht, Transaction-Reporting über Broker. verwandte: EMIR, CRR-CRD. sap_bezug: TRM-TM Hedge-Management, LEI-Stammdaten. bussgeld: bis 5 Mio € / 10% Umsatz national. aufwand_tshirt: M.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 15: EU-Finanzmarkt — CRR/CRD

**Files:** Create: `content/expansion/regulatorik/crr-crd.md`

- [ ] **Step 1:** CRR 575/2013 (VO) + CRD IV 2013/36/EU (RL), umgesetzt u.a. über Basel III/IV. Für Corporates indirekt: Banken erhöhen Pricing/Besicherung, KYC-Verschärfung, RWA-Optimierung → Folge: CPs prüfen Kreditlinien neu. verwandte: KWG, MaRisk, EMIR. sap_bezug: TRM-CM Cash & Liquidity, In-House-Cash. bussgeld: n/a direkt. aufwand_tshirt: S (Awareness + Banken-Dialog).
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 16: EU-Finanzmarkt — EBA SCA-RTS

**Files:** Create: `content/expansion/regulatorik/eba-sca-rts.md`

- [ ] **Step 1:** Delegierte VO 2018/389, Regulatory Technical Standards zu PSD2 Art. 98. SCA-Faktoren (Wissen, Besitz, Inhärenz), Ausnahmen (TRA, Whitelist, B2B). verwandte: PSD2, PSD3, DORA. sap_bezug: BCM, EBICS T/TS-Signaturverfahren, HANA-based Signaturen. bussgeld: über PSD2-Umsetzung. aufwand_tshirt: M.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 17: Sanktionen — EU-Sanktionsregime

**Files:** Create: `content/expansion/regulatorik/eu-sanktionen.md`

- [ ] **Step 1:** VO 269/2014 (Ukraine-personenbezogen) + 833/2014 (Russland-sektoral) als Leitbeispiele, zusätzlich konsolidierte EU-Sanktionsliste. Für jedes Unternehmen direkt bindend (Art. 215 AEUV). verwandte: OFAC, Dual-Use-VO, AWV-AWG, TFR. sap_bezug: SAP GTS Sanctioned-Party-List-Screening, MM/SD/FI integriert. bussgeld: national unterschiedlich, DE bis Freiheitsstrafe § 18 AWG. aufwand_tshirt: L.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 18: Sanktionen — OFAC

**Files:** Create: `content/expansion/regulatorik/ofac.md`

- [ ] **Step 1:** Office of Foreign Assets Control (US Treasury). Exterritoriale Reichweite über USD-Clearing: jede USD-Zahlung läuft über US-Korrespondenzbank → OFAC-Screening unvermeidbar. SDN-List, 50%-Rule, Secondary Sanctions. verwandte: EU-Sanktionen, TFR, FATF-Empf. sap_bezug: SAP GTS mit OFAC-List, Screening MM/SD/FI. bussgeld: bis $21.6 Mio (per 2024) + Strafmaß pro Verstoß. aufwand_tshirt: L.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 19: Sanktionen — Dual-Use-VO

**Files:** Create: `content/expansion/regulatorik/dual-use-vo.md`

- [ ] **Step 1:** VO 2021/821. Exportkontrolle für Güter mit ziviler+militärischer Nutzung. Genehmigungspflicht für Anhang I-Güter, Catch-all-Klausel Art. 4. verwandte: AWV-AWG, EU-Sanktionen. sap_bezug: SAP GTS Classification + Embargo-Check, MM Klassifizierung. bussgeld: § 17-19 AWG, Freiheitsstrafe bei Vorsatz. aufwand_tshirt: M.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 20: Steuer — FATCA

**Files:** Create: `content/expansion/regulatorik/fatca.md`

- [ ] **Step 1:** Foreign Account Tax Compliance Act (US 2010), IGA mit DE 2013. Meldepflicht ausländischer Konten von US-Persons. Für DE-Corporates: Banken fordern W-8BEN-E-Formular; bei fehlerhafter Klassifizierung 30% Quellensteuer auf USD-Zahlungen. verwandte: CRS, DAC7-DAC8. sap_bezug: Stammdatenfeld FATCA-Status, Withholding Tax Customizing FI. bussgeld: 30% Einbehalt. aufwand_tshirt: S.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 21: Steuer — CRS

**Files:** Create: `content/expansion/regulatorik/crs.md`

- [ ] **Step 1:** OECD Common Reporting Standard, EU via DAC2 (RL 2014/107). Automatischer Informationsaustausch zwischen Finanzbehörden. verwandte: FATCA, DAC7-DAC8, DSGVO-ZV. sap_bezug: Self-Certification-Stammdaten Lieferant/Kunde. bussgeld: § 28 FKAustG DE bis 50.000 €. aufwand_tshirt: S.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 22: Steuer — DAC7/DAC8

**Files:** Create: `content/expansion/regulatorik/dac7-dac8.md`

- [ ] **Step 1:** DAC7 (RL 2021/514, Plattformbetreiber-Meldepflicht), DAC8 (RL 2023/2226, Krypto-Assets). Für Corporates: relevant wenn Marktplatz/Plattform betrieben oder Krypto-Assets gehalten. verwandte: MiCA, CRS, FATCA, TFR. sap_bezug: S/4HANA Marketplace Reporting Add-on. bussgeld: DE PStTG bis 50.000 €. aufwand_tshirt: M (falls anwendbar).
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 23: Tech — PCI DSS

**Files:** Create: `content/expansion/regulatorik/pci-dss.md`

- [ ] **Step 1:** PCI DSS v4.0 (2024) — Payment Card Industry Data Security Standard. Vertraglich über Merchant-Verträge bindend. Für Industrieunternehmen mit E-Commerce/B2C-Kartenzahlungen relevant. verwandte: DSGVO-ZV, NIS2, DORA. sap_bezug: SAP Commerce, Payment-Service-Provider-Integration (Stripe/Adyen), Tokenisierung statt PAN-Speicherung. bussgeld: Kartennetzwerk-Strafen $5k-$100k/Monat. aufwand_tshirt: L.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 24: Tech — eIDAS 2

**Files:** Create: `content/expansion/regulatorik/eidas-2.md`

- [ ] **Step 1:** VO (EU) 2024/1183. EU Digital Identity Wallet (EUDI), Qualifizierte elektronische Signaturen/Siegel, Authentisierung. Für Corporate Treasury: qualifizierte Siegel für Rechnungen, EUDI-Wallet-Integration für KYC-Onboarding. verwandte: DSGVO-ZV, NIS2, PSD3. sap_bezug: Digital Signature Service (DSS), SAP Document and Reporting Compliance. bussgeld: national unterschiedlich. aufwand_tshirt: M.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 25: Tech — NIS2

**Files:** Create: `content/expansion/regulatorik/nis2.md`

- [ ] **Step 1:** RL (EU) 2022/2555, Umsetzung DE NIS2UmsuCG. Cyber-Sicherheitsanforderungen an „wesentliche/wichtige Einrichtungen" (inkl. große Industriebetriebe Energie/Logistik/Produktion). Meldepflicht binnen 24h/72h/1 Monat. verwandte: DORA, DSGVO-ZV, PCI-DSS. sap_bezug: BC-SEC, SAP ETD, Integration SIEM. bussgeld: bis 10 Mio € / 2% Umsatz. aufwand_tshirt: L.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 26: Non-EU — CH FinfraG

**Files:** Create: `content/expansion/regulatorik/ch-finfrag.md`

- [ ] **Step 1:** Bundesgesetz über die Finanzmarktinfrastrukturen (CH, 2016) + FINMA-GwV. Für CH-Tochtergesellschaften relevant; OTC-Derivate-Reporting, CH-äquivalent zu EMIR, nationale GW-Prüfung. verwandte: EMIR, MiFID-II, GwG. sap_bezug: TRM-TM Reporting-Anpassung CH-Reportingpflicht. bussgeld: bis 500.000 CHF § 154 FinfraG. aufwand_tshirt: M.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 27: Non-EU — UK PSR 2017

**Files:** Create: `content/expansion/regulatorik/uk-psr.md`

- [ ] **Step 1:** UK Payment Services Regulations 2017 (SI 2017/752), post-Brexit eigenständig, FCA-Aufsicht. Für DE-Corporates mit UK-Entitäten: Confirmation of Payee (CoP) Pflicht seit 2024, Faster Payments, Open Banking ähnlich PSD2. verwandte: PSD2, PSD3, Open-Banking-UK. sap_bezug: BCM UK-Bank-Connector (BACS, Faster Payments), CoP-Response-Handling pain.002. bussgeld: FCA § 66 FSMA unbegrenzt. aufwand_tshirt: M.
- [ ] **Step 2-3:** Dry-Run + Commit.

### Task 28: Non-EU — US UCC Art. 4A + Reg E

**Files:** Create: `content/expansion/regulatorik/us-ucc-4a.md`

- [ ] **Step 1:** Uniform Commercial Code Article 4A (Funds Transfers, Wholesale) + Regulation E (CFPB, Consumer). Relevanzfenster: bei Fehlüberweisung ist laut UCC 4A der Sender zuständig für IBAN/Account-Nr. — Begünstigtenname wird nicht geprüft (im Gegensatz zu PSD3 CoP). verwandte: OFAC, FATCA, PSD3. sap_bezug: pain.001 Ausgabe für US-Banken, Wire/ACH Unterscheidung. bussgeld: zivilrechtlich. aufwand_tshirt: S.
- [ ] **Step 2-3:** Dry-Run + Commit.

---

## Phase 6: Final Seed & Verification

### Task 29: Full Dry-Run

- [ ] **Step 1:** Kompletten Seed im Dry-Run ausführen

```bash
cd ~/payments-kb
DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-v2.ts --dry-run 2>&1 | tee /tmp/seed-dryrun.log
```

Expected:
- 13× `UPDATE <kuerzel>: beschreibung_einsteiger, verwandte_regulierungen, sap_bezug, bussgeld, pruefpflicht, aufwand_tshirt`
- 21× `INSERT <kuerzel> (source_row NN)`
- `(dry run, nothing written)`

- [ ] **Step 2:** Log auf Warnungen prüfen

```bash
grep -iE "skip|warn|error" /tmp/seed-dryrun.log
```

Expected: nur `SKIP INSERT`-Meldungen für bereits existierende Kürzel (dora/mica/gdpr/tfr/epc-sepa falls als Deep-Dive-MDs vorhanden).

### Task 30: Real Seed ausführen

- [ ] **Step 1:**

```bash
DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-regulatorik-v2.ts 2>&1 | tee /tmp/seed-real.log
```

Expected: gleiche Ausgabe wie Dry-Run, aber am Ende `Done.`

- [ ] **Step 2: DB-Count verifizieren**

```bash
set -a && . ./.env.local && set +a
npx tsx scripts/query-regulatorik.ts | grep "^COUNT"
```

Expected: `COUNT: 34`

- [ ] **Step 3: Stichprobe — 3 neue Einträge prüfen**

```bash
psql "$DATABASE_URL" -c "SELECT kuerzel, typ, aufwand_tshirt, LEFT(verwandte_regulierungen, 50) FROM regulatorik_entries WHERE kuerzel IN ('ZAG','OFAC','NIS2');"
```

Expected: 3 Zeilen, alle Felder non-null.

- [ ] **Step 4: Stichprobe — Bestands-Update**

```bash
psql "$DATABASE_URL" -c "SELECT kuerzel, aufwand_tshirt, LEFT(beschreibung_einsteiger, 80) FROM regulatorik_entries WHERE kuerzel IN ('PSD2','DORA','MiCA');"
```

Expected: `aufwand_tshirt` befüllt, `beschreibung_einsteiger` beginnt mit neu geschriebenem Text.

### Task 31: Browser-Verifikation

- [ ] **Step 1:** Dev-Server

```bash
cd ~/payments-kb && pnpm dev
```

- [ ] **Step 2:** Manueller Check auf `http://localhost:3000/regulatorik`:
  - Sidebar: 34 Einträge
  - Alle 21 neuen Kürzel auswählbar
  - Detail-Ansicht eines neuen Eintrags zeigt alle 9 Sektionen (Allgemein, Querverweise, Beschreibung, Auswirkungen, Pflichtmaßnahmen, Best Practice, Risiken, Compliance-Folgen, SAP & System, Umsetzung)
  - Management Summary Callout oben: vollständige Sätze, kein Halbsatz-Ende
  - Bestands-Eintrag PSD2: Management Summary ist die neu geschriebene Fassung, 5 neue Felder sichtbar

- [ ] **Step 3:** Screenshot für Abnahme ablegen: `docs/superpowers/plans/2026-04-13-regulatorik-v2-screenshot.png`

### Task 32: Cleanup & finaler Commit

- [ ] **Step 1:** Query-Script aus Brainstorming entfernen (oder behalten wenn nützlich)

```bash
# optional
git rm scripts/query-regulatorik-summaries.ts
```

- [ ] **Step 2:** Finaler Commit für alle verbleibenden Content-Deep-Dives (falls in Phase 5 nicht einzeln committed)

```bash
git add content/expansion/regulatorik/*.md
git commit -m "content(regulatorik): 21 new deep-dive entries"
```

- [ ] **Step 3:** Plan-Status

```bash
git log --oneline | head -40
```

Prüfen dass alle Phasen 1-6 als separate Commits sichtbar.

---

## Checkliste Plan-Coverage (gegen Spec)

- [x] Schema-Änderung: 5 Felder → Task 1-2
- [x] UI-Änderung: Columns + Sektionen → Task 4
- [x] Query-Erweiterung → Task 3
- [x] 13 Management-Summary-Rewrites → Task 6
- [x] 5 Addon-Felder für 13 Bestands-Einträge → Task 7
- [x] 21 neue Deep-Dives → Task 8-28
- [x] Seed mit Whitelist-Upsert → Task 5
- [x] Dry-Run-Flag → Task 5 Step 1, Task 29
- [x] Idempotenz → Task 5 Step 5 (SELECT by kuerzel, UPDATE/INSERT)
- [x] Unique-Index auf `kuerzel` → Task 1 Step 1
- [x] Verifikation COUNT=34 → Task 30 Step 2
- [x] Browser-Check 9 Sektionen → Task 31 Step 2
- [x] Management Summary ohne Halbsätze → Task 6 Step 1 Regeln + Task 31 Step 2
