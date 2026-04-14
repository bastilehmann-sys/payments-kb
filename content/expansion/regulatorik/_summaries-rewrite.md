## PSD2

- **Was:** Zweite EU-Zahlungsdiensterichtlinie (2015/2366) — öffnet Banken-APIs für lizenzierte Drittanbieter (TPP)
- **Für Sie:** Treasury- oder ERP-Software kann Kontostände automatisch abrufen und Zahlungen anstoßen, ohne manuelles Bank-Login
- **Pflicht:** Starke Kundenauthentifizierung SCA (Zwei-Faktor aus Wissen, Besitz, Inhärenz) bei jeder Online-Freigabe
- **Achtung:** B2B-Ausnahme von SCA muss schriftlich mit jeder Hausbank vereinbart werden, sonst scheitern Massenzahlungen

## PSD3

- **Was:** Geplanter Nachfolger von PSD2 (Entwurf 2023/0209) — erstmals als Verordnung, unmittelbar in allen EU-Staaten gültig
- **Frist:** Voraussichtliches Inkrafttreten 2026/2027, ohne nationale Umsetzung
- **Pflicht:** Verpflichtender IBAN-Name-Check (Confirmation of Payee) vor jeder Überweisung, Bank warnt bei Abweichung
- **Achtung:** Saubere Lieferantenstammdaten zwingend — abweichende Schreibweisen oder Konzernstrukturen führen zu Zahlungsverzögerungen
- **Wichtig:** SCA wird reformiert und Haftungsverteilung bei Betrugsfällen zwischen Bank und Kunde neu austariert

## SEPA-VO

- **Was:** SEPA-Verordnung (EU 260/2012) vereinheitlicht den innereuropäischen Euro-Zahlungsverkehr im XML-Standard ISO 20022
- **Für Sie:** In der gesamten Eurozone nur noch IBAN nötig, SAP erzeugt ein einziges Datenformat für Inland und Ausland
- **Pflicht:** Für Lastschriften gültiges SEPA-Mandat mit eindeutiger Mandatsreferenz, revisionssicher archiviert
- **Achtung:** Fehlt oder ist das Mandat unprüfbar, kann der Kunde die Lastschrift bis zu acht Wochen ohne Begründung zurückgeben

## SEPA-Instant-VO

- **Was:** EU 2024/886 verpflichtet alle Zahlungsdienstleister in der Eurozone zu 24/7-Echtzeitüberweisungen (SCT Inst) in unter 10 Sekunden
- **Für Sie:** Banken dürfen für Instant Payments keine höheren Gebühren verlangen als für normale SEPA-Überweisungen
- **Pflicht:** IBAN-Name-Check vor jeder Instant-Zahlung zur Vermeidung von Fehlüberweisungen
- **Achtung:** Instant Payments sind unwiderruflich — keine Rückholung möglich, saubere Freigabeprozesse und Dual-Control im ERP entscheidend

## AMLR

- **Was:** EU-Geldwäsche-Verordnung (EU 2024/1624) vereinheitlicht nationale AML-Gesetze und schafft mit AMLA erstmals direkte EU-Aufsicht
- **Frist:** Anwendbar ab 2027, Banken bereiten Prozesse bereits heute vor
- **Pflicht:** Einheitliche KYC-Anforderungen (Handelsregister, wirtschaftlich Berechtigte) und Transparenzregister-Einträge ab 25 % Anteil
- **Strafe:** Unvollständige Einträge führen zu Bußgeldern, Zahlungsblockaden oder Kündigung der Bankverbindung

## ISO 20022

- **Was:** Globaler XML-Nachrichtenstandard für Zahlungen, Kontoauszüge und Meldungen
- **Für Sie:** In der Praxis pain.001 (Überweisungsauftrag an Bank) und camt.053 (elektronischer Kontoauszug zurück ans ERP)
- **Status:** SWIFT-Migration abgeschlossen November 2025 — altes MT-Format abgeschaltet, auch international nur noch MX
- **Wichtig:** Bessere Reconcilement-Datenqualität, einheitlicher Remittance-Block, automatisierte Referenzverarbeitung statt Freitext-Parsing

## FATF-Empf.

- **Was:** Internationale Organisation, deren 40 Empfehlungen die weltweiten Mindeststandards gegen Geldwäsche und Terrorfinanzierung setzen
- **Für Sie:** Sämtliche nationalen AML-Gesetze (auch EU-Regeln) basieren darauf, Relevanz über Länder-Risikomatrix
- **Achtung:** Zahlungen in FATF-Hochrisiko-Jurisdiktionen werden verzögert, intensiv geprüft oder blockiert
- **Wichtig:** USD-Zahlungen laufen über US-Korrespondenzbanken, daher zusätzlich OFAC- und FinCEN-Filter, oft härter als EU-Banken

