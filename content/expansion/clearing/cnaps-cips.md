---
name: China National Advanced Payment System / Cross-Border Interbank Payment System
abkuerzung: CNAPS/CIPS
region: China
typ: RTGS (CNAPS HVPS) + DNS Batch (CNAPS BEPS) + Cross-Border RTGS (CIPS)
waehrung: CNY (Renminbi / RMB)
betreiber: People's Bank of China (PBOC) — CNAPS; CIPS Co., Ltd. (PBOC-reguliert) — CIPS
status: CNAPS operativ seit 2002 (HVPS) / 2008 (BEPS); CIPS Phase 1 seit 2015, Phase 2 seit 2018
beschreibung_experte: |
  China betreibt zwei komplementäre CNY-Zahlungsinfrastrukturen: CNAPS (China National Advanced Payment System) für inländische Zahlungen und CIPS (Cross-Border Interbank Payment System) für grenzüberschreitende RMB-Transaktionen. CNAPS umfasst zwei Subsysteme: HVPS (High Value Payment System, RTGS für Großbeträge) und BEPS (Bulk Electronic Payment System, DNS-Batch für Kleinbeträge). CIPS ist die chinesische Alternative zu SWIFT für RMB-Cross-Border-Zahlungen und wurde als Antwort auf geopolitische SWIFT-Abhängigkeiten entwickelt. CIPS nutzt ISO 20022 nativ. Tägliches CIPS-Volumen 2024: ca. 550.000 Transaktionen mit ca. 50 Billionen CNY jährlich. CNAPS HVPS verarbeitet den Großteil des chinesischen Interbank-Markts.
beschreibung_einsteiger: |
  China hat zwei Zahlungssysteme für den RMB: CNAPS für Zahlungen innerhalb Chinas (wie ein chinesisches Fedwire + ACH in einem) und CIPS für Zahlungen von und nach China in RMB (ähnlich wie SWIFT, aber für den chinesischen Yuan). Wenn Ihr Unternehmen in China einkauft oder verkauft und in RMB zahlen will, wird das über CIPS abgewickelt. Das ist neu und wichtig: China möchte, dass der RMB weltweit genutzt wird, und CIPS ist dafür die Infrastruktur.
aufbau: |
  CNAPS HVPS: RTGS, Settlement via PBOC-Konten. Alle chinesischen Banken (Staatsbanken, Joint-Stock-Banken, City-Banken, Auslandsbanken mit China-Lizenz). CNAPS BEPS: Batch-DNS, ähnlich US ACH, für Kleinbeträge <5 Mio. CNY. CIPS: zwei Verarbeitungsmodi — CIPS Direct Participants (ca. 100 direkte Teilnehmer, v.a. Großbanken) und CIPS Indirect Participants (über 1.400 in über 100 Ländern, via Korrespondenzbank). CIPS nutzt ISO 20022 XML (CBPR+ Subset).
settlement_modell: |
  CNAPS HVPS: RTGS, sofort und final. CNAPS BEPS: DNS in mehreren täglichen Batch-Zyklen. CIPS: RTGS für direkte Teilnehmer; für indirekte Teilnehmer DNS über ihren Direct Participant. CIPS Settlement via Konten der Direct Participants bei der PBOC (über CNAPS HVPS).
cut_off: |
  CNAPS HVPS: 08:30–17:00 Pekinger Zeit (CST/UTC+8), Mo–Fr. CNAPS BEPS: Batch-Zyklen über den Tag verteilt. CIPS: erweiterte Betriebszeiten — 09:00–20:00 CST (Phase 1-Fenster); CIPS Phase 2 (seit 2018) bietet erweiterte Session bis 00:00 CST (Mitternacht), um Überschneidungen mit europäischen und US-Zeitzonen zu ermöglichen. CIPS ist damit effektiv für euroäische Geschäftszeiten nutzbar (morgens China, nachmittags Europa).
teilnehmer: |
  CNAPS: Alle lizenzierten Banken in China (über 4.000 direkte und indirekte Teilnehmer). CIPS Direct Participants (Stand Q1 2025): ca. 142 Institutionen (Staatsbanken, Joint-Stock-Banken, ausgewählte internationale Banken). CIPS Indirect Participants: über 1.400 in über 100 Ländern (v.a. Korrespondenzbanken, die ihren Kunden RMB-Zahlungen anbieten).
