/**
 * Seed country_blocks for Spain (ES).
 *
 * Quelle: content/expansion/laender/es.md, Banco de España, Iberpay, EPC,
 * Bizum S.L., AEAT FacturaE Specification, Ley Crea y Crece (Ley 18/2022).
 * Block-Struktur aligned with IT/CN/DE/CH template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-spanien-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'ES';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'ES / ESP (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 724.', einsteiger: 'Alpha-2 ES, Alpha-3 ESP.', praxis: 'SAP T005 Eintrag, Bankstamm Länderfeld.' },
      { feld: 'Währung', experte: 'EUR (€) / ISO 4217: EUR. Eurozone-Mitglied seit 01.01.1999 (physisch seit 01.01.2002).', einsteiger: 'Euro.', praxis: 'Hauswährung Buchungskreis ES.' },
      { feld: 'IBAN-Format', experte: 'ES + 2 IBAN-Prüfziffern + 4 Bankcode + 4 Filialcode + 2 nationale CCC-Prüfziffern + 10 Kontonummer = 24 Stellen. CCC (Código Cuenta Cliente) ist die historische ES-Kontonummer und ist in die IBAN integriert. CCC-Prüfziffer: Position 1 prüft Bankcode+Filialcode (MOD 11), Position 2 prüft Kontonummer (MOD 11). Beispiel: ES91 2100 0418 4502 0005 1332. Quelle: https://www.bde.es.', einsteiger: '24 Zeichen. Enthält die alte spanische Kontonummer "CCC" mit zwei nationalen Prüfziffern.', praxis: 'IBAN-Validierung aktiv. Bei alten ES-Lieferantendaten im CCC-Format: Banco-de-España-Konverter nutzen.' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAAESBBXXX. Top BICs: CaixaBank CAIXESBBXXX, Santander BSCHESMMXXX, BBVA BBVAESMMXXX, Sabadell BSABESBBXXX, Bankinter BKBKESMMXXX.', einsteiger: 'ES im BIC = Spanien.', praxis: 'In SAP Hausbank BIC pflegen.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) im Winter / CEST (UTC+2) im Sommer. Trotz geografischer Lage westlich des Greenwich-Meridians nutzt ES seit 1942 CET (politische Entscheidung). Kanarische Inseln: WET/WEST (UTC+0/+1).', einsteiger: 'Gleiche Zeitzone wie DE — trotz westlicher Lage.', praxis: 'SCT Cut-off bei ES-Banken i.d.R. 15:00 CET. Kanaren: 1 Stunde früher.' },
      { feld: 'Zentralbank', experte: 'Banco de España, Calle Alcalá 48, 28014 Madrid. bde.es. Eurosystem-Mitglied (NCB). Zuständig für Bankenaufsicht (gemeinsam mit ECB-SSM für systemrelevante), SDD Creditor Identifier, AML-Aufsicht (gemeinsam mit SEPBLAC).', einsteiger: 'Spanische Notenbank.', praxis: 'Gläubiger-ID (CI) für SEPA SDD bei Banco de España beantragen: ES + 2 Prüfziffern + ZZZ + 11-stellige nationale ID.' },
      { feld: 'Aufsicht', experte: 'Banco de España (Banken, Solvabilität). CNMV (Comisión Nacional del Mercado de Valores) — Kapitalmarkt. SEPBLAC (Servicio Ejecutivo de la Comisión de Prevención del Blanqueo de Capitales) — FIU. SEPBLAC: sepblac.es, CNMV: cnmv.es.', einsteiger: 'Banco de España für Banken, CNMV für Kapitalmarkt, SEPBLAC für AML.', praxis: 'Verdachtsmeldungen an SEPBLAC.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Castellano (Kastilisch / Spanisch) als Hauptsprache. Regional kooffiziell: Catalán, Euskera (Baskisch), Gallego (Galicisch), Valenciano. UTF-8 Standard. Sonderzeichen: á, é, í, ó, ú, ñ, ¿, ¡. ISO 8859-1 (Latin-1) kompatibel. SWIFT MT103: ñ → n (Standard ASCII-Konvertierung).', einsteiger: 'Spanisch primär, regional auch Katalanisch/Baskisch.', praxis: 'SAP DMEE: UTF-8 Encoding. Bei MT103 ñ-Konvertierung beachten.' },
      { feld: 'Nationale Feiertage', experte: '10 nationale Feiertage: 01.01 Año Nuevo, 06.01 Epifanía del Señor (Dreikönigstag — wichtig!), Karfreitag (Viernes Santo, variabel), 01.05 Día del Trabajador, 15.08 Asunción de la Virgen, 12.10 Fiesta Nacional de España (Hispanidad — Nationalfeiertag), 01.11 Todos los Santos, 06.12 Día de la Constitución, 08.12 Inmaculada Concepción, 25.12 Navidad. Plus regionale Feiertage je Comunidad Autónoma (17 + 2 autonome Städte): z.B. Sant Jordi 23.04 (CAT), Diada 11.09 (CAT), San Fermín 07.07 (Navarra), Aberri Eguna (PV).', einsteiger: '10 nationale + viele regionale Feiertage. 06.01 Dreikönigstag und 12.10 Nationalfeiertag in DE unbekannt.', praxis: 'SAP SCAL: ES-Fabrikkalender muss 06.01, 15.08, 12.10, 01.11, 06.12, 08.12 enthalten — DE-Template reicht NICHT! Regionale Feiertage je Buchungskreis-Standort.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. EUR 1,5 Bio (4. größte Wirtschaft EU, 13. weltweit). Hauptindustrien: Tourismus, Automotive (SEAT, Renault Iberia), Energie (Iberdrola, Endesa, Repsol), Banken (Santander Group), Lebensmittel/Wein, Bekleidung (Inditex/Zara). Handelspartner: FR, DE, IT, PT. Lange Zahlungsziele B2B: 30-60 Tage Standard, in einigen Branchen bis 90 Tage (Ley 15/2010 begrenzt theoretisch auf 60 Tage, Praxis weicht oft ab).', einsteiger: '4. größte EU-Wirtschaft. Lange Zahlungsziele üblich.', praxis: 'Confirming-Lieferanten häufig — Frühauszahlungen über Hausbank. SAP Add-On (Serrala Confirming) bei großem Volumen.' },
      { feld: 'Hauptbanken', experte: 'CaixaBank (CAIXESBBXXX) — größte ES-Retailbank nach Bankia-Übernahme 2021. Banco Santander (BSCHESMMXXX) — internationale Großbank, exzellenter Corporate-Service. BBVA (BBVAESMMXXX) — zweitgrößte ES-Bank, sehr gute EBICS- und API-Unterstützung. Sabadell (BSABESBBXXX) — KMU-Fokus, BBVA-Fusion 2024/25 in regulatorischer Prüfung. Bankinter (BKBKESMMXXX) — Innovations-/Digitalbank. Kutxabank (BPV) — baskische Sparkasse. Ibercaja, Cajamar, Unicaja — regional.', einsteiger: 'Big 3: CaixaBank, Santander, BBVA. Plus regionale Sparkassen (Cajas).', praxis: 'BBVA hat stärksten PSD2-API-Support. CaixaBank ist Standard für ES-Mittelstand.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'PSD2 — RDL 19/2018', experte: 'PSD2-Umsetzung in ES durch Real Decreto-Ley 19/2018 vom 23. November 2018. Ergänzt durch frühere Ley 16/2009 für Zahlungsdienste. Aufsicht: Banco de España. SCA vollständig umgesetzt; B2B-Ausnahme via Bankvertrag möglich. POBO in ES zulässig — schriftliche Vereinbarung mit ES-Hausbank, AEAT (Steueramt) prüft Transaktionsstrukturen. Open Banking ES: BBVA als Vorreiter, Santander/CaixaBank solide. Quelle: https://www.boe.es (Boletín Oficial del Estado).', einsteiger: 'Spanisches Zahlungsdienstegesetz = PSD2. SCA Pflicht.', praxis: 'B2B-SCA-Ausnahme schriftlich mit ES-Hausbankverbindungen fixieren. POBO mit AEAT-Steuerberater abstimmen.' },
      { feld: 'AML — Ley 10/2010 (Anti-Blanqueo)', experte: 'Ley 10/2010 vom 28. April 2010 zur Geldwäschebekämpfung, geändert durch RDL 11/2018. Umsetzung der EU-AML-Richtlinien. FIU: SEPBLAC (Servicio Ejecutivo). UBO-Register: Registro de titulares reales beim Mercantil-Register (Handelsregister) — Pflicht. Bargeldobergrenze: EUR 1.000 für Geschäfte zwischen Unternehmern (Ley 11/2021 vom 09.07.2021, vorher EUR 2.500). Touristen aus Nicht-EU max. EUR 10.000. Quelle: https://www.boe.es.', einsteiger: 'ES-Geldwäschegesetz mit 1.000-EUR-Bargeldlimit für B2B.', praxis: 'UBO im Mercantil-Register pflegen. Sanktionsscreening über SAP FCM. ES gilt als FATF-konform.' },
      { feld: 'GDPR — LOPDGDD (Ley Orgánica 3/2018)', experte: 'Ley Orgánica 3/2018 vom 5. Dezember 2018 zum Datenschutz und zur Garantie digitaler Rechte (LOPDGDD). Ergänzt DSGVO. Aufsichtsbehörde: AEPD (Agencia Española de Protección de Datos) — aepd.es. Zahlungsdaten = personenbezogen. Aufbewahrungsfrist: 6 Jahre (Código de Comercio Art. 30) für Buchhaltung, 4 Jahre Verjährung (LGT Art. 66) für Steuer.', einsteiger: 'IBAN-Daten sind personenbezogen, AEPD ist Datenschutzbehörde.', praxis: 'Zahlungsbelege 6 Jahre archivieren. SAP-Berechtigungen für IBAN-Felder.' },
      { feld: 'SEPA-Verordnung (EU 260/2012)', experte: 'Vollständig umgesetzt seit 01.02.2014. Ehemalige ES-Inlandsformate (Cuaderno 34, 19, 43) durch SEPA SCT/SDD und ISO 20022 abgelöst. Cuaderno 43 für Kontoauszüge wird durch camt.053 ersetzt. Stand April 2026: SCT ✓, SCT Inst ✓, SDD Core/B2B ✓.', einsteiger: 'SEPA läuft vollständig. Alte Cuaderno-Formate sind abgelöst.', praxis: 'Cuaderno-43-Auszüge bei alten Bankverträgen prüfen — Migration auf camt.053.' },
      { feld: 'SEPA Instant (EU 2024/886)', experte: 'ES-Banken: Empfangspflicht seit Oktober 2025, Sendepflicht seit Juli 2025. Preisparität SCT/SCT Inst. Limit EUR 100.000. Alle ES-Großbanken (CaixaBank, Santander, BBVA, Sabadell) vollständig. Iberpay betreibt das ES-Instant-Routing zu TIPS.', einsteiger: 'Sofortüberweisungen Pflicht und kostenlos in ES.', praxis: 'SAP BCM: SvcLvl INST aktivieren. camt.054 Real-Time.' },
      { feld: 'DORA / NIS2', experte: 'DORA direkt anwendbar ab 17.01.2025. NIS2-Umsetzung in ES: Real Decreto-Ley 7/2025 vom 25. Februar 2025 zur Cybersicherheit. INCIBE (Instituto Nacional de Ciberseguridad) und CCN-CERT als Cyber-Behörden. TIBER-ES: Threat-Intelligence-based Ethical Red Teaming für systemrelevante ES-Banken. Quellen: DORA https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022R2554, NIS2 https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2555.', einsteiger: 'EU-Cyber-Regeln in ES umgesetzt. INCIBE ist Cyber-Behörde.', praxis: 'BCP für ES-Bankverbindungen dokumentieren. EBICS-Zertifikate überwachen.' },
      { feld: 'e-Invoice — Ley Crea y Crece (Ley 18/2022)', experte: 'B2B-Pflicht für E-Rechnungen: Phase 1 ab 12 Monaten nach Reglamento-Verabschiedung für große Unternehmen (Umsatz > EUR 8 Mio.); Phase 2 ab 24 Monaten für alle. Aktueller Stand April 2026: Reglamento Real Decreto wurde im Juli 2024 vom Consejo de Ministros angenommen, Inkrafttreten Phase 1 voraussichtlich 2025/2026. Format: Facturae v3.2.2 (XML, basiert auf UBL/CEN EN 16931) ODER UBL/CII (für EU-Interoperabilität). Kanal: Privates Netzwerk + offizielles Portal FACe für B2G. B2G-Pflicht (Ley 25/2013) seit 2015 bereits Realität: alle Lieferanten an öffentliche Auftraggeber müssen via FACe Facturae senden. Quellen: https://www.facturae.gob.es / https://face.gob.es.', einsteiger: 'B2G E-Rechnung seit 2015 Pflicht (Facturae via FACe). B2B-Pflicht in Umsetzung.', praxis: 'SAP DRC für ES konfigurieren. Facturae-Format generieren. FACe-Portal-Zugang für B2G einrichten.' },
      { feld: 'Steuer-IDs Spanien', experte: 'NIF (Número de Identificación Fiscal): Unternehmen 9-stellig (1 Buchstabe Rechtsform + 7 Ziffern + 1 Prüfbuchstabe), Selbständige wie DNI (8 Ziffern + 1 Buchstabe). Erstes Zeichen Unternehmen: A=AG, B=GmbH, C=Genossenschaft, D=Privat-Genossenschaft, E=Erbengemeinschaft, F=Genossenschaft, G=Vereinigung, H=Eigentümergemeinschaft, J=Bürgerliche Gesellschaft, P=Lokalkörperschaft, Q=Öffentliche Behörde, R=Religiöse Organisation, S=Staatliche Körperschaft, U=Vorübergehende Vereinigung, V=Andere Verbände, N=Nicht-residente Personen, W=Permanente Niederlassung. NIF-IVA = ES + NIF (EU-USt-ID). DNI: 8 Ziffern + Buchstabe (Privatpersonen). NIE: X/Y/Z + 7 Ziffern + Buchstabe (Ausländer). CIF: Veraltetes Synonym für NIF jur. Personen, oft noch in Sprachgebrauch. Quelle: https://www.agenciatributaria.gob.es (AEAT).', einsteiger: 'NIF = ES-Steuernummer (9-stellig mit Rechtsform-Buchstaben). NIF-IVA = EU-USt-ID.', praxis: 'SAP LFA1: STCD1 = NIF (9-stellig), STCEG = ES + NIF. T001/OBY6: STCEG der eigenen ES-Gesellschaft. Custom Validation: Modulo-23-Prüfbuchstabe für DNI/NIF natürliche Personen, Buchstabenformel für jur. Personen.' },
      { feld: 'Withholding Tax (IRPF / IS Retenciones)', experte: 'IRPF (Impuesto sobre la Renta) für Selbständige (Autónomos): 15% Standard, 7% in Anfangsjahren. IS (Impuesto sobre Sociedades): Quellensteuer auf bestimmte Zahlungen 19% (Dividenden, Zinsen — DBA-Reduktion möglich). EU-Mutter-Tochter-Richtlinie und Zins-/Lizenzgebühren-Richtlinie umgesetzt. Quelle: https://www.agenciatributaria.gob.es.', einsteiger: 'IRPF 15%/7% bei Selbständigen, IS-Quellensteuer 19% auf Dividenden/Zinsen.', praxis: 'Withholding Tax Codes in OBYZ. SAP-Funktion zur Modelo-111 (IRPF) und Modelo-216 (IS) Quartalsmeldung über DRC oder Add-On.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'SNCE (Sistema Nacional de Compensación Electrónica)', experte: 'Spanisches nationales Retail-Clearing-System für SEPA. Betreiber: Iberpay (früher CECA — Confederación Española de Cajas de Ahorros in Zahlungsverkehrsfunktion). DNS-Settlement über T2. SEPA-kompatibel; verarbeitet alle ES-SEPA-Inlandstransaktionen. Quelle: https://www.iberpay.es.', einsteiger: 'ES-Inlands-Clearing — von Iberpay betrieben.', praxis: 'Für Corporate transparent — Bank-Routing entscheidet.' },
      { feld: 'TARGET2 / T2', experte: 'RTGS-System der EZB. EUR-Großbetragszahlungen in Echtzeit. Banco de España als T2-Teilnehmer für ES.', einsteiger: 'Europäisches Echtzeit-Großbetragssystem für EUR.', praxis: 'T2 URGP Cut-off 17:00 CET. SvcLvl URGP für Express-Zahlungen.' },
      { feld: 'STEP2 (EBA Clearing)', experte: 'Paneuropäisches ACH/DNS für SEPA. Alle ES-Banken Teilnehmer. SNCE und STEP2 sind beide für ES-Zahlungen einsetzbar.', einsteiger: 'Europäisches Massenzahlungssystem.', praxis: 'Standard für F110-Zahlläufe.' },
      { feld: 'TIPS', experte: 'EZB Instant-RTGS für SCT Inst. EUR, 24/7/365. Limit EUR 100.000. Iberpay-eigenes System routet zu TIPS. Bizum nutzt SNCE/TIPS-Backend.', einsteiger: 'EU-weites Instant-Payment-System.', praxis: 'SAP BCM: SvcLvl INST.' },
      { feld: 'Bizum', experte: 'Spanisches mobiles Echtzeit-Bezahlsystem, gestartet 2016 von 27 ES-Banken gemeinsam (heute alle Großbanken). Über 26 Millionen Nutzer (April 2026) — größtes ES-Mobile-Payment. Verbindung MSISDN (Mobilnummer) → IBAN. Backend SNCE/TIPS. Limits Privat: EUR 1.000/Zahlung, EUR 2.000/Tag. Bizum Empresas: bis EUR 50.000/Zahlung. Quelle: https://bizum.es.', einsteiger: 'ES-Mobile-Payment via Mobilnummer. Killer-Feature in ES.', praxis: 'Für ES-B2C-Gesellschaften: Bizum Empresas evaluieren. SAP-Verbuchung als SEPA-Gutschrift via camt.054. Kein Standard-SAP-Connector — API-Integration über Iberpay oder Bankgateway.' },
      { feld: 'Top Banken', experte: 'CaixaBank (CAIXESBBXXX) — Marktführer Retail. Banco Santander (BSCHESMMXXX) — internationale Großbank. BBVA (BBVAESMMXXX) — Innovations-Vorreiter. Sabadell (BSABESBBXXX) — KMU-Fokus, BBVA-Fusion in Prüfung. Bankinter (BKBKESMMXXX) — Digital. Kutxabank, Ibercaja, Cajamar, Unicaja — regional. Bankenverband: AEB (Asociación Española de Banca) und CECA (Cajas).', einsteiger: 'Big 3: CaixaBank, Santander, BBVA.', praxis: 'BBVA für API-/EBICS-Vorreiter. CaixaBank Standard für ES-Mittelstand. Santander für internationale Konzerne mit Cash-Management-Produkten.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SEPA SCT Standard: 15:00 CET, Valuta D+1. SCT URGP via T2: 17:00 CET, Valuta D. SCT Instant: 24/7, sofort. SDD CORE FRST: D-5. SDD CORE RCUR: D-2. SDD B2B: D-1. Bizum Empresas: Echtzeit, sofort.', einsteiger: 'Standard SEPA-Cut-offs. Bizum Empresas in Echtzeit.', praxis: 'F110-Zahllauf bis 13:00 CET starten.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'FBZP — Zahlungsmethodenkonfig', experte: 'Identisch DE für SEPA: "B"/"T" SEPA CT (pain.001.001.03/.09), "D" SEPA SDD Core, "E" SDD B2B. Bizum: kein SAP-Standard — manuelle Prozesse oder Bank-API. CI bei Banco de España beantragen und in FBZP hinterlegen. NIF-Übermittlung: bei POBO im pain.001 Feld DbtrTaxId/UltmtDbtr.', einsteiger: 'ES-FBZP funktioniert wie DE.', praxis: 'CI bei Banco de España beantragen. NIF in pain.001 bei POBO korrekt mappen.' },
      { feld: 'NIF/CIF in SAP', experte: 'LFA1/KNA1: STCD1 = NIF (9-stellig). T001/OBY6: STCEG = ES + NIF. DMEE pain.001 bei POBO: Tax/Dbtr/TaxId = NIF der zahlenden ES-Gesellschaft. Custom Validation empfohlen: Modulo-23-Prüfbuchstabe (DNI/Selbständige), Buchstabenformel für jur. Personen.', einsteiger: 'NIF im Stamm pflegen, NIF-Prüfziffer-Validierung sinnvoll.', praxis: 'NIF-Validierungsroutine als Custom-Funktion (BAdI VALIDATE_LFA1). Bei E-Rechnung-Pflicht (Facturae) ist falscher NIF blockierend.' },
      { feld: 'CCC → IBAN Konvertierung', experte: 'Alte CCC-Kontonummern (Bankcode-Filialcode-CCC-Kontonr) aus ES-Kreditorenstamm per IBAN-Konverter migrieren. Banco de España stellt offiziellen CCC→IBAN-Konverter bereit. Häufiger Fehler: alte Stammdaten enthalten nur 20-stelligen CCC, nicht IBAN — Zahlungen scheitern. Quelle: https://www.bde.es.', einsteiger: 'Alte spanische Kontonummern in IBAN umwandeln.', praxis: 'Vor Datenmigration: ES-Kreditoren auf CCC-Format prüfen, dann massenkonvertieren. SE16N/Massenpflege.' },
      { feld: 'Bankkanäle', experte: 'EBICS: BBVA (sehr stark), CaixaBank, Santander, Sabadell. Standard für Corporate. SWIFT FileAct: Santander International, BBVA Corporate für multinationale Konzerne. H2H proprietär: einige regionale Cajas (Kutxabank). Norma 19/34/43-Format: ES-historisches Bankkanal-Format, abgelöst durch SEPA und ISO 20022.', einsteiger: 'EBICS Standard, SWIFT FileAct für internationale Konzerne.', praxis: 'EBICS 3.0 mit BBVA/CaixaBank Standard. Bei alten Cajas: Custom H2H-Connector evaluieren.' },
      { feld: 'Typische Projektfehler ES', experte: '1) 06.01 (Epifanía) und 12.10 (Hispanidad) im Kalender vergessen. 2) CCC statt IBAN in Lieferantenstamm. 3) NIF-Prüfbuchstabe nicht validiert → Probleme bei Facturae. 4) Regionale Feiertage (CAT, Baskenland) nicht je Buchungskreis. 5) Bizum bei B2C-Töchtern ignoriert. 6) Confirming-Prozess ohne SAP-Add-On — Bank zahlt früh aus, SAP zeigt noch offene Posten. 7) Modelo 347 (Jahresanzeige für Geschäftspartner > EUR 3.005,06) nicht aus SAP generiert. 8) IRPF-Quellensteuer bei Autónomos vergessen — Steueramt fordert nach.', einsteiger: 'Häufige Fehler bei ES-Rollouts.', praxis: 'Checkliste in Pre-Go-Live. Modelo 347 als jährliches Reporting via DRC.' },
      { feld: 'Confirming-Verfahren', experte: 'In ES sehr verbreitet — Bank (typisch CaixaBank, BBVA) übernimmt Verbindlichkeit des Käufers und zahlt Lieferanten frühzeitig aus. Lieferant erhält Confirming-Schreiben mit Zahlungstermin, kann optional gegen Diskont früher bezahlt werden. Buchhalterisch: Lieferant kann Confirming als Diskontiertes Wechselgeschäft verbuchen. SAP: kein Standard. Add-Ons: Serrala FS² Confirming, Hanse Orga Confirming, Serres Confirming. Quelle: https://www.aebanca.es.', einsteiger: 'Confirming = Banken-Lieferantenfinanzierung — sehr verbreitet in ES.', praxis: 'Bei großem ES-Lieferantenvolumen: Add-On evaluieren. Customer Specific Process für Confirming-Dokumente in F110/F-58 modellieren.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.03 / .09 (SEPA SCT)', experte: 'Standard für alle ES-Inlands- und SEPA-Zahlungen. Alle ES-Großbanken akzeptieren beide Versionen. .09 empfohlen für Neuinstallationen.', einsteiger: 'Das Standard-Format für Überweisungen in Spanien und Europa.', praxis: 'SAP DMEE SEPA_CT (.03) oder SEPA_CT_09 (.09). Migration auf .09 empfohlen.' },

      // Sektion 13.1 — SEPA Credit Transfer
      { feld: '► 13.1 — SEPA Credit Transfer (SCT)' },
      { feld: 'Format', experte: 'pain.001.001.03 oder pain.001.001.09. SvcLvl SEPA / URGP, ChrgBr SLEV. Bei POBO: NIF der zahlenden ES-Gesellschaft im DbtrTaxId. Quelle: https://www.europeanpaymentscouncil.eu/document-library — EPC SCT Customer-to-Bank IG.', einsteiger: 'XML-Format für SEPA-Überweisungen — identisch mit DE.', praxis: 'SAP DMEE SEPA_CT oder SEPA_CT_09. Banktest mit ES-Hausbank.' },
      { feld: 'EBICS-Auftragsart', experte: 'CCT (Customer Credit Transfer) für pain.001 Upload. HAC für Quittung. C53/C52 für Kontoauszüge. ES-Großbanken (BBVA, CaixaBank, Santander) unterstützen EBICS 3.0.', einsteiger: 'CCT = Überweisung hochladen via EBICS.', praxis: 'FIEB: BTF CCT konfigurieren.' },
      { feld: 'SCT Instant', experte: 'Gleiche pain.001, SvcLvl INST. Max EUR 100.000. ES: alle Großbanken vollständig (Empfangspflicht seit Oktober 2025).', einsteiger: 'Sofortüberweisung — gleiches Format.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },

      // Sektion 13.2 — SEPA Direct Debit
      { feld: '► 13.2 — SEPA Direct Debit (SDD)' },
      { feld: 'SDD Core', experte: 'pain.008.001.02. Mandatsverwaltung (MndtId + CI). FRST: D-5, RCUR: D-2. Rückgabefrist: 8 Wochen autorisiert, 13 Monate unautorisiert.', einsteiger: 'Lastschrift für Privat- und Firmenkunden.', praxis: 'SAP Zahlungsmethode "D". CI bei Banco de España beantragen.' },
      { feld: 'SDD B2B', experte: 'pain.008.001.02 mit SeqTp B2B. FRST/RCUR: D-1. Keine Rückgabe durch Zahler. Bank muss Mandat vorab bestätigen.', einsteiger: 'Firmenlastschrift — keine Widerspruchsmöglichkeit.', praxis: 'SAP Zahlungsmethode "E". Bank-Mandatsbestätigung vor erstem Einzug.' },
      { feld: 'Gläubiger-ID (CI) Spanien', experte: 'Format: ES + 2 Prüfziffern + ZZZ + 11-stellige nationale ID (NIF + 2 Suffix). Beantragung bei Banco de España.', einsteiger: 'ES-Gläubiger-ID für Lastschriften, Beantragung bei Banco de España.', praxis: 'In FBZP + SAP BCM hinterlegen.' },

      // Sektion 13.3 — Facturae (e-Invoice)
      { feld: '► 13.3 — Facturae (e-Invoice)' },
      { feld: 'Facturae v3.2.2', experte: 'Spanisches XML-E-Rechnungsformat. Basiert auf XAdES (XML Advanced Electronic Signatures). Pflichtfelder: NIF Aussteller/Empfänger, Steuerdetails, Rechnungspositionen, digitale Signatur. Quelle: https://www.facturae.gob.es. Schema: http://www.facturae.es/Facturae/2014/v3.2.2/Facturae.', einsteiger: 'ES-spezifisches E-Rechnungs-XML mit digitaler Signatur.', praxis: 'SAP Document and Reporting Compliance (DRC) für ES erzeugt Facturae. Digitale Signatur über Zertifikat (FNMT, Camerfirma) erforderlich.' },
      { feld: 'FACe (B2G-Portal)', experte: 'Punto General de Entrada de Facturas Electrónicas — staatliches B2G-Portal. Pflicht für alle Lieferanten an spanische öffentliche Auftraggeber seit 15.01.2015 (Ley 25/2013). Empfänger werden über DIR3-Codes (3 Codes: Oficina Contable, Órgano Gestor, Unidad Tramitadora) identifiziert. Quelle: https://face.gob.es.', einsteiger: 'FACe = staatliches Portal für B2G-Rechnungen.', praxis: 'DIR3-Codes der ES-Behörden im KNA1 Custom-Feld pflegen. SAP DRC versendet via FACe-Webservice.' },
      { feld: 'B2B E-Rechnung (Crea y Crece)', experte: 'Ley 18/2022 vom 28. September 2022 ("Crea y Crece"): B2B-E-Rechnung Pflicht. Phase 1 (12 Monate nach Reglamento): Unternehmen > EUR 8 Mio. Umsatz. Phase 2 (24 Monate): alle. Reglamento Real Decreto im Juli 2024 vom Consejo de Ministros angenommen, Inkrafttreten Phase 1 voraussichtlich 2025/2026 (Stand April 2026: Endgültiger Termin von Tribunal Constitucional und MINECO bestätigt). Format: Facturae oder Peppol BIS Billing 3.0.', einsteiger: 'B2B-E-Rechnung wird Pflicht — Übergangsphase 2025-2027.', praxis: 'SAP DRC vorbereiten, Peppol Access Point evaluieren als Alternative zu Facturae.' },

      // Sektion 13.4 — Bizum
      { feld: '► 13.4 — Bizum (Mobile Instant Payment)' },
      { feld: 'Bizum Privat (P2P)', experte: 'Mobilnummer-zu-Mobilnummer-Zahlung in Echtzeit. Limits: EUR 1.000/Zahlung, EUR 2.000/Tag. Backend SNCE/TIPS. 24/7. Quelle: https://bizum.es.', einsteiger: 'Mobile P2P-Zahlung via Mobilnummer.', praxis: 'Für Corporate B2B nicht relevant.' },
      { feld: 'Bizum Empresas (B2C)', experte: 'Corporate-Lösung: Unternehmen empfangen Bizum-Zahlungen von Konsumenten. Limit: bis EUR 50.000/Zahlung. Integration über Iberpay-API oder Bank-Gateway (CaixaBank Sign, BBVA, Santander). Use Cases: E-Commerce-Checkout, Restaurant/Café-Bezahlung, Spendensammlung.', einsteiger: 'Bizum für Unternehmen — Konsumenten zahlen via Mobilnummer ans Unternehmen.', praxis: 'Kein SAP-Standard. Verbuchung der Bizum-Eingänge als SEPA SCT Inst Gutschrift im camt.054. Bei großem Volumen: Custom-Connector zur Iberpay-API.' },

      // Sektion 13.5 — Confirming
      { feld: '► 13.5 — Confirming (Reverse Factoring)' },
      { feld: 'Confirming-Prozess', experte: 'Käufer beauftragt Bank, Lieferant zu informieren über bevorstehende Zahlung. Lieferant kann gegen Diskont (üblich 1-3%) Frühauszahlung wählen. Bank zahlt Käufer ab regulärem Fälligkeitstermin zurück. Sehr verbreitet in ES (Marktanteil Lieferantenfinanzierung > 60%). Akteure: alle ES-Großbanken (CaixaBank, BBVA, Santander, Sabadell).', einsteiger: 'Banken-finanzierte Lieferantenfrüh-Auszahlung — typisch spanisch.', praxis: 'SAP Standard: keiner. Add-Ons: Serrala FS² Confirming, Hanse Orga, Serres. Confirming-Erklärung als IDoc oder Custom-Datei an Bank.' },
      { feld: 'Confirming-Schreiben', experte: 'Bank versendet automatisierte Schreiben an Lieferanten mit Zahlungstermin und Diskontoption. Format: bankspezifisch (CSV, XML, PDF). Lieferant antwortet via Bank-Portal oder Brief.', einsteiger: 'Brief vom Auftraggeber-Bank an Lieferant über bevorstehende Zahlung.', praxis: 'Format-Mapping je Hausbank in Add-On konfigurieren.' },

      // Sektion 13.6 — camt.053 / camt.054
      { feld: '► 13.6 — camt.053 / camt.054 / Cuaderno 43' },
      { feld: 'camt.053', experte: 'Tagesauszug, ISO 20022. Version .001.02 bis .001.08 bei ES-Banken. EBICS-Auftragsart C53. Ersetzt Cuaderno 43. Quelle: https://www.iso20022.org/iso-20022-message-definitions.', einsteiger: 'Elektronischer Kontoauszug im XML-Format.', praxis: 'SAP: FF_5 oder BAM. Posting Rules für ES-Banken. C53 via EBICS.' },
      { feld: 'camt.054', experte: 'Buchungsbenachrichtigung, Echtzeit. EBICS-Auftragsart C54. Für SCT Inst und Bizum-Eingänge.', einsteiger: 'Echtzeit-Benachrichtigung bei Kontobewegungen.', praxis: 'Real-Time-Processing in BAM.' },
      { feld: 'Cuaderno 43 (Legacy)', experte: 'Historisches ES-Kontoauszug-Format der AEB (Asociación Española de Banca). Fixed-Length-Flatfile, 350 Zeichen je Satz. Wird durch camt.053 abgelöst, aber bei einigen regionalen Banken noch parallel ausgeliefert. Spezifikation: AEB Cuaderno 43.', einsteiger: 'Altes ES-Kontoauszug-Format — wird durch camt.053 ersetzt.', praxis: 'SAP: Custom DMEE oder Legacy-Importer. Migration auf camt.053 priorisieren.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Stammdaten + IDs', experte: 'NIF aller ES-Lieferanten in LFA1 (STCD1, 9-stellig). NIF-IVA der eigenen ES-Gesellschaft in T001/OBY6 (STCEG = ES + NIF). NIF-Prüfziffer-Validierung implementiert (Modulo 23 oder Buchstabenformel je Rechtsform). CCC → IBAN für alle ES-Konten konvertiert. Gläubiger-ID (CI) bei Banco de España beantragt (falls SDD).', einsteiger: 'Steuer- und Konto-IDs sauber pflegen, CCC zu IBAN konvertieren.', praxis: 'NIF-Validierung als Custom-BAdI. CCC-Massenkonvertierung über Banco-de-España-Konverter und SE16N.' },
      { feld: 'Pre-Go-Live: Bankanbindung', experte: 'EBICS mit ES-Hausbank (BBVA / CaixaBank / Santander / Sabadell) konfiguriert; INI/HIA-Briefe ausgetauscht; Zertifikate aktiviert. DMEE SEPA_CT/SEPA_CT_09 + SEPA_DD konfiguriert. Confirming-Anforderungen mit ES-Hausbank abgeklärt; Add-On evaluiert.', einsteiger: 'EBICS einrichten, Confirming-Prozess klären.', praxis: 'EBICS 3.0 mit BBVA Standard. Confirming nur bei großem Volumen via Add-On.' },
      { feld: 'Pre-Go-Live: Kalender', experte: 'ES-Fabrikkalender in SCAL: 10 nationale Feiertage inkl. 06.01, 15.08, 12.10, 01.11, 06.12, 08.12. Regionale Feiertage je Standort: Katalonien (23.04 Sant Jordi, 11.09 Diada), Baskenland (Aberri Eguna), Madrid (San Isidro 15.05). Kanaren in WET-Zeitzone separat.', einsteiger: 'ES-Kalender hat 10 nationale + viele regionale Feiertage.', praxis: 'SCAL je Buchungskreis-Standort. Jährlich im Dezember aktualisieren. DE-Template REICHT NICHT.' },
      { feld: 'Pre-Go-Live: Compliance + e-Invoice', experte: 'Sanktionsscreening aktiv. UBO im Mercantil-Register gepflegt. SAP DRC für ES konfiguriert: Facturae-Generierung + FACe-Versand für B2G. Modelo 111/216 (IRPF/IS Quellensteuer-Quartalsmeldung) und Modelo 347 (Jahresanzeige Geschäftspartner > EUR 3.005,06) eingerichtet. INCIBE-Anforderungen geprüft.', einsteiger: 'Compliance + Facturae + Steuer-Reporting einrichten.', praxis: 'SAP DRC für ES freischalten. Digitales Zertifikat (FNMT/Camerfirma) für Signatur. DIR3-Codes der ES-Behörden im Stamm.' },
      { feld: 'Produktivsetzung', experte: 'Testübertragungen mit Bank erfolgreich (EBICS Upload + Download). pain.001 mit Bank-Testsystem validiert (NIF korrekt im Tax-Feld bei POBO). Erster F110-Lauf — Log prüfen. SDD FRST mit D-5 Vorlaufzeit. camt.053 (oder Cuaderno 43) empfangen + verbucht. Bizum-Eingänge (falls B2C) verifiziert. Facturae-Testrechnung an Test-FACe gesendet.', einsteiger: 'Testlauf, erster Zahllauf, Kontoauszug + Facturae prüfen.', praxis: 'Checkliste abarbeiten: Upload → Quittung → camt.053 → Abstimmung. FACe-Test mit Demo-Empfänger.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update (regionale Feiertage). Alle 3 Jahre: EBICS-Zertifikate, FNMT-Signaturzertifikat. B2B Crea y Crece-Pflicht überwachen — Phase 1 voraussichtlich 2025/2026. Confirming-Lieferantenliste pflegen. Modelo 347 jährliche Pflichtmeldung. PSD3/CoP-Implementierung beobachten. Cuaderno 43 → camt.053 Migration finalisieren.', einsteiger: 'Wartung + Migration auf neue Standards.', praxis: 'Q4 jeden Jahres: Modelo 347. SCAL-Update Dezember. Confirming-Reporting monatlich.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Spanien (${COUNTRY_CODE}) Blocks ===`);
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
