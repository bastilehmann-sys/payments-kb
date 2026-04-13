---
format_name: RIBA
aktuelle_version: "RIBA CBI-XML (elektronische Ricevuta Bancaria)"
nachrichtentyp: Ricevuta Bancaria — Elektronisches Inkasso-/Lastschrift-Äquivalent (Italien)
familie_standard: Italy Local
datenrichtung: Ausgehend (Creditor → Bank) für Einreichung; Eingehend (Bank → Corporate) für Statusmeldungen
sap_relevanz: SAP ERP / S/4HANA — nur über Custom-DMEE oder Bankadapter (Serrala, BCB); kein natives SAP-RIBA-Format; typischerweise über FI-AR-Modul (Debitorenbuchhaltung) initiiert
status: Aktiv — weit verbreitet in Italien für B2B-Inkasso; langsame Migration zu SEPA SDD B2B
---

# RIBA — Ricevuta Bancaria (Italien)

**Stand:** April 2026 | **Quellen:** ABI (Associazione Bancaria Italiana), CBI S.c.p.A., Banca d'Italia

## Zweck & Verwendung

### Experte

Die **RIBA (Ricevuta Bancaria)** ist ein traditionsreiches italienisches Inkasso-Instrument — ein elektronisches Wechseläquivalent, das als Forderungsinkasso-Mechanismus zwischen Gläubiger (Creditor/Cedente) und Schuldner (Debtor/Debitore) über das Bankensystem abgewickelt wird. Technisch funktioniert RIBA wie eine elektronische Lastschrift, ist aber rechtlich kein Mandat-basiertes Instrument: Der Schuldner "akzeptiert" die RIBA (Anerkennung der Schuld), anstatt ein SEPA-Mandat zu unterzeichnen.

**Ablauf**: Gläubiger erstellt RIBA-Datei (CBI-XML oder Vorgänger-Format CBR) → Einreichung bei Hausbank → Bank leitet an Schuldnerbank weiter → Schuldner kann akzeptieren oder ablehnen → Buchung bei Fälligkeit.

**Format**: Historisch proprietäres CBI-Textformat (CBI-Einreichungsformat "RiBa"); moderne Version als CBI-XML, orientiert am ISO-20022-Konzept. Enthält: RiBa-Nummer, Fälligkeitsdatum, Betrag, Schuldner-IBAN, Gläubiger-Referenz.

Für SAP: RIBA-Einreichung typischerweise aus dem FI-AR-Modul über eigene Zahlprogrammvariante oder Custom-Development initiiert; SAP-Standard liefert keine RIBA-Formatunterstützung.

### Einsteiger

RIBA ist eine typisch italienische Form des Forderungseinzugs — vergleichbar mit einer Lastschrift, aber mit einer "Akzeptierung" durch den Schuldner. Ein Unternehmen, das Geld von einem Kunden einziehen will, erstellt eine RIBA und reicht sie bei seiner Bank ein. Die Bank informiert die Schuldnerbank, der Schuldner bestätigt (oder lehnt ab), und bei Fälligkeit wird der Betrag abgebucht. RIBA ist in Italien weit verbreitet, hat aber keine europäische Entsprechung — deshalb ist SAP-Anbindung immer ein individuelles Projekt.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1960er | RiBa-Papierform als Wechseläquivalent in Italien eingeführt |
| 1990er | Elektronisierung: CBI-Einreichungsformat CBR (proprietärer Text) |
| 2008 | CBI-XML-Variante eingeführt, orientiert an SEPA SDD-Konzepten |
| 2012 | ABI empfiehlt Migration zu SEPA SDD B2B als langfristige RIBA-Alternative |
| 2024 | RIBA weiterhin aktiv; SEPA SDD B2B-Migration in vielen KMU noch nicht vollzogen |

## Wichtige Felder (technisch)

| Feld | Beschreibung | Pflicht |
|---|---|---|
| RiBa-Nummer | Eindeutige Referenznummer des Gläubigers | Ja |
| Fälligkeitsdatum | ReqdColltnDt (ISO-Datum) | Ja |
| Betrag | In EUR, max. 2 Dezimalstellen | Ja |
| Schuldner-IBAN | IBAN des Kontos des Schuldners | Ja |
| Gläubiger-Identifikation | ABI/SIA-Code des Gläubigers | Ja |
| Verwendungszweck | Freitextfeld, max. 140 Zeichen | Nein |
| Akzeptierungs-Flag | Vorausbestätigung durch Schuldner (opt.) | Nein |