relevanz_experte: |
  1) CNY-Lieferantenzahlungen aus Deutschland: Wenn in CNY fakturiert (RMB-Invoicing immer häufiger bei chinesischen Lieferanten), laufen Zahlungen via Hausbank als CIPS Indirect Participant — SWIFT MT103 oder gpi-Nachricht via Korrespondenzbank in CIPS.
  2) CIPS vs. SWIFT für RMB: Technisch können RMB-Zahlungen auch via SWIFT-MT103 mit CNAPS-Routing laufen — CIPS ist der direktere Weg, aber nicht alle Korrespondenzbanken sind bereits CIPS-Teilnehmer.
  3) RMB-Internalisierung (Offshore RMB = CNH): Offshore-RMB (in HK, Singapur gehandelt) settelt über CNH-Infrastruktur (Hong Kong RTGS für CNH via HKMA) — nicht direkt via CNAPS/CIPS. CIPS ist für Onshore-CNY und grenzüberschreitenden RMB.
  4) Sanktionsrisiko: CIPS-Nutzung ist von westlichen Sanktionen nicht direkt betroffen, aber Banken prüfen Transaktionen gegen UN/EU/US-Sanktionslisten — CIPS ist kein Sanktionsvermeidungsmechanismus.
  5) SAP-Konfiguration: CNY-Zahlungen erfordern Länderspezifika (Bankcode-Struktur, CNAPS-Code 12-stellig) — lokale SAP-Expertise oder Bankunterstützung erforderlich.
relevanz_einsteiger: |
  Warum relevant: Wenn Sie in RMB (chinesischer Yuan) an chinesische Lieferanten zahlen wollen, läuft das über das chinesische System CIPS — ähnlich wie SWIFT, aber für RMB. Das ist zunehmend wichtig, weil chinesische Lieferanten öfter in ihrer eigenen Währung fakturieren. Ihre Bank übernimmt die Abwicklung.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang. Zahlungen via Hausbank (als CIPS Indirect oder Direct Participant). Instruktion via SWIFT MT103 (mit BIC der Korrespondenzbank als CIPS-Teilnehmer) oder via proprietärer Bank-Schnittstelle. CNAPS-Code (12-stellige Banknummer für chinesische Banken) muss in SAP-Bankstammdaten gepflegt sein. Lokale Konformitätsanforderungen: SAFE (State Administration of Foreign Exchange) Reporting für grenzüberschreitende Zahlungen aus China — oft via lokale China-Tochter und Hausbank zu klären.
corporate_zugang_einsteiger: |
  Ihre Bank (oder die chinesische Hausbank Ihrer Tochtergesellschaft) wickelt die Zahlung ab. Sie brauchen die richtige chinesische Bankverbindung (CNAPS-Code + Kontonummer) und ggf. eine Genehmigung der chinesischen Devisenbehörde SAFE für größere Beträge.
---

# CNAPS / CIPS — Zusätzliche Details

## CNAPS vs. CIPS — Übersicht

| Kriterium | CNAPS HVPS | CNAPS BEPS | CIPS |
|---|---|---|---|
| Zweck | Inl. Großbeträge | Inl. Kleinbeträge | Grenzüberschreitend RMB |
| Typ | RTGS | DNS/Batch | RTGS (Direct) / DNS (Indirect) |
| Betreiber | PBOC | PBOC | CIPS Co., Ltd. |
| Format | Proprietär | Proprietär | ISO 20022 (CBPR+) |
| Settlement | PBOC RTGS | BOC Batch | via CNAPS |
| Teilnehmer | 4.000+ chinesische Banken | 4.000+ | 142 direkt, 1.400+ indirekt |

## CIPS Volumenwachstum

| Jahr | Transaktionen p.a. | Volumen (Bio. CNY) |
|---|---|---|
| 2020 | ~1,5 Mio. | ~45 |
| 2022 | ~3,5 Mio. | ~97 |
| 2024 | ~6+ Mio. | ~123 |

CIPS wächst stark — getrieben durch RMB-Internationalisierungspolitik der PBOC.

## SAFE-Reporting (Cross-Border Payments)

Grenzüberschreitende CNY-Zahlungen aus China unterliegen Meldepflichten gegenüber SAFE (State Administration of Foreign Exchange). Schwellenwerte und Genehmigungspflichten ändern sich regelmäßig — lokale Compliance-Beratung erforderlich.
