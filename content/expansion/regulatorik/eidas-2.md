---
kuerzel: "eIDAS-2"
name: "Verordnung (EU) 2024/1183 — Europäischer Rahmen für eine digitale Identität (eIDAS 2.0)"
typ: "EU-Verordnung (Novellierung VO 910/2014)"
kategorie: "EU / Digitale Identität / E-Signaturen"
geltungsbereich: "alle EU-Mitgliedsstaaten, unmittelbar anwendbar (Verordnung, keine nationale Umsetzung erforderlich); betrifft Vertrauensdiensteanbieter (TSP), alle juristischen und natürlichen Personen als Nutzer von Vertrauensdiensten, sowie relying parties (akzeptierende Stellen)"
status_version: "VO (EU) 2024/1183 vom 11.04.2024, in Kraft 20.05.2024; Architecture Reference Framework (ARF) v1.4"
in_kraft_seit: "20.05.2024 (Verordnung); EUDI Wallet Pflicht-Bereitstellung Mitgliedsstaaten ab 2026"
naechste_aenderung: "Architecture Reference Framework (ARF) v1.4 06/2024; Implementing Acts in Vorbereitung; Wallets verfügbar ab 2026"
behoerde_link: "https://digital-strategy.ec.europa.eu/en/policies/eudi-wallet"
betroffene_abteilungen: "IT, Legal, Compliance, Treasury, Einkauf, HR, Vertrieb, Rechnungswesen (e-Invoicing)"
beschreibung_experte: |
  Die Verordnung (EU) 2024/1183 (eIDAS 2.0) novelliert die Verordnung (EU) 910/2014 grundlegend und schafft den Rechtsrahmen für eine unionsweite European Digital Identity Wallet (EUDI Wallet, Art. 5a ff.). Jeder Mitgliedsstaat ist verpflichtet, bis 2026 mindestens eine konforme Wallet bereitzustellen, die durch relying parties in der gesamten Union akzeptiert werden muss (Art. 5b). Kernbestandteile: (1) EUDI Wallet (Art. 5a-5f): mobile Anwendung zur Speicherung und Präsentation von Personen-Identifikationsdaten (PID), Electronic Attestations of Attributes (EAA) und qualifizierten Attestierungen (QEAA); (2) Qualifizierte Elektronische Signatur QES (Art. 25-34): mit handschriftlicher Unterschrift rechtlich gleichgestellt (Art. 25 Abs. 2); (3) Qualifiziertes Elektronisches Siegel QSeal (Art. 35-40): für juristische Personen, Integritäts- und Ursprungsnachweis z. B. für e-Rechnungen und Massendokumente; (4) Qualifizierter Zeitstempel QTSP-TS (Art. 41-42); (5) Qualifizierter Einschreib-Zustelldienst (Art. 43-44); (6) Qualifiziertes Webseiten-Authentifizierungszertifikat QWAC (Art. 45); (7) Notifizierte eID-Schemes (Art. 9 — z. B. deutsche AusweisApp/Online-Ausweisfunktion Personalausweis); (8) neu in eIDAS 2.0: Qualified Electronic Ledger (Art. 45h-45l) für nachweisgebundene Datenbankeinträge. Vertrauensdiensteanbieter (Trust Service Providers, TSP) unterliegen einem strengen Zulassungsregime (Art. 17 ff.) mit jährlicher Konformitätsbewertung durch akkreditierte Stellen (Conformity Assessment Bodies, CAB). EU-Trust-List (Art. 22) führt alle QTSPs zentral; jede Signatur-/Siegel-Validierung muss gegen die aktuelle Trust List laufen. Für Corporates: Pflicht-Akzeptanz der EUDI Wallet als "Very Large Online Platform" (VLOP) gemäß DSA; für Banken und Zahlungsdienstleister (PSD2/PSD3) Akzeptanz für SCA und Onboarding (Art. 5b Abs. 2).
