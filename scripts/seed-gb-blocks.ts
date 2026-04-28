/**
 * Seed country_blocks for Great Britain (GB).
 *
 * Quellen: content/expansion/laender/gb.md, uk-psr.md, DB migration 0012
 * Block-Struktur aligned with IT/CN/DE/US/CH template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-gb-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'GB';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'GB / GBR (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 826. ACHTUNG: "UK" ist KEIN ISO-Code — immer GB verwenden.', einsteiger: 'Alpha-2 GB (nicht UK!), Alpha-3 GBR.', praxis: 'SAP T005: GB. Häufiger Fehler: "UK" als Ländercode gepflegt.' },
      { feld: 'Währung', experte: 'GBP (Pfund Sterling, £) / ISO 4217: GBP. KEIN EUR seit Brexit (01.01.2021). GBP-Konto bei UK-Bank nötig. GBP ist frei konvertierbar, hohe Liquidität.', einsteiger: 'Britisches Pfund. Kein Euro — GB ist seit Brexit komplett raus aus SEPA.', praxis: 'Hauswährung Buchungskreis GB: GBP. GBP/EUR-Wechselkurs-Feed zwingend. Keine SEPA-Zahlungen mehr nach GB!' },
      { feld: 'IBAN-Format', experte: 'GB + 2 Prüfziffern + 4 Bank-Code + 6 Sort Code + 8 Account Number = 22 Stellen. Beispiel: GB29 NWBK 6016 1331 9268 19. ABER: Im UK-Inland wird IBAN kaum genutzt — Sort Code + Account Number ist der Standard.', einsteiger: '22 Zeichen IBAN existiert, wird aber in GB selbst kaum verwendet. Sort Code + Kontonr. ist der Alltag.', praxis: 'SAP: IBAN + Sort Code + Account Number ALLE pflegen. IBAN für SWIFT Cross-Border, Sort Code für UK-Inlandssysteme.' },
      { feld: 'Sort Code', experte: '6-stellig numerisch, Format XX-XX-XX (z.B. 60-16-13). Zentrales Routing-Attribut im UK-Zahlungsverkehr (Bacs, FPS, CHAPS). Äquivalent zur deutschen BLZ. Sort Code Directory (EISCD) von Pay.UK gepflegt.', einsteiger: 'Sort Code = britische Bankleitzahl. 6 Ziffern, oft mit Bindestrichen.', praxis: 'Sort Code in SAP Bankstamm (BNKA-BANKL). Account Number in LFBK-BANKN. EISCD-Lookup: sorting-codes.co.uk.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAAGB2LXXX. Beispiele: Barclays BARCGB22, HSBC MIDLGB22, Lloyds LOYDGB2L, NatWest NWBKGB2L, Standard Chartered SCBLGB2L.', einsteiger: 'GB2L im BIC = Großbritannien London.', praxis: 'BIC Pflicht für SWIFT-Zahlungen nach GB. Für UK-Inland (Bacs/FPS) reicht Sort Code.' },
      { feld: 'Zeitzone', experte: 'GMT (UTC+0) im Winter / BST (UTC+1) im Sommer. 1 Stunde hinter CET/CEST.', einsteiger: 'London-Zeit — 1 Stunde hinter Deutschland.', praxis: 'CHAPS Cut-off 15:00 GMT = 16:00 CET. Zeitdifferenz in F110-Planung beachten.' },
      { feld: 'Zentralbank', experte: 'Bank of England (BoE). Threadneedle Street, London EC2R 8AH. bankofengland.co.uk. Betreibt CHAPS (RTGS). Geldpolitik unabhängig (Inflation Targeting).', einsteiger: 'Bank of England = britische Zentralbank, betreibt CHAPS.', praxis: 'BoE-Zinsentscheidungen beeinflussen GBP-Kurs. FX-Hedging für GBP-Exposure empfohlen.' },
      { feld: 'Aufsicht', experte: 'Dual-Regulierung: FCA (Financial Conduct Authority) — Marktaufsicht, Verbraucherschutz, AML. PRA (Prudential Regulation Authority, Teil der BoE) — Bankenaufsicht, Stabilität. PSR (Payment Systems Regulator) — reguliert Zahlungssysteme direkt.', einsteiger: 'Drei Aufsichtsbehörden: FCA (Markt), PRA (Banken), PSR (Zahlungssysteme).', praxis: 'FCA-Sanktionen sind unbegrenzt. PSR reguliert Bacs, FPS, CHAPS direkt.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Englisch. ASCII/UTF-8. Keine Sonderzeichen-Problematik. Bacs: ASCII-Subset (26 Zeichen Empfängername). SWIFT/ISO 20022: UTF-8.', einsteiger: 'Englisch, keine Zeichensatz-Probleme.', praxis: 'Bacs-Namensfeld: max. 18 Zeichen (STD18 Format). Umlaute in Empfängernamen entfernen.' },
      { feld: 'Nationale Feiertage', experte: '8 Bank Holidays (England & Wales): New Year (01.01), Good Friday, Easter Monday, Early May Bank Holiday (1. Mo Mai), Spring Bank Holiday (letzter Mo Mai), Summer Bank Holiday (letzter Mo Aug), Christmas (25.12), Boxing Day (26.12). Schottland: +2.01 + 30.11 (St Andrew). Nordirland: +17.03 (St Patrick) + 12.07 (Battle of the Boyne).', einsteiger: '8 Bank Holidays in England. Schottland und Nordirland haben eigene Zusatztage.', praxis: 'SAP SCAL: UK-Kalender mit 8 Bank Holidays (EN/WA). Boxing Day (26.12) oft vergessen! Regional differenzieren für SC/NI.' },
      { feld: 'Hauptbanken', experte: 'Barclays (BARCGB22) — starkes Corporate Banking. HSBC UK (MIDLGB22) — internationales Netzwerk. Lloyds Banking Group (LOYDGB2L) — größte UK Retail-Bank. NatWest/RBS (NWBKGB2L) — starkes Corporate. Standard Chartered (SCBLGB2L) — APAC-Fokus. Santander UK. Challenger Banks: Starling, Monzo (keine Corporate-Services).', einsteiger: 'Big 4: Barclays, HSBC, Lloyds, NatWest. Für MNCs: HSBC oder Barclays empfohlen.', praxis: 'HSBC + Barclays haben beste internationale Cash-Management-Plattformen und SAP-Integration.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. GBP 2,3 Bio (6. größte Wirtschaft weltweit). Hauptindustrien: Financial Services (City of London), Pharma, Aerospace, Tech. London = weltweit wichtigster FX-Handelsplatz. Post-Brexit: eigene Regulierung, kein EU-Passporting.', einsteiger: 'Große Wirtschaft, London als Finanzzentrum. Post-Brexit eigene Regeln.', praxis: 'Zahlungsziele B2B: 30 Tage Standard (Late Payment of Commercial Debts Act). Starke Mahnkultur.' },
    ],
  },

  // ───── Block 2: Regulatorik ───────────────────────────────────────────────��
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'Post-Brexit / Kein SEPA', experte: 'Seit 01.01.2021: GB ist KEIN SEPA-Mitglied mehr. EU→GB Zahlungen = SWIFT Cross-Border (nicht SEPA SCT). GB→EU ebenso. GBP-Zahlungen nur über CHAPS/FPS/Bacs. EUR-Zahlungen aus GB nur über SWIFT. SEPA-Lastschriften (SDD) auf GB-Konten nicht mehr möglich.', einsteiger: 'GB ist raus aus SEPA. Zahlungen nach GB = Auslandszahlung über SWIFT.', praxis: 'Häufigster Fehler: SEPA SCT an GB-IBAN senden → wird von Bank abgelehnt. pacs.008 über SWIFT verwenden.' },
      { feld: 'UK PSRs 2017 / 2024', experte: 'Payment Services Regulations 2017 (SI 2017/752) = UK-PSD2-Umsetzung. PSR 2024 Update = UK-PSD3-Äquivalent. SCA seit 14.03.2022 voll wirksam. Open Banking UK (OBIE-Standard, nicht EU PSD2-API) — 9 Großbanken mandatiert, weltweit führende Qualität.', einsteiger: 'Eigenes UK-Zahlungsgesetz statt EU-PSD2. Open Banking ist in UK weiter als in der EU.', praxis: 'B2B-SCA-Ausnahme mit UK-Hausbank separat vereinbaren. Open Banking API für Treasury-Anbindung evaluieren.' },
      { feld: 'AML / Sanctions', experte: 'Money Laundering Regulations 2017 (MLR 2017). Verdachtsmeldung (SAR) an NCA (National Crime Agency). UBO-Register: Companies House PSC Register (Persons with Significant Control). UK-Sanktionen: OFSI (Office of Financial Sanctions Implementation) — eigene UK-Sanktionsliste seit Brexit, weicht von EU-Liste ab!', einsteiger: 'Eigenes AML-Gesetz, eigene Sanktionsliste (OFSI), eigenes UBO-Register (Companies House).', praxis: 'Sanktionsscreening muss OFSI + EU + OFAC (für USD) abdecken — drei verschiedene Listen!' },
      { feld: 'APP Fraud Reimbursement', experte: 'Seit 07.10.2024: Authorised Push Payment (APP) Fraud Reimbursement Scheme. 50/50-Haftungsteilung zwischen Sender- und Empfängerbank. Erstattung bis GBP 85.000 innerhalb 5 Bankarbeitstagen. Gilt für FPS und CHAPS.', einsteiger: 'Neue Betrugsschutz-Regelung: Bank muss bei Zahlungsbetrug bis GBP 85k erstatten.', praxis: 'Confirmation of Payee (CoP) zwingend nutzen, um APP-Fraud-Haftung zu minimieren.' },
      { feld: 'Confirmation of Payee (CoP)', experte: 'Seit 2024 Pflicht für FPS-Zahlungen: Namensabgleich zwischen Empfängername und Kontoinhaber. Responses: Match, Close Match, No Match. Bei No Match: Zahlung kann trotzdem ausgeführt werden, aber Haftung verschiebt sich.', einsteiger: 'Automatischer Namenscheck vor Zahlung — bei Nicht-Übereinstimmung wird gewarnt.', praxis: 'SAP: CoP-Response-Handling integrieren (über Bank-API oder Middleware). Empfängernamen im Stamm exakt pflegen.' },
      { feld: 'UK GDPR / DPA 2018', experte: 'UK GDPR (UK-Variante der EU-DSGVO) + Data Protection Act 2018. ICO (Information Commissioner\'s Office) als Aufsicht. Zahlungsdaten = personenbezogen. Adequacy Decision: EU hat UK-Angemessenheitsbeschluss erteilt (bis Juni 2025, Verlängerung erwartet).', einsteiger: 'Eigene UK-DSGVO, ähnlich wie EU-DSGVO. Datenaustausch EU↔UK aktuell noch möglich.', praxis: 'UK-Adequacy-Status beobachten. Falls Adequacy wegfällt: SCCs für Zahlungsdaten-Transfer nötig.' },
      { feld: 'Maker-Checker / CHAPS', experte: 'CHAPS ist systemisch wichtig (von BoE betrieben). CHAPS Direct Participants unterliegen strengen operationellen Anforderungen. Für Corporates: 4-Augen-Prinzip bei CHAPS-Zahlungen von UK-Banken oft erzwungen.', einsteiger: 'CHAPS-Zahlungen brauchen oft Freigabe von zwei Personen.', praxis: 'SAP: Dual-Authorization für GBP CHAPS-Zahlungen in BCM konfigurieren.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'Faster Payments (FPS)', experte: 'UK Instant Payments. 24/7/365. Limit GBP 1.000.000 (bankabhängig, manche Banken GBP 250.000). Settlement: Near-real-time über BoE. ISO 20022 Migration (FPNG — Faster Payments Next Generation) geplant 2026–2027. Betreiber: Pay.UK.', einsteiger: 'UK-Sofortüberweisung, rund um die Uhr, bis GBP 1 Mio.', praxis: 'Prüfen ob UK-Hausbank FPS-Limit >GBP 250k unterstützt. Format aktuell proprietär, bald ISO 20022.' },
      { feld: 'Bacs', experte: 'UK ACH/DNS System. Betreiber: Pay.UK. 2 Dienste: Direct Credit (Gehälter, Lieferantenzahlungen) und Direct Debit (4 Mrd. Txn/Jahr — Strom, Gas, Miete). Settlement D+3 (Einreichung D, Processing D+1/D+2, Settlement D+3). Format: STD18 (Standard 18, Fixed-Length). SUN (Service User Number) für Direct Debit Pflicht.', einsteiger: 'Bacs = britisches ACH. Direct Debit ist extrem verbreitet (fast jeder Brite nutzt es). Dauert 3 Bankarbeitstage.', praxis: 'SUN bei Bacs beantragen (Vorlauf ~6 Wochen). STD18-DMEE oder Bottomline Technologies Add-on.' },
      { feld: 'CHAPS', experte: 'UK RTGS. Betrieben von Bank of England. Brutto-Echtzeit. Kein Limit. Ca. GBP 400 Mrd./Tag. Seit Juni 2023 vollständig auf ISO 20022 migriert (pacs.008/pacs.009). Cut-off 15:00 GMT/BST. Typisch für Immobilien, Großbetrag, Treasury.', einsteiger: 'CHAPS = Echtzeit-Großbetrag. Für alles über GBP 250k oder wenn es am selben Tag sein muss.', praxis: 'SAP Zahlungsmethode W (Wire/CHAPS). Format: pacs.008 über SWIFT oder H2H. Cut-off 15:00 GMT = 16:00 CET.' },
      { feld: 'SWIFT (Cross-Border)', experte: 'Seit Brexit: Alle EU↔GB Zahlungen laufen über SWIFT. pacs.008.001.09 seit CBPR+ November 2025. MT103 nur noch als Fallback. Korrespondenzbank-Modell für GBP-Zahlungen aus EU.', einsteiger: 'Zahlungen zwischen EU und GB gehen über SWIFT — nicht mehr SEPA.', praxis: 'pacs.008-DMEE für GB-Zahlungen. Korrespondenzbank-Gebühren einkalkulieren (ChrgBr SHAR üblich).' },
      { feld: 'Direct Debit Guarantee', experte: 'UK Direct Debit Guarantee: Zahler kann jederzeit ohne Frist widerrufen und erhält sofortige Rückerstattung. Keine Widerspruchsfrist wie bei SEPA SDD (8 Wochen). Stärkstes Verbraucherschutzrecht in Europa.', einsteiger: 'UK-Lastschrift kann jederzeit zurückgebucht werden — stärker als SEPA SDD.', praxis: 'Höheres Risiko für Einziehende. Mahnwesen für UK DD-Rejects robust aufbauen.' },
      { feld: 'Cut-Off-Zeiten', experte: 'Faster Payments: 24/7/365, sofort. Bacs Direct Credit: Einreichung D, Settlement D+3. Bacs Direct Debit: Einreichung D, Einzug D+3 (SUN nötig). CHAPS: 15:00 GMT/BST, Same-Day. SWIFT (aus DE): 14:00 CET, D+1–D+2.', einsteiger: 'FPS sofort, Bacs 3 Tage, CHAPS am selben Tag bis 15:00 London-Zeit.', praxis: 'F110 für CHAPS-GB: bis 13:00 GMT starten (2h Puffer). Bacs: 3 Bankarbeitstage Vorlauf einplanen.' },
      { feld: 'UK-Konto Empfehlung', experte: 'Für Corporates mit regelmäßigem UK-Geschäft: Lokales GBP-Konto bei UK-Bank dringend empfohlen. Ohne UK-Konto: Jede Zahlung als SWIFT Cross-Border → höhere Gebühren, längere Laufzeit, kein Zugang zu FPS/Bacs.', einsteiger: 'Lokales UK-Konto spart erheblich Gebühren und Zeit.', praxis: 'UK-Konto bei HSBC oder Barclays eröffnen. Kontoeröffnung mit KYC-Dokumentation: ca. 4–8 Wochen.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'Buchungskreis-Setup', experte: 'Hauswährung GBP (nicht EUR!). GBP/EUR-Kurs-Feed täglich. UK-Chart of Accounts (oft UK-GAAP oder IFRS). VAT-Registrierung: UK-VAT-Nummer (GB + 9 Ziffern).', einsteiger: 'UK-Buchungskreis mit Pfund, eigenem Kontenplan und UK-VAT.', praxis: 'VAT-Nummer im Kundenstamm (STCEG): Format GB123456789. UK VAT Return: Making Tax Digital (MTD) beachten.' },
      { feld: 'Zahlungsmethoden FBZP', experte: 'Kein SEPA! Bacs Direct Credit: Zahlungsmethode B oder T. Bacs Direct Debit: Methode D. CHAPS: Methode W. Faster Payments: Methode F (oder bankspezifisch). SWIFT Cross-Border: Methode S.', einsteiger: 'Eigene Zahlungsmethoden für UK. SEPA geht nicht.', praxis: 'Pro Methode eigene DMEE. Bacs STD18 oder Bottomline-Format. CHAPS/SWIFT via pacs.008.' },
      { feld: 'Bacs-DMEE (STD18)', experte: 'Standard 18 Format: Fixed-Length-Records, 100 Bytes/Record. Header (VOL1), User Header (HDR1/HDR2/UHL1), Data Records (je Zahlung), Trailer (EOF1/UTL1). Empfänger: max. 18 Zeichen Name. SUN (6-stellig) als Absenderkennung.', einsteiger: 'Bacs-Format: feste Zeichenlänge, altes Format aber noch Standard.', praxis: 'SAP: Custom DMEE für STD18. Alternativ: Bottomline Technologies Plugin (UK-Marktführer). SUN bei Bacs beantragen.' },
      { feld: 'Sort Code + Account Number', experte: 'UK-Bankstamm muss Sort Code (6-stellig, BNKA-BANKL) + Account Number (8-stellig, LFBK-BANKN) + IBAN (LFBK-IBAN) enthalten. Bacs/FPS nutzen Sort Code + AccNr. SWIFT nutzt IBAN + BIC. Modulus Check: Validierungsalgorithmus für Sort Code + AccNr Kombination.', einsteiger: 'Drei Felder pflegen: Sort Code, Account Number UND IBAN.', praxis: 'Sort Code + AccNr für UK-Inland, IBAN + BIC für Cross-Border. Modulus Check als Validierung einbauen.' },
      { feld: 'Typische Projektfehler', experte: '1) SEPA SCT an GB-IBAN → Rejection (kein SEPA seit Brexit). 2) EUR statt GBP als Währung für UK-Lieferanten. 3) Sort Code fehlt → Bacs/FPS nicht möglich. 4) Bacs SUN nicht beantragt → kein Direct Debit. 5) Zeitzone ignoriert (GMT ≠ CET) → CHAPS Cut-off verpasst. 6) OFSI-Screening fehlt (nur EU-Sanktionen geprüft). 7) Boxing Day (26.12) nicht im SCAL → Zahlung auf Feiertag.', einsteiger: 'Die 7 häufigsten Fehler bei UK-Zahlungsprojekten.', praxis: 'Post-Brexit-Checkliste bei jedem UK-Rollout durchgehen.' },
      { feld: 'Making Tax Digital (MTD)', experte: 'HMRC-Pflicht: Digitale VAT-Meldung über MTD-kompatible Software. Seit April 2022 für alle UK-VAT-registrierten Unternehmen. SAP-Integration über SAP Document Compliance oder Drittanbieter (Avalara, Sovos).', einsteiger: 'UK-Umsatzsteuer muss digital gemeldet werden.', praxis: 'SAP DRC oder Drittanbieter für MTD-VAT-Return. Quarterly VAT Filing.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pacs.008.001.09 (SWIFT / CHAPS)', experte: 'Standard-Format für GBP-Zahlungen über CHAPS (seit ISO 20022 Migration Juni 2023) und für Cross-Border-Zahlungen nach GB über SWIFT (seit CBPR+ November 2025). ISO 20022 nativ.', einsteiger: 'Das aktuelle Standard-Format für GBP-Großbetrags- und internationale Zahlungen.', praxis: 'SAP: pacs.008-DMEE für CHAPS und SWIFT GB-Zahlungen.' },

      // Sektion 10.1 — Bacs (Direct Credit / Direct Debit)
      { feld: '► 10.1 — Bacs STD18 (Direct Credit / Direct Debit)' },
      { feld: 'STD18-Format', experte: 'Standard 18: Fixed-Length, 100 Bytes/Record. Record Types: VOL1 (Volume Header), HDR1/HDR2 (File Headers), UHL1 (User Header mit SUN + Processing Date), Data Records (Sort Code + AccNr + Amount + Name), EOF1/UTL1 (Trailer mit Totals). Encoding: EBCDIC oder ASCII je nach Kanal.', einsteiger: 'Altes, festes Zeichenformat — aber immer noch DER Standard für UK-Massenzahlungen.', praxis: 'Custom DMEE nach STD18 Spec. Bottomline Technologies Plug-in als Alternative. SUN im UHL1-Header.' },
      { feld: 'SUN (Service User Number)', experte: '6-stellige Kennung, identifiziert den Einreicher bei Bacs. Pflicht für Direct Debit. Beantragung bei Bacs Payment Services (Teil von Pay.UK). Vorlauf: ca. 6 Wochen.', einsteiger: 'SUN = Ihre Absendernummer bei Bacs. Ohne SUN kein Direct Debit.', praxis: 'SUN rechtzeitig beantragen! In SAP FBZP hinterlegen.' },
      { feld: 'Direct Debit Instruction (DDI)', experte: 'UK-Mandat: Nicht identisch mit SEPA-Mandat. Originators Reference + SUN als Identifikation. Direct Debit Guarantee: Sofortige Rückerstattung ohne Frist.', einsteiger: 'UK-Lastschrift-Mandat — eigenes Format, nicht SEPA-kompatibel.', praxis: 'DDI-Verwaltung in SAP getrennt von SEPA-Mandaten. Rückbuchungsrate monitoren.' },

      // Sektion 10.2 — Faster Payments (FPS)
      { feld: '► 10.2 — Faster Payments (FPS / Instant)' },
      { feld: 'Format', experte: 'Aktuell: Proprietäres ISO 8583-basiertes Format. Migration zu ISO 20022 (FPNG — Faster Payments Next Generation) geplant 2026–2027 unter New Payments Architecture (NPA). Limit bankabhängig: GBP 250k–1 Mio.', einsteiger: 'UK-Instant-Payment. Aktuell eigenes Format, wird bald auf ISO 20022 umgestellt.', praxis: 'FPS via Bank-H2H oder SWIFT. Kein Standard-SAP-Format — bankspezifischer Kanal.' },
      { feld: 'NPA (New Payments Architecture)', experte: 'Pay.UK plant NPA: Ablösung des bestehenden FPS-Systems durch ISO 20022-native Plattform. Timeline verschoben, aktuell 2026–2027. Wird auch Bacs perspektivisch ablösen.', einsteiger: 'Großes UK-Zahlungsinfrastruktur-Projekt — FPS und Bacs werden modernisiert.', praxis: 'NPA-Timeline beobachten. Langfristig: ISO 20022 für alle UK-Inlandszahlungen.' },

      // Sektion 10.3 — CHAPS (RTGS)
      { feld: '► 10.3 — CHAPS (RTGS / ISO 20022)' },
      { feld: 'Format', experte: 'Seit Juni 2023: Vollständig ISO 20022 (pacs.008.001.09 für Customer Credit Transfer, pacs.009 für FI-to-FI). BoE-betrieben. Enhanced data: Strukturierter Verwendungszweck, LEI optional.', einsteiger: 'CHAPS läuft bereits komplett auf ISO 20022 — modernes XML-Format.', praxis: 'SAP: pacs.008-DMEE. CHAPS via SWIFT FIN oder BoE H2H (nur Direct Participants).' },
      { feld: 'CHAPS vs. FPS', experte: 'CHAPS: Kein Limit, Mo–Fr 06:00–18:00 GMT, Same-Day, ca. GBP 25 Gebühr. FPS: Bis GBP 1 Mio, 24/7, Instant, günstiger. Für >GBP 1 Mio oder zeitkritisch innerhalb Geschäftszeiten: CHAPS. Sonst: FPS.', einsteiger: 'CHAPS für große Beträge (teurer), FPS für den Rest (günstiger, schneller).', praxis: 'Routing in SAP: Betragsschwelle definieren (z.B. >GBP 250k → CHAPS, sonst FPS).' },

      // Sektion 10.4 — SWIFT Cross-Border
      { feld: '► 10.4 — SWIFT pacs.008 (Cross-Border EU↔GB)' },
      { feld: 'Post-Brexit Routing', experte: 'EU→GB und GB→EU: pacs.008.001.09 über SWIFT CBPR+. Korrespondenzbank-Modell. ChrgBr SHAR Standard. MT103 nur noch Fallback bei Legacy-Korrespondenzbanken. Remittance in RmtInf/Strd.', einsteiger: 'Alle Zahlungen zwischen EU und GB laufen über SWIFT in ISO 20022 XML.', praxis: 'pacs.008-DMEE. Korrespondenzbank-Gebühren budgetieren. EndToEndId für Reconciliation sauber setzen.' },

      // Sektion 10.5 — camt / Kontoauszug
      { feld: '► 10.5 — camt.053 / MT940 (Kontoauszug)' },
      { feld: 'Bank Statement', experte: 'UK-Großbanken: camt.053 verfügbar (HSBC, Barclays, Lloyds, NatWest). MT940 noch parallel. Bacs-Reports: Eigene Berichtsformate (ARUDD für DD-Rückgaben, ADDACS für Mandatsänderungen).', einsteiger: 'Elektronischer Kontoauszug — camt.053 oder MT940, plus Bacs-eigene Reports.', praxis: 'SAP: camt.053 Posting Rules für UK-Banken. Bacs ARUDD/ADDACS über separaten Importprozess.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Bankverbindung + Formate', experte: 'UK-GBP-Konto bei UK-Bank eröffnet (HSBC/Barclays empfohlen). Sort Code + Account Number + IBAN + BIC in SAP gepflegt. Bacs STD18-DMEE konfiguriert (oder Bottomline). CHAPS/SWIFT pacs.008-DMEE. SUN bei Bacs beantragt (falls Direct Debit). UK-Fabrikkalender: 8 Bank Holidays (EN/WA).', einsteiger: 'UK-Konto eröffnen, alle Bankfelder pflegen, Formate einrichten, Feiertage konfigurieren.', praxis: 'Sort Code + Account Number + IBAN alle drei pflegen. SUN 6 Wochen Vorlauf! Boxing Day nicht vergessen.' },
      { feld: 'Pre-Go-Live: Compliance', experte: 'OFSI + EU + OFAC (für USD) Sanktionsscreening aktiv. UK-VAT-Registrierung (falls anwendbar). MTD-Anbindung für VAT-Return. CoP-Response-Handling für FPS. GBP/EUR-Kurs-Feed aktiv.', einsteiger: 'Drei Sanktionslisten, UK-Umsatzsteuer digital, Namenscheck bei Zahlungen.', praxis: 'OFSI-Screening zwingend (seit Brexit eigene Liste). CoP über Bank-API integrieren.' },
      { feld: 'Produktivsetzung', experte: 'Bacs-Testdatei validiert. CHAPS-Testzahlung über SWIFT erfolgreich. FPS-Testüberweisung (falls Kanal eingerichtet). OFSI-Screening aktiv + nachweisbar. camt.053/MT940 von UK-Bank empfangen + verbucht. CoP getestet (Match + No Match Szenario).', einsteiger: 'Alle Kanäle testen, Sanktionsprüfung aktiv, Kontoauszug prüfen.', praxis: 'Checkliste: Bacs → CHAPS → FPS → Screening → Auszug → CoP.' },
      { feld: 'Laufender Betrieb', experte: 'NPA/FPNG-Timeline beobachten (FPS ISO 20022 Migration 2026–2027). UK-Adequacy-Status (EU GDPR) monitoren. OFSI-Liste regelmäßig aktualisieren. Bacs SUN jährlich bestätigen. FCA-Regeländerungen verfolgen. APP Fraud Scheme: Prozess für Rückerstattungsanfragen.', einsteiger: 'UK-Regulierung ändert sich seit Brexit schneller. Regelmäßig Updates prüfen.', praxis: 'Pay.UK-Newsletter für NPA-Updates. FCA-Regulatory-Updates im Compliance-System.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Great Britain (${COUNTRY_CODE}) Blocks ===`);
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
