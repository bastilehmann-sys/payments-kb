---
format_name: FatturaPA
aktuelle_version: "FatturaPA v1.3 (SDI-Pflichtformat, D.Lgs. 127/2015)"
nachrichtentyp: Elektronische Rechnung (e-Invoice) — SDI-System (Sistema di Interscambio), Agenzia delle Entrate
familie_standard: Italy Local
datenrichtung: Ausgehend (Lieferant → SDI → Empfänger) + Eingehend (SDI → Empfänger)
sap_relevanz: SAP Document and Reporting Compliance (DRC) / SAP Advanced Compliance Reporting (ACR); S/4HANA lokale Compliance-Lösung für Italien; auch über Drittanbieter (Comarch, Sovos, TrustWeaver)
status: Aktiv — Pflichtformat für alle B2B- und B2G-Rechnungen in Italien seit 2019
---

# FatturaPA — SDI e-Invoice (Italien)

**Stand:** April 2026 | **Quellen:** Agenzia delle Entrate (agenziaentrate.gov.it), D.Lgs. 127/2015, Specifiche Tecniche v1.3

## Zweck & Verwendung

### Experte

**FatturaPA** ist das italienische Pflichtformat für elektronische Rechnungen (e-Invoicing), vorgeschrieben durch das Decreto Legislativo 127/2015. Das Format ist seit dem **1. Januar 2019** für alle B2B-Transaktionen (und seit 2018 für B2G) verpflichtend. Alle Rechnungen müssen über das **SDI (Sistema di Interscambio)** der Agenzia delle Entrate (italienische Finanzbehörde) übermittelt werden — eine direkte Rechnungsübermittlung zwischen Unternehmen ist nicht zulässig.

**Technisch**: FatturaPA ist ein XML-Format mit eigenem Schema (`.xsd`-Definition der Agenzia). Die Rechnung wird mit einem qualifizierten Zertifikat (XAdES-BES oder CAdES-BES) digital signiert. Übermittlung an SDI per: SDI-Web-Interface, PEC (Posta Elettronica Certificata), FTP-Kanal oder API-Webservice.

**SDI-Routing**: Empfänger wird über `CodiceDestinatario` (7-stelliger Code) oder PEC-Adresse des Empfängers identifiziert. SDI liefert die Rechnung innerhalb von 5 Tagen und sendet eine Empfangsbestätigung (`RicevutaConsegna`) oder Ablehnungsnachricht (`NotificaEsito`).

Für SAP-Projekte: **SAP DRC (Document and Reporting Compliance)** bietet eine lokale Lösung für Italien (eDocument Italy) mit ABAP-basierter XML-Generierung und SDI-Übermittlung. Alternativ nutzen viele Unternehmen zertifizierte Drittanbieter-Clearinghäuser.

### Einsteiger

FatturaPA ist die Pflicht-E-Rechnung für alle Unternehmen in Italien. Seit 2019 darf keine Papierrechnung mehr zwischen Firmen in Italien ausgestellt werden — alles muss elektronisch über das staatliche SDI-System laufen. Das SDI funktioniert wie ein Postamt: Lieferant schickt Rechnung ans SDI, SDI prüft das Format, leitet die Rechnung an den Empfänger weiter und bestätigt die Zustellung. Für SAP-Projekte in Italien ist FatturaPA ein Muss-Thema — SAP hat eine Compliance-Lösung dafür, aber viele Unternehmen nutzen auch externe Clearinghäuser.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 2015 | D.Lgs. 127/2015 verabschiedet: FatturaPA als Pflicht für B2G |
| 2018-01-01 | Pflicht für Subunternehmer und Dienstleister der öffentlichen Hand |
| 2019-01-01 | Pflicht für alle B2B-Transaktionen in Italien |
| 2020 | Specifiche Tecniche v1.2 — Erweiterungen für Steuervertreter und NSO |
| 2021 | Specifiche Tecniche v1.3 — aktuelle Version; Erweiterungen für QR-Code, Einbehalte |
| 2024 | Pflicht für grenzüberschreitende Transaktionen (Esterometro-Integration) geplant |

## Wichtige Felder (technisch)

| FatturaPA-Element | Beschreibung | Pflicht |
|---|---|---|
| `DatiTrasmissione/ProgressivoInvio` | Sequenznummer der Sendung | Ja |
| `DatiTrasmissione/CodiceDestinatario` | 7-stelliger SDI-Empfängercode | Ja |
| `CedentePrestatore/DatiAnagrafici` | Lieferanten-Stammdaten (P.IVA, CF) | Ja |
| `CessionarioCommittente/DatiAnagrafici` | Empfänger-Stammdaten | Ja |
| `DatiGeneraliDocumento/TipoDocumento` | Dokumenttyp (TD01=Rechnung, TD04=Gutschrift) | Ja |
| `DatiGeneraliDocumento/Data` | Rechnungsdatum | Ja |
| `DatiGeneraliDocumento/Numero` | Rechnungsnummer | Ja |
| `DettaglioLinee/PrezzoUnitario` | Einzelpreis je Rechnungsposition | Ja |
| `DatiRiepilogo/AliquotaIVA` | MwSt-Satz (0–22%) | Ja |
| `DatiPagamento/ModalitaPagamento` | Zahlungsmodalität (MP01=bar, MP05=Überweisung) | Ja |

## Pflichtfelder (Kurzliste)

