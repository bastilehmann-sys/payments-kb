---
kuerzel: "FATCA"
name: "Foreign Account Tax Compliance Act (US 2010) + DE-IGA Modell 1 (BGBl 2013 II 1362)"
typ: "US-Bundesgesetz + DE Intergovernmental Agreement"
kategorie: "USA / Steuer / Reporting"
geltungsbereich: "weltweit: gilt für alle Foreign Financial Institutions (FFI) mit US-source-Income oder US-Kundenbeziehungen; in Deutschland mittelbar für Industrie-Corporates als Kontoinhaber bei FFI (Hausbanken) sowie unmittelbar bei eigenen Tochter-FIs (Treasury-Vehikel, In-House-Banks mit FI-Klassifizierung, Captive Insurance, Verbriefungs-SPVs)"
status_version: "FATCA: Hiring Incentives to Restore Employment Act (HIRE Act) vom 18.03.2010, IRC Sec. 1471-1474; DE-IGA Modell 1 vom 31.05.2013 (BGBl 2013 II 1362), FKAustG als nationale Umsetzung"
in_kraft_seit: "31.05.2013 (DE-IGA), 01.07.2014 Withholding"
naechste_aenderung: "Fortlaufende IRS-Notices und BZSt-Kommunikationshandbuch-Updates; Angleichung an CRS 2.0 in Diskussion"
behoerde_link: "https://www.bzst.de/DE/Unternehmen/Intern_Informationsaustausch/FATCA/fatca_node.html"
betroffene_abteilungen: "Treasury, Steuerabteilung, Legal, Compliance, Accounting (Konzernrechnungswesen), M&A (bei US-Targets)"
beschreibung_experte: |
  FATCA (IRC §§ 1471–1474) verpflichtet Foreign Financial Institutions (FFIs) zur Identifikation und Meldung von US-Kontoinhabern an den IRS — andernfalls droht eine 30 %-Quellensteuer (Withholding) auf alle US-source-Withholdable-Payments (Dividenden, Zinsen, Lizenzgebühren, bei Gross Proceeds seit Phase-in auch Veräußerungserlöse aus US-Wertpapieren). Kern ist die Klassifizierung jeder juristischen Person nach W-8BEN-E (Form vom IRS, zuletzt Rev. 10/2021) in die Kategorien: Financial Institution (FI), Non-Financial Foreign Entity (NFFE) mit Unterteilung Active NFFE (§ 1472(c)(1), > 50 % aktive Einkünfte) und Passive NFFE (Restkategorie — dann Substantial-US-Owner-Disclosure nach § 1473(2) Pflicht). FIs benötigen einen Global Intermediary Identification Number (GIIN), der via IRS FATCA Registration Portal beantragt wird. Das DE-US-IGA Modell 1 vom 31.05.2013 (BGBl 2013 II 1362) verschiebt die Meldung: deutsche Finanzinstitute melden nicht direkt an den IRS, sondern an das BZSt, das jährlich bis 30.09. an den IRS konsolidiert weiterleitet (Art. 2 IGA). Reportable Accounts (Art. 4 (5)(b) IGA) sind Konten von Specified US Persons oder Passive NFFEs mit substantial US owners. Für Industrie-Corporates zentral: keine Withholding-Pflicht auf reine Intercompany-Zahlungen innerhalb des Konzerns, aber W-8BEN-E-Klassifizierung für jedes Konto bei einer FFI (Hausbank) verpflichtend — inklusive dreijähriger Renewal-Pflicht (IRS Reg. §1.1441-1(e)(4)(ii)) bzw. sofortiger Neuausstellung bei Change in Circumstances. Bei eigenen Tochter-FIs (z. B. Finanzierungs-SPVs in Luxemburg/Irland, Captive Insurance) entsteht zusätzlich GIIN-Pflicht und Sponsor-Reporting oder Direkt-Reporting-Model.
