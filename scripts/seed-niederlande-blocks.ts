/**
 * Seed country_blocks for Netherlands (NL).
 *
 * Quelle: content/expansion/laender/nl.md, De Nederlandsche Bank, AFM,
 * Betaalvereniging Nederland, Currence (iDEAL), EPC, OpenPeppol BIS Billing 3.0,
 * Belastingdienst, Kamer van Koophandel.
 * Block-Struktur aligned with IT/CN/DE/CH template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-niederlande-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'NL';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'NL / NLD (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 528.', einsteiger: 'Alpha-2 NL, Alpha-3 NLD.', praxis: 'SAP T005 Eintrag, Bankstamm Länderfeld.' },
      { feld: 'Währung', experte: 'EUR (€) / ISO 4217: EUR. Eurozone-Mitglied seit 01.01.1999 (physisch seit 01.01.2002). Niederländische Karibik (Bonaire, Sint Eustatius, Saba — BES-Inseln): USD seit 01.01.2011. Curaçao + Sint Maarten: ANG (Antilles-Gulden) — eigenes Währungsgebiet, Übergang zu Caribbean Guilder geplant.', einsteiger: 'Euro im Mutterland, USD/ANG in Karibik.', praxis: 'Hauswährung Buchungskreis NL = EUR. Karibik nur bei BES/Curaçao-Töchtern relevant.' },
      { feld: 'IBAN-Format', experte: 'NL + 2 IBAN-Prüfziffern + 4 Bankcode (alphabetisch, BIC-Präfix) + 10 Kontonummer = 18 Stellen. Eine der kürzesten IBAN-Längen weltweit. Der 4-stellige Bankcode entspricht den ersten 4 Buchstaben des BIC (z.B. ABNA für ABN AMRO, RABO für Rabobank, INGB für ING). Beispiel: NL91 ABNA 0417 1643 00. Quelle: https://www.dnb.nl.', einsteiger: '18 Zeichen — kürzeste IBAN im SEPA-Raum. Bankcode ist alphabetisch (BIC-Präfix).', praxis: 'IBAN-Validierung aktiv. Alte 9-stellige NL-Kontonummern (vor 2014): IBAN-Konverter über DNB.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAANL2AXXX (2A = "2A" für Amsterdam, häufigster City Code) oder AAAANL2UXXX (2U für Utrecht — Rabobank). Top BICs: ING Bank INGBNL2AXXX, ABN AMRO ABNANL2AXXX, Rabobank RABONL2UXXX, Triodos TRIONL2UXXX, de Volksbank/SNS SNSBNL2AXXX, Bunq BUNQNL2AXXX.', einsteiger: 'NL2A = Amsterdam, NL2U = Utrecht.', praxis: 'In SAP Hausbank BIC pflegen.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) im Winter / CEST (UTC+2) im Sommer. Umstellung: letzter Sonntag März / Oktober. BES-Karibik: AST (UTC-4).', einsteiger: 'Gleiche Zeitzone wie DE.', praxis: 'SCT Cut-off bei NL-Banken i.d.R. 15:00 CET, T2 URGP bis 17:00 CET.' },
      { feld: 'Zentralbank', experte: 'De Nederlandsche Bank (DNB), Westeinde 1, 1017 ZN Amsterdam. dnb.nl. Eurosystem-Mitglied (NCB). Eine der ältesten Zentralbanken (gegründet 1814). Zuständig für Bankenaufsicht (gemeinsam mit ECB-SSM für systemrelevante), SDD Creditor Identifier, AML-Aufsicht.', einsteiger: 'Niederländische Notenbank — gegründet 1814.', praxis: 'Gläubiger-ID (CI) für SEPA SDD bei DNB beantragen: NL + 2 Prüfziffern + ZZZ + 11-stellige nationale ID.' },
      { feld: 'Aufsicht', experte: 'DNB (De Nederlandsche Bank) — Prudential (Solvabilität, Liquidität). AFM (Autoriteit Financiële Markten) — Conduct (Verbraucherschutz, Kapitalmarkt). Duales Aufsichtsmodell. dnb.nl / afm.nl. NL gilt als sehr strenger AML-Standort: ING zahlte 2018 EUR 775 Mio. AML-Strafe — seitdem extrem strenge interne KYC-Prozesse.', einsteiger: 'DNB für Solvabilität, AFM für Markt — duales Modell.', praxis: 'KYC-Onboarding bei NL-Banken (besonders ING) sehr aufwändig — Zeitpuffer einplanen.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Niederländisch (Nederlands) als Hauptsprache. Friesisch (Frysk) kooffiziell in Provinz Friesland. Englisch als Geschäftssprache sehr weit verbreitet — Bankverträge oft auf Englisch verfügbar. UTF-8 Standard. Sonderzeichen: ë, ï, ö, ü, ij (NL-Digraph). SWIFT MT103: nur ASCII (ij → ij wird beibehalten als zwei Buchstaben).', einsteiger: 'Niederländisch primär, Englisch als Businesssprache verbreitet.', praxis: 'NL-Bankverträge oft auch auf Englisch verfügbar. SAP-Korrespondenz in NL oder EN konfigurieren.' },
      { feld: 'Nationale Feiertage', experte: '8-10 nationale Feiertage je Definition: 01.01 Nieuwjaarsdag, Goede Vrijdag (Karfreitag — Bankfeiertag, formal nicht gesetzlich, aber alle Banken geschlossen), Eerste/Tweede Paasdag (Ostersonntag/Ostermontag), 27.04 Koningsdag (Königstag — Geburtstag von König Willem-Alexander), Hemelvaartsdag (Himmelfahrt), Eerste/Tweede Pinksterdag (Pfingsten Sonntag/Montag), 25.12 Eerste Kerstdag, 26.12 Tweede Kerstdag. Bevrijdingsdag (05.05 — Befreiungstag) ist alle 5 Jahre ein offizieller freier Tag (zuletzt 2025). Quelle: https://www.rijksoverheid.nl.', einsteiger: '8-10 Feiertage. Koningsdag (27.04) und Bevrijdingsdag (05.05 alle 5 Jahre) sind in DE unbekannt.', praxis: 'SAP SCAL: NL-Fabrikkalender mit Karfreitag, Koningsdag, Bevrijdingsdag (alle 5 Jahre). Karfreitag oft im DE-Template, aber andere Daten kritisch.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. EUR 1,1 Bio (5. größte Wirtschaft EU, 17. weltweit). Hauptindustrien: Logistik (Hafen Rotterdam — größter Hafen Europas, Schiphol Amsterdam — wichtiger Frachtflughafen), Agrartech (zweitgrößter Agrarexporteur weltweit nach US — trotz kleiner Fläche), Hightech (ASML — Marktführer Lithografie für Chip-Fertigung), Banken (ING, ABN AMRO), Logistik/Versand (DHL Europe HQ), Energie (Shell), Chemie (DSM, Akzo Nobel). Amsterdam als Treasury-Hub für EU-Holdings sehr beliebt (Tax Ruling APA/ATR möglich, gutes DBA-Netz). Handelspartner: DE, BE, GB, FR, US.', einsteiger: '5. größte EU-Wirtschaft. Beliebter EU-Holding-Standort. Innovationsstark.', praxis: 'Zahlungsziele B2B: 30 Tage Standard. NL-Holding-Struktur in IHB-Designs häufig.' },
      { feld: 'Hauptbanken', experte: 'ING Bank N.V. (INGBNL2AXXX) — größte NL-Bank, führend im Corporate-Treasury, sehr gutes EBICS und API-Angebot, "ING Connect" als API-Plattform. ABN AMRO Bank N.V. (ABNANL2AXXX) — starke Corporate-Banking-Tradition, viele multinationale Konzerne als Clearing-Partner, "ABN AMRO API Gateway". Rabobank (RABONL2UXXX) — Genossenschaftsbank (Coöperatieve Rabobank), sehr stark in Agrar und Lebensmittel. Triodos Bank (TRIONL2UXXX) — Nachhaltigkeitsfokus, für ESG-Konzerne. de Volksbank / SNS (SNSBNL2AXXX) — staatlicher Anteilseigner (seit 2013), Retailfokus. Bunq (BUNQNL2AXXX) — Digitalbank, innovatives API-Angebot.', einsteiger: 'Big 3: ING, ABN AMRO, Rabobank.', praxis: 'ING und ABN AMRO haben stärksten Corporate Treasury Service. Rabobank für Agrar/Lebensmittel. ING-Onboarding besonders intensiv durch hohe AML-Anforderungen.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'PSD2 — Wijzigingswet implementatie PSD2', experte: 'PSD2-Umsetzung in NL durch Änderungen des Wet op het financieel toezicht (Wft) und Wet handhaving consumentenbescherming (Implementatiewet PSD2 vom 14.02.2019). Aufsicht: DNB für Prudential, AFM für Conduct. SCA vollständig umgesetzt — NL-Banken (besonders ING und ABN AMRO) waren europäische Vorreiter bei PSD2-konformer SCA. Open Banking NL: NL gilt als Vorreiter — ING und ABN AMRO haben exzellente PSD2-APIs. POBO in NL: gut etabliert, DNB hat keine speziellen POBO-Restriktionen für EU-Konzerne. PSD3 (2026/2027): IBAN-Namensabgleich (Confirmation of Payee) bereits seit 2017 als freiwilliger Service in NL — ING/ABN AMRO/Rabobank Vorreiter. Quelle: https://wetten.overheid.nl.', einsteiger: 'NL-Zahlungsdienstegesetz = PSD2 in Wft. SCA Pflicht. POBO gut etabliert.', praxis: 'B2B-SCA-Ausnahme schriftlich. POBO mit NL-Hausbank Standardvertrag. CoP/IBAN-Name-Check seit 2017 in Nutzung.' },
      { feld: 'AML — Wwft (Wet ter voorkoming van witwassen en financieren van terrorisme)', experte: 'Wwft (2008, letzte Novelle 2023): NL-AML-Gesetz. Umsetzung der EU-Geldwäscherichtlinien. FIU: FIU-Nederland — fiu-nederland.nl. UBO-Register: Handelsregister (Kamer van Koophandel — KvK) führt UBO-Register seit 2020. Nach CJEU-Urteil 2022 eingeschränkte öffentliche Zugänglichkeit. Bargeldobergrenze: EUR 3.000 für Bargeldgeschäfte zwischen Unternehmen (seit 2021), für Konsumenten EUR 10.000 (Cash Transaction Reporting Obligation — Wwft Art. 1c). NL-Banken und AML: ING zahlte 2018 EUR 775 Mio. AML-Strafe; Rabobank 2024 USD 298 Mio. (US-DOJ); seitdem extrem strenge KYC-Prozesse. Quelle: https://wetten.overheid.nl.', einsteiger: 'Wwft = NL-Geldwäschegesetz. UBO im KvK pflichtweise. Sehr strenge KYC bei NL-Banken.', praxis: 'UBO im KvK eintragen. Sanktionsscreening Standard. Bei ING-Onboarding: extra Zeitpuffer + sorgfältige KYC-Vorbereitung.' },
      { feld: 'GDPR — UAVG (Uitvoeringswet AVG)', experte: 'UAVG (Uitvoeringswet Algemene Verordening Gegevensbescherming, in Kraft seit 25.05.2018) ergänzt DSGVO mit nationalen Besonderheiten. Aufsichtsbehörde: AP (Autoriteit Persoonsgegevens) — autoriteitpersoonsgegevens.nl. Aufbewahrungsfristen: 7 Jahre für Buchhaltung (Algemene Wet inzake Rijksbelastingen Art. 52), Steuer ebenso. Quelle: https://wetten.overheid.nl.', einsteiger: 'UAVG = NL-Datenschutzgesetz. AP ist Aufsichtsbehörde.', praxis: 'Zahlungsbelege 7 Jahre archivieren.' },
      { feld: 'SEPA-Verordnung (EU 260/2012)', experte: 'Vollständig umgesetzt seit 01.02.2014. Ehemalige NL-Inlandsformate (Cleanings, Acceptgiro) durch SEPA SCT/SDD abgelöst. Acceptgiro (Standardrechnungsformat mit Lastschrift) ist seit 2019 vollständig durch SEPA ersetzt. Stand April 2026: SCT ✓, SCT Inst ✓, SDD Core/B2B ✓.', einsteiger: 'SEPA läuft vollständig. Acceptgiro abgelöst.', praxis: 'Standard SEPA-Setup wie DE.' },
      { feld: 'SEPA Instant', experte: 'EU 2024/886. NL-Banken: Empfangspflicht seit Oktober 2025, Sendepflicht seit Juli 2025. Preisparität SCT/SCT Inst seit Oktober 2025. Limit EUR 100.000. Alle NL-Großbanken (ING, ABN AMRO, Rabobank, Bunq, Volksbank) vollständig — NL war europäischer Vorreiter (ING/ABN AMRO seit 2019 Instant-Standard).', einsteiger: 'Sofortüberweisungen Standard und kostenlos in NL — schon vor EU-Pflicht.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },
      { feld: 'DORA / NIS2', experte: 'DORA direkt anwendbar ab 17.01.2025. NIS2-Umsetzung in NL: Cyberbeveiligingswet (Cbw) — Inkrafttreten Mitte 2025 (Verzögerung; ursprünglich Oktober 2024). Aufsicht: NCSC (Nationaal Cyber Security Centrum) — ncsc.nl. DNB koordiniert für Finanzsektor. TIBER-NL: Threat-Intelligence-based Ethical Red Teaming für systemrelevante NL-Banken. Quellen: DORA https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022R2554, NIS2 https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2555.', einsteiger: 'EU-Cyber-Regeln in NL umgesetzt. NCSC ist Cyber-Behörde.', praxis: 'BCP für NL-Bankverbindungen dokumentieren. EBICS-Zertifikate überwachen.' },
      { feld: 'e-Invoice — Peppol BIS Billing 3.0 / Digipoort', experte: 'B2G-Pflicht seit 18.04.2019 (EU-RL 2014/55/EU): alle Lieferanten an Zentralregierung müssen über Digipoort SBR Banking Peppol-konforme E-Rechnungen senden. Format: Peppol BIS Billing 3.0 (UBL 2.1, basiert auf EN 16931) oder UBL-OHNL (NL-Variante). Digipoort = staatlicher Service Bus, betrieben von Logius. Empfänger über OIN (Organisatie-Identificatienummer, 20-stellig) oder Peppol-ID identifiziert. B2B: keine staatliche Pflicht (Stand April 2026); Markt verwendet zunehmend Peppol freiwillig. NL ist OpenPeppol Authority-Mitglied. Quellen: https://www.logius.nl / https://docs.peppol.eu/poacc/billing/3.0/ / https://www.peppol.eu.', einsteiger: 'NL-B2G E-Rechnung via Peppol/Digipoort seit 2019. B2B-Pflicht (noch) nicht.', praxis: 'SAP Document and Reporting Compliance (DRC) für NL konfigurieren. Peppol Access Point auswählen (z.B. Tradeshift, Pagero, Basware, Comarch). OIN/Peppol-ID der NL-Behörden im KNA1.' },
      { feld: 'Steuer-IDs Niederlande', experte: 'KvK-Nummer (Kamer van Koophandel): 8-stellig numerisch — Handelsregisternummer. RSIN (Rechtspersonen en Samenwerkingsverbanden Identificatienummer): 9-stellig — steuerliche ID juristischer Personen. BTW-nummer (NL-USt-ID): NL + 9-stellig + B + 2-stellig (Format: NL999999999B01) — eine der charakteristischsten USt-ID-Formen Europas. BSN (Burger Service Nummer): 9-stellig — nur Privatpersonen. Fiscaal Nummer / Loonheffingennummer: für Lohn. Quellen: https://www.kvk.nl / https://www.belastingdienst.nl.', einsteiger: 'KvK = NL-Handelsregisternummer. BTW = NL-USt-ID mit "B" und 2-stelliger Endung.', praxis: 'SAP LFA1: STCD1 = KvK (8-stellig) oder RSIN (9-stellig), STCEG = BTW-Nummer (NL+9+B+2). T001/OBY6: STCEG der eigenen NL-Gesellschaft. Custom Validation: BTW-Format prüfen — typischer Fehler ist Eingabe ohne "B01".' },
      { feld: 'Withholding Tax', experte: 'Standard-Quellensteuer auf Dividenden: 15% (Wet DB 1965). EU-Mutter-Tochter-Richtlinie und Zins-/Lizenzgebühren-Richtlinie umgesetzt — bei intra-EU-Konzernzahlungen i.d.R. 0%. Sondertarif 25,8% (CIT-Satz) auf "low-tax-jurisdiction"-Empfänger seit 2021 (Bronbelasting op rente en royalties — Anti-Mismatch-Regel). Quelle: https://www.belastingdienst.nl.', einsteiger: '15% Quellensteuer auf Dividenden, intra-EU oft 0%.', praxis: 'Withholding Tax Codes in OBYZ. Bei Zahlungen an "low-tax"-Empfänger: 25,8%-Tarif prüfen — wichtig für Treasury bei IHB-Strukturen.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'equensWorldline (NL Domestic ACH)', experte: 'Niederländischer Domestic-Processor für SEPA, Teil von Worldline-Gruppe (seit Equens-Worldline-Fusion 2016). DNS-Settlement über T2. Verarbeitet alle NL-SEPA-Inlandstransaktionen. Quelle: https://www.equensworldline.com.', einsteiger: 'NL-Inlands-Clearing — Teil der Worldline-Gruppe.', praxis: 'Für Corporate transparent — Bank-Routing entscheidet.' },
      { feld: 'TARGET2 / T2', experte: 'RTGS-System der EZB. EUR-Großbetragszahlungen in Echtzeit. DNB als T2-Teilnehmer.', einsteiger: 'Europäisches Echtzeit-Großbetragssystem für EUR.', praxis: 'T2 URGP Cut-off 17:00 CET.' },
      { feld: 'STEP2 (EBA Clearing)', experte: 'Paneuropäisches ACH/DNS für SEPA. Alle NL-Banken Teilnehmer.', einsteiger: 'Europäisches Massenzahlungssystem.', praxis: 'Standard für F110-Zahlläufe.' },
      { feld: 'TIPS', experte: 'EZB Instant-RTGS für SCT Inst. EUR, 24/7/365. Limit EUR 100.000. Alle NL-Großbanken (ING, ABN AMRO, Rabobank) vollständig angebunden — NL war europäischer Vorreiter. iDEAL-Backend nutzt TIPS für Sofortverarbeitung.', einsteiger: 'EU-weites Instant-Payment-System.', praxis: 'SAP BCM: SvcLvl INST.' },
      { feld: 'iDEAL', experte: 'Niederländisches Online-Zahlungssystem — eines der erfolgreichsten nationalen Online-Systeme weltweit. Betreiber: Currence (Gemeinschaftsunternehmen NL-Banken). Marktanteil NL (2024): ca. 70% aller Online-Zahlungen. Volumen: über 1,5 Mrd. Transaktionen/Jahr. Funktionsweise: Verbraucher wählt iDEAL → wird zu Online-Banking weitergeleitet → authentifiziert sich → zahlt sofort (SEPA SCT Inst im Hintergrund). iDEAL 2.0 (2025): vereinheitlichtes API-System auf Open-Banking-Standard, erleichtert Händlerintegration. Quelle: https://www.ideal.nl / https://www.currence.nl.', einsteiger: 'iDEAL = NL-Online-Zahlungssystem. 70% Marktanteil. B2C-Instrument.', praxis: 'Für NL-E-Commerce zwingend. SAP-Verbuchung als SEPA SCT Inst Gutschrift im camt.054. Integration über PSP (Adyen, Mollie, Stripe NL — alle Amsterdamer FinTech-Hauptsitze).' },
      { feld: 'Top Banken', experte: 'ING Bank (INGBNL2AXXX) — größte NL-Bank. ABN AMRO (ABNANL2AXXX) — Corporate Banking Tradition. Rabobank (RABONL2UXXX) — Genossenschaft, Agrarfokus. Triodos (TRIONL2UXXX) — Nachhaltigkeit. de Volksbank/SNS (SNSBNL2AXXX) — Retailfokus, staatlich. Bunq (BUNQNL2AXXX) — Digitalbank. Bankenverband: NVB (Nederlandse Vereniging van Banken) — nvb.nl.', einsteiger: 'Big 3: ING, ABN AMRO, Rabobank.', praxis: 'ING Connect API + ABN AMRO API Gateway als beste API-Plattformen. Rabobank für Agrar.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SEPA SCT Standard: 15:00 CET, Valuta D+1. SCT URGP via T2: 17:00 CET, Valuta D. SCT Instant: 24/7, sofort. SDD CORE FRST: D-5. SDD CORE RCUR: D-2. SDD B2B: D-1. iDEAL: Echtzeit, sofort.', einsteiger: 'Standard SEPA-Cut-offs. iDEAL in Echtzeit.', praxis: 'F110-Zahllauf bis 13:00 CET starten.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'FBZP — Zahlungsmethodenkonfig', experte: 'Identisch DE für SEPA: "B"/"T" SEPA CT (pain.001.001.03/.09), "D" SEPA SDD Core, "E" SDD B2B. iDEAL: kein SAP-Standard — nur AR/Incoming-Zahlungen über PSP. CI bei DNB beantragen und in FBZP hinterlegen. Bei POBO: BTW-Nummer der zahlenden NL-Gesellschaft im pain.001.', einsteiger: 'NL-FBZP für SEPA wie DE. iDEAL nicht in F110 relevant.', praxis: 'CI bei DNB beantragen. BTW in pain.001 bei POBO via DbtrTaxId.' },
      { feld: 'BTW-Nummer in SAP', experte: 'LFA1/KNA1: STCD1 = KvK (8-stellig) oder RSIN (9-stellig), STCEG = BTW-Nummer (Format NL999999999B01 — 14 Zeichen total). T001/OBY6: STCEG der eigenen NL-Gesellschaft. Custom Validation: BTW-Format prüfen (NL + 9 Ziffern + B + 2 Ziffern). Häufiger Fehler: Eingabe als 12 Zeichen ohne "B01" oder als 9 Ziffern ohne Suffix → Probleme bei intra-EU-Geschäften und VIES-Validierung.', einsteiger: 'BTW im Stamm pflegen — Format NL999999999B01 mit "B" und 2 Endziffern.', praxis: 'BTW-Validierung als Custom-BAdI. VIES-Online-Prüfung über SAP-Standard FAGL_VIES.' },
      { feld: 'Bankkanäle', experte: 'EBICS: ING, ABN AMRO, Rabobank — alle mit EBICS 3.0. Standard für Corporate. ING Connect: ING-eigene API-Plattform (sehr gute Qualität); für multinationale ING-Kunden alternative zur EBICS. ABN AMRO API Gateway: gut dokumentiert; für Treasury-Integration. Rabobank Direct Connect: Rabobank-eigene Multi-Bank-Plattform. SWIFT FileAct: ING/ABN AMRO bieten an für internationale Konzerne.', einsteiger: 'EBICS Standard, NL-Banken haben sehr gute APIs als Alternative.', praxis: 'EBICS 3.0 mit ING/ABN AMRO Standard. Bei Cloud-Treasury-Integration: API-Plattform statt EBICS evaluieren.' },
      { feld: 'Typische Projektfehler NL', experte: '1) Koningsdag (27.04.) im Kalender vergessen. 2) BTW-Format ohne "B01" → falsche EU-USt-ID. 3) iDEAL als Zahlungsausgang erwartet — iDEAL ist nur Eingang. 4) KvK-Nummer vergessen — wird für NL-Vertragsunterlagen benötigt. 5) ING AML-Intensität unterschätzt — Onboarding dauert oft 6-12 Wochen. 6) PSP-Auszüge (Adyen, Mollie) nicht als camt verarbeitet — manuelle Buchung nötig. 7) Karfreitag in deutschen Templates oft enthalten, aber Eerste/Tweede Pinksterdag (Pfingsten Sonntag/Montag) fehlt. 8) Bevrijdingsdag (05.05) alle 5 Jahre als Bankfeiertag vergessen.', einsteiger: 'Häufige Fehler bei NL-Rollouts.', praxis: 'Checkliste in Pre-Go-Live. ING-Onboarding mit ausreichend Vorlauf starten.' },
      { feld: 'IHB / POBO NL', experte: 'NL als beliebter EU-Holding-Standort: Tax Ruling APA/ATR (Advance Pricing Agreement / Advance Tax Ruling) bei Belastingdienst möglich, gutes DBA-Netz, zentrale Lage. POBO in NL: gut etabliert, DNB unterstützt POBO in Konzernstrukturen. UltmtDbtr in pain.001: BTW-Nummer der NL-Tochter bei POBO. 30%-Regel für Expatriates und Innovation Box (9% effektiv) als zusätzliche Vorteile.', einsteiger: 'NL als IHB-Standort sehr beliebt — gutes Steuerumfeld, etablierte POBO-Praxis.', praxis: 'Bei IHB-Design NL als ersten Kandidat prüfen. Tax Ruling über Steuerberater (Loyens & Loeff, NautaDutilh, Houthoff) frühzeitig anstoßen.' },
      { feld: 'Fabrikkalender SCAL', experte: 'NL-Fabrikkalender: 8-10 Feiertage je Definition. Goede Vrijdag (Karfreitag) ist Bankfeiertag aber NICHT gesetzlicher Feiertag — Banken und Bursen geschlossen, Behörden teils geöffnet. Pfingstsonntag (Eerste Pinksterdag) und Pfingstmontag (Tweede Pinksterdag) beide frei. Bevrijdingsdag (05.05) alle 5 Jahre offizieller freier Tag (zuletzt 2025, nächstes 2030). Koningsdag IMMER 27.04 (außer wenn Sonntag → 26.04).', einsteiger: 'NL-Kalender hat eigene Logik: Karfreitag = Bankfeiertag, Bevrijdingsdag alle 5 Jahre.', praxis: 'SAP SCAL: jährlich Dezember aktualisieren. Bevrijdingsdag-Logik (alle 5 Jahre) als Custom-Regel oder manuell pflegen.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.03 / .09 (SEPA SCT)', experte: 'Standard für alle NL-Inlands- und SEPA-Zahlungen. Alle NL-Großbanken akzeptieren beide Versionen. .09 empfohlen für Neuinstallationen.', einsteiger: 'Das Standard-Format für Überweisungen in den Niederlanden und Europa.', praxis: 'SAP DMEE SEPA_CT (.03) oder SEPA_CT_09 (.09). Migration auf .09 empfohlen.' },

      // Sektion 15.1 — SEPA Credit Transfer
      { feld: '► 15.1 — SEPA Credit Transfer (SCT)' },
      { feld: 'Format', experte: 'pain.001.001.03 oder pain.001.001.09. SvcLvl SEPA / URGP, ChrgBr SLEV. Bei POBO: BTW-Nummer der zahlenden NL-Gesellschaft im DbtrTaxId. Quelle: https://www.europeanpaymentscouncil.eu/document-library — EPC SCT Customer-to-Bank IG.', einsteiger: 'XML-Format für SEPA-Überweisungen — identisch mit DE.', praxis: 'SAP DMEE SEPA_CT oder SEPA_CT_09.' },
      { feld: 'EBICS-Auftragsart', experte: 'CCT (Customer Credit Transfer) für pain.001 Upload. HAC für Quittung. C53/C52 für Kontoauszüge. ING/ABN AMRO/Rabobank unterstützen EBICS 3.0.', einsteiger: 'CCT = Überweisung hochladen via EBICS.', praxis: 'FIEB: BTF CCT konfigurieren.' },
      { feld: 'SCT Instant', experte: 'Gleiche pain.001, SvcLvl INST. Max EUR 100.000. NL: alle Großbanken seit 2019, EU-Pflicht-Compliance seit Oktober 2025.', einsteiger: 'Sofortüberweisung — gleiches Format. NL war Vorreiter.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },
      { feld: 'Confirmation of Payee (CoP) / IBAN-Naam-Check', experte: 'NL-Vorreiter seit 2017: bei Zahlungseingabe wird Empfänger-Name gegen IBAN-Inhaber-Name geprüft. Bei Mismatch erscheint Warnung. ING, ABN AMRO, Rabobank, Bunq alle implementiert. Hilft bei Vermeidung von Authorised Push Payment (APP) Fraud. Wird als Vorbild für PSD3-IBAN-Namensabgleich (EU-weit ab 2026/2027) dienen.', einsteiger: 'NL-System zur Prüfung "stimmt der Empfänger-Name zum IBAN?" — Vorreiter für PSD3.', praxis: 'In SAP keine direkte Einbindung — wird bankseitig in PSD2-API umgesetzt. Ab PSD3 (2026/2027) EU-weit Pflicht.' },

      // Sektion 15.2 — SEPA Direct Debit
      { feld: '► 15.2 — SEPA Direct Debit (SDD) / Incasso' },
      { feld: 'SDD Core', experte: 'pain.008.001.02. Mandatsverwaltung in SAP (MndtId + CI). FRST: D-5, RCUR: D-2. Rückgabefrist: 8 Wochen autorisiert (in NL "Storneren" = Stornieren), 13 Monate unautorisiert.', einsteiger: 'Lastschrift für Privat- und Firmenkunden ("Incasso").', praxis: 'SAP Zahlungsmethode "D". CI bei DNB beantragen.' },
      { feld: 'SDD B2B', experte: 'pain.008.001.02 mit SeqTp B2B. FRST/RCUR: D-1. Keine Rückgabe durch Zahler. Bank muss Mandat vorab bestätigen.', einsteiger: 'Firmenlastschrift — keine Widerspruchsmöglichkeit.', praxis: 'SAP Zahlungsmethode "E". Bank-Mandatsbestätigung vor erstem Einzug.' },
      { feld: 'Gläubiger-ID (CI) Niederlande', experte: 'Format: NL + 2 IBAN-Prüfziffern + ZZZ + 11-stellige nationale ID. Beantragung bei DNB. Quelle: https://www.dnb.nl.', einsteiger: 'NL-Gläubiger-ID, bei DNB beantragen.', praxis: 'In FBZP + SAP BCM hinterlegen.' },

      // Sektion 15.3 — iDEAL
      { feld: '► 15.3 — iDEAL (NL Online Payment)' },
      { feld: 'iDEAL 1.0 / 2.0', experte: 'Niederländisches Online-Zahlungssystem von Currence. Marktanteil NL > 70% Online. Funktion: Konsument wählt iDEAL → wird zur Online-Banking-Seite seiner Bank weitergeleitet → authentifiziert → Zahlung wird als SEPA SCT Inst ausgelöst → Händler erhält Bestätigung und Geld in Sekunden. iDEAL 2.0 (Rollout seit 2024, vollständig 2025): vereinheitlichtes API auf Open-Banking-Standard, Multi-Currency, Tokenisierung für wiederkehrende Zahlungen, Identity Service. Quelle: https://www.ideal.nl.', einsteiger: 'NL-Online-Zahlungssystem — Konsument zahlt via Online-Banking.', praxis: 'Im SAP nur als Eingangsbuchung relevant — verbucht als SEPA SCT Inst Gutschrift via camt.054. Integration über PSP (Adyen, Mollie, Stripe NL). Bei eigenem PSP-Konto: PSP liefert Settlement-Auszug, von dem aus auf NL-Hauptkonto gebucht wird.' },
      { feld: 'Tikkie / iDEAL P2P', experte: 'Tikkie: P2P-Zahlungsapp von ABN AMRO auf iDEAL-Basis (kostenlos für ABN-Kunden). Marktdurchdringung sehr hoch in NL. Für Corporate irrelevant. Konkurrenten: WhatsApp-Pay (eingestellt in NL).', einsteiger: 'Tikkie = P2P-Zahlung via Mobilnummer in NL.', praxis: 'Für Corporate B2B nicht relevant.' },

      // Sektion 15.4 — Peppol BIS Billing 3.0 / Digipoort (e-Invoice)
      { feld: '► 15.4 — Peppol BIS Billing 3.0 / Digipoort (e-Invoice)' },
      { feld: 'Peppol BIS Billing 3.0', experte: 'OpenPeppol-Spezifikation: UBL 2.1 XML basierend auf EN 16931. Für B2G-Empfänger an NL-Zentralregierung seit 18.04.2019 Pflicht. NL ist OpenPeppol Authority-Mitglied (PEPPOL Authority). Empfänger über Peppol Participant ID identifiziert (z.B. 0106:81234567 für NL-KvK-basierte ID). Profile: P3 (Invoice/CreditNote). Quelle: https://docs.peppol.eu/poacc/billing/3.0/.', einsteiger: 'EU-Standard für E-Rechnungen — in NL B2G via Peppol Pflicht.', praxis: 'SAP Document and Reporting Compliance (DRC) für NL. Peppol Access Point auswählen (Tradeshift, Pagero, Basware, Comarch, Itella).' },
      { feld: 'Digipoort SBR Banking', experte: 'Niederländischer staatlicher Service Bus für E-Government (B2G), betrieben von Logius. Pflichtkanal für Peppol-Rechnungen an NL-Zentralregierung. SBR (Standard Business Reporting) für Steuer- und Handelsregister-Berichte. OIN (Organisatie-Identificatienummer) als 20-stellige eindeutige ID. Quelle: https://www.logius.nl.', einsteiger: 'Digipoort = staatliches Portal für B2G-E-Rechnungen + Steuer-Berichte.', praxis: 'SAP DRC versendet via Peppol Access Point an Digipoort. OIN der NL-Behörden im KNA1 Custom-Feld.' },
      { feld: 'UBL-OHNL (Legacy)', experte: 'Vor Peppol-Einführung war UBL-OHNL (UBL Open Headers Netherlands) der NL-eigene UBL-Subset. Heute durch Peppol BIS Billing 3.0 abgelöst. Nur in alten Implementierungen relevant.', einsteiger: 'Altes NL-UBL-Format — durch Peppol abgelöst.', praxis: 'Bei alten Bestandskunden ggf. noch relevant; Migration auf Peppol BIS 3.0 priorisieren.' },

      // Sektion 15.5 — camt.053 / camt.054 / Acceptgiro
      { feld: '► 15.5 — camt.053 / camt.054 (ISO 20022 Kontoauszug)' },
      { feld: 'camt.053', experte: 'Tagesauszug, ISO 20022. Version .001.02 bis .001.08 bei NL-Banken. EBICS-Auftragsart C53. Standard-Auszugsformat seit SEPA-Migration 2014.', einsteiger: 'Elektronischer Kontoauszug im XML-Format.', praxis: 'SAP: FF_5 oder BAM. Posting Rules für NL-Banken. C53 via EBICS.' },
      { feld: 'camt.054', experte: 'Buchungsbenachrichtigung, Echtzeit. EBICS-Auftragsart C54. Für SCT Inst Gutschriften und iDEAL-Eingänge (über PSP).', einsteiger: 'Echtzeit-Benachrichtigung bei Kontobewegungen — kritisch für iDEAL-Verbuchung.', praxis: 'Real-Time-Processing in BAM aktivieren. iDEAL-Eingänge im camt.054 als SEPA SCT Inst erkennen (BkTxCd: PMNT/ICDT).' },
      { feld: 'camt.052', experte: 'Intraday-Kontoauszug. EBICS-Auftragsart C52. Für Liquiditätsmonitoring untertägig.', einsteiger: 'Untertägiger Kontostand.', praxis: 'Für Cash-Forecasting in SAP Treasury.' },
      { feld: 'Acceptgiro (Legacy)', experte: 'Historisches NL-Format für Rechnungen mit Lastschrift-Ankündigung — Standard-Vordruck mit Acceptgiro-Streifen am Rechnungsende, Konsument autorisiert direkt. Vollständig durch SEPA SDD ersetzt seit 01.01.2019. Nur noch als historischer Begriff relevant.', einsteiger: 'Altes NL-Rechnungsformat mit Lastschrift — vollständig abgelöst.', praxis: 'Nur in sehr alten Bestandsdokumenten relevant. Kein Aufwand mehr.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Stammdaten + IDs', experte: 'KvK-Nummer (8-stellig) und BTW-Nummer (NL+9+B+2 = 14-stellig) aller NL-Lieferanten in LFA1 (STCD1=KvK, STCEG=BTW). BTW der eigenen NL-Gesellschaft in T001/OBY6. Custom Validation: BTW-Format prüfen (NL999999999B01). Gläubiger-ID (CI) bei DNB beantragt (falls SDD). UBO im KvK gepflegt.', einsteiger: 'Steuer- und Konto-IDs sauber pflegen, BTW-Format-Prüfung.', praxis: 'BTW-Validierung als Custom-BAdI. UBO-Eintrag im KvK.' },
      { feld: 'Pre-Go-Live: Bankanbindung', experte: 'EBICS mit NL-Hausbank (ING / ABN AMRO / Rabobank) konfiguriert; INI/HIA-Briefe ausgetauscht; Zertifikate aktiviert. Alternativ ING Connect API oder ABN AMRO API Gateway evaluiert. DMEE SEPA_CT/SEPA_CT_09 + SEPA_DD konfiguriert. ING-Onboarding-Vorlauf: 6-12 Wochen wegen intensiver KYC.', einsteiger: 'EBICS oder API einrichten. ING-Onboarding mit ausreichend Vorlauf.', praxis: 'EBICS 3.0 Standard. API als Alternative für Cloud-Treasury.' },
      { feld: 'Pre-Go-Live: Kalender', experte: 'NL-Fabrikkalender in SCAL: 8-10 Feiertage inkl. Karfreitag (Goede Vrijdag — Bankfeiertag), Koningsdag (27.04), Eerste/Tweede Pinksterdag, 25.12 + 26.12. Bevrijdingsdag (05.05) alle 5 Jahre.', einsteiger: 'NL-Kalender mit eigenen Feiertagen.', praxis: 'SCAL jährlich Dezember aktualisieren. Bevrijdingsdag-Logik beachten (alle 5 Jahre — zuletzt 2025, nächstes 2030).' },
      { feld: 'Pre-Go-Live: Compliance + e-Invoice', experte: 'Sanktionsscreening aktiv. UBO im KvK gepflegt. SAP DRC für NL konfiguriert: Peppol BIS Billing 3.0 für B2G via Digipoort. Peppol Access Point ausgewählt. NCSC-Anforderungen geprüft. Bei IHB-Strukturen: Tax-Ruling mit Belastingdienst initiiert.', einsteiger: 'Compliance + Peppol einrichten.', praxis: 'SAP DRC für NL. Peppol Access Point: Tradeshift, Pagero, Basware. OIN/Peppol-IDs der NL-Behörden im Stamm.' },
      { feld: 'Produktivsetzung', experte: 'Testübertragungen mit Bank erfolgreich (EBICS Upload + Download). pain.001 mit Bank-Testsystem validiert (BTW im Tax-Feld bei POBO). Erster F110-Lauf. SDD FRST mit D-5 Vorlaufzeit. camt.053 empfangen + verbucht. iDEAL-Eingänge (falls B2C) im camt.054 als SCT Inst erkannt. Peppol-Testrechnung an Digipoort gesendet. Confirmation of Payee (IBAN-Naam-Check) im Bank-Portal getestet.', einsteiger: 'Testlauf, erster Zahllauf, Auszug + iDEAL-Verbuchung prüfen.', praxis: 'Checkliste: Upload → Quittung → camt.053 → camt.054 für Instant. Peppol-Test mit Digipoort Demo.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update. Alle 3 Jahre: EBICS-Zertifikate. iDEAL 2.0-Migration: Händler-API-Integration aktualisieren falls relevant. CoP/IBAN-Naam-Check: bereits Realität, PSD3-Pflicht ab 2026/2027 EU-weit. Tax-Ruling alle 5 Jahre erneuern. Koningsdag (27.04) im Zahlungsplan jährlich. Peppol B2B-Adoption beobachten — könnte ab 2026/2027 Pflicht werden.', einsteiger: 'Wartung + iDEAL/Peppol-Updates.', praxis: 'Q4: SCAL-Update. Q1 2026: PSD3-Vorbereitung. Bevrijdingsdag-Sonderfall (alle 5 Jahre) merken.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Niederlande (${COUNTRY_CODE}) Blocks ===`);
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
