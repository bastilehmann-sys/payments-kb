---
kuerzel: TFR
name: Transfer of Funds Regulation / Wire Transfer Regulation (Travel Rule)
typ: EU-Verordnung
kategorie: AML / Transparenz / Krypto
in_kraft_seit: "30.12.2024"
naechste_aenderung: "EBA-Leitlinien zu TFR-Krypto-Umsetzung 2026; FATF-Mutual-Evaluation EU 2025"
behoerde_link: https://www.eba.europa.eu/regulation-and-policy/aml-and-cft/guidelines-on-wire-transfers-and-crypto-asset-transfer
betroffene_abteilungen: Treasury, Compliance, IT, Correspondent Banking
geltungsbereich: EU-weit; gilt für Zahlungsdienstleister (PSPs) und Krypto-Asset-Dienstleister (CASPs) bei der Übermittlung von Geldtransfers und Krypto-Asset-Transfers; ausgenommen sind Transfers zwischen Privatpersonen ohne gewerbliche Tätigkeit sowie Zahlungen < 1.000 EUR unter bestimmten Bedingungen
status_version: Verordnung (EU) 2023/1113 (neue TFR, ersetzt VO (EU) 2015/847); Anwendbarkeit ab 30.12.2024; erstreckt nun auch auf Krypto-Asset-Transfers (Travel Rule für CASPs)
beschreibung_experte: |
  Die Verordnung (EU) 2023/1113 über Geldtransfers und Transfers von Krypto-Assets (Transfer of Funds Regulation, TFR) erweitert die bisherige Geldtransfer-Verordnung (VO (EU) 2015/847) um zwei wesentliche Dimensionen: 1) Vollständige Übertragung der FATF Travel Rule auf EU-Krypto-Asset-Transfers: Ab 30.12.2024 müssen CASPs bei jedem Krypto-Asset-Transfer die vollständigen Angaben zum Originator (Name, Adresse, Kontonummer/Wallet-Adresse) und Beneficiary mitübertragen — unabhängig vom Betrag. Dies entspricht der FATF Recommendation 16 (Travel Rule). 2) Verschärfte Anforderungen für klassische Geldtransfers: Die Anforderungen an die Vollständigkeit der Auftraggeberdaten (Art. 4–6 TFR) werden präzisiert; fehlende Daten führen zu Abgleichpflichten und ggf. Ablehnung (Art. 8 TFR). Für Treasury-Abteilungen bedeutsam: Art. 14–19 TFR regeln die Weiterleitung von Zahlungsdaten durch Intermediäre (Korrespondenzbanken) — diese müssen alle Auftraggeberdaten unverändert durchleiten. SAP TRM / Zahlungsworkflows müssen sicherstellen, dass alle Pflichtfelder (Auftraggeber-Name, -Adresse, -Kontonummer) korrekt befüllt werden, bevor die Zahlung den internen Verarbeitungsprozess verlässt.
beschreibung_einsteiger: |
  Die Wire-Transfer-Verordnung schreibt vor, dass bei jeder Banküberweisung und bei jedem Transfer von Kryptowährungen bestimmte Informationen über den Absender mitgeschickt werden müssen — ähnlich wie die Absenderadresse auf einem Brief. Das soll verhindern, dass Geld anonym für Geldwäsche oder Terrorismusfinanzierung genutzt wird. Neu ab Ende 2024: Diese Regel gilt auch für Kryptowährungen wie Bitcoin oder Stablecoins — nicht nur für normale Banküberweisungen.
auswirkungen_experte: |
  1) Vollständigkeitsprüfung Auftraggeberdaten in SAP-Zahlungsläufen: Art. 4 Abs. 1 TFR verlangt vollständige Angaben (Name, Adresse oder Geburtsdatum oder Kundenidentifikationsnummer, Kontonummer) — Pflichtfeldvalidierung im SAP Payment Medium Workbench / F110-Zahlungsläufen muss sicherstellen, dass kein Transfer ohne diese Daten abgesandt wird.
  2) Korrespondenzbanken-Durchleitung (Art. 14 TFR): Korrespondenzbanken müssen empfangene Zahlungsdaten unverändert weiterleiten — Banken ohne STP-fähige ISO 20022-Verarbeitung riskieren Datenverlust bei Nachrichtenkonvertierung (z. B. MT103 → pacs.008 → MT103); ISO 20022-Migration reduziert dieses Risiko.
  3) Krypto-Travel-Rule-Compliance für CASPs (Art. 14–25 TFR): CASPs müssen vor jedem Krypto-Transfer Originator- und Beneficiary-Daten übertragen — Protokolle hierfür (IVMS101, TRISA, OpenVASP) sind noch nicht vollständig standardisiert; Technologiepartner auswählen, die interoperabel sind.
  4) Unhosted-Wallet-Risiko (Art. 17 TFR): Transfers an oder von nicht-verwahrten Wallets (Unhosted Wallets, z. B. MetaMask, Ledger Hardware-Wallet) unterliegen erhöhten Prüfpflichten — CASPs müssen sicherstellen, dass Originator/Beneficiary identifiziert ist (KYC) oder den Transfer ablehnen.
  5) Datenschutz-Konflikt: Übermittlung von Beneficiary-Daten kann DSGVO-Fragen aufwerfen, wenn Daten in Drittstaaten übertragen werden — Art. 49 Abs. 1 lit. g DSGVO (Öffentliches Interesse / rechtliche Pflicht) als Rechtsgrundlage prüfen.
