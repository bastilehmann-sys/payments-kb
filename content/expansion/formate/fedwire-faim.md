---
format_name: Fedwire FAIM
aktuelle_version: "Fedwire FAIM 3.0 (wird durch ISO 20022 pacs.009 abgelöst, Deadline 2025)"
nachrichtentyp: US Fedwire Funds Service — High-Value RTGS-Zahlungen, Interbank-Überweisungen (Echtzeit-Brutto-Abrechnung)
familie_standard: US ACH
datenrichtung: Ausgehend (Corporate/Bank → Fedwire → Empfängerbank)
sap_relevanz: SAP ERP / S/4HANA — nur über Bankadapter oder Treasury-Middleware; F110 nicht direkt geeignet für RTGS/Fedwire; typischerweise über SAP In-House Cash oder Treasury-Modul
status: Legacy — FAIM-Format wird durch ISO 20022 (pacs.009 / pacs.008) ab November 2025 ersetzt (Federal Reserve Mandate)
---

# Fedwire FAIM — US Fedwire Funds Service (Legacy Format)

**Stand:** April 2026 | **Quellen:** Federal Reserve (federalreserve.gov), Fedwire Funds Service Operating Circular No. 6, BIS CPMI

## Zweck & Verwendung

### Experte

**Fedwire Funds Service** ist das US-amerikanische RTGS-System (Real-Time Gross Settlement) für Hochbetragszahlungen, betrieben durch das US Federal Reserve System. Fedwire verarbeitet typischerweise Überweisungen ab USD 1 Millionen (kein formales Limit nach oben) und ist das Äquivalent zu Europas TARGET2.

**FAIM (Fedwire Application Interface Message)**: Das proprietäre Nachrichtenformat für Fedwire Funds, bestehend aus Tagged-Field-Nachrichten (ähnlich SWIFT MT, aber proprietär). FAIM-Nachrichten bestehen aus:
- **Mandatory Fields**: {1500} Type Code, {2000} Amount, {3100} Sender ABA, {3400} Receiver ABA, {3600} Business Function Code
- **Optional Fields**: {4200} Beneficiary, {5000} Originator, {6000} Originator's FI, {7000} Remittance
- Business Function Codes: `CTR` (Customer Transfer), `BTR` (Bank Transfer — Interbank), `FFS` (Fed Funds Sold)

**ISO 20022-Migration (Fed Wire Modernization)**: Die Federal Reserve mandatiert die Migration von FAIM auf ISO 20022 (`pacs.008` für Customer Transfers, `pacs.009` für Bank Transfers) bis **19. März 2025** (Start der Migrationsphasen; vollständige Ablösung geplant). FAIM und ISO 20022 werden übergangsweise coexistieren.

**Operating Hours**: Fedwire Funds ist Werktags von 9:00 PM (Vorabend ET) bis 7:00 PM ET in Betrieb (21-Stunden-Fenster); Final Cut-Off für Customer Transfers: 18:00 ET.

### Einsteiger

Fedwire ist das amerikanische Gegenstück zu TARGET2 in Europa — für sehr große, eilige Zahlungen zwischen Banken und Unternehmen. Jede Transaktion wird sofort und einzeln gebucht (kein Batch-Verfahren). Das bisherige Format (FAIM) ist alt und proprietär, wird aber gerade durch einen internationalen Standard (ISO 20022) ersetzt. Für SAP-Projekte ist Fedwire relevant, wenn ein Unternehmen in den USA große Zahlungen in Echtzeit tätigen muss — z. B. Immobilienkäufe, M&A-Transaktionen, Finanzmarktgeschäfte.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1918 | Fedwire als telegrafisches Goldtransfer-System gestartet |
| 1970er | Elektronisierung; FAIM-Format eingeführt |
| 1990er | FAIM-Erweiterungen für strukturierte Felder ({6000}–{7000}) |
| 2010 | FAIM 3.0 — letzte größere Revision der proprietären Spezifikation |
| 2023 | Federal Reserve kündigt ISO-20022-Migration an (pacs.008/pacs.009) |
| 2025-03 | Start der ISO-20022-Koexistenzphase; FAIM und MX parallel akzeptiert |
| 2026+ | Vollständige FAIM-Ablösung durch ISO 20022 geplant |

## Wichtige Felder (technisch, FAIM)

| FAIM-Tag | Beschreibung | Pflicht |
|---|---|---|
| `{1500}` | Type Code (10 = Funds Transfer) | Ja |
| `{1510}` | Sub-Type Code (00, 01, 02) | Ja |
| `{2000}` | Amount (in USD, Format DDDDDDDDDDDDDD (keine Dezimalpunkt-Variante im Feld)) | Ja |
| `{3100}` | Sender's ABA Routing Number + Short Name | Ja |
| `{3400}` | Receiver's ABA Routing Number + Short Name | Ja |
| `{3600}` | Business Function Code (CTR/BTR/FFS) | Ja |
| `{4200}` | Beneficiary Identifier / Name | Nein (opt. bei CTR) |
| `{5000}` | Originator | Nein |
| `{6000}` | Originator's Financial Institution | Nein |
| `{7000}` | Remittance Information (max. 140 Zeichen) | Nein |

