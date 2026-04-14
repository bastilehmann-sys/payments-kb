---
kuerzel: "ZAG"
name: "Zahlungsdiensteaufsichtsgesetz"
typ: "nationales Gesetz (DE PSD2-Umsetzung)"
kategorie: "DE national / Zahlungsverkehr"
geltungsbereich: "Deutschland; gilt für Zahlungsdienstleister (Zahlungsinstitute, E-Geld-Institute), Kreditinstitute bei Erbringung von Zahlungsdiensten sowie mittelbar für Industrie-Corporates mit konzerninternen POBO/COBO-Strukturen"
status_version: "Fassung der Bekanntmachung vom 17.07.2017, zuletzt geändert durch Art. 23 FinmadiG vom 27.12.2023"
in_kraft_seit: "13.01.2018"
naechste_aenderung: "PSD3/PSR-Umsetzung — ZAG-Ablösung/Novelle geplant 2026–2027"
behoerde_link: "https://www.bafin.de/DE/Aufsicht/BankenFinanzdienstleister/Zahlungsverkehr/zahlungsverkehr_node.html"
betroffene_abteilungen: "Treasury, Legal, Compliance, Konzernfinanzierung, Steuerabteilung"
beschreibung_experte: |
  Das Zahlungsdiensteaufsichtsgesetz (ZAG) setzt die Zweite EU-Zahlungsdiensterichtlinie (PSD2, RL (EU) 2015/2366) in deutsches Recht um und regelt die Zulassung und laufende Aufsicht von Zahlungsinstituten und E-Geld-Instituten durch die BaFin. Zentrale Normen sind: § 1 ZAG (Begriffsbestimmungen), §§ 2–3 ZAG (Katalog der acht Zahlungsdienste — u. a. Dienst Nr. 3 Ausführung von Zahlungsvorgängen, Nr. 7 Zahlungsauslösedienst, Nr. 8 Kontoinformationsdienst), § 10 ZAG (Erlaubnispflicht), § 11 ZAG (Erlaubnisverfahren und Anforderungen — Anfangskapital nach § 12 ZAG von 20.000–125.000 EUR je nach Dienst), §§ 13–17 ZAG (organisatorische Anforderungen, Sicherungsanforderungen Kundengelder § 17, jährliche Prüfung § 17 i.V.m. § 24a), §§ 45–52 ZAG (Informations- und Transparenzpflichten, Starke Kundenauthentifizierung SCA gem. EBA-RTS 2018/389), §§ 60 ff. ZAG (Bußgeldkatalog). Für Industrie-Corporates ist insbesondere § 2 Abs. 1 Nr. 11 ZAG (Konzern-Privileg / "Payments within a group") relevant: Zahlungen innerhalb eines Konzernverbunds sind vom Zahlungsdienstbegriff ausgenommen — allerdings mit strenger BaFin-Auslegung (Konzernzugehörigkeit nach § 18 AktG, keine Zahlungen zugunsten konzernfremder Dritter). Payment-Factory-Konstruktionen (On-Behalf-of-Payments POBO / Collections-on-Behalf COBO) laufen Gefahr der Erlaubnispflicht, sobald die zahlende Gesellschaft auch für nicht-konzernverbundene Gesellschaften (z. B. Joint Ventures unter 50 %, neu erworbene Targets in Transition-Phase) Zahlungen ausführt. In-House-Banks mit SAP FSCM-IHC sind auf Konzernkreis und Zahlungszweck zu prüfen.
beschreibung_einsteiger: |
  Das ZAG regelt in Deutschland, wer Zahlungsdienste anbieten darf und welche Regeln dabei gelten. Aufsichtsbehörde ist die BaFin. Für typische Industrieunternehmen ist das Gesetz wichtig, wenn sie konzernintern zentrale Zahlungsstrukturen wie eine Payment Factory oder eine In-House-Bank betreiben — hier droht sonst eine Erlaubnispflicht wie bei einer Bank. Für Zahlungen, die ausschließlich innerhalb eines echten Konzernverbunds erfolgen, gibt es eine Ausnahme. Sobald aber auch Zahlungen für nicht-konzernzugehörige Gesellschaften (z. B. Joint Ventures, Beteiligungen unter 50 %) über die zentrale Einheit laufen, kann eine BaFin-Erlaubnis notwendig werden. Das Gesetz enthält außerdem Vorgaben zur Kundensicherheit, zu starker Authentifizierung bei Online-Zahlungen und zum Schutz von Kundengeldern.
