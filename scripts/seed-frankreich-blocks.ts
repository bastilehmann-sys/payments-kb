/**
 * Seed country_blocks for France (FR).
 *
 * Quelle: content/expansion/laender/fr.md, Banque de France, ACPR, EPC,
 * Comité Français d'Organisation et de Normalisation Bancaires (CFONB),
 * STET, Factur-X / FNFE-MPE Spec, DGFiP / Chorus Pro / PPF Documentation.
 * Block-Struktur aligned with IT/CN/DE/CH template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-frankreich-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'FR';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'FR / FRA (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 250.', einsteiger: 'Alpha-2 FR, Alpha-3 FRA.', praxis: 'SAP T005 Eintrag, Bankstamm Länderfeld.' },
      { feld: 'Währung', experte: 'EUR (€) / ISO 4217: EUR. Eurozone-Mitglied seit 01.01.1999 (physisch seit 01.01.2002). Übersee-Departements (DOM): EUR (Guadeloupe, Martinique, Réunion, Guyana, Mayotte). Übersee-Gebiete (COM): XPF (Pacific Franc — Neukaledonien, Französisch-Polynesien, Wallis & Futuna).', einsteiger: 'Euro im Mutterland und DOM. XPF in Pazifik-Gebieten.', praxis: 'Hauswährung Buchungskreis FR = EUR. XPF nur bei COM-Töchtern relevant.' },
      { feld: 'IBAN-Format', experte: 'FR + 2 IBAN-Prüfziffern + 5 Bankcode + 5 Filialcode + 11 Kontonummer + 2 nationale Prüfziffern (Clé RIB) = 27 Stellen. Eine der längsten IBAN-Längen im SEPA-Raum. RIB (Relevé d\'Identité Bancaire) ist das traditionelle FR-Bankidentifikationsdokument. Beispiel: FR14 2004 1010 0505 0001 3M02 606. Quelle: https://www.banque-france.fr.', einsteiger: '27 Zeichen — eine der längsten IBANs. Endet auf eine zusätzliche französische Prüfziffer (Clé RIB).', praxis: 'IBAN-Validierung aktiv. Bei FR-Lieferanten immer RIB anfordern — daraus IBAN ableiten.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAAFRBBXXX. Top BICs: BNP Paribas BNPAFRPPXXX, Société Générale SOGEFRPPXXX, Crédit Agricole AGRIFRPPXXX, Crédit Mutuel CMCIFRPPXXX, BPCE/Caisse d\'Épargne CEPAFRPPXXX, La Banque Postale PSSTFRPPXXX, HSBC France CCFRFRPPXXX.', einsteiger: 'FR im BIC = Frankreich.', praxis: 'In SAP Hausbank BIC pflegen.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) / CEST (UTC+2) — gleich wie DE. Mutterland und DOM teilweise abweichend: Guadeloupe/Martinique UTC-4, Guyana UTC-3, Réunion UTC+4, Mayotte UTC+3. COM: Französisch-Polynesien UTC-10, Neukaledonien UTC+11.', einsteiger: 'Mutterland gleiche Zeitzone wie DE.', praxis: 'SCT Cut-off bei FR-Banken i.d.R. 15:00 CET, T2 URGP bis 17:00 CET.' },
      { feld: 'Zentralbank', experte: 'Banque de France, 31 rue Croix des Petits Champs, 75001 Paris. banque-france.fr. Eurosystem-Mitglied (NCB). Gegründet 1800 von Napoleon Bonaparte. Betreibt CFONB (Comité Français d\'Organisation et de Normalisation Bancaires) für nationale Bankenstandards.', einsteiger: 'Französische Notenbank — eine der ältesten der Welt.', praxis: 'Gläubiger-ID (CI) für SEPA SDD bei Banque de France beantragen: FR + 2 Prüfziffern + ZZZ + 11-stellige nationale ID.' },
      { feld: 'Aufsicht', experte: 'ACPR (Autorité de contrôle prudentiel et de résolution) — Banken-/Versicherungsaufsicht, Tochterbehörde der Banque de France. AMF (Autorité des marchés financiers) — Kapitalmarkt. TRACFIN (Traitement du renseignement et action contre les circuits financiers clandestins) — FIU für AML. acpr.banque-france.fr / amf-france.org / tracfin.economie.gouv.fr.', einsteiger: 'ACPR für Banken, AMF für Märkte, TRACFIN für AML.', praxis: 'Verdachtsmeldungen an TRACFIN. ACPR überwacht POBO-Strukturen kritisch.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Französisch — einzige Amtssprache. Verfassungsartikel 2 schreibt Französisch als Sprache der Republik fest. UTF-8 Standard. Sonderzeichen: à, â, æ, ç, é, è, ê, ë, î, ï, ô, œ, ù, û, ü, ÿ. SWIFT MT103: nur ASCII → Akzente werden entfernt (é → e). ISO 20022: UTF-8 vollständig. Bankverträge typischerweise nur auf Französisch.', einsteiger: 'Französisch ist Amtssprache. Bankverträge meist nur auf Französisch.', praxis: 'SAP-Texte und Korrespondenz in FR konfigurieren. Übersetzungsaufwand für Bankverträge einplanen. Bei MT103: Akzentbehandlung dokumentieren.' },
      { feld: 'Nationale Feiertage', experte: '11 nationale Feiertage: 01.01 Jour de l\'An, Ostermontag (Lundi de Pâques, variabel), 01.05 Fête du Travail, 08.05 Fête de la Victoire 1945 (NICHT in DE!), Himmelfahrt (Ascension, Donnerstag, variabel), Pfingstmontag (Lundi de Pentecôte, variabel — seit 2008 wieder Feiertag, vorher "Journée de solidarité"), 14.07 Fête Nationale (Bastille — Französischer Nationalfeiertag), 15.08 Assomption, 01.11 Toussaint, 11.11 Armistice 1918, 25.12 Noël. Plus regionale Feiertage in Elsass-Mosel: 26.12 (zweiter Weihnachtstag) und Karfreitag (historisch deutsch beeinflusst).', einsteiger: '11 nationale Feiertage — davon 5 die es in DE nicht gibt: 08.05, 14.07, 15.08, 01.11, 11.11.', praxis: 'SAP SCAL: FR-Fabrikkalender mit allen 11 Feiertagen. 14.07 (Bastille) und 08.05 sind DE-Template-Stolpersteine. Elsass-Mosel: 26.12 und Karfreitag zusätzlich.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. EUR 2,8 Bio (2. größte Wirtschaft EU, 7. weltweit). Hauptindustrien: Luxusgüter (LVMH, Kering, L\'Oréal), Luftfahrt (Airbus, Safran, Dassault), Energie (TotalEnergies, EDF, Engie), Banken (BNP Paribas, Société Générale), Automotive (Stellantis, Renault), Lebensmittel/Wein, Pharma (Sanofi). Handelspartner: DE, IT, BE, ES, US.', einsteiger: '2. größte EU-Wirtschaft. Stark in Luxusgütern und Luftfahrt.', praxis: 'Zahlungsziele B2B: 30-60 Tage Standard (Loi LME 2008 begrenzt auf 60 Tage). LCR-Nutzung in Textil/Bau weiterhin verbreitet trotz Rückgang.' },
      { feld: 'Hauptbanken', experte: 'BNP Paribas (BNPAFRPPXXX) — größte FR-Bank, exzellentes Corporate Treasury, internationale Präsenz. Société Générale (SOGEFRPPXXX) — Strukturierungsgeschäft, Investment Banking. Crédit Agricole / LCL (AGRIFRPPXXX) — genossenschaftliche Struktur, starke Regionalbanken (39 Caisses Régionales). Crédit Mutuel (CMCIFRPPXXX) — Genossenschaft, sehr starkes Privatkundennetz. BPCE / Caisse d\'Épargne / Banques Populaires (CEPAFRPPXXX) — genossenschaftliche Gruppe. La Banque Postale (PSSTFRPPXXX) — Bank der Post, öffentliche Auftraggeber. CIC (CMCIFRPPXXX) — Teil Crédit Mutuel. HSBC France (CCFRFRPPXXX) — international.', einsteiger: 'Big 4: BNP Paribas, Société Générale, Crédit Agricole, BPCE.', praxis: 'BNP Paribas + Société Générale für multinationale Konzerne mit FR-Standort. Crédit Agricole für regionale Verankerung. La Banque Postale für Public Sector.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'PSD2 — Ordonnance 2017-1252', experte: 'PSD2-Umsetzung in FR durch Ordonnance n° 2017-1252 vom 9. August 2017 und Décret n° 2017-1313 vom 31. August 2017. Aufsicht: ACPR. SCA in FR über ACPR-Regulierung konkretisiert. B2B-Ausnahme (Art. 17 PSD2) mit Hausbankvertrag vereinbar; ACPR hat klare Leitlinien. POBO in FR: schriftliche Vereinbarung mit FR-Hausbank erforderlich (POBO-Rider, oft auf Französisch); ACPR prüft POBO-Arrangements kritisch. PSD3 (2026/2027): IBAN-Namensabgleich (Confirmation of Payee) — FR-Banken testen aktiv. Quelle: https://www.legifrance.gouv.fr.', einsteiger: 'Französisches Zahlungsdienstegesetz = PSD2. SCA Pflicht, B2B-Ausnahme via Bankvertrag.', praxis: 'B2B-SCA-Ausnahme schriftlich. POBO-Rider Standardvertrag bei BNP Paribas und Société Générale verfügbar — typisch nur auf Französisch.' },
      { feld: 'AML / LCB-FT — Code Monétaire et Financier', experte: 'Code Monétaire et Financier (CMF), Art. L. 561-1 ff. — gesetzliche Grundlage für AML/KYC in FR. FR gilt als eines der strengsten AML-Länder in der EU. FIU: TRACFIN (Traitement du renseignement et action contre les circuits financiers clandestins) — Meldungen an TRACFIN sind bankseitig verpflichtend bei Verdachtsfällen. UBO-Register: Registre des bénéficiaires effectifs (RBE) beim Handelsregister (RCS) — Pflicht für alle FR-Gesellschaften, eingeschränkte öffentliche Zugänglichkeit nach CJEU-Urteil 2022. Bargeldobergrenze: EUR 1.000 (Privatkunden, Nicht-EU-Touristen EUR 10.000); B2B EUR 1.000 — strenger als EU-Durchschnitt. KYC FR-Banken intensiv, besonders bei Nicht-FR-Konzernstrukturen. Quelle: https://www.legifrance.gouv.fr / https://www.tracfin.gouv.fr.', einsteiger: 'CMF Art. L.561 ist FR-AML-Recht. TRACFIN ist FIU. Strenger als EU-Standard.', praxis: 'UBO im RBE über Infogreffe pflegen. Sanktionsscreening Standard (EU/OFAC) ausreichend. Unterlagen für FR-KYC auf Französisch bevorzugt.' },
      { feld: 'GDPR — Loi Informatique et Libertés', experte: 'Loi Informatique et Libertés (Loi n° 78-17 vom 6. Januar 1978), zuletzt geändert durch Loi n° 2018-493 vom 20. Juni 2018 (DSGVO-Anpassung). Aufsichtsbehörde: CNIL (Commission Nationale de l\'Informatique et des Libertés) — cnil.fr. Eine der ältesten und strengsten Datenschutzbehörden der EU. Aufbewahrungsfristen: 10 Jahre für Buchhaltung (Code de Commerce Art. L123-22), 6 Jahre für Steuer (Livre des procédures fiscales Art. L102B).', einsteiger: 'CNIL ist FR-Datenschutzbehörde, sehr streng.', praxis: 'Zahlungsbelege 10 Jahre archivieren. SAP-Berechtigungen für IBAN-Felder DSGVO-konform.' },
      { feld: 'SEPA-Verordnung (EU 260/2012)', experte: 'Vollständig umgesetzt seit 01.02.2014. Ehemalige FR-Inlandsformate (CFONB 120, 160) durch SEPA SCT/SDD abgelöst. CORE-FR (STET) verarbeitet alle FR-SEPA-Transaktionen sowie LCR/BOR. Stand April 2026: SCT ✓, SCT Inst (Virement Instantané) ✓, SDD Core/B2B ✓.', einsteiger: 'SEPA läuft vollständig. Alte CFONB-Formate sind abgelöst.', praxis: 'CFONB 120 nur noch in Sonderfällen. Standard-Setup wie DE.' },
      { feld: 'SEPA Instant / Virement Instantané', experte: 'EU 2024/886. FR-Banken: Empfangspflicht seit Oktober 2025, Sendepflicht seit Juli 2025. Preisparität SCT/SCT Inst seit Oktober 2025. Limit EUR 100.000. Alle FR-Großbanken (BNP, SocGen, Crédit Agricole, BPCE) vollständig. STET routet zu TIPS. Branding "Virement Instantané".', einsteiger: 'Sofortüberweisungen Pflicht und kostenlos in FR.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },
      { feld: 'DORA / NIS2', experte: 'DORA direkt anwendbar ab 17.01.2025. NIS2-Umsetzung in FR: Loi du 30 octobre 2024 (Loi de transposition) und Décret n° 2024-1099. Aufsicht: ANSSI (Agence nationale de la sécurité des systèmes d\'information) — ssi.gouv.fr. ACPR koordiniert für Finanzsektor. Quelle: https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022R2554 (DORA), https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2555 (NIS2).', einsteiger: 'EU-Cyber-Regeln in FR umgesetzt. ANSSI ist Cyber-Behörde.', praxis: 'BCP für FR-Bankverbindungen dokumentieren. EBICS-Zertifikate überwachen. ANSSI-Anforderungen für kritische Infrastruktur prüfen.' },
      { feld: 'e-Invoice — Réforme de la Facturation Électronique', experte: 'B2G-Pflicht seit 2017-2020 (Ordonnance 2014-697): alle Lieferanten an öffentliche Auftraggeber müssen via Chorus Pro elektronische Rechnungen senden. B2B-Pflicht (Loi de Finances 2020/2024): nach mehreren Verschiebungen ist der aktuelle Zeitplan ab 01.09.2026 für alle Empfänger (Empfangspflicht) und gestaffelt für Versand: 01.09.2026 große Unternehmen + ETI, 01.09.2027 KMU + Microentreprises. Plattform: Y-Modell — DGFiP-PPF (Portail Public de Facturation, Plateforme nationale de l\'État, fkz. Chorus Pro Pro) als zentrales Portal + zertifizierte PDP (Plateforme de Dématérialisation Partenaire) als private Provider. Format: Factur-X (PDF/A-3 mit eingebettetem XML) ODER UBL 2.1 ODER CII (UN/CEFACT Cross Industry Invoice). Quellen: https://www.impots.gouv.fr / https://chorus-pro.gouv.fr.', einsteiger: 'B2G E-Rechnung seit 2020 via Chorus Pro. B2B-Pflicht ab 09/2026 stufenweise.', praxis: 'SAP DRC für FR konfigurieren. PPF-Anbindung oder PDP-Provider auswählen (Generix, Esker, Pagero, Tradeshift, Yooz). SIRET der Empfänger korrekt im KNA1.' },
      { feld: 'Steuer-IDs Frankreich', experte: 'SIREN: 9 Stellen numerisch — Unternehmens-Stammnummer (Système Informatique pour le Répertoire des Entreprises). SIRET: SIREN + 5-stelliger NIC (Numéro Interne de Classement) = 14 Stellen — identifiziert konkrete Betriebsstätte (Établissement). Numéro de TVA intracommunautaire: FR + 2 Prüfziffern + SIREN = 13 Stellen — EU-USt-ID. Numéro fiscal: 13-stellig (nur Privatpersonen). NAF/APE-Code: 4 Ziffern + 1 Buchstabe — Tätigkeitsklassifikation (Branche). Quelle: https://www.insee.fr (für SIREN/SIRET) / https://www.impots.gouv.fr.', einsteiger: 'SIREN 9-stellig (Unternehmen), SIRET 14-stellig (Betriebsstätte), TVA = FR + Prüfziffer + SIREN.', praxis: 'SAP LFA1: STCD1 = SIREN, STCD2 = SIRET, STCEG = FR-TVA. T001/OBY6: STCEG der eigenen FR-Gesellschaft. Custom Validation: Luhn-Algorithmus für SIREN.' },
      { feld: 'Withholding Tax / Retenue à la source', experte: 'Retenue à la source seit 2019 für Lohn (PAS — Prélèvement à la Source). Quellensteuer auf Dividenden/Zinsen an Nicht-FR-Empfänger: Standard 25%, DBA-Reduktion möglich. EU-Mutter-Tochter-Richtlinie umgesetzt. Lizenzen: 33,33% Standard. Quelle: https://www.impots.gouv.fr.', einsteiger: '25% Quellensteuer auf Dividenden an Nicht-FR-Empfänger.', praxis: 'SAP Withholding Tax Codes in OBYZ. DBA-Befreiungen über separate Codes. Bestätigung der Steueransässigkeit (formulaire 5000-FR/5000-EN) erforderlich.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'CORE-FR (STET)', experte: 'Französisches nationales Retail-Clearing-System für SEPA + LCR/BOR. Betreiber: STET (Système Technologique d\'Échange et de Traitement) — Gemeinschaftsunternehmen der FR-Großbanken. DNS-Settlement über T2. Verarbeitet neben SEPA-Zahlungen auch LCR und BOR-Transaktionen im elektronischen Format. Eigene technische Spezifikationen und Fristen (teils abweichend von STEP2). Quelle: https://www.stet.eu.', einsteiger: 'FR-Inlands-Clearing — verarbeitet SEPA und FR-Sonderformate (LCR/BOR).', praxis: 'Für Corporate transparent — Bank-Routing entscheidet. Wichtige Cut-offs in CORE: LCR-Einzug D-1.' },
      { feld: 'TARGET2 / T2', experte: 'RTGS-System der EZB. EUR-Großbetragszahlungen in Echtzeit. Banque de France als T2-Teilnehmer.', einsteiger: 'Europäisches Echtzeit-Großbetragssystem für EUR.', praxis: 'T2 URGP Cut-off 17:00 CET. SvcLvl URGP für Express-Zahlungen.' },
      { feld: 'STEP2 (EBA Clearing)', experte: 'Paneuropäisches ACH/DNS für SEPA. Alle FR-Banken Teilnehmer. CORE-FR und STEP2 sind beide für FR-Zahlungen einsetzbar — Routing-Entscheidung der Hausbank.', einsteiger: 'Europäisches Massenzahlungssystem.', praxis: 'Standard für F110-Zahlläufe.' },
      { feld: 'TIPS', experte: 'EZB Instant-RTGS für SCT Inst (Virement Instantané). EUR, 24/7/365. Limit EUR 100.000. STET routet zu TIPS. Alle FR-Großbanken angebunden.', einsteiger: 'EU-weites Instant-Payment-System — in FR "Virement Instantané".', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },
      { feld: 'Top Banken', experte: 'BNP Paribas (BNPAFRPPXXX), Société Générale (SOGEFRPPXXX), Crédit Agricole (AGRIFRPPXXX), Crédit Mutuel (CMCIFRPPXXX), BPCE/Caisse d\'Épargne (CEPAFRPPXXX), La Banque Postale (PSSTFRPPXXX), CIC (CMCIFRPPXXX), HSBC France (CCFRFRPPXXX). Bankenverband: FBF (Fédération bancaire française) — fbf.fr.', einsteiger: 'Big 4: BNP, SocGen, Crédit Agricole, BPCE.', praxis: 'BNP/SocGen für multinationale Konzerne. Crédit Agricole für regionale Verankerung. La Banque Postale für Public Sector. HSBC France als Alternative für nicht-EU-Konzerne.' },
      { feld: 'Bankkanäle', experte: 'EBICS: Alle FR-Großbanken unterstützen EBICS 3.0 (TS- und ES-Sicherheitsstufen). EBICS wurde gemeinsam von DE und FR entwickelt — daher in FR vollständige Marktdurchdringung. SWIFT FileAct: BNP Paribas, Société Générale für internationale Konzerne. H2H proprietär: einige FR-Regionalbanken (Caisse d\'Épargne regional). CFONB Protokoll PESIT: alter FR-Bankkanal-Standard, weitgehend abgelöst durch EBICS. Quelle: https://www.cfonb.org.', einsteiger: 'EBICS Standard — wurde gemeinsam von DE und FR entwickelt.', praxis: 'EBICS 3.0 mit BNP/SocGen Standard. PESIT-Migration auf EBICS bei Altanbindungen.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SEPA SCT Standard: 15:00 CET, Valuta D+1. SCT URGP via T2: 17:00 CET, Valuta D. SCT Instant (Virement Instantané): 24/7, sofort. SDD CORE FRST: D-5. SDD CORE RCUR: D-2. SDD B2B: D-1. LCR-Einzug: D-1 über CORE. Auslandsüberw. SWIFT: 14:00 CET, Valuta D+1 bis D+2.', einsteiger: 'Standard SEPA-Cut-offs. LCR: D-1 zur Einreichung.', praxis: 'F110-Zahllauf bis 13:00 CET starten. LCR-Einreichung min. 1 Tag vor Fälligkeit.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'FBZP — Zahlungsmethodenkonfig', experte: 'Identisch DE für SEPA: "B"/"T" SEPA CT (pain.001.001.03/.09), "D" SEPA SDD Core, "E" SDD B2B. LCR: kein SAP-Standard — Add-On (Serrala FS² FR-Modul, Hanse Orga FR) oder Custom DMEE. CI bei Banque de France beantragen und in FBZP hinterlegen. Bei POBO: SIRET der zahlenden FR-Gesellschaft im pain.001.', einsteiger: 'FR-FBZP für SEPA wie DE. LCR braucht Add-On.', praxis: 'CI bei Banque de France beantragen. SIRET in pain.001 bei POBO via DbtrTaxId.' },
      { feld: 'SIREN/SIRET in SAP', experte: 'LFA1/KNA1: STCD1 = SIREN (9-stellig), STCD2 = SIRET (14-stellig). T001/OBY6: STCEG = TVA-Nummer (FR + 2 + SIREN). Pain.001 bei POBO: Tax/Dbtr/TaxId = SIRET der zahlenden FR-Gesellschaft. Custom Validation: Luhn-Prüfziffer für SIREN. NAF-Code (4 Ziffern + 1 Buchstabe) als Klassifikation in CRM/Reporting.', einsteiger: 'SIREN, SIRET, TVA im Stamm pflegen, Luhn-Prüfung empfohlen.', praxis: 'SIREN-Luhn-Validierung als Custom-Funktion. Bei E-Rechnung-Pflicht (Factur-X) blockierend.' },
      { feld: 'RIB → IBAN Konvertierung', experte: 'FR-Lieferanten liefern oft RIB-Dokument (Relevé d\'Identité Bancaire) statt IBAN. RIB enthält: Bankcode (5), Filialcode (5), Kontonummer (11), Clé RIB (2). Aus RIB lässt sich IBAN ableiten: FR + IBAN-Prüfziffer + RIB-Block. Bei alten Stammdaten: Konvertierung notwendig. Quelle: https://www.banque-france.fr.', einsteiger: 'RIB ist die alte FR-Bankidentifikation — daraus IBAN ableiten.', praxis: 'Bei Datenmigration: SE16N-Massenpflege oder LSMW-Konvertierung. Banque-de-France-Konverter für Validierung.' },
      { feld: 'LCR / BOR in SAP', experte: 'Kein Standard-DMEE für CFONB-LCR/BOR-Format. Add-Ons: Serrala FS² FR-Modul, Hanse Orga FR-LCR, Esker. Custom-DMEE möglich aber komplex. CFONB-Format: 80-Zeichen-Satzformat (Altformat) ODER neueres CFONB-XML (CFONB 7-Tracker). LCR-Akzeptanz prüfen: Viele FR-Lieferanten akzeptieren auch SEPA SCT — LCR-Notwendigkeit pro Lieferant abklären.', einsteiger: 'LCR braucht Add-On. Vor Implementierung: Lieferantenakzeptanz prüfen.', praxis: 'Bei niedrigem LCR-Volumen: SEPA-Migration der Lieferanten priorisieren. Bei hohem Volumen (Textil/Bau): Add-On evaluieren.' },
      { feld: 'Typische Projektfehler FR', experte: '1) RIB statt IBAN in Lieferantenstamm. 2) LCR unterschätzt — bei FR-Lieferanten in Bau/Textil weiterhin verbreitet. 3) Zahlungsreferenz (Remittance Information): FR-Banken verlangen oft strukturierte Referenz; freier Text in EndToEndId wird teilweise abgeschnitten. 4) Sprache in Bankverträgen: nur Französisch — Übersetzungsaufwand unterschätzt. 5) 14.07 (Bastille) und 08.05 (Fête de la Victoire) im Kalender vergessen — kritisch da hohes Lohn-/Liefer-Volumen Mitte Juli. 6) TIP-Rückgaben: spezifisches CFONB-Reject-Format, SAP kann nicht automatisch verarbeiten. 7) Elsass-Mosel: Karfreitag und 26.12 als regionale Feiertage zusätzlich. 8) SIREN-Luhn-Validierung fehlt → falsche SIRENs blockieren Factur-X.', einsteiger: 'Häufige Fehler bei FR-Rollouts.', praxis: 'Checkliste in Pre-Go-Live. Elsass-Mosel-Kalender separat.' },
      { feld: 'IHB / POBO FR', experte: 'POBO-Rider mit FR-Hausbank schriftlich erforderlich (typisch nur auf Französisch). UltmtDbtr in pain.001: SIRET der zahlenden FR-Gesellschaft. ACPR prüft POBO-Strukturen — Dokumentation kritisch. NL- oder LU-IHB-Strukturen mit FR-Töchtern besonders im Fokus der DGFiP (FR-Steueramt). Quelle: https://acpr.banque-france.fr.', einsteiger: 'POBO in FR braucht schriftliche Vereinbarung mit Hausbank.', praxis: 'POBO-Rider Standardvertrag bei BNP/SocGen verfügbar — auf Französisch unterzeichnen. Tax-Ruling bei Steueramt empfehlenswert.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.03 / .09 (SEPA SCT)', experte: 'Standard für 80%+ aller FR-Zahlungen. Alle FR-Großbanken akzeptieren beide Versionen. .09 empfohlen für Neuinstallationen.', einsteiger: 'Das Standard-Format für Überweisungen in Frankreich und Europa.', praxis: 'SAP DMEE SEPA_CT (.03) oder SEPA_CT_09 (.09). Migration auf .09 empfohlen.' },

      // Sektion 14.1 — SEPA Credit Transfer
      { feld: '► 14.1 — SEPA Credit Transfer / Virement SEPA' },
      { feld: 'Format', experte: 'pain.001.001.03 oder pain.001.001.09. SvcLvl SEPA / URGP, ChrgBr SLEV. FR-Besonderheit: Bei strukturierter Remittance Information (Strd) — Pflicht bei B2G-Zahlungen mit Référence Structurée nach ISO 11649 (RF-Referenz). Quelle: https://www.europeanpaymentscouncil.eu/document-library — EPC SCT Customer-to-Bank IG.', einsteiger: 'XML-Format für SEPA-Überweisungen.', praxis: 'SAP DMEE SEPA_CT oder SEPA_CT_09. Strukturierte Referenz für B2G konfigurieren.' },
      { feld: 'EBICS-Auftragsart', experte: 'CCT (Customer Credit Transfer) für pain.001 Upload. HAC für Quittung. C53/C52 für Kontoauszüge. Alle FR-Großbanken unterstützen EBICS 3.0 mit TS-/ES-Sicherheit.', einsteiger: 'CCT = Überweisung hochladen via EBICS.', praxis: 'FIEB: BTF CCT konfigurieren.' },
      { feld: 'SCT Instant / Virement Instantané', experte: 'Gleiche pain.001, SvcLvl INST. Max EUR 100.000. FR-Banken: alle Großbanken vollständig (Empfangspflicht seit Oktober 2025, Sendepflicht Juli 2025). Branding "Virement Instantané".', einsteiger: 'Sofortüberweisung — gleiches Format, anderer Service-Level.', praxis: 'SAP BCM: SvcLvl INST in Zahlungsmethode konfigurieren.' },

      // Sektion 14.2 — SEPA Direct Debit
      { feld: '► 14.2 — SEPA Direct Debit / Prélèvement SEPA' },
      { feld: 'SDD Core / Prélèvement SEPA Core', experte: 'pain.008.001.02. Mandatsverwaltung in SAP (MndtId + CI). FRST: D-5, RCUR: D-2. Rückgabefrist: 8 Wochen autorisiert, 13 Monate unautorisiert.', einsteiger: 'Lastschrift für Privat- und Firmenkunden.', praxis: 'SAP Zahlungsmethode "D". CI bei Banque de France beantragen.' },
      { feld: 'SDD B2B / Prélèvement SEPA B2B', experte: 'pain.008.001.02 mit SeqTp B2B. FRST/RCUR: D-1. Keine Rückgabe durch Zahler. Bank muss Mandat vorab bestätigen.', einsteiger: 'Firmenlastschrift — keine Widerspruchsmöglichkeit.', praxis: 'SAP Zahlungsmethode "E". Bank-Mandatsbestätigung vor erstem Einzug.' },
      { feld: 'Gläubiger-ID (CI / ICS) Frankreich', experte: 'Format: FR + 2 IBAN-Prüfziffern + ZZZ + 11-stellige nationale ID. In FR auch ICS (Identifiant Créancier SEPA) genannt. Beantragung bei Banque de France (oder via Hausbank). Quelle: https://www.banque-france.fr.', einsteiger: 'FR-Gläubiger-ID = ICS, bei Banque de France beantragen.', praxis: 'In FBZP + SAP BCM hinterlegen.' },

      // Sektion 14.3 — CFONB LCR / BOR
      { feld: '► 14.3 — CFONB LCR / BOR (Lettre de Change Relevé)' },
      { feld: 'LCR (Lettre de Change Relevé)', experte: 'Elektronischer Wechsel — kein physisches Papier seit den 1970er Jahren. Aussteller (Lieferant) zieht über Hausbank ein, Bank reicht im CORE-FR-System ein. Zahlungsziel: 30-90 Tage üblich. Format: CFONB 80-Zeichen-Satzformat ODER CFONB XML (modernere Variante). Sehr verbreitet in Textil, Bau, Großhandel. Quelle: https://www.cfonb.org.', einsteiger: 'Elektronischer Wechsel — Lieferant zieht via Bank ein.', praxis: 'SAP: CFONB LCR DMEE über Add-On (Serrala, Hanse Orga). Mandatsverwaltung im Lieferantenstamm.' },
      { feld: 'BOR (Billet à Ordre Relevé)', experte: 'Umgekehrt zu LCR: Schuldner stellt BOR aus und bietet der Bank an. Weniger verbreitet als LCR. Format: CFONB 80-Zeichen ähnlich LCR. Diskontierung beim Lieferanten möglich.', einsteiger: 'BOR = umgekehrte LCR — Schuldner gibt Schuldversprechen.', praxis: 'Identisches Add-On wie LCR. Volumen geringer.' },
      { feld: 'TIP (Titre Interbancaire de Paiement)', experte: 'Ähnlich Lastschrift, in Zusammenhang mit Papier-Rechnungen. Faktisch auslaufend — durch SDD ersetzt. Format: CFONB. Wird von Stadtwerken/Versicherungen historisch genutzt.', einsteiger: 'TIP = altes FR-Lastschriftformat — auslaufend.', praxis: 'Migration auf SDD priorisieren. Kein Aufwand mehr in Neuinstallationen.' },

      // Sektion 14.4 — Chèque
      { feld: '► 14.4 — Chèque' },
      { feld: 'Chèque Bancaire', experte: 'In FR weiterhin verbreitet (im Gegensatz zu DE/NL praktisch obsolet). Keine gesetzliche Scheckgebühr. Scheckbetrug ist reales Risiko — FR-Banken haben Sicherheitssysteme (FNCI — Fichier national des chèques irréguliers). Format: Papier; elektronische Verarbeitung im EIC (Échange Image Chèques).', einsteiger: 'Scheck — in FR häufiger als in DE.', praxis: 'SAP: Scheckverwaltung über F-58. EIC-Erfassung bei der Hausbank. Bei großem Volumen: Outsourcing an Dienstleister (Edenred, Yousign).' },

      // Sektion 14.5 — Factur-X / Chorus Pro / PPF (e-Invoice)
      { feld: '► 14.5 — Factur-X / Chorus Pro / PPF (e-Invoice)' },
      { feld: 'Factur-X', experte: 'Französisch-deutscher Hybrid-Standard für E-Rechnungen — funktional identisch mit deutscher ZUGFeRD. PDF/A-3 mit eingebettetem XML (CII / UN/CEFACT Cross Industry Invoice). Profile: MINIMUM, BASIC, BASIC WL, EN 16931, EXTENDED. Quelle: https://fnfe-mpe.org / https://www.factur-x.org.', einsteiger: 'Factur-X = ZUGFeRD-Equivalent in Frankreich. PDF mit eingebettetem XML.', praxis: 'SAP Document and Reporting Compliance (DRC) für FR konfigurieren. Factur-X-Profil EN 16931 für Standard, EXTENDED für volle Feldbelegung.' },
      { feld: 'Chorus Pro (B2G)', experte: 'Staatliches B2G-Portal für E-Rechnungen an öffentliche Auftraggeber. Pflicht seit 01.01.2017 (große Unternehmen) bis 01.01.2020 (alle Unternehmen). Format: XML (UBL/CII), PDF mit eingebettetem XML (Factur-X), oder strukturiertes PDF. Empfänger über SIRET + Service-Code identifiziert. Quelle: https://chorus-pro.gouv.fr.', einsteiger: 'Staatliches B2G-Portal — seit 2020 Pflicht.', praxis: 'SAP DRC versendet via Chorus Pro API. SIRET der FR-Behörden im KNA1.' },
      { feld: 'PPF (Portail Public de Facturation) / B2B-Pflicht', experte: 'Plateforme nationale de l\'État (PPF) — der Nachfolger/Erweiterung von Chorus Pro für B2B-Pflicht. Y-Modell: PPF als zentrales Portal + private PDP (Plateforme de Dématérialisation Partenaire) als zertifizierte Provider. B2B-Pflicht-Zeitplan (Stand April 2026): 01.09.2026 Empfangspflicht aller + Versandpflicht große Unternehmen + ETI; 01.09.2027 Versandpflicht KMU + Microentreprises. Format: Factur-X, UBL 2.1 oder CII. Quellen: https://www.impots.gouv.fr/portail/professionnel/facturation-electronique / https://chorus-pro.gouv.fr.', einsteiger: 'PPF = neue zentrale FR-Plattform für B2B E-Rechnung ab September 2026.', praxis: 'SAP DRC: PPF-Anbindung oder PDP-Provider auswählen (Generix, Esker, Pagero, Tradeshift, Yooz, Sage). Pilotphase nutzen für Onboarding.' },
      { feld: 'PDP (Plateforme de Dématérialisation Partenaire)', experte: 'Private zertifizierte E-Invoicing-Provider, die als Alternative zur PPF E-Rechnungen versenden/empfangen können. Zertifizierung durch DGFiP. Vorteile: Mehr Funktionalität, bessere Integration in ERP, weniger Limits als PPF. Beispiele: Generix, Esker, Pagero, Tradeshift, Yooz, Sage. Stand April 2026: über 80 PDP-Kandidaten in Zertifizierung.', einsteiger: 'PDP = privater zertifizierter E-Rechnungs-Provider als Alternative zum staatlichen Portal.', praxis: 'Bei hohem Rechnungsvolumen: PDP statt PPF wählen. SAP DRC unterstützt beide Anbindungen.' },

      // Sektion 14.6 — camt.053 / camt.054 / Cuaderno-Equivalent
      { feld: '► 14.6 — camt.053 / camt.054 (ISO 20022 Kontoauszug)' },
      { feld: 'camt.053', experte: 'Tagesauszug, ISO 20022. Version .001.02 bis .001.08 bei FR-Banken. EBICS-Auftragsart C53. Ersetzt CFONB 120 (alter Auszugsformat).', einsteiger: 'Elektronischer Kontoauszug im XML-Format.', praxis: 'SAP: FF_5 oder BAM. Posting Rules für FR-Banken. C53 via EBICS.' },
      { feld: 'camt.054', experte: 'Buchungsbenachrichtigung, Echtzeit. EBICS-Auftragsart C54. Für Virement Instantané Gutschriften.', einsteiger: 'Echtzeit-Benachrichtigung bei Kontobewegungen.', praxis: 'Real-Time-Processing in BAM.' },
      { feld: 'CFONB 120 (Legacy)', experte: 'Altes FR-Kontoauszug-Format der CFONB. Fixed-Length-Flatfile, 120 Zeichen je Satz. Wird durch camt.053 abgelöst, bei einigen Banken noch parallel ausgeliefert. Quelle: https://www.cfonb.org.', einsteiger: 'Altes FR-Kontoauszug-Format — wird durch camt.053 ersetzt.', praxis: 'SAP: Custom DMEE oder Legacy-Importer. Migration auf camt.053 priorisieren.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Stammdaten + IDs', experte: 'SIREN/SIRET aller FR-Lieferanten in LFA1 (STCD1=SIREN, STCD2=SIRET). TVA der eigenen FR-Gesellschaft in T001/OBY6 (STCEG = FR + 2 + SIREN). SIREN-Luhn-Validierung implementiert. RIB-Dokumente aller FR-Lieferanten gesammelt → IBAN abgeleitet und geprüft. Gläubiger-ID (CI/ICS) bei Banque de France beantragt (falls SDD). UBO im RBE über Infogreffe gepflegt.', einsteiger: 'Steuer- und Konto-IDs sauber pflegen, RIB → IBAN konvertieren.', praxis: 'SIREN-Luhn-Validierung als Custom-BAdI. RIB-Massenkonvertierung via Banque-de-France-Konverter.' },
      { feld: 'Pre-Go-Live: Bankanbindung', experte: 'EBICS mit FR-Hausbank (BNP / SocGen / Crédit Agricole / BPCE) konfiguriert; INI/HIA-Briefe (auf Französisch) ausgetauscht; Zertifikate aktiviert. DMEE SEPA_CT/SEPA_CT_09 + SEPA_DD konfiguriert. LCR-Anforderungen mit FR-Hausbank und Lieferanten abgeklärt; Add-On evaluiert (bei LCR-Volumen). POBO-Vereinbarung mit FR-Hausbank auf Französisch unterzeichnet.', einsteiger: 'EBICS einrichten, LCR und POBO klären.', praxis: 'EBICS 3.0 mit BNP/SocGen Standard. LCR-Add-On nur bei nachgewiesenem Volumen.' },
      { feld: 'Pre-Go-Live: Kalender + Sprache', experte: 'FR-Fabrikkalender in SCAL: 11 Feiertage inkl. 14.07, 08.05, 15.08, 01.11, 11.11. Elsass-Mosel: zusätzlich Karfreitag + 26.12. SAP-Texte in Französisch konfiguriert (SAPscript / SmartForms / Adobe Forms). Default-Sprache je Buchungskreis FR.', einsteiger: 'Feiertage und Sprache einrichten.', praxis: 'SCAL je Standort. Französisch als Default-Sprache. Elsass-Mosel separat.' },
      { feld: 'Pre-Go-Live: Compliance + e-Invoice', experte: 'Sanktionsscreening aktiv (FCM oder extern). UBO im RBE gepflegt. SAP DRC für FR konfiguriert: Factur-X-Generierung + Chorus-Pro-Versand für B2G. PPF/PDP-Provider ausgewählt für B2B-Pflicht ab 09/2026. ANSSI-Anforderungen geprüft.', einsteiger: 'Compliance + Factur-X + PPF einrichten.', praxis: 'SAP DRC für FR freischalten. Chorus Pro Test-Account. PDP-Pilot für PPF-Vorbereitung.' },
      { feld: 'Produktivsetzung', experte: 'Testübertragungen mit Bank erfolgreich (EBICS Upload + Download). pain.001 mit Bank-Testsystem validiert (SIRET im Tax-Feld bei POBO). Erster F110-Lauf. SDD FRST mit D-5 Vorlaufzeit. camt.053 (oder CFONB 120) empfangen + verbucht. LCR-Testeinreichung (falls relevant) mit CORE. Factur-X-Testrechnung an Chorus Pro Test-Empfänger.', einsteiger: 'Testlauf, erster Zahllauf, Auszug + Factur-X prüfen.', praxis: 'Checkliste: Upload → Quittung → camt.053 → Abstimmung. Chorus Pro Test mit Demo-SIRET.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update. Alle 3 Jahre: EBICS-Zertifikate. PPF B2B-Pflicht ab 01.09.2026 finalisieren — Onboarding-Pilot ab Q4 2025. LCR-Lieferanten: sukzessive auf SEPA SCT migrieren. CFONB 120 → camt.053 Migration. PSD3/CoP-Implementierung beobachten.', einsteiger: 'Wartung + PPF/Factur-X B2B-Pflicht 09/2026.', praxis: 'Q4 2025: PPF-Pilot starten. Q1 2026: PPF-Onboarding mit Zertifizierung. Q3 2026: Go-Live PPF B2B.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Frankreich (${COUNTRY_CODE}) Blocks ===`);
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