beschreibung_einsteiger: |
  FATCA ist ein US-Steuergesetz von 2010, das weltweit gegen Steuerhinterziehung durch US-Bürger kämpft. Banken weltweit müssen alle Kunden daraufhin prüfen, ob sie US-Personen sind — und das an den US-Fiskus (IRS) melden. In Deutschland läuft das über die BaFin und das Bundeszentralamt für Steuern (BZSt): deutsche Banken melden an das BZSt, das die Daten an die USA weitergibt. Für Industrieunternehmen heißt das konkret: bei jeder Hausbank muss ein FATCA-Formular (W-8BEN-E für juristische Personen, W-9 für US-Gesellschaften) ausgefüllt werden — mit einer Einstufung des Unternehmens (aktives Industrieunternehmen vs. passive Holding vs. Finanzinstitut). Wenn das Formular fehlt oder falsch ist, behält die US-Zahlstelle automatisch 30 % Quellensteuer auf alle US-Einkünfte ein (z. B. Dividenden aus US-Aktien, Zinsen aus US-Anleihen). Die Formulare müssen alle drei Jahre erneuert werden und bei Änderungen in der Struktur (z. B. Umfirmierung, neue Tochter) sofort aktualisiert werden.
auswirkungen_experte: |
  1) W-8BEN-E-Management: zentrale Pflege aller Konzerngesellschaften mit W-8BEN-E pro Bankbeziehung; Klassifizierung Active NFFE (Regelfall Industrieholdings mit aktiven Töchtern) oder Passive NFFE (reine Finanz-/Beteiligungsholdings — dann Substantial-US-Owner-Disclosure).
  2) 30 %-Withholding-Risiko: Fehlende oder abgelaufene W-8BEN-E führen zu 30 %-Einbehalt auf USD-Dividenden (US-Aktien im Beteiligungsportfolio), US-Bondkupons (Treasury Bills, Corporate Bonds), Bruttoveräußerungserlöse US-Wertpapiere — signifikant bei Treasury-Portfolios mit US-Exposure.
  3) GIIN-Pflicht bei Tochter-FIs: Finanzierungs-SPVs, Factoring-Vehikel, Captive Insurance in Luxemburg/Irland/Cayman müssen ggf. als FFI registriert werden und GIIN beantragen — mit laufenden Reporting-Pflichten und Responsible-Officer-Certification (RO) alle 3 Jahre.
  4) Change-in-Circumstances-Pflicht: Fusionen, Spin-offs, Namensänderungen, Änderungen der Eigentümerstruktur triggern sofortige Neuausstellung W-8BEN-E (IRS Reg. §1.1471-3(c)(6)(ii)(E)).
  5) SAP-Integration: Bankenstammdaten benötigen FATCA-Status-Feld, Geschäftspartner-Klassifizierung NFFE/FFI in BP, Withholding Tax Customizing (T059Z-Schlüssel US10/US11) für US-Zahlungsströme.
auswirkungen_einsteiger: |
  Konkret merkt man FATCA, wenn eine Bank einen kontaktiert und ein neues W-8BEN-E-Formular anfordert — typischerweise alle drei Jahre. Fehlt das Formular, behält die US-Gegenseite automatisch 30 % Steuer auf US-Erträge ein, was bei Treasury-Portfolios mit US-Anleihen oder US-Aktien sehr teuer wird. Wer eine Finanztochter in Luxemburg oder Irland hat (z. B. eine Finanzierungsgesellschaft), muss diese ggf. als eigenes Finanzinstitut registrieren und selbst Meldungen machen. Bei jeder Konzernumstrukturierung (Fusion, Verkauf, Umfirmierung) müssen die Formulare sofort neu ausgestellt werden.
