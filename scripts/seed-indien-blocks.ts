/**
 * Seed country_blocks for India (IN).
 *
 * Quellen: countries.json, DB migration 0012, excel_04, Domain-Knowledge
 * Block-Struktur aligned with IT/CN/DE/US/CH/GB template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-indien-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'IN';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'IN / IND (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 356.', einsteiger: 'Alpha-2 IN, Alpha-3 IND.', praxis: 'SAP T005 Eintrag.' },
      { feld: 'Währung', experte: 'INR (Indische Rupie, ₹) / ISO 4217: INR. Teilkonvertierbar — Current Account frei, Capital Account stark eingeschränkt (FEMA). INR ist NICHT frei konvertierbar auf dem Kapitalmarkt.', einsteiger: 'Indische Rupie. Nicht frei konvertierbar — Devisenkontrolle durch RBI.', praxis: 'Hauswährung Buchungskreis IN: INR. INR/EUR-Kurs volatil — FX-Hedging empfohlen. RBI-Kurs als Referenz.' },
      { feld: 'Kontoformat (kein IBAN!)', experte: 'KEIN IBAN-Format. Stattdessen: IFSC Code (Indian Financial System Code, 11 alphanumerisch: 4 Bank + 0 + 6 Filiale) + Account Number (9–18 Stellen, bankspezifisch). Beispiel IFSC: SBIN0001234 (SBI, Filiale 1234).', einsteiger: 'Indien hat KEIN IBAN. IFSC Code (≈ BLZ) + Kontonummer.', praxis: 'SAP: IBAN-Feld LEER. IFSC in BNKA (Bankschlüssel). Account Number in LFBK-BANKN. IFSC-Lookup: rbi.org.in.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAAINBB[BBB]. Beispiele: SBI SBININBB, HDFC HDFCINBB, ICICI ABORINBB (Kotak: ABORINBB → KKBKINBB). Für Cross-Border-Zahlungen Pflicht.', einsteiger: 'IN im BIC = Indien. BIC nur für internationale Zahlungen.', praxis: 'IFSC für Inland, BIC für Cross-Border.' },
      { feld: 'Zeitzone', experte: 'IST = India Standard Time = UTC+5:30. Keine Sommerzeit. Ganzjährig +5:30 UTC. +4:30 bis +3:30 vor CET/CEST.', einsteiger: 'UTC+5:30 ganzjährig. 4,5 Stunden vor Deutschland.', praxis: 'NEFT/RTGS Betriebszeiten in IST. RTGS Cut-off 17:45 IST ≈ 13:15 CET (Winter) / 12:15 CEST.' },
      { feld: 'Zentralbank', experte: 'Reserve Bank of India (RBI). Shahid Bhagat Singh Road, Mumbai 400001. rbi.org.in. Reguliert Zahlungssysteme (NEFT, RTGS, UPI), Devisenkontrolle (FEMA), Bankenaufsicht. Extrem aktive Regulierungsbehörde.', einsteiger: 'RBI = Indische Zentralbank. Reguliert alles: Zahlungen, Devisen, Banken.', praxis: 'RBI-Circulars (Rundschreiben) sind normativ. A.P. (DIR Series) für Devisenregulierung verfolgen.' },
      { feld: 'Aufsicht', experte: 'RBI: Banken + Zahlungssysteme + Devisenkontrolle. SEBI: Kapitalmarkt. IRDAI: Versicherungen. FEMA-Enforcement: Directorate of Enforcement (DoE). GST Council: Steuerverwaltung.', einsteiger: 'RBI für Zahlungen, SEBI für Kapitalmarkt.', praxis: 'FEMA-Compliance ist das Hauptrisiko bei IN-Zahlungen. DoE kann Strafen verhängen.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Hindi (Devanagari) + Englisch (offiziell). 22 anerkannte Sprachen. Bankverkehr: Englisch. UTF-8 für ISO 20022 (NEFT/RTGS Migration). ASCII für Legacy-Formate.', einsteiger: 'Bankverkehr auf Englisch. Keine Zeichensatz-Probleme.', praxis: 'Empfängernamen auf Englisch pflegen. Devanagari nur für lokale Dokumente.' },
      { feld: 'Nationale Feiertage', experte: '3 nationale Feiertage: Republic Day (26.01), Independence Day (15.08), Gandhi Jayanti (02.10). PLUS: ~15 regionale/religiöse Feiertage (Diwali, Holi, Eid, Christmas, Dussehra etc.) — variieren nach Bundesstaat und Jahr (Mondkalender!). RBI publiziert jährlich Bankfeiertags-Liste.', einsteiger: 'Nur 3 nationale Feiertage, aber ~15 regionale — variiert jedes Jahr (Mondkalender!).', praxis: 'SAP SCAL: IN-Fabrikkalender jährlich nach RBI-Liste aktualisieren. Diwali-Woche ≈ Stillstand.' },
      { feld: 'Hauptbanken', experte: 'State Bank of India SBI (SBININBB) — größte Bank, Staatsbank. HDFC Bank (HDFCINBB) — größte Privatbank. ICICI Bank (ABORINBB) — zweitgrößte Privatbank. Axis Bank (AXISINBB). Kotak Mahindra (KKBKINBB). Citibank India (CITIINBX) — für MNCs empfohlen. HSBC India (HABORINBB). Deutsche Bank India (DEUTINBB).', einsteiger: 'SBI (Staat), HDFC + ICICI (Privat) dominieren. Für MNCs: Citi India oder HSBC India.', praxis: 'Citi India + HSBC India haben beste Anbindung für ausländische Corporates. Lokale Privatbanken für Massenverkehr.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. USD 3,7 Bio (5. größte Wirtschaft). Hauptindustrien: IT/BPO (Bangalore, Hyderabad), Pharma, Automotive, Textil. Handelspartner: US, CN, AE, EU. Digital India: UPI hat >12 Mrd. Txn/Monat. Riesiger Binnenmarkt.', einsteiger: 'Riesige, schnell wachsende Wirtschaft. UPI (Mobile Payment) ist weltweit führend.', praxis: 'Zahlungsziele B2B: 30–60 Tage. Vorkasse bei Erstgeschäft üblich. GST-Compliance komplex.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'FEMA — Devisenkontrolle', experte: 'Foreign Exchange Management Act 1999 (FEMA). RBI als Enforcement-Behörde. Current Account: frei, aber dokumentationspflichtig. Capital Account: stark eingeschränkt (Genehmigung für ODI/FDI). ECB (External Commercial Borrowings): RBI-genehmigt, Zinsobergrenze, Laufzeitminimum. Jede Cross-Border-Zahlung braucht Purpose Code + Dokumentation.', einsteiger: 'Strengste Devisenkontrolle der großen Wirtschaftsnationen. Geld kann nicht frei rein oder raus.', praxis: 'Ohne korrekten Purpose Code + Underlying Documents lehnt die Bank die Auslandszahlung ab.' },
      { feld: 'RBI Purpose Codes', experte: 'Pflicht für jede Cross-Border-Zahlung. 4-stellig alphanumerisch, RBI-definiert. Beispiele: P0103 (Goods Import), P0802 (Software Services), P1006 (Management Consulting), P0801 (Computer Services), P1301 (Dividends), P1302 (Interest on ECB). Codekatalog: RBI Master Direction – Reporting under FEMA, Anhang.', einsteiger: 'Ein 4-stelliger Code der sagt, wofür die Zahlung ist. Pflicht bei jeder Auslandszahlung.', praxis: 'Purpose Code in SAP als Custom-Feld pro Zahlung. RBI-Codekatalog: rbi.org.in → Master Directions → Reporting under FEMA.' },
      { feld: 'POBO / COBO — Verboten', experte: 'POBO (Payment on Behalf of) und COBO (Collection on Behalf of) sind unter FEMA für Cross-Border verboten. Jede indische Entity muss von eigenem lokalen Konto zahlen. IHB nur als Reporting-Layer — kein physischer Cashpool mit Ausland.', einsteiger: 'Zentrale aus dem Ausland darf NICHT für die indische Tochter zahlen.', praxis: 'Lokales INR-Konto bei indischer Bank Pflicht. IHB-Integration nur informatorisch.' },
      { feld: 'TDS (Tax Deducted at Source)', experte: 'Income Tax Act Sec. 195: TDS auf alle Zahlungen an Non-Residents. Typische Sätze: 10% auf technische Services/Royalties (DBA-Satz DE-IN), 20% ohne PAN. Withholding Tax Certificate (Form 15CA/15CB) Pflicht ab INR 500k. CA-Zertifikat (15CB) durch Chartered Accountant.', einsteiger: 'Bei Auslandszahlungen wird Steuer einbehalten. Form 15CA/15CB Pflicht.', praxis: 'SAP WHT-Konfiguration: TDS-Sätze nach DBA. Form 15CA online bei Income Tax Portal. 15CB durch CA.' },
      { feld: 'GST (Goods and Services Tax)', experte: 'Seit 01.07.2017. GSTIN (15-stellig) = Steuer-ID. Mehrere Slabs: 0%, 5%, 12%, 18%, 28%. IGST für Interstate, CGST+SGST für Intrastate. GST Return Filing: GSTR-1 (Outward), GSTR-3B (Summary). e-Invoice Pflicht ab INR 5 Crore Umsatz (seit 2023). e-Way Bill für Warentransport >INR 50k.', einsteiger: 'Indische Umsatzsteuer mit mehreren Sätzen. GSTIN in jeder Rechnung Pflicht.', praxis: 'GSTIN im Kreditorenstamm (STCD1). SAP GST-Localization oder Add-on (Eway, ClearTax). e-Invoice via IRP-Portal.' },
      { feld: 'PAN (Permanent Account Number)', experte: '10-stellig alphanumerisch (z.B. AAACR1234F). Pflicht für Steuerzwecke und Bankverkehr. Ohne PAN: Höherer TDS-Satz (20% statt DBA-Satz). PAN in jeder Cross-Border-Zahlung >INR 250k.', einsteiger: 'Indische Steuer-ID. Ohne PAN zahlt man mehr Steuern.', praxis: 'PAN im Firmenstamm (STCD2). Bei Zahlungen an Non-Residents: PAN des indischen Zahlers in Unterlagen.' },
      { feld: 'Datenlokalisierung (RBI)', experte: 'RBI Storage of Payment System Data (2018): Alle Zahlungsdaten müssen in Indien gespeichert werden. Applies to: Kreditkarten, UPI, Wallets, Prepaid. Für Corporate Treasury (NEFT/RTGS): Weniger strikt, aber IN-Bankdaten sollten in IN-Systemen verbleiben.', einsteiger: 'Zahlungsdaten müssen in Indien gespeichert werden.', praxis: 'Für SAP: Prüfen ob Payment-Daten auf IN-Servern liegen oder Ausnahme greift (Corporate Banking).' },
      { feld: 'LRS (Liberalised Remittance Scheme)', experte: 'RBI LRS: Privatpersonen dürfen bis USD 250k/Jahr ins Ausland überweisen. Für Corporates nicht direkt relevant, aber zeigt das Gesamtregulierungsniveau. Corporates: Keine USD-Obergrenze, aber Purpose Code + Dokumentation für jeden Transfer.', einsteiger: 'Selbst Privatpersonen haben ein Devisen-Limit. Firmen brauchen für jede Zahlung Belege.', praxis: 'Corporate-Zahlungen: Kein Betragslimit, aber lückenlose Dokumentation (Vertrag, Rechnung, Board Resolution).' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'NEFT (National Electronic Fund Transfer)', experte: 'INR-Batch-Clearing. RBI-betrieben. Seit Dezember 2019: 24/7 (vorher nur Mo–Sa). Half-hourly Settlement (jede 30 Min ein Batch). Kein Betragslimit. IFSC + Account Number als Routing. ISO 20022 Migration laufend.', einsteiger: 'Indisches Massen-Überweisungssystem, rund um die Uhr, jede halbe Stunde.', praxis: 'Standard für B2B-INR-Zahlungen. SAP: IFSC in Bankstamm. Kein Cut-off (24/7), aber Settlement in 30-Min-Zyklen.' },
      { feld: 'RTGS (Real-Time Gross Settlement)', experte: 'INR-RTGS der RBI. Echtzeit, Brutto. Min. INR 200.000 (seit 2020). Seit Dezember 2020: 24/7/365 (Indien war eines der ersten Länder mit 24/7 RTGS!). IFSC-basiertes Routing. ISO 20022 Migration parallel zu NEFT.', einsteiger: 'Echtzeit-Großbetragszahlungen ab INR 200k. Rund um die Uhr.', praxis: 'SAP: Zahlungsmethode für RTGS (Betragsuntergrenze INR 200k). Routing über IFSC.' },
      { feld: 'UPI (Unified Payments Interface)', experte: 'NPCI-betrieben (National Payments Corporation of India). Instant, 24/7, kostenlos. >12 Mrd. Txn/Monat (2025). VPA (Virtual Payment Address) statt Kontonummer. Limit: INR 100k (Standard), INR 200k (verifiziert), INR 500k (B2B geplant). Primär Retail/P2P, aber B2B-Ausbau läuft.', einsteiger: 'Weltweit erfolgreichstes Instant-Payment-System. Aktuell primär für Retail, aber B2B kommt.', praxis: 'Für Corporate Treasury aktuell wenig relevant. B2B-UPI-Entwicklung beobachten.' },
      { feld: 'IMPS (Immediate Payment Service)', experte: 'NPCI-betrieben. Instant, 24/7. Limit INR 500k. Älterer Vorgänger von UPI. MMID + Mobile Number oder IFSC + Account Number. Für interbank-Transfers.', einsteiger: 'Älteres Instant-Payment — wird zunehmend durch UPI ersetzt.', praxis: 'Für Corporate: NEFT/RTGS bevorzugen. IMPS nur für kleine eilige Zahlungen.' },
      { feld: 'SWIFT (Cross-Border)', experte: 'Alle internationalen INR- und Fremdwährungs-Zahlungen über SWIFT. pacs.008.001.09 seit CBPR+ November 2025. Korrespondenzbank-Modell. RBI Purpose Code im Feld 70 (MT103) oder RmtInf (pacs.008). NOSTRO/VOSTRO-Konten bei AD-Banken (Authorised Dealer Banks).', einsteiger: 'Internationale Zahlungen nach/aus Indien laufen über SWIFT.', praxis: 'Purpose Code MUSS in SWIFT-Nachricht stehen. Nur AD Cat-I Banken dürfen FX-Transaktionen abwickeln.' },
      { feld: 'Lokales Konto Pflicht', experte: 'Unter FEMA: Jede indische Legal Entity muss eigenes INR-Konto bei einer AD-Bank (Authorised Dealer Category I) führen. Kontoeröffnung: PAN, Certificate of Incorporation, Board Resolution, KYC-Dokumente. Vorlauf: 4–8 Wochen. Keine POBO-Alternative.', einsteiger: 'Ohne lokales indisches Bankkonto geht nichts. POBO aus dem Ausland verboten.', praxis: 'Kontoeröffnung bei Citi India oder HSBC India empfohlen für MNCs. Board Resolution mit authorisierten Zeichnern.' },
      { feld: 'Cut-Off-Zeiten', experte: 'NEFT: 24/7, Settlement alle 30 Min. RTGS: 24/7, Echtzeit. UPI/IMPS: 24/7, Echtzeit. SWIFT Outbound: Bankspezifisch, typisch 15:00–16:00 IST (≈ 10:30–11:30 CET). Form 15CA/15CB: Muss VOR der Zahlung eingereicht werden.', einsteiger: 'Inlandssysteme 24/7. SWIFT bis ~16:00 Uhr Indien-Zeit.', praxis: 'F110 für SWIFT-IN: bis 09:00 CET starten (≈ 13:30 IST, Puffer zum Bank-Cut-off).' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'Localization-Paket', experte: 'SAP India Localization (IN): GST-Integration (TAXINN Procedure), TDS/TCS-Konfiguration, e-Invoice via IRP, e-Way Bill. OSS Note 2830498 als Einstieg. S/4HANA Cloud: SAP Document Compliance India.', einsteiger: 'SAP-Standard-Add-on für Indien — Steuern, e-Invoice, GST.', praxis: 'Ohne IN-Localization keine compliant Zahlungen. TAXINN-Steuerverfahren aktivieren.' },
      { feld: 'Zahlungsmethoden FBZP', experte: 'NEFT: Zahlungsmethode N oder T. RTGS: Zahlungsmethode R (Betragsuntergrenze INR 200k). SWIFT Outbound: Methode S. Check: Methode C (noch verbreitet in Indien!). Format: Bankspezifisch (kein Standard-DMEE wie SEPA).', einsteiger: 'Eigene Zahlungsmethoden für NEFT, RTGS, SWIFT und Schecks.', praxis: 'Pro Bank eigene DMEE oder H2H-Connector. Schecks noch überraschend relevant in Indien.' },
      { feld: 'TDS-Konfiguration', experte: 'SAP WHT (Withholding Tax): Extended Withholding Tax für IN. TDS-Sektionen: 194C (Contractors), 194J (Professional/Technical), 195 (Non-Residents). Sätze per DBA reduzierbar. Form 15CA/15CB-Workflow integrieren. TDS-Return: Quarterly Filing (Form 26Q/27Q).', einsteiger: 'Steuerabzug bei Zahlungen — verschiedene Sätze je nach Zahlungsart.', praxis: 'WHT-Typen in SAP für alle relevanten TDS-Sektionen anlegen. Quarterly TDS Return automatisieren.' },
      { feld: 'GST + e-Invoice', experte: 'GST e-Invoice seit 2023 für Unternehmen ab INR 5 Crore Umsatz. JSON-Format an IRP (Invoice Registration Portal). IRN (Invoice Reference Number) + QR-Code auf jeder Rechnung. SAP Document Compliance India oder ClearTax/Avalara.', einsteiger: 'Elektronische Rechnung mit QR-Code Pflicht ab bestimmtem Umsatz.', praxis: 'IRP-Anbindung via SAP DRC oder Drittanbieter. E-Way Bill für Warentransport >INR 50k separat.' },
      { feld: 'Purpose Code in SAP', experte: 'RBI Purpose Code (4-stellig) muss pro Zahlung in der SWIFT-Nachricht stehen. In SAP: Custom-Feld im Zahlungsvorschlag (F110) oder BTE 2040. Mapping: Leistungsart/Materialgruppe → Purpose Code. Beispiele: P0103 (Goods Import), P0802 (Software Services).', einsteiger: 'Jede Auslandszahlung braucht einen Purpose Code im Zahlungsfile.', praxis: 'Custom-Tabelle mit Purpose-Code-Mapping anlegen. BTE 2040 oder DMEE Enhancement für Purpose Code.' },
      { feld: 'Typische Projektfehler', experte: '1) IBAN-Feld für IN-Lieferanten gefüllt — Indien hat kein IBAN. 2) Purpose Code fehlt → Bank-Rejection. 3) Form 15CA/15CB nicht vor Zahlung eingereicht → Bank verweigert Ausführung. 4) TDS-Satz falsch (ohne DBA = 20%). 5) GSTIN fehlt → kein Input Tax Credit. 6) POBO versucht → FEMA-Verstoß. 7) Diwali-Woche nicht im SCAL → Zahlungen terminiert. 8) IFSC Code veraltet (Bankfusionen häufig in Indien).', einsteiger: 'Die 8 häufigsten Fehler bei Indien-Zahlungsprojekten.', praxis: 'FEMA-Compliance-Checkliste bei jedem IN-Rollout durchgehen.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout (kein pain.001 — bankspezifisch)
      { feld: 'Bankspezifisches H2H-Format (NEFT/RTGS)', experte: 'Kein einheitliches pain.001 für Indien. Jede Bank hat eigenes Host-to-Host-Format (CSV, Fixed-Length, XML proprietär). ISO 20022 Migration für NEFT/RTGS laufend (RBI-Initiative, kein fester Deadline). IFSC + Account Number als Kernfelder.', einsteiger: 'Jede Bank hat ihr eigenes Format — kein Standard wie SEPA.', praxis: 'Pro Bank eigene DMEE oder Bank-Connector. Citi India + HSBC India bieten XML-H2H.' },

      // Sektion 11.1 — NEFT / RTGS
      { feld: '► 11.1 — NEFT / RTGS (INR Domestic)' },
      { feld: 'Dateiformat', experte: 'Bankspezifisch: SBI = eigenes CSV-Format. HDFC = Fixed-Length. ICICI = XML proprietär. Citi India = ISO-20022-naher XML-Standard (CitiConnect). Kernfelder: IFSC, Account Number, Beneficiary Name, Amount, Purpose Code (für Cross-Border).', einsteiger: 'Kein einheitliches Format — jede Bank anders.', praxis: 'Bank-Spec anfordern. DMEE-Baum oder Bank-Middleware (z.B. Citi/HSBC H2H-Portal).' },
      { feld: 'IFSC Code', experte: '11-stellig alphanumerisch. Format: [4 Bank][0][6 Filiale]. Beispiel: SBIN0001234 (SBI, Filiale 1234). 5. Stelle immer 0 (reserviert). RBI publiziert IFSC-Verzeichnis. ACHTUNG: Durch häufige Bankfusionen in Indien ändern sich IFSC-Codes!', einsteiger: 'Indische Bankkennung — 11 Zeichen, ähnlich wie BLZ.', praxis: 'IFSC in BNKA-BANKL. Regelmäßig gegen RBI-Verzeichnis prüfen (Fusionen!).' },
      { feld: 'NEFT vs. RTGS Routing', experte: 'NEFT: Kein Betragslimit, Settlement alle 30 Min (24/7). RTGS: Min. INR 200k, Echtzeit (24/7). Routing in SAP über Betragsschwelle: <INR 200k → NEFT, ≥INR 200k → RTGS (oder immer RTGS für Eiligkeit).', einsteiger: 'Kleine Beträge über NEFT, große über RTGS.', praxis: 'Zahlungsmethode in FBZP mit Betragsuntergrenze für RTGS. F110 routet automatisch.' },

      // Sektion 11.2 — SWIFT (Cross-Border)
      { feld: '► 11.2 — SWIFT pacs.008 (Cross-Border IN)' },
      { feld: 'Purpose Code Träger', experte: 'MT103 Feld 70: "/PURP/P0802/" (Purpose Code als Präfix). pacs.008: Purp/Prtry oder RmtInf/Strd/AddtlRmtInf. Zusätzlich: Form 15CA/15CB-Nummer in Feld 70 oder AddtlRmtInf. AD-Bank (Authorised Dealer) validiert Purpose Code gegen FEMA-Katalog.', einsteiger: 'Purpose Code und Steuerformular-Nummer müssen in der SWIFT-Nachricht stehen.', praxis: 'SAP: BTE 2040 oder DMEE Enhancement. Purpose Code + 15CA-Ref in Verwendungszweck.' },
      { feld: 'FIRA (Foreign Inward Remittance Advice)', experte: 'Bei eingehenden Devisen: Bank stellt FIRA aus als Nachweis für RBI-Compliance. FIRA enthält Purpose Code, Betrag, Absenderdaten. Für IN-Tochter wichtig für Steuererklärung + FEMA-Reporting.', einsteiger: 'Quittung der Bank für eingehende Auslandszahlungen — für Steuerzwecke wichtig.', praxis: 'FIRA archivieren. Für Transfer Pricing Dokumentation relevant.' },

      // Sektion 11.3 — e-Invoice / GST
      { feld: '► 11.3 — GST e-Invoice / e-Way Bill' },
      { feld: 'e-Invoice', experte: 'JSON-Format an IRP (Invoice Registration Portal, einvoice.gst.gov.in). Pflicht ab INR 5 Crore Umsatz. Response: IRN (Invoice Reference Number) + signierter QR-Code. IRN ist 64-Zeichen-Hash. Gültigkeit: 24h für IRP-Upload nach Rechnungsdatum.', einsteiger: 'Elektronische Rechnung im JSON-Format an staatliches Portal. QR-Code auf Rechnung.', praxis: 'SAP DRC India oder ClearTax/Avalara. 24h-Frist für IRP-Upload beachten!' },
      { feld: 'e-Way Bill', experte: 'Pflicht für Warentransport >INR 50k. Portal: ewaybillgst.gov.in. Enthält: GSTIN Absender/Empfänger, HSN-Code, Transportdetails, Fahrzeugnummer. Gültigkeit: distanzabhängig (1 Tag / 100 km).', einsteiger: 'Digitaler Frachtbrief — Pflicht bei Warenlieferung über INR 50k.', praxis: 'SAP SD-Integration für e-Way Bill. Automatische Generierung bei Warenausgang.' },

      // Sektion 11.4 — Kontoauszug
      { feld: '► 11.4 — Kontoauszug / Statement' },
      { feld: 'Bank Statement', experte: 'Format bankspezifisch: MT940 bei SWIFT-angebundenen Banken (Citi, HSBC). Proprietäre Formate bei indischen Banken (SBI, HDFC). camt.053 im Aufbau (Teil der ISO-20022-Migration). PDF-Statements noch weit verbreitet.', einsteiger: 'Kontoauszug — Format hängt von der Bank ab. MT940 bei internationalen Banken.', praxis: 'MT940 oder proprietäres Format. camt.053 bei Citi/HSBC India erfragen.' },
    ],
  },

  // ───── Block 6: Purpose Codes (RBI) ────────────────────────────────────────
  {
    no: 6,
    title: 'Purpose Codes (RBI)',
    rows: [
      { feld: 'Was ist ein RBI Purpose Code?', experte: 'RBI-definierter 4-/5-stelliger alphanumerischer Code für jede Cross-Border-Zahlung unter FEMA. Basiert auf RBI Master Direction – Reporting under FEMA (2016). Pflicht für alle Outward und Inward Remittances. AD-Bank validiert vor Ausführung.', einsteiger: 'Ein Code der der RBI sagt, wofür das Geld die Grenze überquert. Ohne Code keine Zahlung.', praxis: 'Ohne korrekten Purpose Code weigert sich die Bank. Code-Katalog bei AD-Bank anfordern oder RBI-Website.' },
      { feld: 'Struktur', experte: 'Format: P + 4 Ziffern oder S + 4 Ziffern. P = Payments (Outward). S = Receipts (Inward). Erste Ziffer nach P/S = Kategorie. Unterkategorien mit weiteren Ziffern.', einsteiger: 'P = Zahlungen ins Ausland, S = Zahlungen aus dem Ausland.', praxis: 'Mapping-Tabelle: Leistungsart → Purpose Code in SAP pflegen.' },
      { feld: 'P0103 — Goods / Imports', experte: 'Import von Waren. Häufigster Code für Handelszahlungen. Zollerklärung (Bill of Entry) als Beleg nötig.', einsteiger: 'Warenimport.', praxis: 'Bill of Entry Nummer in Verwendungszweck.' },
      { feld: 'P0802 — Software / IT Services', experte: 'Zahlung für Software-Entwicklung, IT-Dienstleistungen, SaaS-Lizenzen. Sehr häufig bei indischen IT-Unternehmen.', einsteiger: 'IT-Services und Software.', praxis: 'TDS Sec. 195: 10% WHT auf technische Services (DBA DE-IN).' },
      { feld: 'P1006 — Management Consulting', experte: 'Beratungsdienstleistungen, Management Fees, Shared Services.', einsteiger: 'Beratungshonorare.', praxis: 'Transfer-Pricing-Doku Pflicht. Arm\'s-Length-Prüfung durch Steuerberater.' },
      { feld: 'P0801 — Computer Services', experte: 'Hardware-Wartung, Cloud-Hosting, Rechenzentrums-Services.', einsteiger: 'IT-Infrastruktur-Dienstleistungen.', praxis: 'Abgrenzung zu P0802 (Software) mit Steuerberater klären.' },
      { feld: 'P1301 — Dividends', experte: 'Gewinnausschüttung an ausländische Gesellschafter. TDS Sec. 195: 10% WHT (DBA DE-IN). Board Resolution + Dividendenberechnung als Beleg.', einsteiger: 'Dividende ins Ausland.', praxis: 'WHT 10% (DBA). Form 15CA/15CB Pflicht. Board Resolution beilegen.' },
      { feld: 'P1302 — Interest on ECB', experte: 'Zinsen auf External Commercial Borrowings (Auslandskredite). RBI-ECB-Genehmigung Voraussetzung. Zinsobergrenze: SOFR + 450 bps (variiert). TDS Sec. 195.', einsteiger: 'Zinszahlung auf Auslandskredite.', praxis: 'ECB-Registrierung bei RBI prüfen. Zinsobergrenze einhalten. WHT konfigurieren.' },
      { feld: 'P0306 — Royalties / License Fees', experte: 'Lizenzgebühren, Patente, Markenrechte. TDS Sec. 195: 10% WHT (DBA DE-IN). RBI-Obergrenze für Royalty: aufgehoben seit 2009, aber Transfer-Pricing-Prüfung.', einsteiger: 'Lizenz- und Nutzungsgebühren.', praxis: 'Transfer Pricing Documentation zwingend. WHT + GST (18% auf Import of Services) beachten.' },
      { feld: 'Offizielle Quelle (RBI)', experte: 'RBI Master Direction – Reporting under FEMA, 2016 (aktualisiert laufend). Anhang: "Purpose Code List". Abrufbar: rbi.org.in → Master Directions → Reporting under FEMA. Alternativ: AD-Bank stellt aktuelles Mapping zur Verfügung.', einsteiger: 'Offizieller Codekatalog auf der RBI-Website.', praxis: 'AD-Bank-Mapping als Excel anfordern. Jährlich auf RBI-Updates prüfen (neue Codes, Umbenennungen).' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Indien (${COUNTRY_CODE}) Blocks ===`);
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
