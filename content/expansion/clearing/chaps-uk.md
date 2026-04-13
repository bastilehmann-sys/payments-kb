---
name: Clearing House Automated Payment System (UK)
abkuerzung: CHAPS
region: United Kingdom
typ: Real-Time Gross Settlement (RTGS)
waehrung: GBP
betreiber: Bank of England (seit November 2017; zuvor CHAPS Co.)
status: Operativ, seit 1984; RTGS-Migration abgeschlossen 2023 (RTGS Renewal Programme)
beschreibung_experte: |
  CHAPS (Clearing House Automated Payment System) ist das britische RTGS-System für GBP-Großbetragszahlungen, seit November 2017 direkt von der Bank of England betrieben. CHAPS verarbeitet täglich ca. 40.000–50.000 Transaktionen mit einem Volumen von ca. 350–400 Milliarden GBP — damit ist es eines der volumenstärksten RTGS-Systeme Europas. Keine Betragsobergrenze. Zahlungen sind sofort und unwiderruflich. CHAPS ist die Settlement-Infrastruktur für Faster Payments (FPS), BACS, und den UK-Immobilienmarkt (Conveyancing-Zahlungen). Im Rahmen des RTGS Renewal Programme wurde CHAPS 2022–2023 auf eine neue ISO 20022-Plattform migriert (pacs.008, pacs.009). CHAPS ist Mitglied der ISO 20022 HVPS+ Working Group.
beschreibung_einsteiger: |
  CHAPS ist Großbritanniens "große Überweisung" — wenn Sie in England ein Haus kaufen oder eine sehr große Zahlung machen (über 1 Mio. GBP, oder wenn es sofort ankommen muss), läuft das über CHAPS. Die Bank of England betreibt es direkt. Das Geld ist sofort da und unwiderruflich — kein System kann es zurückholen. Es ist teurer als Faster Payments, aber für kritische Zahlungen unverzichtbar.
aufbau: |
  Betreiber: Bank of England (BoE), direkt betrieben seit November 2017. Technische Plattform: SWIFT-Netz für Messaging + BoE RTGS-Plattform für Settlement. Direct Participants: ca. 30 (alle großen UK-Banken: Barclays, HSBC, Lloyds, NatWest, Standard Chartered, Santander UK, JP Morgan London, Deutsche Bank London, etc.). Indirect Participants: Tausende weiterer Finanzinstitute via Sponsoring. ISO 20022 Migration: vollständig auf pacs.008/pacs.009 seit 2023 (Teil des SWIFT CBPR+ Cross-Border Rollouts).
settlement_modell: |
  Real-Time Gross Settlement (RTGS): jede Zahlung wird einzeln und sofort gegen die Settlement-Konten (Reserves Accounts) der Teilnehmer bei der Bank of England abgewickelt. Keine Netting-Runden. Settlement ist sofort final und unwiderruflich. Intraday-Liquidität: Teilnehmer können Intraday-Repos bei der BoE nutzen.
cut_off: |
  Betriebsstunden: 06:00–18:00 Uhr UK-Zeit (GMT/BST), Mo–Fr. Ausnahme: Zahlungen bis 17:00 (Customer Payments Cut-Off). Interbank/Financial Institution Payments: bis 18:00. Bank Holidays UK: System geschlossen. Hinweis: CHAPS ist tagsüber operativ — kein 24/7 wie Faster Payments.
teilnehmer: |
  Ca. 30 direkte Settlement-Mitglieder (Stand 2024). Darunter: alle CMA9-Banken (9 größte UK-Retail-Banken), großen Investmentbanken mit UK-Präsenz, Zentralbank-Counterparties. Indirekte Teilnehmer: über 5.000 via Sponsoring-Arrangements.
