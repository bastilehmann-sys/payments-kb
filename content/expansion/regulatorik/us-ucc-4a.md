---
kuerzel: "US-UCC-4A"
name: "Uniform Commercial Code Article 4A (Funds Transfers — Wholesale/Wire) + Regulation E (CFPB 12 CFR Part 1005, Consumer Electronic Funds Transfers)"
typ: "US-bundesstaatlicher Modellgesetz-Standard (alle 50 States adopted) + US-Bundesregulierung"
kategorie: "USA / Zahlungsverkehr / Privatrecht + Verbraucherschutz"
geltungsbereich: "Vereinigte Staaten von Amerika; UCC 4A in allen 50 Bundesstaaten in Landesrecht übernommen; Reg E bundesweit via CFPB; gilt für Fedwire-/CHIPS-Wire-Transfers, ACH (über NACHA-Regeln), FedNow sowie mittelbar für DE-Industrie-Corporates mit US-Tochtergesellschaften, USD-Konten oder USD-Zahlungsflüssen durch US-Korrespondenzbanken"
status_version: "UCC 4A Model Law 1989, zuletzt Amendments 2012; Reg E 12 CFR 1005 Stand 2024"
in_kraft_seit: "UCC 4A: 1989 (Drafting), seit 1995 in allen 50 Staaten adopted; Reg E: 1979"
naechste_aenderung: "FedNow (US-Realtime-System) seit 20.07.2023 live, Volumen wächst kontinuierlich; mögliche Reg-E-Anpassung für Realtime- und KI-Fraud-Szenarien in CFPB-Diskussion"
behoerde_link: "https://www.uniformlaws.org/committees/community-home?CommunityKey=aaad8a0e-d8b1-4cdb-9b97-cb733d57c0c2 (UCC 4A); https://www.consumerfinance.gov/rules-policy/regulations/1005/ (Reg E)"
betroffene_abteilungen: "Treasury, Legal, Compliance US, Shared Service Center USD, IT/SAP BCM, Tax"
beschreibung_experte: |
  Der Uniform Commercial Code Article 4A regelt privatrechtlich den Wholesale-Wire-Transfer in den USA, also Fedwire (Federal Reserve Wire Network, RTGS), CHIPS (Clearing House Interbank Payments System) und eingehende SWIFT-FIN-MT103-Zahlungen an US-Banken. UCC 4A wurde 1989 von der Uniform Law Commission als Modellgesetz verabschiedet und bis 1995 in allen 50 Bundesstaaten als Landesrecht adoptiert (mit geringen Abweichungen, z. B. New York UCC Art. 4-A). Zentrale Normen: § 4A-207 "Identification by Account Number" — bei Diskrepanz zwischen Kontonummer/IBAN und Begünstigtenname ist die Bank entlastet, wenn der Sender die Kontonummer korrekt angegeben hat. Es besteht keine Name-Account-Match-Pflicht wie bei der EU PSD3 Confirmation of Payee; das Risiko einer Fehlüberweisung trägt bei korrekter Kontonummer der Sender. § 4A-202 definiert Authorized und Verified Payment Orders (Sicherheitsverfahren zwischen Sender und Bank); § 4A-305 regelt Misdescription of Beneficiary; § 4A-402 Abs. 3 gewährt die Money-Back Guarantee bei Non-Execution (Rückzahlungspflicht der Bank bei nicht ausgeführten Aufträgen). Regulation E (CFPB 12 CFR Part 1005, basierend auf dem Electronic Fund Transfer Act 1978) schützt Verbraucher bei Electronic Funds Transfers: Consumer-Liability-Cap USD 50 / USD 500 / unbegrenzt je nach Meldezeitpunkt, Error-Resolution-Procedures (10/45 Tage), Disclosure-Pflichten. Reg E gilt nicht für reine B2B-Zahlungen, aber sobald ein Consumer-Account beteiligt ist (z. B. B2C-Retouren, Gehaltsauszahlungen an US-Mitarbeiter, Consumer-Refunds). FedNow ist seit 20.07.2023 live als neues US-Realtime-System, basiert auf ISO 20022 (pacs.008) und konkurriert mit RTP des The Clearing House. Für DE-Corporates relevant: USD-Wires aus Europa gehen über Korrespondenzbanken (z. B. JPMorgan, Bank of New York Mellon, Citi) in Fedwire/CHIPS ein — UCC 4A ist dann anwendbares Recht."
