---
kuerzel: "NIS2"
name: "Richtlinie (EU) 2022/2555 über Maßnahmen für ein hohes gemeinsames Cybersicherheitsniveau in der Union (NIS2)"
typ: "EU-Richtlinie (DE-Umsetzung NIS2UmsuCG, in Bundestags-Verfahren — Verzögerung über Frist 17.10.2024 hinaus)"
kategorie: "EU / Cybersicherheit / kritische Infrastruktur"
geltungsbereich: "alle EU-Mitgliedsstaaten; betrifft 'wesentliche' (Anhang I, 11 Sektoren) und 'wichtige' (Anhang II, 7 Sektoren) Einrichtungen ab Größenschwelle > 50 Mitarbeiter UND > 10 Mio. EUR Jahresumsatz oder Bilanzsumme > 10 Mio. EUR; unabhängig von Größe bei Vertrauensdiensten, DNS, TLDs, qualifizierten TSPs, Telekom-Providern"
status_version: "Richtlinie (EU) 2022/2555 vom 14.12.2022; DE-Entwurf NIS2UmsuCG (aktueller RegE)"
in_kraft_seit: "EU-RL 17.01.2023; nationale Umsetzungsfrist 17.10.2024 (DE verspätet, voraussichtlich Q1 2026)"
naechste_aenderung: "DE NIS2UmsuCG voraussichtlich Q1 2026; Implementing Regulation (EU) 2024/2690 vom 17.10.2024 (technisch-methodische Anforderungen Art. 21 für kritische digitale Infrastruktur-Anbieter)"
behoerde_link: "https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2/nis-2_node.html"
betroffene_abteilungen: "IT-Security, CISO-Office, Geschäftsleitung, Legal, Compliance, Risk-Management, Interne Revision, Treasury (bei Finanz-Tochtergesellschaften)"
beschreibung_experte: |
  Die Richtlinie (EU) 2022/2555 (NIS2) ersetzt die NIS1-Richtlinie (EU) 2016/1148 und erweitert den Anwendungsbereich massiv — von ca. 2.000 auf voraussichtlich ca. 30.000 betroffene Einrichtungen in Deutschland. Zwei Kategorien: "wesentliche Einrichtungen" (essential entities, Anhang I — 11 Sektoren: Energie, Transport, Bank, Finanzmarktinfrastrukturen, Gesundheitswesen, Trinkwasser, Abwasser, digitale Infrastruktur inkl. Cloud Provider / Rechenzentrums-Dienste / CDN / DNS / TLD / TK-Anbieter, ICT-Service-Management B2B, öffentliche Verwaltung, Raumfahrt) und "wichtige Einrichtungen" (important entities, Anhang II — 7 Sektoren: Post- und Kurierdienste, Abfallbewirtschaftung, Herstellung/Verarbeitung/Vertrieb Chemikalien, Herstellung/Verarbeitung/Vertrieb Lebensmittel, Herstellung — u. a. Medizinprodukte, Datenverarbeitungsgeräte, Maschinen/Fahrzeuge/sonst. Ausrüstungen, digitale Anbieter wie Online-Marktplätze/Suchmaschinen/Social Networks, Forschung). Größenkriterium (Art. 2 Abs. 1): mindestens mittlere Unternehmen nach KMU-Definition 2003/361/EG, d. h. > 50 MA und > 10 Mio. EUR Umsatz oder Bilanzsumme. Zentrale Pflichten: (1) Art. 21 Cybersecurity Risk Management mit 10 Mindestmaßnahmen-Bereichen — Risikoanalyse + ISMS-Policy, Incident Handling, Business Continuity / Krisenmanagement, Supply Chain Security, Security in Network and Information Systems Acquisition, Policies zur Wirksamkeitsbewertung, Cybersicherheits-Schulungen, Kryptographie-Policies, HR-Security / Access Control / Asset Management, MFA / Secure Voice-Video-Text Communication / Secure Emergency Communication; (2) Art. 23 Meldepflicht bei signifikanten Vorfällen — Early Warning binnen 24 Stunden, Incident Notification binnen 72 Stunden, Final Report binnen 1 Monat, bei anhaltendem Vorfall zusätzlich Progress Report; (3) Art. 20 Governance / Geschäftsleitungs-Verantwortung — persönliche Haftung der Geschäftsleitung für Pflichtverletzungen, Schulungspflicht der Geschäftsleitung (Art. 20 Abs. 2); (4) Registrierung beim BSI über Meldeportal. Aufsichtsregime differenziert (Art. 32/33): wesentliche Einrichtungen unter ex-ante-Aufsicht (anlasslose Inspektionen, Audits, Stichproben), wichtige Einrichtungen unter ex-post-Aufsicht (anlassbezogen).
