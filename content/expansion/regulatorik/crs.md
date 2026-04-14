---
kuerzel: "CRS"
name: "Common Reporting Standard (OECD 2014) + EU-Umsetzung DAC2 (RL 2014/107/EU); DE: Finanzkonten-Informationsaustauschgesetz (FKAustG) 2015"
typ: "OECD-Standard + EU-Richtlinie + DE-Bundesgesetz"
kategorie: "Internationaler Steuer-Informationsaustausch"
geltungsbereich: "120+ CRS-teilnehmende Staaten weltweit (EU + OECD + weitere); gilt für Reporting Financial Institutions (Banken, Custody-Institute, Specified Insurance, Investment-Entities) und mittelbar alle Kontoinhaber natürliche wie juristische Personen; in DE Umsetzung via FKAustG"
status_version: "OECD CRS vom 15.07.2014; EU DAC2 RL 2014/107/EU vom 09.12.2014; FKAustG vom 21.12.2015 (BGBl 2015 I 2531), zuletzt geändert 2024"
in_kraft_seit: "01.01.2016 (FKAustG), erste Meldung 30.09.2017"
naechste_aenderung: "CRS 2.0 (OECD 2023) — Erweiterung auf Krypto, Investment-Funds, Übergangsfrist 2026-2027; in EU via DAC8 abgebildet"
behoerde_link: "https://www.bzst.de/DE/Unternehmen/Intern_Informationsaustausch/Finanzkonten/finanzkonten_node.html"
betroffene_abteilungen: "Treasury, Steuerabteilung, Legal, Compliance, HR (bei Mitarbeiterbeteiligungen), Beteiligungsmanagement"
beschreibung_experte: |
  Der Common Reporting Standard (CRS) ist der globale OECD-Standard für den automatischen Informationsaustausch (Automatic Exchange of Information, AEoI) über Finanzkonten. In der EU umgesetzt als Directive on Administrative Cooperation 2 (DAC2, RL 2014/107/EU) und in Deutschland durch das Finanzkonten-Informationsaustauschgesetz (FKAustG vom 21.12.2015). CRS verpflichtet Reporting Financial Institutions (RFI — Depotführende Institute, Einlageninstitute, Investment-Entities, Specified Insurance Companies) zur Identifikation aller Konten mit Inhabern, die in einem anderen CRS-Teilnehmerstaat steuerlich ansässig sind, und zur jährlichen Meldung an die zuständige Behörde (in DE: BZSt bis 31.07. des Folgejahres, § 8 FKAustG) — diese leitet dann konsolidiert an die Partnerstaaten weiter (§§ 4–5 FKAustG). Pflichtfelder nach § 8 FKAustG: Name, Anschrift, Ansässigkeitsstaat, TIN (Tax Identification Number), Geburtsdatum (bei NatP), Kontonummer, Jahresend-Saldo, Kapitalerträge (Zinsen, Dividenden), Bruttoveräußerungserlöse (bei Custody Accounts). Kernprozess ist die Self-Certification des Kontoinhabers bei Kontoeröffnung (§ 13 FKAustG) und bei Änderungen. Für juristische Personen gilt die Look-Through-Pflicht bei Passive NFEs (§ 19 FKAustG): bei passiver Nichtfinanz-Einheit sind zusätzlich die beherrschenden Personen (UBO nach GwG, ≥ 25 %) auf Ansässigkeit zu prüfen. Für Industrie-Corporates mit Auslandstöchtern bedeutet dies: jede Tochter gibt bei ihrer Hausbank (im Ausland) eine Self-Certification ab; die Daten werden an den Ansässigkeitsstaat der Tochter gemeldet, nicht an Deutschland. Umgekehrt melden deutsche Hausbanken bei Konten ausländischer Konzerngesellschaften an deren Ansässigkeitsstaat via BZSt.
