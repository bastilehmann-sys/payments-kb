---
name: MAS Electronic Payment System Plus / Clearing House Automated Transfer System (Hong Kong)
abkuerzung: MEPS+/CHATS
region: Singapur / Hongkong
typ: RTGS (MEPS+, SGD) + Multi-Currency RTGS (CHATS, HKD/USD/EUR/CNY)
waehrung: SGD (MEPS+); HKD, USD, EUR, CNY (CHATS)
betreiber: Monetary Authority of Singapore — MAS (MEPS+); Hong Kong Interbank Clearing Limited — HKICL (CHATS), owned by HKMA und HKAB
status: MEPS+ operativ seit 1998 (Upgrade 2006); CHATS seit 1996 (HKD), USD-CHATS seit 2000, CNH-CHATS seit 2013
beschreibung_experte: |
  MEPS+ (MAS Electronic Payment System Plus) ist Singapurs RTGS-System für SGD-Großbetragszahlungen, betrieben von der Monetary Authority of Singapore (MAS). Es dient als Settlement-Backbone für SGD-Interbank-Transaktionen und das Singapore Clearing House Association (SCHA) Netting. MEPS+ verarbeitet täglich ca. 40.000 Transaktionen mit einem Volumen von ca. 400–500 Milliarden SGD. CHATS (Clearing House Automated Transfer System) ist Hongkongs Multi-Währungs-RTGS-System, betrieben von HKICL (Hong Kong Interbank Clearing Limited). CHATS existiert in vier Währungsvarianten: HKD-CHATS, USD-CHATS, EUR-CHATS und CNH-CHATS (Offshore-RMB). Das CNH-CHATS ist besonders relevant, da es Hong Kong als globales Offshore-RMB-Zentrum positioniert und Settlement für CNH-FX und RMB-Anleihen bereitstellt.
beschreibung_einsteiger: |
  Singapur hat MEPS+ für seine eigene Währung SGD — stellen Sie sich das wie eine Singapurer Version von Fedwire vor. Hongkong hat CHATS, das besonders ist, weil es vier Währungen gleichzeitig kann: Hong-Kong-Dollar, US-Dollar, Euro und chinesische Renminbi. Das macht Hongkong zu einem einzigartigen Finanzzentrum, wo man RMB (Chinas Währung) international handeln kann — das nennt man "Offshore RMB" oder CNH.
aufbau: |
  MEPS+: Betrieben von MAS direkt, SWIFT-basiertes Messaging (MT202/MT103), Settlement über MAS-Konten der Banken. SGD Fast (seit 2014, Retail Instant Payments via PayNow seit 2017). CHATS: Betrieben von HKICL (Joint Venture: HKMA 50%, HKAB 50%). Vier Währungssysteme: HKD-CHATS (RTGS), USD-CHATS (RTGS, entspricht dem USD-PvP mit CHIPS/Fedwire), EUR-CHATS (RTGS), CNH-CHATS (RTGS, Settlement für Offshore-RMB). CHATS-Teilnehmer: alle lizenzierten Banken in Hongkong (über 150 direkte Mitglieder). PayMe (HK Retail), FPS (HK Faster Payment System, seit 2018) sind Overlay-Services auf CHATS.
settlement_modell: |
  MEPS+: RTGS, sofort und final in SGD. CHATS: RTGS in der jeweiligen Währung, sofort und final. CNH-CHATS: Settlement von Offshore-RMB-Positionen, interoperabel mit CIPS für grenzüberschreitende RMB-Zahlungen. USD-CHATS nutzt PvP-Link mit CHIPS (New York) für USD-Settlement — Hongkong als USD-Clearing-Hub für Asien.
cut_off: |
  MEPS+: 09:00–18:30 SGT (UTC+8), Mo–Fr. Bank Holidays Singapur: geschlossen. PayNow (Retail Overlay): 24/7. CHATS HKD: 09:00–18:30 HKT (UTC+8), Mo–Fr, Bank Holidays HK: geschlossen. CHATS USD: 09:00–18:30 HKT (Überschneidung mit New York: 18:30 HKT = 06:30 ET). CHATS CNH: 08:30–20:30 HKT (erweiterte Stunden für RMB-Cross-Border-Verbindung mit Shanghai).
teilnehmer: |
  MEPS+: Alle in Singapur zugelassenen Banken mit MAS-Konto (Full Banks, Wholesale Banks, Finance Companies) — ca. 150 direkte Teilnehmer. CHATS: Alle lizenzierten Banken in Hongkong — ca. 160+ direkte Mitglieder. Internationale Banken mit Asien-Hubs (Standard Chartered, HSBC, Citi, Deutsche Bank, JP Morgan) sind in beiden Systemen direkte Teilnehmer.
