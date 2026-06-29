# Formate v3 — Korrekter Content (Summary, SAP-Mapping, Struktur)

**Datum:** 2026-04-15
**Projekt:** payments-kb
**Bereich:** `/formate` Detail-Seiten

## Problem

Aktuelle Content-Qualität (nach Formate-v2-Rollout) ist „Subagent-Freestyle" ohne verifizierte Quellen:
- **Management Summary** (DB `beschreibung_einsteiger`) — stückweise dicht, kein konsistentes Format
- **SAP-Mapping** (DB `sap_mapping_*`) — generisch, nicht gegen aktuelle SAP-OSS-Notes geprüft
- **Nachrichtenstruktur** (TS `content/formats/*.ts`) — aus LLM-Wissen, potentiell halluzinierte Felder/Cardinalities

Ziel: für alle **31 Formate** drei Bereiche **korrekt** aus **autoritativen Quellen** herleiten und zentral in der DB pflegen.

## Ziel

Für jedes Format:
1. **Management Summary** — 3–5 Sätze Klartext basierend auf offizieller Business-Definition der Spec
2. **SAP-Mapping** — TCODE-gestützt, verifiziert gegen aktuelle SAP-OSS-Notes (nur dokumentierte Pfade)
3. **Nachrichtenstruktur** — vollständige hierarchische Feld-Tabelle mit exakter Cardinality, Datentyp, ISO/Spec-Beschreibung

## Scope

**Alle 31 Formate** (siehe `/formate` DB):
- ISO 20022: pain.001, pain.002, pain.003, pain.007, pain.008, pain.013, camt.052, camt.053, camt.054, pacs.008, CBPR+, MX gpi
- SWIFT MT: MT101, MT103, MT202, MT940, MT942
- EU Legacy: Bacs, CLIEOP, Cuaderno 34, DTAUS, DTAZV, LCR-MAG, Faster Payments
- Italy Local: CBI, FatturaPA, RIBA, SEDA
- US/JP: Fedwire FAIM, NACHA, Zengin Text

**Pilot-first:** pain.001 vollständig neu aufgebaut als Gold-Standard, dann Rollout auf die restlichen 30.

## Architektur

### Phase A — Schema-Migration

Neue Spalten in `format_entries`:

| Spalte | Typ | Inhalt |
|---|---|---|
| `structure` | `jsonb` | `StructureNode[]` (siehe Format-Types, bereits definiert in `lib/formats/types.ts`) |
| `migrations` | `jsonb` | `Migration[]` |
| `feature_defs` | `jsonb` | `FeatureDefSerialized[]` — RegExp als `{pattern, flags}` String-Paar |
| `character_set` | `text` | Variant-Key aus `CharacterSetVariant` (`sepa-latin` / `swift-x` / `us-ascii` / etc.) |
| `reject_code_group` | `text` | `iso20022` / `swift-mt` / `nacha` / `null` |
| `schema_uri_pattern` | `text` | z.B. `urn:iso:std:iso:20022:tech:xsd:pain.001.001.<v>` |
| `region` | `text` | z.B. `Global / SEPA`, `Deutschland`, `Japan` |

Migration-File: `db/migrations/0011_format_entries_content.sql`

### Phase B — VersionDetailPanel aus DB lesen

**Entscheidungs-Reihenfolge:**
1. DB-Felder in `format_entries` für das gewählte Format → primär verwenden
2. Wenn DB leer → Fallback auf `content/formats/*.ts` via `getFormat()` (bleibt bestehen)

**FeatureDef-Serialisierung:** `feature_defs` in DB als:
```json
[{ "pattern": "PostalAddress24", "flags": "i", "name": "…", "what": "…", "tokens": [...] }, ...]
```
Client-Rehydrierung: `new RegExp(pattern, flags)`.

**Keine neuen UI-Features** — Inline-Edit für Management Summary bleibt wie bisher (über bestehendes `/api/entries/:table/:id` PATCH).

### Phase C — Pilot: pain.001

Subagent-Auftrag:
1. WebFetch `https://www.iso20022.org/iso-20022-message-definitions` — Navigation zu pain.001.001.09
2. WebFetch MessageDefinitionReport PDF (falls direkt verlinkt) oder MessagePartsReport (öffentlich)
3. Extraktion:
   - `structure`: vollständiger Baum (2-3 Tier tief — GrpHdr, PmtInf, CdtTrfTxInf mit allen relevanten Sub-Elementen)
   - `migrations`: sofern Spec Changes-History enthält (oder aus EPC SEPA SCT Rulebook Version Notes)
   - `feature_defs`: aus den Versions-Notes der verschiedenen .03/.05/.08/.09/.11/.13 extrahieren
4. Management Summary neu schreiben aus Business-Overview der Spec (3-5 Sätze)
5. SAP-Mapping: WebSearch SAP-OSS-Notes (via sap.com/kb oder launchpad)
   - Primär-Notes für pain.001: 1844160 (DMEE SEPA_CT), 2178617, 2215432, 3268290 (S/4HANA Advanced Payment Management)
   - Extraktion relevanter Customizing-Pfade, TCODES, Tabellen
6. Output: SQL-UPDATE-Statement für `format_entries` WHERE format_name='pain.001'

Ergebnis in Sandbox-Sicht: `/formate?id=<pain.001.001.09-id>` — Pilot-Review durch User.

### Phase D — Review-Schleife

User öffnet `/formate?id=<pain.001.001.09-id>`. Prüft:
- Management Summary: stimmt inhaltlich?
- SAP-Mapping: echte OSS-Notes, echte TCODES?
- Nachrichtenstruktur: Cardinalities korrekt, Sub-Elemente nicht erfunden?

