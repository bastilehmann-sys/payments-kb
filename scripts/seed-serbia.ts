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
      {
        feld: 'NBS-Zahlungscode (sifra placanja) — Überblick',
        experte: 'Jede Inlandszahlung trägt einen 3-stelligen NBS-Code. ~50 aktive Codes. Vollständige Liste siehe Tabelle am Ende der Seite. Resident haftet für falsche Codes, nicht die Bank — Ordnungswidrigkeitsrisiko bei Fehlgebrauch.',
        einsteiger: 'Serbien verlangt auf jeder Zahlung einen 3-stelligen Code, der beschreibt, was wirtschaftlich passiert. Falscher Code = Problem beim Absender, nicht bei der Bank.',
        praxis: 'F110/Upstream-System muss den Code liefern; APM-Validation blockt RS-Outgoing ohne Code. Quartals-Cron-Job gegen NBS-XML-Feed zur Aktualisierung.',
      },
      {
        feld: 'Code-Aufbau (3 Ziffern)',
        experte: '1. Ziffer = Form („oblik placanja"): 1 Cash · 2 Unbar · 3 Settlement · 9 Umbuchung / Erstattung.\n2.+3. Ziffer = Basis („osnov placanja"): ~50 Codes, wirtschaftliche Natur der Transaktion (21=Waren/DL Endverbrauch, 40=Gehalt, 53=öffentl. Einnahmen, 70=Kurzfrist-Kredit).\nFormen-Beispiel Basis 40: 240=unbares Gehalt · 140=Barauszahlung Gehalt · 340=Settlement-Gehaltstransaktion.',
        einsteiger: 'Erste Ziffer = wie bezahlt wird (bar / unbar / Verrechnung). Zweite und dritte Ziffer = was bezahlt wird. Derselbe Zweck kann in drei Formen erscheinen.',
        praxis: 'Im SAP 1. Ziffer aus dem F110-Zahlweg ableiten. Vendor-Masterdata: Default „osnov" (2+3) pro Lieferantenkategorie pflegen.',
      },
      {
        feld: 'Kategorien im Überblick',
        experte: '20–31 Waren/DL/Investitionen · 40–49 Gehalt/Sozialleistungen · 53–58 Öffentl. Einnahmen (Steuer/Beiträge) · 60–66 Transfers/Versicherung · 70–90 Finanztransaktionen (Kredite/Zinsen/Dividenden/Gesellschafter) · 287/288 Spenden · 289 P2P · 290 Sonstiges (sparsam).',
        einsteiger: 'Die Codes sind thematisch gruppiert — vom Einkauf über Gehalt und Steuern bis zu Finanzierung und Spenden.',
        praxis: 'Z-Tabelle ZNBS_PAY_CODES mit Kategorie-Spalte anreichern — erleichtert GL-Konten-Mapping und Reporting.',
      },
      {
        feld: 'ISO-20022-XML-Mapping',
        experte: 'Primär: <CdtTrfTxInf><Purp><Prtry>221</Prtry></Purp> — Serbische Codes sind KEINE ISO-ExternalPurpose1Code-Einträge (ACCT/CASH/INTC/SALA…), daher NICHT <Cd>.\n<Purp><Cd> mit 3-stelligem Code = Bankvalidierungsfehler, Zahlungsreject.\nZusätzlich für Cross-Border / FX: <RgltryRptg><Authrty><Nm>NBS</Nm><Ctry>RS</Ctry><Dtls><Tp>SIFRA</Tp><Cd>221</Cd></Dtls></RgltryRptg> — SWIFT-PMPG-Pattern für national verordnete Codes.\nBank-Verhalten variiert: Domestic RTGS/Clearing → <Prtry>. Cross-Border/FX → <Prtry>+<RgltryRptg>. IPS → <Prtry> aus QR. Tax → <Prtry>+strukt. RmtInf. Salary 240 → <Prtry> (kritisch!).',
        einsteiger: 'Der Code landet immer im XML-Feld <Purp><Prtry> — NICHT in <Purp><Cd>, denn dort erwartet die Bank einen internationalen 4-Buchstaben-Code. Bei Auslandszahlungen kommt ein zweiter Reporting-Block dazu.',
        praxis: 'DMEEX-Formatbaum: <Purp><Prtry> aus SAP-Feld TRFR_SIFRA (o.ä.). Onboarding pro Hausbank (Banca Intesa, UniCredit Srbija, Raiffeisen, Erste, OTP, ProCredit) bestätigen lassen — Abweichungen in <RgltryRptg>-Pflicht kommen vor.',
      },
      {
        feld: 'Strukturierte Referenzen (poziv na broj & NBS QR-Code)',
        experte: '„Poziv na broj" Model 97 in <RmtInf><Strd><CdtrRefInf><Ref> mit Scheme SCOR — Modulo-97-Prüfziffer. Pflicht für Steuer-/öffentliche-Einnahmen-Codes (240/253/254), stark empfohlen für B2B.\nNBS QR-Code kodiert Empfängerkonto + Betrag + Zahlungscode + Referenz — für IPS Scan-to-Pay; Code landet automatisch in <Purp><Prtry>.',
        einsteiger: 'Serbien nutzt eine strukturierte Rechnungsreferenz (Modulo-97-Prüfsumme) und einen QR-Code. Den QR scannt der Empfänger z. B. in der Banking-App, der Zahlungscode wird automatisch übernommen.',
        praxis: 'SAP-Rechnungsformular erweitern: Modulo-97-Generator für „poziv na broj", IPS-QR auf Faktura. Für Tax-Codes Pflichtvalidierung im APM-Outbound.',
      },
      {
        feld: 'Cross-Border-Codes (BOP-Methodik) — eigene Tabelle',
        experte: '„Sifarnik osnova naplate, placanja i prenosa u platnom prometu sa inostranstvom" — separate Code-Liste für Auslandszahlungen nach IMF-Balance-of-Payments-Methodik.\nRanges: 100–199 Current Account Güter (z. B. 112 Export, 121 Import) · 200–299 Services · 300–399 Einkommen · 400–999 Capital / Financial (FDI, Portfolio, Kredite).',
        einsteiger: 'Für grenzüberschreitende Zahlungen gelten ganz andere Codes als im Inland — andere Nummernkreise, andere Logik (wie beim IMF).',
        praxis: 'Zwei getrennte Z-Tabellen in SAP: ZNBS_PAY_CODES (domestic) + ZNBS_CROSSBORDER_CODES. APM Routing Object unterscheidet.',
      },
      {
        feld: 'Kontoformat & Single Register of Accounts',
        experte: 'Serbisches Kontoformat 3-13-2 (z. B. 160-0000123456789-12); IBAN RS35 + 18 Ziffern = 22 Zeichen.\n„Jedinstveni registar racuna" (NBS, öffentlich) listet alle Firmenkonten — von Steuerbehörde und Gläubigern zur Vollstreckungs-Identifikation genutzt.',
        einsteiger: 'Konten haben ein eigenes Format mit Bindestrichen, oder international als IBAN. Alle Firmenkonten stehen in einem öffentlichen Register.',
        praxis: 'SAP-Bankkontenstammdaten im IBAN-Format pflegen. Vor Neukunden-Onboarding Single Register prüfen.',
      },
      {
        feld: 'Rechtsgrundlage & offizielle Quellen',
        experte: 'Rechtsbasis: Law on Payment Services (RS OG 139/2014+), NBS Decision on Form/Content/Use of Uniform Payment Instruments, Art. 30a Law on Tax Procedure (für Steuer-Codes 240/253/254).\nOffizielle NBS-Liste (XML): nbs.rs/sr/drugi-nivo-navigacije/servisi/sifarnik-placanja/ — jährliche Updates.\nSekundär: Bank-Guides (Erste Bank erstebank.rs/Sifarnik, UniCredit Srbija, Raiffeisen, Banca Intesa); SWIFT PMPG Market Practice (Regulatory Reporting + Purpose of Payment).',
        einsteiger: 'Die Pflicht steht im Zahlungsdienste-Gesetz + NBS-Verordnungen. Die aktuelle Code-Liste als XML findet man direkt bei der NBS.',
        praxis: 'Quartals-Cron-Job zieht das XML und diff’t gegen ZNBS_PAY_CODES — neue/entfallene Codes als Alert an Functional Lead. Bei Audits immer auf Gesetzeszitat verweisen.',
      },
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