pflichtmassnahmen_experte: |
  • Zentrales FATCA-Dossier pro Legal Entity: Klassifizierung (FI / Active NFFE / Passive NFFE / Direct-Reporting NFFE), EIN/TIN (falls vorhanden), GIIN (bei FI)
  • W-8BEN-E-Tracker mit 3-Jahres-Renewal-Reminder und Change-in-Circumstances-Trigger (M&A, Rebranding, Gesellschafterwechsel)
  • Responsible Officer Certification bei GIIN-registrierten Einheiten alle 3 Jahre über FATCA Registration Portal
  • Abstimmung Steuerabteilung ↔ Treasury: Intercompany-Flows vs. externe US-source-Payments; SAP Withholding-Tax-Customizing für Dividendenausschüttungen an US-Beteiligte
  • Bei Tochter-FIs: jährliche Compliance-Prüfung (intern oder WP), Aufbau oder Outsourcing der BZSt-Meldung (XML-Schema FATCA-XML v2.0)
  • Dokumentation Substantial US Owners bei Passive NFFEs (≥ 10 % Beteiligung US-Person, IRC § 1473(2))
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Liste aller Konzerngesellschaften mit ihrer FATCA-Klassifizierung erstellen und zentral pflegen (meist in Treasury/Steuer). 2) Pro Hausbank und pro Gesellschaft ein aktuelles W-8BEN-E hinterlegen; in einem Kalender alle drei Jahre an Erneuerung erinnern. 3) Bei jeder Konzernänderung (M&A, Rename, neue Geschäftsleitung) prüfen, ob Formulare neu ausgestellt werden müssen. 4) Bei eigenen Finanztöchtern (Luxemburg, Irland): klären, ob eine GIIN-Registrierung beim IRS nötig ist und wer die jährliche Meldung ans BZSt macht.
best_practice_experte: |
  • Zentrales FATCA/CRS-Register im Konzern: eine einheitliche Datenquelle (SAP BP oder dediziertes Tax-Tool wie Thomson Reuters ONESOURCE, Orbitax) für alle Klassifizierungen, TINs, GIINs, W-Formulare — inkl. Renewal-Workflow.
  • Kombination W-8BEN-E mit Self-Certification CRS: beide Prozesse operativ zusammenlegen, da 80 % Datenüberschneidung.
  • Bei komplexen Strukturen (Fonds, Verbriefungen, SPVs): frühzeitig US-Tax-Counsel einbinden; IRS-Ruling oder Opinion-Letter bei Zweifel an Klassifizierung.
  • Sponsor-Modell für kleine Tochter-FIs: Sponsoring durch eine zentrale Konzerneinheit (Treasury-Hub), reduziert individuelle GIIN-/Reporting-Pflichten der SPVs.
  • SAP TRM-SE Securities: bei US-Wertpapierportfolios automatisierte Prüfung der W-8BEN-E-Gültigkeit vor Zahlungsfreigabe US-source.
best_practice_einsteiger: |
  Am besten läuft FATCA, wenn die Steuer- und Treasury-Abteilung eine gemeinsame zentrale Liste aller Konzerngesellschaften führt — mit Klassifizierung, TIN und nächstem Fälligkeitstermin für W-8BEN-E. Neue Hausbankbeziehungen laufen dann automatisch durch diesen Prozess. Bei komplexen Strukturen (etwa Verbriefungen oder Fonds) lohnt es sich, einmal einen US-Steuerberater draufschauen zu lassen — danach läuft die Klassifizierung meist jahrelang stabil.
risiken_experte: |
  • 30 %-Withholding-Risiko auf US-source-Income bei fehlender/abgelaufener W-8BEN-E: konkret Dividenden US-Aktien, Zinsen Treasuries und US-Corporate-Bonds, Bruttoerlöse aus Verkauf US-Wertpapiere — nicht rückforderbar, wenn Self-Certification zum Withholding-Zeitpunkt fehlt.
  • Reputations- und Bankbeziehungsrisiko: FFIs kündigen zunehmend Konten bei FATCA-Non-Compliance (Konto-De-Risking).
  • Bei GIIN-registrierten Tochter-FIs: Verlust des GIIN bei RO-Certification-Ausfall → Status wird "Non-Participating FFI" → 30 %-Withholding auf alle US-Payments an diese Einheit.
  • DE-IGA-Disziplin: Verstöße der Hausbank gegen FKAustG/IGA-Meldepflichten können zu BaFin-Sonderprüfungen und indirekt zu Unannehmlichkeiten in der Kundenbeziehung führen.
  • Falsche Klassifizierung Active vs. Passive NFFE: bei späterer IRS-Prüfung Nachforderung der 30 %-Withholding inkl. Zinsen; persönliche Haftung der Directors möglich (seltene US-Konstellation).
risiken_einsteiger: |
  Das Hauptrisiko ist der 30 %-Steuereinbehalt auf US-Erträge, wenn ein Formular fehlt oder falsch ist — dieses Geld ist oft praktisch nicht mehr zurückzuholen. Banken werden zunehmend kritisch bei Kunden ohne saubere FATCA-Dokumente und kündigen teils Konten. Bei eigenen Finanztöchtern kann eine verpasste Meldung dazu führen, dass die Tochter vom US-Fiskus als "nicht kooperativ" eingestuft wird — dann wird jeder Dollar, der an diese Tochter fließt, um 30 % gekürzt.
