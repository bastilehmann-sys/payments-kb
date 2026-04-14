---
kuerzel: "CH-FinfraG"
name: "Bundesgesetz über die Finanzmarktinfrastrukturen (FinfraG, SR 958.1) + FINMA-Geldwäschereiverordnung (FINMA-GwV, SR 955.033.0)"
typ: "Schweizer Bundesgesetz + FINMA-Verordnung"
kategorie: "Schweiz / Finanzmarkt + Geldwäsche"
geltungsbereich: "Schweizerische Eidgenossenschaft; gilt für Finanzmarktinfrastrukturen (Börsen, zentrale Gegenparteien, Zentralverwahrer, Transaktionsregister, Zahlungssysteme), für sämtliche Teilnehmer am schweizerischen Derivatehandel sowie mittelbar für DE-Industrie-Corporates mit CH-Tochtergesellschaften, CH-Hausbankbeziehungen oder CHF-Derivate-Positionen"
status_version: "FinfraG: AS 2015 5339, Stand 01.01.2024; FINMA-GwV Revision Stand 01.01.2023"
in_kraft_seit: "01.01.2016 (FinfraG); FINMA-GwV Revision 01.01.2023"
naechste_aenderung: "FinfraG-Teilrevision OTC-Derivate-Handel und ZVG (Zentralverwahrer) in parlamentarischer Beratung 2026"
behoerde_link: "https://www.finma.ch/de/dokumentation/dokumentation/regulierungsgrundlagen/"
betroffene_abteilungen: "Treasury, Legal, Compliance, Konzernfinanzierung, Steuerabteilung, IT/SAP-Basis"
beschreibung_experte: |
  Das Bundesgesetz über die Finanzmarktinfrastrukturen (FinfraG, SR 958.1) bildet die zentrale Schweizer Marktinfrastruktur- und Marktverhaltensregulierung und ist funktional vergleichbar mit den EU-Regelwerken EMIR, MiFID II/MiFIR und CSDR. Teilbereiche: (1) Finanzmarktinfrastrukturen (FMI) — Börsen und multilaterale Handelssysteme Art. 26 ff. FinfraG, zentrale Gegenparteien (CCP) Art. 48 ff., Zentralverwahrer (ZVG) Art. 61 ff., Transaktionsregister Art. 74 ff., Zahlungssysteme Art. 81 ff.; (2) Marktverhalten Art. 142–156 (Offenlegung von Beteiligungen, öffentliche Kaufangebote, Insiderhandel, Marktmanipulation); (3) Derivatehandel Art. 93–117 FinfraG mit Clearing-Pflicht über anerkannte CCPs, Reporting-Pflicht an ein anerkanntes Transaktionsregister sowie Risikominderungstechniken (Bestätigung, Portfoliokompression, Streitbeilegung, Bewertung, Besicherung). Die Drittstaaten-Äquivalenz CH–EU für EMIR-Reporting wurde von der FINMA mit Verfügung vom 12/2017 bestätigt, ein Doppel-Reporting ist bei korrekter Delegation vermeidbar. Die FINMA-Geldwäschereiverordnung (FINMA-GwV, SR 955.033.0) präzisiert das GwG: Sorgfaltspflichten Art. 6–21 (Identifikation Vertragspartner, Feststellung der wirtschaftlich berechtigten Person, Abklärung Geschäftsbeziehung), risikobasierter Ansatz Art. 13, erhöhte Sorgfaltspflichten bei PEPs nach Art. 2 lit. a–c FINMA-GwV. Für DE-Industrie-Corporates mit CH-Tochtergesellschaften sind insbesondere das OTC-Derivate-Reporting an das SIX Trade Repository, die LEI-Pflicht für CH-Geschäfte sowie bei Holding- oder Family-Office-Strukturen die FINMA-GwV-Kette über die kontoführende CH-Bank relevant."
