---
kuerzel: DSGVO-ZV
name: DSGVO / GDPR im Zahlungsverkehr
typ: EU-Verordnung
kategorie: Datenschutz / Datenhaltung
in_kraft_seit: "25.05.2018"
naechste_aenderung: "EDPB Guidelines zu Aufbewahrungsfristen 2026; laufende EuGH-Rechtsprechung zu Drittstaatentransfers"
behoerde_link: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines_en
betroffene_abteilungen: Treasury, Compliance, Legal, IT, HR
geltungsbereich: EU/EWR-weit; gilt für alle Verarbeiter personenbezogener Daten in der EU sowie für Nicht-EU-Unternehmen, die Daten von EU-Bürgern verarbeiten (Marktortprinzip, Art. 3 Abs. 2 DSGVO)
status_version: Verordnung (EU) 2016/679, in Kraft seit 25.05.2018; Anwendbar ohne nationale Umsetzungsakte (unmittelbare Geltung); in Deutschland ergänzt durch BDSG 2018
beschreibung_experte: |
  Die DSGVO (Datenschutz-Grundverordnung, VO (EU) 2016/679) ist für den Zahlungsverkehr in mehrfacher Hinsicht relevant: Zahlungsdaten (IBAN, BIC, Betrag, Verwendungszweck, Transaktionsdatum) sind personenbezogene Daten, sofern sie einer natürlichen Person zugeordnet werden können (Erwägungsgrund 26 DSGVO). Besondere Anforderungen entstehen durch die Kollision zweier gegenläufiger Pflichten: 1) Aufbewahrungspflicht nach Steuerrecht (§ 147 AO: 10 Jahre), Handelsrecht (§ 257 HGB: 6 Jahre für Korrespondenz, 10 Jahre für Buchungsbelege) und GwG (§ 8 GwG: 5 Jahre nach Vertragsende); 2) Löschpflicht nach Art. 5 Abs. 1 lit. e DSGVO (Speicherbegrenzung) und Art. 17 DSGVO (Recht auf Löschung). Diese Spannung wird durch Art. 17 Abs. 3 DSGVO aufgelöst: Aufbewahrungspflichten aus Rechtsvorschriften rechtfertigen eine Ausnahme vom Löschrecht. Weitere Kernthemen: internationale Datentransfers (Art. 44–49 DSGVO) bei grenzüberschreitenden Zahlungen, insbesondere nach dem Schrems-II-Urteil (EuGH C-311/18) und den neuen Standardvertragsklauseln (SCC 2021), Datenminimierung (Art. 5 Abs. 1 lit. c) bei SWIFT-Nachrichten (alle Felder senden vs. benötigte Felder), und Auftragsverarbeitung (Art. 28) bei Zahlungsdienstleistern und Clearinghäusern.
beschreibung_einsteiger: |
  Die DSGVO schützt die Daten von Personen — und das gilt auch für Zahlungsdaten. Wenn Bankverbindungen, Überweisungsbeträge oder Verwendungszwecke von echten Personen gespeichert werden, gelten strenge Regeln: Daten dürfen nur so lange gespeichert werden, wie es wirklich nötig ist. Gleichzeitig gibt es aber Steuergesetze, die verlangen, Zahlungsbelege 10 Jahre aufzubewahren. Wenn Zahlungen ins Ausland gehen (z. B. USA), gelten zusätzliche Regeln für den Datentransfer. Firmen müssen außerdem sicherstellen, dass ihre Zahlungsdienstleister (z. B. Banken, SWIFT) die Daten ebenfalls korrekt schützen.
