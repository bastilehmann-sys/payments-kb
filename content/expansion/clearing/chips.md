---
name: Clearing House Interbank Payments System
abkuerzung: CHIPS
region: USA
typ: Deferred Net Settlement (mit intraday Netting)
waehrung: USD
betreiber: The Clearing House Payments Company LLC
status: Operativ, seit 1970
beschreibung_experte: |
  CHIPS ist das größte private USD-Großbetragszahlungssystem der USA. Täglich werden ca. 1,8 Billionen USD in rund 250.000 Transaktionen abgewickelt — das entspricht ca. 95 % aller grenzüberschreitenden USD-Zahlungen sowie einem erheblichen Teil der US-Inlandszahlungen von Großunternehmen. Im Gegensatz zu Fedwire arbeitet CHIPS mit einem multilateralen Netting-Algorithmus: Zahlungen werden zunächst in einer Queue gesammelt und gegen gegenseitige Verbindlichkeiten aufgerechnet, wodurch typischerweise nur 3–5 % der Bruttowerte als tatsächliche Fedwire-Liquiditätsüberweisungen fließen müssen. Am Tagesende werden offene Positionen über Fedwire gesettelt.
beschreibung_einsteiger: |
  Stellen Sie sich vor, zehn Unternehmen überweisen sich gegenseitig Geld. Statt alle Überweisungen einzeln durchzuführen, rechnet CHIPS zunächst auf, wer unter dem Strich wem was schuldet — und überweist am Ende nur die Differenz. Das spart enorm viel Liquidität. CHIPS ist quasi der "Großhandelskanal" für Dollar-Zahlungen zwischen den großen US-Banken.
aufbau: |
  Participant-Struktur: ca. 43 direkte Teilnehmer (primär Money Center Banks: JPMorgan, Citi, Bank of America, Wells Fargo, HSBC USA, Deutsche Bank NY, BNY Mellon u.a.). Alle anderen US-Banken nutzen CHIPS indirekt über Correspondent-Banking-Beziehungen. CHIPS wird von The Clearing House betrieben, einem privaten Bankenkonsortium. Das System wurde 2004 von Batch-Verarbeitung auf Echtzeit-Netting umgestellt.
settlement_modell: |
  Multilaterales Netting mit intraday-Zwischenentlastungen; Finalsettlement via Fedwire-Überweisung vom CHIPS-Prefund-Konto (gehalten bei der Federal Reserve Bank of New York) am Tagesende. CHIPS-Zahlungen gelten erst mit Fedwire-Finalsettlement als unwiderruflich.
cut_off: |
  Betriebsstunden: 21:00 Uhr Vortag – 17:00 Uhr New York Time (Mo–Fr, außer US Federal Holidays). Einreicheschluss für Teilnehmer: 17:00 ET. Release des finalen Settlement: ca. 17:15–17:30 ET.
teilnehmer: |
  43 direkte Teilnehmer (Stand 2024/2025). Darunter die 15 größten US- und internationalen Banken mit New York-Präsenz. Indirekte Nutzer: Tausende von US-Banken und Kreditinstituten über ihre Correspondent Banks.
relevanz_experte: |
  1) Für US-Tochtergesellschaften mit großvolumigen B2B-Zahlungen (>1 Mio. USD) über Hausbank relevant — Banken leiten USD-Großbetragszahlungen typischerweise über CHIPS, sofern kein Fedwire-Expressauftrag benötigt wird.
  2) Bei IHB-Strukturen (In-House Banking) mit USD-Pooling entscheidet die Hausbank, ob CHIPS oder Fedwire genutzt wird — Treasury sollte die SLA-Unterschiede kennen.
  3) CHIPS-Zahlungen sind günstiger als Fedwire (Netting-Effizienz), aber nicht guaranteed-intraday — kritische Same-Day-Zahlungen (z.B. Loan Repayments) besser via Fedwire.
  4) Counterparty-Risk-Aspekt: CHIPS-Zahlungen sind bis zum Finalsettlement ~17:00 ET technisch reversibel — für Risikomanagement im Cash Management beachten.
relevanz_einsteiger: |
  Warum relevant: Wenn Ihr US-Tochterunternehmen Dollar-Überweisungen an andere große Unternehmen sendet, läuft das wahrscheinlich über CHIPS — ohne dass Sie es wissen. CHIPS ist sozusagen die "Autobahn" für große Dollarüberweisungen zwischen US-Banken. Als Treasurer müssen Sie wissen: große USD-Beträge brauchen etwas Vorlauf und kommen nicht immer sofort an.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang. Industrieunternehmen nutzen CHIPS ausschließlich über ihre Correspondent Bank oder Hausbank (Money Center Bank). Instruktionen werden als SWIFT MT103 oder via proprietärer Bankschnittstelle (Host-to-Host, SFTP) übermittelt. Die Bank entscheidet intern, ob die Zahlung via CHIPS oder Fedwire geroutet wird. SAP-seitig: Zahlungsaufträge in der Payment Factory mit Zahlungsweg "USD Wire Transfer" — Routing entscheidet die Bank.
corporate_zugang_einsteiger: |
  Ihre Bank macht das automatisch für Sie. Sie geben in Ihrem SAP oder Online-Banking eine USD-Überweisung auf — die Bank wählt dann selbst, ob sie CHIPS oder Fedwire nutzt. Als normales Unternehmen haben Sie da keinen direkten Einfluss.
---

# CHIPS — Zusätzliche Details

## Volumenstatistik (2024)

| Kennzahl | Wert |
|---|---|
| Tägliches Bruttovolumen | ~1,8 Billionen USD |
| Tägliche Transaktionsanzahl | ~250.000 |
| Netting-Effizienz | 95–97 % (nur 3–5 % fließen als echte Liquidität) |
| Jahresvolumen | ~440 Billionen USD |

## CHIPS vs. Fedwire — Entscheidungsmatrix für Treasury

| Kriterium | CHIPS | Fedwire |
|---|---|---|
| Settlement-Garantie | Erst ~17:00 ET final | Sofort/RTGS |
| Kosten | Günstiger (Netting) | Höher |
| Geschwindigkeit | Intraday, aber kein RTGS | Real-Time |
| Geeignet für | Normale B2B Großzahlungen | Zeitkritische Zahlungen, Loan Repayments |
| Betreiber | Privat (The Clearing House) | Federal Reserve |

## Historisches

CHIPS startete 1970 als Batch-System, wurde 1981 auf taggleiche Verrechnung und 2004 auf das heutige kontinuierliche Netting-System umgestellt. Die Reform 2004 reduzierte den Liquiditätsbedarf der Teilnehmer um ca. 97 %.
