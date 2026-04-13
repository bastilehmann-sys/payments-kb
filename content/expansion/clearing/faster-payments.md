---
name: Faster Payments Service
abkuerzung: FPS
region: United Kingdom
typ: Real-Time Retail Payments (24/7)
waehrung: GBP
betreiber: Pay.UK (ehemals Payments Council / Vocalink, jetzt via Vocalink/Mastercard als Technical Operator)
status: Operativ, seit 2008; 24/7 seit Launch
beschreibung_experte: |
  Der UK Faster Payments Service (FPS) ist seit Mai 2008 das führende Real-Time-Zahlungssystem Großbritanniens für GBP-Retail- und SME-Zahlungen. FPS war beim Launch 2008 weltweit eines der ersten 24/7-Instant-Payment-Systeme und gilt als Vorbild für viele internationale Systeme (inkl. SEPA Instant Credit Transfer). Transaktionslimit: aktuell 1 Mio. GBP (seit Juli 2022 erhöht von 250k). Täglich werden ca. 3–4 Millionen Transaktionen abgewickelt, Jahresvolumen über 3,4 Milliarden Transaktionen (2023). Technischer Betreiber: Vocalink (Mastercard-Tochter). Scheme-Owner und Rule-Setter: Pay.UK. Settlement via Bank of England's RTGS (CHAPS) — Interbank-Netting mehrmals täglich, Finalsettlement via CHAPS.
beschreibung_einsteiger: |
  Faster Payments ist Großbritanniens Sofortzahlungssystem. Wenn Sie in Großbritannien eine Überweisung machen, kommt das Geld fast immer innerhalb von Sekunden an — auch nachts und am Wochenende. Das Limit ist 1 Million GBP. Es ist kostenlos oder sehr günstig. FPS ist in Großbritannien so normal wie SEPA Instant in Europa — aber schon seit 2008, also viel früher.
aufbau: |
  Zentraler Switch: Vocalink (Mastercard) als Technical Operator. Settlement: Bank of England RTGS (CHAPS) mit Netting-Zyklen. Direct Participants: große UK-Banken (Barclays, HSBC, Lloyds, NatWest, Santander UK, Nationwide etc.) — ca. 30 direkte Mitglieder. Indirect Participants: Tausende von Banken, Building Societies, Payment Institutions via Sponsoring-Arrangement. Drei Zahlungstypen: Single Immediate Payments (SIP), Forward-Dated Payments (FDP), Standing Orders. Separate Request-to-Pay-Funktion (RtP) seit 2020 unter FPS-Dach.
settlement_modell: |
  Near-Real-Time (typisch: 2–10 Sekunden Ende-zu-Ende). Interbank-Settlement: net settlement via Bank of England CHAPS in mehreren Zyklen täglich (nicht bei jeder Transaktion einzeln, sondern gebündelt). Finales Interbank-Settlement via CHAPS. Teilnehmer halten Prefunding-Guthaben beim technischen Operator (Vocalink). Zahlungen sind für den Empfänger sofort verfügbar, aber technisch erst bei CHAPS-Settlement interbank final.
cut_off: |
  24/7/365 — kein Cut-Off. Zahlungen können jederzeit initiiert und empfangen werden. Maximale SLA: 2 Stunden (in der Praxis typisch 2–15 Sekunden). Kein Unterschied zwischen Wochentagen, Wochenenden und Bank Holidays.
teilnehmer: |
  Ca. 400+ direkte und indirekte Teilnehmer (Stand 2024). Direkt: ~30 größte UK-Banken. Indirekt: Challenger Banks (Monzo, Starling, Revolut UK, Wise UK), Payment Institutions, Building Societies. Retailer-Direktzugang: Über PSP-Regelwerk auch für lizenzierte Payment Institutions zugänglich.
