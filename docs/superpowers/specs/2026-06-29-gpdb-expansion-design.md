# GPDB Expansion — Design Spec

**Datum:** 2026-06-29  
**Status:** Approved  
**Scope:** Erweiterung von Payments KB (gpdb.norinit.de) zu einer zentralen Wissensdatenbank mit drei Säulen

---

## Überblick

Die bestehende App wird von einer reinen Regulatorik-Datenbank zu einer **zentralen Payments-Wissensdatenbank** erweitert. Drei gleichwertige Bereiche, ein globaler KI-Chat.

### Drei Säulen

| Bereich | Inhalt | Status |
|---|---|---|
| **Regulatorik** | Länderprofile, Formate, Clearing, Zahlungsarten, IHB/POBO | Bestehend, unverändert |
| **Technik** | Verbindungsprotokolle: EBICS, H2H, SAP MBC, SWIFT, SWIFT Service Bureau | Neu |
| **SAP** | Produktroadmap + typische Implementierungspfade | Neu |

---

## Navigation

Top-Level Tabs in der bestehenden Navbar:

```
[ Regulatorik ] [ Technik ] [ SAP ]          [✦ Chat]
```

- Regulatorik-Tab führt zu den bestehenden Unterseiten (unverändert)
- Technik-Tab führt zur Protokoll-Übersichtsseite
- SAP-Tab führt zur SAP-Startseite mit Sub-Tabs
- Chat ist global und durchsucht alle drei Bereiche

---

## Bereich: Technik

### Übersichtsseite `/technik`

Karten-Grid mit allen Protokollen. Jede Karte zeigt:
- Name + kurze Beschreibung
- Kategorie-Badge (z.B. "DACH Standard", "SAP-nativ", "Global")
- 2–3 Tag-Chips (Technologien, Formate)
- Klick → Detailseite

Filter-Bar oben: Alle / Bank-seitig / SAP-nativ / SWIFT

"+ Protokoll hinzufügen"-Kachel am Ende des Grids — nur sichtbar wenn eingeloggt (alle Nutzer sind eingeloggt), führt aber vorerst zu keiner UI-Seite (Out of Scope). Kachel zeigt Hinweis "Neues Protokoll: DB-Seeding via Script".

### Protokoll-Detailseite `/technik/[slug]`

**Steckbrief-Header** (strukturierte Felder, grüner Hintergrund):
- Name + Langbezeichnung
- Kategorie-Badges
- 8-Felder-Grid: Einsatzgebiet, Sicherheit, Verbreitung, SAP-Integration, Version aktuell, Formate, Alternativen, Komplexität Setup

**Artikel-Body** darunter:
- Fließtext aus `gpdb_06_technik.md` (RAG-indexiert)
- Die MD-Datei ist nach Protokoll-Slug in H2-Abschnitte gegliedert (`## ebics`, `## h2h` etc.). Die Detailseite rendert den passenden Abschnitt via einfachem String-Match auf den Slug.
- Abschnitte pro Protokoll: Funktionsweise, Sicherheit/Setup, SAP-Konfiguration, Häufige Fehler, Vergleich zu Alternativen

### Initiale Protokolle (5)

1. **EBICS** — Electronic Banking Internet Communication Standard
2. **H2H** — Host-to-Host via SFTP/AS2
3. **SAP MBC** — Multi-Bank Connectivity (SAP-nativ, Cloud)
4. **SWIFT** — Interbanken-Netzwerk (MT + MX/gpi)
5. **SWIFT Service Bureau** — Managed SWIFT-Zugang über Drittanbieter

### DB-Tabelle: `technik_entries`