auswirkungen_experte: |
  1) Review aller konzerninternen Payment-Factory- und In-House-Bank-Konstruktionen auf Konformität mit § 2 Abs. 1 Nr. 11 ZAG: Konzernzugehörigkeit (§ 18 AktG) aller teilnehmenden Gesellschaften dokumentieren, Zahlungen zugunsten nicht-konzernverbundener Dritter identifizieren und abstellen.
  2) POBO/COBO-Strukturen: Bei Zahlungen "im Namen und auf Rechnung" einer Tochtergesellschaft ist die rechtliche Qualifikation als Zahlungsdienst (§ 1 Abs. 1 Nr. 3 ZAG) zu prüfen; ggf. ist ein BaFin-Negativtestat einzuholen oder eine Erlaubnis nach § 10 ZAG zu beantragen.
  3) SCA-Pflicht (§§ 45, 55 ZAG i.V.m. EBA-RTS 2018/389): Bei Online-Zahlungen und Firmenkartenzahlungen ist die starke Kundenauthentifizierung der Hausbanken zu integrieren — Auswirkungen auf Treasury-Portale und Firmenkarten-Programme.
  4) Anzeigepflichten nach § 24 ZAG (bei Erlaubnisträgern): wesentliche Änderungen, Auslagerungen nach § 26 ZAG und bedeutende Geschäftsvorfälle sind anzeigepflichtig.
  5) Sicherungsanforderungen für Kundengelder (§ 17 ZAG): Segregationspflicht, getrenntes Treuhandkonto oder Versicherung — bei E-Geld-Emission zusätzlich Rückzahlungspflicht (§ 33 ZAG).
auswirkungen_einsteiger: |
  Wenn das Unternehmen eine Payment Factory oder In-House-Bank hat, muss geprüft werden, ob die dort abgewickelten Zahlungen wirklich nur für Konzerngesellschaften laufen. Schon ein Joint Venture mit 49 % Beteiligung kann die Ausnahme kippen und eine Bankerlaubnis erforderlich machen. Bei Online-Banking und Firmenkarten muss man mit zusätzlichen Sicherheitsabfragen (starke Authentifizierung) rechnen. Wer Kundengelder verwaltet, muss diese getrennt vom eigenen Vermögen halten.
pflichtmassnahmen_experte: |
  • Konzernstruktur-Analyse aller POBO/COBO-Flüsse: Nachweis § 18 AktG für jede teilnehmende Gesellschaft; schriftliche Konzernzugehörigkeitsdokumentation
  • BaFin-Konsultation / Negativtestat bei Grenzfällen (z. B. JV, Minderheitsbeteiligungen, Transition-Service-Agreements nach M&A)
  • Implementierung SCA-konformer Prozesse für Online-Banking-Zugänge (EBICS-T mit elektronischer Unterschrift, SAP Multi-Bank Connectivity mit 2FA)
  • Bei Erlaubnispflicht: Antrag nach § 10 ZAG mit Geschäftsplan, Kapitalnachweis (§ 12), Fit-and-Proper-Nachweis Geschäftsleitung (§ 13), IT-Konzept, Sicherungsmechanismus Kundengelder (§ 17)
  • Jährliche Prüfung nach § 17 ZAG (bei Erlaubnisträgern) durch unabhängigen Wirtschaftsprüfer; Vorlage bei BaFin bis 30.06. des Folgejahres
  • Auslagerungsregister nach § 26 ZAG führen; wesentliche Auslagerungen (IT, Rechenzentrum, Zahlungsabwicklung) anzeigepflichtig
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Liste aller Gesellschaften, für die zentral Zahlungen ausgeführt werden — und prüfen, ob wirklich alle zum Konzern gehören. 2) Bei Zweifel eine schriftliche Einschätzung bei der BaFin einholen. 3) Online-Zugänge zu Hausbanken auf starke Authentifizierung (z. B. App-Bestätigung, Hardware-Token) umstellen. 4) Verträge mit IT- und Banken-Dienstleistern auf Auslagerungsrisiken prüfen. 5) Falls tatsächlich eine BaFin-Lizenz nötig wird: rechtzeitig (12–18 Monate Vorlauf) mit Legal und BaFin anfangen.
best_practice_experte: |
  • Klare Trennung "Treasury-Dienstleistung" (kein ZAG) versus "Zahlungsdienst" (ZAG-pflichtig): Cash-Pooling auf echten Konzerngesellschaften mit physischer Kontoführung beim Kreditinstitut ist kein Zahlungsdienst; eigene Zahlungsinfrastruktur mit Drittbegünstigten ist kritisch.
  • BaFin-Merkblatt "Hinweise zum Zahlungsdiensteaufsichtsgesetz" (zuletzt aktualisiert 12/2023) und die Auslegungshinweise zur Konzernfreistellung beachten; BaFin-Innovation-Hub bei Grenzfällen frühzeitig einbinden.
  • SAP FSCM In-House-Cash (IHC) immer paarweise mit Payment-Factory-Legal-Opinion: Rollout in neue Länder/Gesellschaften nur nach Rechts-Review.
  • Für Mittelstand ohne eigene Lizenz: Nutzung lizenzierter Dritt-PSPs (z. B. TreasurUp, Tipalti, Payhawk) als ausgelagerte Zahlungsdienstleister — diese halten die ZAG-Erlaubnis.