beschreibung_einsteiger: |
  NIS2 ist eine EU-weite Cybersicherheits-Richtlinie, die im Vergleich zur Vorgängerregelung (NIS1) deutlich mehr Unternehmen erfasst. Betroffen sind Unternehmen ab 50 Mitarbeitern und 10 Mio. EUR Umsatz aus 18 Branchen — von Energie und Transport über Industrie und Lebensmittel bis zu digitalen Diensten. Die Regelung verlangt ein funktionierendes Informationssicherheits-Management, regelmäßige Schulungen, eine klare Risikoanalyse, Notfallpläne und sichere Lieferketten. Sicherheitsvorfälle müssen innerhalb von 24 Stunden an das BSI gemeldet werden. Besonders wichtig: Die Geschäftsführung trägt persönliche Verantwortung und kann bei grober Fahrlässigkeit direkt haftbar gemacht werden. In Deutschland tritt das Umsetzungsgesetz (NIS2UmsuCG) verspätet voraussichtlich 2026 in Kraft — die EU-Pflichten gelten aber unabhängig von der nationalen Umsetzung bereits materiell.
auswirkungen_experte: |
  1) Betroffenheitsanalyse: Sektor-Zuordnung Anhang I/II × Größenkriterium; bei Konzernen einzelgesellschaftlich prüfen (Rechtsträger-Prinzip); in DE Selbstbetroffenheits-Feststellung via BSI-Prüftool.
  2) ISMS-Aufbau nach ISO/IEC 27001:2022 oder BSI IT-Grundschutz als De-facto-Standard für Art. 21 Konformität.
  3) Supply Chain Security (Art. 21 Abs. 2 lit. d): Lieferanten-Risikobewertung, Vertragsklauseln (right-to-audit, Vorfallsmeldung), ICT-Supply-Chain-Assessment gemäß EU-NIS Cooperation Group Guidelines.
  4) Incident Response Prozess: 24h Early Warning an CSIRT/BSI, strukturiertes Meldewesen via BSI-Meldeportal; Integration mit SIEM und SOC-Prozess.
  5) MFA-Rollout flächendeckend (Art. 21 Abs. 2 lit. j) — alignment mit DORA Art. 9 und PCI DSS Req. 8.4.
  6) Geschäftsleitungs-Schulung (Art. 20 Abs. 2): dokumentierte jährliche Cybersecurity-Trainings für Vorstand/Geschäftsführer.
  7) Interne Überlappung: NIS2 + DORA (Finanzsektor — DORA als lex specialis, Art. 1 Abs. 2 NIS2) + KRITIS-DachG + TKG §§ 165-167 + EnWG § 11.
auswirkungen_einsteiger: |
  Unternehmen müssen zuerst klären, ob sie überhaupt betroffen sind — dafür gibt es auf der BSI-Webseite ein Prüftool. Wer betroffen ist, braucht ein professionelles Informationssicherheits-Management (am besten nach ISO 27001 oder BSI IT-Grundschutz). Die Geschäftsführung muss jährlich geschult werden und kann bei Pflichtverletzungen persönlich zur Kasse gebeten werden. Für alle IT-Systeme — besonders für Admin-Zugänge — wird Zwei-Faktor-Authentifizierung Pflicht. Auch die Lieferanten müssen auf Cybersicherheit überprüft werden. Bei einem Sicherheitsvorfall hat man nur 24 Stunden Zeit, das BSI zu informieren.