## EMIR

- **Was:** European Market Infrastructure Regulation (EU 648/2012, inkl. EMIR 3.0) regelt OTC-Derivate wie FX-Termine, Zins-Swaps, Commodity-Hedges
- **Pflicht:** Jeder Abschluss, jede Änderung und Beendigung binnen eines Handelstages an zugelassenes Transaktionsregister melden — auch bei reinen Sicherungsgeschäften
- **Achtung:** Ohne aktiven LEI (Legal Entity Identifier) schließt keine Bank mehr neue Absicherungsgeschäfte mit Ihnen ab
- **Wichtig:** Bei Überschreiten der Clearing-Schwellen greift zentrale Clearing-Pflicht mit deutlich höheren Margin-Anforderungen

## DORA

- **Was:** Digital Operational Resilience Act (EU 2022/2554) härtet Finanz-IT gegen Cyberangriffe und Ausfälle
- **Status:** Gilt seit 17. Januar 2025 für Finanzunternehmen — Industrie indirekt via vertragliche Weitergabe durch Banken und Softwareanbieter
- **Pflicht:** Dreistufige Meldekette für IKT-Vorfälle — Erstmeldung in 4 h, Zwischenbericht nach 72 h, Abschluss nach 1 Monat
- **Achtung:** IT-Verträge überarbeiten — Pflichtklauseln zu Audit-Rechten, Exit-Strategien, Sub-Auftragsvergabe und Verfügbarkeitszielen

## EPC-SEPA-2025

- **Was:** European Payments Council gibt die technischen Rulebooks für SCT, SCT Inst und SDD heraus
- **Status:** Aktuelle Fassung gilt seit November 2024 mit erweitertem UTF-8-Zeichensatz, präziseren R-Messages und neuen Instant-Payments-Feldern
- **Pflicht:** XML-Schemata und Validierungsregeln in Zahlungsdatei-Erzeugung oder Payment Factory auf neue Rulebook-Version aktualisieren
- **Achtung:** Veraltete Schemata führen zu bankseitigen Ablehnungen, fehlerhafte R-Message-Verarbeitung blockiert automatisiertes Reconcilement

## DSGVO-ZV

- **Was:** DSGVO (EU 2016/679) gilt auch im Zahlungsverkehr — IBAN, Verwendungszweck und Betrag sind personenbezogen, sobald natürlichen Personen zuordenbar
- **Geltung:** Betrifft alle B2C-Zahlungen sowie Einzelunternehmer als Lieferanten
- **Pflicht:** Abgestuftes Löschkonzept mit getrennten Fristen je Datenkategorie — Spannungsfeld 10 Jahre HGB/AO vs. DSGVO-Löschpflicht
- **Achtung:** Bei Drittlandstransfer (US-SaaS, SWIFT-Korrespondenten) EU-Standardvertragsklauseln und Transfer Impact Assessment erforderlich

## MiCA

- **Was:** Markets in Crypto-Assets Regulation (EU 2023/1114) — erster einheitlicher EU-Rechtsrahmen für Krypto-Assets und Stablecoins
- **Pflicht:** Krypto-Dienstleister (CASP) brauchen behördliche Zulassung, Stablecoin-Emittenten müssen Reserve- und Transparenzanforderungen erfüllen
- **Für Sie:** Relevant bei tokenisierten Zahlungen, digitaler Handelsfinanzierung oder Einbindung eines digitalen Euro ins Treasury
- **Achtung:** Ab 2025/2026 dürfen nicht-lizenzierte CASPs ihre Dienste in der EU nicht mehr anbieten — Dienstleister-Status heute prüfen

## TFR

- **Was:** Transfer of Funds Regulation (EU 2023/1113, „Travel Rule") — vollständige Absender- und Empfängerdaten bei jeder Überweisung
- **Geltung:** Seit Ende 2024 auch für Krypto-Transfers (Bitcoin, Stablecoins, Token) zwischen regulierten Anbietern
- **Achtung:** Unvollständig adressierte Zahlungen werden zurückgewiesen oder bis zur Klärung eingefroren — Liquiditätsrisiko im Ausland
- **Pflicht:** Lieferanten- und Kundenstammdaten vollständig pflegen, ERP muss alle Pflichtfelder sauber in pain.001 übergeben