beschreibung_einsteiger: |
  CRS ist das internationale Gegenstück zu FATCA — nur eben nicht US-zentriert, sondern zwischen über 120 Staaten weltweit. Banken identifizieren ihre Kunden und deren Steueransässigkeit und melden einmal jährlich an die Steuerbehörden, wenn ein Kunde in einem anderen Land ansässig ist. In Deutschland läuft das über das Bundeszentralamt für Steuern (BZSt), das Meldungen sammelt und an die jeweiligen ausländischen Fisken weiterleitet. Für ein Industrieunternehmen mit Auslandstöchtern heißt das praktisch: jede Tochter muss bei jeder ihrer Hausbanken ein Formular zur Steueransässigkeit (Self-Certification) unterschreiben — ähnlich wie beim FATCA-Formular. Besonders kritisch wird es bei Holdings ohne operatives Geschäft: hier müssen auch die Eigentümer (ab 25 % Beteiligung) offengelegt werden. Bei Änderungen der Gesellschafterstruktur oder Umzug in ein anderes Steuerland muss das Formular sofort aktualisiert werden.
auswirkungen_experte: |
  1) Self-Certification pro Konto und pro juristische Person: bei jeder Kontoeröffnung und bei Änderungen (§ 13 FKAustG); Standardformular OECD Entity Self-Certification plus Passive-NFE-UBO-Anhang.
  2) Klassifizierung Entity (analog FATCA, aber nicht identisch): Active NFE / Passive NFE / FI (nach § 19 FKAustG); Passive NFE bei Holdings und Beteiligungsgesellschaften häufig.
  3) Look-Through-Pflicht bei Passive NFE: Offenlegung Controlling Persons (≥ 25 %, analog GwG-UBO) mit TIN und Ansässigkeit — bei komplexen Beteiligungsstrukturen aufwändig.
  4) Reporting-Pflicht bei eigenen RFIs (Konzern-Finanzierungsgesellschaften klassifiziert als Investment Entity): jährliche Meldung an BZSt im CRS-XML-Schema v2.0 bis 31.07.
  5) Änderungstrigger: Umzug einer Gesellschaft in anderen Rechtsraum, Gesellschafterwechsel, Umwandlung Active → Passive NFE (z. B. durch Spin-off des operativen Geschäfts) lösen sofortige Neu-Self-Certification aus.
auswirkungen_einsteiger: |
  Bei jeder neuen Bankbeziehung — egal ob Tochter in Frankreich, Spanien oder Singapur — wird ein Formular zur Steueransässigkeit ausgefüllt. Das Formular landet bei der Bank, die wiederum die Daten an ihre Steuerbehörde meldet, die diese an Deutschland (oder das andere Land) weiterleitet. Wichtig: auch bei einer Holding muss man oft die dahinterliegenden Eigentümer nennen (ab 25 % Beteiligung). Bei jeder Veränderung im Unternehmen (neuer Hauptgesellschafter, Verlagerung des Sitzes, neue Geschäftsführung mit anderem Wohnsitz) muss das Formular erneuert werden.