pflichtmassnahmen_experte: |
  • Registrierung beim BSI über NIS2-Meldeportal (sobald DE NIS2UmsuCG in Kraft)
  • ISMS-Zertifizierung ISO/IEC 27001 oder BSI IT-Grundschutz-Testat (empfohlen, nicht strikt Pflicht)
  • Risikomanagement-Methodik nach ISO 27005 / NIST SP 800-30
  • Business Continuity Management (BCM) nach ISO 22301
  • Incident Response Plan mit 24h/72h/1-Monats-Reporting-Kette
  • Supply Chain Security Assessments jährlich; Critical-ICT-TPP-Register
  • MFA für alle privilegierten und externen Zugänge
  • Cybersecurity Awareness Training alle Mitarbeiter, vertieftes Training Geschäftsleitung (Art. 20 Abs. 2)
  • Penetration Tests mindestens jährlich; Red Team Exercises für wesentliche Einrichtungen empfohlen
  • Kryptographie-Policy, Schlüsselmanagement, Quantum-Safe-Migration-Planung
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Mit dem BSI-Tool prüfen, ob das Unternehmen überhaupt betroffen ist. 2) Wenn ja: einen Informationssicherheits-Beauftragten benennen. 3) ISMS aufbauen — idealerweise nach ISO 27001 zertifizieren lassen. 4) Geschäftsführung jährlich schulen und das Ganze dokumentieren. 5) Zwei-Faktor-Authentifizierung überall einführen, wo sensible Daten liegen. 6) Einen Notfallplan für Cybervorfälle erstellen und mindestens einmal jährlich üben. 7) Wichtige Lieferanten (Cloud, IT-Dienstleister) auf Cybersicherheit prüfen lassen. 8) Einen klaren Meldeweg zum BSI aufbauen — bei einem echten Vorfall hat man nur 24 Stunden.
best_practice_experte: |
  • Integrated Management System (IMS): ISO 27001 + ISO 22301 + ISO 9001 + ISO 14001 zusammenführen
  • SIEM/SOC-Integration: Splunk, IBM QRadar, Microsoft Sentinel, Elastic Security — mit 24/7-SOC (in-house oder MSSP)
  • Threat Intelligence via BSI-CERT, Sektor-CERTs (UP KRITIS), ISACs (z. B. Automotive-ISAC)
  • Zero-Trust-Architektur: Micro-Segmentation, Identity-First-Security — deckt große Teile Art. 21 ab
  • Supply Chain: SBOM (Software Bill of Materials) gemäß CRA (Cyber Resilience Act), VEX, CycloneDX-Formate
  • NIS2-DORA-Mapping: für Corporates mit Bank-/Versicherungs-Tochter ein gemeinsames Control-Framework (DORA Art. 16/17 ↔ NIS2 Art. 21)
best_practice_einsteiger: |
  Wer bereits ein ISO-27001-Zertifikat hat, ist gut aufgestellt — es deckt den Großteil der NIS2-Anforderungen ab. Kleinere Unternehmen können BSI IT-Grundschutz Basis-Absicherung nutzen, was günstiger und einfacher ist. Ein externer IT-Sicherheitsdienstleister mit 24/7-Überwachung (Managed SOC) ist sinnvoll, weil interne Teams das kaum leisten können. Wichtige Lieferanten sollte man per Fragebogen oder Kurzaudit prüfen — fertige Templates gibt es beim BSI und bei VdS.
risiken_experte: |
  • Bußgelder wesentliche Einrichtungen (Art. 34 NIS2): bis 10 Mio. EUR oder 2 % des weltweiten Jahresumsatzes (der höhere Betrag)
  • Bußgelder wichtige Einrichtungen: bis 7 Mio. EUR oder 1,4 % des weltweiten Jahresumsatzes
  • Persönliche Haftung Geschäftsleitung (§ 38 NIS2UmsuCG-E, Art. 20 NIS2): Bußgeld gegen Geschäftsleitung bei schuldhafter Verletzung; zivilrechtliche Binnenhaftung § 43 GmbHG / § 93 AktG
  • Aufsichtsmaßnahmen (Art. 32): Anordnungen, vorübergehende Aussetzung Zertifizierungen/Genehmigungen, Bestellung Monitor, bei nicht-Compliance temporäres Tätigkeitsverbot der Geschäftsleitung
  • Reputations- und M&A-Risiko: NIS2-Non-Compliance als Red Flag in Due Diligence
  • Kollateralschäden: parallele DSGVO-Bußgelder bei Datenschutzverstößen im gleichen Vorfall
