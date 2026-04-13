---
format_name: Bacs
aktuelle_version: "Bacs Standard 18 (Bacs Payment Schemes Limited, aktuell)"
nachrichtentyp: UK Bacs — Automated Payments (Direct Debit + Direct Credit), 3-Tage-Clearing-Zyklus
familie_standard: UK Legacy
datenrichtung: Ausgehend (Corporate → Bacs → Bank) für Direct Credit; Eingehend (Empfangsbestätigung) für Direct Debit-Auftrag
sap_relevanz: SAP ERP / S/4HANA — via DMEE (Format "BACS Standard 18") oder F110-Bankdatei; SAP liefert Standard-DMEE-Formatdefinition für UK Bacs; erfordert UK-Bankadapter (Lloyds, Barclays, HSBC-Gateway)
status: Aktiv (Legacy) — Kernformat für UK-Massenzahlungen; keine Ablösung durch FPS für Bulk-Zahlungen; koexistiert mit Faster Payments für Einzel-/Eilzahlungen
---

# Bacs — UK Standard 18 (Bacs Payment Schemes Limited)

**Stand:** April 2026 | **Quellen:** Bacs Payment Schemes Limited (bacs.co.uk), Pay.UK, UK Finance

## Zweck & Verwendung

### Experte

**Bacs (Bankers' Automated Clearing Services)** ist das älteste und volumenstärkste elektronische Zahlungssystem im Vereinigten Königreich, betrieben durch **Bacs Payment Schemes Limited** (ein Non-Profit-Konsortium der britischen Banken, jetzt Teil von Pay.UK). Bacs verarbeitet täglich rund 100 Millionen Transaktionen und ist das Standardsystem für:
- **Direct Credits (DC)**: Gehaltsauszahlungen, Lieferantenzahlungen, Rentenzahlungen.
- **Direct Debits (DD)**: Regelmäßige Einzüge (Versorgungsunternehmen, Abonnements, Ratenzahlungen).

**Format Standard 18**: Das Dateiformat ist eine Fixed-Width-Textdatei mit 18-Byte-Records (voluminöse Felder; ältere Variante noch 18-Zeichen-Blocks), jetzt als erweiterte "Standard 18"-Spezifikation definiert. Jede Record-Zeile enthält: Transaktionstyp, Sortiercode (6-stellig), Kontonummer (8-stellig), Betrag, Referenz.

**Clearing-Zyklus**: Bacs ist ein **3-Tage-Clearing-Zyklus** (Input Day, Processing Day, Entry Day) — Einreichung am Montag, Buchung am Mittwoch. Vorlaufzeiten müssen bei Zahlungsläufen berücksichtigt werden.

**Submission-Kanal**: Über zertifizierte Bacs-Software (Bacstel-IP) oder über die Hausbank (Bacs Direct Submission). UK-Unternehmen können direkt über Bacstel-IP einreichen (Service User Number — SUN erforderlich).

### Einsteiger

Bacs ist das wichtigste Zahlungssystem in Großbritannien für Massenzahlungen — ähnlich wie SEPA in Europa, aber mit einem anderen Format und einem 3-Tage-Prozess. Fast alle britischen Gehaltsabrechnungen laufen über Bacs. Auch Lastschriften (z. B. Energieversorger, Mobilfunk) nutzen Bacs. Das Format ist alt, aber zuverlässig und weit verbreitet. SAP hat eine Standard-Unterstützung für Bacs, die aber korrekt konfiguriert werden muss.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1968 | Bacs als Bankers' Automated Clearing Services gegründet |
| 1985 | Einführung des digitalen Standard-18-Formats (18-Byte-Records) |
| 2000 | Bacstel-IP als sicherer Übertragungskanal eingeführt |
| 2008 | Bacs Payment Schemes Limited als Non-Profit-Tochter von Vocalink |
| 2017 | Pay.UK übernimmt Bacs-Governance (neben FPS, CHAPS) |
| 2021 | Standard 18 Revision — erweiterte Felder für Zahlungsreferenz und Remittance |
| 2023 | Bacs verarbeitet 4,4 Mrd. Zahlungen p.a.; kein Ablösedatum durch FPS/NPA |

## Wichtige Felder (technisch)

| Feld (Standard 18) | Beschreibung | Pflicht |
|---|---|---|
| Transaction Code (2) | 01=Direct Credit, 17=Direct Debit, 99=Contra | Ja |
| Sortiercode (6) | Bank-Branch-Sortiercode des Empfängers | Ja |
| Kontonummer (8) | Kontonummer des Empfängers | Ja |
| Transaktionsbetrag (11) | In Pence (GBP × 100), linksbündig | Ja |
| Originator Sortiercode (6) | Sortiercode des Einreicher-Kontos | Ja |
| Originator Account (8) | Kontonummer des Einreichers | Ja |
| Referenz (18) | Freitextreferenz des Einreichers (z. B. Gehaltsmonat) | Ja |
| Name des Empfängers (18) | Kontoinhaber-Name, max. 18 Zeichen | Ja |
| Processing Day | Buchungstag (DDDYY — Julian) | Ja |

## Pflichtfelder (Kurzliste)

Transaction Code · Sortiercode (Empfänger) · Kontonummer (Empfänger) · Betrag (Pence) · Originator Sortiercode · Originator Account · Referenz · Name

## SAP-Mapping

### Experte

SAP unterstützt Bacs Standard 18 über das DMEE-Framework:
- **DMEE-Format**: SAP liefert DMEE-Formatdefinition für UK Bacs (Formatkennung `BACS` oder `BACS_DD`). Konfiguration in Transaktion `DMEE`.
- **F110 (Zahlungsprogramm)**: Erzeugt Bacs-Datei nach F110-Run; Zahlungsweg `CH` (Check/Electronic) mit Bankdaten (Sortiercode = Routing-Nummer in UK).
- **Bankdaten in SAP**: UK-Banken nutzen Sortiercode (6-stellig, Format XX-XX-XX) anstelle von BIC/IBAN für Inlandszahlungen. SAP-Tabelle `BNKA` muss Sortiercode-Felder korrekt befüllt haben.
- **IBAN für UK**: UK-IBAN (GB + 2 + 4 Buchstaben BIC + 6 Sortiercode + 8 Kontonummer = 22 Zeichen). SAP-Debitor/Kreditor-Stammdaten müssen IBAN hinterlegt haben.
- **Direct Debit in SAP**: Über FI-CA (Contract Accounts) oder Custom-Lösung; Bacs DD erfordert AUDDIS-Mandatsverwaltung (Automated Direct Debit Instruction Service).
- **Bacstel-IP-Übertragung**: Typischerweise über Bankadapter oder SWIFT FileAct — SAP sendet Bacs-Datei per SFTP an Bank-Gateway.

### Einsteiger

SAP kann Bacs-Dateien erstellen — dafür gibt es eine fertige Vorlage im SAP-DMEE-System. Nach dem Zahlungslauf (Transaktion F110) erzeugt SAP eine Datei im Bacs-Format, die dann zur Bank geschickt wird. Wichtig: In Großbritannien gibt es keine IBAN als primäre Zahlungsreferenz (obwohl IBAN existiert) — stattdessen werden Sortiercode und Kontonummer verwendet. SAP muss entsprechend konfiguriert sein.

## Typische Fehlerquellen

### Experte

- **Betrag in Pence statt Pound**: Bacs-Beträge sind in Pence (1 GBP = 100 Pence) — ein häufiger Konfigurationsfehler führt zu 100-fach falschen Beträgen.
- **Sortiercode-Format**: Sortiercode muss 6-stellig ohne Bindestriche in der Datei sein (XX-XX-XX → XXXXXX) — falsche Formatierung führt zu Ablehnung.
- **Processing Date Julian Calendar**: Bacs nutzt Julianisches Datum (DDDYY) — falsche Datumsberechnung führt zu Fehlbuchungen oder Ablehnung.
- **SUN (Service User Number) fehlt**: Unternehmen, die direkt bei Bacs einreichen, benötigen eine SUN — ohne SUN ist keine direkte Einreichung möglich; muss über Hausbank abgewickelt werden.
- **Name truncation**: Empfänger-Name wird auf 18 Zeichen beschränkt — längere Namen werden abgeschnitten und können vom Empfänger-Konto-Matching abweichen.

### Einsteiger

- Beträge stimmen nicht: SAP sendet GBP als Wert, Bacs erwartet Pence — alles um Faktor 100 falsch.
- Die Datei wird abgewiesen, weil das Julianische Datum falsch berechnet wurde.
- Das Unternehmen hat keine SUN beantragt und kann nicht direkt bei Bacs einreichen — die Hausbank muss als Intermediär genutzt werden (zusätzliche Gebühren und Vorlaufzeit).

## Häufige Projektfehler

### Experte

- **Kein AUDDIS für Direct Debit**: UK Bacs Direct Debit erfordert AUDDIS-Mandatsverwaltung (elektronisches Mandat-Register) — Projekte implementieren oft Lastschriften ohne korrektes AUDDIS-Setup.
- **3-Tage-Vorlauf nicht im Projektscope**: Bacs-Vorlaufzeit von 3 Bankarbeitstagen muss in Zahlungslauf-Planung berücksichtigt werden — im ERP nicht standardmäßig konfiguriert.
- **Post-Brexit IBAN-Konfusion**: Nach Brexit sind UK-IBANs (GB-Präfix) von einigen EU-Banken und ERPs nicht als gültige SEPA-IBAN akzeptiert — Cross-Border-Zahlungen UK ↔ EU müssen separat geprüft werden.

### Einsteiger

- Das Projekt vergisst den 3-Tage-Vorlauf — Lieferanten werden zu spät bezahlt, obwohl SAP rechtzeitig gebucht hat.
- UK-Mitarbeiter werden falsch bezahlt, weil Sortiercode und Kontonummer vertauscht wurden — keine automatische Prüfung in SAP.
- Das Unternehmen expandiert nach UK und stellt fest, dass das bestehende SEPA-Setup nicht für Bacs geeignet ist — komplett separates UK-Zahlungs-Setup ist nötig.
