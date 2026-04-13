---
kuerzel: DORA
name: Digital Operational Resilience Act
typ: EU-Verordnung
kategorie: IKT-Resilienz / Governance
in_kraft_seit: "17.01.2025"
naechste_aenderung: "RTS-Ergänzungen Q2 2026 (JC 2023 86, JC 2024 29)"
behoerde_link: https://www.eba.europa.eu/regulation-and-policy/operational-resilience
betroffene_abteilungen: Treasury, IT, Compliance, Einkauf, Risikomanagement
geltungsbereich: EU-weit, gilt für Finanzunternehmen (Kreditinstitute, Zahlungsinstitute, E-Geld-Institute, Versicherungen, Investmentfirmen, Handelsplätze, CCPs) und deren IKT-Drittparteien
status_version: Verordnung (EU) 2022/2554, in Kraft seit 17.01.2025; ergänzende RTS/ITS durch ESAs (EBA, ESMA, EIOPA)
beschreibung_experte: |
  DORA (Digital Operational Resilience Act, VO (EU) 2022/2554) ist das sektorübergreifende EU-Rahmenwerk für die digitale operationale Resilienz von Finanzunternehmen. Es harmonisiert IKT-Risikoanforderungen, die bisher fragmentiert in CRD IV, SREP-Leitlinien, PSD2-Sicherheitsanforderungen und nationalen BaFin-Rundschreiben verteilt waren. Die fünf Kernpfeiler sind: 1) IKT-Risikomanagement (Art. 5–16) — vollständiger Framework-Zyklus von Governance bis Wiederherstellung; 2) IKT-bezogene Incident-Meldung (Art. 17–23) — dreistufige Klassifikation und Meldepflicht innerhalb definierter Fristen; 3) Digitale Resilienztests (Art. 24–27) — jährliche Tests inkl. Threat-Led Penetration Testing (TLPT) für bedeutende Institute; 4) IKT-Drittparteienrisiko (Art. 28–44) — Kritikalitätsbewertung, vertragliche Mindestanforderungen, Überwachungsrahmen für kritische IKT-Drittparteien (CTPP); 5) Informationsaustausch (Art. 45). Für Treasury-Systeme relevant sind insbesondere Art. 28 (Drittparteien-Due-Diligence), Art. 30 (Vertragsanforderungen) sowie die RTS zu TLPT (JC 2023 86).
beschreibung_einsteiger: |
  DORA ist ein EU-Gesetz, das ab Januar 2025 für alle Banken, Zahlungsdienstleister und andere Finanzfirmen gilt. Es sorgt dafür, dass diese Unternehmen gegen IT-Ausfälle und Cyberangriffe gewappnet sind. Das Gesetz legt fest: Wie IT-Risiken erkannt und kontrolliert werden müssen, wie IT-Störungen gemeldet werden müssen (z. B. bei Zahlungsausfällen), wie regelmäßige IT-Sicherheitstests durchzuführen sind, und welche Anforderungen an externe IT-Dienstleister (z. B. Cloud-Anbieter, Softwarehersteller) gestellt werden müssen.
auswirkungen_experte: |
  1) Gap-Analyse IKT-Risikomanagement-Framework versus Art. 5–16 DORA: Vorhandene ISMS (ISO 27001, NIST CSF) müssen auf DORA-Konformität geprüft werden — besonderer Fokus auf Art. 9 (Schutzmaßnahmen), Art. 11 (Business-Continuity-Richtlinien) und Art. 12 (Backup- und Wiederherstellungsverfahren).
  2) Klassifizierung aller IKT-Drittparteien nach Art. 28 Abs. 2: Kritikalitätsbewertung anhand Substitutierbarkeit, Systemrelevanz und Konzentrationsrisiko — betrifft Cloud-Infrastruktur (SAP BTP, AWS, Azure), SWIFT-Konnektivität, Payment-Gateways und Marktdaten-Feeds.
  3) Überarbeitung aller IKT-Dienstleistungsverträge gemäß Art. 30 DORA: Mindestklauseln zu Verfügbarkeitszielen, Audit-Rechten, Exit-Strategien und Sub-Auftragsvergabe sind zwingend.
  4) Implementierung eines dreistufigen Incident-Meldeprozesses (Art. 17–19): Erstmeldung (Initial Notification) innerhalb 4 Stunden nach Klassifikation, Zwischenmeldung (Intermediate Report) nach 72 Stunden, Abschlussbericht (Final Report) nach einem Monat — an BaFin (Deutschland), OeNB (Österreich) bzw. zuständige NCA.
  5) TLPT-Scope-Festlegung (Art. 26): Threat-Led Penetration Tests für bedeutende Institute alle 3 Jahre unter Koordination der zuständigen Behörde; für Zahlungsinfrastruktur besonders relevant.
