---
format_name: CBI
aktuelle_version: "CBI Globe / CBI Hub (XML ISO 20022-basiert)"
nachrichtentyp: Corporate Banking Interbancario — Interbank-Zahlungsinfrastruktur (Italien)
familie_standard: Italy Local
datenrichtung: Ausgehend (Corporate → Bank) + Eingehend (Bank → Corporate)
sap_relevanz: SAP ERP / S/4HANA — über DMEE/DMEEX-Formatdefinitionen oder Bankadapter; kein natives SAP-Format; erfordert Custom-DMEE oder Middleware (SWIFT Alliance, Kyriba, TreasuryXpress)
status: Aktiv — Ablösung durch SEPA-Formate für Inlandszahlungen; CBI Globe für SEPA SCT Inst und grenzüberschreitende Zahlungen weiterhin aktiv
---

# CBI — Corporate Banking Interbancario (Italien)

**Stand:** April 2026 | **Quellen:** CBI S.c.p.A. (www.cbinews.it), Banca d'Italia, ABI Lab

## Zweck & Verwendung

### Experte

**CBI (Corporate Banking Interbancario)** ist das zentrale italienische Interbank-Zahlungsnetzwerk für Firmenkunden, betrieben von der **CBI S.c.p.A.** (einem Konsortium der ABI — Associazione Bancaria Italiana). CBI umfasst zwei Kernkomponenten:

**CBI Hub**: Historische Plattform für den standardisierten Austausch von Zahlungsanweisungen, Kontoauszügen und Bestätigungen zwischen Unternehmen und ihren Hausbanken. CBI Hub nutzt proprietäre XML-basierte Nachrichtenformate (CBI-SEPA-XML), die auf ISO 20022 abgestimmt aber nicht identisch sind. Typische Nachrichtentypen: `CBIBdyPaymentRequest`, `CBIBdyIRF` (Instant Request for Funds), `CBIBdyCSM` (Kontoauszug-Meldung).

**CBI Globe**: Modernes Open-Banking- und Interoperabilitäts-Framework (seit 2018), das PSD2-konforme API-Schnittstellen (RESTful, OAuth 2.0) sowie SEPA Instant Credit Transfer (SCT Inst) auf EPC-Basis bereitstellt. CBI Globe ist als TP-Infrastruktur (Third Party Provider-Infrastruktur) zugelassen und verbindet Firmenkunden über standardisierte APIs mit dem europäischen Zahlungsraum.

Für SAP-Projekte in Italien bedeutet CBI: manuelle DMEE-Konfiguration oder Einsatz eines zertifizierten Bankadapters (z. B. Serrala, BCB), da SAP keine native CBI-Unterstützung liefert.

### Einsteiger