beschreibung_einsteiger: |
  In den USA funktioniert der Zahlungsverkehr grundlegend anders als in Europa. Das zentrale Gesetz heißt UCC 4A und ist privatrechtlich — es gibt also keine staatliche Aufsicht wie die BaFin, sondern bei Streitigkeiten entscheiden Zivilgerichte. Der wichtigste Unterschied zu Europa: In den USA zählt ausschließlich die Kontonummer (meist IBAN gibt es nicht, sondern Routing-Number ABA + Account-Number). Wenn die Kontonummer stimmt, ist die Bank fein raus — selbst wenn der Empfängername falsch ist, haftet nicht die Bank, sondern der Absender. Es gibt keinen automatischen Namensabgleich wie in UK oder (ab PSD3) in Europa. Für Verbraucherzahlungen gilt zusätzlich die Regulation E, die bei unberechtigten Abbuchungen Rückerstattungen garantiert. Seit Juli 2023 gibt es mit FedNow ein neues Echtzeit-System, das SAP und die Hausbanken neu anbinden müssen."
auswirkungen_experte: |
  1) USD-Wire-Risikomanagement: Jede USD-Zahlung über Fedwire/CHIPS trägt das "Name-Account-Mismatch"-Risiko — Empfänger-Stammdaten in SAP Business Partner müssen mit extremer Sorgfalt gepflegt werden, da die Kontonummer allein Zahlungsfreigabe bewirkt.
  2) Fehlüberweisungs-Recovery: Bei Fehlern nicht automatisch zurückholbar — Rückforderung über Civil Litigation, oft langwierig und kostenintensiv.
  3) FedNow-Connectivity: Neue ISO-20022-pacs.008-Nachrichten, Anbindung über Drittanbieter (FIS, Volante, Finastra) oder direkte Fed-Anbindung; Treasury-Software muss FedNow-Support haben.
  4) NACHA-ACH für wiederkehrende USD-Zahlungen: separates Format, eigene Rulebooks (NACHA Operating Rules), abweichend von Wire.
  5) Reg-E-Compliance für B2C-Szenarien: Consumer-Refunds, Gehaltsauszahlungen USA, Gift-Card-Programme benötigen Reg-E-konforme Disclosures und Error-Resolution-Prozess.
  6) OFAC-Sanktions-Screening: jede USD-Zahlung durch Korrespondenzbank OFAC-gescreent — bei Treffer Einfrieren und Meldung an OFAC (50 U.S.C. § 1701 ff.).
  7) ABA-Routing-Number-Mapping: SAP BCM muss ABA als ClrSysMmbId in pain.001 korrekt setzen, sonst Ablehnung durch US-Bank.
auswirkungen_einsteiger: |
  Wer USD-Zahlungen an US-Empfänger sendet, muss besonders auf die Kontonummer achten — sie ist das einzige, was zählt. Ein falscher Empfängername wird nicht bemerkt, das Geld geht an den falschen Kontoinhaber, und die Rückforderung ist mühsam. Das neue FedNow-System ermöglicht seit Mitte 2023 Echtzeit-Überweisungen in USD, allerdings muss die Zahlungssoftware dafür erst umgestellt werden. Bei Zahlungen an Privatpersonen in den USA (z. B. Mitarbeiter, Kunden-Retouren) gelten zusätzlich Verbraucherschutzregeln mit klaren Fristen für Reklamationen. Wichtig: Alle USD-Zahlungen laufen durch US-Korrespondenzbanken und werden dort gegen US-Sanktionslisten (OFAC) geprüft — bei Treffern wird die Zahlung eingefroren."
