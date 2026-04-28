/**
 * Seed country_blocks for USA (US).
 *
 * Quelle: content/expansion/laender/us.md
 * Block-Struktur aligned with IT/CN/DE template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-usa-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'US';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'US / USA (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 840.', einsteiger: 'Alpha-2 US, Alpha-3 USA.', praxis: 'SAP T005 Eintrag.' },
      { feld: 'Währung', experte: 'USD ($) / ISO 4217: USD. Weltweit bedeutendste Reservewährung. Kein EUR — vollständig getrennte Zahlungsinfrastruktur.', einsteiger: 'US-Dollar. Kein Euro, kein SEPA.', praxis: 'Hauswährung Buchungskreis US. USD/EUR-Wechselkurs-Feed zwingend.' },
      { feld: 'Kontoformat (kein IBAN!)', experte: 'KEIN IBAN-Format. Stattdessen: ABA Routing Number (9-stellig, Prüfziffer MOD 10) + Kontonummer (8–17 Stellen, bankspezifisch). MICR-Code auf Schecks enthält ABA + KtNr.', einsteiger: 'USA nutzt KEIN IBAN. Routing Number (≈ BLZ) + Kontonummer.', praxis: 'SAP: IBAN-Feld LEER lassen! ABA in Bankstamm (BNKA-BANKL), Kontonummer in LFBK-BANKN. Häufigster Projekfehler: IBAN-Feld für US-Lieferanten füllen.' },
      { feld: 'ABA Routing Number', experte: '9-stellig numerisch. Struktur: [8 Routing][1 Prüfziffer]. Prüfziffer MOD 10: 3×[1]+7×[2]+1×[3]+3×[4]+7×[5]+1×[6]+3×[7]+7×[8]+1×[9] = Vielfaches von 10. Beispiele: JPMorgan 021000021, BofA 026009593, Citi 021000089, Wells Fargo 121000248.', einsteiger: '9-stellige Bankkennung, wie eine deutsche BLZ.', praxis: 'ABA-Validierung in SAP aktivieren. Lookup: fedwiredirectory.frb.org.' },
      { feld: 'Zeitzone', experte: 'Multiple Zeitzonen! EST/EDT (UTC-5/-4, New York) bis PST/PDT (UTC-8/-7, LA). Fed-Systeme operieren auf ET (Eastern Time).', einsteiger: 'USA hat 4+ Zeitzonen. Fed und ACH laufen auf Eastern Time.', praxis: 'ACH/Fedwire Cut-offs in ET angeben. SAP-Zahllauf: ET-basiert planen. 6–9 Stunden hinter CET.' },
      { feld: 'Zentralbank', experte: 'Federal Reserve System (Fed). 12 Distrikt-Reservebanken. federalreserve.gov. Betreibt Fedwire, FedNow, Fed Check Services, ACH (FedACH).', einsteiger: 'Federal Reserve = US-Zentralbank mit 12 regionalen Filialen.', praxis: 'Fed ist gleichzeitig Betreiber der meisten Zahlungssysteme (anders als EU).' },
      { feld: 'Aufsicht', experte: 'Zersplittert: OCC (Bundesbanken), Fed (systemrelevante), FDIC (Einlagensicherung), FinCEN (AML), CFPB (Verbraucherschutz), SEC (Kapitalmarkt), State Regulators (Money Transmitter Laws je Bundesstaat).', einsteiger: 'Viele Behörden statt einer BaFin. Komplexe Aufsichtslandschaft.', praxis: 'Für POBO: State Money Transmitter Laws prüfen — in manchen US-Bundesstaaten Lizenzpflicht.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Englisch. ASCII 7-bit für NACHA (strikt!), UTF-8 für ISO 20022 (RTP/FedNow/pacs.008). Keine Umlaute/Sonderzeichen in NACHA.', einsteiger: 'Englisch, nur einfache ASCII-Zeichen in ACH-Dateien.', praxis: 'NACHA-DMEE: Zeichensatz auf ASCII beschränken. Umlaute in Empfängernamen ersetzen (ä→ae).' },
      { feld: 'Nationale Feiertage', experte: '11 Federal Holidays: New Year (01.01), MLK Day (3. Mo Jan), Presidents Day (3. Mo Feb), Memorial Day (letzter Mo Mai), Juneteenth (19.06), Independence Day (04.07), Labor Day (1. Mo Sep), Columbus Day (2. Mo Okt), Veterans Day (11.11), Thanksgiving (4. Do Nov), Christmas (25.12). Fed, ACH, Fedwire, CHIPS geschlossen.', einsteiger: '11 Bundesfeiertage — ganz anderer Kalender als DE. Thanksgiving-Woche = de facto Stillstand.', praxis: 'SAP SCAL: US-Fabrikkalender mit allen 11 Federal Holidays + ggf. bundesstaatlichen. Thanksgiving-Woche: Payment Run vorher abschließen.' },
      { feld: 'Hauptbanken', experte: 'JPMorgan Chase (ABA 021000021) — größte US-Bank, führend Corporate Treasury. Bank of America (ABA 026009593) — zweitgrößte. Citibank N.A. (ABA 021000089) — stärkstes internationales Netzwerk. Wells Fargo (ABA 121000248) — stark Midwest. Goldman Sachs, Morgan Stanley, U.S. Bank, PNC, Truist.', einsteiger: 'Big 4: JPMorgan, BofA, Citi, Wells Fargo. Für MNCs: JPMorgan, Citi oder BofA empfohlen.', praxis: 'JPMorgan + Citi haben beste SAP-Integration und internationale Cash-Management-Plattformen.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. USD 28 Bio (größte Wirtschaft weltweit). Hauptindustrien: Tech, Finance, Healthcare, Defense, Energy. Handelspartner: CN, MX, CA, EU. Schecks noch relevant (~3,4 Mrd./Jahr 2023).', einsteiger: 'Größte Wirtschaft der Welt, USD als Weltwährung, Schecks noch im Einsatz.', praxis: 'Zahlungsziele B2B: Net 30 Standard. Skonto weniger verbreitet als in DE. Check-Zahlungen einplanen.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'Fragmentierte Aufsicht', experte: 'Kein einzelnes Äquivalent zur BaFin. OCC: Bundesbank-Zulassung. Fed: Systemrelevante Banken + Zahlungssysteme. FDIC: Einlagensicherung. FinCEN: AML/BSA. CFPB: Verbraucherschutz. SEC: Kapitalmarkt. Dazu 50 State Regulators für Money Transmitter Laws.', einsteiger: 'Viele Behörden statt einer. Für Zahlungen am wichtigsten: Fed + FinCEN + OFAC.', praxis: 'POBO prüfen: Money Transmitter Laws je Bundesstaat. In manchen States Lizenz nötig.' },
      { feld: 'BSA / AML / USA PATRIOT Act', experte: 'Bank Secrecy Act (31 U.S.C. §5311 ff.) = primäres AML-Gesetz. USA PATRIOT Act (2001): Erweiterung, §314(b) Informationsaustausch. AML Act 2020: Modernisierung, stärkt FinCEN. CTR: Bartransaktionen >USD 10k melden. SAR: Verdacht >USD 5k melden. UBO: Corporate Transparency Act (CTA) seit 01.01.2024, >25% Anteil bei FinCEN melden.', einsteiger: 'Strenges Geldwäschegesetz. Bar >10k wird gemeldet. UBO-Meldung seit 2024 Pflicht.', praxis: 'CTA-Meldung für US-Tochter prüfen (FinCEN BOI-Report). SAR/CTR-Thresholds im Compliance-System hinterlegen.' },
      { feld: 'OFAC — Sanktionen', experte: 'Office of Foreign Assets Control. SDN-Liste (Specially Designated Nationals) breiter als EU-Sanktionen. Gilt für ALLE USD-Zahlungen weltweit — auch DE→DE in USD über US-Korrespondenzbank! Secondary Sanctions: Nicht-US-Personen können sanktioniert werden für Geschäfte mit sanctioned entities.', einsteiger: 'US-Sanktionen gelten weltweit für jede USD-Zahlung. Die Liste ist breiter als EU-Sanktionen.', praxis: 'OFAC-SDN-Screening zwingend für alle USD-Zahlungen. SAP FCM oder Drittanbieter (Fircosoft, Accuity). Tägliche Listen-Updates.' },
      { feld: 'Dodd-Frank / Regulation E / CC', experte: 'Dodd-Frank Act (2010): Post-Finanzkrise. Regulation E (EFTA): Verbraucherschutz bei ACH, Error Resolution Procedures. Regulation CC: Funds Availability für Schecks (max. Hold Period).', einsteiger: 'Verbraucherschutzregeln für ACH und Schecks.', praxis: 'Für B2B (CCD) weniger relevant, aber Error-Resolution-Prozedur dokumentieren.' },
      { feld: 'NACHA Operating Rules', experte: 'Nicht staatliches Gesetz, aber de-facto-Standard: NACHA Rules regeln ACH-Netzwerk. Jährliche Updates. Return Rate <0,5% für ACH Debit Pflicht. Same Day ACH Limit USD 1 Mio. Authorization Requirements für Debit.', einsteiger: 'NACHA-Regeln = das "Gesetz" für ACH-Zahlungen. Jährliche Updates beachten.', praxis: 'NACHA Rules jährlich prüfen. Return Rate monitoren. ACH-Autorisierung für Debit dokumentieren.' },
      { feld: 'State Money Transmitter Laws', experte: 'Je Bundesstaat unterschiedliche Lizenzpflichten für Zahlungsdienstleistungen. Für POBO/IHB relevant: Wenn Zentrale für US-Tochter zahlt, kann MTL-Pflicht entstehen. New York: BitLicense zusätzlich für Krypto.', einsteiger: 'Einzelstaatliche Gesetze — POBO kann Lizenz brauchen.', praxis: 'Vor IHB/POBO-Setup: Legal Opinion je relevanten US-Bundesstaat einholen.' },
      { feld: 'Datenschutz (kein DSGVO-Äquivalent)', experte: 'Kein bundesweites Datenschutzgesetz à la DSGVO. Sektorale Gesetze: CCPA (California), GLBA (Finanzdaten), HIPAA (Health). State-Level: CPRA (CA), CPA (CO), CTDPA (CT), VCDPA (VA). Zahlungsdaten fallen unter GLBA.', einsteiger: 'Kein einheitliches Datenschutzgesetz — je Bundesstaat unterschiedlich.', praxis: 'GLBA-Compliance für US-Zahlungsdaten. CCPA beachten wenn Kalifornien-bezogene Daten verarbeitet werden.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'ACH (Automated Clearing House)', experte: 'US-Massenzahlungssystem. NACHA-reguliert. Betreiber: FedACH (Fed) + EPN (The Clearing House). SEC Codes: PPD (Consumer), CCD (B2B), CTX (B2B+EDI, bis 9.999 Addenda), WEB (Online), TEL (Telefon). Standard: T+1 Credit, T+2 Debit. Same Day ACH: 3 Fenster täglich, Limit USD 1 Mio./Txn.', einsteiger: 'ACH = das US-Äquivalent zu SEPA. Massenzahlungen für Gehälter, Lieferanten, Lastschriften.', praxis: 'SAP: NACHA-DMEE (NACHA_CT, NACHA_DD). CCD für B2B-Standard, CTX wenn EDI-Remittance nötig. Same Day ACH Limit mit Hausbank bestätigen.' },
      { feld: 'Fedwire Funds Service', experte: 'US-RTGS der Federal Reserve. Brutto-Echtzeit, unbegrenzt. Mo–Fr 21:00 ET (Vortag) bis 18:30 ET, Sa 9:00–17:00 ET. Proprietäres Format, ISO 20022 Migration läuft (2025). Nutzung: Immobilien, Großbetrag, Interbank.', einsteiger: 'Echtzeit-Großbetragssystem der Fed — wie TARGET2 für USD.', praxis: 'SAP Zahlungsmethode W (Wire). Fedwire-Cut-off 18:30 ET = 00:30 CET. Format bankspezifisch.' },
      { feld: 'CHIPS', experte: 'Clearing House Interbank Payments System. Betreiber: The Clearing House. ~95% des USD-Interbankenvolumens (~USD 1,8 Bio./Tag). Netting mit Partial RTGS. ~40 direkte Mitglieder. CHIPS-UID: 10-Zeichen-Referenz.', einsteiger: 'Interbanken-Großbetrag — für Corporates nur indirekt relevant.', praxis: 'Für Corporates transparent: Hausbank routet über CHIPS oder Fedwire.' },
      { feld: 'RTP (Real-Time Payments)', experte: 'The Clearing House. Seit 2017. Limit USD 1 Mio. 24/7/365. ISO 20022 nativ. ~400 Banken (2026). Credit-Push only (kein Debit). Request for Payment (RfP) möglich.', einsteiger: 'US-Instant-Payment von den Großbanken. Wachsend.', praxis: 'Prüfen ob US-Hausbank RTP-fähig. ISO 20022 — passt zu pacs.008-Infrastruktur.' },
      { feld: 'FedNow', experte: 'Federal Reserve Instant. Seit Juli 2023. Limit USD 500k. 24/7/365. ISO 20022 nativ. ~700 Banken (2026). Wächst schneller als RTP dank Fed-Infrastruktur.', einsteiger: 'Fed-eigenes Instant-Payment, breiter verfügbar als RTP.', praxis: 'Alternative zu Same Day ACH für eilige Zahlungen. ISO 20022 Vorteil für Remittance.' },
      { feld: 'Schecks', experte: 'Noch ~3,4 Mrd. Schecks/Jahr (2023). Check 21 (2003): Elektronische Verarbeitung via Image Cash Letter (ICL). MICR-Code: ABA + Kontonr. auf Scheck. Stark rückläufig aber für manche US-Lieferanten einzige akzeptierte Methode.', einsteiger: 'Schecks leben noch in den USA. Manche Lieferanten akzeptieren NUR Schecks.', praxis: 'SAP Check-Printing mit MICR-Formularen. Positive Pay-Datei an Bank senden. Check 21 ICL für eingehende Schecks.' },
      { feld: 'Cut-Off-Zeiten', experte: 'ACH Standard: Einreichung beliebig, Settlement T+1 (Credit) / T+2 (Debit). Same Day ACH: 3 Fenster (10:30 ET, 14:45 ET, 16:45 ET). Fedwire: 18:30 ET. RTP/FedNow: 24/7. Schecks: Bankarbeitstag.', einsteiger: 'ACH am selben Tag: bis 16:45 ET. Fedwire: bis 18:30 ET. Instant: rund um die Uhr.', praxis: 'F110-Zahllauf für Same Day ACH bis 08:00 ET starten (= 14:00 CET). Puffer für 10:30-Fenster.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'Buchungskreis-Setup', experte: 'Hauswährung USD. Bewertungsbereich GAAP (US-GAAP) oder IFRS parallel bei EU-Konzern. Chart of Accounts US-spezifisch (CAUS oder firmeneigen). Steuerverfahren TAXUS oder extern (Vertex/Avalara) für Sales Tax.', einsteiger: 'US-Buchungskreis braucht eigene Währung, eigenen Kontenplan und US-Sales-Tax.', praxis: 'Sales Tax über Vertex/Avalara empfohlen (State+County+City-Raten zu komplex für SAP-Standard).' },
      { feld: 'Zahlungsmethoden FBZP', experte: 'Kein SEPA! ACH Credit (CCD/CTX): Methode A oder T. ACH Debit: Methode D. Fedwire: Methode W. Check: Methode C. Keine pain.001 — NACHA-Format oder proprietäres Bankformat.', einsteiger: 'Völlig andere Zahlungsmethoden als in DE. Kein SEPA, kein pain.001.', praxis: 'Pro Methode eigene DMEE-Zuordnung. Check mit MICR-Formular. Wire bankspezifisch.' },
      { feld: 'NACHA-DMEE', experte: 'Festes 94-Zeichen-Satzformat. Record Types: 1=File Header, 5=Batch Header, 6=Entry Detail (ABA+KtNr+Amount), 7=Addenda (Remittance), 8=Batch Control, 9=File Control. CCD: 1 Addenda. CTX: bis 9.999 Addenda (EDI X12 820).', einsteiger: 'NACHA = ACH-Dateiformat. Kein XML, sondern festes Zeichenformat mit 94 Zeichen pro Zeile.', praxis: 'SAP Templates: NACHA_CT, NACHA_DD. Immer mit US-Hausbank testen — bankspezifische Abweichungen möglich.' },
      { feld: 'Check-Processing / Positive Pay', experte: 'SAP Check-Printing: US-Scheckformulare mit MICR-Zeichen (Spezialdrucker). Positive Pay: Bank vergleicht ausgestellte Schecks mit SAP-generierter Datei. Ohne Positive Pay hohes Betrugsrisiko. Check 21 ICL für eingehende Schecks.', einsteiger: 'Schecks drucken + Betrugschutz-Datei an Bank senden.', praxis: 'MICR-Drucker konfigurieren. Positive Pay-DMEE mit Hausbank abstimmen. Pro Schecklauf PP-Datei senden.' },
      { feld: 'ACH Returns + NOC', experte: 'Return Reason Codes R01–R85 (NACHA). Häufig: R01 (Insufficient Funds), R02 (Account Closed), R03 (No Account), R10 (Not Authorized), R29 (Corporate Customer Advises Not Authorized). NOC (Notification of Change): Bank meldet veraltete ABA/KtNr — SAP muss Stammdaten updaten.', einsteiger: 'Fehlgeschlagene ACH-Zahlungen kommen mit Fehlercode zurück. NOC = "bitte Bankdaten updaten".', praxis: 'Return-Code-Verarbeitung in SAP konfigurieren. NOC-Prozess: Stammdaten-Update automatisieren oder Workflow.' },
      { feld: 'Typische Projektfehler', experte: '1) IBAN-Feld für US-Lieferanten gefüllt — US hat kein IBAN. 2) NACHA-DMEE ohne Bank-Anpassung → Rejects. 3) ACH Debit ohne Authorization → R10. 4) Positive Pay vergessen → Betrugsgefahr. 5) Nur EU-Sanktionsliste, nicht OFAC. 6) Thanksgiving-Woche ignoriert. 7) Same Day ACH Limit nicht mit Bank bestätigt. 8) NOC nicht verarbeitet → veraltete Bankdaten.', einsteiger: 'Die 8 häufigsten Fehler bei US-Zahlungsprojekten.', praxis: 'Checkliste bei jedem US-Rollout durchgehen.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout (kein pain.001!)
      { feld: 'NACHA ACH (94-Char Fixed Format)', experte: 'Standard-Zahlungsformat für US-Inlandszahlungen (ACH). Festes 94-Zeichen-Satzformat, KEIN XML. Record Types 1/5/6/7/8/9. Für alle ACH-Transaktionsklassen (CCD, CTX, PPD, WEB).', einsteiger: 'Das US-Standardformat für Massenzahlungen — festes Zeichenformat statt XML.', praxis: 'SAP DMEE: NACHA_CT für Credit, NACHA_DD für Debit. Banktest vor Go-Live Pflicht.' },

      // Sektion 8.1 — ACH / NACHA
      { feld: '► 8.1 — NACHA ACH (Domestic Payments)' },
      { feld: 'Record-Struktur', experte: 'Type 1: File Header (Destination Bank ABA, Origin Company ID). Type 5: Batch Header (SEC Code, Company Entry Description). Type 6: Entry Detail (ABA, Account, Amount, Transaction Code). Type 7: Addenda (Remittance). Type 8: Batch Control (Totals). Type 9: File Control (Grand Totals).', einsteiger: '6 Record-Typen, strikt sequenziell aufgebaut.', praxis: 'NACHA-Validator-Tools nutzen (z.B. nacha.org Validator). SAP-DMEE genau nach Record-Spec aufbauen.' },
      { feld: 'Transaction Codes', experte: '22=Checking Credit, 27=Checking Debit, 32=Savings Credit, 37=Savings Debit. Prenote: 23 (Checking), 33 (Savings) — Testbuchung ohne Betrag zur Kontoverifizierung.', einsteiger: '22=Überweisung auf Girokonto, 27=Lastschrift von Girokonto.', praxis: 'Transaction Code in DMEE Mapping. Prenotes empfohlen bei neuen US-Lieferanten.' },
      { feld: 'SEC Codes', experte: 'CCD: B2B Standard (1 Addenda). CTX: B2B + EDI (bis 9.999 Addenda, X12 820). PPD: Consumer. WEB: Internet-initiated. ARC/BOC: Scheckkonvertierung.', einsteiger: 'CCD = B2B, CTX = B2B mit Rechnungsdetails, PPD = Gehälter.', praxis: 'CCD für Standard-Lieferantenzahlung. CTX nur wenn EDI-Remittance gebraucht wird.' },
      { feld: 'Same Day ACH', experte: '3 Einreichungsfenster: 10:30 ET, 14:45 ET, 16:45 ET. Limit USD 1 Mio./Txn (NACHA Standard, Hausbank kann eigenes Limit haben). Settlement same day. Aufpreis bankabhängig.', einsteiger: 'Eilige ACH am selben Tag — 3x täglich möglich.', praxis: 'F110 bis 08:00 ET (14:00 CET) für erstes Fenster. Limit mit Hausbank bestätigen.' },

      // Sektion 8.2 — Fedwire / CHIPS
      { feld: '► 8.2 — Fedwire / CHIPS (Großbetrag)' },
      { feld: 'Fedwire Format', experte: 'Proprietäres Format der Federal Reserve. ISO 20022 Migration läuft (Go-Live 2025). Felder: Sender ABA, Receiver ABA, Amount, Business Function Code (CTR=Customer Transfer, BTR=Bank Transfer).', einsteiger: 'Eigenes Fed-Format für Großbeträge.', praxis: 'Format bankspezifisch — Hausbank stellt Spec. SAP: Zahlungsmethode W mit eigener DMEE.' },
      { feld: 'CHIPS-UID', experte: '10-Zeichen-Referenz die Zahlung durch CHIPS-System begleitet. Nur für CHIPS-Mitglieder direkt relevant. Corporates indirekt.', einsteiger: 'Interne Referenz im CHIPS-System.', praxis: 'Transparent für Corporates. Bei Reklamation: CHIPS-UID beim Bank-Ansprechpartner erfragen.' },

      // Sektion 8.3 — RTP / FedNow (Instant)
      { feld: '► 8.3 — RTP / FedNow (US Instant Payments)' },
      { feld: 'Format', experte: 'Beide ISO 20022 nativ: pacs.008 für Credit Transfer. Credit-Push only (kein Debit). RTP: Request for Payment (RfP) als Zusatz. Max RTP USD 1 Mio., FedNow USD 500k.', einsteiger: 'US-Instant-Payments nutzen ISO 20022 — wie europäische Formate.', praxis: 'Vorteil: Gleiche pain/pacs-Struktur wie SEPA. Prüfen ob Hausbank RTP/FedNow anbietet.' },

      // Sektion 8.4 — EDI X12 820 (Remittance)
      { feld: '► 8.4 — EDI X12 820 / 835 (Remittance Advice)' },
      { feld: 'X12 820', experte: 'ANSI ASC X12 Transaction Set 820 — Payment Order/Remittance Advice. In ACH CTX als Addenda-Records eingebettet. In produzierenden Industrien (Auto, Retail, Pharma) verbreitet.', einsteiger: 'US-Format für detaillierte Zahlungsinformationen (welche Rechnungen bezahlt wurden).', praxis: 'SAP: EDI-Subsystem (PI/PO mit EDI-Adapter). Nur wenn US-Lieferanten EDI fordern.' },
      { feld: 'X12 835', experte: 'Healthcare Payment and Remittance Advice. HIPAA-reguliert. Für Healthcare-Branche Pflicht.', einsteiger: 'Spezialformat nur für Healthcare-Zahlungen.', praxis: 'Nur relevant bei US-Healthcare-Gesellschaften.' },

      // Sektion 8.5 — Schecks / Check 21
      { feld: '► 8.5 — Schecks / Check 21 / Positive Pay' },
      { feld: 'Check-Format', experte: 'MICR-Zeichen (Magnetic Ink Character Recognition) mit ABA + Kontonummer + Schecknummer. Papier oder Image Cash Letter (ICL) nach Check 21 Act (2003).', einsteiger: 'US-Schecks mit spezieller Magnettinte für automatische Verarbeitung.', praxis: 'MICR-Drucker + SAP-Scheckformular konfigurieren. Schecknummern lückenlos vergeben.' },
      { feld: 'Positive Pay', experte: 'Betrugsschutz: Bank erhält Datei mit ausgestellten Schecks (Nummer, Betrag, Datum, Empfänger). Bank lehnt nicht-gematchte Schecks ab. In USA Best Practice.', einsteiger: 'Schutzmechanismus gegen gefälschte Schecks — Standard bei US-Banken.', praxis: 'Positive Pay-DMEE konfigurieren. Nach jedem Schecklauf PP-Datei an Bank senden. Ohne PP: hohes Betrugsrisiko.' },

      // Sektion 8.6 — pacs.008 / SWIFT ISO 20022
      { feld: '► 8.6 — pacs.008 / SWIFT ISO 20022 (Cross-Border)' },
      { feld: 'CBPR+ Migration', experte: 'SWIFT MT103 abgelöst durch pacs.008.001.09 seit November 2025. Alle US-Großbanken migriert. Strukturierter Remittance Info in RmtInf/Strd.', einsteiger: 'Internationale Zahlungen von/nach USA laufen jetzt auf XML (pacs.008).', praxis: 'SAP: pacs.008-DMEE für Cross-Border USD. MT103 nur noch als Fallback bei Legacy-Korrespondenzbanken.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Stammdaten + Format', experte: 'US-Buchungskreis mit USD. ABA Routing + Kontonummer aller US-Lieferanten gepflegt (KEIN IBAN!). NACHA-DMEE für ACH CCD konfiguriert + mit Hausbank abgestimmt. CTX-Addenda falls EDI-Remittance. US-Fabrikkalender: 11 Federal Holidays.', einsteiger: 'Bankdaten ohne IBAN, ACH-Format einrichten, US-Feiertage pflegen.', praxis: 'ABA-Felder prüfen. NACHA-Testdatei an Bank senden. SCAL US-Kalender.' },
      { feld: 'Pre-Go-Live: Schecks + Compliance', experte: 'Positive Pay-Format konfiguriert (falls Schecks). OFAC-SDN-Liste in Screening eingebunden. ACH-Autorisierungen für Debit dokumentiert. Fedwire/CHIPS-Kanal mit Hausbank. USD/EUR-Kurs-Feed aktiv. NOC-Verarbeitung definiert.', einsteiger: 'Scheckschutz, OFAC-Screening, Lastschrift-Genehmigungen, Devisenkurse.', praxis: 'OFAC zwingend. Positive Pay bei Schecks. NOC-Workflow einrichten.' },
      { feld: 'Produktivsetzung', experte: 'ACH-Testdatei validiert. Same Day ACH Limit mit Bank bestätigt. Erster F110 ACH-Lauf, Return-Codes getestet. OFAC aktiv + nachweisbar. Positive Pay aktiv (falls Schecks). Schecklauf + PP-Datei.', einsteiger: 'Testlauf, Fehlerbehandlung prüfen, OFAC live.', praxis: 'Checkliste: ACH Upload → Return-Test → OFAC-Log → PP-Datei.' },
      { feld: 'Laufender Betrieb', experte: 'NACHA Rules jährlich prüfen. FedNow/RTP-Wachstum beobachten (Instant-Alternative). Fedwire ISO 20022 Migration mit Bank. OFAC-Liste täglich aktuell. ACH Return Rate <0,5% monitoren. Same Day ACH für eilige Zahlungen evaluieren.', einsteiger: 'Jährlich: NACHA-Updates. Täglich: OFAC-Updates. Laufend: Return Rate überwachen.', praxis: 'NACHA-Regeländerungen im SAP Change Management einplanen.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed USA (${COUNTRY_CODE}) Blocks ===`);
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