CBI ist das zentrale Zahlungsnetzwerk für Unternehmen in Italien — vergleichbar mit dem deutschen EBICS-System, aber mit eigenen Nachrichtenformaten. Über CBI können Unternehmen Überweisungen beauftragen, Lastschriften einreichen und Kontoauszüge abrufen. Das System verbindet Firmen mit ihren Banken nach einem einheitlichen Standard, der von nahezu allen italienischen Banken unterstützt wird. Für SAP-Projekte in Italien ist CBI ein wichtiges Thema, weil SAP keine fertige CBI-Unterstützung liefert und ein Custom-Anschluss entwickelt werden muss.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1995 | CBI-Konsortium von ABI gegründet; proprietäre Interbank-Standards |
| 2008–2012 | Migration auf CBI-SEPA-XML (ISO-20022-orientiert) für SEPA SCT und SDD |
| 2018 | CBI Globe als Open-Banking-Plattform launched; PSD2-konforme APIs |
| 2019 | CBI Globe als offiziell zugelassener TP-Infrastrukturanbieter (Banca d'Italia) |
| 2021 | CBI Hub Support für SEPA Instant Credit Transfer (SCT Inst) |
| 2023 | CBI Globe v3.0 mit erweiterter ISO 20022 MX-Unterstützung (pain.001.001.09, camt.052/053) |

## Wichtige Felder (technisch)

| CBI-Element | ISO-20022-Pendant | Pflicht |
|---|---|---|
| `CBIBdyPaymentRequest/GrpHdr` | pain.001/GrpHdr | Ja |
| `InitgPty/Nm` | pain.001/InitgPty/Nm | Ja |
| `PmtInf/PmtMtd` | TRF (Überweisung) / DD (Lastschrift) | Ja |
| `CdtTrfTxInf/Amt/InstdAmt` | Betrag in EUR, max. 15 Stellen | Ja |
| `CdtTrfTxInf/CdtrAcct/Id/IBAN` | Empfänger-IBAN (IT oder EU) | Ja |
| `CdtTrfTxInf/RmtInf/Ustrd` | Verwendungszweck, max. 140 Zeichen | Nein |
| `CBI-spezifisch: PmtInf/CdtPrtcl` | CBI-Protokollkennung | Ja |

## Pflichtfelder (Kurzliste)

GrpHdr (MsgId, CreDtTm, NbOfTxs, CtrlSum) · PmtInf/PmtMtd · CdtTrfTxInf/InstdAmt · Debtor-IBAN · Creditor-IBAN · CBI-Protokollkennung

## SAP-Mapping

### Experte

SAP bietet keine native CBI-Unterstützung. Typische Integrationsszenarien:
- **DMEE-Framework (SAP)**: Eigenentwicklung eines CBI-kompatiblen XML-DMEE-Formats auf Basis der CBI-Schemata. Erfordert Pflege der Tabellen `DFTXML`, `DFTXMLTX` und manuelle Schema-Einbindung.
- **Bankadapter**: Drittanbieter wie Serrala FS² oder BCB bieten zertifizierte CBI-Konnektoren für SAP an (typischerweise als AddOn mit eigenem Customizing-Bereich).
- **Middleware**: SWIFT Alliance Gateway oder Kyriba als Zwischenschicht zwischen SAP (pain.001-Ausgabe) und CBI-Netz (Konvertierung in CBI-XML).
- **F110/REGUH**: Zahlungsausgangsprogramm erzeugt REGUH/REGUP-Einträge → Übergabe an DMEE oder Adapter → CBI-Einreichung über EBICS (in Italien über CBI direkt).

### Einsteiger

SAP kennt CBI nicht von Haus aus. Das bedeutet: Entweder kauft das Unternehmen ein spezielles SAP-Erweiterungspaket (Add-on) eines Drittanbieters, das CBI versteht, oder ein IT-Berater entwickelt eine individuelle Schnittstelle. In der Praxis laufen Zahlungen in SAP (Transaktion F110) an und werden dann über eine Umwandlung (DMEE oder externe Software) ins CBI-Format übertragen, bevor sie zur Bank gesendet werden.

## Typische Fehlerquellen

### Experte

- **Schema-Versionsmischung**: CBI Hub und CBI Globe nutzen leicht unterschiedliche XML-Namespaces — ein Namespace-Fehler führt zur vollständigen Ablehnung der Nachricht.
- **IBAN-Validierung**: Italienische IBANs (IT + 2 Prüfziffern + 23 alphanumerische Zeichen) müssen CBI-seitig validiert werden; falsche Prüfziffern werden abgewiesen.
- **Doppel-Einreichung (Duplikat-Schutz)**: CBI prüft MsgId und PmtInfId auf Eindeutigkeit pro Bankverbindung — identische IDs führen zu RJCT.
- **Zeichensatz**: CBI Hub akzeptiert nur SEPA-Zeichensatz (Latin-Basis, keine Umlaute, kein Sonderzeichen außer SEPA-Allowed). Italienische Zeichen (à, è, ì, ò, ù) müssen transliteriert werden.

### Einsteiger

- Die Datei wird abgelehnt, weil eine falsche Versionsnummer des CBI-Schemas verwendet wird — der Unterschied zwischen CBI Hub und CBI Globe ist dem Team nicht bekannt.
- Die IBAN des Empfängers ist korrekt, aber die CBI-Validierung schlägt wegen Zeichensatzproblemen fehl (Sonderzeichen im Verwendungszweck).
- Das Unternehmen schickt dieselbe Zahlung zweimal (gleiche MsgId) — CBI lehnt die zweite Einreichung als Duplikat ab.

## Häufige Projektfehler

### Experte

- **Fehlende CBI-Zertifizierung**: Der Bankadapter muss von CBI S.c.p.A. zertifiziert sein — Eigenentwicklungen ohne Zertifizierung werden von der Bank oft nicht akzeptiert.
- **EBICS vs. CBI Direct**: In Italien wird CBI oft über EBICS (T-Level oder E-Level) übertragen — das Projekt muss klären, welcher Transportkanal (CBI Direct Connectivity vs. Bank-EBICS) genutzt wird.
- **Paralleltest mit Bank fehlt**: CBI-Banken haben eigene Testumgebungen (CBI Test Hub) — ohne Paralleltest in der Bank-Sandbox werden Produktionsfehler erst nach Go-Live entdeckt.

### Einsteiger

- Das Projekt unterschätzt den Aufwand für die CBI-Anbindung: "Da SAP das macht" — stimmt nicht, CBI ist kein Standard-SAP-Feature.
- Der Wechsel von einer deutschen auf eine italienische Bankverbindung bringt CBI-Anforderungen mit sich, die niemand im Team kennt.
- Das Unternehmen versucht, pain.001-Dateien direkt an die CBI-Bank zu schicken — die Bank akzeptiert nur CBI-XML, kein generisches pain.001.