pflichtmassnahmen_experte: |
  • CRS-Klassifizierung aller Konzerngesellschaften: Active NFE (Regelfall operative Einheiten) / Passive NFE (reine Holdings, Family Offices) / FI (Finanzierungs-SPVs, Captives)
  • Controlling-Persons-Register bei Passive NFEs synchron mit GwG-UBO-Register (Transparenzregister)
  • Self-Certification-Workflow mit Renewal-Trigger bei "Change in Circumstances" (§ 14 FKAustG analog)
  • Bei eigenen RFIs (Konzern-Investment-Entities): Aufbau CRS-Reporting-Infrastruktur mit XML-Schema v2.0-Generator und BZSt-Kommunikationshandbuch; alternativ Outsourcing an spezialisierten Provider
  • Datenqualität TIN: Pflege aller Tax Identification Numbers pro Entity und pro Staat (Unterschied zu EIN/USt-ID)
  • Jährliche Plausibilitätsprüfung CRS-Daten im Rahmen der Außenprüfung
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Liste aller Konzerngesellschaften mit ihrer Steueransässigkeit, TIN pro Land und CRS-Einstufung (aktiv/passiv/Finanzinstitut) zentral pflegen. 2) Bei passiven Holdings zusätzlich die Controlling Persons (≥ 25 % Beteiligung) erfassen. 3) Pro Hausbank im Ausland ein Self-Certification-Formular hinterlegen und bei Änderungen sofort aktualisieren. 4) Falls eine Konzerngesellschaft selbst als Finanzinstitut eingestuft ist (z. B. Konzern-Finanzierungsgesellschaft), muss sie selbst jährlich ans BZSt melden — dafür einen Prozess und ggf. ein Tool aufsetzen.
best_practice_experte: |
  • Gemeinsame Infrastruktur FATCA + CRS: ein zentrales Register, eine gemeinsame Self-Certification (OECD/IRS-kompatibles Kombi-Formular verbreitet bei Großbanken), ein Renewal-Workflow.
  • UBO-Abgleich Transparenzregister (GwG § 19) ↔ CRS-Controlling-Persons (§ 19 FKAustG): identische Datenbasis, unterschiedliche Schwellenwerte (GwG 25 %, CRS 25 %).
  • Bei Passive-NFE-Holdings: aktive Prüfung, ob durch Restrukturierung (Einbringung aktiver Untertöchter) Aktivstatus erreichbar — reduziert Compliance-Aufwand drastisch.
  • RFI-Sponsored-Entity-Modell: Reporting-Outsourcing einer kleinen Tochter-FI an Treasury-Hub oder externen Sponsor.
  • Digitalisierung: Tax Management Systems (ONESOURCE, Orbitax, TaxStream) mit integriertem CRS-/FATCA-Modul — für Konzerne mit > 20 Auslandstöchtern wirtschaftlich.
best_practice_einsteiger: |
  Am effizientesten ist es, FATCA und CRS gemeinsam zu managen — die Formulare sind zu 80 % deckungsgleich, und beide müssen alle paar Jahre erneuert werden. Wenn eine Holding als "passiv" gilt, lohnt es sich zu prüfen, ob man durch eine Umstrukturierung (aktive Beteiligungen direkt einbringen) in die "aktive" Kategorie wechseln kann — das erspart die aufwändige Offenlegung der Eigentümer. Ab etwa 20 Auslandstöchtern rechnet sich ein spezialisiertes Tool.
risiken_experte: |
  • Bußgeldrisiko § 28 FKAustG: bis 50.000 EUR pro Verstoß (juristische Person — Self-Certification-Verweigerung, unrichtige Angaben, Reporting-Versäumnis bei eigenen RFIs).
  • Reputations- und Bankbeziehungsrisiko: Banken de-riskieren Kunden ohne saubere CRS-Self-Certification (insbes. bei Passive-NFE ohne UBO-Angabe).
  • Bei eigenen RFIs: Verspätungs-Bußgeld BZSt und Risiko der Einstufung als "Non-Compliant"; Kaskadeneffekte in Schwesterjurisdiktionen (CRS-Peer-Review).
  • Steuerliche Risiken: diskrepante Daten zwischen CRS-Meldung und Steuererklärung triggern Außenprüfungsfokus; CRS-Daten gehen in Risk Engines der Finanzverwaltungen ein (Auswertung durch ATAD-3, DAC6).
  • Datenschutzrisiko: bei fehlerhafter Meldung (falscher Ansässigkeitsstaat) werden personenbezogene UBO-Daten an falsches Land übermittelt — DSGVO-Verstoß.
risiken_einsteiger: |
  Das Hauptrisiko ist ein Bußgeld von bis zu 50.000 EUR pro Verstoß, wenn Formulare fehlen oder falsch ausgefüllt sind. Noch teurer wird es in der Praxis durch das Banken-De-Risking: Kunden ohne saubere CRS-Unterlagen bekommen zunehmend Konten gekündigt. Außerdem sehen die Finanzbehörden durch CRS deutlich mehr als früher — Unstimmigkeiten zwischen CRS-Meldungen und Steuererklärungen führen fast sicher zu einer Betriebsprüfung.