auswirkungen_experte: |
  1) Aufbewahrungsmatrix für Zahlungsdaten: Je Datenobjekt (Zahlungsauftrag, Kontoauszug, SWIFT-Nachricht, Lastschriftmandat) muss eine Aufbewahrungsfrist definiert werden, die das Maximum aus allen anwendbaren Rechtspflichten widerspiegelt — und nach Ablauf ist unverzüglich zu löschen (Art. 5 Abs. 1 lit. e DSGVO). Lastschriftmandate: mindestens 14 Monate nach letzter genutzter Lastschrift (EPC-Regelwerk) + steuerliche Aufbewahrungspflicht.
  2) Datenminimierung in SWIFT-Nachrichten (Art. 5 Abs. 1 lit. c): In pain.001 / MT103 enthaltene Felder, die keine Pflichtfelder sind (z. B. freiwillige Adressfelder, überschüssige Verwendungszweckinformationen), sollten nur gefüllt werden, wenn das Gegenparteiland oder der Zahlungsweg sie erfordert.
  3) Drittstaatentransfers (Art. 44–49): Zahlungen an Nicht-EU-Empfänger (USA, UK post-Brexit, CH, IN) erfordern geeignete Schutzmaßnahmen: EU-SCC 2021 (Durchführungsbeschluss (EU) 2021/914), Adequacy Decision (z. B. EU-US Data Privacy Framework 2023, UK-Adequacy-Beschluss) oder Ausnahmeregelung Art. 49 Abs. 1 lit. b (Vertragserfüllung). SWIFT als belgischer Rechtsträger unterliegt DSGVO direkt; US-Zugriff auf SWIFT-Daten (NSL-Gefahr) war Gegenstand des EU-US SWIFT-Agreements (TFTP) — aktuell noch in Kraft.
  4) Auftragsverarbeitungsverträge (AVV) mit Zahlungsdienstleistern: Banken, PSPs, Clearinghäuser und BPO-Anbieter, die im Auftrag verarbeiten, benötigen AVV nach Art. 28 DSGVO — Standardklauseln der Hausbank prüfen.
auswirkungen_einsteiger: |
  Du musst sicherstellen, dass Zahlungsdaten nur so lange gespeichert werden, wie es Steuergesetze und Handelsrecht vorschreiben — danach müssen sie gelöscht werden. Wenn Zahlungen in die USA oder andere Länder außerhalb der EU gehen, brauchst du bestimmte Vertragsklauseln, die den Datenschutz sicherstellen. Deine Bank und andere Zahlungsdienstleister müssen ebenfalls nachweisen, dass sie die Daten sicher behandeln — dafür gibt es spezielle Datenschutzverträge.
