# GPDB Expansion — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Payments KB um zwei neue Wissens-Säulen erweitern — Technik (EBICS, H2H, SAP MBC, SWIFT, SWIFT Service Bureau) und SAP (Produktroadmap + Implementierungspfade) — mit Hybrid DB+MD Architektur.

**Architecture:** Drei neue DB-Tabellen für strukturierte Metadaten (Steckbrief-Felder), zwei neue MD-Dateien für Artikel-Content (RAG-indexiert via reindex). Server-Komponenten fetchen direkt per Drizzle, kein separater API-Layer nötig.

**Tech Stack:** Next.js 16, Drizzle ORM, Neon Postgres, Tailwind CSS, shadcn/ui, react-markdown + remark-gfm, Vitest

---

## Dateiübersicht

| Datei | Aktion |
|---|---|
| `db/schema.ts` | Modify — 3 neue Tabellen |
| `lib/ingest/reindex.ts` | Modify — SECTION_MAP + SLUG_MAP erweitern |
| `lib/technik/parse-md.ts` | Create — MD-Abschnitt per Slug extrahieren |
| `lib/queries/technik.ts` | Create — Drizzle Queries für technik_entries |
| `lib/queries/sap.ts` | Create — Drizzle Queries für sap_* Tabellen |
| `components/shell/nav-items.ts` | Modify — 2 neue Nav-Items |
| `components/sap/sap-subtabs.tsx` | Create — Sub-Tab Nav Technik/SAP-intern |
| `app/technik/page.tsx` | Create — Protokoll-Grid (Server) |
| `app/technik/technik-client.tsx` | Create — Card Grid + Filter (Client) |
| `app/technik/[slug]/page.tsx` | Create — Detailseite (Server) |
| `app/technik/[slug]/technik-detail-client.tsx` | Create — Steckbrief + Artikel (Client) |
| `app/sap/page.tsx` | Create — Redirect → /sap/roadmap |
| `app/sap/roadmap/page.tsx` | Create — Timeline-View (Server) |
| `app/sap/roadmap/sap-roadmap-client.tsx` | Create — Timeline (Client) |
| `app/sap/implementierung/page.tsx` | Create — 5-Phasen (Server) |
| `app/sap/implementierung/sap-implementierung-client.tsx` | Create — Phasen-Kacheln (Client) |
| `scripts/seed-technik.ts` | Create — 5 Protokolle seeden |
| `scripts/seed-sap.ts` | Create — Roadmap + Phasen seeden |
| `content/gpdb_06_technik.md` | Create — Artikel zu allen 5 Protokollen |
| `content/gpdb_07_sap.md` | Create — SAP Roadmap + Implementierungspfade |
| `tests/lib/technik/parse-md.test.ts` | Create — Unit-Test für MD-Parser |

---

## Task 1: DB Schema — drei neue Tabellen

**Files:**
- Modify: `db/schema.ts`

- [ ] **Step 1: Drei Tabellen ans Ende von `db/schema.ts` anhängen**

```typescript
// ============================================================
// technik_entries — Verbindungsprotokoll-Steckbriefe
// ============================================================

export const technikEntries = pgTable('technik_entries', {
  id: text('id').primaryKey(), // slug, z.B. "ebics"
  name: text('name').notNull(),
  subtitle: text('subtitle'),
  category: text('category').notNull(), // 'bank' | 'sap' | 'swift'
  badges: jsonb('badges').$type<string[]>().default([]),
  einsatzgebiet: text('einsatzgebiet'),
  sicherheit: text('sicherheit'),
  verbreitung: text('verbreitung'),
  sap_integration: text('sap_integration'),
  version_aktuell: text('version_aktuell'),
  formate: text('formate').array().default([]),
  alternativen: text('alternativen').array().default([]),
  komplexitaet: integer('komplexitaet'), // 1–5
  tags: text('tags').array().default([]),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// sap_roadmap_items — SAP Produktroadmap Einträge
// ============================================================

export const sapRoadmapItems = pgTable('sap_roadmap_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  release_date: text('release_date'), // "Q4 2025", "2027+"
  status: text('status').notNull().default('planned'), // 'available' | 'announced' | 'planned'
  tags: text('tags').array().default([]),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// sap_implementation_phases — Implementierungspfad Phasen
// ============================================================

export const sapImplementationPhases = pgTable('sap_implementation_phases', {
  id: uuid('id').primaryKey().defaultRandom(),
  phase_nr: integer('phase_nr').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  color: text('color').notNull(), // Tailwind color key: 'blue' | 'green' | 'yellow' | 'orange' | 'purple'
  md_anchor: text('md_anchor'), // Anker in gpdb_07_sap.md
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

- [ ] **Step 2: Migration generieren**

```bash
npx drizzle-kit generate
```

Erwartet: neue Datei `db/migrations/0014_technik_sap_tables.sql` (oder ähnliche Nummer)

- [ ] **Step 3: Migration anwenden**

```bash
npx drizzle-kit migrate
```

Erwartet: `[✓] migrations applied` ohne Fehler

- [ ] **Step 4: Commit**

```bash
git add db/schema.ts db/migrations/
git commit -m "feat(db): add technik_entries, sap_roadmap_items, sap_implementation_phases tables"
```

---

## Task 2: Reindex-Konfiguration für neue Sections

**Files:**
- Modify: `lib/ingest/reindex.ts`

- [ ] **Step 1: SECTION_MAP und SLUG_MAP in `lib/ingest/reindex.ts` erweitern**

Aktuell:
```typescript
const SECTION_MAP: Record<string, string> = {
  '01_regulatorik': 'regulatorik',
  '02_formate': 'formate',
  '03_clearing_zahlungsarten': 'clearing',
  '04_ihb_komplexitaet': 'ihb',
  '05_italien': 'laender',
};

const SLUG_MAP: Record<string, string> = {
  regulatorik: 'regulatorik',
  formate: 'formate',
  clearing: 'clearing',
  ihb: 'ihb',
  laender: 'italien',
};
```

Ersetzen durch:
```typescript
const SECTION_MAP: Record<string, string> = {
  '01_regulatorik': 'regulatorik',
  '02_formate': 'formate',
  '03_clearing_zahlungsarten': 'clearing',
  '04_ihb_komplexitaet': 'ihb',
  '05_italien': 'laender',
  '06_technik': 'technik',
  '07_sap': 'sap',
};