beschreibung_einsteiger: |
  Das FinfraG ist das Schweizer Gegenstück zu den europäischen Gesetzen EMIR und MiFID II. Es regelt Börsen, zentrale Abwicklungsstellen und den Handel mit Derivaten in der Schweiz. Aufsichtsbehörde ist die FINMA. Für deutsche Industrieunternehmen mit einer Schweizer Tochter ist das Gesetz wichtig, wenn die CH-Tochter Devisen- oder Zinsderivate abschließt (z. B. zur Absicherung von CHF-Umsätzen) — diese Geschäfte müssen an ein Schweizer Transaktionsregister gemeldet werden, zusätzlich zur EU-EMIR-Meldung. Die FINMA-Geldwäschereiverordnung trifft das Unternehmen meist indirekt über die Schweizer Hausbank, die bei Kontoeröffnung und bei größeren Zahlungen umfangreiche Identifikations- und Herkunftsnachweise verlangt. Besonders streng sind die Regeln bei Holding-Strukturen oder wenn politisch exponierte Personen im Gesellschafterkreis stehen."
auswirkungen_experte: |
  1) OTC-Derivate-Reporting nach Art. 104 FinfraG: CH-Töchter müssen alle abgeschlossenen Derivate an ein FINMA-anerkanntes Transaktionsregister (i. d. R. SIX Trade Repository oder REGIS-TR) melden; bei Konzern-Delegation an die DE-Muttergesellschaft muss die Datenfeld-Spezifik zwischen FinfraG und EMIR-Refit abgeglichen werden.
  2) Clearing-Pflicht Art. 97 FinfraG für standardisierte OTC-Derivate oberhalb der CH-Schwellenwerte (kleine nichtfinanzielle Gegenpartei: CHF 8 Mrd. Brutto-Position) — Prüfung analog EMIR-NFC-Klassifizierung.
  3) Risikominderungstechniken Art. 107–111 FinfraG: tägliche Bewertung, Portfolio-Abstimmung, Streitbeilegungsverfahren, Besicherung für nicht-geclearte OTC-Derivate oberhalb der Initial-Margin-Schwelle.
  4) LEI-Stammdaten dual: CH-Geschäfte erfordern ebenfalls einen gültigen LEI der CH-Tochter — SAP-Stammdatenpflege synchron mit EU-Seite.
  5) FINMA-GwV: Bei erhöhten Risiken (PEP, komplexe Konzernstrukturen, Drittstaatenbezug) fordert die CH-Bank zusätzliche Unterlagen (wirtschaftlich Berechtigter Formular A/K/T, Mittelherkunftsnachweis); Verzögerungen im Onboarding einplanen (6–12 Wochen bei komplexen Strukturen).
  6) SECO-Sanktionen: separate Schweizer Sanktionsliste (teils abweichend von EU), Screening-Pflicht der CH-Bank erfasst auch Zahlungen aus DE-Mutter.
auswirkungen_einsteiger: |
  Wer eine Schweizer Tochter betreibt, muss Derivate-Geschäfte (z. B. Devisentermingeschäfte zur CHF-Absicherung) zusätzlich zur EU-Meldung auch an ein Schweizer Register melden lassen. Beim Eröffnen oder Fortführen von CH-Bankkonten verlangt die Bank sehr viele Dokumente zur Konzernstruktur und zu den wirtschaftlich berechtigten Personen — das dauert oft mehrere Wochen. Die Schweiz hat außerdem eine eigene Sanktionsliste (SECO), die teilweise von der EU-Liste abweicht; Zahlungen an bestimmte Länder können deshalb in der CH blockiert werden, obwohl sie in der EU erlaubt wären."