risiken_einsteiger: |
  Die Bußgelder sind hoch: Bis zu 10 Millionen Euro oder 2 Prozent des weltweiten Jahresumsatzes können verhängt werden — bei einem Konzern mit 1 Mrd. Euro Umsatz also bis zu 20 Millionen Euro. Besonders neu ist die persönliche Haftung der Geschäftsführung: Wer grob fahrlässig handelt, kann direkt zur Kasse gebeten werden — und in schweren Fällen vorübergehend vom Amt enthoben werden. Zusätzlich drohen parallele DSGVO-Bußgelder, wenn bei einem Cybervorfall auch personenbezogene Daten betroffen waren.
verwandte_regulierungen: "DORA, DSGVO-ZV, PCI-DSS, eIDAS-2"
sap_bezug: "SAP BC-SEC (Berechtigungsmanagement); SAP Enterprise Threat Detection (ETD) als SIEM-Baustein zur Art. 21 Abs. 2 lit. c Incident-Detection; SAP Cloud ALM für Business-Continuity-Tests und Resilienztests; SAP Identity Authentication Service (IAS) für MFA-Pflicht Art. 21 Abs. 2 lit. j; SAP Access Control (GRC) für Privileged Access / SoD; SAP Audit Management (GRC) für ISMS-Dokumentation; SAP BTP DPP (Cloud Compliance Reports) als Auslagerungs-Nachweis; Integration mit externen SIEM (Splunk, QRadar, Sentinel) via SAP UI Masking und SAP Logger"
bussgeld: "Art. 34 NIS2 — wesentliche Einrichtungen: bis 10 Mio. EUR oder 2 % des weltweiten Jahresumsatzes (höherer Betrag); wichtige Einrichtungen: bis 7 Mio. EUR oder 1,4 % des weltweiten Jahresumsatzes; persönliches Geschäftsleitungs-Bußgeld bei Pflichtverletzung; parallel Zwangsgelder und Aufsichtsmaßnahmen (Art. 32/33), bei schweren Fällen temporäres Tätigkeitsverbot der Geschäftsleitung"
pruefpflicht: "wesentliche Einrichtungen: ex-ante-Aufsicht durch BSI (anlasslose Inspections, Sicherheitsüberprüfungen, Audits, Stichproben, Zugang zu Daten/Dokumenten); wichtige Einrichtungen: ex-post-Aufsicht (anlassbezogen bei Hinweisen auf Verstöße); jährliche Selbstauskunft; ISMS-Audit (ISO 27001-Rezertifizierung 3-Jahres-Zyklus, jährliche Überwachungsaudits); Penetration Tests mindestens jährlich empfohlen"
aufwand_tshirt: "L"
---

# NIS2 — Vertiefung: Betroffenheit, Art. 21 Maßnahmen und Meldekette

## Sektoren-Übersicht Anhang I (wesentliche Einrichtungen)

| # | Sektor | Beispiele |
|---|---|---|
| 1 | Energie | Strom, Gas, Wärme, Öl, Wasserstoff |
| 2 | Transport | Luft, Schiene, Wasser, Straße |
| 3 | Banken | Kreditinstitute (auch CRR-Institute) |
| 4 | Finanzmarktinfrastrukturen | Handelsplätze, CCP |
| 5 | Gesundheitswesen | Krankenhäuser, Hersteller Medizinprodukte |
| 6 | Trinkwasser | Versorger |
| 7 | Abwasser | Kommunale + industrielle Anlagen |
| 8 | Digitale Infrastruktur | DNS, TLD, Cloud, RZ, CDN, TK |
| 9 | ICT-Service-Management B2B | MSP, MSSP |
| 10 | Öffentliche Verwaltung | Zentral + regional |
| 11 | Raumfahrt | Bodeninfrastruktur |

## Sektoren-Übersicht Anhang II (wichtige Einrichtungen)