Iteration bis User approved. Approved Pilot-Output wird **Template-Prompt-Basis** für die 7 Rollout-Bundles.

### Phase E — Rollout (nach Pilot-Approval)

**Source-Map** pro Familie (fest in Subagent-Prompts):

| Familie | URLs (primär → sekundär) |
|---|---|
| ISO 20022 pain/camt/pacs | iso20022.org Message Definitions + SWIFT CBPR+ Usage Guidelines |
| EPC SEPA (für SEPA-Spezifika) | europeanpaymentscouncil.eu Document Library (SCT C2B IG, SDD C2B IG) |
| SWIFT MT | Paiementor + paiementor.com oder ISO-Mapping-Guides (public MT-Docs) |
| DE Legacy (DTAUS/DTAZV) | bundesbank.de → DFÜ-Vereinbarung |
| UK (Bacs/FPS) | pay.uk + bacs.co.uk |
| NL/FR (CLIEOP/LCR-MAG) | cfonb.org (FR), bekannte Archive (NL-Legacy dünn, akzeptieren) |
| ES (Cuaderno 34) | aebanca.es Cuadernos |
| IT Local (CBI/FatturaPA/RIBA/SEDA) | cbi-org.eu, fatturapa.gov.it, abi.it |
| US (Fedwire/NACHA) | frbservices.org, achdevguide.nacha.org |
| JP (Zengin) | zenginkyo.or.jp |

**7 parallele Subagent-Bundles** (analog Formate-v2-Rollout):
1. pain-rest: pain.002, .003, .007, .008, .013
2. camt: camt.052, .053, .054
3. pacs-gpi: pacs.008, CBPR+, MX gpi
4. swift-mt: MT101, MT103, MT202, MT940, MT942
5. eu-legacy: Bacs, CLIEOP, Cuaderno 34, DTAUS, DTAZV, LCR-MAG, Faster Payments
6. italy-local: CBI, FatturaPA, RIBA, SEDA
7. us-jp-local: Fedwire FAIM, NACHA, Zengin Text

Pro Bundle:
- Ein Subagent mit Opus-Modell
- URL-Liste der Familie + Pilot-Template als Referenz
- Output: ein SQL-File pro Bundle mit `UPDATE format_entries SET structure=...::jsonb, migrations=...::jsonb, ... WHERE format_name IN (...)` für alle Formate der Familie
- SQL-File in `/tmp/formate-v3-<bundle>.sql` ablegen, Orchestrator führt `psql -f` aus

**Stichproben-Review:** User öffnet pro Familie je 1 Format in `/formate`, checkt Plausibilität.

## Qualitäts-Regeln für Subagents

Feste Bestandteile jedes Subagent-Prompts:

1. **Pflicht-Quellen**: die in der Source-Map genannten URLs müssen zitiert werden.
2. **Halluzinations-Verbot**: keine Elementnamen / Cardinalities / TCODES erfinden — nur was in der abgerufenen Spec / OSS-Note steht.
3. **Quellenangabe**: pro FormatContent ein Feld `source_refs: string[]` hinzufügen (neue Schema-Column, JSON-Array mit URL + Abrufdatum).
4. **Unsicherheit signalisieren**: wenn eine Quelle nicht zugänglich ist (PDF hinter Paywall, Website verweigert WebFetch), Subagent markiert das Format mit `content_status: 'partial'` und erklärt in einem Comment, welche Info fehlt.

## Schema-Zusatz (Qualitätssicherung)

```
ALTER TABLE format_entries
  ADD COLUMN source_refs jsonb,      -- [{url, retrieved_at}]
  ADD COLUMN content_status text;    -- 'verified' | 'partial' | 'unknown'
```

## Out-of-Scope

- **Kein automatischer Spec-Sync**: keine Cron-Jobs, keine Nightly-Updates
- **Kein Inline-Editor für Strukturbaum**: JSON-Edit nur über `/edit/format_entries/:id` oder SQL
- **Keine Versionierung der JSON-Felder** (bestehendes `entry_audit` greift via Trigger auf `format_entries`)
- **Keine Migration-Diffs für SWIFT MT / Legacy-Formate** — dort reicht Referenz auf SWIFT Standards Release Guide

## Risiken / Mitigation

| Risiko | Mitigation |
|---|---|
| iso20022.org MessageDefinitionReport-PDFs schwer per WebFetch lesbar | Fallback auf XSD-Datei direkt (öffentlich, plain XML) |
| SAP-OSS-Notes hinter Login | WebSearch nach öffentlichen Zusammenfassungen, Subagent markiert Note-Nr zur User-Verifikation |
| Legacy-Formate ohne aktive Quelle (CLIEOP, LCR-MAG) | Akzeptieren: `content_status: 'partial'` mit Hinweis „Quelle historisch, nur für Archiv-Zwecke" |
| Halluzinations-Drift bei großen Subagent-Prompts | Pilot-first: pain.001 wird Goldstandard, 7 Bundles erst danach mit dem genauen Prompt-Template |
| 31 Formate × 7 JSONB-Felder — große SQL-Patches | UPDATE-Statements werden pro Bundle in SQL-Files abgelegt, Orchestrator führt sie einzeln aus, Review pro Familie |

## Erfolgs-Kriterium

Jedes Format hat in `/formate`:
- Management Summary als Bullet-Liste (3–5 Punkte), inhaltlich aus Spec abgeleitet
- SAP-Mapping mit min. 3 konkreten TCODES/Tabellen + 1 OSS-Note-Referenz
- Nachrichtenstruktur mit min. 10 Top-Level-Feldern mit korrekter Cardinality + Datentyp
- `source_refs` mit min. 2 URLs + Abrufdatum
- `content_status: 'verified'` oder `'partial'` (niemals `'unknown'`)
