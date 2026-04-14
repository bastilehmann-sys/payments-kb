/**
 * Seed Serbia into the Länder tab (country + linked document + country_blocks).
 *
 * Idempotent: re-runs upsert the country row, replace the document by slug,
 * and recreate country_blocks for RS.
 *
 * Run: pnpm tsx scripts/seed-serbia.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { createHash } from 'node:crypto';

config({ path: '.env.local' });

import { db } from '@/db/client';
import { countries, documents, countryBlocks, ihbEntries } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

type BlockRow = {
  feld: string;
  experte: string | null;
  einsteiger: string | null;
  praxis: string | null;
};

type Block = { blockNo: number; blockTitle: string; rows: BlockRow[] };

const MD_PATH = path.join(process.cwd(), 'content', 'laender', 'serbien.md');

const SERBIA = {
  code: 'RS',
  name: 'Serbien',
  complexity: 'high',
  summary:
    'Hochreguliert. ISO 20022 komplett (11/2025), aber NBS-Zahlungscodes Pflicht, KZ-Reporting, 60-Tage-Repatriierung, keine Standard-IHB-Teilnahme, kein COBO/POBO, eingeschränktes Cash Pooling. Komplexitätsscore 8/10.',
  currency: 'RSD (Dinar, managed float, an EUR gepeggt)',
  central_bank: 'National Bank of Serbia (NBS) — Regulator & Betreiber',
  iso20022_status: 'Ja — alle NBS-Systeme seit 11/2025 vollständig migriert',
  instant_payments: 'Ja — IPS NBS, 24/7, ~1,2 sec (seit 2018)',
  intercompany_netting: 'Nein — kein Standard-IHB; lokales Modell mit KZ-gemeldeten IC-Krediten',
  cash_pooling_external: 'Nein — keine Daily Sweeps; wöchentliche/monatliche manuelle Transfers',
  pobo: 'Nein — durch FX-Kontrolle & 60-Tage-Repatriierung blockiert',
  pino_routing: 'Ja — PINO Forwarding/Routing via APM, Ausführung lokal',
  special_format_requirements: 'NBS-Code (3-stellig) in <Purp><Prtry> Pflicht; für Steuer + poziv na broj Model 97',
  special_regulatory_requirements: 'NBS-Mittelkurs zwingend, DI-1 quartalsweise, KZ-1/2 in 10 Tagen, KZ-3B pro Tx, 60-Tage-Repatriierung',
  key_note: '',
};

const BLOCKS: Block[] = [
  {
    blockNo: 1,
    blockTitle: 'Allgemein Serbien',
    rows: [
      { feld: 'Währung', experte: 'RSD (ISO 4217: 941) — managed float, eng an EUR gepeggt', einsteiger: 'Serbischer Dinar, Kurs quasi an den Euro gebunden', praxis: 'Im SAP RSD als lokale Währung + EUR/USD als Parallelwährung aktivieren' },
      { feld: 'Zentralbank / Aufsicht', experte: 'National Bank of Serbia (NBS) — zugleich Regulator und Betreiber aller sechs NBS-Zahlungssysteme; FX-Aufsicht seit 01.01.2019', einsteiger: 'NBS macht alles: Regeln, Zahlungsnetz und FX-Kontrolle', praxis: 'Einzige relevante Gegenseite für Treasury-Themen in Serbien' },
      { feld: 'Bankensektor', experte: '20 Banken (Stand 03/2025), 77 % Marktanteil in ausländischer Hand; Bilanzsumme ~USD 62 Mrd. (≈ 69 % BIP)', einsteiger: 'Überschaubarer Markt, dominiert von ausländischen Banken', praxis: 'Für IC-Transfers Hausbank mit aktiver Cross-Border-FX-Abteilung wählen' },
      { feld: 'Kontoformat', experte: '3-13-2 lokales Format (z. B. 160-0000123456789-12) oder RS35 + 18 Ziffern (IBAN)', einsteiger: 'Serbien hat eigenes Kontoformat, IBAN gibt es aber auch', praxis: 'In SAP Bankkonten-Stammdaten IBAN-Format nutzen; Single Register of Accounts (NBS) prüfen' },
      { feld: 'Bankfeiertage', experte: 'Januar: 1/2/7; Februar: Sretenje; Mai: 1–2; Ostern (orthodox, nach julianisch); November: Waffenstillstand', einsteiger: 'Mehrere Feiertage liegen anders als im katholischen Europa (orth. Ostern!)', praxis: 'SAP Factory Calendar separat pflegen; nicht an DE/AT angleichen' },
    ],
  },
  {
    blockNo: 2,
    blockTitle: 'Regulatorik Serbien',
    rows: [
      { feld: 'Law on Foreign Exchange Operations', experte: 'Zakon o deviznom poslovanju — RS Official Gazette 62/2006 + Änderungen 2025. FX-Konvertierung, Cross-Border-Zahlungen, IC-Kredite, FX-Reporting.', einsteiger: 'Haupt-Gesetz für alles was mit Fremdwährung und Ausland zu tun hat', praxis: 'Basis für KZ-Formulare, 60-Tage-Repatriierung, Related-Party-Limits' },
      { feld: 'Law on Payment Services', experte: 'Zakon o platnim uslugama — RS OG 139/2014 + Änderungen. EU-PSD2-aligned.', einsteiger: 'Gesetz für Zahlungsdienste — regelt auch NBS-Codes', praxis: 'Grundlage der NBS-Entscheidung zu „Uniform Payment Instruments"' },
      { feld: 'Law on Banks', experte: 'Zakon o bankama — RS OG 107/2005 + 19/2025. Lizenz, Kapital, Related-Party-Exposure max. 25 % Bankkapital.', einsteiger: 'Regelt was Banken dürfen; wichtig wegen Pooling-Limits', praxis: 'Cross-Guarantees von RS-Residenten an Non-Residenten unter Art. 23 FX-Gesetz' },
      { feld: 'Decision on Reporting Foreign Credit Transactions', experte: 'NBS-Entscheidung auf Basis Art. 24 FX-Gesetz. KZ-1 bis KZ-3B.', einsteiger: 'Die Reporting-Formulare für jeden IC-Kredit', praxis: 'KZ-1 binnen 10 Tagen nach Vertragsunterzeichnung, KZ-3B pro Auszahlung/Rückzahlung' },
      { feld: 'Decision on Uniform Payment Instruments', experte: 'NBS-Entscheidung nach Law on Payment Services — ordnet NBS-Zahlungscodes auf JEDER Zahlung an.', einsteiger: 'Zwingt den dreistelligen „sifra placanja"-Code auf jede Zahlung', praxis: 'In DMEEX-Formatbaum abbilden; APM-Validation für RS-Outgoing' },
      { feld: 'Law on Tax Procedure (Art. 30a)', experte: 'Zakon o poreskom postupku — Relevanz für Payment Codes 240/253/254 und „poziv na broj" (BPO Reference).', einsteiger: 'Für Steuerzahlungen braucht man den richtigen Code + Referenznummer', praxis: 'SAP-seitig Z-Tabelle NBS-Code → Tax-Art mit Validierung pflegen' },
      { feld: 'Behörden', experte: 'NBS (primär), Poreska uprava (Steuer), Carinska uprava (Zoll). Tax Clearance vor Cross-Border-Ausgang häufig erforderlich.', einsteiger: 'NBS ist Haupt-Ansprechpartner; daneben Steuer und Zoll', praxis: 'Steuerbescheinigung vor Dividendenausschüttung ins Ausland einholen' },
    ],
  },
  {
    blockNo: 3,
    blockTitle: 'Clearing-Systeme & lokale Banken',
    rows: [
      { feld: 'NBS RTGS', experte: 'RSD-RTGS, Schwelle ≥ RSD 300.000 zwingend, 09:00–18:00 Business Days, ISO 20022 seit 11/2025', einsteiger: 'Echtzeit-Großbetragsverkehr in Dinar', praxis: 'Cut-off in BCM Approval Pattern pflegen; SAP-seitig RTGS-Priorität für Großbeträge' },
      { feld: 'NBS Clearing', experte: 'Multilateral Net Settlement für RSD < 300.000, ISO 20022 seit 11/2025', einsteiger: 'Günstiger Batch-Transfer für Klein-/Mittelbeträge', praxis: 'Standard-Pfad für laufende Lieferantenzahlungen' },
      { feld: 'IPS NBS (Instant)', experte: '24/7/365 Instant Credit Transfer, ~1,2 sec, ≤ RSD 300.000/Tx, ISO 20022 seit Launch 2018, NBS-QR-Code-Unterstützung', einsteiger: 'Serbiens Echtzeit-Zahlungssystem — schon seit 2018 auf ISO 20022', praxis: 'QR-Code in B2B-Rechnungen einbauen (zunehmend Standard)' },
      { feld: 'NBS Interbank FX Clearing', experte: 'Clearing von FX-Zahlungen zwischen RS-Banken in EUR/USD/etc., ISO 20022 seit 11/2025', einsteiger: 'Serbische Interbank-FX', praxis: 'Relevant für FX-Konten in RS' },
      { feld: 'International FX Clearing', experte: 'Tripartite-Abkommen RS/BA/ME (Bosnien-Herzegowina, Montenegro) — EUR/USD-Cross-Border-Clearing', einsteiger: 'Spezialsystem für Zahlungen in die direkten Nachbarländer', praxis: 'Günstiger als Standard-SWIFT für BA/ME-Traffic' },
      { feld: 'DinaCard', experte: 'NBS-eigener nationaler Card Scheme (Alternative zu Visa/MC)', einsteiger: 'Serbisches Bezahlkartensystem', praxis: 'Für Corporate-Kartenpayment nur begrenzt relevant' },
      { feld: 'Typische Hausbanken', experte: 'Banca Intesa (Bankcode 160, BIC DBDBRSBG), UniCredit Srbija (170), Raiffeisen (265), OTP Bank Srbija, Erste Bank, ProCredit Bank', einsteiger: 'Meist österreichische/italienische Mutter-Banken mit RS-Tochter', praxis: 'Onboarding der DMEEX-XML-Details immer bilateral mit jeder RS-Hausbank klären' },
    ],
  },
  {
    blockNo: 4,
    blockTitle: 'SAP-Besonderheiten Serbien',
    rows: [
      { feld: 'Company Code', experte: 'Eigener RS-Company Code, RSD als lokale Währung, EUR/USD als Parallelwährungen via OB22', einsteiger: 'Separate Gesellschaft im SAP mit Dinar als Hauptwährung', praxis: 'OBY6 + OB22 konfigurieren; keine IHB-Mitgliedschaft (s. Routing Object)' },
      { feld: 'Wechselkurs — NBS Mittelkurs Pflicht', experte: 'Dedizierter Exchange Rate Type (z. B. ZNBS) in OB07; tägliches Upload-Interface via NBS kursnaListaModul; ZNBS in OB08 für alle RS-CC-Übersetzungen', einsteiger: 'NBS-Kurs wird zwingend täglich in SAP geladen — eigener Kurs-Typ', praxis: 'Automatisiertes Custom Interface + FI-Differenzkonten für NBS-vs-Bankkurs-Delta' },
      { feld: 'NBS-Zahlungscode Masterdata', experte: 'Custom Z-Tabelle ZNBS_PAY_CODES, quartalsweise aus NBS-XML geladen; pro Code Default-Scenario / GL-Konto', einsteiger: 'Tabelle aller NBS-Codes mit Zuordnung zum Buchungs-Set', praxis: 'Job läuft quartalsweise, flaggt neue/gelöschte Codes; Vendor-Masterdata trägt Default-Code (B2B typ. 221)' },
      { feld: 'APM Routing Object', experte: 'Routing Object für Country = RS MUSS zum lokalen Ausführungspfad gehen, NICHT zum IHB-Pfad', einsteiger: 'Im Payment-Factory wird RS explizit am IHB vorbei geroutet', praxis: 'Solution-Doku mit expliziter Entscheidung; APM-seitig Ausschlussregel' },
      { feld: 'DMEEX Format Tree', experte: 'DMEEX_DEF-Erweiterung für RS-pain.001.001.09: <Purp><Prtry> mit NBS-Code, <RmtInf><Strd> mit poziv na broj (Model 97)', einsteiger: 'Spezielle Ausgabeformat-Regeln für serbische Zahlungen', praxis: 'Bilateral mit jeder Hausbank bestätigen lassen' },
      { feld: 'camt.053 Import', experte: 'Custom-Regeln in FEB_FILE_HANDLING zur NBS-Code-Extraktion aus eingehenden Statements', einsteiger: 'Import-Logik erkennt NBS-Codes im Kontoauszug', praxis: 'Code-basiertes GL-Mapping bei Bank-Statement-Processing' },
      { feld: 'APM Validation Rule', experte: 'Custom Outbound Check: Blockt Zahlung wenn <Purp><Prtry> leer für RS-Outgoing', einsteiger: 'Regel verhindert Zahlungen ohne NBS-Code', praxis: 'Pflicht-Check vor Freigabe, da Falschcode = Ordnungswidrigkeit' },
      { feld: 'BCM Approval Workflow', experte: 'Cut-Offs: NBS RTGS 09:00–18:00 CET; IPS 24/7 ohne Cut-Off', einsteiger: 'Freigabeprozess mit den richtigen Zeitfenstern', praxis: 'BCM Approval Pattern für RS separat' },
      { feld: 'KZ-Reporting-Interface', experte: 'Custom Report / externes Tool — extrahiert IC-Kredit-Transaktionen für Bank-Einreichung KZ-3B', einsteiger: 'Export-Report für die KZ-Meldungen', praxis: 'Nach jeder IC-Auszahlung/Tilgung Bestätigung der Bank-Einreichung einholen' },
    ],
  },
  {
    blockNo: 5,
    blockTitle: 'Lokale Zahlungsformate & Instrumente',
    rows: [
      { feld: 'NBS-Zahlungscode (sifra placanja)', experte: '3-stellig numerisch. 1. Ziffer = Form (1=Cash, 2=Unbar, 3=Settlement, 9=Umbuchung). 2.+3. = Basis (~50 Codes). Ablage: <CdtTrfTxInf><Purp><Prtry> — NICHT <Cd>.', einsteiger: 'Dreistelliger Code auf jeder Zahlung — sagt was wirtschaftlich gemacht wird', praxis: 'Resident haftet, nicht die Bank. F110 bzw. Upstream-System muss Code mitliefern.' },
      { feld: 'Code 221 (Waren/DL Endverbrauch)', experte: 'Standard-B2B-Lieferantenzahlung unbar, inkl. Kommissionen/Gebühren', einsteiger: 'Der Default-Code für normale Rechnungen', praxis: 'Vendor-Masterdata-Default' },
      { feld: 'Code 240 (Gehalt unbar)', experte: 'KRITISCH: Falscher Code = Bank registriert Zahlung NICHT als Gehalt — Auswirkung auf Mitarbeiter-Kreditanträge & Steuer-Reporting', einsteiger: 'Gehalt braucht zwingend 240, sonst Probleme für die Mitarbeiter', praxis: 'Payroll-Integration streng prüfen' },
      { feld: 'Code 253 (Laufende öffentliche Einnahmen)', experte: 'Workhorse-Code für Steuern: Grundsteuer, Quellensteuer, Gebühren + strukturierter „poziv na broj" in <RmtInf><Strd>', einsteiger: 'Standardcode für Steuerzahlungen', praxis: 'Model-97-Referenznummer (BPO) im strukturierten RmtInf zwingend' },
      { feld: 'Code 270 / 271 (Kreditauszahlung)', experte: 'Kurz-/Langfristige Kreditauszahlung — auch für IC-Kredite. Triggert KZ-3B-Meldung.', einsteiger: 'Kredit-Auszahlungscode — auch gruppenintern', praxis: 'Nach Buchung KZ-3B-Einreichung durch Bank bestätigen lassen' },
      { feld: 'Code 290 (Sonstige)', experte: 'Catch-all, sparsam nutzen — NBS prüft 290-Codes systematisch', einsteiger: 'Rest-Code — NBS schaut immer drauf', praxis: 'Nur wenn wirklich nichts anderes passt; Dokumentation bereithalten' },
      { feld: '<Purp><Prtry> vs <Cd>', experte: '<Prtry> = proprietär / national (Serbien). <Cd> = ISO ExternalPurpose1Code (4-Letter, ACCT/CASH/INTC/...). RS-Code IMMER in <Prtry>.', einsteiger: '3-stellige RS-Codes passen nicht in das 4-Letter-ISO-Feld', praxis: 'Beim XML-Mapping-Review darauf achten; Bankvalidierung prüft das' },
      { feld: 'RgltryRptg für Cross-Border', experte: '<RgltryRptg><Authrty><Nm>NBS</Nm><Ctry>RS</Ctry><Dtls><Tp>SIFRA</Tp><Cd>221</Cd></RgltryRptg> — zusätzlich zu <Purp><Prtry>', einsteiger: 'Für Auslandszahlungen zusätzlicher Reporting-Block', praxis: 'NBS will das für BOP-Statistik — bilateral mit Bank bestätigen' },
      { feld: 'Poziv na broj (Model 97)', experte: 'Strukturierte Referenznummer in <RmtInf><Strd><CdtrRefInf><Ref> mit Scheme SCOR. Pflicht für Steuer, stark empfohlen für B2B.', einsteiger: 'Serbische strukturierte Rechnungsreferenz', praxis: 'Modulo-97-Prüfsumme generieren' },
      { feld: 'NBS QR-Code', experte: 'Standardisierter QR-Code kodiert Empfängerkonto, Betrag, Zahlungscode, Referenz; für IPS Scan-to-Pay', einsteiger: 'QR-Code für Instant Payments vom Handy', praxis: 'Auf B2B-Rechnungen zunehmend Standard; SAP-Rechnungsformular erweitern' },
      { feld: 'Single Register of Accounts', experte: 'Jedinstveni registar racuna — öffentliches NBS-Verzeichnis aller Firmenkonten; von Steuerbehörde/Gläubigern für Vollstreckung genutzt', einsteiger: 'NBS-Verzeichnis aller Geschäftskonten — öffentlich einsehbar', praxis: 'Vor größeren Neukunden-Onboardings prüfen' },
      { feld: 'Cross-Border-Codes (separat)', experte: 'Eigene Code-Liste „Sifarnik osnova naplate, placanja i prenosa u platnom prometu sa inostranstvom" (IMF BOP-Methodik)', einsteiger: 'Auslandszahlungen haben eigene Code-Tabelle — andere Nummern als Inland', praxis: 'Z-Tabelle splitten: domestic vs. cross-border Code-Bibliothek' },
      // ── DeepDive-Ergänzungen (aus Serbia_NBS_Payment_Codes_DeepDive.docx) ──
      { feld: 'Code-Aufbau: 1. Ziffer („oblik placanja")', experte: '1 = Cash (gotovinski), 2 = Unbar / book transfer (bezgotovinski), 3 = Settlement (obracunski), 9 = Umbuchung / Erstattung (preknjizavanje)', einsteiger: 'Die erste Ziffer sagt, welche Form die Zahlung hat (bar, unbar, Verrechnung, Korrektur)', praxis: 'Im SAP die Form aus dem Zahlweg ableiten — F110 Zahlweg → passende 1. Ziffer' },
      { feld: 'Code-Aufbau: Ziffern 2+3 („osnov placanja")', experte: 'Zweistelliger Code für die wirtschaftliche Natur der Transaktion (~50 Codes gesamt). Beispiele: 21 = Waren/DL Endverbrauch, 40 = Gehalt, 53 = öffentliche Einnahmen, 70 = Kurzfrist-Kredit', einsteiger: 'Die 2. und 3. Ziffer beschreiben, WAS wirtschaftlich passiert', praxis: 'Vendor-Masterdata: Default-osnov je Lieferantenkategorie pflegen' },
      { feld: 'Beispiel: Form-Varianten desselben „osnov"', experte: 'Basis 40 (Gehälter): 240 = unbares Gehalt, 140 = Barauszahlung Gehalt, 340 = Verrechnungs-Gehaltstransaktion. Gleicher wirtschaftlicher Inhalt, andere Zahlungsform.', einsteiger: 'Derselbe Zweck kann bar (140), unbar (240) oder als Verrechnung (340) gebucht werden', praxis: 'Beim Code-Mapping auf ALLE drei Formen testen' },
      { feld: '<Purp><Prtry> — primäre Ablage', experte: 'Ist ISO-20022-Standardfeld für Payment Purpose. Serbische 3-stellige Codes sind NICHT Teil der ISO ExternalPurpose1Code-Liste (ACCT/CASH/INTC/SALA/SUPP...), daher Proprietary-Feld.', einsteiger: 'Der NBS-Code ist kein internationaler Code — daher landet er im „proprietären" Feld', praxis: 'DMEEX-Formatbaum: <Purp><Prtry> aus SAP-Feld TRFR_SIFRA oder Äquivalent' },
      { feld: '<Purp><Cd> darf NICHT genutzt werden', experte: '<Cd> verlangt 4-Buchstaben-ISO-Code. Ein 3-stelliger RS-Code (221) fällt durch die Bankvalidierung — Payment-Reject.', einsteiger: 'Nicht das falsche XML-Feld nehmen, sonst wirft die Bank die Zahlung raus', praxis: 'Im DMEEX nur <Prtry> konfigurieren; Testcase mit <Cd> zur Gegenprobe' },
      { feld: '<RgltryRptg> — zusätzliche/alternative Ablage', experte: 'Für Cross-Border/FX-Payments: <RgltryRptg><Authrty><Nm>NBS</Nm><Ctry>RS</Ctry><Dtls><Tp>SIFRA</Tp><Cd>221</Cd>. Empfohlen von SWIFT PMPG für national verordnete Codes.', einsteiger: 'Bei Auslandszahlungen landet der Code ZUSÄTZLICH in einem zweiten XML-Block für Aufsichtsmeldungen', praxis: 'Für BOP-Statistik der NBS — bilateral mit Bank abstimmen' },
      { feld: 'Bank-by-Bank: wo der Code hingehört', experte: 'Domestic RSD RTGS/Clearing: <Purp><Prtry>. Cross-Border/FX: <Purp><Prtry> + <RgltryRptg>. IPS: <Purp><Prtry> (aus QR-Code). Tax 5xx: <Purp><Prtry> + strukt. RmtInf + poziv na broj. Salary 240: <Purp><Prtry> (kritisch!).', einsteiger: 'Je nach Zahlungsart kann die Bank unterschiedliche XML-Felder erwarten', praxis: 'Pro Hausbank (Banca Intesa, UniCredit Srbija, Raiffeisen, Erste, OTP, ProCredit) Onboarding-Check durchführen' },
      { feld: 'pain.001 Beispiel — Domestic (Code 221)', experte: 'Norival d.o.o. → Balkan Trade d.o.o., RSD 250.000, Banca Intesa (DBDBRSBG, Bankcode 160) → Raiffeisen (RZBSRSBG, 265). <Purp><Prtry>221</Prtry></Purp> + <RmtInf><Strd><CdtrRefInf><Tp><CdOrPrtry><Cd>SCOR</Cd></CdOrPrtry></Tp><Ref>97 13 2026 00478</Ref></CdtrRefInf></Strd><Ustrd>Plaćanje fakture INV-2026-00478</Ustrd></RmtInf>. ReqdExctnDt + <Ctry>RS</Ctry> Pflicht. SvcLvl=NURG für Clearing.', einsteiger: 'Kompletter XML-Aufbau einer Inlandszahlung siehe Dokumentation', praxis: 'XML-Musterdatei im Wiki hinterlegen, DMEEX-Konfiguration daran ausrichten' },
      { feld: 'Code-Kategorien (Schnellübersicht)', experte: '20–31 = Waren/DL/Invest. 40–49 = Gehalt/Sozialleistungen. 53–58 = Öffentliche Einnahmen (Steuer/Beiträge). 60–66 = Transfers/Versicherung. 70–90 = Finanztransaktionen (Kredite/Zinsen/Dividende). 289 = P2P. 290 = Sonstiges.', einsteiger: 'Die Codes sind nach wirtschaftlichen Kategorien gruppiert', praxis: 'Z-Tabelle mit Kategorie-Spalte anreichern — erleichtert GL-Mapping' },
      { feld: 'Cross-Border-Code-Ranges (BOP-Methodik)', experte: 'Current Account Güter: 100–199 (z. B. 112 = Güterexport, 121 = Güterimport). Services 200–299. Einkommen 300–399. Capital/Financial 400–999 (FDI, Portfolio, Kredite).', einsteiger: 'Für Auslandszahlungen folgen die Codes IMF-BOP-Logik und liegen in anderen Nummernkreisen', praxis: 'Separate Z-Tabelle ZNBS_CROSSBORDER_CODES führen' },
      { feld: 'Rechtsgrundlage Payment Codes', experte: 'Law on Payment Services (RS OG 139/2014+). NBS Decision on Form/Content/Use of Uniform Payment Instruments. Art. 30a Law on Tax Procedure für Steuer-Codes (240/253/254).', einsteiger: 'Die Code-Pflicht steht im Zahlungsdienste-Gesetz und in NBS-Verordnungen', praxis: 'Bei Audit verweisen auf Gesetzeszitat + NBS-Entscheidung' },
      { feld: 'NBS offizielle Quelle + SAP-Empfehlung', experte: 'https://www.nbs.rs/sr/drugi-nivo-navigacije/servisi/sifarnik-placanja/ — XML-Download für Domestic und Cross-Border; jährliche Updates.', einsteiger: 'Die verbindliche Liste steht bei der NBS als XML zum Download', praxis: 'Quartals-Cron-Job zieht das XML und vergleicht mit ZNBS_PAY_CODES — Diffs als Alert an Functional Lead' },
      { feld: 'Weitere Mapping-Quellen (Sekundär)', experte: 'Bank-spezifische Code-Guides: Erste Bank (erstebank.rs/Sifarnik), UniCredit Srbija, Raiffeisen, Banca Intesa. SWIFT PMPG Market Practice: Regulatory Reporting + Purpose of Payment.', einsteiger: 'Banken und SWIFT veröffentlichen eigene Leitfäden — hilfreich beim Onboarding', praxis: 'Bei Unsicherheit im Code-Mapping: Bank-Guide + PMPG-Paper als Referenz heranziehen' },
    ],
  },
  {
    blockNo: 6,
    blockTitle: 'Quick Reference / Checkliste Serbien-Go-Live',
    rows: [
      { feld: 'Do: NBS-Code in <Purp><Prtry>', experte: 'Auf JEDER ausgehenden RS-Zahlung', einsteiger: 'Immer Code mitgeben — Pflicht', praxis: 'APM-Validation blockt sonst' },
      { feld: 'Do: NBS Mittelkurs täglich ziehen', experte: 'Dedizierter Rate-Type ZNBS, Cronjob via kursnaListaModul', einsteiger: 'NBS-Kurs jeden Tag ins SAP', praxis: 'Differenz-Konto in FI bereitstellen' },
      { feld: 'Do: RS aus IHB-Routing ausschließen', experte: 'APM Routing Object RS → local execution', einsteiger: 'Serbien läuft nicht über die Gruppenbank', praxis: 'Solution-Doku verweist darauf' },
      { feld: 'Do: KZ-3B nach jeder IC-Transaktion verifizieren', experte: 'Bank reicht ein, aber Resident haftet', einsteiger: 'Nach jedem Konzern-Kreditvorgang Bank-Bestätigung einholen', praxis: 'Standard-Mail-Template an Hausbank' },
      { feld: 'Do: DMEEX + camt-Import je Bank separat testen', experte: 'Bankspezifische Abweichungen bei <Purp> / <RgltryRptg>', einsteiger: 'Jede Hausbank hat kleine Unterschiede — einzeln testen', praxis: 'UAT-Matrix Bank × Use Case' },
      { feld: 'Don\'t: Dachfonds-/Notional-Pool mit RS', experte: 'Cross-Guarantees von Residenten an Non-Residenten unter Art. 23 FX-Gesetz problematisch; 25-%-Limit Related Party', einsteiger: 'Serbien nicht in das internationale Notional Pooling aufnehmen', praxis: 'Explizit in Treasury-Policy ausnehmen' },
      { feld: 'Don\'t: Daily Cross-Border-Sweep', experte: 'NBS prüft jede Cross-Currency-IC-Transaktion einzeln — tägliche Sweeps nicht umsetzbar', einsteiger: 'Keine automatischen Tages-Transfers ins Ausland', praxis: 'Wöchentlich/monatlich manuell, dokumentiert' },
      { feld: 'Don\'t: POBO/COBO für RS', experte: '60-Tage-Repatriierung + FX-Kontrolle blockieren Collection on Behalf; POBO ebenso nicht empfohlen', einsteiger: 'Zahlungen im Namen Dritter für Serbien nicht aufsetzen', praxis: 'Kunden/Lieferanten zahlen/erhalten direkt auf/von RS-Konto' },
      { feld: 'Don\'t: Code 290 als Default', experte: 'Catch-all — NBS prüft 290 systematisch', einsteiger: 'Nicht den Rest-Code als Standard verwenden', praxis: 'Nur mit Dokumentation im Einzelfall' },
      { feld: 'Don\'t: Payment Code in <Purp><Cd>', experte: '<Cd> erwartet 4-Letter-ISO-Code — 3-stellige RS-Nummer fällt durch Bankvalidierung', einsteiger: 'Falsches XML-Feld = Zahlung geht nicht durch', praxis: 'Immer <Prtry>' },
      { feld: 'Watchout: 60-Tage-Repatriierung', experte: 'Exporterlöse müssen binnen 60 Tagen auf RS-Konto zurück', einsteiger: 'Verkäufe ins Ausland: Geld binnen 60 Tagen zurück nach Serbien', praxis: 'Monitoring in FI; Mahnwesen anpassen' },
      { feld: 'Watchout: Tax Clearance vor Ausgang', experte: 'Non-Residenten brauchen oft Steuerbescheinigung vor Cross-Border-Outflow', einsteiger: 'Bevor Geld ins Ausland geht: Steuerbescheinigung einholen', praxis: 'Frist in F110-Workflow einplanen' },
      { feld: 'Watchout: Related-Party-Exposure 25 %', experte: 'Bank-Kapital-Limit — relevant wenn mehrere IC-Kredite bei derselben Bank laufen', einsteiger: 'Hausbank darf nicht zu viel Risiko auf Konzernverbund haben', praxis: 'IC-Kreditvolumen vs. Bankkapital monitoren' },
      { feld: 'Quellen', experte: 'NBS: nbs.rs/sr/drugi-nivo-navigacije/servisi/sifarnik-placanja/, ISO 20022 WP (2024), Karanovic & Partners KZ Guide, SWIFT PMPG', einsteiger: 'Alle wichtigen Links im Hauptdokument', praxis: 'In Wiki pinnen, jährlich reviewen' },
    ],
  },
];

async function main() {
  console.log('=== Serbia seed ===');

  // 1. Upsert document
  const mdContent = fs.readFileSync(MD_PATH, 'utf-8');
  const contentHash = createHash('sha256').update(mdContent).digest('hex');
  const slug = 'serbien';
  const title = 'Länderprofil Serbien';

  const existingDoc = await db.select().from(documents).where(eq(documents.slug, slug)).limit(1);
  let documentId: string;
  if (existingDoc.length > 0) {
    documentId = existingDoc[0].id;
    await db
      .update(documents)
      .set({
        title,
        section: 'laender',
        source_file: 'content/laender/serbien.md',
        content_md: mdContent,
        content_hash: contentHash,
        updated_at: new Date(),
      })
      .where(eq(documents.id, documentId));
    console.log(`Updated document ${slug} (${documentId})`);
  } else {
    const inserted = await db
      .insert(documents)
      .values({
        slug,
        title,
        section: 'laender',
        source_file: 'content/laender/serbien.md',
        content_md: mdContent,
        content_hash: contentHash,
      })
      .returning({ id: documents.id });
    documentId = inserted[0].id;
    console.log(`Inserted document ${slug} (${documentId})`);
  }

  // 2. Upsert country
  await db
    .insert(countries)
    .values({ ...SERBIA, document_id: documentId })
    .onConflictDoUpdate({
      target: countries.code,
      set: { ...SERBIA, document_id: documentId },
    });
  console.log('Upserted country RS');

  // 3. Replace country_blocks for RS
  await db.delete(countryBlocks).where(eq(countryBlocks.country_code, 'RS'));
  for (const block of BLOCKS) {
    for (let i = 0; i < block.rows.length; i++) {
      const r = block.rows[i];
      await db.insert(countryBlocks).values({
        country_code: 'RS',
        block_no: block.blockNo,
        block_title: block.blockTitle,
        row_order: i + 1,
        feld: r.feld,
        experte: r.experte,
        einsteiger: r.einsteiger,
        praxis: r.praxis,
      });
    }
  }
  const count = await db.execute(sql`SELECT COUNT(*) AS c FROM country_blocks WHERE country_code='RS'`);
  console.log(`Inserted country_blocks for RS: ${(count.rows as any)[0].c}`);

  // 4. Upsert IHB entry for synthetic IHB / POBO / COBO tab
  const IHB = {
    land: 'Serbien',
    iso_waehrung: 'RSD',
    region: 'South-East Europe',
    ihb_bewertung: 'Nicht geeignet — Serbien kann nicht als Teilnehmer in einem Standard-IHB-Setup agieren. Lokales Ausführungsmodell mit eigenen Bankkonten und KZ-gemeldeten IC-Krediten ist der empfohlene Weg.',
    pobo_status: 'Nein — nicht empfohlen wegen FX-Kontrolle und 60-Tage-Repatriierungsfrist für Exporterlöse.',
    cobo_status: 'Nein — durch 60-Tage-Repatriierung blockiert; Exporterlöse müssen direkt auf das serbische Konto eingehen.',
    netting_erlaubt: 'Nein — Cross-Currency-IC-Transaktionen werden individuell von der NBS geprüft; automatisches Netting nicht praktikabel.',
    lokales_konto: 'Ja — Pflicht. Serbische Gesellschaft benötigt eigene RSD-, EUR- und ggf. USD-Konten bei einer lokalen Hausbank.',
    einschraenkungen_experte: 'FX-Kontrolle nach Zakon o deviznom poslovanju. Related-Party-Exposure auf 25 % Bankkapital begrenzt (Law on Banks). Cross-Guarantees von Residenten an Non-Residenten unter Art. 23 FX-Gesetz restriktiv. NBS „protected funds"-Regel im Cash Pooling. Jeder IC-Kredit KZ-meldepflichtig (KZ-1 binnen 10 Tagen, KZ-3B pro Auszahlung/Tilgung).',
    einschraenkungen_einsteiger: 'Serbien hat strenge Devisenkontrolle. Konzerninterne Zahlungen und Kredite müssen einzeln bei der Notenbank gemeldet werden. Automatische tägliche Sweeps funktionieren nicht. Exporterlöse müssen binnen 60 Tagen zurück nach Serbien.',
    rechtsgrundlage: 'Zakon o deviznom poslovanju (FX-Gesetz, RS OG 62/2006 + Änderungen 2025), Zakon o bankama (Bankengesetz, RS OG 107/2005 + 19/2025), NBS-Entscheidung zur Meldung ausländischer Kreditgeschäfte (KZ-Formulare), NBS-Guidelines zum Cash Pooling.',
    ihb_design_experte: 'Lokales Execution-Modell: RS-CC mit eigenen RSD-/EUR-/USD-Hausbank-Konten, APM Routing Object für Country=RS zwingend auf lokalen Pfad (NICHT IHB). PINO Forwarding/Routing möglich: Header initiiert über APM, Ausführung aus dem RS-Konto. IC-Finanzierung ausschließlich über dokumentierte, KZ-gemeldete IC-Kredite (Codes 270/271 Auszahlung, 276/277 Tilgung, 272/279 Zinsen, 281/282 Gesellschafterdarlehen).',
    ihb_design_einsteiger: 'Die serbische Gesellschaft behält eigene Bankkonten. Der IHB sieht das nur als „Ausland". Zahlungen löst das System zentral aus, aber sie laufen über das lokale Konto. Konzernkredite werden dokumentiert und bei der Notenbank gemeldet.',
    sap_config_experte: 'APM Routing Object: Country RS → local execution, IHB-Ausschluss. OB22 RSD lokal + EUR/USD parallel. OB07 dedizierter Rate-Type ZNBS für NBS-Mittelkurs, tägliches Upload-Interface via kursnaListaModul. DMEEX_DEF Formatbaum pain.001 mit <Purp><Prtry> + Model-97-RmtInf. Custom APM-Validation blockt Outgoing ohne NBS-Code. KZ-3B-Reporting-Interface für IC-Kreditvorgänge.',
    sap_config_einsteiger: 'Eigener Länderpfad im SAP: Routing ignoriert den IHB, tägliche NBS-Kurse werden automatisch geladen, und jede serbische Zahlung braucht den 3-stelligen NBS-Code, sonst blockt das System.',
    handlungsempfehlung: 'Serbien explizit aus IHB-Rollout ausschließen. Stattdessen: lokale Hausbank mit aktiver FX-Abteilung auswählen, RS-CC mit RSD + Parallelwährungen aufsetzen, NBS-Code-Tabelle in SAP pflegen (quartalsweise NBS-XML-Update), KZ-Reporting-Prozess mit Hausbank etablieren. Wöchentliche/monatliche manuelle Cash-Transfers zum regionalen Treasury-Hub planen — keine täglichen Sweeps.',
    source_row: null as number | null,
  };

  const existingIhb = await db.select().from(ihbEntries).where(eq(ihbEntries.land, 'Serbien')).limit(1);
  if (existingIhb.length > 0) {
    await db.update(ihbEntries).set(IHB).where(eq(ihbEntries.land, 'Serbien'));
    console.log('Updated ihb_entries for Serbien');
  } else {
    await db.insert(ihbEntries).values(IHB);
    console.log('Inserted ihb_entries for Serbien');
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