beschreibung_einsteiger: |
  Die eIDAS-Verordnung regelt auf EU-Ebene, wie elektronische Identitäten, Unterschriften und Siegel funktionieren und rechtlich anerkannt werden. Mit der Version 2.0 wird eine europäische digitale Brieftasche (EUDI Wallet) eingeführt, die jeder EU-Bürger ab 2026 auf dem Smartphone nutzen kann. In dieser Brieftasche lassen sich Personalausweis, Führerschein, Diplome, Bankdaten und vieles mehr sicher speichern. Unternehmen müssen diese Wallet akzeptieren, wenn sie digitale Identifikation anbieten — zum Beispiel beim Kundenonboarding oder im Online-Banking. Außerdem regelt eIDAS die qualifizierte elektronische Unterschrift, die rechtlich einer handschriftlichen Unterschrift gleichgestellt ist, sowie das elektronische Siegel für Firmen, mit dem zum Beispiel Rechnungen oder Zeugnisse verbindlich "abgestempelt" werden können.
auswirkungen_experte: |
  1) Pflicht-Akzeptanz EUDI Wallet ab 2026/2027 (Art. 5b Abs. 2): Banken, Telekoms, Energieversorger, große Online-Plattformen, öffentliche Dienste müssen Wallet-basierte Authentifizierung und Attestierungspräsentation akzeptieren.
  2) KYC/AML-Onboarding: § 12 Abs. 1 Nr. 2 GwG i.V.m. eIDAS → notifiziertes eID-Schema (z. B. EUDI Wallet High) als gleichwertiger Identifikationsweg zum Video-Ident.
  3) QSeal-Einführung für Massendokumente: Rechnungen, Lieferscheine, Zeugnisse, Produktpässe — GoBD-konforme Archivierung i.V.m. § 14 UStG (e-Rechnungspflicht B2B ab 01.01.2025 in DE).
  4) QWAC-Zertifikate: PSD2-RTS-Pflicht für API-Kommunikation Banken/TPPs wird unter PSD3 voraussichtlich abgeschafft (EBA-Empfehlung) — laufende Zertifikate noch gültig.
  5) Corporate-Wallet (Art. 5a Abs. 5): juristische Personen können Unternehmens-Wallet nutzen — Ausweisfunktion Firmen-eID, QSeal-Schlüssel-Management, Mitarbeiter-Delegation.
  6) Rechtsverbindlichkeit grenzüberschreitend: Art. 25 Abs. 3 — QES aus einem Mitgliedsstaat wird in allen anderen anerkannt.
auswirkungen_einsteiger: |
  Für Unternehmen heißt das: Wer heute Kunden oder Mitarbeiter digital identifiziert, muss die neue EU-Wallet als zusätzlichen Weg anbieten. Firmen sollten prüfen, wo sie elektronische Signaturen einsetzen — bei Arbeitsverträgen, Kundenverträgen, Einkaufsverträgen — und ob die eingesetzte Lösung (Adobe Sign, DocuSign, Skribble) QES-fähig ist. Für Rechnungen lohnt sich ein elektronisches Firmensiegel (QSeal), das Echtheit und Herkunft nachweist — besonders im B2B-Bereich, wo ab 2025 in Deutschland die E-Rechnung Pflicht ist.
pflichtmassnahmen_experte: |
  • Wallet-Akzeptanz-Roadmap: API-Integration in Customer Portals / Onboarding-Flows (OpenID4VC, OpenID4VP, ISO/IEC 18013-5/7)
  • Identifizierung aller Signatur-Use-Cases und Upgrade auf QES wo rechtlich erforderlich (§ 126a BGB Schriftform-Ersatz)
  • QSeal-Implementierung für e-Invoicing (PEPPOL/EN 16931/ZUGFeRD/XRechnung) — Integration in SAP DRC
  • EU Trust List Validation in allen Validierungs-Workflows (ETSI EN 319 102-1)
  • TSP-Auswahl: Zertifiziert nach ETSI EN 319 401 / ETSI EN 319 411-2; zugelassen durch BNetzA (DE) oder nationale Aufsicht
  • Datenschutz-Folgenabschätzung (DSFA) nach Art. 35 DSGVO für Wallet-Nutzung (Selective Disclosure, Zero Knowledge Proofs)
  • Delegations- und Mandats-Management bei Corporate-Wallet (Art. 5a Abs. 5)
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Aufstellung aller Prozesse mit elektronischer Unterschrift oder Identifikation machen. 2) Prüfen, welche davon "qualifiziert" sein müssen (z. B. unbefristete Arbeitsverträge, Kündigungen, Immobilienkäufe nicht — aber hohe Vertragsvolumina ja). 3) Signatur-Dienstleister wählen, der in der EU-Trust-List steht. 4) Für Rechnungen prüfen, ob ein Firmensiegel (QSeal) sinnvoll ist. 5) Im Online-Kundenportal vorbereiten, dass ab 2026 Kunden sich mit der EU-Wallet anmelden können.
best_practice_experte: |
  • Signatur-Trust-Services via SAP BTP Document Information Extraction + Digital Signature Service (DSS); Integration Adobe Acrobat Sign / DocuSign EU / Skribble / d-trust sign-me
  • QSeal über HSM-basiertes Schlüssel-Management (z. B. Utimaco CryptoServer, Thales Luna) oder Remote-QSeal-Cloud (D-Trust, Swisscom, InfoCert)
  • e-Rechnung DE: XRechnung/ZUGFeRD 2.3 mit optionalem QSeal; Archivierung gemäß GoBD 10 Jahre revisionssicher in SAP DRC oder d.velop
  • EUDI Wallet Pilot teilnehmen (Large Scale Pilots POTENTIAL, EWC, NOBID, DC4EU) für frühe API-Integration
  • Validation-as-a-Service: kommerzielle Validatoren (cryptovision, intarsys, Entrust) — immer gegen aktuelle EU Trust List