best_practice_einsteiger: |
  Wer eine Payment Factory betreibt, sollte die Konzernstruktur regelmäßig (mindestens jährlich) prüfen — besonders nach Zukäufen oder Umstrukturierungen. In Zweifelsfällen lohnt ein kurzes Schreiben an die BaFin, bevor man Strukturen baut, die später teuer korrigiert werden müssen. Wenn die Komplexität zu hoch wird, ist ein lizenzierter externer Zahlungsdienstleister oft günstiger als eine eigene BaFin-Erlaubnis.
risiken_experte: |
  • Unerlaubte Zahlungsdienste (§ 63 ZAG): Betreiben einer Zahlungsdienste-Infrastruktur ohne Erlaubnis ist Straftat — Freiheitsstrafe bis 5 Jahre oder Geldstrafe; bei Fahrlässigkeit OWi mit Bußgeld.
  • Bußgeldrisiko § 64 ZAG: bis 5 Mio. EUR oder 10 % des jährlichen Gesamtumsatzes (juristische Personen) bei Verstößen gegen Organisationspflichten, Sicherungsanforderungen oder Meldepflichten.
  • Rückabwicklungsrisiko: Rechtsgeschäfte aus unerlaubten Zahlungsdiensten sind zivilrechtlich angreifbar — einzelne Zahlungen können zurückgefordert werden.
  • Reputations- und M&A-Risiko: Unklare ZAG-Lage in der Payment Factory ist ein Deal-Breaker in Due Diligence; Red-Flag-Befund führt zu Kaufpreisabschlägen oder Earn-out-Klauseln.
  • Fortlaufende Compliance: Änderungen im Konzernkreis (Veräußerungen, JV-Gründungen) machen die Konzernfreistellung ungültig, ohne dass es intern sofort bemerkt wird.
risiken_einsteiger: |
  Das größte Risiko ist, unbewusst eine Bankdienstleistung zu erbringen, ohne die dafür nötige BaFin-Erlaubnis zu haben. Das kann teuer werden — bis zu 5 Mio. EUR Bußgeld oder sogar Strafverfahren gegen die Geschäftsleitung. Außerdem können laufende Zahlungen rechtlich angreifbar werden, wenn sie ohne Erlaubnis abgewickelt wurden. Bei Firmenverkäufen entdecken Käufer solche Strukturen und ziehen den Preis ab.
verwandte_regulierungen: "PSD2, PSD3/PSR, KWG, GwG, EBA-SCA-RTS, DORA"
sap_bezug: "SAP FSCM In-House Cash (IHC) — POBO/COBO-Konstruktionen; SAP Bank Communication Management (BCM); SAP Multi-Bank Connectivity (MBC) für EBICS/SWIFT; FI-BL (Bank Accounting); Customizing OT83/FIBHS für Haus-/Partnerbank-Stammdaten"
bussgeld: "bis 5 Mio. EUR oder 10 % des jährlichen Gesamtumsatzes (§ 64 ZAG, juristische Personen); unerlaubte Zahlungsdienste § 63 ZAG: Freiheitsstrafe bis 5 Jahre"
pruefpflicht: "Bei Erlaubnispflicht jährliche WP-Prüfung nach § 17 ZAG (Vorlage BaFin bis 30.06. Folgejahr); für Nicht-Erlaubnisträger Awareness-Prüfung im Rahmen Jahresabschluss"
aufwand_tshirt: "M"
---

# ZAG — Vertiefung: Payment Factory und Konzernfreistellung

## Kritische Prüfpunkte § 2 Abs. 1 Nr. 11 ZAG

| Konstellation | ZAG-Relevanz |
|---|---|
| 100 %-Konzernverbund, nur Intercompany-Zahlungen | Freigestellt |
| POBO für Mehrheitsbeteiligung > 50 % (§ 18 AktG) | In der Regel freigestellt |
| POBO für Joint Venture 50/50 | Kritisch — keine § 18 AktG-Abhängigkeit, Konzernprivileg greift meist nicht |
| POBO für Minderheitsbeteiligung < 50 % | Grundsätzlich ZAG-pflichtig |
| Zahlungen an konzernfremde Lieferanten im Namen der Tochter | Freigestellt, wenn echter eigener Zahlungsverkehr der Tochter über IHC abgewickelt wird |
| Transition-Service-Agreement nach Carve-out (veräußerte Einheit wird weiter bezahlt) | Kritisch — nach Closing kein Konzernverbund mehr; zeitlich befristete BaFin-Duldung individuell zu klären |

## SAP-Treasury-Umsetzung

1) **SAP FSCM IHC**: Zentrale Technik für Payment-on-Behalf. Konfiguration der IHC-Konten je Konzerngesellschaft; End-to-End-Buchung über Clearing-Konten. Legal-Opinion dokumentieren.
2) **Zahlungsarten im ZFBE (Zahlungsprogramm F110)**: Klar getrennte Zahlwege für POBO versus eigene Zahlungen; Customizing OBVU.
3) **Auslagerungsregister (§ 26 ZAG)**: Bei Nutzung SAP BTP / Cloud-Dienste für zahlungsnahe Prozesse: Eintrag im Auslagerungsregister, DORA-Art.-28-Bewertung parallel.
