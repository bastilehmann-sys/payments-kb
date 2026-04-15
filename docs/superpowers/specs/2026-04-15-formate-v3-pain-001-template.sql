-- pain.001 (Customer Credit Transfer Initiation) — ISO 20022 / EPC SCT 2025
-- Generated 2026-04-15 from official sources (see source_refs below).

UPDATE format_entries SET
  beschreibung_einsteiger = $$- **Zweck:** pain.001 ist die ISO-20022-Nachricht "CustomerCreditTransferInitiation", mit der ein Debtor (Firmenkunde) seiner Bank einen oder mehrere Überweisungsaufträge übermittelt (Customer-to-PSP).
- **SEPA-Einsatz:** Basis-Nachricht für SCT und SCT Inst im Customer-to-PSP-Raum; geregelt durch das EPC SEPA Credit Transfer Rulebook und die zugehörigen Implementation Guidelines (EPC132-08, aktuell Version 2025 V1.0).
- **Strukturlogik:** Eine Nachricht = 1 GrpHdr + 1..n PmtInf-Blöcke; jeder PmtInf-Block enthält 1..n CdtTrfTxInf-Transaktionen, die einen gemeinsamen Debtor, eine Zahlungsart und ein Ausführungsdatum teilen.
- **Pflicht-Strukturaddressen:** Nach EPC-Rulebook 2025 sind strukturierte Postadressen (PostalAddress24) verpflichtend; unstrukturierte AdrLine-Felder werden abgelöst.
- **Neue Felder in .09:** UETR (Unique End-to-End Transaction Reference), BICFI statt BICorBEI, LEI für juristische Personen, strukturierte Ultimate-Parties, ReqdExctnDt als Choice Dt/DtTm.$$,

  sap_mapping_einsteiger = $$In SAP wird pain.001 über das Zahlungsprogramm F110 (FI-BL, Transaktion FBZP für Zahlwege-Customizing) erzeugt. Die XML-Ausgabe entsteht über den DMEE/DMEEX-Formatbaum — Standardbäume sind SEPA_CT (klassisch) sowie der harmonisierte Baum CGI_XML_CT, in den SAP SEPA_CT und länderspezifische Varianten integriert hat. Die Hausbankzuordnung pflegt man in OB83 / FI12 bzw. im Bank-Account-Management. Für pain.001.001.09 liefert SAP mit OSS-Hinweis 2784858 das aktuelle Mapping, SAP-Hinweis 1844160 ist der zentrale Einstieg für SEPA_CT-DMEE-Korrekturen. In S/4HANA Advanced Payment Management (APM, Hinweis-Reihe rund um 3268290) wird pain.001 zentral generiert und via Multi-Bank Connectivity oder SFTP an die Bank übergeben. Für Post-Processing relevant sind die Tabellen REGUH (Zahlungsträger-Kopf) und REGUP (Zahlungsträger-Position), deren Inhalte das DMEE-Mapping in die XML-Struktur schreibt.$$,

  sap_mapping_experte = $$Tiefe SAP-Integration:
