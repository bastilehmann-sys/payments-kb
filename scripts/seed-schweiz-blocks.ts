/**
 * Seed country_blocks for Switzerland (CH).
 *
 * Quellen: DB-Migration 0012, ch-finfrag.md, excel_05_ihb, Domain-Knowledge
 * Block-Struktur aligned with IT/CN/DE/US template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-schweiz-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'CH';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'CH / CHE (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 756.', einsteiger: 'Alpha-2 CH, Alpha-3 CHE.', praxis: 'SAP T005 Eintrag.' },
      { feld: 'Währung', experte: 'CHF (Schweizer Franken, Fr.) / ISO 4217: CHF. NICHT in der Eurozone — aber EUR-Zahlungen über euroSIC/SEPA möglich. Dual-Currency-Land: CHF + EUR parallel.', einsteiger: 'Schweizer Franken. Kein Euro, aber EUR-Zahlungen laufen über SEPA.', praxis: 'SAP Buchungskreis CH: Hauswährung CHF. EUR als Parallelwährung für SEPA-Zahlungen. Zwei Zahlungswege nötig.' },
      { feld: 'IBAN-Format', experte: 'CH + 2 Prüfziffern + 5 BC-Nr. (Bankenclearing) + 12 Kontonummer = 21 Stellen. Beispiel: CH93 0076 2011 6238 5295 7. Prüfziffer nach ISO 7064 MOD 97-10. BC-Nr. = SIX-Bankenclearing-Nummer (ersetzt alte Bankleitzahl).', einsteiger: '21 Zeichen: Ländercode + Prüfziffer + Bankenclearing-Nr. + Kontonummer.', praxis: 'IBAN-Validierung aktiv. BC-Nummer in Bankstamm pflegen. SIX publiziert BC-Verzeichnis.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAACHBB[BBB]. Beispiele: UBS UBSWCHZH80A, Credit Suisse/UBS CRESCHZZ80A, ZKB ZKBKCHZZ80A, Raiffeisen RAIFCH22, PostFinance POFICHBEXXX.', einsteiger: 'CH im BIC = Schweiz.', praxis: 'BIC für Cross-Border Pflicht. Für CHF-Inlandszahlungen via SIC: BC-Nr. reicht.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) / CEST (UTC+2). Gleiche Zeitzone wie DE, AT, FR, IT.', einsteiger: 'Gleiche Zeit wie Deutschland.', praxis: 'SIC Cut-off CHF: 16:15 CET. euroSIC Cut-off EUR: 16:00 CET. Gleiche TZ wie DE = einfach.' },
      { feld: 'Zentralbank', experte: 'Schweizerische Nationalbank (SNB). Börsenstrasse 15, 8022 Zürich. snb.ch. Betreibt SIC (über SIX). Geldpolitik unabhängig von EZB. CHF-Zinspolitik weicht oft vom EUR-Raum ab.', einsteiger: 'SNB = Schweizer Zentralbank. Nicht Teil der EZB/Eurozone.', praxis: 'SNB-Statistikmeldung für grenzüberschreitende Zahlungen >CHF 100k (vierteljährlich).' },
      { feld: 'Aufsicht', experte: 'FINMA (Eidgenössische Finanzmarktaufsicht). Einzige Aufsichtsbehörde (anders als DE mit BaFin+Bundesbank). Zuständig für Banken, Versicherungen, Börsen, AML. FinfraG (Finanzmarktinfrastrukturgesetz) seit 2016.', einsteiger: 'FINMA = die einzige Schweizer Finanzaufsicht (wie BaFin, aber alles in einem).', praxis: 'FINMA-Lizenz nur für Finanzinstitute. FinfraG relevant für Derivate-Reporting (LEI Pflicht).' },
      { feld: 'Sprache / Zeichensatz', experte: '4 Amtssprachen: Deutsch (63%), Französisch (23%), Italienisch (8%), Rätoromanisch (<1%). UTF-8 für ISO 20022 (SIC5). Sonderzeichen: ä, ö, ü, é, è, à, ù. SIX Payment Standards: UTF-8.', einsteiger: 'Deutsch in der Deutschschweiz, Französisch in der Romandie, Italienisch im Tessin.', praxis: 'SAP: Firmennamen in allen Sprachvarianten anlegen. UTF-8 in pain.001 CH-Variante.' },
      { feld: 'Nationale Feiertage', experte: 'Nur 1 nationaler Feiertag: 1. August (Bundesfeiertag). Rest ist kantonal! Zürich: 9 Feiertage. Genf: 10. Tessin: 12. Kalender variiert stark. Auffahrt, Pfingstmontag, Weihnachten/Stephanstag sind in den meisten Kantonen frei, aber nicht überall.', einsteiger: 'Nur 1 nationaler Feiertag (1. August). Alles andere ist kantonal — großer Flickenteppich.', praxis: 'SAP SCAL: CH-Fabrikkalender PRO KANTON anlegen. ZH ≠ GE ≠ TI. Jährlich aktualisieren.' },
      { feld: 'Hauptbanken', experte: 'UBS (UBSWCHZH80A) — nach CS-Übernahme (2023) mit Abstand größte CH-Bank. Zürcher Kantonalbank ZKB (ZKBKCHZZ80A) — größte Kantonalbank. Raiffeisen Schweiz (RAIFCH22) — Genossenschaftsverbund, 3. größte. PostFinance (POFICHBEXXX) — Post-Tochter, starke Retail-Basis. Julius Bär, Lombard Odier — Private Banking.', einsteiger: 'UBS dominiert nach CS-Übernahme. ZKB, Raiffeisen, PostFinance als Alternativen.', praxis: 'UBS + ZKB haben besten Corporate-SIC-Support. PostFinance für QR-Rechnung-Expertise.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. CHF 800 Mrd. Hauptindustrien: Pharma (Novartis, Roche), Uhren/Luxus, Finance, Maschinenbau, Lebensmittel (Nestlé). Handelspartner: DE, US, IT, FR, CN. Sehr hohe Kaufkraft.', einsteiger: 'Kleine, reiche Wirtschaft. Pharma + Finance dominieren. CHF = Safe-Haven-Währung.', praxis: 'Zahlungsziele B2B: 30 Tage Standard. Skonto weniger verbreitet als in DE. CHF-Volatilität beachten (FX-Hedging).' },
    ],
  },

  // ────�� Block 2: Regulatorik ─────────────���──────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'Nicht-EU / Bilaterale Abkommen', experte: 'CH ist NICHT EU-Mitglied, aber bilaterale Abkommen mit EU. SEPA-Teilnehmer seit 2017 (vollständig) — aber kein EU-Binnenmarkt. Keine direkte PSD2-Geltung; CH hat eigene Regulierung. EWR-Abkommen gilt nicht für CH.', einsteiger: 'Schweiz = kein EU-Land, aber SEPA-Teilnehmer für EUR-Zahlungen.', praxis: 'EUR via SEPA normal möglich. CHF ist eigene Welt (SIC). Zollthemen bei Warenlieferung beachten (kein EU-Binnenmarkt).' },
      { feld: 'GwG (CH) — Geldwäschereigesetz', experte: 'GwG (Bundesgesetz über die Bekämpfung der Geldwäscherei). FINMA-GwV (Geldwäschereiverordnung). Meldestelle: MROS (Money Laundering Reporting Office Switzerland). Sorgfaltspflichten (KYC) bei Kontoeröffnung streng. Vereinbarung über die Standesregeln zur Sorgfaltspflicht (VSB, aktuell VSB 24).', einsteiger: 'Eigenes Geldwäschegesetz, strenge KYC-Prüfung, Meldung an MROS.', praxis: 'VSB-konforme Dokumentation bei Kontoeröffnung. UBO-Identifikation Pflicht (Formular A/T).' },
      { feld: 'FINMA / FinfraG', experte: 'FinfraG (2016): Reguliert Finanzmarktinfrastrukturen (Börsen, Clearinghäuser, Zahlungssysteme). Art. 104 FinfraG: Derivate-Meldepflicht an ein anerkanntes Transaktionsregister. LEI (Legal Entity Identifier) Pflicht für meldepflichtige Gegenparteien. FINMA-RS: Rundschreiben mit Detailregeln.', einsteiger: 'FINMA ist Aufsicht + Regulator in einem. FinfraG regelt Zahlungssysteme und Derivate.', praxis: 'LEI für CH-Gesellschaft bei GLEIF registrieren. Derivate-Reporting über SAP TRM oder Drittanbieter.' },
      { feld: 'SECO-Sanktionen', experte: 'Staatssekretariat für Wirtschaft (SECO) verwaltet CH-Sanktionslisten. CH übernimmt meist UN-Sanktionen, teilweise EU-Sanktionen. SECO-Liste weicht von EU-/OFAC-Listen ab! Eigenständige Prüfung nötig.', einsteiger: 'Eigene Sanktionsliste (SECO), nicht identisch mit EU oder OFAC.', praxis: 'Sanktionsscreening muss SECO + EU + OFAC (für USD) abdecken. SECO-Liste: seco.admin.ch.' },
      { feld: 'Quellensteuer auf Zinsen', experte: 'Verrechnungssteuer (VSt) 35% auf Zinsen und Dividenden aus CH. Rückerstattung möglich per DBA (Doppelbesteuerungsabkommen). DBA DE-CH: Reduzierung auf 0% (Zinsen) bzw. 15% (Dividenden) bei Ansässigkeitsnachweis.', einsteiger: '35% Steuer auf Zinsen/Dividenden, aber per DBA rückforderbar.', praxis: 'SAP WHT-Konfiguration: 35% Verrechnungssteuer. Rückforderungsprozess via ESTV (Eidg. Steuerverwaltung).' },
      { feld: 'Datenschutz (nDSG)', experte: 'Neues Datenschutzgesetz (nDSG) seit 01.09.2023. DSGVO-ähnlich, aber eigenständig. Kein Angemessenheitsbeschluss nötig (CH hat EU-Adequacy). EDÖB (Eidg. Datenschutzbeauftragter) als Aufsicht.', einsteiger: 'Neues Datenschutzgesetz seit 2023, ähnlich wie DSGVO.', praxis: 'CH-Zahlungsdaten dürfen in EU verarbeitet werden (Adequacy). Umgekehrt auch.' },
      { feld: 'QR-Rechnung Pflicht', experte: 'Seit 30.09.2022 ist die QR-Rechnung der einzige Einzahlungsschein in der Schweiz (ESR/Oranger Einzahlungsschein abgelöst). QR-Code enthält: IBAN, Betrag, Referenz (QR-IBAN + QR-Referenz oder SCOR-Creditor-Reference). Swiss QR Code Spezifikation: SIX.', einsteiger: 'Der alte orange Einzahlungsschein ist Geschichte. Nur noch QR-Rechnung.', praxis: 'SAP: QR-Rechnung-Formulare konfigurieren (SAP Note 2920688). QR-IBAN zusätzlich zur normalen IBAN pflegen.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────��───────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'SIC (Swiss Interbank Clearing)', experte: 'CHF-RTGS-System. Betrieben von SIX im Auftrag der SNB. SIC5 seit November 2023: vollständig ISO 20022 (pain.001 CH-Variante). Brutto-Echtzeit-Settlement für CHF. Alle CH-Banken angeschlossen.', einsteiger: 'SIC = das Schweizer Zahlungssystem für CHF. Alle CHF-Zahlungen laufen darüber.', praxis: 'CHF-Zahlungen in SAP: CH-pain.001 Format (NICHT EPC-pain.001!). SIC5 Cut-off 16:15 CET.' },
      { feld: 'SIC IP (Instant Payments)', experte: 'Seit August 2024: CHF Instant Payments über SIC. 24/7/365. Limit CHF 500.000 (initial, Erhöhung geplant). ISO 20022 nativ. Erste Banken: UBS, ZKB, PostFinance. Rollout läuft.', einsteiger: 'Instant Payments in CHF, 24/7, seit August 2024.', praxis: 'SAP: SvcLvl Konfiguration für SIC IP prüfen wenn Hausbank bereit.' },
      { feld: 'euroSIC', experte: 'EUR-Clearing für CH-Banken. Betrieben von SIX. Angebunden an STEP2 (EBA Clearing). ACHTUNG: euroSIC wird im November 2027 eingestellt! CH-Banken müssen EUR-Zahlungen dann direkt über STEP2/EBA Clearing abwickeln. Migration rechtzeitig planen.', einsteiger: 'euroSIC = EUR-Zahlungen aus der Schweiz über SEPA. Wird November 2027 abgeschaltet!', praxis: 'EUR-Zahlungen aus CH aktuell über euroSIC. Ab Nov 2027: direkter STEP2-Zugang nötig. Migration mit Hausbank planen.' },
      { feld: 'SEPA-Teilnahme', experte: 'CH ist SEPA-Teilnehmer seit 2017 (SCT) und 2018 (SDD). EUR-IBAN beginnt mit CH aber Clearing über euroSIC. SCT Inst: Empfang über TIPS angebunden, Sende-Fähigkeit bankabhängig.', einsteiger: 'SEPA funktioniert in der Schweiz für EUR-Zahlungen.', praxis: 'SEPA SDD mit CH-Gegenpartei: CI-Nummer der CH-Gesellschaft beantragen (bei SIX).' },
      { feld: 'Dual-Setup: CHF + EUR', experte: 'KERNTHEMA CH: Jede CH-Gesellschaft braucht zwei Zahlungswege. CHF: SIC mit CH-pain.001 (SIX Swiss Payment Standards). EUR: SEPA/euroSIC mit EPC-pain.001. Verschiedene Formate, verschiedene Cut-offs, verschiedene Clearing-Systeme.', einsteiger: 'Schweiz = zwei parallele Zahlungswelten. CHF und EUR müssen separat eingerichtet werden.', praxis: 'SAP: Zwei Zahlungsmethoden (CHF-SIC + EUR-SEPA), zwei DMEE-Bäume, zwei Hausbankkonten. Häufigster Projekfehler: nur einen Weg konfiguriert.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SIC CHF: Standard 16:15 CET, Express 16:15 CET. euroSIC EUR: 16:00 CET. SIC IP: 24/7. SWIFT Cross-Border: 14:00–15:00 CET (bankabhängig).', einsteiger: 'CHF bis 16:15, EUR bis 16:00, Instant rund um die Uhr.', praxis: 'F110 für CH: CHF- und EUR-Läufe getrennt terminieren. CHF-Lauf bis 14:00 CET empfohlen (2h Puffer).' },
      { feld: 'Post-CS-Merger (UBS/CS)', experte: 'Credit Suisse Integration in UBS (seit 2023). CS-BICs (CRESCHZZ) werden migriert auf UBS-Infrastruktur. CS-Kunden: neue BIC/Kontonummer-Migration beachten. Übergangsphase bis voraussichtlich 2026.', einsteiger: 'CS existiert nicht mehr — alle Konten werden auf UBS migriert.', praxis: 'CS-Bankstammdaten in SAP prüfen und auf UBS migrieren. CS-BIC CRESCHZZ wird abgeschaltet.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ────��─────────────────���──────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'Dual-DMEE-Setup', experte: 'CHF: DMEE für CH-pain.001.001.09.ch.03 (SIX Swiss Payment Standards). EUR: DMEE für EPC-pain.001.001.03 oder .09 (SEPA Standard). Zwei verschiedene Format-Bäume pro CH-Buchungskreis. CH-Format hat eigene Felder: CH-spezifische Adressstruktur, QR-Referenz, ISR-Referenz (Legacy).', einsteiger: 'Zwei verschiedene Zahlungsformate: eins für CHF, eins für EUR.', praxis: 'CHF-DMEE: SAP Note 2003108 (CH-pain.001). EUR-DMEE: Standard SEPA_CT. Beide in FBZP dem gleichen Buchungskreis zuordnen.' },
      { feld: 'QR-Rechnung in SAP', experte: 'QR-Rechnung erfordert: QR-IBAN (spezielle IBAN mit QR-IID 30000–31999), QR-Referenz (26-stellig + 1 Prüfziffer, MOD 10 rekursiv) oder SCOR-Creditor-Reference (ISO 11649). SAP Note 2920688: QR-Bill-Unterstützung. Formularanpassung nötig.', einsteiger: 'QR-Rechnung = Schweizer Rechnungsformat mit QR-Code. Braucht spezielle IBAN.', praxis: 'QR-IBAN als zweite Bankverbindung im Kundenstamm. SAP-Formulare (SD Billing, FI) anpassen. QR-Referenz im Verwendungszweck.' },
      { feld: 'Zahlungsmethoden FBZP', experte: 'CHF Credit Transfer: Zahlungsmethode T (oder bankspezifisch). CHF LSV+ (Lastschrift CH): Zahlungsmethode L. EUR SEPA SCT: Zahlungsmethode B. EUR SEPA SDD: Zahlungsmethode D. CHF-Methoden nutzen CH-pain.001, EUR-Methoden EPC-pain.001.', einsteiger: 'Eigene Zahlungsmethoden für CHF (T, L) und EUR (B, D).', praxis: 'In FBZP: Pro Währung eigene Methode + DMEE-Zuordnung.' },
      { feld: 'LSV+ / BDD (CH-Lastschrift)', experte: 'LSV+ (Lastschriftverfahren Plus): CH-Lastschrift, ähnlich SEPA SDD aber eigenes Format (pain.008 CH-Variante). BDD (Business Direct Debit): B2B-Variante. Widerspruchsfrist LSV+: 30 Tage. Über SIC abgewickelt.', einsteiger: 'Schweizer Lastschrift — eigenes System neben SEPA SDD.', praxis: 'SAP: Eigene DMEE für CH-pain.008. LSV+-Mandat ≠ SEPA-Mandat. Beides parallel möglich.' },
      { feld: 'SNB-Statistikmeldung', experte: 'SNB-Statistikerhebung: Grenzüberschreitende Zahlungen >CHF 100k (pro Quartal aggregiert melden). Formular SNB/SBV. Rechtsgrundlage: Nationalbankgesetz Art. 16.', einsteiger: 'Große Auslandsüberweisungen werden an die Nationalbank gemeldet.', praxis: 'SAP-Report für SNB-Meldung: Cross-Border-Zahlungen >CHF 100k aggregieren. Meist manuell via Bank oder SNB-Portal.' },
      { feld: 'Typische Projektfehler CH', experte: '1) Nur EUR-DMEE eingerichtet, CHF-Zahlung scheitert. 2) EPC-pain.001 statt CH-pain.001 für CHF → Bank-Rejection. 3) QR-IBAN nicht im Stamm → QR-Rechnung fehlerhaft. 4) CS-Bankdaten nicht auf UBS migriert → Zahlung läuft ins Leere. 5) Kantonale Feiertage fehlen im SCAL → Zahlungen auf Feiertag. 6) LSV+-Mandate statt SEPA-Mandate verwendet (oder umgekehrt).', einsteiger: 'Die 6 häufigsten Fehler bei CH-Zahlungsprojekten.', praxis: 'Dual-Setup-Checkliste vor jedem CH-Rollout durchgehen.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ───────────────────���──────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.09.ch.03 (CH Credit Transfer)', experte: 'SIX Swiss Payment Standards: CH-Variante des pain.001. Weicht vom EPC-Rulebook ab: eigene Adressstruktur (strukturiert Pflicht), CH-spezifische Felder für QR-Referenz/ISR-Referenz, Bankenclearing-Nr. statt BIC für Inlandszahlungen.', einsteiger: 'Schweizer XML-Format für CHF-Überweisungen — sieht ähnlich aus wie SEPA, ist aber anders.', praxis: 'SAP Note 2003108. CH-pain.001 ≠ EPC-pain.001. Banktest zwingend.' },

      // Sektion 9.1 — CH-pain.001 (SIC / CHF)
      { feld: '► 9.1 — CH-pain.001 (SIX Swiss Payment Standards / CHF)' },
      { feld: 'Format-Version', experte: 'pain.001.001.09.ch.03 (aktuelle Produktivversion, SPS 2025 v2.2 / SPS 2026 v2.3). Basiert auf ISO 20022:2019. Vorgänger pain.001.001.03.ch.02 wird nur noch bis November 2026 akzeptiert — danach Pflichtmigration auf .09.ch.03. SIX Implementation Guidelines (IG Credit Transfer) als Referenz.', einsteiger: 'Aktuelle Version .09.ch.03. Alte Version .03.ch.02 wird ab November 2026 abgeschaltet.', praxis: 'Migration auf .09.ch.03 zwingend vor November 2026! SIX IG v2.3 als DMEE-Referenz.' },
      { feld: 'CH-Besonderheiten', experte: 'Strukturierte Adresse ab November 2026 PFLICHT für alle Parteien und Payment Types (TwnNm + Ctry immer gefüllt). BC-Nr. (Bankenclearing) in CdtrAgt/ClrSysMmbId statt BIC. QR-Referenz (Tp=QRR) oder SCOR-Referenz (Tp=SCOR) in RmtInf/Strd. ISR-Referenz (Legacy) nur noch übergangsweise.', einsteiger: 'Strukturierte Adressen ab Nov 2026 Pflicht, BC-Nummer statt BIC, QR-Referenz im Verwendungszweck.', praxis: 'Adressfelder im Kreditorenstamm: StrtNm + BldgNb getrennt pflegen. BC-Nr. in BNKA. Adress-Cleanup vor Nov 2026 durchführen!' },
      { feld: 'Payment Types', experte: 'Type 1: CH-Inlandszahlung CHF (SIC). Type 2: CH-Bankzahlung mit IBAN. Type 3: SEPA-Zahlung EUR (wird über euroSIC geroutet). Type 4: Auslandszahlung. Type 5: ISR-Zahlung (Legacy). Type 6: QR-IBAN-Zahlung.', einsteiger: '6 Zahlungstypen im CH-pain.001 — der Typ steuert das Clearing-Routing.', praxis: 'Payment Type in DMEE über Währung + Empfänger-Bank ableiten. Type 1 für CHF-Standard, Type 3 für EUR.' },

      // Sektion 9.2 — EPC-pain.001 (euroSIC / EUR)
      { feld: '► 9.2 — EPC-pain.001 (SEPA / EUR via euroSIC)' },
      { feld: 'Format', experte: 'Standard EPC-pain.001.001.03 oder .09 für EUR-Zahlungen. Identisch mit DE/EU-SEPA. Wird über euroSIC an STEP2 geroutet. SvcLvl SEPA, ChrgBr SLEV.', einsteiger: 'Normales SEPA-Format für EUR-Zahlungen aus der Schweiz.', praxis: 'SAP: SEPA_CT DMEE (gleich wie DE). Eigene Zahlungsmethode für EUR getrennt von CHF.' },

      // Sektion 9.3 — QR-Rechnung
      { feld: '► 9.3 — QR-Rechnung (Swiss QR Bill)' },
      { feld: 'Spezifikation', experte: 'Swiss QR Code nach SIX-Spezifikation (Version 2.3). Enthält: QR-IBAN oder IBAN, Betrag, Währung (CHF/EUR), Referenztyp (QRR/SCOR/NON), Referenznummer, Empfängerdaten. QR-IBAN: IBAN mit QR-IID (BC-Nr. 30000–31999). QR-Referenz: 26 Ziffern + 1 MOD-10-Prüfziffer = 27 Stellen.', einsteiger: 'QR-Code auf der Rechnung enthält alle Zahlungsinformationen — scannen und bezahlen.', praxis: 'SAP: SD-/FI-Formulare mit Swiss QR Code erweitern. SAP Note 2920688. QR-IBAN im Kundenstamm als Zusatzfeld.' },
      { feld: 'Referenztypen', experte: 'QRR: QR-Referenz (27-stellig, Prüfziffer MOD 10 rekursiv) — nur mit QR-IBAN verwendbar. SCOR: Structured Creditor Reference (ISO 11649, RF + 2 Prüfziffern + bis 21 Zeichen) — mit normaler IBAN. NON: Keine Referenz.', einsteiger: 'Drei Referenzarten: QR-Referenz (alt ISR-Nachfolger), SCOR (internationaler Standard), keine.', praxis: 'QRR für bestehende ISR-Kunden (Migration). SCOR für Neukunden empfohlen (ISO-kompatibel).' },

      // Sektion 9.4 — LSV+ / BDD (CH-Lastschrift)
      { feld: '► 9.4 — LSV+ / BDD (CH-Lastschrift)' },
      { feld: 'LSV+', experte: 'Lastschriftverfahren Plus. CH-pain.008 Format. Widerspruchsfrist 30 Tage. Autorisierung über LSV+-Mandat (nicht SEPA-Mandat!). Einreichung über SIC.', einsteiger: 'Schweizer Lastschrift — eigenes Mandat und eigenes Format.', praxis: 'SAP: CH-pain.008 DMEE. LSV+-Mandate getrennt von SEPA-Mandaten verwalten.' },
      { feld: 'BDD (Business Direct Debit)', experte: 'B2B-Lastschrift CH. Kein Widerspruchsrecht. Bank muss Mandat vorab bestätigen. Äquivalent zu SEPA SDD B2B.', einsteiger: 'Firmenlastschrift Schweiz — keine Widerspruchsmöglichkeit.', praxis: 'Bank-Mandatsbestätigung vor erstem Einzug.' },

      // Sektion 9.5 — camt.053 / Kontoauszug
      { feld: '► 9.5 — camt.053 / camt.054 (Kontoauszug CH)' },
      { feld: 'camt.053 CH', experte: 'SIX Swiss camt.053 (ISO 20022). Seit SIC5 (Nov 2023) Pflichtformat für alle CH-Banken. Ersetzt MT940 und proprietäre Formate. CH-spezifische BkTxCd-Codes für SIC-Transaktionen.', einsteiger: 'Elektronischer Kontoauszug — seit 2023 ISO-20022-Pflicht in der Schweiz.', praxis: 'SAP: camt.053 Posting Rules für CH-Banken. CH-BkTxCd-Mapping beachten.' },
      { feld: 'camt.054 (SIC IP)', experte: 'Echtzeit-Buchungsbenachrichtigung für SIC Instant Payments. ISO 20022.', einsteiger: 'Instant-Benachrichtigung bei CHF-Sofortzahlungen.', praxis: 'Real-Time-Processing in BAM für SIC IP Gutschriften.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ──────────��──────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Dual-Setup', experte: 'CHF-Hausbank + EUR-Hausbank in SAP (FI12). CH-pain.001 DMEE + EPC-pain.001 DMEE konfiguriert. Zahlungsmethoden CHF (T) + EUR (B) in FBZP. Beide mit Hausbank getestet.', einsteiger: 'Zwei Zahlungswege einrichten: CHF + EUR.', praxis: 'Häufigster Fehler: nur EUR eingerichtet. Beide Wege vor Go-Live testen.' },
      { feld: 'Pre-Go-Live: QR + Referenzen', experte: 'QR-IBAN im Kundenstamm (falls QR-Rechnung). QR-Referenz / SCOR-Referenz-Logik in Formularen. QR-Rechnung-Druck getestet. ISR-Migration auf QR abgeschlossen.', einsteiger: 'QR-Rechnung testen, alte ISR-Referenzen migrieren.', praxis: 'SAP Note 2920688. QR-Code auf Testrechnung scannen und verifizieren.' },
      { feld: 'Pre-Go-Live: Compliance + Kalender', experte: 'SECO + EU + OFAC (für USD) Sanktionsscreening aktiv. CH-Fabrikkalender pro Kanton in SCAL. SNB-Statistikmeldung-Prozess definiert. CS→UBS-Migration der Bankstammdaten abgeschlossen.', einsteiger: 'Sanktionslisten, kantonale Feiertage, CS→UBS-Migration.', praxis: 'SCAL: Kanton des Buchungskreis-Standorts. CS-BICs prüfen und auf UBS migrieren.' },
      { feld: 'Produktivsetzung', experte: 'CHF-Testdatei über SIC validiert. EUR-Testdatei über euroSIC/SEPA validiert. Erster F110 für CHF + EUR. camt.053 von CH-Bank empfangen + verbucht. QR-Rechnung in Produktion geprüft. LSV+-Testeinzug (falls Lastschrift).', einsteiger: 'Beide Währungen testen, Kontoauszug prüfen, QR-Rechnung verifizieren.', praxis: 'CHF + EUR getrennt testen. camt.053 Posting Rules für beide Clearing-Systeme.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update (kantonale Feiertage). SIX Swiss Payment Standards Updates verfolgen. KRITISCHE DEADLINES: Nov 2026 — pain.001.001.03 Abschaltung + Strukturierte Adresse Pflicht. Nov 2027 — euroSIC-Einstellung (EUR-Routing-Umstellung). SIC IP Rollout beobachten. SNB-Quartalsmeldung.', einsteiger: 'Zwei kritische Deadlines: Nov 2026 (Format-Migration) und Nov 2027 (euroSIC Ende).', praxis: 'SIX-Newsletter abonnieren. Migrationsprojekt .03→.09 bis Sommer 2026 abschließen. euroSIC-Ablösung bis Herbst 2027.' },
    ],
  },
];

// ═══════════════════════���════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Schweiz (${COUNTRY_CODE}) Blocks ===`);
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