## Pflichtfelder (Kurzliste)

RiBa-Nummer · Fälligkeitsdatum · Betrag (EUR) · Schuldner-IBAN · Gläubiger-ABI-Code · Gläubiger-IBAN

## SAP-Mapping

### Experte

SAP hat keine native RIBA-Unterstützung. Integration typischerweise über:
- **FI-AR (Debitorenbuchhaltung)**: Offene Posten als RIBA-Basis; Custom-Zahlprogramm (RPRP-Variante oder eigenes ABAP) erzeugt RIBA-Datei aus `BSEG`/`BSID`-Tabellen.
- **DMEE**: Eigenentwicklung eines RIBA-DMEE-Formats möglich, erfordert Schema-Kenntnis des CBI-RIBA-XML.
- **Bankadapter**: Serrala FS², BCB oder lokale IT-Dienstleister bieten SAP-zertifizierte RIBA-Adapter.
- **Statusrückmeldung**: Akzeptierungs-/Ablehnungs-Status der RIBA muss manuell oder per Custom-Schnittstelle zurück in SAP-FI gebucht werden.

### Einsteiger

RIBA wird in SAP nicht direkt unterstützt. Das Finanzteam muss mit der IT entweder ein Zusatzprogramm entwickeln lassen oder ein fertiges Zusatzpaket eines Anbieters kaufen. Typisch in der Praxis: Das SAP-System erstellt eine Liste offener Forderungen, ein Custom-Programm wandelt diese in eine RIBA-Datei um, und die Datei wird manuell oder automatisch an die Bank gesendet.

## Typische Fehlerquellen

### Experte

- **SIA-Code-Fehler**: Der SIA-Code (Società Interbancaria Automatismi) des Gläubigers ist falsch formatiert oder nicht bei der CBI registriert — führt zu vollständiger Ablehnung.
- **Doppel-Einreichung**: RIBA-Nummern müssen eindeutig sein; Duplikate werden von der Bank gemeldet (Fehlercode DUPL).
- **Fälligkeitsdatum in der Vergangenheit**: RIBA mit vergangenem Fälligkeitsdatum werden abgewiesen.
- **Schuldner akzeptiert nicht**: RIBA kann vom Schuldner aktiv abgelehnt werden (kein Automatismus wie bei SEPA SDD) — muss in SAP als unbezahlte Forderung weiterverfolgt werden.

### Einsteiger

- Die Bank lehnt die RIBA-Datei ab, weil der Gläubiger-Code (SIA) nicht hinterlegt ist — niemand wusste, dass dieser Code bei der Bank beantragt werden muss.
- Die Zahlung wird nicht gebucht, weil der Schuldner die RIBA nicht akzeptiert hat — in SAP gibt es keinen automatischen Status-Rückfluss.

## Häufige Projektfehler

### Experte

- **SEPA SDD B2B als Ersatz unterschätzt**: Migration von RIBA zu SEPA SDD B2B erfordert Mandats-Setup — in Italien fehlen oft Mandat-Infrastrukturen (SEDA, s. SEDA-Eintrag).
- **Kein Rückbucher-Handling**: RIBA-Rückläufer (Schuldner lehnt ab, Konto nicht gedeckt) müssen separat behandelt werden — Projekte implementieren oft kein automatisches FI-AR-Mahnsystem.
- **Zeitzone / Bankarbeitstag**: In Italien zählen Bankarbeitstage (TARGET2-Kalender) — Fälligkeitsdaten müssen auf TARGET2-Bankarbeitstage geprüft werden.

### Einsteiger

- Das Unternehmen will SEPA SDD statt RIBA nutzen, weil "das moderner ist" — stellt fest, dass die Kunden kein SEPA-Mandat unterzeichnen wollen und RIBA für den italienischen Markt weiter nötig ist.
- Das Team unterschätzt die Bearbeitungszeit: RIBA muss mehrere Bankarbeitstage vor Fälligkeit eingereicht werden (Vorlaufzeiten vergleichbar SEPA SDD).