pflichtmassnahmen_experte: |
  • Aufbewahrungsmatrix erstellen: Alle Datenobjekte im Zahlungsverkehr (Zahlungsaufträge, Kontoauszüge, MT-Nachrichten, pain.001/002/008, Lastschriftmandate, Korrespondenz) mit zugehörigen Rechtspflichten (§ 147 AO, § 257 HGB, § 8 GwG, PSD2 Art. 24, MiFID II Art. 25) und Maximalfristen dokumentieren
  • Löschkonzept im TM-System: SAP TRM / TM-System so konfigurieren, dass nach Ablauf der Maximaaufbewahrungsfrist automatische Anonymisierung oder Löschung erfolgt — personenbezogene Felder (Name, IBAN) können nach steuerlicher Aufbewahrungspflicht anonymisiert werden, während Buchungsbelege erhalten bleiben
  • AVV mit allen Zahlungsdienstleistern abschließen oder aktualisieren: Hausbanken, PSPs (Stripe, Adyen), Clearinghäuser (SEPA CSM), BPO-Anbieter — Art. 28-konforme Verträge mit Audit-Rechten, Unterauftragsvergabe-Zustimmung, Datenlöschverpflichtung
  • SCC 2021 für alle relevanten Drittstaatentransfers implementieren: Bewertung durch Transfer Impact Assessment (TIA) erforderlich, wenn Drittland hohes Überwachungsrisiko hat (USA, China, RU)
  • Datenminimierungsüberprüfung SWIFT/pain.001: Welche Felder werden befüllt, die nicht zwingend erforderlich sind? Prozessanweisung für Treasury-Mitarbeiter erstellen
  • ROPA (Record of Processing Activities, Art. 30) für Zahlungsverkehrsprozesse aktuell halten: Zweck, Rechtsgrundlage, Empfänger, Drittstaaten, Aufbewahrungsfristen je Verarbeitung dokumentieren
  • Betroffenenrechte-Prozess (Art. 15–22): Auskunfts- und Löschanfragen für Zahlungsdaten sollten automatisierbar sein — Spannungsfeld zu Aufbewahrungspflicht transparent kommunizieren
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Eine Liste erstellen, welche Zahlungsdaten wie lange gespeichert werden — 10 Jahre für Buchhaltungsbelege, kürzere Fristen für andere Daten. 2) Mit allen Banken und Zahlungsdienstleistern einen Datenschutzvertrag abschließen. 3) Sicherstellen, dass Zahlungsdaten, die in die USA oder andere Nicht-EU-Länder übertragen werden, durch spezielle Klauseln geschützt sind. 4) Nach Ablauf der Aufbewahrungsfristen Daten aktiv löschen oder schwärzen.
best_practice_experte: |
  • "Privacy by Design" in Payment-Workflows (Art. 25 DSGVO): Neue Zahlungsformate (z. B. ISO 20022-Migration) als Gelegenheit nutzen, Datenminimierung systematisch einzubauen — nicht nachträglich zu flicken
  • Pseudonymisierung wo möglich: Interne Reporting-Systeme (BI, DataWarehouse) können mit pseudonymisierten IBANs arbeiten — nur im Clearing-Kontext wird die Klartext-IBAN benötigt
  • Lokalisierte Aufbewahrungsmatrizen für Konzerne: Multinationale Treasury Center müssen je Land (DE: §147 AO, AT: §132 BAO, FR: Article L123-22 C.com, IT: DPR 600/73) separate Fristen vorhalten — GRC-Tool oder Legal-Hold-Modul empfohlen
  • SWIFT-Zugriffsverwaltung: Zugriff auf SWIFT-Alliance-Systeme auf Need-to-know beschränken; alle Zugriffsprotokolle unter Art. 32 DSGVO (technische Sicherheit) mindestens 12 Monate aufbewahren
  • EuGH-Monitoring: EuGH C-311/18 (Schrems II) und C-238/22 haben internationale Datentransferregeln mehrfach verändert — laufendes Monitoring der EDPB-Leitlinien (insb. zu Drittstaatentransfers) als Pflichtaufgabe
best_practice_einsteiger: |
  Denke schon beim Aufbau neuer Zahlungsprozesse an den Datenschutz — es ist viel einfacher, von Anfang an nur die Daten zu erfassen, die wirklich gebraucht werden, als sie nachträglich zu löschen. Halte eine einfache Liste der Daten und ihrer Aufbewahrungsfristen aktuell und weise eine Verantwortungsperson dafür aus.
risiken_experte: |
  • Bußgeldrisiko nach Art. 83 DSGVO: Verstöße gegen Grundprinzipien (Art. 5), Rechtsgrundlagen (Art. 6) oder Drittstaatentransferregeln (Art. 44) können Bußgelder bis 4% des globalen Jahresumsatzes auslösen — Aufsichtsbehörden (BfDI, LfD) werden aktiver im Finanzsektor
  • Kollisionsrisiko Aufbewahrung vs. Löschpflicht: Wenn Löschkonzept fehlt oder veraltet ist, bestehen entweder Verstöße gegen DSGVO (zu lange Speicherung) oder gegen Steuerrecht (zu frühe Löschung) — beide mit Sanktionsrisiko
  • Drittstaaten-Datentransfer-Risiko: Post-Schrems-II-Unsicherheit bei US-Dienstleistern (z. B. Zahlungsabwickler auf AWS-US) bleibt latent, auch mit EU-US Data Privacy Framework — weitere EuGH-Rechtsprechung möglich
  • Betroffenenrechte-Risiko: Kunden oder Mitarbeiter können Auskunft über gespeicherte Zahlungsdaten verlangen (Art. 15) — ohne automatisierten Prozess entstehen hohe Aufwände und Fristrisiken (1 Monat Bearbeitungsfrist, Art. 12 Abs. 3)
  • SWIFT-Datenzugangsrisiko durch US-Behörden: Trotz TFTP-Abkommen besteht rechtliches Restrisiko, das durch TIA nachvollziehbar bewertet werden sollte