pflichtmassnahmen_experte: |
  • SAP BP-Stammdatenpflege mit Doppelprüfung für US-Empfänger (ABA Routing Number + Account Number verifizieren, z. B. gegen GIACT, Plaid oder Bankauszug)
  • SAP BCM US-Wire-Connector: pain.001 mit ABA als ClrSysMmbId im CdtrAgt-Segment, USD als Währung
  • NACHA-ACH-Format implementieren für wiederkehrende USD-Zahlungen (PPD, CCD, CTX Standard Entry Class Codes)
  • FedNow-Roadmap: Prüfung ob Hausbank bereits FedNow-Teilnehmer, ISO-20022-pacs.008 Support in SAP prüfen (ab S/4HANA 2023 verfügbar)
  • Reg-E-Prozess dokumentieren für alle Consumer-Zahlungsflüsse (B2C-Refunds, Payroll USA, Gift Cards): Disclosures, Error-Resolution 10/45-Tage-Workflow
  • OFAC-Screening in SAP GTS oder Drittanbieter (Accuity, Refinitiv) mit täglichem Listen-Update (SDN List, Sectoral Sanctions)
  • Civil-Litigation-Rückstellung in Treasury-Policy: Dokumentation aller großen USD-Wire-Instructions mit Freigabekette für Beweiszwecke
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Bei US-Lieferanten und US-Mitarbeitern die Kontonummer und Routing-Number immer doppelt verifizieren — am besten per Rückruf oder über einen Verifikations-Service. 2) Die Zahlungssoftware prüfen lassen, ob sie ABA-Routing-Numbers korrekt im Format abbildet. 3) Mit der Hausbank klären, ob FedNow schon unterstützt wird, falls schnelle USD-Zahlungen nötig sind. 4) Für Zahlungen an US-Privatpersonen einen dokumentierten Reklamationsprozess einrichten. 5) Sicherstellen, dass alle USD-Zahlungen vor Versand gegen die US-Sanktionsliste geprüft werden — sonst friert die Korrespondenzbank das Geld ein."
best_practice_experte: |
  • Account-Verification-Service einsetzen (z. B. GIACT, Plaid, Yodlee Validate) für Neu-Lieferantenanlage — verhindert Fehlüberweisungen nach § 4A-207
  • Bevorzugt CHIPS für Same-Day-Großbeträge (niedrigere Kosten als Fedwire), Fedwire für zeitkritische Transaktionen
  • FedNow als Alternative zu Wire für Zeitwert-sensitive B2B-Zahlungen < USD 500.000 (aktuelles Limit, Anhebung geplant)
  • Interne "US Wire Policy" mit Vier-Augen-Prinzip ab definiertem Schwellenwert (z. B. USD 100.000)
  • OFAC-SDN-Liste nicht nur im GTS, sondern auch bei SAP BP Anlage als Block (Prävention statt Reaktion)
  • Nutzung von Treasury-Specialist-Kanzleien in USA (z. B. Davis Polk, Sullivan & Cromwell) bei komplexen USD-Flows
best_practice_einsteiger: |
  Eine Account-Verification per API (z. B. GIACT, Plaid) lohnt sich schon bei wenigen US-Lieferanten, da sie Fehlüberweisungen verhindert. FedNow ist für schnelle Mittelstandszahlungen sinnvoll, für hohe Beträge bleibt das klassische Wire über CHIPS oder Fedwire die erste Wahl. Wichtig: Ein klarer interner Prozess mit Vier-Augen-Prinzip für alle USD-Zahlungen schützt vor den teuren Fehlüberweisungen, die in den USA nur schwer rückgängig zu machen sind."
risiken_experte: |
  • UCC 4A § 4A-207 Fehlüberweisungsrisiko: bei korrekter Kontonummer/falschem Namen trägt Sender vollen Schaden; zivilrechtliche Rückforderung (Unjust Enrichment, Conversion) nur mit Prozessrisiko
  • Business Email Compromise (BEC): Hauptvektor bei USD-Wire-Betrug, UCC 4A erlaubt Banken volle Entlastung wenn "Commercially Reasonable Security Procedure" (§ 4A-202) eingehalten
  • Reg-E-CFPB-Bußen: 12 U.S.C. § 5565 — Tier 1 bis USD 5.000/Tag, Tier 2 bis USD 25.000/Tag, Tier 3 bis USD 1 Mio./Tag (Wissentlich/systematisch)
  • Class-Action-Risiko: bei systematischen Reg-E-Verstößen drohen Sammelklagen mit Schadensvolumen > USD 100 Mio.
  • OFAC-Verstöße: strict liability — Bußen bis USD 1 Mio. oder doppelter Transaktionswert (IEEPA, 50 U.S.C. § 1705); typische Settlements USD 5–500 Mio.
  • Reputationsrisiko: OFAC-Settlements werden öffentlich publiziert (OFAC Enforcement Actions)
  • Keine Rückabwicklungspflicht der Empfängerbank bei fraudulent redirected wires
