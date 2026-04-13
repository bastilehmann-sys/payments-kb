---
name: Zengin-Net (Zengin System)
abkuerzung: Zengin
region: Japan
typ: Retail Clearing (Deferred Net Settlement) + Domestic Wire Transfer
waehrung: JPY
betreiber: Japanese Bankers Association (JBA) / Zengin-Net (Zengin Data Telecommunication System)
status: Operativ, seit 1973; 24/7 seit 2018
beschreibung_experte: |
  Das Zengin-System ist das zentrale Retail-Clearing-System Japans für inländische JPY-Überweisungen. Es verarbeitet Einzel- und Massenzahlungen zwischen japanischen Banken und ist seit Oktober 2018 als 24/7-System operativ (inkl. Wochenenden und Feiertage). Zengin-Net ist die gemeinnützige Organisation (Tokyo Clearing House assoziiert), die das System betreibt. Täglich werden ca. 8–9 Millionen Transaktionen verarbeitet. Settlement erfolgt über das BOJ-NET (Zahlungssystem der Bank of Japan). Das System unterstützt sowohl Einzel-Überweisungen (Furikomi) als auch Batch-Verarbeitung. Parallel existiert das FXYCS (Foreign Exchange Yen Clearing System) für FX-bezogene JPY-Großbetragszahlungen.
beschreibung_einsteiger: |
  Das Zengin-System ist Japans wichtigstes Überweisungssystem für alltägliche JPY-Zahlungen zwischen japanischen Banken. Wenn Sie in Japan eine Überweisung machen — etwa Gehalt oder Lieferantenrechnung —, läuft das über Zengin. Seit 2018 funktioniert das System rund um die Uhr, auch an Wochenenden. Es ist vergleichbar mit dem deutschen SEPA-System, aber nur für Japan.
aufbau: |
  Zentrale Infrastruktur betrieben von Zengin-Net (Tokyo). Direkte Mitglieder: alle japanischen Banken, Regionalbanken, Shinkin-Banken, Japan Post Bank, Kreditgenossenschaften. Über 1.200 Finanzinstitute sind direkte oder indirekte Teilnehmer. BOJ-NET (Bank of Japan Financial Network System) dient als Settlement-Plattform. Zengin-Net betreibt zudem das Relay-Center für Weiterleitung zwischen Instituten.
settlement_modell: |
  Deferred Net Settlement (DNS): Multilaterale Netting-Runden über den Tag verteilt, Settlement via BOJ-NET. 24/7-Availability seit 2018: Zahlungen werden jederzeit akzeptiert, aber Settlement-Zyklen erfolgen zu festgelegten Zeitpunkten. Interbank-Settlement: mehrmals täglich via BOJ-NET. Kleinbetrags-Transaktionen (unter 3 Mio. JPY) sind typischerweise Zengin. Großbetragszahlungen (über 100 Mio. JPY) oft über BOJ-NET Zenginkai-Kanal (RTGS).
cut_off: |
  24/7 Betrieb seit Oktober 2018. Tagsüber (Geschäftstage 08:30–15:30 JST): Sofortige Gutschrift beim Empfänger möglich. Außerhalb dieser Zeiten und an Feiertagen: Zahlungen werden gepuffert und zum nächsten Verarbeitungszyklus verarbeitet (i.d.R. nächster Geschäftstag früh). Ausnahme: 24/7-fähige Banken können auch nachts und am Wochenende instant gutschreiben.
teilnehmer: |
  Über 1.200 direkte und indirekte Mitglieder (Stand 2024): alle japanischen Großbanken (MUFG, SMFG, Mizuho), Regionalbanken (Regional Banks Tier 1 und 2), Shinkin-Banken, Shinkin Central Bank, Japan Post Bank, alle Japan Credit Unions (Shinkumi), Norinchukin Bank, Resona.