## Pflichtfelder (Kurzliste)

Type Code {1500} · Amount {2000} · Sender ABA {3100} · Receiver ABA {3400} · Business Function Code {3600}

## SAP-Mapping

### Experte

Fedwire ist kein Standard-SAP-Zahlungsformat. Integration:
- **SAP Treasury / TRM**: Fedwire-Zahlungen werden typischerweise aus SAP Treasury Management (Transaktion `FLQTP` / Finanzmitteltransfer) oder In-House Cash initiiert, nicht über F110.
- **Bankadapter**: Spezialisierte US-Treasury-Systeme (Kyriba, FIS, Bottomline) fungieren als Fedwire-Adapter; SAP gibt Zahlungsdaten weiter, Adapter formatiert FAIM und übermittelt per SWIFT FIN oder FedLine Advantage.
- **FedLine Advantage**: Direktkanal der Federal Reserve für Fedwire — erfordert Federal Reserve-Mitgliedschaft oder Sponsoring durch Mitgliedsbank.
- **SWIFT FileAct**: Große Unternehmen nutzen SWIFT FIN MT202/MT103 als "Wrapper" für Fedwire-Auslösung über ihre Hausbank.
- **ISO 20022-Migration**: Mit Fedwire-Modernisierung werden pacs.008/pacs.009-Nachrichten relevant — SAP-ISO-20022-Adapter (SWIFT MX, CBPR+) können für Fedwire-Nachrichten genutzt werden.

### Einsteiger

Fedwire ist nichts für den normalen SAP-F110-Zahlungslauf. Für Fedwire braucht man spezielle Software oder ein System der Bank. Typischerweise läuft es so: SAP erfasst die Zahlungsanweisung, und dann sendet ein externer Dienst (Bank-Portal oder Treasury-Software) die Zahlung über Fedwire. Mit der Umstellung auf ISO 20022 wird Fedwire in Zukunft einfacher in moderne SAP-Systeme integrierbar.

## Typische Fehlerquellen

### Experte

- **ABA-Nummer der Receiver-Bank falsch**: Falsche ABA führt zu Rückgabe (nicht sofortiger Return, sondern manueller Klärungsprozess bei Federal Reserve).
- **Cut-Off-Zeiten verpasst**: Customer-Transfer-Cut-Off 18:00 ET — nach Cut-Off gestellte Aufträge werden auf den nächsten Bankarbeitstag verschoben.
- **Betrag-Formatierung**: FAIM-Amount-Feld hat kein Dezimalzeichen — Betrag wird als ganzzahlige Cent-Angabe interpretiert (USD 1.000.000 = `100000000`). Fehler führen zu drastisch falschen Beträgen.
- **Business Function Code falsch**: `CTR` vs. `BTR` vs. `FFS` unterscheiden sich in den Abrechnungs-Mechanismen — falscher Code führt zu Fehler oder Fehlbuchung.
- **Fehlendes Beneficiary-Feld bei CTR**: Bei Customer Transfers (CTR) ist `{4200}` (Beneficiary) empfohlen; fehlt es, kann Empfängerbank nicht zuordnen.

### Einsteiger

- Betrag wird um Faktor 100 falsch gesendet, weil Dezimalstellen-Handling falsch konfiguriert ist.
- Die Zahlung wird nach dem Cut-Off eingereicht — sie landet erst am nächsten Tag beim Empfänger, obwohl "sofort" erwartet.
- Der falsche Business Function Code führt dazu, dass die Zahlung als Interbank-Transfer statt als Kundenzahlung behandelt wird — Buchungsunterschiede.

## Häufige Projektfehler

### Experte

- **ISO-20022-Migration nicht geplant**: Fedwire-Modernisierung auf pacs.009/pacs.008 ist Federal-Reserve-Mandat — Projekte, die FAIM jetzt neu implementieren, müssen sofort ISO-20022-Migration einplanen.
- **FedLine Advantage vs. SWIFT-Kanal**: Unternehmen ohne Federal Reserve-Mitgliedschaft müssen Sponsor-Bank nutzen — erhöhte Transaktionsgebühren und Abhängigkeit von Sponsor-Bank-Verfügbarkeit.
- **OFAC-Screening**: Fedwire-Zahlungen unterliegen OFAC (Office of Foreign Assets Control) — Sanktionsprüfung muss integriert sein.
- **Notfall-Prozess fehlt**: Bei Fedwire-Fehler oder -Ausfall muss ein manueller Notfall-Zahlungsprozess (Phone Wire) definiert sein — selten im Projektscope.

### Einsteiger

- Das Unternehmen implementiert Fedwire jetzt ohne ISO-20022-Plan — in 12 Monaten muss alles wieder umgebaut werden.
- Kein OFAC-Screening führt zu Compliance-Verstößen — in den USA sehr empfindliche regulatorische Konsequenzen.
- Fedwire fällt aus (selten, aber möglich) und es gibt keinen Plan B — dringende Zahlungen können nicht ausgeführt werden.