auswirkungen_einsteiger: |
  Bei jeder Banküberweisung und jedem Krypto-Transfer muss dein Zahlungssystem automatisch alle Pflichtangaben über den Absender (Name, Adresse, Kontonummer) mitliefern. Wenn diese Daten fehlen, kann die Bank oder der Krypto-Dienstleister die Zahlung ablehnen oder auf Eis legen, bis die Daten nachgeliefert werden. Für Krypto-Transfers gibt es ab Ende 2024 eine neue Pflicht: die sogenannte Travel Rule — alle beteiligten Parteien müssen die Absenderdaten von Wallet zu Wallet mitschicken.
pflichtmassnahmen_experte: |
  • Pflichtfeldvalidierung in SAP-Zahlungsläufen: Vor SEPA- und SWIFT-Übermittlung prüfen, ob Auftraggeber-Name, -Adresse und -IBAN/Kontonummer vollständig in den Stammdaten hinterlegt sind (Kreditoren-Stammdaten, Zahlungsweg-Konfiguration)
  • Prozess für fehlende Auftraggeberdaten definieren (Art. 8–9 TFR): Was passiert, wenn eingehende Zahlung ohne vollständige Daten ankommt? Abfrage-Workflow zur Ergänzung durch Auftraggeber-PSP, ggf. Ablehnung oder Monitoring implementieren
  • CASP-Travel-Rule-Protokoll auswählen und implementieren: Für Krypto-Transfers IVMS101-Datenmodell oder TRISA-Netzwerk einsetzen; Interoperabilitätstests mit Gegenstellen durchführen
  • Unhosted-Wallet-Policy: Interne Richtlinie definieren, unter welchen Bedingungen Transfers an nicht-verwahrte Wallets erlaubt sind (Betragslimits, zusätzliche KYC-Schritte) oder generell unterbunden werden
  • Monitoring eingehender Transfers auf Vollständigkeit: Automatische Flaggung von Transfers ohne Auftraggeberdaten für Compliance-Review
  • Schulung Treasury/Compliance: Unterschied TFR (Datenpflicht) vs. AML-Screening (Sanktionslisten) kommunizieren — beides läuft parallel, TFR-Pflicht existiert auch ohne Verdacht
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Sicherstellen, dass in SAP oder dem Zahlungssystem bei jeder Zahlung automatisch Name, Adresse und Kontonummer des Auftraggebers mitgeschickt werden. 2) Einen Prozess festlegen, was passiert, wenn eingehende Zahlungen ohne diese Pflichtdaten ankommen. 3) Falls Krypto-Assets transferiert werden: Einen Anbieter auswählen, der die Travel Rule technisch unterstützt.
best_practice_experte: |
  • ISO 20022-Migration als TFR-Enabler: pain.001 / pacs.008 enthalten strukturierte Adressfelder (z. B. `Dbtr/PstlAdr/StrtNm`, `TwnNm`, `Ctry`), die TFR-Pflichtdaten ohne Datenverlust transportieren — MT103 kann nur 35-Zeichen-Adresszeilen, was zu Abkürzungen und Datenverlust führt; Argument für ISO 20022-Migration auch ohne Regulierungspflicht
  • Korrespondenzbankbeziehungen auf ISO-20022-Readiness prüfen: Bei SWIFT-Korrespondenten, die noch kein ISO 20022 verarbeiten, droht Datenverlust durch MT-Konvertierung; Bankpartner-Assessment durchführen
  • TFR-Compliance-Engine im GRC-Tool: Regelbasierte Validierung vor Zahlungsfreigabe — verhindert TFR-Verstöße an der Quelle statt durch nachträgliche Kontrolle
  • Für CASP: Sunrise-Issue-Monitoring: Wenn Gegenstelle Travel Rule noch nicht implementiert hat, muss CASP entscheiden, ob Transfer trotzdem ausgeführt oder abgelehnt wird — klare interne Policy erforderlich