relevanz_experte: |
  1) UK-Tochtergesellschaft GBP-Zahlungen: Lieferantenzahlungen und Gehaltsüberweisungen in GBP laufen via FPS (Betrag <1 Mio. GBP) oder CHAPS (>1 Mio. GBP oder zeitkritisch). SAP: Payment Method "T" (BACS) vs. "F" (Faster Payments / FPS) — je nach Hausbank-Schnittstelle.
  2) BACS vs. FPS: BACS (Bankers' Automated Clearing Services) ist das ältere UK-Batch-System (3-Tage-Settlement) für Payroll und direkte Debits. FPS ist für sofortige Einzelzahlungen. Payroll UK: häufig noch BACS (Direct Debit / Direct Credit), weil günstigere Sammelverarbeitung.
  3) FPS-Limit 1 Mio. GBP: Für B2B-Zahlungen über 1 Mio. GBP muss CHAPS genutzt werden — wichtig für Treasury bei großen Intercompany-Zahlungen oder Supplier-Payments.
  4) Request to Pay (RtP): FPS-Overlay-Service für elektronische Zahlungsanforderungen (B2B und B2C) — im Kommen für UK-Rechnungsfinanzierung und Supply-Chain-Finance.
  5) Brexit-Auswirkungen: FPS ist UK-only (GBP), kein Zugang zu SEPA Instant nach Brexit. Cross-Border GBP/EUR-Zahlungen laufen via SWIFT oder Vocalink-Partner — kein EU-Passporting mehr für UK PSPs.
relevanz_einsteiger: |
  Warum relevant: Wenn Ihre britische Tochtergesellschaft Lieferanten in GBP bezahlt oder Gehälter auszahlt, läuft das meist über Faster Payments (schnell, günstig) oder BACS (für Massenüberweisungen). Für sehr große Beträge (über 1 Mio. GBP) brauchen Sie CHAPS. Als Treasurer sollten Sie wissen: GBP-Zahlungen nach Großbritannien kommen normalerweise in Sekunden an.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang (nur lizenzierte PSPs). Zahlungen via Hausbank (Direct Participant) oder PSP (Indirect Participant). Einreichung: BACS/FPS-kompatible Dateien (Standard 18-Format für BACS), proprietäre Bank-API (Open Banking UK — CMA9 Banks bieten PSD2-konforme Payment Initiation APIs an). SAP: FPS-Zahlungen über Payment Medium Workbench oder Hausbank-Schnittstelle (H2H, SFTP). Wichtig: UK Sort Code + Account Number (kein IBAN-Zwang für UK-Inlandszahlungen, obwohl IBAN technisch möglich).
corporate_zugang_einsteiger: |
  Ihre britische Hausbank nimmt die Zahlungsaufträge entgegen und schickt sie über Faster Payments. Sie brauchen die britische Kontonummer und den Sort Code des Empfängers (6-stellig, z.B. 20-00-00 für Barclays London). Das ist anders als in Europa, wo man IBAN nutzt.
---

# UK Faster Payments — Zusätzliche Details

## Volumenstatistik (2023/2024)

| Kennzahl | Wert |
|---|---|
| Jahrestransaktionen 2023 | 3,4 Milliarden |
| Jahresvolumen 2023 | ca. 2,4 Billionen GBP |
| Tägliche Transaktionen | ca. 9–10 Millionen |
| Durchschnittsbetrag | ca. 700 GBP |

## FPS vs. BACS vs. CHAPS — UK-Systemvergleich

| Kriterium | Faster Payments | BACS | CHAPS |
|---|---|---|---|
| Geschwindigkeit | Sekunden (24/7) | 3 Werktage | Echtzeit (RTGS) |
| Limit | 1 Mio. GBP | Kein Limit | Kein Limit |
| Verwendung | Einzel, sofort | Gehälter, DD | Großbeträge |
| Kosten | Günstig | Günstig (Batch) | Höher |
| Settlement | Net/CHAPS | BACS Netting | RTGS (BoE) |

## New Payments Architecture (NPA)

Pay.UK entwickelt die **New Payments Architecture (NPA)** als Nachfolger der aktuellen FPS-Infrastruktur:
- ISO 20022 nativ
- Zentraler Clearing Layer (CCL) als neuer Switch
- Erweitertes Overlay-Service-Ökosystem
- Geplante Einführung: ab 2025–2027 (sukzessiv)
- Vocalink-Vertrag endet — neue Ausschreibung für Technical Operator

## Request to Pay (RtP)

FPS-Overlay-Service seit 2020:
- Rechnungssteller sendet elektronische Zahlungsanforderung
- Zahler entscheidet: sofort zahlen, teilweise zahlen, ablehnen, verzögern
- B2B-Anwendungsfall: elektronische Rechnungsstellung + direkte Zahlungsinitiierung
- Noch geringe Adoption (2024), aber wachsend
