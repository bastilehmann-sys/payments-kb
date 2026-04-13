---
format_name: LCR-MAG
aktuelle_version: "LCR-MAG CFONB 2023 (Lettre de Change Relevé Magnétique)"
nachrichtentyp: Elektronischer Wechsel / Scheckeinzug — France Lettre de Change Relevé (LCR) und Billet à Ordre Relevé (BOR)
familie_standard: France Legacy
datenrichtung: Ausgehend (Creditor → Bank) für Einreichung; Eingehend für Statusmeldung
sap_relevanz: SAP ERP / S/4HANA — via DMEE (CFONB-Format für Frankreich) oder Custom-ABAP; SAP liefert CFONB-Formatunterstützung für France; Transaktion F110 mit France-Zahlungsweg
status: Legacy — weiterhin aktiv in Frankreich für Wechselverkehr; Migration zu SEPA SDD COR1 empfohlen aber langsam
---

# LCR-MAG — Lettre de Change Relevé (Frankreich)

**Stand:** April 2026 | **Quellen:** CFONB (Comité Français d'Organisation et de Normalisation Bancaires), Banque de France, SEPA-Migrationsberichte

## Zweck & Verwendung

### Experte

**LCR-MAG (Lettre de Change Relevé Magnétique)** ist das französische elektronische Wechselformat — ein Instrument für das Handelskredit-Einzug in Frankreich, das rechtlich und kommerziell einer gezogenen Wechselakzeptanz entspricht. LCR ist der elektronische Nachfolger des physischen Handelswechsels (Papier-Traite). Parallel existiert der **BOR (Billet à Ordre Relevé)** — elektronisches Eigenwechsel-Äquivalent.

**Standardisierungsgremium**: CFONB (Comité Français d'Organisation et de Normalisation Bancaires) definiert das LCR-MAG-Format als Teil der CFONB-Banknachrichtenstandards (auch "formats CFONB" genannt). CFONB-Formate sind proprietäre ASCII-Formate mit festen Feldpositionen — strukturell ähnlich NACHA, aber mit anderer Feldstruktur.

**Format-Aufbau**:
- Record-Länge: 160 Zeichen (CFONB-Standard)
- Recordtypen: 03 (LCR-Einreichung), 06 (Schlusssatz), 31 (Buchungszeile)
- Pflichtfelder: Akzeptant-Identifikation (SIREN), Gläubiger-IBAN, Schuldner-IBAN, Fälligkeitsdatum, Betrag, Wechselnummer

**Einreichungsprozess**: Gläubiger reicht LCR-MAG-Datei über EBICS (Auftragsart `LC1`) bei seiner Hausbank ein → Bank leitet an Schuldnerbank → Schuldner "akzeptiert" elektronisch (analog RiBa in Italien) → Buchung am Fälligkeitstag.

**BOR** (Billet à Ordre Relevé): Äquivalent zum LCR, aber vom Schuldner ausgestellt (Eigenwechsel) statt vom Gläubiger gezogen.

### Einsteiger

LCR ist ein typisch französisches Zahlungsinstrument — vergleichbar mit einem Wechsel, aber elektronisch. Ein Lieferant (Gläubiger) zieht eine LCR auf seinen Kunden (Schuldner): "Du schuldest mir X Euro am [Datum]." Der Kunde bestätigt dies elektronisch. Am Fälligkeitstag zieht die Bank den Betrag automatisch ein. LCR ist in Frankreich im B2B-Bereich weit verbreitet, insbesondere in Handels- und Industrieunternehmen. SAP kann LCR-Dateien erzeugen, aber die Konfiguration erfordert Kenntnisse der CFONB-Standards.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1970er | CFONB entwickelt LCR-MAG als elektronischen Wechsel-Standard |
| 1990er | EBICS-Einführung als Übertragungskanal für LCR (Auftragsart LC1) |
| 2008 | SEPA-Einführung — CFONB empfiehlt Migration zu SEPA SDD |
| 2012 | SEPA-Pflicht: LCR außerhalb SEPA-Raum weiterhin zulässig |
| 2019 | CFONB aktualisiert LCR-Spezifikation; weiterhin IBAN-basiert |
| 2023 | LCR weiterhin aktiv; SEPA-Migration in vielen Branchen nicht vollzogen |

## Wichtige Felder (technisch, CFONB-Format)

| Feld | Position (Zeichen) | Beschreibung | Pflicht |
|---|---|---|---|
| Record-Code | 1-2 | 03 = LCR-Satz | Ja |
| Banque Tireur | 3-7 | BIC-ähnliche Bankkennziffer des Gläubigers | Ja |
| SIREN Tiré | 8-14 | SIREN-Nummer des Schuldners (7-stellig) | Ja |
| IBAN Tiré | abhängig von Recordformat | IBAN des Schuldners | Ja |
| IBAN Tireur | — | IBAN des Gläubigers | Ja |
| Montant | — | Betrag in Euro-Cents | Ja |
| Échéance | — | Fälligkeitsdatum DDMMYY | Ja |
| Numéro LCR | — | Eindeutige LCR-Referenznummer | Ja |
| Référence tireur | — | Gläubiger-Referenz (max. 10 Zeichen) | Nein |

## Pflichtfelder (Kurzliste)

Record-Code · SIREN Tiré · IBAN (Gläubiger + Schuldner) · Betrag (Cents) · Fälligkeitsdatum · LCR-Nummer

## SAP-Mapping

### Experte

SAP unterstützt CFONB-Formate (inklusive LCR) über:
- **DMEE-Formatdefinition**: SAP liefert CFONB-Zahlungsformate für Frankreich. LCR-MAG ist als Zahlungsweg "FR" konfigurierbar.
- **F110 (Zahlungsprogramm)**: LCR-Einreichungen werden über F110 mit France-Zahlungsweg initiiert. Selektion der LCR-Belege über Belegart (z. B. Handelswechsel-Belegart).
- **FI-AR (Debitorenbuchhaltung)**: LCR-Forderungen (Wechselforderungen) werden in SAP als gesonderte Debitoren-Konten geführt (Konto für Wechsel in Umlauf).
- **EBICS-Einreichung**: SAP sendet LCR-Datei per EBICS (LC1) an Hausbank.
- **Wechsel-Verwaltung (Transaktion F-36/F110)**: SAP FI bietet Wechsel-Buchungsfunktionen (Einlösung, Protest, Rückgabe).
- **SIREN-Stammdaten**: SIREN-Nummer muss in Debitoren-Stammdaten gepflegt sein (Steuernummer-Feld oder Custom-Feld).

### Einsteiger

SAP hat eine Unterstützung für CFONB-Formate (das ist der Überbegriff für französische Bankformate), und LCR ist darin enthalten. Im Zahlungsprogramm F110 kann man Frankreich-Zahlungen auf LCR konfigurieren. SAP erzeugt dann eine LCR-Datei, die per EBICS an die Bank geht. Wichtig: Die Stammdaten (insbesondere die SIREN-Nummer des Schuldners) müssen korrekt gepflegt sein.

## Typische Fehlerquellen

### Experte

- **SIREN-Nummer fehlt oder falsch**: SIREN ist 7-stellige Unternehmensidentifikation in Frankreich — fehlt sie, lehnt die Bank die LCR ab.
- **Fälligkeitsdatum Wochenende/Feiertag**: LCR-Fälligkeitsdatum muss auf einen Bankarbeitstag fallen (TARGET2 oder speziell französischer Kalender) — automatische Verschiebung muss implementiert sein.
- **IBAN-Format**: Französische IBANs (FR + 2 + 23 alphanumerische Zeichen = 27 Zeichen) — falsche Länge oder Prüfziffer führt zur Ablehnung.
- **Akzeptierungs-Frist verpasst**: Schuldner hat Frist zur LCR-Akzeptierung überschritten — LCR gilt als nicht akzeptiert, Forderungsverfolgung manuell.
- **Betrag in Cent**: Wie NACHA — LCR-Betrag in Euro-Cent (1 EUR = 100 Cent) — falsches Mapping führt zu 100-fach falschem Betrag.

### Einsteiger

- Die LCR wird abgelehnt, weil die SIREN-Nummer des Kunden fehlt — niemand wusste, dass diese Nummer gepflegt werden muss.
- Das Fälligkeitsdatum fällt auf einen Feiertag, die LCR wird nicht verarbeitet — kein automatischer Hinweis im System.
- Betrag kommt 100-fach falsch an wegen Cent-Fehler.

## Häufige Projektfehler

### Experte

- **SEPA-Migration ohne LCR-Analyse**: Projekte migrieren zu SEPA SDD, ohne zu prüfen, ob Kunden LCR-Verträge haben — Kündigung von LCR-Geschäftsbeziehungen ist kommerziell heikel.
- **Protest-Prozess nicht implementiert**: Wenn Schuldner LCR nicht akzeptiert oder Konto nicht gedeckt ist, muss "Protest" (rechtliche Maßnahme) eingeleitet werden — SAP-Standard hat keinen automatischen Protest-Workflow.
- **Keine Wechsel-Bilanzierung**: LCR-Wechselforderungen müssen in SAP als eigene Bilanz-Kategorie geführt werden (Wechsel in Umlauf, Wechsel diskontiert) — Projekte vermischen Wechsel und Forderungen.

### Einsteiger

- Das Projekt plant SEPA SDD für Frankreich, stellt fest dass Kunden auf LCR bestehen — LCR kann nicht einfach durch SEPA SDD ersetzt werden ohne Kundenvereinbarung.
- Protest-Prozess bei Nicht-Zahlung fehlt — Buchhalter verwalten unbezahlte LCRs manuell außerhalb von SAP.
