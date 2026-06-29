# Scope-Analyse Wizard — Design Spec

**Ziel:** Ein Projekt-Scoping-Tool das anhand von Heimatland, Operationsländern und Hausbank-Ländern alle relevanten KB-Inhalte für ein Treasury-Projekt filtert und strukturiert aufbereitet.

**Route:** `/scope`

---

## Architektur

Eine einzelne Seite `/scope` — kein mehrstufiger Wizard-Flow. Aufbau von oben nach unten:

1. Liste gespeicherter Analysen (falls vorhanden)
2. Eingabeformular
3. Report-Karten (erscheinen nach "Analyse starten")

Neue DB-Tabelle `scope_analyses` speichert nur Eingabeparameter + Projektname + Zeitstempel. Das Ergebnis wird bei jedem Laden neu aus den aktuellen KB-Daten berechnet — keine Ergebnis-Snapshots. So bleiben gespeicherte Analysen automatisch aktuell.

Neuer Menüpunkt + Dashboard-Kachel als Einstiegspunkte.

---

## Eingabe

Drei Felder auf einer Zeile:

| Feld | Typ | Beschreibung |
|---|---|---|
| **Heimatland** | Dropdown, Pflicht | Ein Land — bestimmt Primär-Protokoll und Regulatorik-Basis |
| **Operationsländer** | Multi-Select + Suchfeld, Chips | Länder aus den 33 KB-Ländern; Freitext für nicht erfasste möglich |
| **Hausbank-Länder** | Multi-Select + Suchfeld, Chips | Gleiche Komponente wie Operationsländer |

Drei optionale Checkboxen:
- `Konzern / Gruppenstruktur` → aktiviert IHB/POBO/COBO-Auswertung
- `Nur SAP S/4HANA` → filtert Technik-Empfehlungen auf S/4-relevante Komponenten
- `Dringend (< 3 Monate Go-Live)` → hebt Komplexitäts-Warnungen stärker hervor

Button **"Analyse starten →"** löst die Berechnung aus. Projektname wird erst beim Speichern abgefragt (Modal), nicht vorher.

---

## Analyse-Engine (Mapping-Logik)

Alle ausgewählten Länder (Heimatland + Ops-Länder + Hausbank-Länder, dedupliziert) werden gegen die KB-Daten gemappt:

| KB-Bereich | Datenquelle | Filter-Logik |
|---|---|---|
| **Regulatorik** | `regulatorik_entries` | `geltungsbereich` matcht gegen Länder/Regionen der Auswahl |
| **Formate** | `format_entries` | `region`-Feld (z.B. "SEPA", "Global", "US") |
| **Clearing** | `clearing_entries` | `region`-Feld + Länder-Überschneidung |
| **Zahlungsarten** | `zahlungsart_entries` | `laenderverfuegbarkeit`-Feld |
| **IHB/POBO/COBO** | `ihb_entries` | Alle ausgewählten Länder — nur wenn Konzern-Flag gesetzt |
| **Technik** | `technik_entries` | Regelbasiert: DACH → EBICS; mind. 1 Nicht-EU → SWIFT; immer H2H als Option |
| **Länder** | `countries` | Alle ausgewählten Länder als Karten |
| **SAP** | `sap_implementation_phases` | Abhängig von Technik-Empfehlung + IHB-Flag |

Freitext-Länder (nicht in KB erfasst) werden als Hinweis angezeigt: "Kein KB-Eintrag vorhanden" — kein Fehler.

**Technik-Regelwerk:**
- Heimatland oder Ops-Land in {DE, AT, CH, FR} → EBICS als Primär-Protokoll
- Mind. 1 Land außerhalb EU/DACH → SWIFT zusätzlich
- H2H immer als mögliche Alternative aufführen
- SAP MBC wenn kein lokaler EBICS-Client gewünscht (S/4HANA-Flag)

---

## Ergebnis-Layout

**Summary-Banner** ganz oben: `{N} Länder · {M} Regionen · Protokoll: {X} · {K} Komplexitäts-Warnungen`

Darunter 7 Report-Karten, jede mit direktem Link in die KB:

1. **Verbindungsprotokoll** — Primärempfehlung + Alternativen, Komplexität 1–5, Link → `/technik`
2. **Zahlungsformate** — relevante Formate als Tags, gruppiert nach Region, Link → `/formate`
3. **Clearing-Systeme** — Liste je Region/Land mit Cut-off-Zeiten, Link → `/clearing`
4. **Regulatorik** — zutreffende Vorschriften sortiert nach Dringlichkeit, Link → `/regulatorik`
5. **IHB / POBO / COBO** — Ampel je Land (🟢/🟡/🔴), nur wenn Konzern-Flag gesetzt, Link → `/laender`
6. **Länderspezifika** — kompakte Karte je ausgewähltem Land (Währung, Infrastruktur, Komplexität), Link → `/laender/[code]`
7. **SAP-Konfiguration** — benötigte Komponenten + Links → `/sap/implementierung`

**"Analyse speichern"**-Button unten rechts → Modal mit Projektname-Eingabe → speichert in `scope_analyses`.

---

## Persistence

### DB-Tabelle `scope_analyses`

```
id              uuid PK
name            text (Projektname, optional)
heimatland      text (ISO-Code, z.B. "DE")
ops_laender     text[] (ISO-Codes)
hausbank_laender text[] (ISO-Codes)
flag_konzern    boolean default false
flag_s4hana     boolean default false
flag_dringend   boolean default false
created_at      timestamp
```

### UX

- Gespeicherte Analysen erscheinen als schmale Liste **oberhalb des Eingabeformulars** auf `/scope`
- Format: `[Projektname] · [Datum] · [Heimatland] + [N] Länder`
- Klick → Eingabeparameter ins Formular laden + Analyse automatisch starten
- Max. 10 zuletzt gespeicherte werden angezeigt (ältere bleiben in DB)
- Löschen per ×-Button in der Liste

---

## Navigation

### Menü (`nav-items.ts`)
- Neuer Eintrag **"Scope-Analyse"** an zweiter Position (nach Dashboard, vor Regulatorik)
- Icon: Kompass oder Zielscheibe (SVG inline)
- `href: "/scope"`

### Dashboard (`/`)
- Prominente Kachel oben: **"Projekt analysieren →"**
- Teaser: "Wähle Länder und erhalte alle relevanten KB-Inhalte für dein Projekt"
- Zeigt letzte gespeicherte Analyse als Schnellzugang (falls vorhanden)
- Klick → `/scope`

### `.gitignore`
- `.superpowers/` eintragen (Brainstorm-Artefakte)

---

## Dateien (neu / geändert)

**Neu:**
- `app/scope/page.tsx` — Server Component, lädt `scope_analyses` + KB-Daten
- `app/scope/scope-client.tsx` — Client Component, Eingabeformular + Report
- `app/scope/scope-engine.ts` — reine Funktion, nimmt Params → gibt ReportData zurück
- `app/api/scope/save/route.ts` — POST: speichert Analyse
- `app/api/scope/[id]/route.ts` — DELETE: löscht Analyse
- `db/schema.ts` — `scope_analyses` Tabelle ergänzen
- `db/migrations/` — Migration für neue Tabelle

**Geändert:**
- `components/shell/nav-items.ts` — neuer Menüpunkt
- `app/page.tsx` — Dashboard-Kachel ergänzen
- `.gitignore` — `.superpowers/` ergänzen