const SLUG_MAP: Record<string, string> = {
  regulatorik: 'regulatorik',
  formate: 'formate',
  clearing: 'clearing',
  ihb: 'ihb',
  laender: 'italien',
  technik: 'technik',
  sap: 'sap',
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/ingest/reindex.ts
git commit -m "feat(ingest): add technik + sap sections to reindex map"
```

---

## Task 3: MD-Parser Utility + Test

**Files:**
- Create: `lib/technik/parse-md.ts`
- Create: `tests/lib/technik/parse-md.test.ts`

- [ ] **Step 1: Failing Test schreiben**

Erstelle `tests/lib/technik/parse-md.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { extractSection } from '@/lib/technik/parse-md';

describe('extractSection', () => {
  const md = `# Technische Verbindungsstandards

## ebics

EBICS Inhalt hier.

### Unterabschnitt

Mehr Inhalt.

## h2h

H2H Inhalt hier.

## swift

SWIFT Inhalt.
`;

  it('extracts matching section content', () => {
    const result = extractSection(md, 'ebics');
    expect(result).toContain('EBICS Inhalt hier.');
    expect(result).toContain('Unterabschnitt');
    expect(result).not.toContain('H2H Inhalt');
  });

  it('extracts last section correctly', () => {
    const result = extractSection(md, 'swift');
    expect(result).toContain('SWIFT Inhalt.');
    expect(result).not.toContain('EBICS');
  });

  it('returns null for unknown slug', () => {
    expect(extractSection(md, 'unknown')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(extractSection('', 'ebics')).toBeNull();
  });
});
```

- [ ] **Step 2: Test ausführen — muss FAIL**

```bash
npx vitest run tests/lib/technik/parse-md.test.ts
```

Erwartet: FAIL mit "Cannot find module '@/lib/technik/parse-md'"

- [ ] **Step 3: Implementation schreiben**

Erstelle `lib/technik/parse-md.ts`:

```typescript
/**
 * Extracts the content of a top-level H2 section (## slug) from a markdown file.
 * Returns null if the slug is not found.
 */
export function extractSection(md: string, slug: string): string | null {
  if (!md.trim()) return null;

  const lines = md.split('\n');
  const headerPattern = new RegExp(`^##\\s+${slug}\\s*$`, 'i');

  let inSection = false;
  const sectionLines: string[] = [];

  for (const line of lines) {
    if (inSection) {
      // Stop at next H2 (but not H3+)
      if (/^##\s+/.test(line) && !/^###/.test(line)) break;
      sectionLines.push(line);
    } else if (headerPattern.test(line)) {
      inSection = true;
    }
  }

  if (!inSection) return null;
  return sectionLines.join('\n').trim() || null;
}
```

- [ ] **Step 4: Test ausführen — muss PASS**

```bash
npx vitest run tests/lib/technik/parse-md.test.ts
```

Erwartet: 4 Tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/technik/parse-md.ts tests/lib/technik/parse-md.test.ts
git commit -m "feat(technik): add extractSection MD parser with tests"
```

---

## Task 4: Content-Dateien erstellen

**Files:**
- Create: `content/gpdb_06_technik.md`
- Create: `content/gpdb_07_sap.md`

- [ ] **Step 1: `content/gpdb_06_technik.md` erstellen**

```markdown
# Technische Verbindungsstandards

Überblick über die wichtigsten Verbindungsprotokolle für den elektronischen Zahlungsverkehr zwischen Unternehmen und Banken.

## ebics

### Überblick

EBICS (Electronic Banking Internet Communication Standard) ist der in DACH und Frankreich dominierende Standard für den sicheren Datenaustausch zwischen Unternehmen und Banken über das Internet. Er wird vom Zentralen Kreditausschuss (ZKA) betrieben und ist seit 2008 Pflichtstandard der deutschen Banken.

### Funktionsweise

EBICS basiert auf einem dreistufigen Sicherheitsmodell mit drei RSA-Schlüsselpaaren pro Teilnehmer:
- **A005 / A006**: Authentisierungsschlüssel (Signatur der Aufträge)
- **X002**: Verschlüsselungsschlüssel (Transportverschlüsselung)
- **E002**: Initialisierungsschlüssel (Erstinitialisierung)

Jede EBICS-Transaktion durchläuft vier Phasen: Initialisierung, Übertragung, Quittierung und Validierung. Die Bank prüft Signatur und Berechtigung, bevor Dateien verarbeitet werden.

### EBICS 3.0 Neuerungen

EBICS 3.0 (2018) vereinheitlicht die europäischen EBICS-Dialekte. Wichtigste Änderungen:
- Harmonisierte Auftragsarten (BTF - Business Transaction Format) ersetzen länderspezifische Codes
- Verbesserte Zertifikatsunterstützung (X.509)
- Einheitliche Fehlerbehandlung

### SAP-Konfiguration

In SAP wird EBICS über folgende Komponenten konfiguriert:
- **BCM (Bank Communication Management)**: Zentrales Cockpit für EBICS-Verbindungen
- **MBC (Multi-Bank Connectivity)**: Cloud-basierter EBICS-Zugang ohne lokale Installation
- **DME Engine**: Generierung der Zahlungsdateien (pain.001, pain.008)

Technische Schritte: Bankschlüssel initialisieren → Zertifikate austauschen → Kommunikationstest → Pilotbuchung

### Häufige Fehler

- **EBICS_INVALID_USER_STATE**: Benutzer noch nicht aktiviert oder gesperrt — Bankrückfrage nötig
- **EBICS_AUTHENTICATION_FAILED**: Falscher Authentisierungsschlüssel — Schlüssel neu einreichen
- **EBICS_TX_ABORT**: Transaktionsabbruch wegen Timeout — Dateiübertragung wiederholen
- Schlüsseldatei verloren: Neues Ini-Schreiben und erneute Bankfreigabe erforderlich

### Vergleich zu Alternativen

| Merkmal | EBICS | H2H | SWIFT |
|---|---|---|---|
| Verbreitung | DACH + FR | Bilateral | Global |
| Aufwand Setup | Mittel | Hoch | Sehr hoch |
| Kosten | Niedrig | Mittel | Hoch |
| SAP-Nativ | Ja (BCM/MBC) | Nein | Teilweise |

---

## h2h

### Überblick

Host-to-Host (H2H) bezeichnet eine direkte Punkt-zu-Punkt-Verbindung zwischen dem ERP-System des Unternehmens und dem Bankrechner, typischerweise über SFTP oder AS2. Keine Middleware, keine Standard-Protokollschicht — jede Bank definiert ihr eigenes Setup.

### Funktionsweise

Das Unternehmen stellt Zahlungsdateien (pain.001, proprietäre Formate) auf einen SFTP-Server der Bank bereit. Die Bank verarbeitet die Dateien und stellt Statusrückmeldungen (pain.002, camt.053) zurück. Die Verbindung läuft über SSH-Schlüssel oder Zertifikate.

### SAP-Konfiguration

In SAP wird H2H meist über externe Middleware (z.B. Axway, IBM Sterling) oder direkte SFTP-Integrationen realisiert. Der Prozess:
1. SFTP-Verbindungsparameter in SAP hinterlegen (Transaktion FI12 oder BCM)
2. Dateipfade und Dateinamensmuster mit Bank abstimmen
3. Zeitgesteuerte Jobs für Upload/Download konfigurieren (SM36)
4. Statusmonitoring einrichten

### Häufige Fehler

- SSH-Schlüsselablauf: Schlüssel haben Gültigkeitsdauer — Erneuerungsprozess mit Bank vereinbaren
- Dateinamenkonventionen: Jede Bank hat eigene Regeln — genaue Abstimmung nötig
- Zeitzonendifferenzen bei Cut-off-Zeiten führen zu verspäteten Buchungen

### Vergleich zu Alternativen

H2H ist sinnvoll wenn: Großvolumige Transaktionen, spezifische Bankanforderungen, EBICS nicht verfügbar (z.B. außerhalb DACH). Nachteil: Hoher Einrichtungsaufwand, kein Standard.

---

## sap-mbc

### Überblick

SAP Multi-Bank Connectivity (MBC) ist ein cloudbasierter SAP-eigener Service, der Unternehmen eine standardisierte Verbindung zu mehreren Banken über ein zentrales SAP-Netzwerk ermöglicht — ohne lokale Middleware oder individuelle H2H-Verbindungen.

### Funktionsweise

MBC fungiert als Intermediär zwischen SAP S/4HANA und den teilnehmenden Banken. Das Unternehmen sendet Zahlungsdateien (pain.001) an MBC; MBC übersetzt und leitet sie bankspezifisch weiter. Verfügbar als Teil von SAP Business Technology Platform (BTP).

Vorteile:
- Einmalige Integration für alle teilnehmenden Banken
- Automatische Formatkonvertierung
- Zentrales Monitoring im SAP Cockpit
- Kein EBICS-Schlüsselmanagement nötig

### SAP-Konfiguration

1. MBC in SAP BTP aktivieren (über SAP Cloud Connector)
2. Bankverbindungen im MBC Portal anlegen
3. In S/4HANA: Zahlungsweg auf MBC-Kanal konfigurieren (FI12)
4. Test mit Pilotbank durchführen

### Häufige Fehler

- Nicht alle Banken sind MBC-Partner — vor Projekstart Bankenliste prüfen
- Cloud Connector Konfiguration fehleranfällig — SAP BTP Dokumentation beachten
- Latenz höher als bei direktem EBICS

---

## swift

### Überblick

SWIFT (Society for Worldwide Interbank Financial Telecommunication) ist das weltweite Interbanken-Netzwerk für internationale Zahlungen und Finanzinformationen. Corporates können über SWIFT-Direktmitgliedschaft oder Service Bureau auf das Netzwerk zugreifen.

### Nachrichtenformate

- **MT-Formate** (klassisch): MT101 (Überweisungsauftrag), MT940/942 (Kontoauszug), MT103 (Einzelüberweisung)
- **MX-Formate** (ISO 20022): pain.001, camt.053 — Migration bis 2025 abgeschlossen
- **SWIFT gpi**: Global Payments Innovation — Echtzeit-Tracking internationaler Zahlungen

### SWIFT-Zugang für Corporates

Corporates haben drei Zugangsmöglichkeiten:
1. **Direktmitglied** (MA-CUG): Eigene BIC, eigene Infrastruktur — aufwendig und teuer
2. **Service Bureau**: Zugang über Drittanbieter (→ siehe Service Bureau Artikel)
3. **Banken-Connectivity**: Bank stellt SWIFT-Kanal bereit (meistens EBICS oder H2H dahinter)

### SAP-Konfiguration

SWIFT-Integration in SAP läuft typischerweise über:
- **SAP Financial Services Network (FSN)**: SAP-eigener SWIFT-Kanal (ähnlich MBC)
- **Drittanbieter-Middleware**: Axway, SunGard, Finastra
- In BCM: SWIFT als Kommunikationskanal konfigurieren

### Häufige Fehler

- BIC/BICFI Verwechslung bei Migration (MT→MX): BICFI enthält immer 11 Zeichen
- gpi-Tracking funktioniert nur wenn alle Banken in der Kette gpi-fähig sind
- MT940 vs camt.053: Formatwechsel erfordert Anpassung der SAP-Kontoauszugsverarbeitung

---

## swift-service-bureau

### Überblick

Ein SWIFT Service Bureau ist ein zertifizierter Drittanbieter, der Corporates SWIFT-Netzzugang ohne eigene SWIFT-Infrastruktur ermöglicht. Das Bureau übernimmt Betrieb, Compliance und Wartung der SWIFT-Verbindung.

### Funktionsweise

Das Unternehmen sendet Zahlungsdateien an das Service Bureau (via SFTP oder API). Das Bureau übersetzt in SWIFT-Nachrichten und leitet über das SWIFT-Netz weiter. Statusrückmeldungen laufen denselben Weg zurück.

Bekannte Service-Bureau-Anbieter: Finastra, Axway, TCS, Société Générale

### Vorteile gegenüber Direktmitgliedschaft

- Keine eigene SWIFT-Infrastruktur nötig (kein HSM, kein Alliance-Server)
- Kein SWIFT-Compliance-Aufwand (wird vom Bureau übernommen
- Schnellerer Go-Live (Wochen statt Monate)
- Geringere laufende Kosten bei mittelgroßen Transaktionsvolumen

### Nachteile

- Abhängigkeit vom Bureau-Anbieter
- Höhere Transaktionskosten als Direktmitglied bei sehr hohem Volumen
- Datenschutz: Zahlungsdaten gehen durch Dritte

### SAP-Konfiguration

Die SAP-Integration erfolgt wie bei H2H — Verbindung zum Bureau via SFTP oder API. Das Bureau erscheint aus SAP-Sicht wie eine normale Bankverbindung.
```

- [ ] **Step 2: `content/gpdb_07_sap.md` erstellen**

```markdown
# SAP Treasury — Produktroadmap & Implementierung

Überblick über SAP-relevante Payment-Releases und typische Implementierungspfade für SAP Treasury/Payments-Projekte.

## produktroadmap

### Überblick

Die SAP-Produktroadmap für Payment-relevante Module zeigt geplante und verfügbare Features in S/4HANA, BCM, PAYM und MBC.

### S/4HANA 2025 — BCM Enhancement

EBICS 3.0 wird nativ unterstützt. Erweiterte pain.001 v09 Unterstützung. ISO 20022 MX Ready Certification für alle relevanten Module.

### SAP MBC 2.0 — Multi-Bank Connectivity

Neue Bank-Konnektoren für weitere europäische Banken. SWIFT gpi Integration für Echtzeit-Statustracking. Verbessertes Monitoring-Dashboard in BTP.

### PAYM Next-Gen (geplant 2027+)

Vollständige ISO 20022 Migration aller Zahlungsformate. ERP Payments Harmonisierung zwischen S/4HANA und ECC-Nachfolger. Vereinfachte BCM-Konfiguration durch geführte Einrichtungsassistenten.

## implementierung

### Phase 1: Blueprint

Ziel: Vollständiges Verständnis der Ist-Situation und Anforderungen.

Aktivitäten:
- Bankenlandschaft aufnehmen: Welche Banken, welche Konten, welche Währungen?
- Zahlungsformate ermitteln: Welche Formate erwartet jede Bank (pain.001 v3/v9, MT101, proprietär)?
- Clearing-Wege analysieren: SEPA, SWIFT, lokale Systeme
- IHB/POBO-Anforderungen prüfen: Rechtliche Freigaben, lokale Restriktionen
- Verbindungsprotokoll je Bank festlegen: EBICS, H2H, MBC, SWIFT

Typische Dauer: 2–4 Wochen. Wichtigstes Dokument: Banken-Konnektivitätsmatrix.

### Phase 2: Connectivity

Ziel: Technische Verbindung zu allen Banken aufgebaut und getestet.

Aktivitäten:
- EBICS: Bankschlüssel initialisieren, Zertifikate einreichen, Ini-Schreiben
- H2H: SFTP-Zugangsdaten beschaffen, Verbindungstest, Dateinamenkonventionen klären
- MBC: BTP-Konfiguration, Cloud Connector, Bankportale einrichten
- SAP BCM: Kommunikationskanäle anlegen (FI12), Zahlungsprogramm konfigurieren
- Banktest-Umgebungen nutzen — nicht direkt in Produktion testen

Typische Dauer: 3–6 Wochen. Häufiger Blocker: Banken-Ansprechpartner zu langsam.

### Phase 3: Formate

Ziel: Alle Zahlungsformate korrekt konfiguriert und validiert.

Aktivitäten:
- DMEE/DMEEX-Bäume anlegen oder importieren
- pain.001 Version je Bank festlegen (v3, v8, v9 — prüfen per Bankspezifikation)
- Zahlungsträger und Zahlwege in SAP konfigurieren (FBZP)
- Formatvalidierung mit echten Testdaten

Typische Dauer: 4–8 Wochen. Aufwand stark abhängig von Anzahl Banken und Formaatkomplexität.

### Phase 4: Test

Ziel: Alle Zahlungstypen mit echten Bankdaten erfolgreich getestet.

Aktivitäten:
- Pilotbuchungen mit Kleinstbeträgen (<1€) für jeden Zahlungsweg
- pain.002 Statusrückmeldungen prüfen und in SAP verarbeiten
- camt.053 Kontoauszüge einlesen und buchen
- Fehlerszenarien testen: abgelehnte Zahlungen, falsche IBANs, fehlende BICs
- Negativtests: zu späte Einreichung, überschrittene Limits

Typische Dauer: 3–5 Wochen. Zweite Runde häufig nötig nach Bankrückmeldungen.

### Phase 5: Go-Live

Ziel: Produktivschaltung mit sicherem Cutover und Hypercare.

Aktivitäten:
- Cutover-Plan erstellen: letzter Altlauf, erster Neulauf, Parallelphase
- Erste produktive Zahlungen mit erhöhter Aufmerksamkeit begleiten
- Monitoring-Dashboard einrichten (BCM Payment Monitor)
- Hypercare-Phase: 2–4 Wochen dedizierter Support
- Dokumentation finalisieren: Betriebshandbuch, Kontakte, Eskalationswege

Typische Dauer: 1–2 Wochen Cutover, 2–4 Wochen Hypercare.
```

- [ ] **Step 3: Commit**

```bash
git add content/gpdb_06_technik.md content/gpdb_07_sap.md
git commit -m "content: add gpdb_06_technik.md and gpdb_07_sap.md"
```

---

## Task 5: Navigation erweitern

**Files:**
- Modify: `components/shell/nav-items.ts`

- [ ] **Step 1: Zwei neue Einträge in `NAV_ITEMS` vor "Changelog" einfügen**

```typescript
  {
    label: "Technik",
    href: "/technik",
    iconPath:
      "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  },
  {
    label: "SAP",
    href: "/sap",
    iconPath:
      "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  },
```

Das vollständige Array sieht so aus (Technik und SAP zwischen Länder und Changelog):

```typescript
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    iconPath: "M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5zM9 22V12h6v10",
  },
  {
    label: "Regulatorik",
    href: "/regulatorik",
    iconPath: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2v8l5.5 3.18-.72 1.25L11 13.27V4h1z",
  },
  {
    label: "Formate",
    href: "/formate",
    iconPath: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h4v1.5H8V10z",
  },
  {
    label: "Clearing",
    href: "/clearing",
    iconPath: "M4 6h16M4 10h16M4 14h10M17 14l2 2 4-4",
  },
  {
    label: "Zahlungsarten",
    href: "/zahlungsarten",
    iconPath: "M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm0 4h20M6 15h2M10 15h4",
  },
  {
    label: "Länder",
    href: "/laender",
    iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
  },
  {
    label: "Technik",
    href: "/technik",
    iconPath: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  },
  {
    label: "SAP",
    href: "/sap",
    iconPath: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  },
  {
    label: "Changelog",
    href: "/changelog",
    iconPath: "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add components/shell/nav-items.ts
git commit -m "feat(nav): add Technik and SAP nav items"
```

---

## Task 6: Query-Funktionen

**Files:**
- Create: `lib/queries/technik.ts`
- Create: `lib/queries/sap.ts`

- [ ] **Step 1: `lib/queries/technik.ts` erstellen**

```typescript
import { db } from '@/db/client';
import { technikEntries } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export type TechnikEntry = typeof technikEntries.$inferSelect;

export async function getAllTechnikEntries(): Promise<TechnikEntry[]> {
  return db.select().from(technikEntries).orderBy(asc(technikEntries.name));
}

export async function getTechnikEntryBySlug(slug: string): Promise<TechnikEntry | null> {
  const rows = await db
    .select()
    .from(technikEntries)
    .where(eq(technikEntries.id, slug))
    .limit(1);
  return rows[0] ?? null;
}
```

- [ ] **Step 2: `lib/queries/sap.ts` erstellen**

```typescript
import { db } from '@/db/client';
import { sapRoadmapItems, sapImplementationPhases } from '@/db/schema';
import { asc } from 'drizzle-orm';

export type SapRoadmapItem = typeof sapRoadmapItems.$inferSelect;
export type SapImplementationPhase = typeof sapImplementationPhases.$inferSelect;

export async function getSapRoadmapItems(): Promise<SapRoadmapItem[]> {
  return db.select().from(sapRoadmapItems).orderBy(asc(sapRoadmapItems.sort_order));
}

export async function getSapImplementationPhases(): Promise<SapImplementationPhase[]> {
  return db.select().from(sapImplementationPhases).orderBy(asc(sapImplementationPhases.phase_nr));
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/queries/technik.ts lib/queries/sap.ts
git commit -m "feat(queries): add technik + sap query functions"
```

---

## Task 7: Seed-Skripte

**Files:**
- Create: `scripts/seed-technik.ts`
- Create: `scripts/seed-sap.ts`

- [ ] **Step 1: `scripts/seed-technik.ts` erstellen**

```typescript
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '@/db/client';
import { technikEntries } from '@/db/schema';

const ENTRIES = [
  {
    id: 'ebics',
    name: 'EBICS',
    subtitle: 'Electronic Banking Internet Communication Standard',
    category: 'bank',
    badges: ['DACH Standard', 'Bank-seitig'],
    einsatzgebiet: 'Massenzahlungen, Kontoauszüge',
    sicherheit: '3-Schlüssel (A005, X002, E002)',
    verbreitung: 'DACH + FR, sehr hoch',
    sap_integration: 'BCM, MBC, DME Engine',
    version_aktuell: 'EBICS 3.0',
    formate: ['pain.001', 'pain.008', 'camt.053'],
    alternativen: ['H2H', 'SWIFT'],
    komplexitaet: 3,
    tags: ['bank-seitig', 'pain.001', 'camt.053'],
  },
  {
    id: 'h2h',
    name: 'H2H',
    subtitle: 'Host-to-Host',
    category: 'bank',
    badges: ['Direktverbindung', 'Bank-seitig'],
    einsatzgebiet: 'Direktverbindung ERP → Bank via SFTP/AS2',
    sicherheit: 'SSH-Schlüssel, Zertifikate',
    verbreitung: 'Bilateral, mittel',
    sap_integration: 'BCM, externe Middleware (Axway, Sterling)',
    version_aktuell: 'Kein Standard — bankspezifisch',
    formate: ['pain.001', 'MT101', 'bankspezifisch'],
    alternativen: ['EBICS', 'MBC'],
    komplexitaet: 4,
    tags: ['bank-seitig', 'SFTP', 'AS2'],
  },
  {
    id: 'sap-mbc',
    name: 'SAP MBC',
    subtitle: 'Multi-Bank Connectivity',
    category: 'sap',
    badges: ['SAP-nativ', 'Cloud', 'S/4HANA'],
    einsatzgebiet: 'Zentrales SAP-Banknetzwerk ohne Middleware',
    sicherheit: 'SAP BTP, TLS, OAuth',
    verbreitung: 'Wachsend, S/4HANA-Fokus',
    sap_integration: 'Nativ in S/4HANA, BTP',
    version_aktuell: 'MBC 2.0',
    formate: ['pain.001', 'camt.053'],
    alternativen: ['EBICS', 'H2H'],
    komplexitaet: 3,
    tags: ['SAP-nativ', 'Cloud', 'S4HANA'],
  },
  {
    id: 'swift',
    name: 'SWIFT',
    subtitle: 'Society for Worldwide Interbank Financial Telecommunication',
    category: 'swift',
    badges: ['Global', 'Interbanken'],
    einsatzgebiet: 'Internationale Zahlungen und Finanzinformationen',
    sicherheit: 'SWIFT PKI, HSM, Alliance-Infrastruktur',
    verbreitung: 'Global, sehr hoch',
    sap_integration: 'SAP FSN, Drittanbieter-Middleware',
    version_aktuell: 'MX (ISO 20022) + SWIFT gpi',
    formate: ['MT101', 'MT940', 'pain.001', 'camt.053'],
    alternativen: ['EBICS (DACH)', 'MBC'],
    komplexitaet: 5,
    tags: ['SWIFT', 'Global', 'MT101', 'gpi', 'MX'],
  },
  {
    id: 'swift-service-bureau',
    name: 'SWIFT Service Bureau',
    subtitle: 'Managed SWIFT-Zugang über Drittanbieter',
    category: 'swift',
    badges: ['Global', 'Outsourcing'],
    einsatzgebiet: 'SWIFT-Zugang ohne eigene Infrastruktur',
    sicherheit: 'Über Bureau-Anbieter (HSM, Compliance)',
    verbreitung: 'Mittel, für mid-size Corporates',
    sap_integration: 'Wie H2H — SFTP/API zum Bureau',
    version_aktuell: 'Abhängig vom Bureau-Anbieter',
    formate: ['MT101', 'pain.001', 'camt.053'],
    alternativen: ['SWIFT Direktmitglied', 'EBICS'],
    komplexitaet: 3,
    tags: ['SWIFT', 'Outsourcing', 'Service-Bureau'],
  },
] as const;

async function seedTechnik() {
  console.log('Seeding technik_entries...');
  for (const entry of ENTRIES) {
    await db
      .insert(technikEntries)
      .values(entry)
      .onConflictDoUpdate({
        target: technikEntries.id,
        set: {
          name: entry.name,
          subtitle: entry.subtitle,
          category: entry.category,
          badges: entry.badges,
          einsatzgebiet: entry.einsatzgebiet,
          sicherheit: entry.sicherheit,
          verbreitung: entry.verbreitung,
          sap_integration: entry.sap_integration,
          version_aktuell: entry.version_aktuell,
          formate: entry.formate,
          alternativen: entry.alternativen,
          komplexitaet: entry.komplexitaet,
          tags: entry.tags,
          updated_at: new Date(),
        },
      });
    console.log(`  ✓ ${entry.name}`);
  }
  console.log('Done.');
  process.exit(0);
}

seedTechnik().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: `scripts/seed-sap.ts` erstellen**

```typescript
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '@/db/client';
import { sapRoadmapItems, sapImplementationPhases } from '@/db/schema';

const ROADMAP_ITEMS = [
  {
    title: 'S/4HANA 2025 — BCM Enhancement',
    description: 'EBICS 3.0 nativ, erweiterte pain.001 v09 Unterstützung, ISO 20022 MX Ready',
    release_date: 'Q4 2025',
    status: 'announced',
    tags: ['BCM', 'EBICS', 'ISO20022'],
    sort_order: 1,
  },
  {
    title: 'SAP MBC 2.0 — Multi-Bank Connectivity',
    description: 'Neue Bank-Konnektoren, SWIFT gpi Integration, Echtzeit-Statustracking',
    release_date: 'Q2 2026',
    status: 'announced',
    tags: ['MBC', 'SWIFT', 'gpi'],
    sort_order: 2,
  },
  {
    title: 'PAYM Next-Gen (geplant)',
    description: 'Vollständige ISO 20022 Migration, ERP Payments Harmonisierung',
    release_date: '2027+',
    status: 'planned',
    tags: ['PAYM', 'ISO20022'],
    sort_order: 3,
  },
] as const;

const PHASES = [
  {
    phase_nr: 1,
    title: 'Blueprint',
    description: 'Bankenlandschaft, Formate und Clearing-Wege analysieren',
    color: 'blue',
    md_anchor: 'phase-1-blueprint',
  },
  {
    phase_nr: 2,
    title: 'Connectivity',
    description: 'EBICS/H2H Setup, Bankschlüssel, MBC Konfiguration',
    color: 'green',
    md_anchor: 'phase-2-connectivity',
  },
  {
    phase_nr: 3,
    title: 'Formate',
    description: 'DMEE/DMEEX, pain.001, Zahlungsträger konfigurieren',
    color: 'yellow',
    md_anchor: 'phase-3-formate',
  },
  {
    phase_nr: 4,
    title: 'Test',
    description: 'Banktest, Pilotbuchungen, Fehlerbehandlung, Rückmeldungen',
    color: 'orange',
    md_anchor: 'phase-4-test',
  },
  {
    phase_nr: 5,
    title: 'Go-Live',
    description: 'Cutover, Hypercare, Monitoring, Dokumentation',
    color: 'purple',
    md_anchor: 'phase-5-go-live',
  },
] as const;

async function seedSap() {
  console.log('Seeding sap_roadmap_items...');
  for (const item of ROADMAP_ITEMS) {
    await db.insert(sapRoadmapItems).values(item).onConflictDoNothing();
    console.log(`  ✓ ${item.title}`);
  }

  console.log('Seeding sap_implementation_phases...');
  for (const phase of PHASES) {
    await db.insert(sapImplementationPhases).values(phase).onConflictDoNothing();
    console.log(`  ✓ Phase ${phase.phase_nr}: ${phase.title}`);
  }

  console.log('Done.');
  process.exit(0);
}

seedSap().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-technik.ts scripts/seed-sap.ts
git commit -m "feat(seed): add seed scripts for technik and sap tables"
```

---

## Task 8: Technik-Übersichtsseite

**Files:**
- Create: `app/technik/page.tsx`
- Create: `app/technik/technik-client.tsx`

- [ ] **Step 1: `app/technik/page.tsx` erstellen**

```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllTechnikEntries } from '@/lib/queries/technik';
import { TechnikClient } from './technik-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technik — Payments KB',
};

export default async function TechnikPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const entries = await getAllTechnikEntries();
  return <TechnikClient entries={entries} />;
}
```

- [ ] **Step 2: `app/technik/technik-client.tsx` erstellen**

```typescript
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TechnikEntry } from '@/lib/queries/technik';