relevanz_experte: |
  1) GBP-Großzahlungen >1 Mio. GBP: zwingend via CHAPS (Faster Payments Limit = 1 Mio. GBP). Typische Anwendungsfälle: Intercompany-Loans, Immobilienkäufe, Zinsleistungen, M&A-Transaktionen, Steuerzahlungen an HMRC.
  2) CHAPS als Settlement-Backbone für FPS und BACS: Das UK-Zahlungssystem-Ökosystem wird letztlich über CHAPS RTGS gesettelt — Treasury sollte verstehen, dass "Faster Payments" auf CHAPS-Basis läuft.
  3) ISO 20022 CHAPS (seit 2023): GBP-Überweisungen in pacs.008/pacs.009 — Banken akzeptieren nun reiche ISO-20022-Daten (Purpose Code, LEI, Remittance-Informationen strukturiert). SAP-seitig: DMEE/Payment Medium Workbench mit ISO 20022 GB-Profil nötig.
  4) Immobilien-Zahlungsabwicklung (Conveyancing): Ca. 30–40 % des CHAPS-Volumens sind Hauskauffinalzahlungen — nicht direkt corporate-relevant, aber erklärt die Volumen-Spitzen.
  5) CHAPS Cut-Off 17:00 vs. 18:00: Customer-to-Bank-Einreichung bis 17:00 UK-Zeit — für europäische SAP-Payment-Runs mit UK-Anteil als Frist konfigurieren.
relevanz_einsteiger: |
  Warum relevant: Wenn Ihre britische Tochter eine große Zahlung (über 1 Mio. GBP) machen muss — etwa eine Darlehenszahlung oder einen großen Einkauf —, braucht sie CHAPS. Ihre Bank schickt die Zahlung über CHAPS, und das Geld ist in Sekunden da, ohne dass es jemand rückgängig machen kann. Es kostet mehr als eine normale Überweisung (20–35 GBP typisch), ist aber bei wichtigen Zahlungen unverzichtbar.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang. Einreichung via Hausbank als Direct Participant oder via Bank als Indirect Participant. Zahlungsinstruktion: SWIFT MT103 (legacy) oder ISO 20022 pacs.008 via SWIFT-Netz (Post-Migration 2023). Proprietäre Bank-Schnittstellen (H2H/SFTP/API). SAP: Zahlungsmethode "C" (CHAPS) in UK-Buchungskreisen, Zahlungsweg-Konfiguration in FBZP. Felder: Sort Code (6-stellig) + Account Number (8-stellig) oder IBAN (UK: GB + 2 Check + 4 Bank + 6 Sort + 8 Account = 22 Zeichen). UK-IBAN wird akzeptiert aber nicht immer gefordert.
corporate_zugang_einsteiger: |
  Sie geben Ihrer Bank Bescheid (oder SAP schickt die Datei automatisch), und die Bank leitet die Zahlung über CHAPS weiter. Sie brauchen Sort Code und Kontonummer des Empfängers — oder die IBAN. Die Zahlung kostet typisch 20–35 GBP pro Transaktion, je nach Bank.
---

# CHAPS — Zusätzliche Details

## Volumenstatistik (2023/2024)

| Kennzahl | Wert |
|---|---|
| Tägl. Transaktionen | ca. 40.000–50.000 |
| Tägl. Volumen | ca. 350–400 Milliarden GBP |
| Jahresvolumen | ca. 90 Billionen GBP |
| Durchschnittsbetrag | ca. 8–10 Mio. GBP |

## RTGS Renewal Programme (2017–2023)

Die Bank of England hat in einem mehrjährigen Programm das CHAPS-Backend komplett erneuert:
- **2017:** Übernahme der operativen Verantwortung von CHAPS Co. durch die BoE
- **2022–2023:** Migration auf neue RTGS-Plattform mit ISO 20022 nativer Unterstützung
- **Ergebnis:** CHAPS unterstützt nun volle ISO 20022 Datenfelder (pacs.008/pacs.009) mit HVPS+ Compliance
- **Vorteil:** Verbesserte Datenqualität für AML/Sanctions-Screening und Reconciliation

## CHAPS als Settlement-Infrastruktur

```
UK Zahlungsökosystem:
├── Faster Payments (FPS) ──► Netting ──► CHAPS RTGS Settlement
├── BACS (Batch) ──────────► Netting ──► CHAPS RTGS Settlement
├── Direct Corporate CHAPS ────────────► CHAPS RTGS (direkt)
└── BoE Gilt/Repo-Transaktionen ────────► CHAPS RTGS
```

## UK-IBAN Struktur

Format: `GB29 NWBK 6016 1331 9268 19`
- `GB` = Country Code
- `29` = Check Digits
- `NWBK` = Bank Identifier (4 Buchstaben)
- `601613` = Sort Code (6 Ziffern)
- `31926819` = Account Number (8 Ziffern)

Gesamt: 22 Zeichen. UK-IBAN ist seit 2001 offiziell, wird aber für Inlandszahlungen oft noch als Sort Code + Account Number genutzt.
