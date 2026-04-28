/**
 * Seed country_blocks for Germany (DE).
 *
 * Quelle: content/expansion/laender/de.md
 * Block-Struktur aligned with IT/CN template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-deutschland-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'DE';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'DE / DEU (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 276.', einsteiger: 'Alpha-2 DE, Alpha-3 DEU.', praxis: 'SAP T005 Eintrag, Bankstamm Länderfeld.' },
      { feld: 'Währung', experte: 'EUR (€) / ISO 4217: EUR. Eurozone-Mitglied seit 01.01.1999 (physisch seit 01.01.2002).', einsteiger: 'Euro, EU-Leitwährung.', praxis: 'Hauswährung Buchungskreis DE.' },
      { feld: 'IBAN-Format', experte: 'DE + 2 Prüfziffern + 8 BLZ + 10 Kontonummer = 22 Stellen. Prüfziffer nach ISO 7064 MOD 97-10. Beispiel: DE89 3704 0044 0532 0130 00.', einsteiger: '22 Zeichen: Ländercode + Prüfziffer + Bankleitzahl + Kontonummer.', praxis: 'IBAN-Validierung aktiv lassen. BLZ historisch in vielen Stammdaten — IBAN ist Pflicht seit 2014.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAADEBBXXX. Beispiele: Deutsche Bank DEUTDEFFXXX, Commerzbank COBADEFFXXX, DZ Bank GENODEFFXXX, LBBW SOLADEST600, HypoVereinsbank HYVEDEMM.', einsteiger: 'DE im BIC = Deutschland. Innerhalb SEPA seit 2016 nicht mehr Pflicht, aber empfohlen.', praxis: 'In SAP Hausbank BIC immer pflegen — für SWIFT-Korrespondenz weiterhin erforderlich.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) im Winter / CEST (UTC+2) im Sommer. Umstellung: letzter Sonntag März / Oktober.', einsteiger: 'Gleiche Zeitzone wie AT, CH, FR, IT.', praxis: 'SEPA SCT Cut-off bei DE-Banken i.d.R. 15:00 CET, URGP via T2 bis 17:00 CET.' },
      { feld: 'Zentralbank', experte: 'Deutsche Bundesbank. Wilhelm-Epstein-Straße 14, 60431 Frankfurt/Main. bundesbank.de. Eurosystem-Mitglied (NCB). Betreibt RPS, Target2/T2-Zugang.', einsteiger: 'Deutsche Bundesbank — zentrale Notenbank, steuert Zahlungsverkehr.', praxis: 'Gläubiger-ID (CI) für SEPA SDD bei Bundesbank beantragen: DE + 2 Prüfziffern + ZZZ + 11-stellige CI.' },
      { feld: 'Aufsicht', experte: 'BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht) — Finanzaufsicht nach ZAG/KWG. Gemeinsame Bankenaufsicht mit Bundesbank.', einsteiger: 'BaFin beaufsichtigt Banken und Zahlungsdienstleister.', praxis: 'BaFin-Lizenz nur für Zahlungsdienstleister relevant, nicht für Corporates.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Deutsch. UTF-8 Standard. Sonderzeichen: ä, ö, ü, ß. ISO 8859-1 (Latin-1) kompatibel. SWIFT MT: nur ASCII → Umlaute werden ersetzt (ä→ae etc.). ISO 20022 (pain/pacs): UTF-8 vollständig.', einsteiger: 'Deutsch mit Umlauten — in SWIFT-MT-Nachrichten werden diese ersetzt.', praxis: 'SAP: DMEE-Format mit UTF-8 Encoding konfigurieren. Bei MT103 auf SWIFT-Zeichensatz achten.' },
      { feld: 'Nationale Feiertage', experte: '9 nationale Feiertage: Neujahr (01.01), Karfreitag, Ostermontag, Tag der Arbeit (01.05), Himmelfahrt, Pfingstmontag, Tag der Dt. Einheit (03.10), 1. Weihnachtstag (25.12), 2. Weihnachtstag (26.12). Dazu bis zu 4 regionale: Hl. Drei Könige (06.01 — BW/BY/ST), Mariä Himmelfahrt (15.08 — BY kath.), Allerheiligen (01.11 — BW/BY/NW/RP/SL), Reformationstag (31.10 — BB/HB/HH/MV/NI/SN/ST/SH/TH).', einsteiger: '9 nationale + bis zu 4 regionale Feiertage. Bayern hat die meisten (13).', praxis: 'SAP SCAL: DE-Fabrikkalender regional differenzieren je Buchungskreis-Standort. Jährlich prüfen.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. EUR 4,1 Bio (größte Wirtschaft der EU, 3. weltweit). Hauptindustrien: Automotive, Maschinenbau, Chemie, Pharma. Starker Mittelstand (Hidden Champions). Handelspartner: CN, US, FR, NL, PL.', einsteiger: 'Größte EU-Wirtschaft, exportstark, stabiles Zahlungsverhalten.', praxis: 'Zahlungsziele B2B: 30 Tage Standard (§ 286 Abs. 3 BGB). Skonto 2% / 10 Tage weit verbreitet.' },
      { feld: 'Hauptbanken', experte: 'Deutsche Bank (DEUTDEFFXXX), Commerzbank (COBADEFFXXX), DZ BANK (GENODEFFXXX — Zentralinstitut Volksbanken/Raiffeisenbanken), LBBW (SOLADEST600), UniCredit/HVB (HYVEDEMM), KfW (KFWIDEFF — Förderbank). Sparkassen + Volksbanken über jeweilige Zentralinstitute.', einsteiger: 'Big 5 + Sparkassen/Volksbanken-Netz.', praxis: 'Deutsche Bank + Commerzbank haben stärksten Corporate-EBICS-Support. DZ BANK für Genossenschaftssektor.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'ZAG — Zahlungsdiensteaufsichtsgesetz', experte: 'PSD2-Umsetzung via ZAG vom 17.07.2017 (BGBl. I S. 2446). §1 ZAG: Erlaubnispflicht für PSPs. §17 ZAG: SCA-Pflicht, B2B-Ausnahme (§17 Abs. 2) nur mit Bankvereinbarung. §55 ZAG: Open Banking / PSD2-API. PSD3 (EU-Entwurf, Umsetzung 2026/2027): IBAN-Namensabgleich (CoP) wird Pflicht — Deutsche Bank + Commerzbank haben bereits CoP-Piloten.', einsteiger: 'Deutsches Zahlungsdienstegesetz = PSD2 in deutschem Recht. SCA bei Online-Zahlungen, B2B-Ausnahme muss mit Bank vereinbart werden.', praxis: 'B2B-SCA-Ausnahme (§17 Abs. 2) schriftlich mit allen DE-Hausbankverbindungen fixieren. POBO braucht bankvertragliche Absicherung.' },
      { feld: 'GwG / KWG — Geldwäscheprävention', experte: 'GwG §10: KYC-Sorgfaltspflichten. GwG §43: Verdachtsmeldung an FIU (Zoll). §25h KWG: Transaktionsmonitoring. UBO-Register: Transparenzregister (§18 ff. GwG). Bargeldobergrenze: EUR 10.000 (ab 2027 geplant EUR 3.000 nach EU-AML-VO). GwG §9: Gruppenweite Sorgfaltspflichten für MNCs mit DE-Holding.', einsteiger: 'Geldwäschegesetz + Bankenaufsichtsgesetz. KYC bei jeder neuen Bankbeziehung, UBO-Eintrag im Transparenzregister Pflicht.', praxis: 'Sanktionsscreening über SAP FCM oder externe Lösung. DE = kein Hochrisikoland, Standard-Screening ausreichend.' },
      { feld: 'DSGVO / BDSG — Datenschutz', experte: 'BDSG ergänzt DSGVO mit deutschen Besonderheiten. Zahlungsdaten = personenbezogene Daten (Auftraggeber-/Empfänger-IBAN). §26 BDSG: Beschäftigtendatenschutz (Gehaltszahlungen). Datenweitergabe an SWIFT: Art. 6 Abs. 1 f DSGVO. Aufbewahrungsfristen: 10 Jahre (§147 AO, §257 HGB).', einsteiger: 'IBAN-Daten sind personenbezogen. Aufbewahrung 10 Jahre.', praxis: 'Zahlungsbelege 10 Jahre archivieren. SAP-Berechtigungen für IBAN-Felder gemäß DSGVO einschränken.' },
      { feld: 'SEPA-Verordnung (EU 260/2012)', experte: 'Vollständig umgesetzt seit 01.02.2014. DTAUS/DTAZV durch SEPA SCT/SDD abgelöst. DTAZV noch bei vereinzelten Legacy-Banken für Auslandszahlungen. Stand April 2026: SCT ✓, SCT Inst ✓ (Empfangspflicht seit Okt. 2025, Preisparität Pflicht), SDD Core/B2B ✓.', einsteiger: 'SEPA läuft vollständig. Alte DTAUS/DTAZV-Formate sind abgelöst.', praxis: 'DTAZV-basierte Auslandszahlungen über kleine Landesbanken: Migration auf SWIFT/ISO 20022 dringend empfohlen.' },
      { feld: 'SEPA Instant (EU 2024/886)', experte: 'DE-Banken: Empfangspflicht seit Oktober 2025, Sendepflicht ab Juli 2025. Preisparität SCT/SCT Inst seit Oktober 2025. Limit EUR 100.000. Alle DE-Großbanken (Dt. Bank, Commerz, DZ, LBBW, HVB) vollständig. Vereinzelt kleinere Sparkassen/Volks-/Raiffeisenbanken mit Einschränkungen.', einsteiger: 'Sofortüberweisungen sind bei allen großen DE-Banken Standard und kosten gleich viel wie normale Überweisungen.', praxis: 'SAP BCM: SvcLvl INST für DE-Zahlungen aktivieren. camt.054 Echtzeit-Verarbeitung für Gutschriften konfigurieren. Limit: EUR 100.000 pro Transaktion.' },
      { feld: 'DORA / NIS2', experte: 'DORA: Direkt anwendbar ab 17.01.2025, DE-Banken und PSPs in Scope. NIS2: Umgesetzt via NIS2UmsuCG (in Kraft seit Oktober 2024). EBICS-Server und H2H-Verbindungen in BCP dokumentieren. DE-Banken fordern neue DORA-Klauseln in Bankverträgen.', einsteiger: 'Neue EU-Sicherheitsregeln für Banken. Bankverträge enthalten jetzt IT-Sicherheitsklauseln.', praxis: 'BCP für DE-Bankverbindungen dokumentieren. EBICS-Zertifikat-Ablaufdaten im Kalender. Neue DORA-Klauseln in Bankverträgen prüfen (Legal Review).' },
      { feld: 'e-Invoice', experte: 'Ab 01.01.2025: Empfangspflicht für e-Rechnungen (B2B) nach EU-RL 2014/55/EU via E-Rechnungs-Verordnung (ERechV). Formate: ZUGFeRD (PDF/A-3 + XML) und XRechnung (reines XML). Ab 01.01.2027: Sendepflicht für Unternehmen > EUR 800k Umsatz, ab 2028 für alle. Leitweg-ID für öffentliche Auftraggeber Pflicht.', einsteiger: 'Elektronische Rechnungen sind Pflicht im B2B. Zwei Formate: ZUGFeRD (PDF+XML) und XRechnung (reines XML).', praxis: 'SAP Document Compliance (DRC) oder Add-on (Comarch, Seeburger) für XRechnung/ZUGFeRD. Leitweg-ID im Kundenstamm pflegen.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'TARGET2 / T2', experte: 'RTGS-System der EZB / Bundesbank. EUR-Großbetragszahlungen in Echtzeit. T2-Konsolidierung (März 2023) abgeschlossen — Nachfolger von TARGET2 mit erweitertem ISO 20022-Messaging. URGP-Zahlungen (Urgent Payments) über T2.', einsteiger: 'Europäisches Echtzeit-Großbetragssystem für EUR.', praxis: 'T2 URGP Cut-off 17:00 CET. SAP Zahlungsmethode für Express-Zahlungen mit SvcLvl URGP konfigurieren.' },
      { feld: 'STEP2 (EBA Clearing)', experte: 'ACH/DNS für SEPA SCT und SDD. Betreiber: EBA Clearing. Alle SEPA-Banken als Teilnehmer. DNS-Settlement täglich über T2.', einsteiger: 'Europäisches Massenzahlungssystem für SEPA.', praxis: 'Standard für F110-Zahlläufe. SCT Cut-off bei DE-Banken i.d.R. 15:00 CET.' },
      { feld: 'TIPS', experte: 'EZB Instant-RTGS für SCT Inst. EUR, 24/7/365. Limit EUR 100.000. Alle DE-Großbanken angebunden. Brutto-Settlement in Echtzeit.', einsteiger: 'EU-weites Instant-Payment-System.', praxis: 'SAP BCM: SvcLvl INST aktivieren. camt.054 Real-Time für Gutschriften.' },
      { feld: 'RPS (Bundesbank)', experte: 'Retail Payment System der Bundesbank. DNS für Sparkassen und Genossenschaftsbanken. Parallel zu STEP2.', einsteiger: 'Bundesbank-eigenes Retail-Clearing.', praxis: 'Für Corporates transparent — Routing entscheidet die Bank.' },
      { feld: 'EBICS', experte: 'Electronic Banking Internet Communication Standard. In DE entwickelt, dominierender Bankkanal für Corporates. Version 3.0 Standard. Auftragsarten: CCT (pain.001 Upload), CDD/CDC (pain.008), STA (MT940), C53 (camt.053), C52 (camt.052), C54 (camt.054), HAC (Quittung). Sicherheitsstufen: T (Transport, veraltet), TS (Transport + Signatur, Standard), ES (4-Augen-Prinzip).', einsteiger: 'EBICS = wie Online-Banking für Firmen. Der Standard in Deutschland, alle Großbanken unterstützen es.', praxis: 'SAP T-Code FIEB für EBICS-Konfiguration. Zertifikate alle 3 Jahre erneuern. INI/HIA-Brief bei Erstanbindung mit Bank austauschen.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SEPA SCT Standard: 15:00 CET, Valuta D+1. SEPA SCT URGP via T2: 17:00 CET, Valuta D. SCT Instant: 24/7, sofort. SDD CORE FRST: D-5. SDD CORE RCUR: D-2. SDD B2B: D-1. Auslandsüberw. SWIFT: 14:00 CET, Valuta D+1–D+2.', einsteiger: 'Standard-Überweisungen bis 15:00, Eilzahlungen bis 17:00, Instant rund um die Uhr.', praxis: 'F110-Zahllauf bis 13:00 CET starten für sicheren 15:00-Cut-off. Zwei-Stunden-Puffer einplanen.' },
      { feld: 'IBAN-Validierung', experte: 'Prüfziffer nach ISO 7064 MOD 97-10. Ablauf: BLZ+KtNr+DE00 → Buchstaben ersetzen (D=13, E=14) → MOD 97 → Prüfziffer = 98 - Ergebnis.', einsteiger: 'Prüfziffer sichert ab, dass IBAN korrekt eingegeben wurde.', praxis: 'SAP IBAN-Prüfung standardmäßig aktiv lassen. Bei Import alter Stammdaten: BLZ+Kontonr → IBAN-Konverter nutzen.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'FBZP — Zahlungsmethodenkonfig', experte: 'Zahlungsmethode "B": SEPA CT (pain.001.001.03 oder .09). "D": SEPA SDD Core (pain.008.001.02). "E": SEPA SDD B2B (pain.008.001.02). Hausbanken: BIC immer pflegen. Gläubiger-ID (CI) in FBZP → Zahlungsweg → Weitere Daten hinterlegen.', einsteiger: 'Drei Zahlungsmethoden: B=Überweisung, D=Lastschrift Core, E=Lastschrift B2B.', praxis: 'CI bei Bundesbank beantragen (Format: DE + 2 + ZZZ + 11). Vor erstem SDD-Lauf in FBZP hinterlegen, sonst Banken-Rejection.' },
      { feld: 'DMEE-Formate', experte: 'SEPA_CT: pain.001.001.03 (Standard). SEPA_CT_09: pain.001.001.09 (empfohlen ab 2023). SEPA_DD_CORE/SEPA_DD_B2B: pain.008.001.02. DTAZV: Nur noch Legacy für Auslandszahlungen, Ablösung dringend.', einsteiger: 'Pro Zahlungsart ein DMEE-Baum in SAP.', praxis: 'Migration von SEPA_CT (.03) auf SEPA_CT_09 (.09) für Neuinstallationen empfohlen. Bankkompatibilität vorab testen.' },
      { feld: 'BCM-Kanalkonfiguration', experte: 'EBICS: T-Code FIEB — Standard für alle DE-Großbanken. SWIFT FileAct: Für internationale Konzerne. H2H proprietär: Nur noch wenige Banken, Migrationsplan empfohlen.', einsteiger: 'EBICS = Hauptkanal. SWIFT nur für internationale Konzerne.', praxis: 'EBICS 3.0 mit TS-Sicherheitsstufe konfigurieren. H2H-Legacy ablösen.' },
      { feld: 'Typische Projektfehler', experte: '1) Steuernr. vs. USt-IdNr.: STCEG = USt-IdNr. (DE + 9 Ziffern), STCD1 = Steuernummer — Verwechslung in XBLNR. 2) BLZ statt IBAN: Alte Felder gepflegt, IBAN leer → Zahlung scheitert. 3) EBICS-Zertifikate: Ablauf nicht überwacht → plötzlicher Ausfall. 4) SCAL: Regionale Feiertage fehlen → Zahlungen auf Feiertag terminiert. 5) DMEE-Version: Veraltet pain.001.001.03 statt .09. 6) CI nicht in BCM hinterlegt → SDD-Ablehnung. 7) SDD FRST mit RCUR-Frist (2 statt 5 Tage) → Rückgabe.', einsteiger: 'Die 7 häufigsten Fehler bei DE-Zahlungsprojekten.', praxis: 'Checkliste in jedem DE-Rollout durchgehen. EBICS-Zertifikat-Erneuerung alle 3 Jahre (bankspezifisch).' },
      { feld: 'Fabrikkalender SCAL', experte: 'Minimum: 9 nationale Feiertage. Regional: Bayern +4 (06.01, 15.08, 01.11, Allerseelen), NRW +1 (01.11), Sachsen +2 (31.10, Buß- und Bettag). Je Buchungskreis-Standort differenzieren.', einsteiger: 'SAP-Kalender mit deutschen Feiertagen — regional unterschiedlich.', praxis: 'Jährlich im Dezember aktualisieren. Bayern (BY): 13 Feiertage, Brandenburg (BB): 10.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.03 / .09 (SEPA SCT)', experte: 'Standard-Überweisungsformat für alle DE-Inlandszahlungen und SEPA-Raum. Version .03 weit verbreitet, .09 empfohlen ab 2023. Alle DE-Großbanken akzeptieren beide Versionen.', einsteiger: 'Das Standard-Format für Überweisungen in Deutschland und Europa.', praxis: 'SEPA_CT (.03) oder SEPA_CT_09 (.09) in DMEE. Migration auf .09 empfohlen.' },

      // Sektion 7.1 — SEPA Credit Transfer
      { feld: '► 7.1 — SEPA Credit Transfer (SCT)' },
      { feld: 'Format', experte: 'pain.001.001.03 (EPC-Subset, DFÜ-Abkommen Anlage 3) oder pain.001.001.09 (ISO 2019 Update). MaxLength: SvcLvl SEPA / URGP, ChrgBr SLEV.', einsteiger: 'XML-Datei für SEPA-Überweisungen.', praxis: 'SAP DMEE SEPA_CT oder SEPA_CT_09. Banktest vor Produktivsetzung.' },
      { feld: 'EBICS-Auftragsart', experte: 'CCT (Customer Credit Transfer) für pain.001 Upload. HAC für Quittung.', einsteiger: 'CCT = Überweisung hochladen.', praxis: 'FIEB: BTF CCT konfigurieren. HAC-Download für Statusprüfung einrichten.' },
      { feld: 'SCT Instant', experte: 'Gleiche pain.001, SvcLvl INST statt SEPA. Max EUR 100.000. Verarbeitung in <10 Sekunden. 24/7/365.', einsteiger: 'Sofortüberweisung — gleiches Format, anderer Service-Level.', praxis: 'SAP BCM: SvcLvl INST in Zahlungsmethode konfigurieren. camt.054 Real-Time aktivieren.' },

      // Sektion 7.2 — SEPA Direct Debit
      { feld: '► 7.2 — SEPA Direct Debit (SDD)' },
      { feld: 'SDD Core', experte: 'pain.008.001.02. Mandatsverwaltung in SAP (MndtId + CI). FRST: D-5, RCUR: D-2. Rückgabefrist: 8 Wochen (autorisiert), 13 Monate (unautorisiert).', einsteiger: 'Lastschrift für Privat- und Firmenkunden. Rückgabe bis 8 Wochen möglich.', praxis: 'SAP Zahlungsmethode "D". Mandatsstamm sorgfältig pflegen. FRST/RCUR-Fristen beachten.' },
      { feld: 'SDD B2B', experte: 'pain.008.001.02 mit SeqTp B2B. FRST/RCUR: D-1. Keine Rückgabe durch Zahler möglich (nur technische Rejects). Bank muss Mandat vorab bestätigen.', einsteiger: 'Firmenlastschrift — keine Widerspruchsmöglichkeit für den Zahler.', praxis: 'SAP Zahlungsmethode "E". Bank-Mandatsbestätigung vor erstem Einzug sicherstellen.' },
      { feld: 'Gläubiger-ID (CI)', experte: 'Format: DE + 2 Prüfziffern + ZZZ (Geschäftsbereich, frei wählbar) + 11-stellige nationale ID. Beantragung bei Bundesbank über glaeubiger-id.bundesbank.de.', einsteiger: 'Eindeutige ID pro Unternehmen für Lastschriften. Bei Bundesbank beantragen.', praxis: 'In FBZP → Zahlungsweg → Weitere Daten + SAP BCM hinterlegen. Ohne CI keine SDD-Einreichung.' },

      // Sektion 7.3 — Legacy-Formate
      { feld: '► 7.3 — Legacy-Formate (DTAUS / DTAZV / MT103)' },
      { feld: 'DTAUS', experte: 'Inländischer Zahlungsverkehr, Flat-File. Abgelöst seit 01.02.2014 durch SEPA SCT. Nur für absolute Legacy-Altverträge noch im Einsatz.', einsteiger: 'Altes deutsches Überweisungsformat — komplett durch SEPA ersetzt.', praxis: 'Migration auf SEPA_CT Pflicht. Kein SAP-Support mehr in S/4HANA Cloud.' },
      { feld: 'DTAZV', experte: 'Auslandsüberweisungen, Flat-File. Noch aktiv bei einzelnen kleineren Banken. Ablösung durch SWIFT/ISO 20022 dringend empfohlen.', einsteiger: 'Altes Format für Auslandszahlungen — wird durch SWIFT-XML ersetzt.', praxis: 'Individuelle Prüfung je Landesbank. Migration auf pacs.008 (CBPR+) planen.' },
      { feld: 'MT103 / MT940', experte: 'SWIFT-Überweisung (MT103) und Kontoauszug (MT940). MT103 abgelöst durch pacs.008 seit November 2025 (CBPR+ Deadline). MT940 läuft parallel zu camt.053, Migration empfohlen.', einsteiger: 'Alte SWIFT-Formate — werden durch ISO 20022 XML ersetzt.', praxis: 'camt.053 als Zielformat für Kontoauszüge. pacs.008 für Auslandszahlungen.' },

      // Sektion 7.4 — camt / Kontoauszug
      { feld: '► 7.4 — camt.053 / camt.054 / Kontoauszug' },
      { feld: 'camt.053', experte: 'Tagesauszug, ISO 20022. Version .001.02 bis .001.08 bei DE-Banken. EBICS-Auftragsart C53. Ersetzt MT940.', einsteiger: 'Elektronischer Kontoauszug im XML-Format.', praxis: 'SAP: FF_5 oder BAM. Posting Rules für DE-Banken anlegen. C53 via EBICS.' },
      { feld: 'camt.054', experte: 'Buchungsbenachrichtigung, Echtzeit. EBICS-Auftragsart C54. Für SCT Inst Gutschriften.', einsteiger: 'Echtzeit-Benachrichtigung bei Kontobewegungen.', praxis: 'Real-Time-Processing in BAM aktivieren für Instant-Gutschriften.' },
      { feld: 'camt.052', experte: 'Intraday-Kontoauszug. EBICS-Auftragsart C52. Für Liquiditätsmonitoring.', einsteiger: 'Untertägiger Kontostand.', praxis: 'Für Cash-Forecasting in SAP Treasury konfigurieren.' },

      // Sektion 7.5 — e-Invoice (ZUGFeRD / XRechnung)
      { feld: '► 7.5 — ZUGFeRD / XRechnung (e-Invoice)' },
      { feld: 'ZUGFeRD', experte: 'PDF/A-3 mit eingebettetem XML (Factur-X / EN16931). Hybrid: Mensch liest PDF, Maschine liest XML. Profil EXTENDED für volle Feldbelegung.', einsteiger: 'PDF-Rechnung mit maschinenlesbarem XML eingebettet.', praxis: 'SAP DRC (Document and Reporting Compliance) oder Comarch/Seeburger Add-on.' },
      { feld: 'XRechnung', experte: 'Reines XML nach EN16931, UBL 2.1 oder CII. Für öffentliche Auftraggeber Pflicht (Leitweg-ID). Ab 2027 B2B-Sendepflicht für Unternehmen > EUR 800k, ab 2028 für alle.', einsteiger: 'Reines XML-Format für Rechnungen — Pflicht bei Behörden, bald B2B.', praxis: 'Leitweg-ID im Kundenstamm pflegen. XRechnung-Validierung über KoSIT-Prüftool.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Hausbank-Accounts', experte: 'Hausbank-Accounts mit IBAN + BIC in SAP angelegt (FI12). EBICS-Vertrag abgeschlossen. INI/HIA-Brief ausgetauscht, Zertifikate aktiviert.', einsteiger: 'Bankkonten in SAP einrichten und EBICS-Verbindung herstellen.', praxis: 'T-Code FI12 für Hausbankstamm. FIEB für EBICS-Init.' },
      { feld: 'Pre-Go-Live: DMEE + Zahlungsmethoden', experte: 'SEPA_CT DMEE konfiguriert, pain.001-Version mit Bank abgestimmt. Zahlungsmethoden B/D/E in FBZP vollständig. CI hinterlegt (falls SDD).', einsteiger: 'Zahlungsformate und -methoden einrichten.', praxis: 'FBZP-Konfig + DMEE-Zuordnung. pain.001-Testdatei an Bank senden.' },
      { feld: 'Pre-Go-Live: Kalender + Cut-offs', experte: 'DE-Fabrikkalender in SCAL (9+ Feiertage, regional). Cut-Off-Zeiten der Hausbank dokumentiert und in Zahllauf-Zeitplan.', einsteiger: 'Feiertage und Bank-Deadlines konfigurieren.', praxis: 'SCAL-Pflege, F110-Varianten mit Zeitsteuerung.' },
      { feld: 'Pre-Go-Live: Screening + Auszug', experte: 'Sanktionsscreening aktiv (FCM oder extern). camt.053-Import konfiguriert (FF_5/BAM). EBICS-Zertifikat-Ablaufdaten dokumentiert.', einsteiger: 'Compliance-Prüfung und Kontoauszug-Verarbeitung einrichten.', praxis: 'Posting Rules für DE-Banken. EBICS-Zertifikat-Kalender anlegen.' },
      { feld: 'Produktivsetzung', experte: 'Testübertragungen mit Bank erfolgreich (Upload + Download). pain.001 mit Bank-Testsystem validiert. Erster F110-Lauf — Log prüfen. SDD FRST mit D-5 Vorlaufzeit. camt.053 empfangen + verbucht. Bankabstimmung durchgeführt. HAC/pain.002 verarbeitet.', einsteiger: 'Testlauf mit Bank, erster echter Zahllauf, Kontoauszug prüfen.', praxis: 'Checkliste abarbeiten: Upload → Quittung → Auszug → Abstimmung.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update. Alle 3 Jahre: EBICS-Zertifikate. PSD3/CoP-Implementierung (2026/2027). SWIFT MT→MX abgeschlossen. SCT Inst bestätigt.', einsteiger: 'Regelmäßige Wartung: Kalender, Zertifikate, Format-Updates.', praxis: 'Wiederkehrende Tasks im SAP Solution Manager oder Ticketsystem hinterlegen.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Seeder
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Deutschland (${COUNTRY_CODE}) Blocks ===`);
  console.log(`Truncating country_blocks for ${COUNTRY_CODE}...`);
  await db.delete(countryBlocks).where(eq(countryBlocks.country_code, COUNTRY_CODE));

  const toInsert: (typeof countryBlocks.$inferInsert)[] = [];
  for (const block of BLOCKS) {
    block.rows.forEach((row, idx) => {
      toInsert.push({
        country_code: COUNTRY_CODE,
        block_no: block.no,
        block_title: block.title,
        row_order: idx,
        feld: row.feld,
        experte: row.experte?.trim() ? row.experte : null,
        einsteiger: row.einsteiger?.trim() ? row.einsteiger : null,
        praxis: row.praxis?.trim() ? row.praxis : null,
      });
    });
  }

  const BATCH = 50;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    await db.insert(countryBlocks).values(toInsert.slice(i, i + BATCH));
  }

  await db.update(countries).set({ document_id: null }).where(eq(countries.code, COUNTRY_CODE));

  console.log(`Inserted ${toInsert.length} rows across ${BLOCKS.length} blocks.`);
  for (const b of BLOCKS) console.log(`  Block ${b.no} "${b.title}": ${b.rows.length} rows`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