risiken_einsteiger: |
  Das größte Risiko in den USA: Einmal falsch überwiesenes Geld kommt nur schwer zurück. Bei Betrugsfällen (gefälschte Rechnungen, manipulierte Kontodaten per E-Mail) ist der Absender fast immer haftbar, nicht die Bank. Hohe Strafen drohen bei Verstößen gegen US-Sanktionen (OFAC) — bis zu einer Million Dollar pro Fall, plus öffentliche Nennung. Bei Zahlungen an US-Verbraucher können systematische Fehler zu Sammelklagen führen, die schnell dreistellige Millionensummen erreichen."
verwandte_regulierungen: "OFAC, FATCA, PSD3, ISO 20022, NACHA Operating Rules, Dodd-Frank, BSA"
sap_bezug: "SAP BCM US-Wire/ACH-Connector (NACHA-Format für ACH, pain.001/MT103 für Wire mit ABA als ClrSysMmbId im CdtrAgt-Segment); FedNow-Connectivity über Drittanbieter (FIS, Volante, Finastra) oder Hausbank-H2H ab S/4HANA 2023; Output-Customizing (OBPM1) für US-spezifisches pain.001-Mapping (Routing Number ABA, US-Adressformat); SAP GTS Compliance mit OFAC-SDN-Liste und Sectoral Sanctions; SAP BP Account-Verification-Integration (GIACT/Plaid als External Service)"
bussgeld: "UCC 4A: zivilrechtlich (Schadensersatz, Money-Back § 4A-402 (3), keine öffentlich-rechtliche OWi); Reg E: CFPB-Geldbußen pro Verstoß gestaffelt nach 12 U.S.C. § 5565 — Tier 1 bis USD 5.000/Tag, Tier 2 bis USD 25.000/Tag, Tier 3 bis USD 1 Mio./Tag; Class-Action-Risiko bei systematischen Verstößen; OFAC: bis USD 1 Mio. pro Transaktion (IEEPA 50 U.S.C. § 1705)"
pruefpflicht: "Keine periodische öffentlich-rechtliche Prüfung für Corporates; intern jährliche Treasury-Policy- und Banken-AGB-Review empfohlen; bei US-Tochter mit Consumer-Exposure jährliche Reg-E-Compliance-Review durch US-Counsel; SOX-404-relevant bei börsennotierten DE-Konzernen mit US-Reporting"
aufwand_tshirt: "S"
---

# US-UCC-4A — Vertiefung: USD-Wires, Name-Account-Mismatch und FedNow

## Zahlungsschiene USA im Überblick

| System | Typ | Limit | Rechtsrahmen |
|---|---|---|---|
| Fedwire | RTGS (Fed) | unbegrenzt | UCC 4A |
| CHIPS | Netting (The Clearing House) | unbegrenzt | UCC 4A + CHIPS Rules |
| ACH (NACHA) | Batch | USD 1 Mio. (Same Day) | NACHA Operating Rules + UCC 4A |
| FedNow | Realtime 24/7 | USD 500.000 (Stand 2024) | UCC 4A + FedNow Service Rules |
| RTP | Realtime 24/7 | USD 1 Mio. | UCC 4A + RTP Rulebook |

## Name-Account-Mismatch-Risiko (§ 4A-207)

1) **Grundregel**: Kontonummer schlägt Name. Bank haftet nicht bei Match auf Kontonummer.
2) **Ausnahme**: Wenn Bank "actual knowledge" der Abweichung hat, haftet sie.
3) **Corporate-Schutz**: Account-Verification vor Zahlungsauslösung (GIACT, Plaid, Callback).
4) **Business Email Compromise**: Hauptbetrugsvektor — Vier-Augen-Prinzip und Out-of-Band-Verifizierung bei Kontodatenänderungen.

## SAP-Umsetzung

1) **SAP BCM**: pain.001-Customizing mit ABA im CdtrAgt/FinInstnId/ClrSysMmbId; NACHA-Format als separater Ausgabekanal.
2) **FedNow**: ISO-20022-pacs.008 Support ab S/4HANA 2023; Drittanbieter-Connector für Altsysteme.
3) **SAP GTS**: OFAC-SDN-Screening vor Zahlungsfreigabe; Sperrung bei Treffer.
4) **SAP BP**: Account-Verification-API (GIACT/Plaid) bei Neuanlage US-Geschäftspartner als Pflichtschritt.