best_practice_einsteiger: |
  Wer heute neue Signatur-Lösungen einführt, sollte nur Anbieter wählen, die in der EU-Trust-List stehen — damit sind Unterschriften automatisch EU-weit rechtsgültig. Für die spätere Wallet-Integration lohnt es sich, bereits jetzt in den Pilotprojekten mitzumachen, um frühzeitig Erfahrung mit der Technik zu sammeln. Firmen mit vielen Ausgangsrechnungen sparen durch das elektronische Firmensiegel viel Aufwand bei der rechtssicheren Zustellung.
risiken_experte: |
  • Non-Akzeptanz EUDI Wallet nach 2026/2027: Vertragsverletzungsverfahren der EU-Kommission gegen den Mitgliedsstaat (keine direkten Unternehmensbußgelder, aber nationale Durchsetzung)
  • TSP-Kompromittierung: Widerruf Zertifikate, Pflicht zur Re-Signatur laufender Dokumente
  • Rechtsunsicherheit bei nicht-QES-Signaturen in formpflichtigen Geschäften (§ 126a BGB) — Zivilrechtliche Nichtigkeit
  • Datenschutzrisiken bei Over-Disclosure (DSGVO Art. 5 Datenminimierung) — Wallet muss Selective Disclosure unterstützen
  • Fälschungsrisiko bei Nicht-Validierung: Bei Rechnungseingang ohne QSeal-Verifikation drohen UStG-§-14-Probleme (Vorsteuerabzug)
risiken_einsteiger: |
  Wer elektronische Unterschriften nutzt, ohne auf die richtige Qualität zu achten, riskiert dass Verträge im Streitfall nicht anerkannt werden — besonders bei gesetzlich vorgeschriebener Schriftform. Beim Rechnungseingang kann fehlende Echtheits-Prüfung dazu führen, dass das Finanzamt die Vorsteuer nicht anerkennt. Nach 2026 drohen Unternehmen, die die EU-Wallet nicht akzeptieren, Imageverluste und im schlimmsten Fall nationale Sanktionen nach dem Vertrauensdienstegesetz.
verwandte_regulierungen: "DSGVO-ZV, NIS2, PSD3, EBA-SCA-RTS"
sap_bezug: "SAP Document and Reporting Compliance (DRC) für e-Invoicing mit QSeal-Integration; SAP Digital Signature Service (DSS) über SAP BTP; SAP Identity Authentication Service (IAS) für EUDI-Wallet-basiertes Login (OpenID Connect, OID4VC); SAP SuccessFactors Onboarding mit eID-Identifikation; SAP Ariba für QES-signierte Einkaufsverträge; SAP S/4HANA e-Rechnung (XRechnung/ZUGFeRD/PEPPOL) mit QSeal via DRC"
bussgeld: "national unterschiedlich; DE — Vertrauensdienstegesetz (VDG) § 17: bis 500.000 EUR bei Verstößen von TSPs; EU-Wallet-Verfügbarkeitspflicht: Vertragsverletzungsverfahren gegen Mitgliedsstaaten, nicht direkt gegen Unternehmen; zusätzlich DSGVO-Bußgelder bei Datenschutzverstößen im Wallet-Kontext"
pruefpflicht: "TSP-seitig: jährliche Konformitätsbewertung (Conformity Assessment) durch akkreditierte Conformity Assessment Body (CAB) nach ETSI EN 319 403; Aufsicht in DE durch BNetzA; Corporate-seitig: keine direkte Prüfpflicht, aber Validität-Check QES/QSeal in Document-Management zwingend (z. B. EU Trust List Validation via Adobe Acrobat Reader, cryptovision, intarsys); interne Revision sollte Signatur-Prozesse jährlich prüfen"
aufwand_tshirt: "M"
---