pflichtmassnahmen_experte: |
  • Reporting-Delegations-Vertrag zwischen CH-Tochter und DE-Mutter bzw. Hausbank für Derivate-Meldung (Art. 105 FinfraG) dokumentieren
  • LEI-Beantragung/Jahresrenewal für jede CH-Rechtseinheit, die Derivate handelt; SAP Business Partner (BP) Customizing für LEI-Feld
  • Anschluss an SIX Trade Repository oder REGIS-TR klären (über Hausbank oder direkt)
  • NFC-Klassifizierung der CH-Tochter (kleine/grosse nichtfinanzielle Gegenpartei) jährlich überprüfen
  • FINMA-GwV-konforme KYC-Unterlagen bereithalten: Handelsregisterauszug, Statuten, Formular A/K/T wirtschaftlich Berechtigter, UBO-Erklärung
  • SECO-Sanktions-Screening in SAP GTS oder über Drittanbieter (z. B. Accuity, Dow Jones) pflegen — CH-Liste separat zur EU-Liste
  • Kollisionsanalyse FinfraG vs. EMIR bei Back-to-Back-Intercompany-Derivaten
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Klären, ob die CH-Tochter selbst Derivate handelt oder alles über die DE-Mutter läuft. 2) Für die CH-Tochter einen LEI beantragen (falls noch nicht vorhanden). 3) Mit der CH-Hausbank klären, ob sie das Derivate-Reporting übernimmt. 4) KYC-Unterlagen (Handelsregister, Gesellschafterstruktur, wirtschaftlich Berechtigter) aktuell halten und jährlich aktualisieren. 5) Sanktions-Screening in der Zahlungssoftware auch auf die Schweizer SECO-Liste erweitern."
best_practice_experte: |
  • Delegation des Derivate-Reportings an die DE-Hausbank oder an die zentrale Treasury der DE-Mutter — vermeidet Doppelpflege, Voraussetzung ist sauberer Datenfeld-Mapping-Abgleich FinfraG-Spezifika vs. EMIR-Refit
  • CH-Tochter nach Möglichkeit als kleine NFC klassifizieren (unter CHF-Schwellen) — erspart Clearing-Pflicht
  • FINMA-Rundschreiben 2016/07 (Video- und Online-Identifizierung) für digitale KYC-Prozesse nutzen
  • Bei Holdings/Family-Office: saubere Formular-K/T-Struktur mit UBO ≤ 25 % dokumentieren, verhindert spätere Nachforderungen der Bank
  • Frühzeitige Einbindung der CH-Rechtsberatung (z. B. Homburger, Bär & Karrer, Lenz & Staehelin) bei Grenzfällen
best_practice_einsteiger: |
  Wenn möglich, sollte die deutsche Mutter das Derivate-Reporting zentral übernehmen — das reduziert Aufwand in der Schweizer Tochter. Bei Holdingstrukturen lohnt sich ein sauberes Einmal-Setup der KYC-Dokumente mit der CH-Hausbank; danach sind jährliche Aktualisierungen Routine. Für Spezialfälle (PEP, Offshore-Gesellschafter) sollte frühzeitig ein Schweizer Rechtsanwalt eingebunden werden."
risiken_experte: |
  • Reporting-Lücke zwischen FinfraG und EMIR: bei fehlerhafter Delegation droht Doppel- oder Nullmeldung, beides sanktionierbar
  • Art. 154 FinfraG: Verletzung der Anzeigepflicht Beteiligungen bis CHF 100.000 Busse
  • Art. 155 FinfraG: Verletzung der Transparenz- und Meldepflichten bis CHF 10 Mio. Gewinnabschöpfung
  • Strafnormen Art. 147–149 FinfraG (Insiderhandel, Marktmanipulation): Freiheitsstrafe bis 5 Jahre
  • Bankseitige Risiken: Kontosperrung oder -kündigung durch CH-Hausbank bei unvollständigen FINMA-GwV-Unterlagen
  • SECO-Sanktionsverstöße: strafrechtliche Folgen nach Embargogesetz (EmbG) SR 946.231, Busse bis CHF 1 Mio. oder Freiheitsstrafe
  • Reputationsrisiko bei FINMA-Untersuchungen, die öffentlich werden (Enforcement-Berichte)