| # | Sektor | Beispiele |
|---|---|---|
| 1 | Post und Kurierdienste | Logistik |
| 2 | Abfallbewirtschaftung | Sammlung, Behandlung |
| 3 | Chemikalien | Herstellung, Verarbeitung, Vertrieb |
| 4 | Lebensmittel | Herstellung, Verarbeitung, Vertrieb |
| 5 | Herstellung | Medizinprodukte, Datenverarbeitungsgeräte, Maschinen, Fahrzeuge |
| 6 | Digitale Anbieter | Online-Marktplätze, Suchmaschinen, Social Networks |
| 7 | Forschung | Forschungseinrichtungen |

## 10 Mindestmaßnahmen Art. 21 Abs. 2

| Lit. | Maßnahmenbereich |
|---|---|
| a | Risikoanalyse- und Informationssicherheitsrichtlinien |
| b | Bewältigung von Sicherheitsvorfällen (Incident Handling) |
| c | Betriebskontinuität (Backups, Disaster Recovery, Krisenmgmt.) |
| d | Sicherheit der Lieferkette (Supply Chain Security) |
| e | Sicherheit bei Erwerb/Entwicklung/Wartung (Secure SDLC, Schwachstellen-Offenlegung) |
| f | Konzepte zur Wirksamkeitsbewertung der Cybersicherheitsmaßnahmen |
| g | Cyberhygiene und Schulungen |
| h | Kryptographie und Verschlüsselung |
| i | Personalsicherheit, Zugriffskontrolle, Asset Management |
| j | MFA, Secure Voice/Video/Text Communication, Secure Emergency Communication |

## Meldekette Art. 23

| Frist | Pflicht | Inhalt |
|---|---|---|
| 24 h | Early Warning | Vorfall-Indikatoren, Verdacht auf unbefugte Handlung |
| 72 h | Incident Notification | Erste Bewertung, Schweregrad, Auswirkungen, IOCs |
| auf Anforderung | Intermediate Report | Status-Update |
| 1 Monat | Final Report | Root Cause, getroffene Maßnahmen, grenzüberschreitende Auswirkungen |

## Bußgeld-Tabelle Art. 34

| Kategorie | Max. Bußgeld | Alternativ |
|---|---|---|
| wesentlich | 10 Mio. EUR | 2 % globaler Jahresumsatz (höherer Wert) |
| wichtig | 7 Mio. EUR | 1,4 % globaler Jahresumsatz (höherer Wert) |
| Geschäftsleitung | nach nationalem Recht (DE: § 38 NIS2UmsuCG-E) | persönliche Haftung |

## SAP-Implementierung Art. 21

1) **ISMS-Dokumentation**: SAP Audit Management (GRC) als zentrales Repository; Policies, Risk Register, Maßnahmenplan.
2) **Art. 21 Abs. 2 lit. b Incident Handling**: SAP ETD (Enterprise Threat Detection) + Integration in externe SIEM (Splunk, Sentinel, QRadar).
3) **Art. 21 Abs. 2 lit. c BCM**: SAP Cloud ALM Resilience Testing; Regelmäßige Failover-Tests S/4HANA.
4) **Art. 21 Abs. 2 lit. d Supply Chain**: SAP Ariba Supplier Risk + TPRM (Third Party Risk Management).
5) **Art. 21 Abs. 2 lit. i Access Control**: SAP Access Control (GRC) SoD-Ruleset, Firefighter, Privileged Access Management.
6) **Art. 21 Abs. 2 lit. j MFA**: SAP IAS + externe IDP (Azure AD, Okta, PingID) für Fiori, Cloud-Apps, on-premise via SNC/SAML.

## NIS2-DORA-Abgrenzung

- Art. 1 Abs. 2 NIS2: Bei Sektor-Überlappung gilt lex-specialis-Prinzip → DORA verdrängt NIS2 für Finanzsektor (Kreditinstitute, Zahlungsdienstleister, Versicherungen).
- Praxis: Corporate-Treasury meist NIS2; Corporate-Captive-Bank oder konzerneigene Payment-Institut meist DORA.
- Mapping-Matrix: DORA Art. 5-15 ↔ NIS2 Art. 21; DORA Art. 17-23 ↔ NIS2 Art. 23; DORA Art. 28-30 ↔ NIS2 Art. 21 Abs. 2 lit. d.
