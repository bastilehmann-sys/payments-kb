---
name: India NEFT / RTGS / IMPS / UPI Payment Systems
abkuerzung: NEFT/RTGS/IMPS/UPI
region: Indien
typ: "Multi-System: DNS (NEFT) + RTGS + 24/7 Interbank (IMPS) + Instant Mobile Payments (UPI)"
waehrung: INR
betreiber: Reserve Bank of India (NEFT, RTGS, IMPS) + NPCI — National Payments Corporation of India (IMPS, UPI)
status: RTGS seit 2004, NEFT seit 2005, IMPS seit 2010, UPI seit 2016; alle 24/7 operativ seit 2019–2021
beschreibung_experte: |
  Indien betreibt vier komplementäre Zahlungssysteme mit unterschiedlichen Verwendungszwecken und Betragsgrenzen: (1) NEFT (National Electronic Funds Transfer): DNS-Batch-System für Retail- und B2B-Überweisungen, keine Betragsobergrenze, 24/7 seit 2019 in Halbstunden-Batches. (2) RTGS (Real Time Gross Settlement): Großbetragssystem für Transaktionen ab 2 Lakh INR (ca. 2.200 EUR), 24/7 seit Dezember 2020. (3) IMPS (Immediate Payment Service): 24/7 Instant-Interbank-System bis 5 Lakh INR (ca. 5.500 EUR), betrieben von NPCI. (4) UPI (Unified Payments Interface): API-basiertes Overlay-System für Mobile-P2P und Merchant-Zahlungen via Virtual Payment Address (VPA), täglich über 500 Mio. Transaktionen (2024), Limit 1 Lakh INR pro Transaktion (mit Ausnahmen bis 5 Lakh). UPI ist Indiens bekanntestes und volumenstärkstes System.
beschreibung_einsteiger: |
  Indien hat vier verschiedene Überweisungssysteme — je nach Betrag und Geschwindigkeit nutzt man ein anderes: NEFT für normale Überweisungen, RTGS für große Beträge in Echtzeit, IMPS für kleine Sofortüberweisungen, und UPI für Handy-zu-Handy-Zahlungen (wie Google Pay oder PhonePe in Indien). Als Unternehmen nutzt man meist NEFT oder RTGS für Lieferantenzahlungen und Gehälter.
aufbau: |
  NEFT: Zentraler Hub bei der Reserve Bank of India (RBI), Halbstunden-Batch-Verarbeitung (48 Batches täglich), Settlement via RBI-Konten. RTGS: RTGS-Plattform der RBI, Single-queue RTGS, Settlement sofort gegen RBI-Reservekonten. IMPS: NPCI als Switched, Banken als Mitglieder, Interbank-Nachrichten über NPCI-Switch. UPI: NPCI als Central Scheme Owner und Switch, Banken als Payment Service Providers (PSPs), Drittanbieter-Apps (GPay, PhonePe, PayTM) als TSPs (Third Party Application Providers).
settlement_modell: |
  NEFT: DNS via 48 Halbstunden-Batches, Settlement in RBI-Büchern. RTGS: RTGS (sofort und final) gegen RBI-Reservekonten. IMPS: Near-Real-Time, Settlement end-of-day via NEFT oder bilateral. UPI: Real-Time Nachricht, Settlement via IMPS oder NEFT-Cycle. Alle Systeme 24/7 seit 2019–2021.
cut_off: |
  NEFT: 24/7 (seit Dezember 2019), 48 Halbstunden-Batches, Settlement des letzten Batches ca. 00:00 IST. RTGS: 24/7 (seit Dezember 2020, exkl. bestimmter Wartungsfenster), Minimum 2 Lakh INR. IMPS: 24/7, max. 5 Lakh INR. UPI: 24/7, 1 Lakh INR Standard (5 Lakh für bestimmte Kategorien wie Krankenhäuser, Bildung seit 2023).
teilnehmer: |
  NEFT/RTGS: Alle RBI-zugelassenen Banken (über 200 Banken, darunter Scheduled Commercial Banks, Regional Rural Banks, Co-operative Banks, Small Finance Banks, Payments Banks). IMPS/UPI: NPCI-Mitgliedsbanken (über 500) sowie PSP-Banken für UPI. UPI-Apps: PhonePe (ca. 48 % Marktanteil), Google Pay (ca. 37 %), PayTM Payments Bank, Amazon Pay etc.