relevanz_experte: |
  1) Singapur als APAC-Treasury-Hub: Viele Industriekonzerne führen ihre APAC Regional Treasury Centre (RTC) in Singapur. SGD-Zahlungen laufen via MEPS+, regionale USD-Zahlungen oft über USD-CHATS (via Hongkong) oder SWIFT.
  2) CNH-Zahlungen via HK: Offshore-RMB-Transaktionen (CNH) setteln in Hongkong via CNH-CHATS — relevant für europäische Konzerne, die RMB-Bonds oder Dim-Sum-Bonds emittiert haben, oder die CNH für China-Zahlungen nutzen.
  3) PayNow Corporate (Singapur): Seit 2018 können Unternehmen in Singapur via UEN (Unique Entity Number) Zahlungen empfangen — relevant für B2B-Instant-Payments in SGD.
  4) Hongkong FPS (Faster Payment System, seit 2018): Multi-Currency Instant Payments (HKD und CNH) bis 1 Mio. HKD bzw. 100k CNH — für B2B-Kleinstzahlungen in HK zunehmend relevant.
  5) IHB-Aspekt: Singapur ist steuerlich und regulatorisch günstig für In-House Banking — MAS Treasury Market Association (TMA) Richtlinien für Cash Pooling beachten.
relevanz_einsteiger: |
  Warum relevant: Wenn Ihr Unternehmen in Singapur oder Hongkong aktiv ist, laufen die lokalen Zahlungen über MEPS+ (Singapur) oder CHATS (Hongkong). Singapur ist bei vielen deutschen Konzernen das Finanzzentrum für Asien. Hongkong ist besonders, weil man dort auch Chinas Währung (RMB/CNH) international handeln und abwickeln kann.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang. Einreichung via Hausbank in Singapur (Full Bank oder Wholesale Bank mit MEPS+-Mitgliedschaft) oder in Hongkong (CHATS-Mitgliedsbank). Zahlungsformate: SWIFT MT103/MT202 oder ISO 20022 pacs.008. SAP: Ländereinstellungen SG/HK, SWIFT BIC der Hausbank, korrekte Währungscodes (SGD, HKD, CNH = CNY Offshore). PayNow Corporate: API-Integration via Singapurer Hausbank möglich — UEN als Identifier statt Kontonummer. CHATS CNH vs. CIPS: CNH-Zahlungen nach China können via CHATS CNH (Offshore-Weg) oder via CIPS (Onshore-Weg durch die Bank) geroutet werden.
corporate_zugang_einsteiger: |
  Ihre Singapurer oder Hongkonger Hausbank übernimmt alles. Für normale SGD-Zahlungen brauchen Sie die Bankverbindung (Singapore BSB-Code oder Hongkong Bank-Code) und Kontonummer. Für RMB-Zahlungen via Hongkong spricht Ihre Bank von "CNH" — das ist der offshore handelbare chinesische Yuan.
---

# MEPS+ und CHATS — Zusätzliche Details

## Systemübersicht

| Kriterium | MEPS+ (SG) | HKD-CHATS | USD-CHATS | CNH-CHATS |
|---|---|---|---|---|
| Währung | SGD | HKD | USD | CNH (Offshore RMB) |
| Typ | RTGS | RTGS | RTGS | RTGS |
| Betreiber | MAS | HKICL | HKICL | HKICL |
| Betriebsstunden | 09:00–18:30 SGT | 09:00–18:30 HKT | 09:00–18:30 HKT | 08:30–20:30 HKT |
| Volumen tägl. | ~400–500 Mrd. SGD | ~800 Mrd. HKD | ~150 Mrd. USD | ~150 Mrd. CNH |

## Singapur PayNow — Instant Payment Overlay

PayNow (seit 2017) ist Singapurs Instant-Payment-Netzwerk auf Basis von MEPS+:
- P2P (Privat): via Mobile-Nr. oder NRIC/FIN
- Corporate (seit 2018): via UEN (Unique Entity Number) — statt Kontonummer
- Betragslimit: 200.000 SGD pro Transaktion
- 24/7, durchschnittlich unter 10 Sekunden
- PayNow-PROMPTPAY-Link (Singapur-Thailand Cross-Border Instant Payments seit 2021)
- PayNow-UPI-Link (Singapur-Indien Cross-Border Instant Payments seit 2023)

## Hongkong als Offshore-RMB-Zentrum

Hongkong ist der größte Offshore-RMB-Markt der Welt:
- Tägliches CNH-Clearing in Hongkong: ~150–200 Milliarden CNH
- CNH ≠ CNY: Offshore-RMB (CNH) kann zu leicht abweichenden Kursen vom Onshore-RMB (CNY) handeln
- Bank of China (Hong Kong) ist "Designated Clearing Bank" für CNH in Hongkong — fungiert als Settlement Agent

## Cross-Border Instant Payments — Singapurs Vorzeigeposition

Singapur hat mehrere bilaterale Instant-Payment-Links:
- **PayNow ↔ PromptPay** (Thailand, seit 2021)
- **PayNow ↔ UPI** (Indien, seit 2023)
- **PayNow ↔ DuitNow** (Malaysia, geplant 2025)
- **PayNow ↔ Blik** (Polen, exploriert)

Diese Netzwerke ermöglichen Cross-Border Retail- und KMU-Zahlungen ohne SWIFT — ein globales Modell für die Zukunft.