relevanz_experte: |
  1) Für Industrieunternehmen mit Japan-Tochtergesellschaft: JPY-Lieferantenzahlungen laufen via Zengin — SAP-seitig Zahlungsweg "Furikomi" (Domestic Wire Transfer Japan) konfigurieren.
  2) Payroll Japan: Gehaltsüberweisungen via Zengin sind Standard — Sammel-Furikomi (Batch-Überweisung) via Hausbank einrichten, Einreichefrist beachten (i.d.R. 2 Geschäftstage vorher).
  3) FXYCS vs. Zengin: Interbank-JPY-Zahlungen im Zusammenhang mit FX-Transaktionen laufen über FXYCS (Foreign Exchange Yen Clearing System) — nicht Zengin. Als Corporate ist diese Unterscheidung transparent (macht die Bank).
  4) 24/7-Verfügbarkeit seit 2018: Für IHB-Strukturen mit Japan relevant — JPY-Zahlungen können auch am Wochenende angestoßen werden, aber Buchungsstellen (Value Date) beachten.
  5) Zengin-Datenformat: japanisches proprietäres Format (Zengin-Datei-Layout) — SAP erfordert Länderspezifische Konfiguration (DMEE oder Bank-Communication-Management).
relevanz_einsteiger: |
  Warum relevant: Wenn Ihre japanische Tochtergesellschaft Gehälter oder Rechnungen bezahlt, läuft das über Zengin. Als Treasurer müssen Sie wissen: JPY-Überweisungen brauchen normalerweise eine Vorlaufzeit von 1–2 Tagen, wenn Sie über SAP einreichen. Seit 2018 funktioniert das System auch am Wochenende.
corporate_zugang_experte: |
  Corporates als indirekte Teilnehmer via Hausbank (Designated Financial Institution). Einreichung: proprietäres Zengin-Dateiformat oder via SWIFT-Nachricht (MT103 mit Correspondent-Routing). Japanische Banken bieten API-Zugang (Direct Debit / Furikomi API) für Corporate-Internet-Banking. SAP: Länderspezifische DMEE-Konfiguration Japan oder Drittanbieter-Add-on. Wichtig: Japanische Kontonummer-Struktur (Bankcode 4-stellig + Filialcode 3-stellig + Kontonummer 7-stellig) muss korrekt in SAP hinterlegt sein.
corporate_zugang_einsteiger: |
  Ihre japanische Hausbank nimmt die Zahlungsaufträge aus SAP entgegen und leitet sie ins Zengin-System weiter. Sie brauchen die richtige japanische Bankverbindung im System (Bank-Code und Filial-Code) — das ist anders als in Europa.
---

# Zengin-System — Zusätzliche Details

## FXYCS — Foreign Exchange Yen Clearing System

Separates System für Interbank-JPY-Zahlungen im Kontext von Devisengeschäften (FX):
- Betreiber: Tokyo Bankers Association
- Größenordnung: ca. 20–30 Billionen JPY täglich (Großbeträge)
- Nutzer: ausschließlich Banken (kein Corporate-Zugang)
- Settlement: via BOJ-NET RTGS
- Relevant für Treasury: JPY-Gegenwert bei USD/JPY-FX-Deals läuft via FXYCS

## Zengin-Dateiformat (vereinfacht)

Japanisches proprietäres Format (Zeichensatz: Shift-JIS), Felder:
- Empfänger-Bankcode (4-stellig)
- Empfänger-Filialcode (3-stellig)
- Kontonummer (7-stellig)
- Kontotyp (1-stellig: 1=Sichteinlage, 2=Einlagenkonto)
- Betrag (10-stellig in JPY)
- Empfängername (Katakana, 30 Zeichen)

## Volumenstatistik (2023/2024)

| Kennzahl | Wert |
|---|---|
| Tägliche Transaktionen | ca. 8–9 Mio. |
| Jahresvolumen Transaktionen | ca. 2 Milliarden |
| Jahresvolumen JPY | ca. 5.500 Billionen JPY |