verwandte_regulierungen: "CRS, DAC7-DAC8, OFAC, DSGVO-ZV"
sap_bezug: "Bankenstammdaten mit FATCA-Status-Feld (custom Erweiterung); Withholding Tax Customizing FI (T059Z-Steuerschlüssel US10/US11 Chapter 3 / Chapter 4); SAP TRM-SE Securities Management für US-Wertpapierportfolios mit W-8BEN-E-Gültigkeitsprüfung; Geschäftspartner-Klassifizierung NFFE/FFI in BP (Rolle TR0100); Datenfeld GIIN bei eigenen Tochter-FIs im BP-Stamm"
bussgeld: "Kein klassisches OWi-Bußgeld nach DE-Recht; primäre Sanktion ist 30 %-Quellensteuereinbehalt auf US-source-Withholdable-Payments (IRC § 1471(a)) — wirtschaftlich häufig sechs- bis siebenstellig bei US-lastigen Treasury-Portfolios; bei DE-IGA-Verstößen der Hausbank BaFin-Sonderprüfung und FKAustG-§ 28-Bußgelder (bis 50.000 EUR) möglich"
pruefpflicht: "Bank-seitig: jährliche FATCA-Compliance-Audit mit Responsible-Officer-Certification (RO) alle 3 Jahre (IRS Reg. §1.1471-4(f)); Corporate-seitig: Renewal W-8BEN-E alle 3 Jahre (IRS Reg. §1.1441-1(e)(4)(ii)) plus sofortige Neuausstellung bei Change in Circumstances; bei GIIN-registrierten Tochter-FIs jährliche BZSt-Meldung bis 31.07. des Folgejahres"
aufwand_tshirt: "S"
---

# FATCA — Vertiefung: W-8BEN-E-Management und NFFE-Klassifizierung

## Klassifizierungsmatrix für DE-Industrie-Corporates

| Entity-Typ | FATCA-Klassifizierung | W-Formular | Besonderheit |
|---|---|---|---|
| DE-AG/GmbH operativ (Produktion, Handel, Services) | Active NFFE | W-8BEN-E Part XXV | > 50 % aktive Einkünfte; keine GIIN |
| Reine Holding ohne operatives Geschäft | Passive NFFE | W-8BEN-E Part XXVI + Substantial US Owners | Owner-Disclosure ab 10 % US-Person |
| Konzern-Finanzierungs-SPV (Luxemburg/Irland) | FI / FFI | W-8BEN-E Part III (GIIN) | GIIN-Registrierung und Reporting |
| Captive Insurance (z. B. Liechtenstein) | FI (Specified Insurance Co.) | W-8BEN-E Part III + RO | Reporting-Pflicht FKAustG |
| US-Tochter (Inc., LLC) | US Person | W-9 | Kein W-8; 1099-Reporting US-seitig |
| Joint Venture (50/50 DE/US) | abhängig von Geschäftsmodell | W-8BEN-E oder W-9 | Klassifizierung im JV-Vertrag fixieren |

## Withholding-Mechanik (Chapter 4 FATCA vs. Chapter 3 allg.)

1) **Chapter 4 Withholding (FATCA)**: 30 % auf Withholdable Payments an Non-Participating FFIs oder Recalcitrant Accounts — Grundlage IRC § 1471(a).
2) **Chapter 3 Withholding (allg. NRA)**: 30 % (bzw. DBA-Satz, regelmäßig 15 % D/USA auf Dividenden, 0 % auf Zinsen) — Claim-of-Treaty-Benefits via W-8BEN-E Part III.
3) **Stacking**: Beide Regime laufen parallel; Chapter-4-Withholding geht vor. Erst nach FATCA-Compliance (gültige W-8BEN-E, Active NFFE) greift der DBA-Quellensteuersatz.

## SAP-Treasury-Umsetzung

1) **Geschäftspartner (BP) Z-Feld FATCA-Status**: Z_FATCA_CLASS (Active NFFE / Passive NFFE / FI / US Person), Z_GIIN, Z_W8_VALID_UNTIL; Ableitung in Zahlläufen (F110) und Wertpapierabwicklungen.
2) **Withholding-Tax-Customizing (T059Z)**: US10 (Chapter 4 / 30 %), US11 (Chapter 3 / DBA-reduziert); Zuordnung über BP-Klassifizierung.
3) **SAP TRM-SE**: Plausibilitätsprüfung W-8BEN-E-Gültigkeit vor Settlement US-source-Coupon; Sperre bei abgelaufenem Formular.
4) **Renewal-Workflow**: SAP Workflow oder externes Tool (Tax Management System) triggert 60 Tage vor Ablauf.
