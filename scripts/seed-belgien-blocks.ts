/**
 * Seed country_blocks for Belgium (BE).
 *
 * Quelle: content/expansion/laender/be.md, NBB/BNB Reglement, Febelfin Standards,
 * EPC Rulebooks, ISO 20022, Bancontact Company, Isabel 6 / Ponto API Documentation.
 * Block-Struktur aligned with IT/CN/DE/CH template.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-belgien-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

const COUNTRY_CODE = 'BE';

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: 'BE / BEL (ISO 3166-1 alpha-2 / alpha-3). Numerisch: 056.', einsteiger: 'Alpha-2 BE, Alpha-3 BEL.', praxis: 'SAP T005 Eintrag, Bankstamm Länderfeld.' },
      { feld: 'Währung', experte: 'EUR (€) / ISO 4217: EUR. Eurozone-Mitglied seit 01.01.1999 (physisch seit 01.01.2002).', einsteiger: 'Euro.', praxis: 'Hauswährung Buchungskreis BE.' },
      { feld: 'IBAN-Format', experte: 'BE + 2 IBAN-Prüfziffern + 3 Bankcode + 7 Kontonummer + 2 nationale Prüfziffern = 16 Stellen. Eine der kürzesten IBANs im SEPA-Raum (nur NL kürzer mit 18). Die letzten 2 Ziffern sind die belgische interne Prüfziffer (Modulo 97), nicht zu verwechseln mit den IBAN-Prüfziffern in Position 3-4. Beispiel: BE68 5390 0754 7034.', einsteiger: '16 Zeichen — sehr kurz. Davon sind die letzten 2 Stellen eine zusätzliche belgische Prüfziffer.', praxis: 'IBAN-Validierung aktiv lassen. Bei Import historischer Konten im Format "XXX-YYYYYYY-ZZ": NBB-Konverter nutzen (https://www.nbb.be).' },
      { feld: 'BIC/SWIFT', experte: '8 oder 11 Zeichen, Format AAAABEBBXXX. Top 5 BICs: BNP Paribas Fortis GEBABEBB, KBC KREDBEBB, ING Belgium BBRUBEBB, Belfius GKCCBEBB, Argenta ARSPBE22.', einsteiger: 'BE im BIC = Belgien.', praxis: 'In SAP Hausbank BIC pflegen — für SWIFT-Korrespondenz und Auslandszahlungen.' },
      { feld: 'Zeitzone', experte: 'CET (UTC+1) im Winter / CEST (UTC+2) im Sommer. Umstellung: letzter Sonntag März / Oktober.', einsteiger: 'Gleiche Zeitzone wie DE, NL, FR.', praxis: 'SCT Cut-off bei BE-Banken i.d.R. 15:00 CET, T2 URGP bis 17:00 CET.' },
      { feld: 'Zentralbank', experte: 'Nationale Bank van België / Banque Nationale de Belgique (NBB/BNB), Berlaimontlaan 14, 1000 Brüssel. nbb.be. Eurosystem-Mitglied (NCB). Besonderheit: NBB betreibt selbst das nationale Retail-Clearing CEC (Centre d\'Échange et de Compensation) — ungewöhnlich für die EU.', einsteiger: 'Belgische Zentralbank — und gleichzeitig Betreiber des nationalen SEPA-Clearings.', praxis: 'Gläubiger-ID (CI) für SEPA SDD bei NBB beantragen: BE + 2 Prüfziffern + ZZZ + 11-stellige CI. Antrag über https://www.nbb.be.' },
      { feld: 'Aufsicht', experte: 'NBB/BNB für Prudential (Banken-/Solvabilitätsaufsicht). FSMA (Financial Services and Markets Authority) für Conduct (Verbraucherschutz, Kapitalmarkt). Duales Aufsichtsmodell ähnlich NL. fsma.be / nbb.be.', einsteiger: 'NBB beaufsichtigt Bankenstabilität, FSMA das Marktverhalten.', praxis: 'Für Corporates direkt nicht relevant — nur Banken/PSPs sind Lizenznehmer.' },
      { feld: 'Sprache / Zeichensatz', experte: 'Drei Amtssprachen: Niederländisch (Flandern, ca. 60%), Französisch (Wallonien, ca. 40%), Deutsch (Ostbelgien, < 1%). UTF-8 Standard. Sonderzeichen NL: ë, ï, ö, ü; FR: à, é, è, ê, ô, ç. SWIFT MT103: nur ASCII → Sonderzeichen werden ersetzt. ISO 20022: UTF-8 vollständig.', einsteiger: 'Drei offizielle Sprachen — Bankverträge je nach Sitz NL oder FR.', praxis: 'SAP-Formulare (Zahlungsavis) ggf. in NL und FR konfigurieren. Flämische Gesellschaften: NL bevorzugt; wallonische: FR; Brüssel: beide.' },
      { feld: 'Nationale Feiertage', experte: '10 nationale Feiertage: 01.01 Nieuwjaar/Jour de l\'An, Ostermontag (Paasmaandag/Lundi de Pâques), 01.05 Dag van de Arbeid/Fête du Travail, Hemelvaart/Ascension (Donnerstag), Pinkstermaandag/Lundi de Pentecôte, 21.07 Nationale Feestdag/Fête Nationale (Belgischer Nationalfeiertag), 15.08 Onze-Lieve-Vrouw Hemelvaart/Assomption, 01.11 Allerheiligen/Toussaint, 11.11 Wapenstilstand/Armistice (Waffenstillstand 1918), 25.12 Kerstmis/Noël. Plus Gemeinschafts-Feiertage je Region (z.B. 11.07 Vlaamse Gemeenschap, 27.09 Fédération Wallonie-Bruxelles, 15.11 Deutschsprachige Gemeinschaft).', einsteiger: '10 nationale Feiertage — davon 4 die es in DE nicht gibt: 21.07, 15.08, 01.11, 11.11.', praxis: 'SAP SCAL: BE-Fabrikkalender mit allen 10 Feiertagen. 21.07 (Fête Nationale) und 11.11 (Armistice) sind die häufigsten Stolpersteine bei DE-Templates.' },
      { feld: 'Wirtschaft / Kontext', experte: 'BIP: ca. EUR 580 Mrd. (2024). Hauptindustrien: Chemie/Pharma (BASF Antwerpen, Solvay), Logistik (Hafen Antwerpen — größter Chemie-Cluster Europas, zweitgrößter Hafen Europas), Lebensmittel, Diamantenhandel (Antwerpen). Brüssel als EU-Institutionssitz: NATO, EU-Kommission, EU-Parlament — viele Holdinggesellschaften und Lobbystrukturen. Handelspartner: DE, NL, FR, GB, US.', einsteiger: 'EU-Hauptstadt mit starkem Chemie- und Logistiksektor. Holding-Hub für EU-Konzerne.', praxis: 'Zahlungsziele B2B: 30 Tage Standard (Loi du 14 août 2021 — Late Payment Law), strenger als DE.' },
      { feld: 'Hauptbanken', experte: 'BNP Paribas Fortis (GEBABEBB) — größte BE-Bank, Teil BNP Paribas, exzellentes Corporate Treasury. KBC Group (KREDBEBB) — Marktführer Flandern. ING Belgium (BBRUBEBB) — Teil ING-Gruppe, sehr starke Treasury-APIs. Belfius Bank (GKCCBEBB) — staatlicher Anteilseigner (ehemals Dexia), öffentliche Hand. Argenta (ARSPBE22) — Retailfokus. Triodos Bank Belgium — Nachhaltigkeit. Nagelmackers — Privatbank.', einsteiger: 'Big 4 = BNP Fortis, KBC, ING, Belfius.', praxis: 'BNP Paribas Fortis + ING Belgium haben stärksten Corporate-EBICS-Support. Belfius oft Wahl für Public Sector Klienten.' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'PSD2 — Loi du 11 mars 2018 / Wet van 11 maart 2018', experte: 'PSD2-Umsetzung in BE durch das Gesetz vom 11. März 2018 über den Status und die Kontrolle der Zahlungsinstitute (Statut et contrôle des établissements de paiement / Statuut en toezicht op de betalingsinstellingen). NBB für Prudential, FSMA für Conduct. SCA vollständig umgesetzt — BE-Banken waren EU-weit unter den ersten mit konformer Implementierung. POBO ist zulässig; NBB hat keine spezifischen POBO-Restriktionen für EU-Konzerne. Brüssel als EU-Hauptstadt macht BE beliebt als POBO-Zentrale. PSD3 (EU-Entwurf, Umsetzung 2026/2027): Confirmation of Payee in BE-Banken bereits in Pilotierung. Quelle: https://www.ejustice.just.fgov.be (Belgisch Staatsblad / Moniteur belge).', einsteiger: 'Belgisches Zahlungsdienstegesetz = PSD2. SCA Pflicht, B2B-Ausnahme via Bankvertrag.', praxis: 'B2B-SCA-Ausnahme schriftlich mit BE-Hausbankverbindungen fixieren. POBO-Rider Standardvertrag bei BNP PF und ING BE verfügbar.' },
      { feld: 'AML — Wet van 18 september 2017 / Loi du 18 septembre 2017', experte: 'BE-AML-Gesetz vom 18.09.2017 zur Verhütung von Geldwäsche und Terrorismusfinanzierung. Umsetzung der EU-Geldwäscherichtlinien (4./5./6. AMLD). FIU: CTIF-CFI (Cellule de Traitement des Informations Financières / Cel voor Financiële Informatieverwerking) — ctif-cfi.be. UBO-Register beim FPS Finance / FOD Financiën verpflichtend für alle BE-Gesellschaften. Bargeldobergrenze: EUR 3.000 für B2B-Bargeldgeschäfte (strenger als EU-Standard). Quelle: https://finances.belgium.be / https://financien.belgium.be.', einsteiger: 'BE-Geldwäschegesetz mit UBO-Register-Pflicht und 3.000-EUR-Bargeldlimit.', praxis: 'UBO-Register beim FPS Finance pflegen. Bei IHB-Strukturen: Wirtschaftlich Berechtigte aller BE-Töchter eintragen. Sanktionsscreening über SAP FCM ausreichend.' },
      { feld: 'GDPR / Loi vie privée 30 juillet 2018', experte: 'BE-Datenschutzgesetz vom 30. Juli 2018 ergänzt DSGVO mit nationalen Besonderheiten. Aufsichtsbehörde: APD/GBA (Autorité de protection des données / Gegevensbeschermingsautoriteit) — autoriteprotectiondonnees.be. Zahlungsdaten = personenbezogen (IBAN, Empfänger). Aufbewahrungsfristen: 7 Jahre für Buchhaltungsunterlagen (Code de droit économique).', einsteiger: 'IBAN-Daten sind personenbezogen, BE-Datenschutzbehörde APD/GBA ist zuständig.', praxis: 'Zahlungsbelege 7 Jahre archivieren (BE) vs. 10 Jahre (DE). SAP-Berechtigungen für IBAN-Felder einschränken.' },
      { feld: 'SEPA-Verordnung (EU 260/2012)', experte: 'Vollständig umgesetzt seit 01.02.2014. Ehemalige BE-Inlandsformate (CIRI/CIRP) durch SEPA SCT/SDD abgelöst. CEC verarbeitet alle SEPA-Transaktionen. Stand April 2026: SCT ✓, SCT Inst ✓ (Empfangspflicht seit Oktober 2025), SDD Core/B2B ✓. Quelle: https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32012R0260.', einsteiger: 'SEPA läuft vollständig. Alte BE-Formate sind abgelöst.', praxis: 'Standard SEPA-Setup wie DE. Keine BE-Sonderformate mehr für Inlandszahlungen.' },
      { feld: 'SEPA Instant (EU 2024/886)', experte: 'BE-Banken: Empfangspflicht seit Oktober 2025, Sendepflicht seit Juli 2025. Preisparität SCT/SCT Inst seit Oktober 2025. Limit EUR 100.000. Alle BE-Großbanken (BNP PF, KBC, ING BE, Belfius) vollständig. CEC und TIPS sind interoperabel. Quelle: https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R0886.', einsteiger: 'Sofortüberweisungen kostenlos und Pflicht bei allen großen BE-Banken.', praxis: 'SAP BCM: SvcLvl INST für BE-Zahlungen aktivieren. camt.054 Echtzeit-Verarbeitung konfigurieren.' },
      { feld: 'DORA / NIS2', experte: 'DORA direkt anwendbar ab 17.01.2025, BE-Banken und PSPs in Scope. NIS2-Umsetzung in BE durch Loi du 26 avril 2024 établissant un cadre pour la cybersécurité des réseaux et des systèmes d\'information / Wet van 26 april 2024. Aufsicht: CCB (Centre for Cybersecurity Belgium) — ccb.belgium.be. NBB koordiniert für Finanzsektor. Quellen: DORA https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022R2554, NIS2 https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2555.', einsteiger: 'EU-Cyber-Regeln in BE umgesetzt. CCB ist Cybersecurity-Behörde.', praxis: 'BCP für BE-Bankverbindungen dokumentieren. EBICS-Zertifikat-Ablaufdaten überwachen. DORA-Klauseln in Bankverträgen prüfen (Legal Review).' },
      { feld: 'e-Invoice — Mercurius / Peppol BE', experte: 'B2G-Pflicht: Seit 01.03.2024 müssen alle Lieferanten an Föderalverwaltung elektronische Rechnungen via Mercurius senden. Format: Peppol BIS Billing 3.0 (UBL 2.1). B2B-Pflicht: Ab 01.01.2026 für alle BE-Steuerpflichtigen via Peppol-Netzwerk (CTC-Modell, vereinbart mit EU 2025). FOD Financiën / FPS Finance ist zuständige Behörde. Mercurius = Service Bus des Föderalstaates. Quelle: https://efactuur.belgium.be / https://efactuur.bosa.be.', einsteiger: 'E-Rechnungen Pflicht: B2G seit 2024, B2B ab Januar 2026 via Peppol.', praxis: 'SAP Document and Reporting Compliance (DRC) für BE konfigurieren. Peppol Access Point auswählen (z.B. Basware, Pagero, Tradeshift). Leverancier-ID / ID Fournisseur korrekt mappen.' },
      { feld: 'Steuer-IDs Belgien', experte: 'KBO/BCE-Nummer (Kruispuntbank van Ondernemingen / Banque-Carrefour des Entreprises): 10-stellig numerisch — Unternehmens-Registernummer. BTW/TVA-Nummer (BE-USt-ID): BE + 10-stellig — formal identisch mit KBO-Nummer (Erleichterung für SAP). Rijksregisternummer / Numéro de registre national: 11-stellig — nur Privatpersonen. KBO-Verifikation via Modulo-97-Prüfziffer der letzten 2 Stellen. Quelle: https://kbopub.economie.fgov.be / https://www.businessdb.be.', einsteiger: 'KBO = BE-Handelsregisternummer. BTW = USt-ID, identisch zu KBO mit BE-Präfix.', praxis: 'SAP LFA1: STCD1 = KBO-Nummer (10-stellig ohne BE), STCEG = BE + KBO. Custom Validation Modulo 97 implementieren.' },
      { feld: 'Withholding Tax', experte: 'Précompte mobilier / Roerende voorheffing: 30% Quellensteuer auf Dividenden, Zinsen und Lizenzen. EU-Mutter-Tochter-Richtlinie und EU-Zins-/Lizenzgebühren-Richtlinie umgesetzt. DBA-Reduktion möglich. SAP: Withholding Tax Type W2 / Code BE-30, Reduktion via Steuercodes. Quelle: https://finances.belgium.be.', einsteiger: '30% Quellensteuer auf Dividenden/Zinsen, Reduktion via DBA möglich.', praxis: 'Withholding Tax Codes in OBYZ. DBA-Befreiungen über separate Codes pflegen.' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'CEC (Centre d\'Échange et de Compensation)', experte: 'Belgisches nationales Retail-Clearing-System für SEPA. Betreiber: NBB/BNB selbst — ungewöhnlich, da in den meisten EU-Ländern private/quasi-private Betreiber das Clearing übernehmen (z.B. STET in FR, Iberpay in ES). DNS-Settlement (Deferred Net Settlement) über T2. SEPA-kompatibel. Quelle: https://www.nbb.be/en/payments-and-securities/payment-standards/cec.', einsteiger: 'BE-Inlands-Clearing — von der Zentralbank selbst betrieben.', praxis: 'Für Corporate transparent — Bank-Routing entscheidet. SCT-Cut-off via CEC i.d.R. 15:00 CET.' },
      { feld: 'TARGET2 / T2', experte: 'RTGS-System der EZB. EUR-Großbetragszahlungen in Echtzeit. T2-Konsolidierung März 2023 abgeschlossen. URGP-Zahlungen über T2. NBB ist Teilnehmer für BE.', einsteiger: 'Europäisches Echtzeit-Großbetragssystem für EUR.', praxis: 'T2 URGP Cut-off 17:00 CET. SAP Zahlungsmethode für Express-Zahlungen mit SvcLvl URGP.' },
      { feld: 'STEP2 (EBA Clearing)', experte: 'Paneuropäisches ACH/DNS für SEPA SCT und SDD. Alle BE-Banken Teilnehmer. CEC und STEP2 sind beide für BE-Zahlungen einsetzbar — Routing-Entscheidung der Hausbank.', einsteiger: 'Europäisches Massenzahlungssystem.', praxis: 'Standard für F110-Zahlläufe. Pan-EU SCT.' },
      { feld: 'TIPS', experte: 'EZB Instant-RTGS für SCT Inst. EUR, 24/7/365. Limit EUR 100.000. Alle BE-Großbanken angebunden. Brutto-Settlement in Echtzeit.', einsteiger: 'EU-weites Instant-Payment-System.', praxis: 'SAP BCM: SvcLvl INST aktivieren.' },
      { feld: 'Bancontact / Payconiq', experte: 'Bancontact Company betreibt das BE-Debitkartensystem (dominant an POS und im E-Commerce — Marktanteil > 50% online). Payconiq by Bancontact = Mobile Payment App. Bancontact Online: E-Commerce-Integration; neben iDEAL (NL) eines der stärksten nationalen Online-Systeme Europas. Für Corporate-Treasury: B2C-Zahlungseingang. Backend: SEPA SCT Inst. Quelle: https://www.bancontact.com.', einsteiger: 'BE-Debitkartensystem — Marktführer im POS und Online-Zahlung.', praxis: 'Bancontact als Zahlungseingang nur über PSP (Adyen, Worldline, Mollie). Verbuchung via camt.054 als SEPA-Gutschrift.' },
      { feld: 'Top Banken', experte: 'BNP Paribas Fortis (GEBABEBB), KBC Group (KREDBEBB), ING Belgium (BBRUBEBB), Belfius Bank (GKCCBEBB). Diese 4 decken > 80% des BE-Markts ab. Daneben: Argenta, Triodos BE, Crelan, Nagelmackers. Bankenverband: Febelfin (febelfin.be) — gibt Zahlungsstandards-Empfehlungen heraus.', einsteiger: 'Big 4: BNP PF, KBC, ING BE, Belfius.', praxis: 'EBICS-Vertrag mit BNP PF oder ING BE für Multinationals. Belfius bevorzugt für öffentliche Auftraggeber.' },
      { feld: 'Bankkanäle: EBICS / Isabel / Ponto', experte: 'EBICS 3.0 von BNP Paribas Fortis, KBC, ING Belgium, Belfius unterstützt. Isabel 6 (isabel.eu): BE-eigenständige Multibank-Online-Banking-Plattform — verbreitet bei KMU ohne EBICS-Anbindung; ermöglicht mehrere BE-Banken in einer Oberfläche. Ponto (myponto.com): moderne API-Plattform; PSD2-basiert; Isabel-Nachfolger für digitale Integration.', einsteiger: 'EBICS für große Konzerne, Isabel/Ponto für kleinere BE-Gesellschaften.', praxis: 'SAP Standard ist EBICS. Für Isabel: SAP Add-On (Serrala, Treamo) oder Custom-Connector — nicht EBICS-basiert. Ponto-API für Cloud-Treasury-Integrationen evaluieren.' },
      { feld: 'Cut-Off-Zeiten', experte: 'SEPA SCT Standard: 15:00 CET, Valuta D+1. SCT URGP via T2: 17:00 CET, Valuta D. SCT Instant: 24/7, sofort. SDD CORE FRST: D-5. SDD CORE RCUR: D-2. SDD B2B: D-1. Auslandsüberw. SWIFT: 14:00 CET, Valuta D+1 bis D+2.', einsteiger: 'Standard-Überweisungen bis 15:00, Eilzahlungen bis 17:00, Instant rund um die Uhr.', praxis: 'F110-Zahllauf bis 13:00 CET starten für sicheren 15:00-Cut-off.' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'FBZP — Zahlungsmethodenkonfig', experte: 'Identisch DE: Zahlungsmethode "B" SEPA CT (pain.001.001.03/.09), "D" SEPA SDD Core (pain.008.001.02), "E" SEPA SDD B2B. CI bei NBB beantragen und in FBZP → Zahlungsweg → Weitere Daten hinterlegen. Keine BE-spezifischen Sonderformate für SEPA-Standardzahlungen.', einsteiger: 'BE-FBZP funktioniert wie DE.', praxis: 'CI bei NBB beantragen (BE+2+ZZZ+11). DE-FBZP-Vorlage 1:1 für BE übernehmen.' },
      { feld: 'KBO/BTW in SAP', experte: 'LFA1/KNA1: STCD1 = KBO-Nummer (10-stellig, ohne BE-Präfix), STCEG = BE + KBO (BTW-Nummer). T001/OBY6: STCEG der eigenen BE-Gesellschaft. Custom Validation: KBO-Modulo-97-Prüfziffer (letzte 2 Stellen MOD 97 = 0). DMEE: Bei POBO UltmtDbtr/Tax/Id = KBO der zahlenden BE-Gesellschaft.', einsteiger: 'KBO und BTW im Stamm pflegen, Modulo-97-Prüfung empfohlen.', praxis: 'SAP-Funktion zur KBO-Validierung als Custom-Erweiterung in OBYZ-Logic. Einheitlich beim Anlegen prüfen.' },
      { feld: 'Mehrsprachige Formulare', experte: 'SAP-Zahlungsavise (SAPscript / SmartForms / Adobe Forms) ggf. in NL und FR konfigurieren. Flämische BE-Gesellschaft: NL-Texte. Wallonische BE-Gesellschaft: FR-Texte. Brüssel: beide Sprachen typisch. Sprachsteuerung über LFA1-SPRAS oder Custom-Logik basierend auf Gesellschaftssitz.', einsteiger: 'BE-Korrespondenz auf Niederländisch oder Französisch je nach Region.', praxis: 'Form-Varianten je Sprache anlegen. Default-Logik: NL für Sitz Flandern, FR für Sitz Wallonien/Brüssel.' },
      { feld: 'Bankkanal: EBICS oder Isabel', experte: 'EBICS-Standard bei BNP PF, ING BE, KBC, Belfius (Version 3.0). Isabel 6: BE-Multibank-Plattform — proprietäres Format, kein EBICS. Ponto: REST-API, PSD2-basiert, OAuth2-Authentifizierung. Bei Isabel: SAP Add-On (z.B. Serrala FS² Belgien-Modul) oder Custom-Integration via Coda-Konvertierung.', einsteiger: 'EBICS für große Konzerne, Isabel/Ponto für kleinere BE-Gesellschaften.', praxis: 'EBICS bevorzugen wenn möglich. Isabel-Anbindung nur, wenn Hausbank kein EBICS anbietet (selten bei Big 4).' },
      { feld: 'Typische Projektfehler BE', experte: '1) 21.07 (Fête Nationale) und 11.11 (Armistice) nicht im SCAL-Kalender → Zahlungen verspätet. 2) KBO mit führender 0 (0123456789) wird falsch erfasst (123456789, 9-stellig) → Validierungsfehler. 3) EBICS konfiguriert, aber BE-Hausbank bietet nur Isabel → Add-On fehlt. 4) Zweisprachige Korrespondenz nicht eingerichtet → wallonische Lieferanten beschweren sich. 5) Bancontact-Eingänge als direkte SEPA-Buchung erwartet — laufen aber via PSP. 6) CODA-Auszüge ignoriert, nur camt.053 erwartet — einige BE-Banken liefern parallel beide. 7) UBO im FPS-Register vergessen — strenge BE-Sanktionen bei Verstoß.', einsteiger: 'Die häufigsten Fehler bei BE-Rollouts.', praxis: 'Checkliste in Pre-Go-Live aufnehmen. UBO-Eintrag prüfen.' },
      { feld: 'Fabrikkalender SCAL', experte: 'BE-Fabrikkalender: 10 Feiertage minimum (siehe Block 1). Plus regionale Ergänzungen wenn Standort relevant: 11.07 (Vlaamse Gemeenschap), 27.09 (Fédération Wallonie-Bruxelles), 15.11 (Deutschsprachige Gemeinschaft). Brüsseler Buchungskreis: nur nationale Feiertage. SAP-Konfiguration je Werks-Standort differenzieren.', einsteiger: 'BE-Kalender hat 10 nationale + ggf. regionale Feiertage.', praxis: 'Jährlich im Dezember für Folgejahr aktualisieren. Standort-Differenzierung in Buchungskreis-Customizing.' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout
      { feld: 'pain.001.001.03 / .09 (SEPA SCT)', experte: 'Standard für alle BE-Inlands- und SEPA-Zahlungen. Alle BE-Großbanken akzeptieren beide Versionen. .09 empfohlen für Neuinstallationen (ISO 2019).', einsteiger: 'Das Standard-Format für Überweisungen in Belgien und Europa.', praxis: 'SAP DMEE SEPA_CT (.03) oder SEPA_CT_09 (.09). Migration auf .09 empfohlen.' },

      // Sektion 12.1 — SEPA Credit Transfer
      { feld: '► 12.1 — SEPA Credit Transfer (SCT)' },
      { feld: 'Format', experte: 'pain.001.001.03 (EPC-Subset, EBA Clearing) oder pain.001.001.09 (ISO 2019). SvcLvl SEPA / URGP, ChrgBr SLEV. Quelle: https://www.europeanpaymentscouncil.eu/document-library — EPC SEPA Credit Transfer Scheme Customer-to-Bank Implementation Guidelines.', einsteiger: 'XML-Datei für SEPA-Überweisungen — identisch mit DE/FR/NL.', praxis: 'SAP DMEE SEPA_CT oder SEPA_CT_09. Banktest mit BE-Hausbank vor Produktivsetzung.' },
      { feld: 'EBICS-Auftragsart', experte: 'CCT (Customer Credit Transfer) für pain.001 Upload. HAC für Quittung. C53/C52 für Kontoauszüge. Alle BE-Großbanken unterstützen EBICS 3.0.', einsteiger: 'CCT = Überweisung hochladen via EBICS.', praxis: 'FIEB: BTF CCT konfigurieren. HAC-Download für Statusprüfung einrichten.' },
      { feld: 'SCT Instant', experte: 'Gleiche pain.001, SvcLvl INST statt SEPA. Max EUR 100.000. Verarbeitung in <10 Sekunden. 24/7/365. BE: alle Großbanken vollständig (Empfangspflicht seit Oktober 2025).', einsteiger: 'Sofortüberweisung — gleiches Format, anderer Service-Level.', praxis: 'SAP BCM: SvcLvl INST in Zahlungsmethode konfigurieren. camt.054 Real-Time aktivieren.' },

      // Sektion 12.2 — SEPA Direct Debit
      { feld: '► 12.2 — SEPA Direct Debit (SDD)' },
      { feld: 'SDD Core', experte: 'pain.008.001.02. Mandatsverwaltung in SAP (MndtId + CI). FRST: D-5, RCUR: D-2. Rückgabefrist: 8 Wochen (autorisiert), 13 Monate (unautorisiert). Quelle: https://www.europeanpaymentscouncil.eu/document-library — EPC SEPA Direct Debit Core Rulebook.', einsteiger: 'Lastschrift für Privat- und Firmenkunden.', praxis: 'SAP Zahlungsmethode "D". CI bei NBB beantragen.' },
      { feld: 'SDD B2B', experte: 'pain.008.001.02 mit SeqTp B2B. FRST/RCUR: D-1. Keine Rückgabe durch Zahler möglich (nur technische Rejects). Bank muss Mandat vorab bestätigen. Quelle: EPC SEPA Direct Debit Business-to-Business Rulebook.', einsteiger: 'Firmenlastschrift — keine Widerspruchsmöglichkeit.', praxis: 'SAP Zahlungsmethode "E". Bank-Mandatsbestätigung vor erstem Einzug.' },
      { feld: 'Gläubiger-ID (CI) Belgien', experte: 'Format: BE + 2 Prüfziffern + ZZZ + 11-stellige nationale ID. Beantragung bei NBB/BNB. Stelle 5-7 (ZZZ): frei wählbar als Geschäftsbereich-Identifikator.', einsteiger: 'Eindeutige BE-Gläubiger-ID für Lastschriften, bei NBB beantragen.', praxis: 'In FBZP → Zahlungsweg + SAP BCM hinterlegen. Ohne CI keine SDD-Einreichung.' },

      // Sektion 12.3 — CODA (Legacy-Kontoauszug)
      { feld: '► 12.3 — CODA (Belgisches Kontoauszug-Format)' },
      { feld: 'CODA-Format', experte: 'Coded Statement of Account — traditionelles BE-Kontoauszug-Format der Febelfin. Fixed-Length-Flatfile, Zeichenformat 128 Zeichen je Satz. Satzarten: 0 (Header), 1 (Eröffnungsbilanz), 2 (Bewegung), 3 (Detail Bewegung), 4 (frei), 8 (Endbilanz), 9 (Trailer). Wird formal durch camt.053 (ISO 20022) abgelöst, läuft aber bei vielen BE-Banken parallel. Quelle: https://www.febelfin.be — Febelfin CODA 2.6 Specification.', einsteiger: 'BE-Legacy-Kontoauszug — wird durch camt.053 abgelöst, aber noch oft parallel ausgeliefert.', praxis: 'SAP Standard: CODA-Importer (FF.5) oder Custom DMEE. Zielformat: camt.053 — CODA nur als Fallback wenn camt.053 nicht verfügbar.' },

      // Sektion 12.4 — Bancontact / Payconiq
      { feld: '► 12.4 — Bancontact / Payconiq' },
      { feld: 'Bancontact (POS + Online)', experte: 'Belgisches Debitkartensystem. Marktanteil > 50% in BE-Online-Zahlungen, > 80% an POS. Backend: SEPA SCT Inst. Für Corporate-Treasury: B2C-Zahlungseingang über PSP. Direkter Bancontact-Acquiring nur über Bancontact Company / Worldline. Quelle: https://www.bancontact.com.', einsteiger: 'BE-Kartensystem für Konsumentenzahlungen — Marktführer.', praxis: 'Verbuchung über PSP-Auszug (Worldline, Adyen, Mollie). Im camt.054 als SEPA-Gutschrift erkennen.' },
      { feld: 'Payconiq by Bancontact', experte: 'Mobile Payment App auf Bancontact-Basis. QR-Code-Zahlung Verbraucher → Händler. Settlement via SEPA SCT Inst. Marktdurchdringung wachsend, besonders im Café/Restaurant-Sektor.', einsteiger: 'BE-Mobile-Payment via QR-Code — wie Twint in CH.', praxis: 'Eingangsbuchungen erscheinen als SEPA SCT Inst Gutschriften. Keine Sonderkonfiguration in SAP nötig.' },

      // Sektion 12.5 — Isabel / Ponto (Bankkanal)
      { feld: '► 12.5 — Isabel 6 / Ponto (Multibank-Kanal)' },
      { feld: 'Isabel 6', experte: 'BE-eigenständige Multibank-Plattform für Corporate Banking. Verbreitet bei KMU. Proprietäres Format, kein EBICS. Unterstützt SEPA-Upload, Kontoauszug-Download (CODA + camt.053). Betreiber: Isabel Group (gemeinsame Tochter der BE-Banken). Quelle: https://www.isabel.eu.', einsteiger: 'Isabel = "Online-Banking für mehrere Banken" — verbreitet bei BE-Mittelstand.', praxis: 'SAP-Anbindung über Add-On (Serrala FS² BE-Modul, Treamo Connect). Nicht EBICS-kompatibel — eigenes Connectivity-Konzept.' },
      { feld: 'Ponto API', experte: 'Moderne PSD2-API-Plattform der Isabel Group. OAuth2-Authentifizierung. Nachfolger von Isabel für digitale Treasury-Integration. Multi-Bank: alle BE-Großbanken + viele EU-Banken. Quelle: https://myponto.com.', einsteiger: 'Ponto = moderne API für BE-Multi-Bank-Integration.', praxis: 'Für Cloud-Treasury (z.B. SAP S/4HANA Cloud) attraktiv. REST-API direkt oder via TMS-Connector.' },

      // Sektion 12.6 — camt.053 / camt.054
      { feld: '► 12.6 — camt.053 / camt.054 (ISO 20022 Kontoauszug)' },
      { feld: 'camt.053', experte: 'Tagesauszug, ISO 20022. Version .001.02 bis .001.08 bei BE-Banken. EBICS-Auftragsart C53. Ersetzt CODA. BkTxCd-Codes nach Febelfin BE-Mapping. Quelle: https://www.iso20022.org/iso-20022-message-definitions.', einsteiger: 'Elektronischer Kontoauszug im XML-Format — ISO-Standard.', praxis: 'SAP: FF_5 oder BAM. Posting Rules für BE-Banken (BkTxCd-Mapping Febelfin). C53 via EBICS.' },
      { feld: 'camt.054', experte: 'Buchungsbenachrichtigung, Echtzeit. EBICS-Auftragsart C54. Für SCT Inst Gutschriften und Bancontact/Payconiq-Eingänge.', einsteiger: 'Echtzeit-Benachrichtigung bei Kontobewegungen.', praxis: 'Real-Time-Processing in BAM aktivieren für Instant-Gutschriften.' },
      { feld: 'camt.052', experte: 'Intraday-Kontoauszug. EBICS-Auftragsart C52. Für Liquiditätsmonitoring untertägig.', einsteiger: 'Untertägiger Kontostand.', praxis: 'Für Cash-Forecasting in SAP Treasury konfigurieren.' },

      // Sektion 12.7 — e-Invoice (Mercurius / Peppol BE)
      { feld: '► 12.7 — Peppol BIS Billing 3.0 / Mercurius (e-Invoice)' },
      { feld: 'Peppol BIS Billing 3.0', experte: 'OpenPeppol-Spezifikation: UBL 2.1 XML basierend auf EN 16931. Für B2G über Mercurius (Federal Service Bus) seit 01.03.2024 Pflicht. B2B-Pflicht ab 01.01.2026. Dokument-Profile: P3 (Invoice/CreditNote). Peppol Access Point Provider erforderlich. Quelle: https://docs.peppol.eu/poacc/billing/3.0/.', einsteiger: 'EU-Standard für E-Rechnungen — in BE Pflicht für B2G und ab 2026 für B2B.', praxis: 'SAP Document and Reporting Compliance (DRC) für BE konfigurieren. Peppol Access Point auswählen (Basware, Pagero, Tradeshift, Belgian eFFF).' },
      { feld: 'Mercurius', experte: 'Federal Service Bus des belgischen Staates für E-Invoicing an öffentliche Verwaltungen. Betreiber: BOSA (FOD Beleid en Ondersteuning / SPF Stratégie et Appui). Empfänger werden über Peppol-ID identifiziert. Quelle: https://efactuur.bosa.be / https://efacture.bosa.be.', einsteiger: 'Mercurius = staatliches Portal für E-Rechnungen an BE-Behörden.', praxis: 'Peppol-IDs der BE-Behörden im KNA1 Custom-Feld pflegen. Peppol-Versand über DRC oder Access Point.' },
    ],
  },

  // ───── Block 6: Go-Live Checkliste ─────────────────────────────────────────
  {
    no: 6,
    title: 'Go-Live Checkliste',
    rows: [
      { feld: 'Pre-Go-Live: Stammdaten + IDs', experte: 'KBO-Nummer (10-stellig) + BTW-Nummer (BE+10) aller BE-Lieferanten in LFA1 (STCD1, STCEG). BTW der eigenen BE-Gesellschaft in T001/OBY6. Gläubiger-ID (CI) bei NBB beantragt (falls SDD). UBO-Register beim FPS Finance gepflegt. KBO-Modulo-97-Validierung implementiert.', einsteiger: 'Steuer- und Registernummern sauber pflegen, CI bei NBB beantragen.', praxis: 'KBO-Validierung als Custom-Funktion in OBYZ/Stammpflege. UBO-Eintrag rechtzeitig vor Go-Live (i.d.R. innerhalb 1 Monat nach Eintragung).' },
      { feld: 'Pre-Go-Live: Bankanbindung', experte: 'EBICS mit BE-Hausbank (BNP PF / ING BE / KBC / Belfius) konfiguriert; INI/HIA-Briefe ausgetauscht; Zertifikate aktiviert. Alternativ Isabel 6 oder Ponto API geprüft (bei kleinen BE-Gesellschaften ohne EBICS-Vertrag). DMEE SEPA_CT/SEPA_CT_09 + SEPA_DD konfiguriert.', einsteiger: 'EBICS oder Isabel/Ponto einrichten und testen.', praxis: 'EBICS bevorzugen. Bei Isabel: Add-On evaluieren (Serrala FS², Treamo).' },
      { feld: 'Pre-Go-Live: Kalender + Sprachen', experte: 'BE-Fabrikkalender in SCAL: 10 Feiertage inkl. 21.07, 15.08, 01.11, 11.11. Regionale Feiertage je Standort (z.B. 11.07 Vlaamse Gemeenschap). SAP-Formulare in NL und FR konfiguriert. Default-Sprache je Buchungskreis-Standort.', einsteiger: 'Feiertage und Sprachen einrichten.', praxis: 'SCAL jährlich im Dezember aktualisieren. Default-Sprache: NL für Flandern, FR für Wallonien/Brüssel.' },
      { feld: 'Pre-Go-Live: Compliance + e-Invoice', experte: 'Sanktionsscreening aktiv (FCM oder extern). UBO-Register bei FPS Finance vollständig. NIS2/CCB-Anforderungen für BE-Gesellschaft geprüft. SAP DRC für Peppol/Mercurius konfiguriert (für B2G ab 2024 Pflicht; B2B ab 2026).', einsteiger: 'Compliance einrichten + Peppol-Anbindung für E-Rechnung.', praxis: 'Peppol Access Point auswählen. Mercurius-Empfänger-IDs für BE-Behörden im Stamm pflegen.' },
      { feld: 'Produktivsetzung', experte: 'Testübertragungen mit Bank erfolgreich (EBICS Upload + Download). pain.001 mit Bank-Testsystem validiert. Erster F110-Lauf — Log prüfen. SDD FRST mit D-5 Vorlaufzeit. camt.053 (oder CODA-Fallback) empfangen + verbucht. Bankabstimmung durchgeführt. Bancontact-Eingänge (falls B2C) im camt.054 verifiziert.', einsteiger: 'Testlauf mit Bank, erster echter Zahllauf, Kontoauszug prüfen.', praxis: 'Checkliste abarbeiten: Upload → Quittung → camt.053 → Abstimmung. CODA-Parallel-Empfang prüfen.' },
      { feld: 'Laufender Betrieb', experte: 'Jährlich: SCAL-Update. Alle 3 Jahre: EBICS-Zertifikate. CODA-Auszüge: schrittweise Migration auf camt.053. Isabel → Ponto Migration: Neuinstallationen auf API-Lösung. PSD3/CoP-Implementierung beobachten. Peppol B2B-Pflicht ab 01.01.2026 vorbereiten.', einsteiger: 'Regelmäßige Wartung + Migration auf neue Standards.', praxis: 'Wiederkehrende Tasks im SAP Solution Manager dokumentieren. Q4 2025: Peppol B2B finalisieren.' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Seeder
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed Belgien (${COUNTRY_CODE}) Blocks ===`);
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