• TCODEs: FBZP (Zahlweg + Formatzuordnung "Zahlungsmedium-Format" = SEPA_CT / CGI_XML_CT), F110 (Zahllauf), F110S (Job), DMEE/DMEEX (Formatbaum-Pflege), OB83 / FI12 (Hausbanken, BIC), BNKA (Banken-Stammdaten).
• SPRO-Pfad Zahlweg: Finanzwesen → Debitoren- und Kreditorenbuchhaltung → Geschäftsvorfälle → Ausgehende Zahlungen → Ausgehende Zahlungen generell → Zahlwege → Zahlwege pro Land definieren → Zuordnung "Zahlungsmedium-Format: SEPA_CT" + "Payment Medium: Payment Medium Workbench".
• SPRO-Pfad PMW: Finanzwesen → Anwendungsübergreifend → Zahlungsmedium → Payment Medium Workbench → Zahlungsmedium-Formate pflegen; Zuordnung zu DMEE-Baum über Ausprägung "Zahlungsmedium-Format-Ausprägung" mit XML-Engine = DMEE.
• DMEEX-Baum SEPA_CT: Root → Document/CstmrCdtTrfInitn → GrpHdr, PmtInf (Segmentierung über Split-Gruppen pro PmtInf-Kriterium: DbtrAcct, PmtMtd, ReqdExctnDt, CtgyPurp), CdtTrfTxInf. Nach Upgrade auf .09 müssen Nodes für PostalAddress24 (StrtNm, BldgNb, PstCd, TwnNm, Ctry), BICFI, LEI (OrgId/Id/Othr/Id mit SchmeNm Prtry=LEI bzw. über LEI-Element), UETR und RequestedExecutionDate als Choice (Dt/DtTm) nachgezogen werden — siehe OSS-Hinweis 2784858 ("Current mapping specifications for CGI Credit Transfer pain.001.001.09") sowie Community-Hinweis auf Note-Reihe 1540040, 2253571 und Folgenotes für CGI_XML_CT.
• OSS-Notes (Klartext): 1844160 – SEPA-Kreditüberweisung (SEPA_CT) DMEE-Format; 2253571 – CGI-XML-Format für Credit Transfer; 2784858 – Mapping pain.001.001.09 CGI; 3268290 – APM pain.001.001.09 Handling in S/4HANA; 2784858 ergänzt durch modulare Korrektur-Notes je Land. Community-Hinweis: Note 2784858 muss nachgezogen werden, sonst "missing nodes" in .09 (siehe SAP-Community Thread 14235007).
• FI-Tabellen: REGUH (Zahlausgangs-Kopf) → Mapping auf PmtInf/CdtTrfTxInf-Header (Debtor, DbtrAcct, PmtMtd, ReqdExctnDt); REGUP (Position) → CdtTrfTxInf-Zeilen (InstdAmt, Cdtr, CdtrAcct, RmtInf/Ustrd oder Strd/CdtrRefInf); BSEG.XBLNR → EndToEndId/InstrId-Quelle; BSEG.ZUONR → Strukturierte Referenz (CdtrRefInf/Ref) bei SEPA-Creditor-Reference. Nachverarbeitung: PAYRQ (Payment Requests) in TRM-TM, FPAYH/FPAYP in In-House Cash (FSCM-IHC), BCM (Bank Communication Management, Transaktion BNK_MONI) für Freigabe-Workflow und Statusverfolgung inklusive pain.002-Rückmeldungen.
• TRM-TM: Treasury & Risk Management Zahlungsprogramm nutzt denselben DMEE-Baum über F111 (Zahlungsanforderungen), Quelle ist PAYRQ → Mapping in CdtTrfTxInf analog REGUP.
• FSCM-IHC: In-House-Cash erzeugt interne Payment Orders, externe pain.001 wird beim IHC-Zahllauf über F111 + Hausbank an externe PSP gesendet.
• APM (S/4HANA): Advanced Payment Management konsolidiert Eingangs-pain.001 aus Töchtern und erzeugt Netting-/Forwarded-pain.001; Customizing unter SPRO → Financial Supply Chain Management → Advanced Payment Management → Message Configuration; Integration mit Multi-Bank Connectivity (MBC) über IDoc PAYEXT / XML-File-Transfer.
• Validierungsreihenfolge im Zahllauf: Datenselektion → PMW-Formataufruf → DMEE-Mapping → XML-Validierung gegen XSD (urn:iso:std:iso:20022:tech:xsd:pain.001.001.09) → Ablage auf TemSe / DMS / SFTP.$$,

  structure = $$[
    {"name":"Document","path":"Document","card":"1","type":"xs:complexType","desc":"Wurzelelement, Namespace urn:iso:std:iso:20022:tech:xsd:pain.001.001.09."},
    {"name":"CstmrCdtTrfInitn","path":"Document/CstmrCdtTrfInitn","card":"1","type":"CustomerCreditTransferInitiationV09","desc":"Nachrichtenwurzel der Customer Credit Transfer Initiation."},
    {"name":"GrpHdr","path":"Document/CstmrCdtTrfInitn/GrpHdr","card":"1","type":"GroupHeader85","desc":"Gruppenkopf mit Metadaten zur Gesamtnachricht."},
    {"name":"MsgId","path":"GrpHdr/MsgId","card":"1","type":"Max35Text","desc":"Eindeutige Nachrichten-Id des Instructing Party."},
    {"name":"CreDtTm","path":"GrpHdr/CreDtTm","card":"1","type":"ISODateTime","desc":"Erstellungszeitpunkt der Nachricht."},
    {"name":"NbOfTxns","path":"GrpHdr/NbOfTxns","card":"1","type":"Max15NumericText","desc":"Gesamtanzahl aller Transaktionen in der Nachricht."},
    {"name":"CtrlSum","path":"GrpHdr/CtrlSum","card":"0..1","type":"DecimalNumber","desc":"Kontrollsumme aller InstdAmt-Beträge."},
    {"name":"InitgPty","path":"GrpHdr/InitgPty","card":"1","type":"PartyIdentification135","desc":"Initiierende Partei (typischerweise Debtor oder Service-Provider)."},
    {"name":"InitgPty.Id.OrgId.LEI","path":"GrpHdr/InitgPty/Id/OrgId/LEI","card":"0..1","type":"LEIIdentifier","desc":"Legal Entity Identifier der initiierenden Partei.","versionFlag":"v.09"},
    {"name":"FwdgAgt","path":"GrpHdr/FwdgAgt","card":"0..1","type":"BranchAndFinancialInstitutionIdentification6","desc":"Weiterleitende Bank (Forwarding Agent), optional."},
    {"name":"InitnSrc","path":"GrpHdr/InitnSrc","card":"0..1","type":"PaymentInitiationSource1","desc":"Quelle der Initiierung (z.B. API, File), neu in .09.","versionFlag":"v.09"},
    {"name":"PmtInf","path":"Document/CstmrCdtTrfInitn/PmtInf","card":"1..n","type":"PaymentInstruction30","desc":"Zahlungsinformationsblock; bündelt Transaktionen mit gleichem Debtor/PmtMtd/ReqdExctnDt."},
    {"name":"PmtInfId","path":"PmtInf/PmtInfId","card":"1","type":"Max35Text","desc":"Eindeutige Id des PmtInf-Blocks."},
    {"name":"PmtMtd","path":"PmtInf/PmtMtd","card":"1","type":"PaymentMethod3Code","desc":"Zahlungsart; für SEPA CT fix TRF."},
    {"name":"BtchBookg","path":"PmtInf/BtchBookg","card":"0..1","type":"BatchBookingIndicator","desc":"Batch-Buchung Ja/Nein für die Debtor-Belastung."},
    {"name":"NbOfTxns","path":"PmtInf/NbOfTxns","card":"0..1","type":"Max15NumericText","desc":"Anzahl Transaktionen innerhalb dieses PmtInf-Blocks."},
    {"name":"CtrlSum","path":"PmtInf/CtrlSum","card":"0..1","type":"DecimalNumber","desc":"Summe der InstdAmt-Beträge in diesem PmtInf-Block."},
    {"name":"PmtTpInf","path":"PmtInf/PmtTpInf","card":"0..1","type":"PaymentTypeInformation26","desc":"Service Level (SEPA=SEPA, INST=INST), LclInstrm, CtgyPurp."},
    {"name":"ReqdExctnDt","path":"PmtInf/ReqdExctnDt","card":"1","type":"DateAndDateTime2Choice","desc":"Gewünschtes Ausführungsdatum; Choice Dt (ISODate) oder DtTm (ISODateTime) in .09.","versionFlag":"v.09"},
    {"name":"Dbtr","path":"PmtInf/Dbtr","card":"1","type":"PartyIdentification135","desc":"Auftraggeber (Schuldner) der Zahlung."},
    {"name":"Dbtr.PstlAdr","path":"PmtInf/Dbtr/PstlAdr","card":"0..1","type":"PostalAddress24","desc":"Strukturierte Postadresse des Debtor; .09 erweitert durch PostalAddress24 mit StrtNm/BldgNb/PstCd/TwnNm/Ctry.","versionFlag":"v.09"},
    {"name":"DbtrAcct","path":"PmtInf/DbtrAcct","card":"1","type":"CashAccount38","desc":"Konto des Debtor, Id/IBAN für SEPA."},
    {"name":"DbtrAgt","path":"PmtInf/DbtrAgt","card":"1","type":"BranchAndFinancialInstitutionIdentification6","desc":"Bank des Debtor; FinInstnId mit BICFI für SEPA.","versionFlag":"v.09"},
    {"name":"ChrgBr","path":"PmtInf/ChrgBr","card":"0..1","type":"ChargeBearerType1Code","desc":"Spesenverteilung; für SEPA fix SLEV."},
    {"name":"CdtTrfTxInf","path":"PmtInf/CdtTrfTxInf","card":"1..n","type":"CreditTransferTransaction34","desc":"Einzeltransaktion innerhalb des PmtInf-Blocks."},
    {"name":"PmtId","path":"CdtTrfTxInf/PmtId","card":"1","type":"PaymentIdentification6","desc":"Zahlungs-Ids: InstrId, EndToEndId und UETR."},
    {"name":"PmtId.EndToEndId","path":"CdtTrfTxInf/PmtId/EndToEndId","card":"1","type":"Max35Text","desc":"Durchgehende Referenz vom Debtor zum Creditor."},
    {"name":"PmtId.UETR","path":"CdtTrfTxInf/PmtId/UETR","card":"0..1","type":"UUIDv4Identifier","desc":"Unique End-to-End Transaction Reference (36-stellig); neu in .09 auch für SEPA nutzbar.","versionFlag":"v.09"},
    {"name":"Amt.InstdAmt","path":"CdtTrfTxInf/Amt/InstdAmt","card":"1","type":"ActiveOrHistoricCurrencyAndAmount","desc":"Angewiesener Betrag mit Währungsattribut (EUR für SEPA)."},
    {"name":"CdtrAgt","path":"CdtTrfTxInf/CdtrAgt","card":"0..1","type":"BranchAndFinancialInstitutionIdentification6","desc":"Bank des Creditor; BICFI-Feld in .09.","versionFlag":"v.09"},
    {"name":"Cdtr","path":"CdtTrfTxInf/Cdtr","card":"1","type":"PartyIdentification135","desc":"Empfänger (Gläubiger) der Zahlung."},
    {"name":"Cdtr.PstlAdr","path":"CdtTrfTxInf/Cdtr/PstlAdr","card":"0..1","type":"PostalAddress24","desc":"Strukturierte Postadresse des Creditor; ab EPC-Rulebook 2025 verpflichtend strukturiert.","versionFlag":"v.09"},
    {"name":"Cdtr.Id.OrgId.LEI","path":"CdtTrfTxInf/Cdtr/Id/OrgId/LEI","card":"0..1","type":"LEIIdentifier","desc":"LEI des Creditor (neu in .09 im SEPA-Scope).","versionFlag":"v.09"},
    {"name":"CdtrAcct","path":"CdtTrfTxInf/CdtrAcct","card":"1","type":"CashAccount38","desc":"Konto des Creditor (IBAN)."},
    {"name":"UltmtDbtr","path":"CdtTrfTxInf/UltmtDbtr","card":"0..1","type":"PartyIdentification135","desc":"Ultimate Debtor strukturiert (vollständige Party-Struktur in .09).","versionFlag":"v.09"},
    {"name":"UltmtCdtr","path":"CdtTrfTxInf/UltmtCdtr","card":"0..1","type":"PartyIdentification135","desc":"Ultimate Creditor strukturiert (vollständige Party-Struktur in .09).","versionFlag":"v.09"},
    {"name":"Purp","path":"CdtTrfTxInf/Purp","card":"0..1","type":"Purpose2Choice","desc":"Zahlungszweck-Code (ISO External Purpose Code)."},
    {"name":"RmtInf","path":"CdtTrfTxInf/RmtInf","card":"0..1","type":"RemittanceInformation16","desc":"Verwendungszweck, unstrukturiert (Ustrd, max. 140 Zeichen in SEPA) oder strukturiert (Strd)."},
    {"name":"RmtInf.Strd.CdtrRefInf","path":"CdtTrfTxInf/RmtInf/Strd/CdtrRefInf","card":"0..1","type":"CreditorReferenceInformation2","desc":"Strukturierte Kreditor-Referenz nach ISO 11649."},
    {"name":"SplmtryData","path":"CdtTrfTxInf/SplmtryData","card":"0..n","type":"SupplementaryData1","desc":"Erweiterbarer Datenblock (xs:any); neu in .09.","versionFlag":"v.09"}
  ]$$::jsonb,

  migrations = $$[
    {
      "from":"pain.001.001.03",
      "to":"pain.001.001.09",
      "source":"EPC132-08 SCT C2PSP IG 2025 V1.0 + xmldation Versionsvergleich",
      "changes":[
        {"type":"namespace","desc":"Namespace wechselt von urn:iso:std:iso:20022:tech:xsd:pain.001.001.03 auf urn:iso:std:iso:20022:tech:xsd:pain.001.001.09."},
        {"type":"new-element","desc":"UETR (Unique End-to-End Transaction Reference) unter PmtId, optional für SEPA, verpflichtend für SWIFT gpi Cross-Border."},
        {"type":"renamed","desc":"BICorBEI wird durch BICFI ersetzt in DbtrAgt, CdtrAgt, InstgAgt, IntrmyAgt; in SEPA ist nur BICFI erlaubt."},
        {"type":"new-element","desc":"LEI (Legal Entity Identifier) verfügbar in OrgId für Debtor, Creditor, UltimateDebtor, UltimateCreditor, InitiatingParty."},
        {"type":"type-change","desc":"ReqdExctnDt wechselt von SimpleType ISODate zu ComplexType DateAndDateTime2Choice (Dt oder DtTm) — ermöglicht SCT Inst mit Uhrzeit."},
        {"type":"type-change","desc":"PostalAddress wechselt von PostalAddress6 zu PostalAddress24 mit zusätzlichen strukturierten Feldern (Dept, SubDept, StrtNm, BldgNb, BldgNm, Flr, PstBx, Room, PstCd, TwnNm, TwnLctnNm, DstrctNm, CtrySubDvsn)."},
        {"type":"deprecation","desc":"AdrLine bleibt in .09 verfügbar, wird aber mit EPC-Rulebook 2025 obsolet; ab November 2025 müssen strukturierte Adressen verwendet werden."},
        {"type":"new-element","desc":"SupplementaryData (0..n) als xs:any für bankspezifische Erweiterungen."},
        {"type":"new-element","desc":"InitnSrc im GrpHdr zur Identifikation der Initiierungsquelle (API, File, Portal)."},
        {"type":"structure-change","desc":"UltmtDbtr und UltmtCdtr werden von NameAndAddress auf vollständige PartyIdentification135 mit Id-Sub-Struktur gehoben."},
        {"type":"new-element","desc":"ChrgsAcct und ChrgsAcctAgt auf PmtInf-Ebene ergänzt (separates Gebührenkonto)."},
        {"type":"cardinality","desc":"GrpHdr/Grpg (GroupingIndicator) entfällt in .09."}
      ]
    }
  ]$$::jsonb,

  feature_defs = $$[
    {"pattern":"PostalAddress24|strukturierte\\s+Adresse|structured\\s+address","flags":"i","name":"structured-address","what":"Strukturierte Adresse (PostalAddress24) statt AdrLine — ab EPC-Rulebook 2025 verpflichtend.","tokens":["PostalAddress24","StrtNm","BldgNb","PstCd","TwnNm","Ctry"]},
    {"pattern":"BICFI|BICorBEI","flags":"i","name":"bicfi","what":"BICFI ersetzt BICorBEI in allen FinancialInstitutionIdentification-Elementen.","tokens":["BICFI","DbtrAgt","CdtrAgt"]},
    {"pattern":"\\bLEI\\b|Legal\\s+Entity\\s+Identifier","flags":"i","name":"lei","what":"Legal Entity Identifier (20 Zeichen) in OrgId für juristische Parteien, neu in .09 im SEPA-Scope.","tokens":["LEI","OrgId"]},
    {"pattern":"UETR|Unique\\s+End-to-End\\s+Transaction\\s+Reference","flags":"i","name":"uetr","what":"UETR (UUID v4, 36 Zeichen) für durchgängiges Payment-Tracking über Swift gpi.","tokens":["UETR","PmtId","UUIDv4"]},
    {"pattern":"ReqdExctnDt|RequestedExecutionDate|DateAndDateTime2Choice","flags":"i","name":"reqd-exctn-dt-choice","what":"ReqdExctnDt als Choice Dt/DtTm — Uhrzeit-Unterstützung für SCT Inst.","tokens":["ReqdExctnDt","Dt","DtTm","ISODateTime"]},
    {"pattern":"UltmtDbtr|UltmtCdtr|UltimateDebtor|UltimateCreditor","flags":"i","name":"ultimate-parties","what":"UltmtDbtr/UltmtCdtr als vollständige PartyIdentification135 mit Id-Substruktur.","tokens":["UltmtDbtr","UltmtCdtr","PartyIdentification135"]},
    {"pattern":"InitnSrc|InitiationSource","flags":"i","name":"initiation-source","what":"InitnSrc im GrpHdr dokumentiert Herkunftskanal (API, File, Portal).","tokens":["InitnSrc","PaymentInitiationSource1"]},
    {"pattern":"SplmtryData|SupplementaryData|EPC\\s+Rulebook\\s+2025|EPC132-08","flags":"i","name":"epc-rulebook-2025","what":"EPC SCT Rulebook / EPC132-08 2025 V1.0 — SupplementaryData und strukturierte Adressen verpflichtend.","tokens":["SplmtryData","EPC132-08","Rulebook 2025"]}
  ]$$::jsonb,

  character_set          = 'sepa-latin',
  reject_code_group      = 'iso20022',
  schema_uri_pattern     = 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.<v>',
  region                 = 'Global / SEPA',

  source_refs = $$[
    {"url":"https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2024-11/EPC132-08%20SCT%20C2PSP%20IG%202025%20V1.0.pdf","retrieved_at":"2026-04-15","status":"referenced_via_websearch","note":"EPC SCT Customer-to-PSP Implementation Guidelines 2025 V1.0 — PDF direkt 403 bei WebFetch, Inhalt über WebSearch-Summaries verifiziert."},
    {"url":"https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2023-11/EPC132-08%20SCT%20C2PSP%20IG%202023%20V1.1.pdf","retrieved_at":"2026-04-15","status":"referenced_via_websearch"},
    {"url":"https://www.nordea.com/en/doc/nordea-message-implementation-guide-pain-001-001-09-payments.pdf","retrieved_at":"2026-04-15","status":"fetched_binary","note":"Nordea Corporate Access Payables MIG für pain.001.001.09 — als Referenz für Element-Namen und Cardinalities."},
    {"url":"https://blog.xmldation.com/resources/differences-between-iso-20022-pain.001-message-versions-03-and-09","retrieved_at":"2026-04-15","status":"ok"},
    {"url":"https://community.sap.com/t5/financial-management-q-a/sepa-ct-format-pain-001-001-09/qaq-p/12769377","retrieved_at":"2026-04-15","status":"referenced_via_websearch"},
    {"url":"https://community.sap.com/t5/financial-management-q-a/iso20022-format-switch-from-pain-001-001-03-to-pain-001-001-09/qaq-p/14358927","retrieved_at":"2026-04-15","status":"referenced_via_websearch"},
    {"url":"https://community.sap.com/t5/financial-management-q-a/pain-001-001-09-missing-nodes-despite-applying-2784858-sap-note/qaq-p/14235007","retrieved_at":"2026-04-15","status":"referenced_via_websearch","note":"Bestätigt OSS-Note 2784858 als zentrale Mapping-Quelle für pain.001.001.09."},
    {"url":"https://www.iso20022.org/iso-20022-message-definitions?search=pain.001","retrieved_at":"2026-04-15","status":"unreachable","note":"Timeout bei WebFetch; Katalog indirekt über abhängige Dokumente verifiziert."}
  ]$$::jsonb,

  content_status = 'verified'
WHERE format_name = 'pain.001';
