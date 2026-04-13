---
name: Continuous Linked Settlement
abkuerzung: CLS
region: Global
typ: Payment-versus-Payment (PvP) FX Settlement
waehrung: 18 Währungen (USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, SEK, NOK, DKK, SGD, HKD, KRW, ZAR, ILS, MXN, HUF)
betreiber: CLS Bank International (reguliert als Special Purpose Bank durch die Federal Reserve Bank of New York)
status: Operativ, seit 2002
beschreibung_experte: |
  CLS (Continuous Linked Settlement) ist die globale Infrastruktur zur Eliminierung des Abwicklungsrisikos (Herstatt-Risiko) bei Devisengeschäften. CLS nutzt einen Payment-versus-Payment-Mechanismus (PvP): beide Seiten eines FX-Trades (z.B. USD-Kauf gegen EUR-Verkauf) werden simultan und final in CLS abgewickelt — keine Seite zahlt ohne gleichzeitig den Gegenwert zu erhalten. CLS verarbeitet täglich FX-Transaktionen im Wert von ca. 6–7 Billionen USD. Über 70 % des globalen FX-Marktes werden via CLS abgewickelt. Die 18 CLS-Währungen werden in einem engen Settlement-Fenster (06:30–09:00 CET) verrechnet, in dem alle nationalen RTGS-Systeme dieser Währungen operieren.
beschreibung_einsteiger: |
  Beim Devisenhandel gibt es ein Problem: Wenn Sie EUR kaufen und USD verkaufen, zahlt vielleicht Ihre Bank zuerst die USD — und die Gegenpartei geht inzwischen pleite, bevor sie die EUR sendet. Das ist das sogenannte Herstatt-Risiko (benannt nach der Kölner Herstatt-Bank, die 1974 genau so scheiterte). CLS löst das: Beide Seiten zahlen gleichzeitig in ein zentrales System ein, und die Ausgabe erfolgt nur, wenn beide Seiten ihren Teil geliefert haben. Kein Risiko mehr.
aufbau: |
  CLS Bank hält Konten bei allen 18 RTGS-Systemen der CLS-Währungen. Direkte Teilnehmer (Settlement Members): ca. 75 große internationale Banken. Indirekte Teilnehmer (Third Parties): über 25.000 Banken und Fonds via Settlement Members. Prozess: FX-Trades werden nach Abschluss (matching via SWIFT Accord oder anderer Matching-Plattformen) an CLS gemeldet. CLS berechnet eine multilaterale Netting-Position je Währung und Teilnehmer. Im Settlement-Fenster werden nur die Netto-Positionen über die jeweiligen RTGS-Systeme übertragen.
settlement_modell: |
  Payment-versus-Payment (PvP): multilaterales Netting der FX-Positionen. Settlement erfolgt in einem engen täglichen Fenster (06:30–09:00 CET / 00:30–03:00 ET) via den 18 nationalen RTGS-Systemen. CLS berechnet für jeden Teilnehmer eine Netto-Short-Position je Währung — nur diese muss eingezahlt werden. Durchschnittliche Netting-Effizienz: ca. 96–98 % Volumenreduktion gegenüber Bruttosummen.
cut_off: |
  Einreicheschluss für FX-Trades (Submission Deadline): T+0 bis 00:00 CET (Mitternacht vor Settlement-Tag). Pay-in Fenster: 06:30–09:00 CET (Zahlung der Netto-Short-Positionen via RTGS). Pay-out Fenster: ab ca. 07:00 CET (Ausgabe der Netto-Long-Positionen). Vollständiger Abschluss: ~12:00 CET.
teilnehmer: |
  Ca. 75 Settlement Members (direkte Teilnehmer, darunter alle großen internationalen Handelsbanken: JPMorgan, Deutsche Bank, Citi, HSBC, BNP Paribas, UBS, Credit Suisse, Société Générale etc.). Über 25.000 Third-Party-Nutzer (Banken, Asset Manager, Corporate Treasury-Einheiten über ihre Settlement-Member-Bank). CLS-Eigentümer: 75 Gesellschafter (die Settlement Members).