risiken_einsteiger: |
  Das größte Risiko ist, Daten zu lange zu speichern (DSGVO-Verstoß) oder zu früh zu löschen (Steuerverstoß). Wenn ein Kunde fragt, welche Daten über ihn gespeichert sind, muss das Unternehmen innerhalb eines Monats antworten können — ohne automatisierte Systeme ist das sehr aufwendig. Bei schwerwiegenden Verstößen drohen hohe Geldstrafen.
---

# DSGVO im Zahlungsverkehr — Vertiefung

## Aufbewahrungsfristen-Matrix (Deutschland)

| Datenobjekt | Rechtsgrundlage Aufbewahrung | Mindestfrist | Maximale Aufbewahrung (DSGVO-Grenze) |
|---|---|---|---|
| Zahlungsbelege / Buchungsunterlagen | § 147 Abs. 1 Nr. 5 AO, § 257 Abs. 1 Nr. 4 HGB | 10 Jahre | 10 Jahre — danach Löschpflicht (Art. 17 DSGVO) |
| Handelskorrespondenz (Korrespondenz zu Zahlungen) | § 257 Abs. 1 Nr. 2+3 HGB | 6 Jahre | 6 Jahre |
| Geldwäsche-relevante Transaktionsdaten | § 8 Abs. 4 GwG | 5 Jahre nach Vertragsende | 5 Jahre — keine DSGVO-Ausnahme darüber hinaus |
| SEPA-Lastschriftmandate | EPC-Regelwerk (14 Monate nach letzter Nutzung) + § 147 AO | 10 Jahre + 14 Monate | 10 Jahre + 14 Monate |
| SWIFT MT-Nachrichten / pain-Dateien | § 147 AO (Buchungsbeleg) | 10 Jahre | 10 Jahre |
| Zugangsprotokolle (SWIFT, EBICS) | Art. 32 DSGVO (technische Sicherheit), DORA Art. 12 | mind. 12 Monate | 3–5 Jahre empfohlen (DORA-Konsistenz) |

## Drittstaatentransfer-Mechanismen (Stand April 2026)

1) **Adequacy Decision**: EU-Kommission hat Angemessenheitsbeschlüsse für ca. 15 Länder — u. a. UK (gültig bis 2027), CH (gültig), US (EU-US DPF, seit 07.2023, mögliche EuGH-Herausforderung), JP, KR.
2) **EU-SCC 2021** (Standardvertragsklauseln, Durchführungsbeschluss (EU) 2021/914): Modulares System (C2C, C2P, P2C, P2P) — für Treasury-Zahlungen relevant Modul 2 (Controller zu Processor) beim Einsatz von US-PSPs.
3) **Transfer Impact Assessment (TIA)**: Pflicht beim Einsatz von SCC — muss rechtliches Schutzgefälle des Ziellandes bewerten (staatliche Überwachungsgesetze, z. B. FISA Section 702 USA, Art. 35 russisches Datenlokalisierungsrecht).
4) **Binding Corporate Rules (BCR)**: Für konzerninterne Transfers — aufwendig, aber rechtssicher und ohne Einzelfall-TIA.

## Datenminimierung in ISO 20022 pain.001

ISO 20022-Nachrichten sind strukturreich — nicht alle Felder müssen befüllt werden:

• Pflichtfelder (SEPA CT): BIC, IBAN, Betrag, Währung, Verwendungszweck (bis 140 Zeichen)
• Optionale Felder mit Datenschutzrelevanz: `Dbtr/PstlAdr` (Adresse des Auftraggebers), `UltmtDbtr` (eigentlicher Auftraggeber), `RmtInf/Strd` (strukturierte Remittance-Daten mit ggf. Rechnungsdetails)
• DSGVO-Empfehlung: Optionale personenbezogene Felder nur befüllen, wenn der Zahlungsweg (z. B. Nicht-SEPA-Überweisung) oder die Empfängerbank sie erfordert — ansonsten weglassen
