# Regulatorik v2 — Design Spec

**Datum:** 2026-04-13
**Projekt:** payments-kb (gpdb.norinit.de)
**Bereich:** `regulatorik` (Sheet 01)

## Ziel

Bereich Regulatorik ausbauen:
1. **Inhalte** von 13 auf 34 Einträge erweitern (EU + DE + wichtige Non-EU)
2. **Struktur** um 5 neue Felder ergänzen (Querverweise, SAP-Bezug, Bußgeld, Prüfpflicht, Aufwand-T-Shirt-Sizing)
3. **Management Summaries** (`beschreibung_einsteiger`) aller 13 Bestandseinträge überarbeiten — vollständige Sätze, Management-tauglich

## 1. Scope

### 1.1 Bestand (13 Einträge, bleiben)

PSD2, PSD3, SEPA-VO, SEPA-Instant-VO, AMLR, ISO 20022, FATF-Empf., EMIR, DORA, EPC-SEPA-2025, DSGVO-ZV, MiCA, TFR

Für jeden: 5 neue Felder befüllen + `beschreibung_einsteiger` überarbeiten. Alle übrigen Felder **nicht** überschreiben.

### 1.2 Neu (21 Einträge)

| Kategorie | Einträge |
|---|---|
| DE national | ZAG, KWG, GwG, AWV/AWG, MaRisk (BaFin-RS), §146a AO |
| EU Finanzmarkt | MiFID II, CRR/CRD (Basel III/IV), EBA SCA-RTS |
| Sanktionen | EU-Sanktionsregime (VO 269/2014 + 833/2014), OFAC, Dual-Use-VO 2021/821 |
| Steuer/Reporting | FATCA, CRS, DAC7/DAC8 |
| Tech/Security | PCI DSS, eIDAS 2, NIS2 |
| Non-EU | CH FinfraG + FINMA-GwV, UK PSR 2017, US UCC Art. 4A + Reg E |

Alle neuen Einträge auf Deep-Dive-Niveau der bestehenden `content/expansion/regulatorik/dora.md` bzw. `mica.md` — d.h. alle 25 Felder vollständig befüllt, jede `_experte`-Variante mit fachlicher Tiefe (Artikel, Paragraphen, konkrete Fristen/Beträge), jede `_einsteiger`-Variante in klarem Corporate-Treasury-Deutsch.

## 2. Schema-Änderungen

### 2.1 Neue Spalten (`regulatorik_entries`)

| Feld | Postgres-Typ | Constraint | Beispiel |
|---|---|---|---|
| `verwandte_regulierungen` | `text` | nullable | `"PSD2, DORA, AMLR"` (Komma-separierte Kürzel) |
| `sap_bezug` | `text` | nullable | `"FI-BL, TRM-TM, Customizing OT83/OB72"` |
| `bussgeld` | `text` | nullable | `"bis zu 10 Mio € oder 2% Jahresumsatz"` |
| `pruefpflicht` | `text` | nullable | `"WP-Testat §317 HGB, interne Revision jährlich"` |
| `aufwand_tshirt` | `text` | nullable | `"L"` (erwartet: S/M/L/XL) |

**Bewusste Entscheidungen:**
- `verwandte_regulierungen` als Komma-Text, keine Join-Tabelle (YAGNI bei 34 Einträgen)
- `aufwand_tshirt` als `text`, kein Postgres-Enum (Erweiterbarkeit XS/XXL)
- Kein Experte/Einsteiger-Split für die neuen Felder (strukturierte Fakten, keine Narrative)
- Alle nullable (Migration greift auf existierende Zeilen, Werte kommen per Seed)

### 2.2 Migration

Neue Drizzle-Migration `db/migrations/NNNN_regulatorik_v2.sql`:

```sql
ALTER TABLE regulatorik_entries
  ADD COLUMN verwandte_regulierungen text,
  ADD COLUMN sap_bezug text,
  ADD COLUMN bussgeld text,
  ADD COLUMN pruefpflicht text,
  ADD COLUMN aufwand_tshirt text;
```

## 3. UI-Änderungen

### 3.1 `app/(fullscreen)/regulatorik/page.tsx`

5 neue Einträge im `COLUMNS`-Array, 3 neue Sektionen ergänzen:

```ts
// Querverweise
{ key: 'verwandte_regulierungen', label: 'Verwandte Regulierungen', section: 'Querverweise' },

// SAP & System
{ key: 'sap_bezug', label: 'SAP-Bezug / System-Auswirkung', section: 'SAP & System' },

// Compliance-Folgen
{ key: 'bussgeld',     label: 'Bußgeld / Sanktionshöhe', section: 'Compliance-Folgen' },
{ key: 'pruefpflicht', label: 'Prüfpflicht / Audit-Relevanz', section: 'Compliance-Folgen' },

// Umsetzung
{ key: 'aufwand_tshirt', label: 'Implementierungsaufwand (T-Shirt)', section: 'Umsetzung' },
```