const FILTERS = [
  { label: 'Alle', value: '' },
  { label: 'Bank-seitig', value: 'bank' },
  { label: 'SAP-nativ', value: 'sap' },
  { label: 'SWIFT', value: 'swift' },
];

const COMPLEXITY_COLORS: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-green-400',
  3: 'bg-yellow-400',
  4: 'bg-orange-400',
  5: 'bg-red-400',
};

interface Props {
  entries: TechnikEntry[];
}

export function TechnikClient({ entries }: Props) {
  const [activeFilter, setActiveFilter] = useState('');

  const filtered = activeFilter
    ? entries.filter(e => e.category === activeFilter)
    : entries;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Technik</h1>
        <p className="mt-1 text-muted-foreground">
          Verbindungsprotokolle für den elektronischen Zahlungsverkehr
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filter:
        </span>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              activeFilter === f.value
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(entry => (
          <Link
            key={entry.id}
            href={`/technik/${entry.id}`}
            className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                {entry.name}
              </h2>
              <div className="flex shrink-0 flex-wrap justify-end gap-1">
                {(entry.badges as string[]).slice(0, 2).map(badge => (
                  <span
                    key={badge}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {entry.subtitle}
            </p>

            <div className="flex flex-wrap gap-1">
              {(entry.tags as string[]).slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {entry.komplexitaet !== null && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Komplexität:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 w-4 rounded-full',
                        i < (entry.komplexitaet ?? 0)
                          ? COMPLEXITY_COLORS[entry.komplexitaet ?? 1]
                          : 'bg-muted'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Im Browser prüfen — http://localhost:3000/technik**

Erwartet: Leere Seite (noch keine DB-Daten) aber kein Fehler. Falls Fehler → debuggen.

- [ ] **Step 4: Commit**

```bash
git add app/technik/page.tsx app/technik/technik-client.tsx
git commit -m "feat(technik): add Technik overview page with card grid"
```

---

## Task 9: Technik-Detailseite

**Files:**
- Create: `app/technik/[slug]/page.tsx`
- Create: `app/technik/[slug]/technik-detail-client.tsx`

- [ ] **Step 1: `app/technik/[slug]/page.tsx` erstellen**

```typescript
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getTechnikEntryBySlug } from '@/lib/queries/technik';
import { extractSection } from '@/lib/technik/parse-md';
import { TechnikDetailClient } from './technik-detail-client';
import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.toUpperCase()} — Technik — Payments KB` };
}

export default async function TechnikDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/login');

  const { slug } = await params;
  const entry = await getTechnikEntryBySlug(slug);
  if (!entry) notFound();

  const mdPath = path.join(process.cwd(), 'content', 'gpdb_06_technik.md');
  const mdContent = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf-8') : '';
  const articleMd = extractSection(mdContent, slug) ?? '';

  return <TechnikDetailClient entry={entry} articleMd={articleMd} />;
}
```

- [ ] **Step 2: `app/technik/[slug]/technik-detail-client.tsx` erstellen**

```typescript
'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { TechnikEntry } from '@/lib/queries/technik';

const COMPLEXITY_LABELS: Record<number, string> = {
  1: 'Sehr niedrig',
  2: 'Niedrig',
  3: 'Mittel',
  4: 'Hoch',
  5: 'Sehr hoch',
};

interface Props {
  entry: TechnikEntry;
  articleMd: string;
}

export function TechnikDetailClient({ entry, articleMd }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/technik" className="hover:text-foreground">Technik</Link>
        <span>›</span>
        <span className="text-foreground">{entry.name}</span>
      </div>

      {/* Steckbrief Header */}
      <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
              Verbindungsprotokoll
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">{entry.name}</h1>
            {entry.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{entry.subtitle}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5">
            {(entry.badges as string[]).map(badge => (
              <span
                key={badge}
                className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Steckbrief Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Einsatzgebiet', value: entry.einsatzgebiet },
            { label: 'Sicherheit', value: entry.sicherheit },
            { label: 'Verbreitung', value: entry.verbreitung },
            { label: 'SAP-Integration', value: entry.sap_integration },
            { label: 'Version aktuell', value: entry.version_aktuell },
            { label: 'Formate', value: (entry.formate as string[]).join(', ') },
            { label: 'Alternativen', value: (entry.alternativen as string[]).join(', ') },
            {
              label: 'Komplexität Setup',
              value: entry.komplexitaet
                ? `${entry.komplexitaet}/5 — ${COMPLEXITY_LABELS[entry.komplexitaet]}`
                : undefined,
            },
          ].map(({ label, value }) =>
            value ? (
              <div
                key={label}
                className="rounded-lg border border-green-200 bg-white p-3 dark:border-green-900 dark:bg-background"
              >
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
                <div className="text-sm font-medium text-foreground">{value}</div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Artikel */}
      {articleMd ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 border-b border-border pb-2 font-heading text-lg font-semibold text-foreground">
            Artikel
          </h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleMd}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
          Kein Artikel für dieses Protokoll vorhanden. Artikel in{' '}
          <code className="rounded bg-muted px-1">content/gpdb_06_technik.md</code> unter{' '}
          <code className="rounded bg-muted px-1">## {entry.id}</code> eintragen.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/technik/[slug]/page.tsx "app/technik/[slug]/technik-detail-client.tsx"
git commit -m "feat(technik): add protocol detail page with Steckbrief + Artikel"
```

---

## Task 10: SAP-Bereich

**Files:**
- Create: `app/sap/page.tsx`
- Create: `app/sap/roadmap/page.tsx`
- Create: `app/sap/roadmap/sap-roadmap-client.tsx`
- Create: `app/sap/implementierung/page.tsx`
- Create: `app/sap/implementierung/sap-implementierung-client.tsx`

- [ ] **Step 1: `app/sap/page.tsx` — Redirect**

```typescript
import { redirect } from 'next/navigation';

export default function SapPage() {
  redirect('/sap/roadmap');
}
```

- [ ] **Step 2: `app/sap/roadmap/page.tsx` erstellen**

```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSapRoadmapItems } from '@/lib/queries/sap';
import { SapRoadmapClient } from './sap-roadmap-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SAP Roadmap — Payments KB' };

export default async function SapRoadmapPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const items = await getSapRoadmapItems();
  return <SapRoadmapClient items={items} />;
}
```

- [ ] **Step 3: `app/sap/roadmap/sap-roadmap-client.tsx` erstellen**

```typescript
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { SapRoadmapItem } from '@/lib/queries/sap';

const STATUS_STYLES: Record<string, { dot: string; badge: string; border: string }> = {
  available: {
    dot: 'bg-green-500 ring-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    border: 'border-green-200 dark:border-green-900',
  },
  announced: {
    dot: 'bg-blue-500 ring-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-900',
  },
  planned: {
    dot: 'bg-zinc-400 ring-zinc-400',
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
  },
};

const STATUS_LABELS: Record<string, string> = {
  available: 'Verfügbar',
  announced: 'Angekündigt',
  planned: 'Geplant',
};

interface Props { items: SapRoadmapItem[] }

export function SapRoadmapClient({ items }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">SAP</h1>
      </div>

      {/* Sub-tabs */}
      <div className="mb-8 flex gap-2">
        <div className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Produktroadmap
        </div>
        <Link
          href="/sap/implementierung"
          className="rounded-md bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Implementierungspfade
        </Link>
      </div>

      <h2 className="mb-6 font-heading text-lg font-semibold text-foreground">
        SAP Payment-relevante Releases
      </h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Keine Einträge vorhanden. Bitte Seed-Skript ausführen.</p>
      ) : (
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
          <div className="flex flex-col gap-4">
            {items.map(item => {
              const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.planned;
              return (
                <div key={item.id} className="relative">
                  <div
                    className={cn(
                      'absolute -left-4 top-4 h-2.5 w-2.5 rounded-full ring-2 ring-background',
                      s.dot
                    )}
                  />
                  <div className={cn('rounded-xl border bg-card p-4', s.border)}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        {item.tags && (item.tags as string[]).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(item.tags as string[]).map(tag => (
                              <span
                                key={tag}
                                className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {item.release_date && (
                          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', s.badge)}>
                            {item.release_date}
                          </span>
                        )}
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', s.badge)}>
                          {STATUS_LABELS[item.status] ?? item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: `app/sap/implementierung/page.tsx` erstellen**

```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSapImplementationPhases } from '@/lib/queries/sap';
import { SapImplementierungClient } from './sap-implementierung-client';
import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SAP Implementierung — Payments KB' };

export default async function SapImplementierungPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const phases = await getSapImplementationPhases();
  const mdPath = path.join(process.cwd(), 'content', 'gpdb_07_sap.md');
  const mdContent = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf-8') : '';

  return <SapImplementierungClient phases={phases} mdContent={mdContent} />;
}
```

- [ ] **Step 5: `app/sap/implementierung/sap-implementierung-client.tsx` erstellen**

```typescript
'use client';

import Link from 'next/link';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { extractSection } from '@/lib/technik/parse-md';
import type { SapImplementationPhase } from '@/lib/queries/sap';

const COLOR_STYLES: Record<string, { bg: string; border: string; label: string; active: string }> = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-950/30',   border: 'border-blue-200 dark:border-blue-900',   label: 'text-blue-600 dark:text-blue-400',   active: 'ring-blue-400' },
  green:  { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-900', label: 'text-green-600 dark:text-green-400', active: 'ring-green-400' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-900', label: 'text-yellow-600 dark:text-yellow-400', active: 'ring-yellow-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900', label: 'text-orange-600 dark:text-orange-400', active: 'ring-orange-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-900', label: 'text-purple-600 dark:text-purple-400', active: 'ring-purple-400' },
};

interface Props {
  phases: SapImplementationPhase[];
  mdContent: string;
}

export function SapImplementierungClient({ phases, mdContent }: Props) {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const selectedPhase = phases.find(p => p.phase_nr === activePhase);
  const articleMd = selectedPhase?.md_anchor
    ? extractSection(mdContent, selectedPhase.md_anchor) ?? ''
    : '';

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">SAP</h1>
      </div>

      {/* Sub-tabs */}
      <div className="mb-8 flex gap-2">
        <Link
          href="/sap/roadmap"
          className="rounded-md bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Produktroadmap
        </Link>
        <div className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Implementierungspfade
        </div>
      </div>

      <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
        Typische Phasen — SAP Payment-Implementierung
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Klicke auf eine Phase für Details.
      </p>

      {/* Phase tiles */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-5">
        {phases.map(phase => {
          const c = COLOR_STYLES[phase.color] ?? COLOR_STYLES.blue;
          const isActive = activePhase === phase.phase_nr;
          return (
            <button
              key={phase.phase_nr}
              onClick={() => setActivePhase(isActive ? null : phase.phase_nr)}
              className={cn(
                'rounded-xl border p-4 text-left transition-all',
                c.bg, c.border,
                isActive && `ring-2 ${c.active}`
              )}
            >
              <div className={cn('mb-1 text-xs font-bold uppercase tracking-wider', c.label)}>
                Phase {phase.phase_nr}
              </div>
              <div className="font-semibold text-foreground text-sm">{phase.title}</div>
              <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {phase.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Phase detail */}
      {selectedPhase && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 border-b border-border pb-2 font-heading text-lg font-semibold text-foreground">
            Phase {selectedPhase.phase_nr}: {selectedPhase.title}
          </h3>
          {articleMd ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleMd}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Kein Artikel für diese Phase vorhanden.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add app/sap/
git commit -m "feat(sap): add SAP roadmap + implementation phases pages"
```

---

## Task 11: Daten befüllen + Reindex

- [ ] **Step 1: Technik-Daten seeden**

```bash
npx tsx scripts/seed-technik.ts
```

Erwartet:
```
Seeding technik_entries...
  ✓ EBICS
  ✓ H2H
  ✓ SAP MBC
  ✓ SWIFT
  ✓ SWIFT Service Bureau
Done.
```

- [ ] **Step 2: SAP-Daten seeden**

```bash
npx tsx scripts/seed-sap.ts
```

Erwartet:
```
Seeding sap_roadmap_items...
  ✓ S/4HANA 2025 — BCM Enhancement
  ✓ SAP MBC 2.0 — Multi-Bank Connectivity
  ✓ PAYM Next-Gen (geplant)
Seeding sap_implementation_phases...
  ✓ Phase 1: Blueprint
  ...
Done.
```

- [ ] **Step 3: Reindex ausführen**

```bash
npx tsx scripts/reindex-local.ts
```

Erwartet: `gpdb_06_technik.md` und `gpdb_07_sap.md` erscheinen als `processed`.

- [ ] **Step 4: Übersichtsseite im Browser prüfen — http://localhost:3000/technik**

Erwartet: 5 Protokoll-Karten sichtbar, Filter funktioniert.

- [ ] **Step 5: Detailseite prüfen — http://localhost:3000/technik/ebics**

Erwartet: Steckbrief-Grid mit EBICS-Daten + Artikel-Body mit Markdown.

- [ ] **Step 6: SAP prüfen — http://localhost:3000/sap**

Erwartet: Redirect zu `/sap/roadmap`, Timeline mit 3 Einträgen sichtbar.

- [ ] **Step 7: Implementierungspfade prüfen — http://localhost:3000/sap/implementierung**

Erwartet: 5 Phasen-Kacheln, Klick auf Phase zeigt Artikel-Detail.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: GPDB Expansion complete — Technik + SAP sections live"
```

---

## Self-Review Checklist

- [x] DB Schema: 3 Tabellen mit allen Spec-Feldern
- [x] Navigation: Technik + SAP in NAV_ITEMS
- [x] Technik-Übersicht: Card Grid + Filter
- [x] Technik-Detail: Steckbrief 8 Felder + Artikel (react-markdown)
- [x] SAP-Roadmap: Timeline mit Status-Farben
- [x] SAP-Implementierung: 5 Kacheln, Klick öffnet Artikel
- [x] RAG: SECTION_MAP erweitert, reindex liest gpdb_06 + gpdb_07
- [x] Seed-Skripte: alle 5 Protokolle + 3 Roadmap + 5 Phasen
- [x] Alle MD-Slugs stimmen mit DB-IDs überein (ebics, h2h, sap-mbc, swift, swift-service-bureau)
- [x] extractSection stoppt korrekt vor nächstem H2 (getestet)