relevanz_experte: |
  1) INR-Lieferantenzahlungen für India-Tochtergesellschaften: Standardweg via NEFT (Batch, günstig) oder RTGS (>2 Lakh, Echtzeit). SAP muss IFSC-Code (Indian Financial System Code, 11-stellig) in Bankstammdaten führen — dieser ersetzt SWIFT BIC für inländische Zahlungen.
  2) Gehaltsabwicklung Indien (Payroll): i.d.R. via NEFT-Batch-Datei an Hausbank (proprietäres Format oder NPCI-Datei). SAP HR India Payroll Localization beachten.
  3) RTGS für große Intercompany-Zahlungen: Konzernübergreifende INR-Zahlungen (z.B. Cash-Pool-Rückführung) über RTGS sinnvoll (sofort final, kein Batch-Delay).
  4) UPI für B2B-Kleinstbeträge: In India nimmt UPI-Nutzung auch im B2B-Segment zu (Vendor Payments bis 1 Lakh) — noch kein Standard für Corporate Treasury, aber im Kommen.
  5) FEMA-Compliance: Foreign Exchange Management Act reguliert grenzüberschreitende INR-Transaktionen streng — IHB-Strukturen mit Indian Rupee sehr begrenzt möglich (INR ist nicht frei konvertibel).
relevanz_einsteiger: |
  Warum relevant: Wenn Ihr Unternehmen in Indien eine Tochtergesellschaft hat, werden Gehälter und Lieferantenrechnungen über NEFT (normal) oder RTGS (große Beträge) bezahlt. Die indische Rupie ist nicht frei tauschbar wie EUR oder USD — das macht Cash Management mit Indien komplizierter. UPI ist Indiens digitales Zahlungswunder für Verbraucher, aber für Firmenzahlungen nutzt man eher NEFT/RTGS.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang. Einreichung via Hausbank (Scheduled Commercial Bank mit RTGS/NEFT-Mitgliedschaft): proprietäre Dateiformate (bank-spezifisch), Corporate Internet Banking, oder API-Integration. IFSC-Code (11-stellig: 4 Buchstaben Bankkennung + 0 + 6 Ziffern Filiale) ist Pflichtfeld — ersetzt in Indien den SWIFT BIC für Inlandszahlungen. SAP: Bankstammdaten mit IFSC, ggf. Drittanbieter-Payroll-Integration. Für große Konzerne: Direct NEFT/RTGS-API-Integration via RBI-zugelassener Aggregatoren (z.B. Razorpay Corporate, PayU Business, HDFC Bank APIs).
corporate_zugang_einsteiger: |
  Ihre indische Tochtergesellschaft nutzt ihre lokale Hausbank für alle Zahlungen. Die Bank braucht den IFSC-Code des Empfängers (steht auf jedem indischen Kontoauszug). Alles andere macht die Bank automatisch.
---

# Indien NEFT/RTGS/IMPS/UPI — Zusätzliche Details

## Systemübersicht im Vergleich

| System | Typ | Limit | Geschwindigkeit | Betreiber |
|---|---|---|---|---|
| NEFT | DNS Batch (48x tägl.) | Kein Limit | Halbstunde | RBI |
| RTGS | RTGS | Mind. 2 Lakh INR | Sofort | RBI |
| IMPS | Near-Real-Time | Max. 5 Lakh INR | Sekunden | NPCI |
| UPI | Instant (API-Overlay) | Max. 1–5 Lakh INR | Sekunden | NPCI |

**1 Lakh INR = 100.000 INR ≈ 1.100 EUR (Kurs 2024)**

## UPI Volumenwachstum — globales Phänomen

| Jahr | UPI-Transaktionen pro Monat |
|---|---|
| 2020 | ~2 Milliarden |
| 2022 | ~7 Milliarden |
| 2024 | ~13–15 Milliarden |

UPI verarbeitet mehr Transaktionen als Visa und Mastercard zusammen in Indien. Das System wird auch in anderen Ländern eingeführt (UAE, Singapur, Malaysia, Frankreich via RuPay-Kooperation).

## IFSC-Code — Indian Financial System Code

Struktur: `HDFC0001234`
- Zeichen 1–4: Bank-Identifier (z.B. HDFC, SBIN, ICIC)
- Zeichen 5: immer "0" (Reserve)
- Zeichen 6–11: Filial-Code (6-stellig)

Quelle: RBI-Register, auch auf allen Scheckblättern und Kontoauszügen indischer Banken.

## INR und IHB-Restriktionen

Die indische Rupie (INR) ist **nicht frei konvertibel** (Restricted Currency). FEMA (Foreign Exchange Management Act) und RBI-Regulierungen schränken ein:
- Kein echtes Cross-Border-Netting in INR
- Cash Pooling mit INR sehr begrenzt (Notional Pooling teilweise möglich)
- Repatriation von Gewinnen aus Indien unterliegt RBI-Genehmigungspflichten