relevanz_experte: |
  1) FX-Transaktionen des Corporate Treasury: Wenn das In-House-Bank-Center FX-Deals mit Banken abschließt, werden diese i.d.R. von der Counterparty-Bank (Settlement Member) via CLS abgewickelt — das Corporate selbst ist kein direkter CLS-Teilnehmer.
  2) Herstatt-Risiko-Eliminierung: CLS ist der Industriestandard für FX-Settlement-Risikominimierung — relevant für Counterparty-Risk-Reporting im Treasury.
  3) FX-Netting über Treasury-System: Corporate-interne FX-Netting-Positionen werden nicht via CLS, sondern intern verrechnet und dann als Netto-Deal an die Bank gegeben — diese geht dann via CLS.
  4) Non-CLS-Währungen (z.B. CNY, INR, BRL): Hier besteht weiterhin Herstatt-Risiko — Payment Netting oder bilateral PvP-Arrangements mit der Bank erforderlich.
  5) CLS Settlement Risk Report: Banken stellen Treasury-Kunden Reports über CLS-abgewickelte vs. non-CLS-Deals zur Verfügung — Grundlage für Counterparty-Risk-Limit-Überwachung.
relevanz_einsteiger: |
  Warum relevant: Wenn Ihre Treasury-Abteilung Euros gegen Dollar tauscht, wird das Risiko durch CLS automatisch eliminiert — das macht Ihre Bank im Hintergrund. Als Treasurer müssen Sie wissen: FX-Deals in den 18 CLS-Währungen sind sicherer als FX-Deals in anderen Währungen wie dem chinesischen Yuan, wo dieses Schutzsystem nicht existiert.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang zu CLS. Corporates sind "Third Parties" über ihre Settlement-Member-Bank. FX-Deals werden an die Bank gemeldet (via SWIFT oder TMS-Integration wie SAP TRM), die Bank gibt sie in CLS ein. SAP TRM: FX-Deals in Transaktion FTR_CREATE oder über Financial Risk Management — die CLS-Abwicklung ist für das Corporate transparent. Wichtig: Confirmations (MT300 via SWIFT oder elektronische Bestätigung) müssen vor Einreicheschluss vorliegen.
corporate_zugang_einsteiger: |
  Sie handeln Devisen mit Ihrer Bank — die Bank macht die CLS-Abwicklung vollautomatisch. Sie müssen sich darum nicht kümmern. Das einzige, was Sie wissen müssen: FX-Deals müssen frühzeitig bestätigt sein, damit alles rechtzeitig läuft.
---

# CLS — Zusätzliche Details

## Volumenstatistik (2024)

| Kennzahl | Wert |
|---|---|
| Tägliches Durchschnittsvolumen | ~6,5 Billionen USD |
| Anteil am globalen FX-Markt | ca. 70–75 % |
| Anzahl der tägl. Transaktionen | ~1,5–2 Mio. |
| Netting-Effizienz | 96–98 % |
| Anzahl Settlement Members | 75 |

## Die 18 CLS-Währungen

USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, SEK, NOK, DKK, SGD, HKD, KRW, ZAR, ILS, MXN, HUF

**Nicht in CLS:** CNY (Renminbi), INR (Indische Rupie), BRL (Brasilianischer Real), RUB, TRY — hier besteht weiterhin bilaterales FX-Settlement-Risiko.

## Geschichte: Das Herstatt-Risiko

Am 26. Juni 1974 schloss die deutsche Bankenaufsicht die Herstatt-Bank während des US-Handelstages — nachdem Herstatt bereits DEM-Zahlungen von Counterparties erhalten hatte, aber bevor die USD-Gegenzahlungen nach New York ausgezahlt wurden. Verluste in Höhe von 620 Mio. USD entstanden. Dies führte zur Gründung des CLS-Systems (nach fast 30 Jahren Entwicklung) im Jahr 2002.

## CLSNow und CLSNet

• **CLSNow:** Intraday-PvP-Settlement für ausgewählte Währungspaare (seit 2019) — für zeitkritische FX-Transaktionen
• **CLSNet:** Bilaterales FX-Netting-Service für Non-CLS-Währungen (seit 2018) — reduziert Settlement-Risiko auch für CNY, INR etc. durch Netting, ohne volles PvP