Final-Reihenfolge der 9 Sektionen: Allgemein → Querverweise → Beschreibung → Auswirkungen → Pflichtmaßnahmen → Best Practice → Risiken → Compliance-Folgen → SAP & System → Umsetzung.

### 3.2 `lib/queries/entries.ts`

`getRegulatorikEntries` erweitern: die 5 neuen Felder in den `select`-Shape aufnehmen.

### 3.3 Management Summary Rewrite

`SplitView` rendert `summaryField="beschreibung_einsteiger"` als Callout oben in der Detailansicht. Alle 13 Bestands-Summaries werden neu geschrieben mit folgenden Regeln:

- 3–5 vollständige Sätze, keine abgehackten Halbsätze
- Einstieg mit „Was regelt das?" (1 Satz), Mitte „Warum relevant fürs Unternehmen?" (1–2 Sätze), Ende „Was ist die konkrete Anforderung?" (1–2 Sätze)
- Keine Fachbegriffe ohne Erklärung
- Gleiche Tonalität wie bestehende `dora.md`-Einsteiger-Variante

## 4. Content-Produktion

### 4.1 Verzeichnisstruktur

```
content/expansion/regulatorik/
  ├── (bestehend) dora.md, mica.md, gdpr-payments.md, wtr-tfr.md, ecb-sepa-rulebook.md
  ├── zag.md
  ├── kwg.md
  ├── gwg.md
  ├── awv-awg.md
  ├── marisk.md
  ├── ao-146a.md
  ├── mifid-2.md
  ├── crr-crd.md
  ├── eba-sca-rts.md
  ├── eu-sanktionen.md
  ├── ofac.md
  ├── dual-use-vo.md
  ├── fatca.md
  ├── crs.md
  ├── dac7-dac8.md
  ├── pci-dss.md
  ├── eidas-2.md
  ├── nis2.md
  ├── ch-finfrag.md
  ├── uk-psr.md
  └── us-ucc-4a.md
```

### 4.2 Dateiformat

YAML-Frontmatter mit allen 25 Feldern (20 bestehende + 5 neue). Struktur analog `dora.md`. Alle `_experte`-Felder mit fachlicher Tiefe (Artikel/§§, Fristen, Beträge), alle `_einsteiger`-Felder in klarem Deutsch.

### 4.3 Management-Summary-Rewrite

Separates Patch-File `content/expansion/regulatorik/_summaries-rewrite.md` mit den 13 überarbeiteten `beschreibung_einsteiger`-Texten, key = kuerzel.

## 5. Seed-Script

`scripts/seed-regulatorik-v2.ts`:

- Parst alle 21 neuen `.md`-Dateien im expansion-Ordner (YAML-Frontmatter)
- Parst `_summaries-rewrite.md` für die 13 Management-Summary-Updates
- Parst `expansion-addons.md` (neues File) mit den 5 neuen Feldwerten für die 13 Bestands-Einträge, key = kuerzel

**Upsert-Logik:**
- **Bestand** (Kürzel existiert): nur `UPDATE` auf `beschreibung_einsteiger` + 5 neue Felder; alle übrigen Felder **nicht anfassen**
- **Neu** (Kürzel existiert nicht): `INSERT` mit allen 25 Feldern + `source_row = MAX(source_row) + 1`

**Idempotenz:** Script muss mehrfach ausführbar sein ohne Duplikate oder Datenverlust.

**Dry-Run-Flag:** `--dry-run` printed geplante Changes ohne DB-Write.

## 6. Verifikation

1. `npx tsx scripts/query-regulatorik.ts` → COUNT = 34
2. Stichprobe 3 Einträge: alle 25 Felder nicht null (bis auf `naechste_aenderung` wo unbekannt)
3. Browser: `/regulatorik` zeigt 34 Einträge in Sidebar, 9 Sektionen in Detail, alle 5 neuen Felder sichtbar
4. Management Summary jedes der 13 Bestands-Einträge: keine abgebrochenen Sätze

## 7. Out-of-Scope

- Kein Rewrite von `beschreibung_experte`, `auswirkungen_*`, `pflichtmassnahmen_*` etc. bei Bestands-Einträgen
- Keine Änderung am SplitView-Component selbst
- Keine Übersetzung EN/FR — nur DE
- Kein Re-Indexing des Chunks/RAG-Index (separates Thema)
- Keine neuen Filter/Suchfelder über die bestehenden hinaus

## 8. Risiken

| Risiko | Mitigation |
|---|---|
| Content-Umfang 21 × 25 = 525 Cells wird groß | Deep-Dives in separaten Sessions, Spec deckt Struktur ab, Content iterativ |
| Seed überschreibt gepflegte Bestandsdaten | Seed-Script: UPDATE nur auf whitelisted fields |
| Fachliche Richtigkeit der 21 neuen Regelungen | Quellen im `behoerde_link`-Feld verpflichtend, `_experte`-Texte mit Artikel-/§-Bezügen |
| Kürzel-Namenskollision (z.B. wenn Eintrag später importiert wird) | Unique-Index auf `kuerzel` setzen (separate Mini-Migration) |