auswirkungen_einsteiger: |
  Dein Unternehmen muss prüfen, ob alle IT-Systeme — besonders SAP, Treasury-Tools und Bankverbindungen — so geschützt sind, dass sie Angriffe und Ausfälle überstehen. Wenn es einen größeren IT-Vorfall gibt (z. B. Zahlungssystem ausgefallen), muss dieser innerhalb von 4 Stunden der zuständigen Behörde gemeldet werden. Alle IT-Dienstleister (z. B. Cloud-Anbieter, Softwarefirmen) müssen auf ihre Risiken bewertet werden, und die Verträge mit ihnen müssen bestimmte Sicherheitsgarantien enthalten.
pflichtmassnahmen_experte: |
  • Implementierung eines vollständigen IKT-Risikomanagement-Frameworks gem. Art. 5–16 DORA (Governance, Schutzmaßnahmen, BCP, BCT, Recovery, Kommunikation)
  • Incident-Klassifizierungs- und Meldeprozess: Initial Notification ≤ 4h, Intermediate Report ≤ 72h, Final Report ≤ 1 Monat (Art. 19–20) — Meldung an zuständige NCA (DE: BaFin)
  • Vollständiges Register aller IKT-Drittparteien (Art. 28 Abs. 3) mit Kritikalitätsbewertung
  • Überarbeitung aller IKT-Dienstleistungsverträge gemäß Art. 30: Klauseln zu SLAs, Audit-Rechten, Datenzugang, Exit-Management, Sub-Auftragsvergabe, Sicherheitsstandards
  • Jährliche digitale Resilienztests (Art. 24–25): Basis-Tests (Vulnerability Assessments, BCP-Tests, Penetrationstests) für alle Institute; TLPT alle 3 Jahre für bedeutende Institute (Art. 26)
  • Einrichtung eines IKT-Risikofunktionsträgers auf Geschäftsleitungsebene (Art. 5 Abs. 2)
  • Informationsaustausch-Mechanismus mit anderen Finanzinstituten aktivieren (Art. 45)
  • Überwachung der CTPP-Designierung durch ESAs: falls Kerndienstleister als CTPP designiert wird, gelten erweiterte Oversight-Pflichten
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Liste aller IT-Dienstleister erstellen und bewerten, welche kritisch sind. 2) Verträge mit IT-Anbietern prüfen — enthalten sie Regelungen zu Ausfallzeiten, Prüfrechten und Ausstiegsszenarien? 3) Einen Prozess einrichten, wie IT-Störungen intern erkannt und dann innerhalb von 4 Stunden an die Aufsichtsbehörde gemeldet werden. 4) Regelmäßige Sicherheitstests der eigenen Systeme planen und durchführen. 5) Eine interne Verantwortungsperson für IT-Risiken bestimmen.
best_practice_experte: |
  • Mapping DORA-Anforderungen 1:1 auf bestehende ISO-27001-Kontrollen: Gap-Matrix beschleunigt Zertifizierung und vermeidet doppelten Aufwand — viele Art. 9-Anforderungen sind deckungsgleich mit ISO 27001:2022 Annex A.
  • TLPT nach TIBER-EU-Framework durchführen: EZB-gefördertes Threat Intelligence-basiertes Red-Team-Testing wird von BaFin/Bundesbank als DORA-TLPT anerkannt; frühzeitige Koordination mit NCA spart Zeit.
  • IKT-Drittparteien-Register in GRC-Tool (ServiceNow, Archer) integrieren: Kritikalitätsbewertung automatisiert nach Substitutierbarkeit (Score 1–5), Konzentrationsrisiko und Ausfallkostenmodell.
  • Für SAP-Landschaften: SAP BTP als IKT-Drittpartei klassifizieren (Art. 28); SAP Cloud-Verträge auf DORA-Art.-30-Konformität prüfen — SAP stellt standardisierte DORA-Annex-Vorlagen bereit (SAP Trust Center).
  • Incident-Meldung mit SIEM-Automatisierung verknüpfen: Automatische Eskalation bei definierten Schwellenwerten (z. B. Zahlungsausfall > 30 Minuten) reduziert menschliches Versagen beim 4h-Frist-Tracking.
best_practice_einsteiger: |
  Fang mit der Bestandsaufnahme an: Welche IT-Systeme sind für den Zahlungsverkehr unbedingt notwendig? Diese sind die kritischsten und müssen zuerst gesichert werden. Nutze bestehende Sicherheitszertifikate (wie ISO 27001), da viele Anforderungen ähnlich sind. Definiere klare interne Zuständigkeiten — wer meldet einen IT-Vorfall, wer informiert die Behörde?
