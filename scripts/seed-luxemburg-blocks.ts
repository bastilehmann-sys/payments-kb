/**
 * Seed country_blocks for Luxembourg (LU).
 *
 * Quelle: Banque centrale du Luxembourg (BCL), Commission de Surveillance du Secteur
 * Financier (CSSF), ABBL (Association des Banques et Banquiers, Luxembourg), EPC,
 * Administration de l'enregistrement, des domaines et de la TVA (AEDT),
 * Administration des contributions directes (ACD), Plateforme nationale e-Invoicing.
 * Block-Struktur aligned with IT/CN/DE/CH template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-luxemburg-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'LU';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'LU / LUX (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 442.', einsteiger: 'Alpha-2 LU, Alpha-3 LUX.', praxis: 'SAP T005 Eintrag, Bankstamm Länderfeld.' },
      { feld: 'Währung', experte: 'EUR (€) / ISO 4217: EUR. Eurozone-Mitglied seit 01.01.1999 (physisch seit 01.01.2002). Vorgängerwährung LUF (Luxemburgischer Franc, an BEF gekoppelt).', einsteiger: 'Euro.', praxis: 'Hauswährung Buchungskreis LU.' },
      { feld: 'IBAN-Format', experte: 'LU + 2 IBAN-Prüfziffern + 3 Bankcode + 13 Kontonummer = 20 Stellen. Beispiel: LU28 0019 4006 4475 0000. Quelle: https://www.bcl.lu.', einsteiger: '20 Zeichen. 3-stelliger Bankcode + 13-stellige Kontonummer.', praxis: 'IBAN-Validierung aktiv. Bankcode-Bereiche: 002 BIL, 003 BCEE, 005 BGL BNP Paribas, 020 ING, 014 BdL, 029 Raiffeisen.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAALULLXXX. Top BICs: BIL BILLLULLXXX, Banque et Caisse d\'Épargne de l\'État (BCEE/Spuerkeess) BCEELULLXXX, BGL BNP Paribas BGLLLULLXXX, ING Luxembourg CELLLULLXXX, Banque Internationale à Luxembourg BILLLULLXXX, Banque de Luxembourg BLUXLULL, Raiffeisen RCBLLULLXXX, Quintet Private Bank KBLXLULL.', einsteiger: 'LU im BIC = Luxemburg.', praxis: 'In SAP Hausbank BIC pflegen.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) im Winter / CEST (UTC+2) im Sommer. Umstellung: letzter Sonntag März / Oktober.', einsteiger: 'Gleiche Zeitzone wie DE/AT/BE.', praxis: 'SCT Cut-off bei LU-Banken i.d.R. 15:00 CET.' },
      { feld: 'Zentralbank', experte: 'Banque centrale du Luxembourg (BCL), 2 boulevard Royal, L-2983 Luxembourg. bcl.lu. Eurosystem-Mitglied (NCB), gegründet 1998 (relativ jung). Zuständig für Statistikmeldungen, Bilanzen Banken (gemeinsam mit CSSF), Bargeldversorgung. SDD Creditor Identifier wird ebenfalls bei BCL beantragt.', einsteiger: 'Luxemburgische Notenbank.', praxis: 'Gläubiger-ID (CI) für SEPA SDD bei BCL beantragen: LU + 2 Prüfziffern + ZZZ + 11-stellige nationale ID.' },
      { feld: 'Aufsicht', experte: 'CSSF (Commission de Surveillance du Secteur Financier) — cssf.lu. Zentrale Finanzaufsicht für Banken, Investmentfonds, Wertpapierfirmen, Zahlungsdienstleister. Sehr proaktiv und international anerkannt — Schlüsselrolle für LU als Finanzplatz. CAA (Commissariat aux Assurances) — Versicherungen.', einsteiger: 'CSSF = LU-Finanzaufsicht, sehr renommiert.', praxis: 'Direkt nicht relevant für Corporates. Bei Treasury-Strukturen mit LU-Holding: CSSF-Anforderungen prüfen (z.B. SOPARFI, Securitisation Vehicle).' },
      { feld: 'Sprache / Zeichensatz', experte: 'Drei Amtssprachen: Luxemburgisch (Lëtzebuergesch — National- und Identitätssprache), Französisch (Verwaltungs- und Rechtssprache), Deutsch (Schul- und Mediensprache). De facto in Banken/Verwaltung: Französisch dominiert, Englisch als Businesssprache sehr verbreitet. UTF-8 Standard. Sonderzeichen FR (à, é, ç...) + DE (ä, ö, ü, ß) + LU (Ä, Ë, É).', einsteiger: 'Drei Amtssprachen — Französisch dominiert in Wirtschaft. Englisch sehr verbreitet.', praxis: 'SAP-Texte primär in Französisch oder Englisch. Bankverträge oft EN/FR.' },
      { feld: 'Nationale Feiertage', experte: '11 nationale Feiertage: 01.01 Neijoerschdag (Neujahr), Ostermontag (Ouschterméindeg), 01.05 Dag vun der Aarbecht (Tag der Arbeit), 09.05 Europadag (Europa-Tag — NICHT in DE!), Christi Himmelfahrt (Christi Himmelfahrtsdag), Pfingstmontag (Péngschtméindeg), 23.06 Nationalfeierdag (Nationalfeiertag — Geburtstag des Großherzogs — NICHT in DE!), 15.08 Léiffrawëschdag (Mariä Himmelfahrt), 01.11 Allerhellgen (Allerheiligen), 25.12 Chrëschtdag (1. Weihnachtstag), 26.12 Stiefesdag (2. Weihnachtstag).', einsteiger: '11 Feiertage. 09.05 Europatag und 23.06 Nationalfeiertag sind in DE keine Feiertage.', praxis: 'SAP SCAL: LU-Fabrikkalender mit allen 11 Feiertagen. 23.06 (Nationalfeiertag) und 09.05 (Europatag) sind die DE-Template-Stolpersteine.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. EUR 90 Mrd. (klein, aber höchstes BIP/Kopf weltweit). Hauptindustrien: Finanzdienstleistungen (Banken, Investmentfonds — 2. größter Fondsstandort weltweit nach USA, größter EU-weit), Versicherungen, Stahl (ArcelorMittal, früher Arbed), Logistik, Raumfahrt (SES — Satellitenkommunikation). Über 25.000 Investmentfonds in LU registriert. Sehr internationale Belegschaft (ca. 50% Grenzgänger aus FR/DE/BE). Holding-Strukturen (SOPARFI) sehr verbreitet — wichtiger Standort für Treasury-Zentralen multinationaler Konzerne.', einsteiger: 'Klein, aber Finanzplatz #2 für Investmentfonds. Holding-Standort für viele MNCs.', praxis: 'Bei IHB-Strukturen: LU als Holding ist Klassiker (SOPARFI). Steuerliche und treasurytechnische Vorteile (kein FX-Risiko EUR, gutes DBA-Netz, Tax-Ruling möglich).' },
      { feld: 'Hauptbanken', experte: 'BCEE (Banque et Caisse d\'Épargne de l\'État, "Spuerkeess", BCEELULLXXX) — staatliche Sparkasse, größte LU-Bank im Retail. BIL (Banque Internationale à Luxembourg, BILLLULLXXX) — älteste Privatbank LU. BGL BNP Paribas (BGLLLULLXXX) — Teil BNP Paribas-Gruppe, Marktführer Corporate. ING Luxembourg (CELLLULLXXX) — Teil ING-Gruppe. Banque de Luxembourg (BLUXLULL) — Privatbank. Raiffeisen (RCBLLULLXXX) — Genossenschaftsbank. Quintet Private Bank (KBLXLULL) — ehemals KBL European Private Bankers. Plus zahlreiche internationale Banken mit LU-Niederlassung (Deutsche Bank, JPMorgan, State Street, Citi). Bankenverband: ABBL (Association des Banques et Banquiers, Luxembourg) — abbl.lu.', einsteiger: 'Big 4: BCEE/Spuerkeess, BIL, BGL BNP Paribas, ING Luxembourg.', praxis: 'BGL BNP Paribas + ING Luxembourg für Corporate Treasury. BCEE für staatliche/kommunale Verbindungen. State Street + JPMorgan LU für Investment-Fonds.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'PSD2 — Loi du 20 mai 2011', experte: 'PSD2-Umsetzung in LU durch Loi du 20 mai 2011 sur les services de paiement (modifié zur PSD2-Anpassung 2018). Aufsicht: CSSF. SCA vollständig umgesetzt. POBO ist zulässig — bei LU als IHB-Standort weit verbreitet. CSSF stellt klare Leitlinien für POBO/COBO-Strukturen. PSD3 (2026/2027): Confirmation of Payee in Vorbereitung. Quelle: https://www.legilux.public.lu.', einsteiger: 'LU-Zahlungsdienstegesetz = PSD2. POBO sehr etabliert.', praxis: 'B2B-SCA-Ausnahme schriftlich. POBO-Rider Standardvertrag bei BGL/ING LU verfügbar.' },
      { feld: 'AML — Loi du 12 novembre 2004', experte: 'Loi du 12 novembre 2004 relative à la lutte contre le blanchiment et contre le financement du terrorisme (LBC/FT), mehrfach novelliert (zuletzt 2023). Strenge AML-Aufsicht durch CSSF — LU war historisch in FATF-Kritik (Bankgeheimnis), heute komplett konform. FIU: Cellule de Renseignement Financier (CRF) — beim Procureur d\'État. UBO-Register: Registre des bénéficiaires effectifs (RBE) beim Luxembourg Business Registers (LBR) seit 2019. Bargeldobergrenze: EUR 10.000 (allgemein). Quellen: https://www.legilux.public.lu / https://www.lbr.lu.', einsteiger: 'LU-AML-Gesetz, sehr strikte CSSF-Aufsicht.', praxis: 'UBO im RBE über LBR pflegen. Sanktionsscreening via SAP FCM. Bei IHB-Strukturen: dokumentierte Substance-Anforderungen.' },
      { feld: 'GDPR — CNPD / Loi modifiée du 1er août 2018', experte: 'Loi du 1er août 2018 relative à la protection des personnes physiques à l\'égard du traitement des données à caractère personnel — DSGVO-Umsetzung. Aufsicht: CNPD (Commission nationale pour la protection des données) — cnpd.public.lu. Aufbewahrungsfristen: 10 Jahre für Buchhaltung (Code de commerce), Steuer ebenso (Loi générale des impôts). Quelle: https://www.legilux.public.lu.', einsteiger: 'CNPD = LU-Datenschutzbehörde.', praxis: 'Zahlungsbelege 10 Jahre archivieren.' },
      { feld: 'SEPA-Verordnung (EU 260/2012)', experte: 'Vollständig umgesetzt seit 01.02.2014. Vorgängerformate (proprietäre LU-Bankformate) durch SEPA SCT/SDD abgelöst. Stand April 2026: SCT ✓, SCT Inst ✓, SDD Core/B2B ✓.', einsteiger: 'SEPA läuft vollständig.', praxis: 'Standard SEPA-Setup wie DE.' },
      { feld: 'SEPA Instant (EU 2024/886)', experte: 'LU-Banken: Empfangspflicht seit Oktober 2025, Sendepflicht seit Juli 2025. Preisparität SCT/SCT Inst seit Oktober 2025. Limit EUR 100.000. Alle LU-Großbanken (BCEE, BIL, BGL BNP, ING LU) vollständig.', einsteiger: 'Sofortüberweisungen Pflicht und kostenlos in LU.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },
      { feld: 'DORA / NIS2', experte: 'DORA direkt anwendbar ab 17.01.2025 — CSSF besonders aktiv für LU-Finanzplatz. NIS2-Umsetzung: Loi du 24 juillet 2024 portant transposition de la directive NIS2. Aufsicht: ANSSI Luxembourg — ansil.lu (nicht zu verwechseln mit ANSSI Frankreich). Für Finanzsektor: CSSF koordiniert. Quellen: DORA https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022R2554, NIS2 https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2555.', einsteiger: 'EU-Cyber-Regeln in LU umgesetzt. CSSF aktiv für Finanzsektor.', praxis: 'BCP für LU-Bankverbindungen dokumentieren. EBICS-Zertifikate überwachen.' },
      { feld: 'e-Invoice — Loi du 13 décembre 2021 / Plateforme nationale', experte: 'B2G-Pflicht seit 18.05.2022 (kleine Unternehmen) bis 18.03.2023 (alle Unternehmen) — Loi du 13 décembre 2021 portant transposition de la directive 2014/55/UE. Plateforme nationale für e-Invoicing: Peppol-basierte Infrastruktur. Format: Peppol BIS Billing 3.0 (UBL 2.1). LU ist OpenPeppol Authority-Mitglied. Empfänger über Peppol-ID identifiziert. B2B: keine staatliche Pflicht (Stand April 2026); Markt nutzt Peppol freiwillig zunehmend. Quellen: https://efacture.public.lu / https://docs.peppol.eu/poacc/billing/3.0/.', einsteiger: 'B2G E-Rechnung via Peppol seit 2022/2023 Pflicht.', praxis: 'SAP Document and Reporting Compliance (DRC) für LU. Peppol Access Point auswählen. Peppol-IDs der LU-Behörden im KNA1.' },
      { feld: 'Steuer-IDs Luxemburg', experte: 'Numéro d\'identification de TVA: LU + 8 Stellen — EU-USt-ID. Numéro d\'identification fiscale (matricule): 11 Stellen für Personen, 11 oder 13 Stellen für Unternehmen — Steuer-ID der ACD. RCS-Nummer (Registre de Commerce et des Sociétés): B + 6-stellig — Handelsregisternummer beim LBR. Numéro d\'identification national (CIIN): 13 Stellen — nur natürliche Personen. Quellen: https://impotsdirects.public.lu / https://www.lbr.lu / https://aedt.public.lu.', einsteiger: 'TVA = LU + 8 Stellen (EU-USt-ID). Matricule = LU-Steuer-ID. RCS = Handelsregister.', praxis: 'SAP LFA1: STCD1 = Matricule, STCEG = TVA-Nummer (LU + 8). T001/OBY6: STCEG der eigenen LU-Gesellschaft. RCS-Nummer als Custom-Feld in LFB1.' },
      { feld: 'Withholding Tax', experte: 'Standard-Quellensteuer: 15% auf Dividenden (Art. 146 Loi modifiée du 4 décembre 1967). EU-Mutter-Tochter-RL umgesetzt — bei intra-EU-Konzernzahlungen i.d.R. 0%. EU-Zins-/Lizenz-RL ebenfalls umgesetzt. Quellensteuer auf Zinsen und Lizenzen an Nicht-EU: 0% (kein nationaler Quellensteuersatz auf Zinsen/Lizenzen, eine LU-Besonderheit, die LU für IP-Holding-Strukturen attraktiv macht — aber: ATAD und Pillar Two greifen). DBA-Reduktion möglich. Quelle: https://impotsdirects.public.lu.', einsteiger: '15% auf Dividenden, 0% auf Zinsen/Lizenzen — LU sehr Treasury-freundlich.', praxis: 'SAP Withholding Tax Codes in OBYZ. Bei Tax-Strukturen: ATAD-Compliance prüfen, Pillar Two ab 2024 Realität.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'TARGET2 / T2', experte: 'RTGS-System der EZB. EUR-Großbetragszahlungen in Echtzeit. BCL als T2-Teilnehmer. Da LU keine eigene Retail-Clearing-Infrastruktur hat (zu klein), läuft fast alles über T2 oder STEP2.', einsteiger: 'Europäisches Echtzeit-Großbetragssystem. In LU dominantes System.', praxis: 'T2 URGP Cut-off 17:00 CET.' },
      { feld: 'STEP2 (EBA Clearing)', experte: 'Paneuropäisches ACH/DNS für SEPA. Alle LU-Banken Teilnehmer. LU hat keine eigene nationale Clearing-Infrastruktur — alle SEPA-Inlandszahlungen laufen über STEP2.', einsteiger: 'Europäisches Massenzahlungssystem — in LU der Standard auch für Inlandszahlungen.', praxis: 'Standard für F110-Zahlläufe.' },
      { feld: 'TIPS', experte: 'EZB Instant-RTGS für SCT Inst. EUR, 24/7/365. Limit EUR 100.000. Alle LU-Großbanken angebunden.', einsteiger: 'EU-weites Instant-Payment-System.', praxis: 'SAP BCM: SvcLvl INST.' },
      { feld: 'Top Banken', experte: 'BCEE/Spuerkeess (BCEELULLXXX), BIL (BILLLULLXXX), BGL BNP Paribas (BGLLLULLXXX), ING Luxembourg (CELLLULLXXX), Banque de Luxembourg (BLUXLULL), Raiffeisen (RCBLLULLXXX), Quintet (KBLXLULL). Plus zahlreiche internationale Banken: Deutsche Bank LU, JPMorgan LU, State Street LU (Fonds-Custodian), Citi LU. Bankenverband: ABBL.', einsteiger: 'Big 4 lokal: BCEE, BIL, BGL BNP, ING LU. Plus viele internationale Banken.', praxis: 'BGL BNP + ING LU für Corporate Treasury. State Street/JPMorgan LU für Fonds-relatierte Strukturen.' },
      { feld: 'EBICS in LU', experte: 'EBICS 3.0 von BGL BNP Paribas, ING LU, BCEE, BIL unterstützt. EBICS in LU verbreitet, aber nicht so dominant wie in DE — viele LU-Banken bieten alternative APIs/H2H. SWIFT FileAct sehr verbreitet bei multinationalen Konzernen mit LU-Holding.', einsteiger: 'EBICS verbreitet, SWIFT FileAct ebenfalls häufig.', praxis: 'EBICS 3.0 mit BGL BNP/ING LU. SWIFT FileAct für globale Konzern-Treasury.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SEPA SCT Standard: 15:00 CET, Valuta D+1. SCT URGP via T2: 17:00 CET, Valuta D. SCT Instant: 24/7, sofort. SDD CORE FRST: D-5. SDD CORE RCUR: D-2. SDD B2B: D-1.', einsteiger: 'Standard SEPA-Cut-offs.', praxis: 'F110-Zahllauf bis 13:00 CET.' },
      { feld: 'LU als Treasury Hub', experte: 'LU besonders für Multi-Currency-Treasury attraktiv: gutes Bankennetz, viele Niederlassungen internationaler Banken, gutes DBA-Netz, neutrale Position zwischen DE/FR/BE. Notional Pooling und Cash Pooling sehr etabliert. SOPARFI-Strukturen (Société de Participation Financière) als Holding-Klassiker. Securitisation Vehicles und SICAV-/SICAR-Strukturen für Investments.', einsteiger: 'LU = Treasury-Hub mit gutem Bankennetz und DBA-Netz.', praxis: 'Bei IHB-Design: LU als ersten Kandidat prüfen — besonders wenn Multi-Currency oder IP-Holding relevant. Lokales Konto i.d.R. Pflicht für Substance-Anforderungen.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'FBZP — Zahlungsmethodenkonfig', experte: 'Identisch DE für SEPA: "B"/"T" SEPA CT (pain.001.001.03/.09), "D" SEPA SDD Core, "E" SDD B2B. CI bei BCL beantragen. Bei POBO: TVA der zahlenden LU-Gesellschaft im pain.001.', einsteiger: 'LU-FBZP funktioniert wie DE.', praxis: 'CI bei BCL beantragen. DE-FBZP-Vorlage 1:1 übernehmen.' },
      { feld: 'TVA / Matricule in SAP', experte: 'LFA1/KNA1: STCD1 = Matricule (11/13-stellig), STCEG = TVA-Nummer (LU + 8). T001/OBY6: STCEG der eigenen LU-Gesellschaft. RCS-Nummer als Custom-Feld in LFB1. Custom Validation: TVA-Format prüfen (LU + 8 Ziffern, Modulo-89). Pain.001 bei POBO: Tax/Dbtr/TaxId = TVA der zahlenden LU-Gesellschaft.', einsteiger: 'TVA, Matricule, RCS im Stamm pflegen. TVA-Validierung empfohlen.', praxis: 'TVA-Format-Validierung als Custom-Funktion. VIES-Online-Prüfung.' },
      { feld: 'Bankkanäle', experte: 'EBICS 3.0 bei BGL BNP, ING LU, BCEE, BIL. SWIFT FileAct sehr verbreitet — viele LU-Konzerne nutzen FileAct als globalen Standard. Bei internationalen Banken (JPMorgan, State Street): jeweilige Custom-APIs/H2H.', einsteiger: 'EBICS oder SWIFT FileAct — beide verbreitet.', praxis: 'EBICS 3.0 mit BGL BNP/ING LU für SEPA. FileAct für multi-currency und globale Konzern-Treasury.' },
      { feld: 'Mehrsprachige Korrespondenz', experte: 'LU-Lieferanten und Banken bevorzugen Französisch oder Englisch. Deutsch im Geschäftsleben weniger üblich (im Gegensatz zur Schul-/Mediensprache). SAP-Texte/Formulare in FR/EN konfigurieren.', einsteiger: 'LU-Korrespondenz auf Französisch oder Englisch.', praxis: 'Default-Sprache je Buchungskreis FR oder EN. Form-Varianten ggf. mehrsprachig.' },
      { feld: 'Typische Projektfehler LU', experte: '1) 23.06 (Nationalfeiertag) und 09.05 (Europatag) im Kalender vergessen. 2) DE-Sprache für LU-Korrespondenz statt FR/EN. 3) RCS-Nummer nicht gepflegt — wird für LU-Vertragsunterlagen benötigt. 4) UBO im RBE vergessen → CSSF-Strafen. 5) TVA-Format ohne "LU"-Präfix erfasst → VIES-Validierung scheitert. 6) Bei IHB-Strukturen: Substance-Anforderungen unterschätzt (lokales Konto, Personal, Räumlichkeiten).', einsteiger: 'Häufige Fehler bei LU-Rollouts.', praxis: 'Checkliste in Pre-Go-Live. UBO-Eintrag rechtzeitig.' },
      { feld: 'IHB / POBO LU — Klassiker', experte: 'LU ist der EU-Holding-Standort schlechthin. SOPARFI-Strukturen sehr verbreitet. Vorteile für Treasury: gutes Bankennetz, exzellentes DBA-Netz, neutrale Position, Multi-Currency-Banking. POBO/COBO sehr etabliert — alle Großbanken bieten Standard-POBO-Verträge. UltmtDbtr in pain.001: TVA der LU-Tochter bei POBO. Wichtig: Substance-Anforderungen (ATAD-3 ab 2024) — lokales Konto, qualifiziertes Personal, eigene Räumlichkeiten dokumentieren. Pillar Two (15% Mindeststeuer) seit 2024 Realität.', einsteiger: 'LU = klassischer IHB-Standort. SOPARFI-Strukturen Standard.', praxis: 'Bei IHB-Design LU evaluieren. Steuerberater-Strukturberatung (Loyens & Loeff, Arendt, EY LU) frühzeitig. Substance-Dokumentation kritisch.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.03 / .09 (SEPA SCT)', experte: 'Standard für alle LU-Inlands- und SEPA-Zahlungen. Alle LU-Großbanken akzeptieren beide Versionen. .09 empfohlen für Neuinstallationen.', einsteiger: 'Das Standard-Format für Überweisungen in Luxemburg und Europa.', praxis: 'SAP DMEE SEPA_CT (.03) oder SEPA_CT_09 (.09).' },

      // Sektion 17.1 — SEPA Credit Transfer
      { feld: '► 17.1 — SEPA Credit Transfer (SCT)' },
      { feld: 'Format', experte: 'pain.001.001.03 oder pain.001.001.09. SvcLvl SEPA / URGP, ChrgBr SLEV. Quelle: https://www.europeanpaymentscouncil.eu/document-library — EPC SCT IG.', einsteiger: 'XML-Datei für SEPA-Überweisungen — identisch DE.', praxis: 'SAP DMEE SEPA_CT oder SEPA_CT_09.' },
      { feld: 'EBICS-Auftragsart', experte: 'CCT (Customer Credit Transfer) für pain.001 Upload. HAC für Quittung. C53/C52 für Kontoauszüge. EBICS 3.0 bei allen LU-Großbanken.', einsteiger: 'CCT = Überweisung hochladen via EBICS.', praxis: 'FIEB: BTF CCT konfigurieren.' },
      { feld: 'SCT Instant', experte: 'Gleiche pain.001, SvcLvl INST. Max EUR 100.000. LU: alle Großbanken vollständig.', einsteiger: 'Sofortüberweisung.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },

      // Sektion 17.2 — SEPA Direct Debit
      { feld: '► 17.2 — SEPA Direct Debit (SDD)' },
      { feld: 'SDD Core', experte: 'pain.008.001.02. Mandatsverwaltung in SAP (MndtId + CI). FRST: D-5, RCUR: D-2.', einsteiger: 'Lastschrift für Privat- und Firmenkunden.', praxis: 'SAP Zahlungsmethode "D". CI bei BCL beantragen.' },
      { feld: 'SDD B2B', experte: 'pain.008.001.02 mit SeqTp B2B. FRST/RCUR: D-1. Keine Rückgabe durch Zahler.', einsteiger: 'Firmenlastschrift — keine Widerspruchsmöglichkeit.', praxis: 'SAP Zahlungsmethode "E". Bank-Mandatsbestätigung.' },
      { feld: 'Gläubiger-ID (CI) Luxemburg', experte: 'Format: LU + 2 IBAN-Prüfziffern + ZZZ + 11-stellige nationale ID. Beantragung bei BCL via https://www.bcl.lu.', einsteiger: 'LU-Gläubiger-ID, bei BCL beantragen.', praxis: 'In FBZP + SAP BCM hinterlegen.' },

      // Sektion 17.3 — Peppol BIS Billing 3.0 (e-Invoice)
      { feld: '► 17.3 — Peppol BIS Billing 3.0 (e-Invoice)' },
      { feld: 'Plateforme nationale e-Invoicing', experte: 'Peppol-basierte staatliche Infrastruktur für e-Invoicing. Pflicht für alle Lieferanten an LU-öffentliche Auftraggeber seit 18.03.2023 (Loi du 13 décembre 2021). Empfänger über Peppol-Participant-ID identifiziert. Plattform betrieben vom Centre des technologies de l\'information de l\'État (CTIE). Quelle: https://efacture.public.lu.', einsteiger: 'LU-Pflichtkanal für B2G-Rechnungen via Peppol.', praxis: 'SAP DRC + Peppol Access Point. Empfänger-Peppol-IDs (Format 0203:xxx oder 9938:xxx) im KNA1.' },
      { feld: 'Peppol BIS Billing 3.0', experte: 'OpenPeppol-Spezifikation: UBL 2.1 nach EN 16931. LU ist OpenPeppol Authority-Mitglied (CTIE). Profile: P3 (Invoice/CreditNote). Quelle: https://docs.peppol.eu/poacc/billing/3.0/.', einsteiger: 'EU-Standard für E-Rechnungen.', praxis: 'SAP Document and Reporting Compliance (DRC) für LU konfigurieren.' },

      // Sektion 17.4 — camt.053 / camt.054
      { feld: '► 17.4 — camt.053 / camt.054 (ISO 20022 Kontoauszug)' },
      { feld: 'camt.053', experte: 'Tagesauszug, ISO 20022. Version .001.02 bis .001.08 bei LU-Banken. EBICS-Auftragsart C53. Bei multinationalen Konzernen mit LU-Holding und Konten in mehreren Banken: camt.053 von allen Banken konsolidieren.', einsteiger: 'Elektronischer Kontoauszug im XML-Format.', praxis: 'SAP: FF_5 oder BAM. Posting Rules für LU-Banken.' },
      { feld: 'camt.054', experte: 'Buchungsbenachrichtigung, Echtzeit. EBICS-Auftragsart C54.', einsteiger: 'Echtzeit-Benachrichtigung.', praxis: 'Real-Time-Processing in BAM aktivieren.' },
      { feld: 'camt.052', experte: 'Intraday-Kontoauszug. EBICS-Auftragsart C52. Für Liquiditätsmonitoring — bei IHB-Strukturen besonders wichtig.', einsteiger: 'Untertägiger Kontostand.', praxis: 'Cash-Forecasting in SAP Treasury — bei LU-IHB Standard.' },

      // Sektion 17.5 — SWIFT FileAct
      { feld: '► 17.5 — SWIFT FileAct (Cross-Border)' },
      { feld: 'SWIFT FileAct', experte: 'In LU sehr verbreitet bei multinationalen Konzern-Treasuries. Erlaubt Multi-Currency-Cross-Border-Zahlungen via pacs.008 (CBPR+). Bei Banken wie JPMorgan LU, Citi LU, State Street LU oft Standard-Channel. Quelle: https://www.swift.com/standards/iso-20022.', einsteiger: 'SWIFT FileAct = globaler Bankkanal — in LU besonders bei Konzern-Treasury verbreitet.', praxis: 'SAP BCM für SWIFT FileAct konfigurieren. CBPR+ pacs.008 für ISO-20022-Cross-Border.' },
      { feld: 'pacs.008 (CBPR+)', experte: 'Cross-Border Payments and Reporting Plus — SWIFT-Initiative seit November 2025 (MT103-Ablösung). pacs.008.001.08 (CBPR+ Profile). LU als internationaler Finanzplatz: hohe Bedeutung.', einsteiger: 'pacs.008 = neuer SWIFT-Standard für internationale Zahlungen.', praxis: 'SAP DMEE: PACS_008 für CBPR+. Migration MT103 → pacs.008 vor November 2025 abschließen.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Stammdaten + IDs', experte: 'TVA (LU + 8) und Matricule aller LU-Lieferanten in LFA1 (STCEG, STCD1). TVA der eigenen LU-Gesellschaft in T001/OBY6. RCS-Nummer als Custom-Feld. TVA-Format-Validierung implementiert. Gläubiger-ID (CI) bei BCL beantragt (falls SDD). UBO im RBE über LBR gepflegt. Bei IHB-Strukturen: Substance-Dokumentation (lokales Konto, Personal, Räumlichkeiten).', einsteiger: 'Steuer-IDs + UBO sauber pflegen + Substance dokumentieren.', praxis: 'TVA-Validierung als Custom-BAdI. RBE-Eintrag rechtzeitig.' },
      { feld: 'Pre-Go-Live: Bankanbindung', experte: 'EBICS mit LU-Hausbank (BGL BNP / ING LU / BCEE / BIL) konfiguriert; INI/HIA-Briefe ausgetauscht; Zertifikate aktiviert. SWIFT FileAct für globale Konzern-Treasury evaluiert. DMEE SEPA_CT/SEPA_CT_09 + SEPA_DD konfiguriert.', einsteiger: 'EBICS oder SWIFT einrichten.', praxis: 'EBICS 3.0 Standard. FileAct bei multinationalen Strukturen.' },
      { feld: 'Pre-Go-Live: Kalender + Sprache', experte: 'LU-Fabrikkalender in SCAL: 11 nationale Feiertage inkl. 09.05 (Europatag), 23.06 (Nationalfeiertag), 15.08, 01.11, 26.12. SAP-Texte in Französisch oder Englisch konfiguriert (Deutsch im Geschäftsleben weniger üblich).', einsteiger: 'Feiertage und Sprache einrichten.', praxis: 'SCAL jährlich Dezember aktualisieren. FR oder EN als Default-Sprache.' },
      { feld: 'Pre-Go-Live: Compliance + e-Invoice', experte: 'Sanktionsscreening aktiv. UBO im RBE gepflegt. SAP DRC für LU konfiguriert: Peppol BIS Billing 3.0 für B2G via Plateforme nationale. Peppol Access Point ausgewählt. CSSF-Anforderungen bei Treasury-Strukturen geprüft (DORA, Substance, Pillar Two).', einsteiger: 'Compliance + Peppol einrichten.', praxis: 'SAP DRC für LU. Peppol Access Point. Empfänger-Peppol-IDs im Stamm.' },
      { feld: 'Produktivsetzung', experte: 'Testübertragungen mit Bank erfolgreich (EBICS Upload + Download). pain.001 mit Bank-Testsystem validiert (TVA im Tax-Feld bei POBO). Erster F110-Lauf. SDD FRST mit D-5 Vorlaufzeit. camt.053 empfangen + verbucht. Peppol-Testrechnung an Plateforme nationale gesendet.', einsteiger: 'Testlauf, erster Zahllauf, Auszug + Peppol prüfen.', praxis: 'Checkliste: Upload → Quittung → camt.053 → Abstimmung. Peppol-Test mit Demo-ID.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update. Alle 3 Jahre: EBICS-Zertifikate. UBO-Eintrag jährlich aktualisieren. Bei IHB-Strukturen: Substance-Dokumentation jährlich auffrischen, Pillar Two Reporting (ab 2024). PSD3/CoP-Implementierung beobachten. Tax-Ruling alle 5 Jahre erneuern.', einsteiger: 'Wartung + Substance + Pillar Two.', praxis: 'Q4 jeden Jahres: SCAL + UBO + Substance-Review. Q1 Pillar Two Reporting.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Luxemburg (${COUNTRY_CODE}) Blocks ===`);
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