```sql
id          text PRIMARY KEY  -- slug, z.B. "ebics"
name        text NOT NULL
subtitle    text              -- Langbezeichnung
category    text              -- "bank", "sap", "swift"
badges      jsonb             -- Array von Badge-Labels
einsatzgebiet text
sicherheit  text
verbreitung text
sap_integration text
version_aktuell text
formate     text[]
alternativen text[]
komplexitaet int              -- 1–5
tags        text[]
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

Artikel-Content lebt in `content/gpdb_06_technik.md` — kein DB-Feld. RAG indexiert die MD-Datei.

---

## Bereich: SAP

### Startseite `/sap` mit zwei Sub-Tabs

#### Sub-Tab 1: Produktroadmap

Timeline-View (vertikal, neueste oben). Jeder Eintrag:
- Titel + Release-Datum (Badge)
- Kurzbeschreibung (1–2 Sätze)
- Farb-Codierung: blau = angekündigt, grün = verfügbar, grau = geplant/future

Initiale Einträge aus `gpdb_07_sap.md`.

#### Sub-Tab 2: Implementierungspfade

5-Phasen-Kachel-Übersicht (horizontal, farbkodiert):
1. Blueprint — Bankenlandschaft, Formate, Clearing analysieren
2. Connectivity — EBICS/H2H Setup, Bankschlüssel, MBC Konfiguration  
3. Formate — DMEE/DMEEX, pain.001, Zahlungsträger
4. Test — Banktest, Pilotbuchungen, Fehlerbehandlung
5. Go-Live — Cutover, Hypercare, Monitoring

Jede Phase verlinkt auf ausführlichen Artikel-Abschnitt in `gpdb_07_sap.md`.

### DB-Tabellen

**`sap_roadmap_items`**
```sql
id          serial PRIMARY KEY
title       text NOT NULL
description text
release_date date
status      text              -- "available", "announced", "planned"
tags        text[]
sort_order  int
```

**`sap_implementation_phases`**
```sql
id          serial PRIMARY KEY
phase_nr    int NOT NULL      -- 1–5
title       text NOT NULL
description text
color       text              -- Tailwind color key
md_anchor   text              -- Anker in gpdb_07_sap.md
```

---

## KI-Chat

- Bestehender Chat-Mechanismus bleibt unverändert
- RAG-Index wird um zwei neue MD-Dateien erweitert: `gpdb_06_technik.md` und `gpdb_07_sap.md`
- System-Prompt erhält Hinweis auf alle drei Bereiche
- Quellenangaben im Chat zeigen Bereich-Label (Regulatorik / Technik / SAP) — ermittelt aus dem Dateinamen des RAG-Chunks: `gpdb_01–05` → Regulatorik, `gpdb_06` → Technik, `gpdb_07` → SAP

---

## Neue Dateien & Routen

### Content-Dateien (neu zu erstellen)
- `content/gpdb_06_technik.md` — Artikel zu allen 5 Protokollen
- `content/gpdb_07_sap.md` — SAP Roadmap + Implementierungspfade

### Routen (neu)
```
/technik                    → Protokoll-Grid
/technik/[slug]             → Protokoll-Detailseite
/sap                        → SAP Startseite (redirect → /sap/roadmap)
/sap/roadmap                → Timeline-View
/sap/implementierung        → 5-Phasen-Übersicht
```

### API-Routen (neu)
```
/api/technik/route.ts       → GET alle Protokolle
/api/technik/[slug]/route.ts → GET einzelnes Protokoll
/api/sap/roadmap/route.ts   → GET Roadmap-Einträge
/api/sap/implementierung/route.ts → GET Phasen
```

### DB-Migrationen (neu)
- `technik_entries` Tabelle
- `sap_roadmap_items` Tabelle
- `sap_implementation_phases` Tabelle

---

## Architekturentscheidungen

**Hybrid DB + MD (Ansatz C):**
- DB speichert strukturierte Steckbrief-Metadaten → ermöglicht Filtern, Karten-Grid, strukturierte Anzeige
- MD-Dateien speichern Artikel-Content → kein Schema-Change nötig bei neuen Inhalten, RAG-ready
- Neue Protokolle = neuer DB-Eintrag + neuer Abschnitt in MD

**Regulatorik bleibt unverändert** — keine Migration bestehender Daten, keine UI-Änderungen in diesem Bereich.

**Navbar-Erweiterung** — bestehende Navbar erhält zwei neue Top-Level-Einträge. Chat-Button bleibt rechts.

---

## Out of Scope

- Admin-UI für Technik/SAP Einträge (manuelles DB-Seeding via Scripts)
- Mehrsprachigkeit
- Öffentlicher Zugang (App bleibt passwortgeschützt)
- Mobile-Optimierung (App ist Desktop-first)