verwandte_regulierungen: "FATCA, DAC7-DAC8, DSGVO-ZV, AMLR"
sap_bezug: "BP-Rolle TR0100 mit CRS-Klassifizierung (Z_CRS_CLASS — Active NFE / Passive NFE / FI); zentrale Steueransässigkeitsverwaltung im BP-Stamm inkl. TIN pro Staat; SAP TRM-SE Securities Management für Reporting-Basisdaten; Custom-Erweiterung für CRS-XML-Generator (bei eigenen RFIs) oder Anbindung externer Tax Management Systeme via BAPI/OData"
bussgeld: "§ 28 FKAustG bis 50.000 EUR pro Verstoß bei juristischen Personen (Self-Certification-Verweigerung, unrichtige/unvollständige Angaben, Reporting-Versäumnis bei eigenen RFIs); zusätzlich Reputations- und Bankbeziehungs-Risiko"
pruefpflicht: "Banken-seitig: jährliche interne Self-Certification-Erneuerung bei Change in Circumstances (§ 14 FKAustG analog); Corporate-seitig: Update bei Änderung Steueransässigkeit, Gesellschafterwechsel, UBO-Änderung; FKAustG-Plausibilitätsprüfung im Rahmen der steuerlichen Außenprüfung; bei eigenen RFIs jährliche Meldung an BZSt bis 31.07. Folgejahr"
aufwand_tshirt: "S"
---

# CRS — Vertiefung: Self-Certification und Passive-NFE-Look-Through

## Klassifizierungsmatrix (§ 19 FKAustG)

| Entity-Typ | CRS-Klassifizierung | Controlling-Persons-Offenlegung | Besonderheit |
|---|---|---|---|
| DE-AG/GmbH operativ (> 50 % aktive Einkünfte) | Active NFE | Nein | Regelfall Industrie |
| Reine Zwischenholding (passive Einkünfte > 50 %) | Passive NFE | Ja (≥ 25 %) | UBO-Offenlegung analog GwG |
| Konzern-Finanzierungs-SPV | FI (Investment Entity) | Nein (eigenes Reporting) | GIIN analog FATCA |
| Börsennotierte Konzernmutter | Active NFE (Reg. Public Trading) | Nein | OECD Commentary § 159 |
| Family Office / Trust | Investment Entity oder Passive NFE | Ja | häufig kritisch |
| Pensionsfonds | Non-Reporting FI | Nein | Ausnahmekatalog Anhang II FKAustG |

## Self-Certification-Prozess

1) **Entity Self-Certification (OECD-Muster)**: Name, Registrierungsstaat, TIN(s) pro Ansässigkeitsstaat, CRS-Klassifizierung.
2) **Controlling-Persons-Anhang (bei Passive NFE)**: Name, Anschrift, Ansässigkeit, TIN, Geburtsdatum, Rolle (Beteiligung/Kontrolle/Senior Managing Official — bei mangelnder Kontrolle über 25 % fallback § 19 Abs. 3 FKAustG).
3) **Renewal-Trigger**: Umzug, Umwandlung (Active↔Passive), Gesellschafterwechsel > 25 %, neue TIN.

## SAP-Treasury-Umsetzung

1) **BP-Stammdaten**: Z-Felder für CRS-Klassifizierung, TIN pro Staat, Self-Cert-Gültigkeitsdatum, Controlling-Persons-Relation (BP-BP).
2) **UBO-Sync**: Abgleich mit Transparenzregister-UBOs (GwG); Pflege in zentraler Stammdaten-Governance.
3) **Bei eigenen RFIs**: CRS-XML-v2.0-Generator (custom oder ONESOURCE); BZSt-Kommunikationshandbuch-konformer Versand (BOP / BZSt-Online-Portal).
4) **Reporting-Daten**: Jahresend-Saldo aus SAP TRM-SE, Kapitalerträge aus FI (Sachkonto Kapitalerträge), Veräußerungserlöse aus TRM-SE.