# eIDAS 2.0 — Vertiefung: EUDI Wallet und Vertrauensdienste für Corporates

## Kategorien Vertrauensdienste (Art. 3 eIDAS)

| Dienst | Qualifiziertes Pendant | Rechtswirkung |
|---|---|---|
| Electronic Signature (EES) | QES (Art. 25) | QES = handschriftliche Unterschrift (Art. 25 Abs. 2) |
| Electronic Seal | QSeal (Art. 35) | Juristische Person; Integrität + Ursprung (Art. 35 Abs. 2) |
| Electronic Time Stamp | QTS (Art. 41) | Vermutungswirkung Zeitpunkt/Integrität |
| Electronic Registered Delivery | QERDS (Art. 43) | Vermutung Integrität, Sender, Empfänger, Zeitpunkt |
| Website Authentication | QWAC (Art. 45) | Bindung Domain ↔ juristische Person |
| Electronic Attestation of Attributes | QEAA (Art. 45a-45f, neu) | Qualifizierte Nachweise in Wallet |
| Electronic Ledger | QEL (Art. 45h-45l, neu) | Integrität sequentieller Datensätze |

## Signatur-Level (§ 126a BGB / Art. 3 eIDAS)

| Level | Anforderung | Anwendung |
|---|---|---|
| EES | einfache Signatur | unformale Zustimmung |
| AES | Fortgeschrittene el. Signatur | identifizierbar, integritätsgeschützt, Signaturschlüsselkontrolle |
| QES | Qualifizierte el. Signatur mit qualifiziertem Zertifikat auf QSCD | Schriftformersatz § 126a BGB |

## EUDI Wallet — Architektur-Komponenten (ARF)

1) **Wallet Instance**: App auf Smartphone des Nutzers (Android/iOS)
2) **Wallet Provider**: vom Mitgliedsstaat notifiziert
3) **PID Provider**: stellt Personen-Identifikationsdaten aus (in DE voraussichtlich BMI / Personalausweis)
4) **QEAA Provider**: stellt qualifizierte Attestierungen aus (Bank, Hochschule, Arbeitgeber etc.)
5) **Relying Party**: akzeptierende Stelle (Bank, Shop, Behörde) — Registrierung verpflichtend
6) **Trust Registry**: EU Trust List + nationale Listen

## SAP-Implementierung

1) **SAP DRC (Document and Reporting Compliance)**: e-Invoicing XRechnung/ZUGFeRD + automatisches QSeal über DSS-Integration
2) **SAP IAS (Identity Authentication Service)**: OpenID Connect Federation mit EUDI Wallet Verifier (OID4VP) für Login in S/4HANA, SuccessFactors, Ariba
3) **SAP Ariba Contract Management**: QES-Flow via Adobe Sign / DocuSign EU / Skribble Integration
4) **SAP SuccessFactors Onboarding**: eID-Identifikation Mitarbeiter via AusweisApp oder zukünftig EUDI Wallet
5) **SAP BTP HSM-Service**: QSeal-Schlüssel-Hosting für Massenrechnungs-Siegelung

## Timeline

- 20.05.2024: VO (EU) 2024/1183 in Kraft
- 06-11/2024: Implementing Acts
- 2025: finale Architecture Reference Framework (ARF) v2.0
- 2026: Pflicht-Bereitstellung EUDI Wallet durch Mitgliedsstaaten
- 2027: Pflicht-Akzeptanz durch definierte relying parties (Art. 5b Abs. 2)
