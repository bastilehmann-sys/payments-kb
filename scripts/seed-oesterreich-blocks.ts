/**
 * Seed country_blocks for Austria (AT).
 *
 * Quelle: Oesterreichische Nationalbank (OeNB), FMA, EPC, STUZZA (Studiengesellschaft
 * für Zusammenarbeit im Zahlungsverkehr), Bundesministerium für Finanzen (BMF),
 * BMDW e-Rechnung an den Bund.
 * Block-Struktur aligned with IT/CN/DE/CH template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-oesterreich-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'AT';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'AT / AUT (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 040.', einsteiger: 'Alpha-2 AT, Alpha-3 AUT.', praxis: 'SAP T005 Eintrag, Bankstamm Länderfeld.' },
      { feld: 'Währung', experte: 'EUR (€) / ISO 4217: EUR. Eurozone-Mitglied seit 01.01.1999 (physisch seit 01.01.2002). Vorgängerwährung ATS (Schilling).', einsteiger: 'Euro.', praxis: 'Hauswährung Buchungskreis AT.' },
      { feld: 'IBAN-Format', experte: 'AT + 2 IBAN-Prüfziffern + 5 Bankleitzahl + 11 Kontonummer = 20 Stellen. Beispiel: AT61 1904 3002 3457 3201. BLZ-Bereiche: 1xxxx Banken in Wien, 2xxxx Sparkassen, 3xxxx Raiffeisen, 4xxxx Volksbanken, 5xxxx HypoVereinsbank, 6xxxx Sonstige. Quelle: https://www.oenb.at.', einsteiger: '20 Zeichen — kürzer als deutsche IBAN. Enthält 5-stellige BLZ.', praxis: 'IBAN-Validierung aktiv. BLZ-Bereiche helfen bei der Hausbank-Klassifikation.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAAATBBXXX. Top BICs: Erste Bank GIBAATWWXXX, Bank Austria/UniCredit BKAUATWWXXX, RBI/Raiffeisen RZBAATWWXXX, BAWAG P.S.K. BAWAATWWXXX, Oberbank OBKLAT2L, Hypo Tirol HYPTAT22, Volksbank VBOEATWWXXX.', einsteiger: 'AT im BIC = Österreich.', praxis: 'In SAP Hausbank BIC pflegen.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) im Winter / CEST (UTC+2) im Sommer. Umstellung: letzter Sonntag März / Oktober.', einsteiger: 'Gleiche Zeitzone wie DE.', praxis: 'SCT Cut-off bei AT-Banken i.d.R. 15:00 CET, T2 URGP bis 17:00 CET.' },
      { feld: 'Zentralbank', experte: 'Oesterreichische Nationalbank (OeNB), Otto-Wagner-Platz 3, 1090 Wien. oenb.at. Eurosystem-Mitglied (NCB). Gegründet 1816 (eine der ältesten weltweit). Zuständig für SDD Creditor Identifier, Statistikmeldungen, AML-Aufsicht (gemeinsam mit FMA).', einsteiger: 'Österreichische Notenbank — gegründet 1816.', praxis: 'Gläubiger-ID (CI) für SEPA SDD bei OeNB beantragen: AT + 2 Prüfziffern + ZZZ + 11-stellige nationale ID. Antrag über https://www.oenb.at.' },
      { feld: 'Aufsicht', experte: 'FMA (Finanzmarktaufsicht Österreich) — fma.gv.at. Integrierte Aufsicht für Banken, Versicherungen, Wertpapierfirmen, Pensionskassen. Zusammen mit OeNB für Bankenaufsicht (Trennung Conduct/Prudential nicht so klar wie BE/NL). Plus EZB-SSM für systemrelevante Banken.', einsteiger: 'FMA = einheitliche AT-Finanzmarktaufsicht.', praxis: 'Direkt nicht relevant für Corporates. Nur für Banken/PSPs als Lizenzgeber.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Deutsch (österreichisches Deutsch) — Amtssprache. Anerkannte Minderheitensprachen: Slowenisch, Kroatisch, Ungarisch (regional). UTF-8 Standard. Sonderzeichen: ä, ö, ü, ß. SWIFT MT103: nur ASCII → Umlaute werden ersetzt (ä→ae). ISO 20022: UTF-8 vollständig.', einsteiger: 'Deutsch wie in DE — gleiche Umlaute.', praxis: 'SAP DMEE: UTF-8 Encoding. DE-Konfiguration für Sprache übernehmbar.' },
      { feld: 'Nationale Feiertage', experte: '13 gesetzliche Feiertage (mehr als DE!): 01.01 Neujahr, 06.01 Heilige Drei Könige (NICHT in DE!), Ostermontag, 01.05 Staatsfeiertag, Christi Himmelfahrt, Pfingstmontag, Fronleichnam, 15.08 Mariä Himmelfahrt (NICHT in DE!), 26.10 Nationalfeiertag (NICHT in DE!), 01.11 Allerheiligen, 08.12 Mariä Empfängnis (NICHT in DE!), 25.12 Christtag, 26.12 Stefanitag (NICHT in DE!). Plus 24.12 Heiliger Abend (kein gesetzlicher, aber Banken geschlossen ab 12 Uhr) und 31.12 (Banken geschlossen ab 12 Uhr).', einsteiger: '13 Feiertage — mehr als DE. 06.01, 15.08, 26.10, 08.12, 26.12 sind in DE keine nationalen Feiertage.', praxis: 'SAP SCAL: AT-Fabrikkalender mit allen 13 Feiertagen. 24.12 + 31.12 als Halbtagsfeiertage konfigurieren (Bankschluss 12:00).' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. EUR 470 Mrd. (16. weltweit, 9. EU). Hauptindustrien: Maschinenbau, Stahl (voestalpine), Automotive (Magna, KTM), Energie (OMV, Verbund), Tourismus, Pharma (Sandoz/Novartis). Starke Mittelstandsstruktur ähnlich DE. Wien als Drehkreuz für CEE-Region. Handelspartner: DE (Hauptpartner), IT, US, CH, CZ, HU.', einsteiger: 'AT-Wirtschaft eng mit DE verflochten. Wien als CEE-Hub.', praxis: 'Zahlungsziele B2B: 30 Tage Standard (§ 458 UGB). DE-Kreditorenstammlogik weitgehend übertragbar.' },
      { feld: 'Hauptbanken', experte: 'Erste Group (GIBAATWWXXX) — größte AT-Bank, Marktführer Retail, starkes CEE-Netz. UniCredit Bank Austria (BKAUATWWXXX) — Teil UniCredit-Gruppe (Italien), starkes Corporate Banking. Raiffeisen Bank International / RBI (RZBAATWWXXX) — Zentralinstitut Raiffeisensektor, sehr stark in CEE/Russland. BAWAG P.S.K. (BAWAATWWXXX) — ehemals Postsparkasse, viele kommunale Konten. Oberbank (OBKLAT2L) — KMU-Fokus, starke Regionalpräsenz Oberösterreich. Hypo NÖ / Hypo Tirol — Landesbanken. Volksbank Wien (VBOEATWWXXX). Bankenverband: WKO Bundessparte Bank und Versicherung, ÖBV (Verband Österreichischer Banken und Bankiers).', einsteiger: 'Big 5: Erste, UniCredit BA, RBI, BAWAG, Oberbank.', praxis: 'Erste Bank + UniCredit BA für multinationale Konzerne mit AT-Standort. RBI für CEE-Routing. Oberbank für KMU.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'PSD2 — ZaDiG 2018 (Zahlungsdienstegesetz 2018)', experte: 'Zahlungsdienstegesetz 2018 (ZaDiG 2018, BGBl. I Nr. 17/2018) als Umsetzung der PSD2. Aufsicht: FMA + OeNB. SCA vollständig umgesetzt — AT-Banken folgen weitgehend dem DE-Vorbild bei B2B-Ausnahmen. POBO ist zulässig; OeNB hat keine spezifischen POBO-Restriktionen für EU-Konzerne. Wien als POBO-Standort beliebt für CEE-Strukturen. PSD3 (2026/2027): Confirmation of Payee in Vorbereitung. Quelle: https://www.ris.bka.gv.at (Rechtsinformationssystem).', einsteiger: 'Österreichisches Zahlungsdienstegesetz = PSD2.', praxis: 'B2B-SCA-Ausnahme schriftlich mit AT-Hausbankverbindungen fixieren. POBO-Rider bei Erste/UniCredit BA/RBI Standardvertrag.' },
      { feld: 'AML — FM-GwG (Finanzmarkt-Geldwäschegesetz)', experte: 'Finanzmarkt-Geldwäschegesetz (FM-GwG, BGBl. I Nr. 118/2016) als Umsetzung der EU-AML-Richtlinien. FIU: Geldwäschemeldestelle im Bundeskriminalamt (FIU-Austria) — bmi.gv.at. UBO-Register: Wirtschaftliche Eigentümer Registergesetz (WiEReG) — verpflichtend für alle AT-Gesellschaften, Eintragung über Unternehmensserviceportal (USP). Bargeldobergrenze: EUR 10.000 (allgemein, EU-AMLD-Standard). Quelle: https://www.bmf.gv.at / https://www.usp.gv.at.', einsteiger: 'FM-GwG = AT-Geldwäschegesetz mit UBO-Register WiEReG.', praxis: 'WiEReG-Eintrag bei IHB-Strukturen für alle AT-Töchter. Sanktionsscreening über SAP FCM ausreichend.' },
      { feld: 'GDPR — DSG (Datenschutzgesetz)', experte: 'Datenschutzgesetz (DSG, BGBl. I Nr. 165/1999, novelliert 2018) ergänzt DSGVO. Aufsichtsbehörde: Datenschutzbehörde (DSB) — dsb.gv.at. Aufbewahrungsfristen: 7 Jahre für Buchhaltungsbelege (§132 BAO — Bundesabgabenordnung). Bei laufenden Verfahren: 22 Jahre.', einsteiger: 'Österreichisches DSGVO-Begleitgesetz. DSB ist Aufsicht.', praxis: 'Zahlungsbelege 7 Jahre archivieren.' },
      { feld: 'SEPA-Verordnung (EU 260/2012)', experte: 'Vollständig umgesetzt seit 01.02.2014. Vorgängerformate (DTAUS-AT, DTAZV-AT, STUZZA-Inlands-Standards) durch SEPA SCT/SDD abgelöst. Stand April 2026: SCT ✓, SCT Inst ✓, SDD Core/B2B ✓.', einsteiger: 'SEPA läuft vollständig.', praxis: 'Standard SEPA-Setup wie DE.' },
      { feld: 'SEPA Instant (EU 2024/886)', experte: 'AT-Banken: Empfangspflicht seit Oktober 2025, Sendepflicht seit Juli 2025. Preisparität SCT/SCT Inst seit Oktober 2025. Limit EUR 100.000. Alle AT-Großbanken (Erste, UniCredit BA, RBI, BAWAG) vollständig.', einsteiger: 'Sofortüberweisungen Pflicht und kostenlos in AT.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },
      { feld: 'DORA / NIS2', experte: 'DORA direkt anwendbar ab 17.01.2025. NIS2-Umsetzung in AT: Netz- und Informationssystemsicherheitsgesetz (NISG 2024) — in Kraft seit November 2024. Aufsicht: Nationale Sicherheitsbehörde (BMI, BKA) und Bundesamt für Verfassungsschutz und Terrorismusbekämpfung (BVT). Für Finanzsektor: FMA + OeNB koordinieren. Quellen: DORA https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022R2554, NIS2 https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2555.', einsteiger: 'EU-Cyber-Regeln in AT umgesetzt durch NISG 2024.', praxis: 'BCP für AT-Bankverbindungen dokumentieren. EBICS-Zertifikate überwachen.' },
      { feld: 'e-Invoice — IKTKonsG / e-Rechnung an den Bund', experte: 'B2G-Pflicht seit 01.01.2014: alle Lieferanten an Bundesdienststellen müssen elektronische Rechnungen via PEPPOL oder Unternehmensserviceportal (USP) e-Rechnung-Service senden. Format: ebInterface (AT-XML, von WKO + STUZZA spezifiziert) oder Peppol BIS Billing 3.0 (UBL). Empfänger über Lieferanten-Identifikationsnummer (LIN) bzw. Peppol-ID. Stand April 2026: B2B-Pflicht steht aktuell nicht auf der politischen Agenda — aber EU-DRR (Digital Reporting Requirements, ViDA) wird ab 2030 EU-weit greifen. Quellen: https://www.erb.gv.at / https://www.peppol.at / https://www.usp.gv.at.', einsteiger: 'B2G E-Rechnung seit 2014 Pflicht. B2B noch nicht (EU-DRR ab 2030).', praxis: 'SAP Document and Reporting Compliance (DRC) für AT konfigurieren. ebInterface oder Peppol BIS 3.0. LIN/Peppol-ID der Bund-Empfänger im KNA1.' },
      { feld: 'Steuer-IDs Österreich', experte: 'Steuernummer (StNr): 9-stellig — von Finanzamt vergeben (Format: FA-Nr + lfd. Nr.). UID-Nummer (Umsatzsteuer-Identifikationsnummer): ATU + 8 Stellen — EU-USt-ID, Vergabe durch UID-Stelle des FA. Firmenbuchnummer (FN): 6 Stellen + Prüfbuchstabe — Handelsregisternummer beim Firmenbuchgericht. KUR (Kennziffer Unternehmensregister): bis 7-stellig — eindeutige Statistikkennzahl. KontoNr alt (vor IBAN): Kontonummer + BLZ. Quellen: https://www.bmf.gv.at / https://www.justiz.gv.at/firmenbuch / https://www.statistik.at.', einsteiger: 'UID = ATU + 8 Stellen (EU-USt-ID). StNr = 9-stellige Finanzamt-ID. FN = Firmenbuchnummer.', praxis: 'SAP LFA1: STCD1 = StNr (9-stellig), STCEG = ATU + 8. T001/OBY6: STCEG der eigenen AT-Gesellschaft. FN als Custom-Feld für Firmenbuch-Verweis.' },
      { feld: 'Withholding Tax / Kapitalertragsteuer (KESt)', experte: 'KESt: 27,5% auf Dividenden und Zinsen (§93 EStG). Bei intra-EU-Konzernzahlungen i.d.R. 0% (EU-Mutter-Tochter-RL umgesetzt). DBA-Reduktion möglich. Lizenzgebühren: 20% Standard, EU-Zins-/Lizenz-RL umgesetzt. Bestätigung der Steueransässigkeit (Formular ZS-A1 / ZS-A2) erforderlich. Quelle: https://www.bmf.gv.at.', einsteiger: '27,5% KESt auf Dividenden, intra-EU oft 0%.', praxis: 'SAP Withholding Tax Codes in OBYZ. Steueransässigkeitsbestätigung jährlich erneuern.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'CS.A (Clearing Service Austria)', experte: 'Österreichisches nationales Retail-Clearing-System für SEPA. Betreiber: PSA Payment Services Austria (Tochter der OeNB) seit 2017. DNS-Settlement über T2. Vorgänger: ARTIS und ATS-Clearing. Verarbeitet alle AT-SEPA-Inlandstransaktionen. Quelle: https://www.psa.at.', einsteiger: 'AT-Inlands-Clearing — von OeNB-Tochter PSA betrieben.', praxis: 'Für Corporate transparent — Bank-Routing entscheidet.' },
      { feld: 'TARGET2 / T2', experte: 'RTGS-System der EZB. EUR-Großbetragszahlungen in Echtzeit. OeNB als T2-Teilnehmer.', einsteiger: 'Europäisches Echtzeit-Großbetragssystem für EUR.', praxis: 'T2 URGP Cut-off 17:00 CET. SvcLvl URGP für Express-Zahlungen.' },
      { feld: 'STEP2 (EBA Clearing)', experte: 'Paneuropäisches ACH/DNS für SEPA. Alle AT-Banken Teilnehmer.', einsteiger: 'Europäisches Massenzahlungssystem.', praxis: 'Standard für F110-Zahlläufe.' },
      { feld: 'TIPS', experte: 'EZB Instant-RTGS für SCT Inst. EUR, 24/7/365. Limit EUR 100.000. Alle AT-Großbanken angebunden.', einsteiger: 'EU-weites Instant-Payment-System.', praxis: 'SAP BCM: SvcLvl INST.' },
      { feld: 'Top Banken', experte: 'Erste Group (GIBAATWWXXX), UniCredit Bank Austria (BKAUATWWXXX), Raiffeisen Bank International / RBI (RZBAATWWXXX), BAWAG P.S.K. (BAWAATWWXXX), Oberbank (OBKLAT2L), Hypo NÖ, Hypo Tirol, Volksbank (VBOEATWWXXX). Bankenverband: ÖBV (Verband Österreichischer Banken und Bankiers).', einsteiger: 'Big 5: Erste, UniCredit BA, RBI, BAWAG, Oberbank.', praxis: 'Erste + UniCredit BA für Multinationals. RBI besonders für CEE-Routing. Oberbank für KMU.' },
      { feld: 'EBICS in AT', experte: 'Alle AT-Großbanken unterstützen EBICS 3.0. STUZZA-Standardisierung folgt weitgehend DE-EBICS-Gesellschaft. Auftragsarten identisch zu DE: CCT, CDD/CDC, STA, C53, C52, C54, HAC. Sicherheitsstufen: T (veraltet), TS (Standard), ES (4-Augen-Prinzip).', einsteiger: 'EBICS Standard — sehr ähnlich zu DE-Implementierung.', praxis: 'DE-EBICS-Konfiguration weitgehend für AT übernehmbar. STUZZA-Empfehlungen prüfen.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SEPA SCT Standard: 15:00 CET, Valuta D+1. SCT URGP via T2: 17:00 CET, Valuta D. SCT Instant: 24/7, sofort. SDD CORE FRST: D-5. SDD CORE RCUR: D-2. SDD B2B: D-1. 24.12 + 31.12: Bankschluss 12:00.', einsteiger: 'Standard SEPA-Cut-offs. 24.12 + 31.12 verkürzt.', praxis: 'F110-Zahllauf bis 13:00 CET. 24.12/31.12 vor 11:00 CET einreichen.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'FBZP — Zahlungsmethodenkonfig', experte: 'Identisch DE für SEPA: "B"/"T" SEPA CT (pain.001.001.03/.09), "D" SEPA SDD Core, "E" SDD B2B. CI bei OeNB beantragen und in FBZP hinterlegen. Bei POBO: UID/StNr der zahlenden AT-Gesellschaft im pain.001.', einsteiger: 'AT-FBZP funktioniert wie DE.', praxis: 'CI bei OeNB beantragen (AT+2+ZZZ+11). DE-FBZP-Vorlage 1:1 übernehmen.' },
      { feld: 'UID/StNr in SAP', experte: 'LFA1/KNA1: STCD1 = StNr (9-stellig), STCEG = UID (ATU + 8). T001/OBY6: STCEG der eigenen AT-Gesellschaft. Custom Validation: ATU-Format + Modulo-10-Prüfziffer (Luhn-ähnlich) für die letzten Stellen. Firmenbuchnummer (FN) als Custom-Feld in LFB1. Bei POBO im DMEE pain.001: Tax/Dbtr/TaxId = UID der zahlenden AT-Gesellschaft.', einsteiger: 'UID, StNr, FN im Stamm pflegen. ATU-Validierung empfohlen.', praxis: 'ATU-Format-Validierung als Custom-Funktion. VIES-Online-Prüfung via FAGL_VIES.' },
      { feld: 'Bankkanäle', experte: 'EBICS 3.0 Standard bei allen AT-Großbanken (Erste, UniCredit BA, RBI, BAWAG, Oberbank). Multibank Standard Interface (MBS): historisches AT-Multibank-Protokoll, weitgehend abgelöst durch EBICS. SWIFT FileAct: Erste Group, UniCredit BA, RBI für internationale Konzerne. STUZZA pflegt nationale EBICS-Empfehlungen.', einsteiger: 'EBICS Standard, sehr ähnlich zu DE.', praxis: 'EBICS 3.0 mit Erste/UniCredit BA/RBI Standard.' },
      { feld: 'Typische Projektfehler AT', experte: '1) DE-Kalender (9 Feiertage) statt AT-Kalender (13 Feiertage) übernommen → 06.01, 15.08, 26.10, 08.12, 26.12 fehlen. 2) 24.12 + 31.12 als ganztägige Bankarbeitstage konfiguriert (sind aber Halbtage). 3) ATU-Format ohne "ATU"-Präfix erfasst (nur 8 Ziffern) → VIES-Validierung scheitert. 4) Firmenbuchnummer (FN) nicht gepflegt — wird für AT-Vertragsunterlagen benötigt. 5) WiEReG-Eintrag (UBO) vergessen → Strafen bis EUR 200.000. 6) ebInterface vs. Peppol-Format-Verwechslung beim Bund.', einsteiger: 'Häufige Fehler bei AT-Rollouts.', praxis: 'Checkliste in Pre-Go-Live. WiEReG-Eintrag rechtzeitig (innerhalb 4 Wochen nach Eintragung).' },
      { feld: 'Fabrikkalender SCAL', experte: 'AT-Fabrikkalender: 13 nationale Feiertage. 24.12 und 31.12 als Halbtagsfeiertage (Bankschluss 12:00). Keine regionalen Unterschiede in den Bundesländern (im Gegensatz zu DE).', einsteiger: 'AT-Kalender hat 13 nationale Feiertage. Keine regionalen.', praxis: 'SCAL: AT-Kalender mit 13 Feiertagen + 2 Halbtage. Jährlich im Dezember aktualisieren.' },
      { feld: 'IHB / POBO AT', experte: 'AT als IHB-Standort: gut etabliert für CEE-Region (Wien als CEE-Drehkreuz). POBO zulässig, OeNB hat keine speziellen Restriktionen. Bei Konzernen mit CEE-Töchtern: Wien-IHB häufig sinnvoll für PLN/CZK/HUF/RON-Zahlungen über RBI. UltmtDbtr in pain.001: UID der AT-Tochter bei POBO.', einsteiger: 'AT als IHB-Standort gut für CEE-Region.', praxis: 'POBO-Rider bei Erste/UniCredit BA/RBI Standardvertrag. RBI besonders stark für CEE-FX-Routing.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.03 / .09 (SEPA SCT)', experte: 'Standard für alle AT-Inlands- und SEPA-Zahlungen. Alle AT-Großbanken akzeptieren beide Versionen. .09 empfohlen für Neuinstallationen.', einsteiger: 'Das Standard-Format für Überweisungen in Österreich und Europa.', praxis: 'SAP DMEE SEPA_CT (.03) oder SEPA_CT_09 (.09). Migration auf .09 empfohlen.' },

      // Sektion 16.1 — SEPA Credit Transfer
      { feld: '► 16.1 — SEPA Credit Transfer (SCT)' },
      { feld: 'Format', experte: 'pain.001.001.03 oder pain.001.001.09. SvcLvl SEPA / URGP, ChrgBr SLEV. STUZZA-Implementierungsrichtlinien folgen weitgehend EPC-Standards. Quelle: https://www.europeanpaymentscouncil.eu/document-library / https://www.stuzza.at.', einsteiger: 'XML-Datei für SEPA-Überweisungen — identisch DE.', praxis: 'SAP DMEE SEPA_CT oder SEPA_CT_09. Banktest mit AT-Hausbank vor Produktivsetzung.' },
      { feld: 'EBICS-Auftragsart', experte: 'CCT (Customer Credit Transfer) für pain.001 Upload. HAC für Quittung. C53/C52 für Kontoauszüge. Alle AT-Großbanken EBICS 3.0.', einsteiger: 'CCT = Überweisung hochladen via EBICS.', praxis: 'FIEB: BTF CCT konfigurieren.' },
      { feld: 'SCT Instant', experte: 'Gleiche pain.001, SvcLvl INST. Max EUR 100.000. AT: alle Großbanken vollständig.', einsteiger: 'Sofortüberweisung.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },

      // Sektion 16.2 — SEPA Direct Debit
      { feld: '► 16.2 — SEPA Direct Debit (SDD)' },
      { feld: 'SDD Core', experte: 'pain.008.001.02. Mandatsverwaltung in SAP (MndtId + CI). FRST: D-5, RCUR: D-2. Rückgabefrist: 8 Wochen autorisiert, 13 Monate unautorisiert.', einsteiger: 'Lastschrift für Privat- und Firmenkunden.', praxis: 'SAP Zahlungsmethode "D". CI bei OeNB beantragen.' },
      { feld: 'SDD B2B', experte: 'pain.008.001.02 mit SeqTp B2B. FRST/RCUR: D-1. Keine Rückgabe durch Zahler.', einsteiger: 'Firmenlastschrift — keine Widerspruchsmöglichkeit.', praxis: 'SAP Zahlungsmethode "E". Bank-Mandatsbestätigung vor erstem Einzug.' },
      { feld: 'Gläubiger-ID (CI) Österreich', experte: 'Format: AT + 2 IBAN-Prüfziffern + ZZZ + 11-stellige nationale ID. Beantragung bei OeNB via https://www.oenb.at.', einsteiger: 'AT-Gläubiger-ID, bei OeNB beantragen.', praxis: 'In FBZP + SAP BCM hinterlegen.' },

      // Sektion 16.3 — ebInterface (e-Invoice)
      { feld: '► 16.3 — ebInterface / Peppol (e-Invoice)' },
      { feld: 'ebInterface', experte: 'AT-spezifisches XML-Format für E-Rechnungen, spezifiziert von WKO + STUZZA. Aktuelle Version 6.1 (April 2026). Strukturiert als reines XML, kompatibel mit EN 16931. Pflichtkanal für B2G via Unternehmensserviceportal (USP) oder Peppol. Quelle: https://www.ebinterface.at.', einsteiger: 'AT-eigenes E-Rechnung-XML — Pflicht für B2G.', praxis: 'SAP Document and Reporting Compliance (DRC) für AT generiert ebInterface 6.1. Versand via USP-Webservice oder Peppol Access Point.' },
      { feld: 'Peppol BIS Billing 3.0', experte: 'Alternative zu ebInterface — UBL 2.1 nach EN 16931. Über Peppol-Netzwerk an österreichische Behörden möglich. AT ist OpenPeppol Authority-Mitglied (Peppol AT, betreut von BRZ). Quellen: https://docs.peppol.eu/poacc/billing/3.0/ / https://www.peppol.at.', einsteiger: 'EU-Standard Peppol — Alternative zu ebInterface.', praxis: 'SAP DRC + Peppol Access Point. Empfänger über Peppol-ID identifizieren.' },
      { feld: 'USP / e-Rechnung an den Bund', experte: 'Unternehmensserviceportal (USP) bietet zentralen e-Rechnung-Service für B2G — alle Bundesdienststellen müssen über USP empfangen. Empfänger via LIN (Lieferanten-Identifikationsnummer). Pflicht seit 01.01.2014. Nicht-Bund Behörden: Peppol oder andere Kanäle. Quelle: https://www.erb.gv.at.', einsteiger: 'USP = staatliches Portal für B2G-Rechnungen an den Bund.', praxis: 'LIN der AT-Bundesdienststellen im KNA1 Custom-Feld pflegen.' },

      // Sektion 16.4 — camt.053 / camt.054
      { feld: '► 16.4 — camt.053 / camt.054 (ISO 20022 Kontoauszug)' },
      { feld: 'camt.053', experte: 'Tagesauszug, ISO 20022. Version .001.02 bis .001.08 bei AT-Banken. EBICS-Auftragsart C53. Ersetzt MT940 und Legacy-AT-Auszugsformate.', einsteiger: 'Elektronischer Kontoauszug im XML-Format.', praxis: 'SAP: FF_5 oder BAM. Posting Rules für AT-Banken.' },
      { feld: 'camt.054', experte: 'Buchungsbenachrichtigung, Echtzeit. EBICS-Auftragsart C54. Für SCT Inst Gutschriften.', einsteiger: 'Echtzeit-Benachrichtigung.', praxis: 'Real-Time-Processing in BAM aktivieren.' },
      { feld: 'camt.052', experte: 'Intraday-Kontoauszug. EBICS-Auftragsart C52. Für Liquiditätsmonitoring.', einsteiger: 'Untertägiger Kontostand.', praxis: 'Cash-Forecasting in SAP Treasury.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Stammdaten + IDs', experte: 'StNr + UID (ATU + 8) aller AT-Lieferanten in LFA1 (STCD1, STCEG). UID der eigenen AT-Gesellschaft in T001/OBY6. Firmenbuchnummer (FN) als Custom-Feld. ATU-Format-Validierung implementiert. Gläubiger-ID (CI) bei OeNB beantragt (falls SDD). WiEReG-Eintrag (UBO) im USP für alle AT-Töchter.', einsteiger: 'Steuer- und UBO-IDs sauber pflegen.', praxis: 'ATU-Validierung als Custom-BAdI. WiEReG-Eintrag innerhalb 4 Wochen.' },
      { feld: 'Pre-Go-Live: Bankanbindung', experte: 'EBICS mit AT-Hausbank (Erste / UniCredit BA / RBI / BAWAG / Oberbank) konfiguriert; INI/HIA-Briefe ausgetauscht; Zertifikate aktiviert. DMEE SEPA_CT/SEPA_CT_09 + SEPA_DD konfiguriert. STUZZA-Implementierungsrichtlinien geprüft.', einsteiger: 'EBICS einrichten.', praxis: 'EBICS 3.0 Standard. DE-Konfiguration weitgehend übernehmbar.' },
      { feld: 'Pre-Go-Live: Kalender', experte: 'AT-Fabrikkalender in SCAL: 13 nationale Feiertage inkl. 06.01, 15.08, 26.10, 08.12, 26.12. 24.12 + 31.12 als Halbtagsfeiertage (Bankschluss 12:00). Keine regionalen Differenzierungen.', einsteiger: 'AT-Kalender ist standardmäßig 13 Feiertage + 2 Halbtage.', praxis: 'SCAL jährlich Dezember aktualisieren. Halbtage als spezielle Cut-off-Logik in F110.' },
      { feld: 'Pre-Go-Live: Compliance + e-Invoice', experte: 'Sanktionsscreening aktiv (FCM oder extern). WiEReG-Eintrag im USP gepflegt. SAP DRC für AT konfiguriert: ebInterface 6.1 oder Peppol BIS 3.0 für B2G via USP. NISG-2024-Anforderungen geprüft. LIN der Bundesempfänger im KNA1.', einsteiger: 'Compliance + ebInterface/Peppol einrichten.', praxis: 'SAP DRC für AT. Peppol Access Point oder USP-Webservice. WiEReG-Eintrag.' },
      { feld: 'Produktivsetzung', experte: 'Testübertragungen mit Bank erfolgreich (EBICS Upload + Download). pain.001 mit Bank-Testsystem validiert (UID im Tax-Feld bei POBO). Erster F110-Lauf. SDD FRST mit D-5 Vorlaufzeit. camt.053 empfangen + verbucht. ebInterface-Testrechnung an USP gesendet.', einsteiger: 'Testlauf, erster Zahllauf, Auszug + ebInterface prüfen.', praxis: 'Checkliste: Upload → Quittung → camt.053 → Abstimmung. USP-Test mit Demo-LIN.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update. Alle 3 Jahre: EBICS-Zertifikate. ebInterface-Versions-Updates verfolgen (jährlich neue Versionen durch WKO/STUZZA). EU-DRR (ViDA) ab 2030 vorbereiten — könnte ebInterface durch EU-einheitliche Pflicht ersetzen. PSD3/CoP-Implementierung beobachten.', einsteiger: 'Wartung + EU-DRR-Vorbereitung 2030.', praxis: 'Q4 jährlich: SCAL-Update + ebInterface-Version. Q1 jeden Jahres: WiEReG-Aktualisierung.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Österreich (${COUNTRY_CODE}) Blocks ===`);
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