risiken_einsteiger: |
  Das größte Risiko ist, dass die Schweizer Bank bei unvollständigen Dokumenten oder bei Sanktionstreffern Konten sperrt oder die Geschäftsbeziehung beendet — was für die CH-Tochter operativ sehr kritisch ist. Beim Derivate-Handel drohen Bußen bis CHF 10 Mio., wenn Meldepflichten verletzt werden. Bei Insiderhandel oder Marktmanipulation gibt es sogar Haftstrafen. Die Schweizer Sanktionsliste ist streng — bei Verstößen drohen empfindliche Strafen und Reputationsschäden."
verwandte_regulierungen: "EMIR, MiFID-II, GwG, FATF-Empfehlungen, DORA, CSDR"
sap_bezug: "SAP TRM-TM (Transaction Manager) Hedge-Reporting mit CH-Anpassung — Datenfeld-Mapping FinfraG vs. EMIR-Refit im Customizing der Korrespondenzobjekte; LEI-Stammdaten dual EU/CH in SAP BP (Business Partner); SAP GTS (Global Trade Services) Compliance-Modul für SECO-Sanktionslisten parallel zur EU-Liste; SAP FSCM In-House Cash Konfiguration mit Währungsfähigkeit CHF; SAP BCM für CH-Banken-Connectivity (SIC/euroSIC via SWIFT oder Host-to-Host)"
bussgeld: "Art. 154 FinfraG (Verletzung Anzeigepflichten) bis CHF 100.000; Art. 155 FinfraG (Verletzung Transparenz-/Meldepflichten) bis CHF 10 Mio. Gewinnabschöpfung; Art. 147–149 FinfraG (Insiderhandel, Marktmanipulation) Freiheitsstrafe bis 5 Jahre; FINMA-GwV-Verstöße via GwG bis CHF 500.000 (Art. 37 GwG)"
pruefpflicht: "Bei Finanzmarkt-Teilnehmern jährliche FINMA-Prüfung durch zugelassene Prüfgesellschaft (Art. 24 FINMAG); für CH-Tochtergesellschaften von DE-Industrie ohne FINMA-Lizenz: Plausibilitätsprüfung des Derivate-Reportings im Rahmen der ordentlichen Revision nach OR 727 ff."
aufwand_tshirt: "M"
---

# CH-FinfraG — Vertiefung: Derivate-Reporting und FINMA-GwV für DE-Corporates mit CH-Tochter

## Reporting-Matrix FinfraG vs. EMIR

| Thema | FinfraG (CH) | EMIR-Refit (EU) | Delegation möglich? |
|---|---|---|---|
| Meldepflicht | Art. 104 FinfraG, beide Parteien | Art. 9 EMIR, beide Parteien | Ja, vertraglich |
| Transaktionsregister | SIX TR, REGIS-TR | DTCC, REGIS-TR, KDPW | REGIS-TR bedient beide |
| LEI-Pflicht | Ja | Ja | — |
| Clearing-Schwelle NFC | CHF 8 Mrd. Brutto | EUR 3 Mrd. (Zins), abweichend | Separate Klassifizierung |
| Back-to-Back Intercompany | Reporting-Pflicht, Clearing-Exemption möglich | Reporting-Pflicht, Intragroup-Exemption | Prüfung Einzelfall |

## SAP-Treasury-Umsetzung

1) **SAP TRM-TM**: Hedge-Accounting und Korrespondenz-Customizing für duales Reporting. Datenfelder FinfraG (u. a. "Handelsplatz-Identifier" CH-spezifisch) im Customizing der Meldeschnittstelle hinterlegen.
2) **SAP BP**: LEI-Feld (BUT000-LEI) für jede CH-Rechtseinheit gepflegt, jährliches Renewal-Monitoring.
3) **SAP GTS**: SECO-Sanktionsliste als separater Listen-Provider; Screening-Workflow vor Zahlungsfreigabe.
4) **SAP FSCM IHC**: CHF-fähig; bei POBO-Zahlungen aus CH-Tochter zusätzlich FINMA-GwV-Nachweiskette prüfen.