`ProgressivoInvio` · `CodiceDestinatario` · P.IVA Lieferant · P.IVA Empfänger · `TipoDocumento` · Datum · Nummer · Betrag · MwSt-Satz · IBAN (bei Banküberweisung als Zahlungsmodalität)

## SAP-Mapping

### Experte

- **SAP eDocument Italy (DRC)**: Bestandteil von SAP Document and Reporting Compliance (S/4HANA) oder als Add-On für SAP ERP. Erzeugt FatturaPA-XML direkt aus SD/FI-Belegen (Tabellen `VBRK`, `BKPF`, `VBRP`). Konfiguration in Transaktion `EDOCIT` oder über DRC-Customizing.
- **Digitale Signatur**: SAP DRC integriert Signatur über SAP Trust Manager oder externen Signaturservice (Entrust, GlobalSign); Zertifikat muss von der Agenzia delle Entrate zugelassen sein.
- **SDI-Übermittlung**: Über SAP-eigenen Web-Service-Connector oder zertifizierten Clearinghouse-Adapter (Comarch, Sovos, Edicom).
- **Steuer-Mapping**: MwSt-Codes (`MWST`) → FatturaPA-`AliquotaIVA` muss vollständig konfiguriert sein; IVA-Reverse-Charge-Szenarien (N6.x-Codes) erfordern eigene Zuordnung.
- **Empfang (Inbound)**: SDI-Eingangsrechnungen als FatturaPA-XML in SAP MM/FI verarbeiten über EDOC-Inbound-Interface oder Drittanbieter.

### Einsteiger

SAP hat für die FatturaPA-Pflicht eine fertige Lösung eingebaut (nennt sich "eDocument Italy" oder "DRC"). Diese Lösung nimmt Rechnungen aus SAP, wandelt sie ins FatturaPA-XML-Format um, signiert sie digital und schickt sie ans SDI. Für Eingangsrechnungen (Lieferanten schicken FatturaPA an das Unternehmen) muss ebenfalls eine Lösung konfiguriert werden. Viele mittelgroße Unternehmen nutzen auch externe Dienstleister, die das Clearinghouse übernehmen.

## Typische Fehlerquellen

### Experte

- **P.IVA-Validierung**: Partita IVA (Umsatzsteuer-ID) muss 11-stellig (Firmen) oder Codice Fiscale 16-stellig (Privatpersonen) korrekt sein — SDI lehnt bei Formatfehler ohne Rückmeldung über Ursache ab.
- **`CodiceDestinatario` unbekannt**: Wenn der Empfänger keinen SDI-Code hat und keine PEC-Adresse angegeben ist, muss `0000000` (für Privatpersonen) oder `XXXXXXX` (für ausländische Empfänger) verwendet werden.
- **Signaturzertifikat abgelaufen**: FatturaPA-Signatur mit abgelaufenem Zertifikat wird von SDI abgewiesen (Fehler `EC0438`).
- **XML-Schema-Fehler**: Abweichungen vom FatturaPA-v1.3-XSD-Schema führen zu `NotificaScarto` (Ablehnungsnotifikation vom SDI).
- **Codice Fiscale des Empfängers fehlt**: Bei B2C-Rechnungen muss der Codice Fiscale des Kunden vorhanden sein — fehlt er, muss `0000000` als CodiceDestinatario genutzt werden.

### Einsteiger

- Die Rechnung wird vom SDI abgelehnt, weil die Steuernummer des Kunden falsch oder unvollständig eingetragen ist.
- Das digitale Signaturzertifikat ist abgelaufen — SAP schickt die Rechnung, SDI nimmt sie nicht an, aber niemand merkt es sofort.
- Der Empfänger hat keinen SDI-Code hinterlegt — die Rechnung landet im "Limbo" und muss manuell nachverfolgt werden.

## Häufige Projektfehler

### Experte

- **Testumgebung SDI fehlt**: Agenzia delle Entrate stellt eine SDI-Testumgebung bereit (`fatturapa.gov.it/fatturapa/utils`), die selten ausreichend genutzt wird — Produktionsfehler werden erst nach Go-Live entdeckt.
- **Steuerliche Sonderfälle nicht berücksichtigt**: Reverse-Charge (Umkehr der Steuerschuldnerschaft, Codes N6.1–N6.9), steuerbefreite Positionen (N1–N4) und Einbehalte (Ritenute d'acconto) erfordern spezifische FatturaPA-Felder, die im SAP-Customizing oft fehlen.
- **Timing der Statusverarbeitung**: SDI-Bestätigungen (RicevutaConsegna, NotificaEsito) müssen zeitnah in SAP verarbeitet werden — Verzögerungen führen zu falscher Debitorenbuchhaltung.
- **Archivierungspflicht**: FatturaPA-Rechnungen müssen 10 Jahre digital archiviert werden (Decreto MEF 2014) — SAP-Archivierungslösung muss konfiguriert sein.

### Einsteiger

- Das Go-Live scheitert, weil das Signaturzertifikat nicht rechtzeitig beantragt wurde — Beschaffung dauert in Italien oft 2–4 Wochen.
- Das Projekt vergisst die Archivierungspflicht: FatturaPA-Rechnungen müssen 10 Jahre aufbewahrt werden — eine fehlende Archivierungslösung ist ein Compliance-Risiko.
- Die Steuerbefreiungen (N-Codes) sind nicht korrekt konfiguriert — Rechnungen werden als steuerbar eingestuft, obwohl sie steuerbefreit sind.
