/**
 * Seed country_blocks for China (CN).
 *
 * Mirrors the IT block structure (Regulatorik, Clearing/Banken, Formate/Instrumente,
 * SAP-Themen) and adds a dedicated block for SAFE BOP Purpose Codes.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-china-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'CN';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'CN / CHN (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 156.', einsteiger: 'Alpha-2 CN, Alpha-3 CHN.', praxis: 'SAP Bankschlüssel-Länderfeld, T005 Eintrag.' },
      { feld: 'Währung', experte: 'CNY (Renminbi, ¥) / ISO 4217: CNY. Onshore-Variante. Offshore-Variante: CNH (Hongkong-Renminbi, kein ISO-Code, aber SWIFT akzeptiert).', einsteiger: 'Renminbi (Yuan). Zwei Handelsplätze: CNY (Festland) und CNH (Offshore, v.a. HK).', praxis: 'In SAP CNY als Währung hinterlegen. CNH als eigene Währung nur bei Treasury-Hedging relevant.' },
      { feld: 'Kontoformat', experte: 'KEIN IBAN. Inlandskonten: 12–19 Ziffern (bankabhängig). Identifikation der Empfängerbank über CNAPS-Code (12-stellig), nicht über BIC.', einsteiger: 'China hat kein IBAN-System. Stattdessen Bankkontonummer + CNAPS-Code.', praxis: 'SAP: IBAN-Validierung für CN deaktivieren. Bankstamm BNKA: Kontonummer + CNAPS in Custom-Field oder BRNCH.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAACNBB[BBB]. Beispiele: ICBC Beijing ICBKCNBJ, BOC Head Office BKCHCNBJ, CCB Beijing PCBCCNBJ, ABC Beijing ABOCCNBJ.', einsteiger: 'CN im BIC = China. Für Cross-Border-Zahlungen Pflicht.', praxis: 'Inlandszahlungen nutzen CNAPS-Code. BIC nur für Cross-Border/CIPS.' },
      { feld: 'Zeitzone', experte: 'CST = China Standard Time = UTC+8. Keine Sommerzeit-Umstellung (seit 1991). Gesamtes Festland einheitlich.', einsteiger: 'UTC+8 ganzjährig. 6–7 Stunden vor Deutschland.', praxis: 'Cut-off CNAPS HVPS meist 17:00 CST ≈ 10:00 CET/11:00 CEST. SAP-Zahlläufe entsprechend terminieren.' },
      { feld: 'Zentralbank', experte: 'People\'s Bank of China (PBOC, 中国人民银行). Sitz: 32 Chengfang Street, Xicheng District, Beijing. www.pbc.gov.cn. Betreibt CNAPS + CIPS.', einsteiger: 'Chinesische Zentralbank, steuert Geldpolitik und Clearing.', praxis: 'PBOC-Rundschreiben (银发 yínfā) sind normativ für Banken. SAFE ist die Devisenabteilung.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Mandarin (简体中文). Encoding: GB18030 (Legacy) / UTF-8 (modern). CIPS + ISO 20022 nutzen UTF-8. Chinesische Zeichen in Namen → SWIFT MT unterstützt nur ASCII → Transliteration (Pinyin oder EN-Name).', einsteiger: 'Chinesische Schrift, zwei Zeichensätze im Einsatz.', praxis: 'SAP Codepage 8400 (GB18030) oder 4110 (UTF-8). In Stammdaten EN-Namen + USCI führen, CN-Namen als Zusatzfeld.' },
      { feld: 'Nationale Feiertage', experte: '11 gesetzliche Feiertage, aber wegen Anhäufungs-Regel (调休) entstehen längere Blocks: Neujahr (1 Tag), Spring Festival/Chunjie (7–8 Tage), Qingming (3 Tage), Labor Day (5 Tage), Dragon Boat (3 Tage), Mid-Autumn (3 Tage), National Day (7 Tage). Kalender wird jährlich im Dezember vom Staatsrat veröffentlicht.', einsteiger: 'Zu Spring Festival + National Day je ~1 Woche praktisch Stillstand.', praxis: 'SAP SCAL Fabrikkalender CN jährlich im Dezember aktualisieren. Payment Runs 10 Tage vor Spring Festival abschließen.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. USD 18 Bio (2. größte Wirtschaft weltweit). Hauptindustrien: Elektronik, Maschinenbau, Automotive (BYD, SAIC), Chemie, Solar. Handelspartner: US, EU, DE, JP, KR, ASEAN. Starke Rolle des Staates (SOEs).', einsteiger: 'Riesige Wirtschaft, staatsnah geprägt, FX-kontrolliert.', praxis: 'Zahlungsziele B2B: 30–60 Tage typisch. Mahnwesen im Ausland schwer durchsetzbar → Vorkasse/LC üblich bei Erstgeschäft.' },
    ],
  },
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'Devisenaufsicht', experte: 'SAFE (State Administration of Foreign Exchange, 国家外汇管理局) — untersteht der PBOC, steuert alle Kapitalverkehrs- und Devisenoperationen.', einsteiger: 'SAFE = Devisenkontrollbehörde. Jede Zahlung über die Grenze muss SAFE-konform laufen.', praxis: 'Banken agieren als verlängerter Arm der SAFE. Ohne BOP-Declaration keine Ausführung.' },
      { feld: 'Zentralbank', experte: 'PBOC (People\'s Bank of China). Regelt Clearing (CNAPS/CIPS), Zahlungslizenzen und Fintech-Aufsicht.', einsteiger: 'PBOC ist die chinesische Zentralbank, betreibt die Clearingsysteme.', praxis: 'PBOC-Rundschreiben (银发 [yínfā] + Nr./Jahr) sind der wichtigste regulatorische Takt.' },
      { feld: 'Devisenkontrolle', experte: 'Art. 5 FX-Regulation 1996 (rev. 2008): Grundsatz der geschlossenen Kapitalverkehrsbilanz. Capital Account nur mit Genehmigung, Current Account freier (aber dokumentationspflichtig).', einsteiger: 'China hat harte Kapitalverkehrskontrollen. Geld kann nicht frei rein oder raus.', praxis: 'Für jede Auslandszahlung: Vertrag + Rechnung (Fapiao) + Steuerabzugsbeleg bei der Bank vorlegen.' },
      { feld: 'AML / KYC', experte: 'AML Law 2007 (rev. 2024), PBOC Order No. 3 [2018] zu Customer Due Diligence. STR/CTR Meldungen an CAMLMAC.', einsteiger: 'Geldwäschegesetz + strenge Kundenprüfung durch die Bank.', praxis: 'UBO-Struktur muss voll offengelegt sein; Fonds aus FATF-Greylist-Ländern werden oft abgelehnt.' },
      { feld: 'Sanktionen', experte: 'MOFCOM Unreliable Entity List + Anti-Foreign-Sanctions Law (2021). Keine OFAC-Anerkennung, aber Banken screenen dual (OFAC + EU + UN) wegen USD-Clearing.', einsteiger: 'Eigene Sanktionsliste + westliche Listen gelten parallel.', praxis: 'USD-Zahlungen laufen über US-Korrespondenzbanken → OFAC-Risiko trotz CN-Gegenpartei.' },
      { feld: 'Steuer-Withholding', experte: 'EIT Law Art. 3: 10% WHT auf Dividenden/Zinsen/Lizenzen an Nicht-Residenten (DBA-reduziert). 6% VAT auf Service-Importe (reverse charge).', einsteiger: 'Bei Auslandsüberweisungen werden Steuern einbehalten.', praxis: 'Tax Clearance Certificate (税务备案) ab USD 50k Pflicht — Bank weigert sich sonst.' },
      { feld: 'Datenlokalisierung', experte: 'PIPL (2021), Data Security Law (2021), CSL (2017). Personenbezogene Zahlungsdaten müssen in CN gehostet werden; Cross-Border-Transfer nur mit CAC-Security-Assessment oder SCC.', einsteiger: 'Kundendaten dürfen China nicht verlassen, außer mit Genehmigung.', praxis: 'SAP-System mit CN-Zahlungen: entweder lokale S/4HANA-Instanz oder CAC-genehmigter Datenexport.' },
    ],
  },
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'CNAPS', experte: 'China National Advanced Payment System — HVPS (RTGS) + BEPS (Bulk). PBOC-betrieben. CNAPS-Code (12-stellig) identifiziert die Empfängerbank (statt BIC).', einsteiger: 'Inländisches CNY-Clearingsystem. Alle Inlandszahlungen laufen darüber.', praxis: 'CNAPS-Code in SAP-Hausbank pflegen (Feld BNKA-BRNCH oder Custom-Field). Ohne CNAPS keine CNY-Inlandszahlung.' },
      { feld: 'CIPS', experte: 'Cross-Border Interbank Payment System (seit 2015). SWIFT-kompatibel, ISO 20022 nativ. Phase 2: 24/5 Betrieb. >1.400 direkte+indirekte Teilnehmer.', einsteiger: 'Internationales CNY-Clearing — die chinesische Alternative zu SWIFT für Renminbi.', praxis: 'CIPS Direct Participant nutzen für beste Routing-Kontrolle. pain.001 mit CIPS-BIC in CdtrAgt.' },
      { feld: 'IBPS', experte: 'Internet Banking Payment System — Instant Payments 24/7 für Retail (< CNY 50k in Echtzeit).', einsteiger: 'Chinas Instant-Payment-Rail für kleine Beträge.', praxis: 'Für B2B-Zahlungen meist irrelevant — dort dominiert CNAPS HVPS.' },
      { feld: 'Top Banken', experte: 'ICBC, CCB, ABC, BOC (Big Four) — jeweils eigene SAP-Host-to-Host-Lösungen, meist proprietäres Format + optional pain.001.', einsteiger: 'Die vier großen Staatsbanken dominieren Corporate Payments.', praxis: 'BOC + ICBC haben die beste englische Doku und stabilste H2H-Kanäle für westliche MNCs.' },
      { feld: 'Lokales Konto', experte: 'Pflicht: jede Legal Entity benötigt mindestens ein Basic Account (基本户) + ggf. General Account + FX Account. SAFE-registriert.', einsteiger: 'Ohne lokales Firmenkonto geht nichts — POBO aus dem Ausland ist verboten.', praxis: 'Kontoeröffnung dauert 4–8 Wochen (Business License, Chop, Legal Rep persönlich anwesend).' },
      { feld: 'Zahlungsverkehr Feiertage', experte: 'Spring Festival (7 Tage), National Day (7 Tage), Labor Day, Qingming, Dragon Boat, Mid-Autumn. PBOC publiziert Cut-off-Kalender jährlich im Dezember.', einsteiger: 'Zu Chinese New Year steht der Zahlungsverkehr fast 2 Wochen still.', praxis: 'Payment Run 10 Tage vor Spring Festival abschließen — sonst Verzug bei Lieferanten.' },
    ],
  },
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      { feld: 'pain.001.001.03 (CIPS Cross-Border)', experte: 'Standard-XML für Cross-Border-CNY via CIPS. Pflicht: BOP-Code in RmtInf/Strd/AddtlRmtInf, USCI in Dbtr/Id/OrgId/Othr.', einsteiger: 'Internationales XML-Format für Renminbi-Auslandszahlungen.', praxis: 'Ohne BOP-Code + USCI → Bank-Rejection. ISO 20022 via CIPS ist die Zukunft.' },
      { feld: '► 6.1 — CIPS pain.001 / pacs.008 (Cross-Border CNY)' },
      { feld: 'Message-Version', experte: 'CIPS Phase 2 akzeptiert pain.001.001.03 (Customer Credit Transfer) und intern pacs.008.001.08 für FI-to-FI.', einsteiger: 'XML nach ISO 20022.', praxis: 'Direkt-Teilnehmer nutzen pacs.008; Indirect-Participants liefern pain.001 an ihre Korrespondenzbank.' },
      { feld: 'BOP-Code Träger', experte: 'Primär RmtInf/Strd/AddtlRmtInf mit Präfix "/BOP/123456/". Alternativ Purp/Prtry.', einsteiger: 'SAFE-Zahlungszweck-Code im Verwendungszweck.', praxis: 'Mit Hausbank klären, welches Feld genutzt wird. Mapping in SAP via BTE 2040 oder Custom-Feld.' },
      { feld: 'USCI', experte: '18-stelliger Unified Social Credit Identifier in Dbtr/Id/OrgId/Othr/Id mit SchmeNm/Prtry="USCI".', einsteiger: 'Chinesische Firmen-ID, Pflichtfeld.', praxis: 'Im Lieferantenstamm LFA1-STCD2 pflegen, per DMEE-Mapping ins XML bringen.' },
      { feld: 'Tax Clearance Ref', experte: 'Bei Service-/Royalty-Zahlungen ab USD 50k: Steuerfreistellungsnummer (税务备案表编号) in RmtInf.', einsteiger: 'Steuerbescheinigungs-Nr. ab 50k USD Pflicht.', praxis: 'Ohne Clearance-Nr. weigert sich die Bank, die Zahlung auszuführen.' },

      { feld: '► 6.2 — CNAPS2 HVPS / BEPS (Domestic CNY)' },
      { feld: 'Dateiformat', experte: 'Proprietär, MT-ähnlich (Textdatei mit Feld-Tags). Jede Bank hat eigenen Dialekt (ICBC ≠ BOC ≠ CCB).', einsteiger: 'Inländisches Flat-File, kein XML.', praxis: 'Bank stellt DMEE-Baum oder eigenen Konverter (H2H-Middleware).' },
      { feld: 'CNAPS-Code', experte: '12-stelliger Bankclearing-Code, ersetzt BIC im Inland. Format: 3 Ziffern Bank + 4 Ziffern Stadt + 5 Ziffern Filiale.', einsteiger: 'Inländischer Bankcode statt BIC.', praxis: 'In BNKA als Bankschlüssel pflegen oder separates Custom-Feld. PBOC publiziert aktuelle Liste.' },
      { feld: 'HVPS vs. BEPS', experte: 'HVPS = RTGS (Echtzeit, > CNY 50k typisch). BEPS = Bulk, T+0/T+1, geringe Beträge.', einsteiger: 'HVPS = große Zahlungen sofort, BEPS = Sammler für kleine.', praxis: 'In F110 über Zahlweg (Payment Method) steuern. Cut-off HVPS ~17:00 CST.' },
      { feld: 'ISO-20022-Migration', experte: 'PBOC-Fahrplan: CNAPS3 auf ISO 20022 bis 2027 angekündigt, Piloten laufen.', einsteiger: 'CNAPS wird auf XML umgestellt.', praxis: 'Projekte ab 2026 sollten DMEE-Alt + ISO-neu parallel planen.' },

      { feld: '► 6.3 — Fapiao / e-Fapiao (发票)' },
      { feld: 'Typen', experte: 'VAT Special Invoice (增值税专用发票) — vorsteuerabzugsfähig; VAT General Invoice (普通发票) — nicht abzugsfähig; Fully-Digitalized e-Fapiao (全电发票) — seit 2024 flächendeckend.', einsteiger: 'Drei Fapiao-Arten, nur Special Invoice gibt Vorsteuerabzug.', praxis: 'Seit 2024 ist das "Quan Dian" e-Fapiao Standard — keine physischen Fapiao-Blätter mehr.' },
      { feld: 'Golden Tax', experte: 'Golden Tax System Phase IV (seit 2023) — zentrale STA-Plattform, die alle Fapiaos validiert.', einsteiger: 'Zentrale Steuer-IT des Fiskus.', praxis: 'Integration via SAP Document Compliance China oder Aisino/Baiwang Middleware.' },
      { feld: 'Payment-Matching', experte: 'Jede Auslands-/Inlandszahlung muss gegen eine Fapiao gematcht werden. MIRO → PO → Fapiao-Nr.', einsteiger: 'Zahlung nur mit Fapiao-Nummer.', praxis: 'Custom-Field "Fapiao-Nr" in BSEG/REGUH, Prüfung im Payment-Proposal.' },

      { feld: '► 6.4 — camt.053 / Kontoauszug' },
      { feld: 'Bank Statement', experte: 'CIPS-Teilnehmer liefern camt.053.001.08. Inlandsbanken meist proprietäres TXT + optional camt.053.', einsteiger: 'Elektronischer Kontoauszug.', praxis: 'EBS-Mapping pro Bank — BAI2/MT940 kaum verbreitet, meist Bank-eigenes Format.' },
      { feld: 'Encoding', experte: 'UTF-8 für camt.053, GB18030 für Legacy-Formate (chinesische Zeichen in RmtInf).', einsteiger: 'Zeichensatz für chinesische Namen beachten.', praxis: 'SAP-Upload mit Codepage 8400 (GB18030) oder 4110 (UTF-8), sonst Mojibake.' },
      { feld: 'MT103 (Fremdwährung)', experte: 'Für USD/EUR Outbound via Korrespondenzbank weiterhin Standard; Feld 70 mit Purpose of Remittance in EN. Parallel zu CBPR+ MX-Migration bis Nov 2025.', einsteiger: 'SWIFT-Format für Fremdwährungen.', praxis: 'Ab 2026 Fokus auf pacs.008 CBPR+, MT103 als Fallback.' },
    ],
  },
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'Localization-Paket', experte: 'SAP China Localization (CN) — enthält CNAPS-Konfig, Golden Tax Interface (FI-GT), Withholding Tax Config, Fapiao-Druck.', einsteiger: 'SAP-Standard-Add-on für China.', praxis: 'OSS-Note 1858024 als Einstieg. Ohne CN-Localization keine compliant Zahlungen.' },
      { feld: 'Golden Tax Integration', experte: 'Schnittstelle zu Aisino/Baiwang für Fapiao-Issuing. SD-Billing → GT → e-Fapiao → FI-Posting.', einsteiger: 'Automatisierte Fapiao-Erzeugung aus SAP heraus.', praxis: 'S/4HANA Cloud mit SAP Document Compliance China oder 3rd-Party (Sovos/Baiwang) — Eigenentwicklung nicht empfohlen.' },
      { feld: 'DMEE für CNAPS', experte: 'Pro Bank eigener DMEE-Baum nötig (ICBC, BOC, CCB, ABC unterscheiden sich in Feld-Layout).', einsteiger: 'Jede Bank braucht ihr eigenes Zahlungsfile-Format.', praxis: 'Bank stellt meist DMEE-Template zur Verfügung oder bietet eigenen Bank-Connector (H2H).' },
      { feld: 'IHB / POBO / COBO', experte: 'IHB für CN nur als Reporting-Layer — kein physischer Cashpool mit Ausland. POBO/COBO Cross-Border verboten (SAFE). On-Shore Cash Pool (人民币资金池) mit PBOC-Genehmigung möglich.', einsteiger: 'IHB darf CN-Cash nicht ins Ausland pushen. Nur Info-Pooling.', praxis: 'Für CN entweder lokaler Entrusted Loan Pool (domestic) oder Cross-Border Two-Way Sweep (nur mit SAFE-Quota).' },
      { feld: 'Regulatory Reporting', experte: 'BOP-Declaration (国际收支申报) bei jeder Cross-Border-Zahlung > USD-Äquivalent 50k (Waren) bzw. je nach Art. Meldung über IBAS-System der SAFE via Hausbank.', einsteiger: 'Jede Auslandszahlung wird an SAFE gemeldet.', praxis: 'SAP kann BOP-Code vorbelegen; finale Deklaration erfolgt meist manuell im Bank-Portal.' },
    ],
  },
  {
    no: 6,
    title: 'Purpose Codes (BOP-Codes)',
    rows: [
      { feld: 'Was ist ein BOP-Code?', experte: 'SAFE Balance-of-Payments Declaration Code nach "Guidelines for Declaration of Balance of Payments Statistics through Financial Institutions" (国际收支统计申报办法). 6-stellig, zwingend bei jeder Cross-Border-Zahlung.', einsteiger: 'Ein 6-stelliger Code, der sagt, wofür das Geld ist (Ware, Dienstleistung, Dividende etc.).', praxis: 'Ohne korrekten BOP-Code lehnt die Bank die Zahlung ab oder hält sie für Rückfragen fest.' },
      { feld: 'Struktur', experte: 'Ziffer 1 = Kategorie (1=Goods, 2=Services, 3=Primary Income, 4=Secondary Income/Transfers, 5=Capital, 6=Financial). Ziffer 2–6 = Detailart.', einsteiger: 'Erste Ziffer = Oberkategorie, Rest = Detail.', praxis: 'Stammdaten: Purpose-Code-Katalog als Custom-Tabelle pflegen, mapping Material-/Leistungsart → BOP.' },
      { feld: '121000 — General Merchandise', experte: 'Allgemeiner Warenhandel (Export/Import von Fertigwaren).', einsteiger: 'Ware verkaufen/kaufen.', praxis: 'Häufigster Code für Trading-Geschäfte. Belegt Fapiao + Zollerklärung notwendig.' },
      { feld: '122010 — Processing Services on Goods', experte: 'Lohnveredelung, Contract Manufacturing.', einsteiger: 'Zulieferung / Auftragsfertigung.', praxis: 'Typisch für OEM-Szenarien (Apple / Foxconn Muster).' },
      { feld: '223010 — Freight Transport', experte: 'Transport/Fracht als Dienstleistung.', einsteiger: 'Logistikkosten über die Grenze.', praxis: 'Getrennt vom Warenwert als eigene Zahlung deklarieren, wenn separat fakturiert.' },
      { feld: '224010 — Travel', experte: 'Reise, Hotel, Geschäftsreisekosten.', einsteiger: 'Business Travel.', praxis: 'Bei IC-Rechnungen (Reisekosten-Weiterbelastung) wichtig.' },
      { feld: '228010 — Royalties & License Fees', experte: 'Lizenzgebühren, Patente, Markenrechte, Software-Royalties.', einsteiger: 'Lizenz- und Nutzungsgebühren.', praxis: '10% WHT + 6% VAT (reverse charge) typisch. Tax Clearance Pflicht.' },
      { feld: '229010 — Other Business Services', experte: 'Consulting, Management Fees, technische Services.', einsteiger: 'Beratungs- und Dienstleistungshonorare.', praxis: 'Transfer-Pricing-Doku Pflicht. Reasonableness-Test der Bank. Oft Prüfung Cost-Plus-Marge.' },
      { feld: '311000 — Dividends', experte: 'Gewinnausschüttung an ausländische Shareholder.', einsteiger: 'Dividende ins Ausland.', praxis: '10% WHT (Treaty-reduziert z.B. auf 5%). Audit Report + AGM Resolution + Tax Filing nötig.' },
      { feld: '312000 — Interest', experte: 'Zinsen auf IC-Darlehen oder externe Kredite.', einsteiger: 'Zinszahlung an Ausland.', praxis: 'FX-Konto + SAFE-Darlehensregistrierung Voraussetzung.' },
      { feld: '431000 — Foreign Direct Investment', experte: 'Direktinvestitionen, Kapitaleinlagen, FDI-Registrierung bei MOFCOM + SAFE.', einsteiger: 'Kapital rein/raus als Investition.', praxis: 'ODI (Outbound) braucht NDRC- + MOFCOM-Approval. Einer der härtesten Genehmigungsprozesse.' },
      { feld: 'Trägerfeld im pain.001', experte: 'Primär RmtInf/Strd/AddtlRmtInf (Präfix "/BOP/"), alternativ Purp/Prtry. Jede Bank hat ihre bevorzugte Variante — mit Hausbank abstimmen.', einsteiger: 'Der Code wird im XML im Verwendungszweck übergeben.', praxis: 'SAP: FBPM1/F110 Feld "Verwendungszweck" erweitern oder BTE 2040 nutzen, um BOP pro Zahlung zu setzen.' },
      { feld: 'Offizielle Quelle (SAFE)', experte: 'Huifa [2014] Nr. 19 — "涉外收支交易分类与代码（2014版）" (Anhang: 交易代码表). Normative Fassung: http://m.safe.gov.cn/big5/big5/www.safe.gov.cn/safe/2014/0417/21865.html — Excel-Codetabelle: http://m.safe.gov.cn/safe/file/file/20170726/5b8b93a4c91d4b0985679c9da8d293b3.xls — Rubrik "国际收支统计": http://m.safe.gov.cn/safe/gjsztj/index.html', einsteiger: 'Offizieller Codekatalog der SAFE (Huifa 2014 Nr. 19) mit Excel-Download.', praxis: 'Excel-Datei als Basis für Custom-Mapping-Tabelle in SAP nutzen. Jährlich auf SAFE-Updates prüfen; Bank-Hausmapping zusätzlich abgleichen.' },
    ],
  },
];

async function main() {
  console.log('=== Seed China Blocks ===');
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
        experte: row.experte ?? null,
        einsteiger: row.einsteiger ?? null,
        praxis: row.praxis ?? null,
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
