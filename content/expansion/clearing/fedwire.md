---
name: Fedwire Funds Service
abkuerzung: Fedwire
region: USA
typ: Real-Time Gross Settlement (RTGS)
waehrung: USD
betreiber: Federal Reserve Banks (Federal Reserve System)
status: Operativ, seit 1918 (elektronisch seit 1970)
beschreibung_experte: |
  Fedwire Funds Service ist das US-amerikanische RTGS-System für Großbetragszahlungen, betrieben von den Federal Reserve Banks. Jede Überweisung wird in Echtzeit und unwiderruflich über die Konten der Teilnehmer bei der Federal Reserve abgewickelt — ohne Netting. Fedwire verarbeitet täglich ca. 850.000–1.000.000 Transaktionen mit einem Gesamtvolumen von ca. 4–5 Billionen USD. Teilnehmer sind alle Institute, die ein Fed-Konto (Master Account) halten — über 9.000 depository institutions. Fedwire ist die Settlement-Infrastruktur hinter CHIPS, dem US-Interbank-Markt und dem US-Treasury-Wertpapierhandel.
beschreibung_einsteiger: |
  Fedwire ist wie eine direkte Bundesbank-Überweisung in den USA. Wenn eine Zahlung über Fedwire läuft, ist das Geld sofort und unwiderruflich beim Empfänger — keine Aufrechnung, kein Warten. Es ist das sicherste und schnellste USD-Zahlungssystem, aber auch das teuerste. Stellen Sie sich Fedwire wie einen garantierten Expresskurier vor, während CHIPS eher wie eine gebündelte Sammellieferung ist.
aufbau: |
  Betrieben von den 12 Federal Reserve Banks (technische Plattform zentral). Teilnehmer: alle US-Depository Institutions mit Fed Master Account (Geschäftsbanken, Sparkassen, Credit Unions, Zweigniederlassungen ausländischer Banken in den USA). Zugang: direkt über FedLine Advantage (Web-basiert), FedLine Direct (Host-to-Host), oder Correspondent Banking. Jede Transaktion ist bilateral sofort final.
settlement_modell: |
  Real-Time Gross Settlement (RTGS): Jede Zahlung wird einzeln, sofort und endgültig gegen das Reservekonto des sendenden Instituts bei der Federal Reserve belastet und dem Empfängerkonto gutgeschrieben. Keine Netting-Runden, keine Queues. Intraday-Kredit (Daylight Overdraft) ist gegen Sicherheiten möglich.
cut_off: |
  Betriebsstunden: 21:00 Uhr Vortag – 19:00 Uhr Eastern Time (ET), Mo–Fr. Hinweis: Verlängerung auf 21:30–22:00 ET seit Nov. 2023 für bestimmte Zeitfenster. Federal Reserve Holidays: System geschlossen. Same-Day-Zahlungen müssen vor 18:00 ET eingereicht werden.
teilnehmer: |
  Ca. 9.500 direkte Teilnehmer (depository institutions mit Fed Master Account, Stand 2024). Dazu indirekte Teilnehmer über Correspondent Banks. Ausländische Zentralbanken und internationale Organisationen haben ebenfalls Zugang über die Federal Reserve Bank of New York.
relevanz_experte: |
  1) Zeitkritische USD-Zahlungen (Loan Repayments, DTC Settlement-Beträge, Steuerzahlungen an US-Behörden) müssen zwingend via Fedwire instruiert werden — CHIPS bietet keine RTGS-Garantie.
  2) Beim SAP Payment Program: Fedwire-Zahlungen typischerweise als "Priority Wire" oder "Fedwire" im Zahlungsweg markieren — die Hausbank benötigt eine explizite Instruktion, um Fedwire statt CHIPS zu wählen.
  3) Intraday-Liquidität: Fedwire ermöglicht Daylight Overdrafts für Banken — relevant für Treasury bei IHB-Strukturen, die über eine US-Tochterbank operieren.
  4) Fedwire Securities Service (FedWire Securities) ist ein separates, aber verwandtes System für US-Treasury-Wertpapiere — nicht zu verwechseln mit Fedwire Funds.
relevanz_einsteiger: |
  Warum relevant: Wenn Sie in den USA eine wichtige Zahlung senden müssen, die pünktlich ankommen muss (z.B. eine Kreditrückzahlung oder eine Steuerzahlung), dann brauchen Sie Fedwire. Ihre Bank kann das für Sie einrichten. Es ist teurer als CHIPS, aber dafür kommt das Geld wirklich in Sekunden an und ist unwiderruflich.
corporate_zugang_experte: |
  Kein direkter Corporate-Zugang. Großunternehmen instruieren Fedwire-Zahlungen via SWIFT MT103 mit spezifischem Routing-Indicator, via proprietärer Bankschnittstelle (Host-to-Host, SFTP-Dateien im NACHA-Wire-Format oder ISO 20022 pacs.008) oder über Online-Banking der Hausbank. SAP S/4HANA: Payment Method "W" (Wire Transfer) mit explizitem Fedwire-Flag bzw. Prioritätskennzeichnung in der Zahlungsauftragsübertragung. Banken verlangen häufig spezifische Referenzfelder (Intermediary Bank, SWIFT BIC der Federal Reserve).
corporate_zugang_einsteiger: |
  Sie rufen Ihre Bank an oder nutzen das Online-Banking und sagen: "Bitte als Fedwire schicken." Die Bank macht dann alles Weitere. Über SAP läuft das automatisch, wenn es richtig konfiguriert ist.
---

# Fedwire — Zusätzliche Details

## Volumenstatistik (2024)

| Kennzahl | Wert |
|---|---|
| Tägliches Volumen (Fonds) | ~4,5 Billionen USD |
| Tägliche Transaktionszahl | ~850.000–1.000.000 |
| Durchschnittliche Transaktionsgröße | ~4,5 Mio. USD |
| Jahresvolumen | ~1.000 Billionen USD |

## Migration zu ISO 20022

Die Federal Reserve migriert Fedwire Funds schrittweise auf ISO 20022 (pacs.008/pacs.009). Die vollständige ISO 20022 Umstellung war für März 2025 geplant — SAP-Systeme müssen entsprechende Nachrichtenformate unterstützen. Legacy-Fedwire-Format (Proprietary Tag-basiert) wird abgelöst.

## Daylight Overdraft — wichtig für Treasury

Banken können während des Betriebstages (intraday) über ihr Guthaben hinausgehen — das nennt sich "Daylight Overdraft" und wird von der Federal Reserve erlaubt, aber bepreist (0,5 % p.a. auf die Spitze). Für Treasury-Zentralen mit USD-Pooling via US-Hausbank ist das ein Liquiditätspuffer.