best_practice_einsteiger: |
  Der einfachste Weg: Stelle sicher, dass deine Bank und dein Zahlungssystem auf dem modernsten Standard (ISO 20022) laufen — dann werden die meisten Pflichtfelder automatisch korrekt befüllt und weitergeleitet. Prüfe auch, ob deine Korrespondenzbanken (die Banken, über die internationale Zahlungen laufen) diesen Standard unterstützen.
risiken_experte: |
  • Zahlungsablehnung durch Empfänger-PSP: Wenn Auftraggeberdaten unvollständig sind, kann Empfänger-PSP Zahlung nach Art. 8 Abs. 4 TFR ablehnen oder zurückschicken — operative Unterbrechungen und Nachbearbeitung
  • Aufsichtssanktionen für Nicht-Compliance: BaFin kann gemäß § 62 ZAG Sanktionen verhängen; TFR-Verstöße sind gleichzeitig GwG-Verstöße (§ 67 GwG Bußgelder bis 5 Mio. EUR oder 10% Jahresumsatz)
  • Reputationsrisiko durch Krypto-Travel-Rule-Verstöße: CASPs die Travel Rule ignorieren, riskieren Lizenzentzug; für Traditional Finance relevant als Gegenpartei-Risiko
  • Datenpflege-Risiko in Kreditorenstammdaten: Fehlerhafte oder veraltete Adressdaten in SAP-Kreditorenstamm führen systematisch zu TFR-Pflichtfeldfehlern — regelmäßige Datenqualitätsprüfung notwendig
  • DSGVO-Drittstaaten-Konflikt: Pflicht, Beneficiary-Daten in Drittstaaten zu übermitteln (z. B. SWIFT-Routing über USA), kollidiert potentiell mit DSGVO — muss durch rechtliche Grundlage (Art. 23 Abs. 1 lit. d DSGVO) abgesichert sein
risiken_einsteiger: |
  Wenn die Pflichtangaben bei einer Überweisung fehlen, kann die Zahlung vom Empfänger abgelehnt werden — das kostet Zeit und Geld. Bei wiederholten Verstößen drohen Bußgelder. Für Krypto-Transfers ist die Gefahr noch größer: Wenn die Travel Rule nicht eingehalten wird, kann die Krypto-Lizenz entzogen werden.
---

# TFR / Travel Rule — Vertiefung

## Vergleich alte vs. neue TFR (EU 2015/847 → EU 2023/1113)

| Aspekt | VO (EU) 2015/847 (alt) | VO (EU) 2023/1113 (neu, ab 30.12.2024) |
|---|---|---|
| Anwendungsbereich | Geldtransfers über PSPs | Geldtransfers + Krypto-Asset-Transfers über CASPs |
| Bagatellgrenze Krypto | Nicht geregelt | Keine Bagatellgrenze — Travel Rule gilt für jeden Krypto-Transfer |
| Unhosted Wallets | Nicht geregelt | Erhöhte Prüfpflichten bei Transfers an/von unhosted wallets (Art. 17) |
| Sanktionen | Nach nationalem Recht | Harmonisierte Mindest-Sanktionen; NCA-Durchsetzung |
| Intermediär-Pflichten | Art. 11 (einfacher Durchleitungspflicht) | Art. 14–19 (präzisierte Weiterleitungspflicht mit Vollständigkeitsprüfung) |

## Pflichtfelder im Vergleich: SEPA vs. Cross-Border

### SEPA-Überweisung (pain.001 SEPA CT)
Laut TFR Art. 5 Abs. 1 (SEPA-Vereinfachung): Bei SEPA-Zahlungen innerhalb der EU reicht die Kontonummer (IBAN) des Auftraggebers — Name und Adresse können entfallen, wenn beide PSPs in der EU sind und Transaktion über SEPA-Rulebook läuft.

### Cross-Border-Überweisung (MT103 / pacs.008 non-SEPA)
Vollständige Daten nach Art. 4 Abs. 1 TFR erforderlich:
• Auftraggeber: Name (vollständig), Adresse oder Geburtsdatum oder Kundennummer, Kontonummer (IBAN oder sonstige eindeutige Kennung)
• Begünstigter: Name, Kontonummer

## IVMS101 — Datenstandard für Krypto Travel Rule

Der IVMS101 (interVASP Messaging Standard) ist das de-facto-Datenformat für die Übertragung von Travel-Rule-Daten zwischen CASPs:

1) Definiert von FATF-unterstützten Organisationen (Travel Rule Protocol, OpenVASP, TRISA)
2) JSON-basiertes Schema mit Pflichtfeldern für Originator und Beneficiary
3) Interoperabilität noch nicht vollständig — Sunrise-Issue: Nicht alle CASPs weltweit implementieren IVMS101 gleichzeitig

Für Unternehmen, die eigene Krypto-Wallets betreiben (z. B. für Stablecoin-Zahlungen an Lieferanten): Prüfen, ob eingesetzter CASP-Dienstleister IVMS101 unterstützt.