risiken_experte: |
  • Sanktionsrisiko bei Nicht-Konformität: Aufsichtsbehörden (BaFin, OeNB) können Geldbußen verhängen; DORA sieht keine eigene Bußgeldskala vor, aber nationale Implementierungen (§ 54a KWG analog) und allgemeine Verwaltungssanktionen gelten.
  • Konzentrations- und Vendor-Lock-in-Risiko: Wenn kritische IKT-Drittpartei als CTPP designiert wird und unter ESA-Oversight kommt, können Anforderungen an die vertragliche Beziehung steigen — Exit-Strategie muss vorab stehen.
  • Operationelles Risiko unzureichend getesteter Treasury-Systeme: Wenn TM-System (SAP TRM, Kyriba, FIS Quantum) keine nachweisbaren BCP-Tests hat, ist Art. 11 DORA verletzt — Ausfallszenarien bei Bankkonnektivität (SWIFT, EBICS) müssen dokumentiert sein.
  • Reputationsrisiko durch öffentliche Incident-Berichte: Aufsichtsbehörden können aggregierte Berichte zu Incidents veröffentlichen; Zahlungsausfälle werden sichtbar.
  • Vertragsrisiko: Nicht-DORA-konforme IKT-Verträge (fehlende Art.-30-Klauseln) können als Verstoß gewertet werden, auch wenn kein Schaden eingetreten ist.
risiken_einsteiger: |
  Wenn DORA nicht umgesetzt wird, kann die Aufsichtsbehörde Strafen verhängen. Noch wichtiger: Wenn die IT-Systeme ausfallen und kein Notfallplan vorhanden ist, können Zahlungen nicht mehr ausgeführt werden — das schadet dem Unternehmen und seinen Kunden. Auch schlechte Verträge mit IT-Anbietern können ein Risiko sein, wenn diese Anbieter ausfallen und man kein Rückkehrrecht oder Exit-Recht hat.
---

# DORA — Vertiefung: IKT-Risikomanagement im Treasury-Kontext

## Regulatorischer Rahmen

DORA ergänzt und überlagert bestehende sektorale Anforderungen. Folgende Normen werden durch DORA konkretisiert oder ersetzt:

| Vorgänger-Anforderung | Status unter DORA |
|---|---|
| EBA-Leitlinien zu IKT und Sicherheitsrisiken (EBA/GL/2019/04) | Durch DORA-RTS ersetzt ab 17.01.2025 |
| PSD2-Sicherheitsleitlinien (EBA/GL/2017/17) | Für Zahlungsdienstleister: DORA-Anforderungen ergänzen PSD2 |
| BAIT (BaFin-Bankaufsichtliche Anforderungen an die IT) | Weiterentwicklung zu ZAIT/VAIT unter DORA-Konformitätsrahmen |
| ISO 27001 | Anerkanntes Framework, deckt viele Art. 9-Anforderungen ab |

## SAP-Treasury-Relevanz

Für SAP-basierte Treasury-Umgebungen ergeben sich aus DORA konkrete Handlungsfelder:

1) **SAP TRM / SAP S/4HANA Treasury** als kritisches Anwendungssystem: Klassifikation der Business-Kritikalität (Recovery Time Objective, Recovery Point Objective) nach Art. 11 DORA. SAP-Systeme, die für tägliche Zahlungsläufe genutzt werden, sind als "kritische Funktionen" einzustufen.

2) **SAP BTP und Cloud-Extensions**: SAP Business Technology Platform ist als IKT-Drittpartei nach Art. 28 zu bewerten. SAP stellt im Trust Center eine DORA-Konformitätserklärung sowie angepasste Vertragsanlagen (Cloud Service Agreement Annex) bereit.

3) **SWIFT-Konnektivität**: SWIFT-Dienstleister (Alliance Gateway, Service Bureau) und SAP Multi-Bank Connectivity gelten als IKT-Drittparteien. Exit-Strategien und Alternativrouten (z. B. bilateral-EBICS als Fallback) müssen dokumentiert sein.

4) **EBICS-Kanalinfrastruktur**: EBICS-Bankverbindungen sind auf Ausfallszenarien zu testen; die Bankpartner als EBICS-Hosts sind ebenfalls als IKT-Drittparteien zu bewerten.

## Zeitplan und RTS-Stand (April 2026)

• **17.01.2025**: DORA vollständig anwendbar
• **Q1 2025**: Finale RTS zu IKT-Risikomanagement (JC 2023 86) — Detailanforderungen zu Schutzmaßnahmen, BCM, Testprogramm
• **Q2 2025**: Finale RTS zu TLPT (JC 2024 29) — TIBER-EU-basiertes Testframework für bedeutende Institute
• **Q3 2025**: ITS zu Incident-Reporting-Templates finalisiert — standardisierte Meldebögen für NCAs
• **2026 laufend**: Erste CTPP-Designierungen durch ESAs erwartet — Beobachtung relevant für Cloud-Dienstleister
