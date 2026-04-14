---
kuerzel: "PCI-DSS"
name: "Payment Card Industry Data Security Standard v4.0"
typ: "Industriestandard (vertraglich bindend via Card Network Operating Regulations)"
kategorie: "International / Kartenzahlung / IT-Security"
geltungsbereich: "weltweit; gilt für alle Merchants, Service Provider, Acquirer, Issuer und Dienstleister, die Kartendaten (Cardholder Data) speichern, verarbeiten oder übertragen — unabhängig von Transaktionsvolumen. Vertragliche Durchsetzung über die Card Networks (Visa, Mastercard, American Express, Discover, JCB) und deren Acquirer"
status_version: "PCI DSS v4.0 (31.03.2022), Errata v4.0.1 (06/2024)"
in_kraft_seit: "v1.0: 15.12.2004; v4.0: 31.03.2022 (Pflicht-Migration bis 31.03.2024, neue Anforderungen bis 31.03.2025)"
naechste_aenderung: "v4.0.1 Errata 06/2024; nächstes Major-Release voraussichtlich 2027-2028"
behoerde_link: "https://www.pcisecuritystandards.org/document_library/"
betroffene_abteilungen: "IT-Security, Treasury, E-Commerce, Retail/POS, HR (T&E-Karten), Legal, Compliance, Interne Revision"
beschreibung_experte: |
  PCI DSS v4.0 ist ein vom PCI Security Standards Council (gegründet 2006 von Visa, Mastercard, Amex, Discover, JCB) herausgegebener Industriestandard mit 12 Anforderungs-Domänen, gegliedert in 6 übergeordnete Goals: (1) Build and Maintain a Secure Network and Systems (Req. 1 Firewall/Network Security Controls, Req. 2 Secure Configurations), (2) Protect Account Data (Req. 3 Protect Stored Account Data, Req. 4 Protect Cardholder Data with Strong Cryptography in Transit), (3) Maintain a Vulnerability Management Program (Req. 5 Malware Protection, Req. 6 Develop/Maintain Secure Systems), (4) Implement Strong Access Control Measures (Req. 7 Role-based Access, Req. 8 User Identification/Authentication inkl. MFA, Req. 9 Physical Access), (5) Regularly Monitor and Test Networks (Req. 10 Logging/Audit Trails, Req. 11 Vulnerability Scans/Penetration Tests), (6) Maintain an Information Security Policy (Req. 12). Zentrale Datendefinition: Cardholder Data (CHD) = PAN (Primary Account Number), Cardholder Name, Service Code, Expiration Date; Sensitive Authentication Data (SAD) = CVV/CVC2/CVV2, PIN/PIN-Block, Magnetstreifen-/Chip-Track-Daten — SAD darf nach Autorisierung NIE gespeichert werden (Req. 3.3). Compliance-Levels Merchant: Level 1 (> 6 Mio. Visa/MC-Transaktionen p.a. oder bereits Breach) — jährliches On-Site-Audit durch QSA (Qualified Security Assessor), Report on Compliance (ROC), Attestation of Compliance (AOC), Quarterly Scan durch ASV (Approved Scanning Vendor); Level 2 (1-6 Mio.): SAQ oder ROC; Level 3 (20k-1 Mio. E-Commerce): SAQ; Level 4 (< 20k E-Commerce / < 1 Mio. Total): SAQ. v4.0-Neuerungen: Customized Approach (Risiko-basierte Alternativkontrollen zum Defined Approach), MFA-Pflicht für ALLE Admin-Zugriffe und alle Nicht-Konsolen-Zugänge zu CDE (Req. 8.4/8.5), Penetration Testing nach signifikanten Änderungen (Req. 11.4), Targeted Risk Analysis (Req. 12.3.1), erweiterte Phishing-Awareness (Req. 5.4.1), Anti-Skimming E-Commerce Payment Page Monitoring (Req. 6.4.3, 11.6.1). Scope-Reduktion via Tokenization (PAN ersetzt durch nicht-PAN-Token in Corporate-Systemen) und P2PE (Point-to-Point Encryption, Hardware-basierte Verschlüsselung vom POS bis zum Acquirer) — dann verbleibt nur die P2PE-Hardware im PCI-Scope.
beschreibung_einsteiger: |
  PCI-DSS ist ein weltweit geltender Sicherheitsstandard für alle Unternehmen, die Kreditkartendaten verarbeiten. Er wurde von den großen Kartenanbietern Visa, Mastercard, American Express, Discover und JCB gemeinsam entwickelt. Der Standard enthält 12 Anforderungsbereiche, die von Firewalls über Verschlüsselung und Zugriffskontrollen bis zur Sicherheitsrichtlinie reichen. Je nach Transaktionsvolumen gibt es vier Compliance-Stufen — vom großen Händler mit jährlichem Vor-Ort-Audit bis zum kleinen Online-Shop mit Selbstauskunft. Besonders streng ist der Umgang mit sogenannten "sensiblen Authentifizierungsdaten" wie CVV oder PIN, die nach der Zahlung niemals gespeichert werden dürfen. In der aktuellen Version 4.0 ist Multi-Faktor-Authentifizierung überall Pflicht, wo Admins auf Kartenumgebungen zugreifen. Für Industrieunternehmen ist das Thema relevant, sobald eigene Online-Shops, Werksverkauf, Outlet-Kassen oder Firmenkreditkarten für Mitarbeiter betrieben werden.
auswirkungen_experte: |
  1) Scope-Definition CDE (Cardholder Data Environment): Inventarisierung aller Systeme, die CHD speichern/verarbeiten/übertragen, inkl. "connected to" und "impacting"-Systeme; Network Segmentation als Scope-Reduzierungsmaßnahme (dokumentiert via Segmentation Testing Req. 11.4.6).
  2) Level-Einstufung je Acquirer bestätigen lassen (unterschiedliche Schwellen Visa vs. Mastercard beachten).
  3) Tokenization-Strategie implementieren: PAN nur im PSP-Vault, in SAP/ERP/CRM nur Token — dadurch Scope-Reduktion auf Tokenization-Integrationspunkte; bei Gateway-basiertem Hosted Payment Page zusätzlich SAQ A statt SAQ D.
  4) MFA-Rollout (Req. 8.4.2, deadline 31.03.2025): alle Nicht-Konsolen-Zugriffe in CDE und alle Admin-Zugriffe unternehmensweit; Ausnahme Service Accounts nur bei dokumentierten Kompensationskontrollen.
  5) Quarterly ASV Scans externer IPs und Penetration Tests (intern/extern jährlich + nach signifikanten Änderungen) beauftragen.
  6) E-Commerce Script-Integrity (Req. 6.4.3) und Change Detection auf Payment Pages (Req. 11.6.1) — Lösungen wie Human Security, Akamai Page Integrity, Jscrambler.
  7) Vendor-Due-Diligence: Written Agreements § 12.8, jährliche AOC-Einholung von allen TPSPs (Third-Party Service Providers).
auswirkungen_einsteiger: |
  Wenn das Unternehmen Kartendaten verarbeitet, müssen zuerst alle Systeme identifiziert werden, die mit diesen Daten in Berührung kommen. Ziel ist, diesen Bereich möglichst klein zu halten — zum Beispiel durch Tokenisierung (echte Kartennummer bleibt nur beim Zahlungsdienstleister, im eigenen System steht nur ein Ersatzwert). Ab 2025 müssen alle Admin-Zugänge zur Kartenumgebung mit Zwei-Faktor-Authentifizierung geschützt sein. Regelmäßige Sicherheitsscans und Penetrationstests sind Pflicht. Bei Webshops kommen neue Anforderungen hinzu, die Manipulationen an der Bezahlseite (z. B. eingeschleuster Skimmer-Code) erkennen sollen.
pflichtmassnahmen_experte: |
  • CDE-Scope-Dokument mit Datenflussdiagrammen (Req. 1.2.4, 12.5.2) — jährlich validieren
  • Information Security Policy (Req. 12.1) mit jährlichem Review und formaler Genehmigung durch Geschäftsleitung
  • Jährliches Risk Assessment / Targeted Risk Analysis (Req. 12.3)
  • Quarterly ASV Scans + jährliche interne/externe Penetration Tests (Req. 11.3, 11.4)
  • Strong Cryptography in Transit (Req. 4.2.1: TLS 1.2+ zwingend, TLS 1.0/1.1 verboten) und at Rest (Req. 3.5: PAN unlesbar via Strong Cryptography + Key Management Req. 3.6/3.7)
  • Key Management: Split Knowledge, Dual Control, jährlicher Key Rotation Review (Req. 3.7.4)
  • Centralised Logging mindestens 1 Jahr (3 Monate online verfügbar, Req. 10.5.1)
  • Incident Response Plan mit jährlichem Test (Req. 12.10)
  • Security Awareness Training für alle Mitarbeiter mindestens jährlich (Req. 12.6) — inkl. Phishing-Simulation
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Eine klare Liste aller Systeme erstellen, die Kartendaten sehen oder verarbeiten. 2) Mit dem Payment-Dienstleister (z. B. Stripe, Adyen, Worldpay) klären, ob man Tokenisierung nutzt — dann reduziert sich der Prüfumfang drastisch. 3) Zwei-Faktor-Authentifizierung für alle IT-Admins einrichten. 4) Einen externen Dienstleister (ASV) mit vierteljährlichen Sicherheitsscans beauftragen. 5) Jährlich einen Penetrationstest durchführen. 6) Jährliches Self-Assessment (SAQ) oder bei Level 1 ein Audit durch einen QSA einplanen.
best_practice_experte: |
  • Outsourcing der Karten-Akzeptanz an lizenzierte PSPs (Stripe, Adyen, Worldpay, Nexi) mit Tokenization / Hosted Checkout → SAQ A statt SAQ D (ca. 22 vs. 329 Kontrollen)
  • P2PE für physische POS-Terminals (PCI-listed P2PE Solution) — massive Scope-Reduktion Retail/Outlet
  • Network Segmentation mit Micro-Segmentation (z. B. Zero Trust via Illumio, Guardicore) — Scope auf CDE begrenzen
  • Vault-basierte Tokenization bei Multi-PSP-Strategie (z. B. Basis Theory, Very Good Security) für Portability
  • Concur / SAP T&E: Corporate-Cards via Issuer (Amex BTA, Visa IntelliLink) — Corporate trägt als Buyer meist Level-2/3-Verantwortung, Kartenanbieter trägt PAN-Verantwortung; Concur-Integration über Tokenized Expense Feeds
best_practice_einsteiger: |
  Die günstigste Compliance-Strategie ist, Kartendaten gar nicht erst selbst anzufassen. Alle großen Online-Zahlungsdienstleister bieten "Hosted Checkout"-Lösungen, bei denen die Bezahlseite vom Dienstleister betrieben wird — das Unternehmen sieht nie eine echte Kartennummer und muss nur einen sehr kurzen Selbstauskunfts-Fragebogen ausfüllen. Für Kassen im Werksverkauf gibt es vorzertifizierte P2PE-Terminals, die das Gleiche für den physischen Handel leisten.
risiken_experte: |
  • Vertragliche Geldbußen der Acquirer / Card Networks bei Non-Compliance: $5.000-$100.000 pro Monat bis zur Wiederherstellung (Visa Global Compromised Account Recovery, Mastercard ADC Program)
  • Data Breach Folgekosten: Forensic Investigation (PFI — PCI Forensic Investigator, ca. $50k-$200k), Card Reissuance $3-$5 pro Karte, Fraud Losses, Card Brand Fines $50-$90 pro kompromittiertem Datensatz
  • Verlust der Akzeptanzberechtigung: Acquirer kann Merchant Account kündigen — für E-Commerce/Retail existenzbedrohend
  • Class-Action Litigation (v. a. US-Jurisdiktion) — siehe Target Breach 2013 ($18,5 Mio. Settlement), Home Depot 2014 ($25 Mio.)
  • DSGVO-Parallele: Kartendaten = personenbezogene Daten → Art. 32 DSGVO "Sicherheit der Verarbeitung"; Breach-Meldung Art. 33/34 DSGVO zusätzlich zur PCI-Breach-Notification
  • Reputationsschaden und Kundenvertrauens-Verlust
risiken_einsteiger: |
  Ein Datenleck mit Kartendaten ist für ein Unternehmen extrem teuer — neben möglichen Vertragsstrafen der Kartenanbieter entstehen Kosten für forensische Untersuchung, Kartenneuausstellung und Schadensersatz für betroffene Kunden. In den USA sind Massenklagen üblich. Zusätzlich ist das Vorfall-Management nach DSGVO parallel Pflicht, da Kartendaten personenbezogene Daten sind. Im schlimmsten Fall kündigt der Acquirer den Vertrag und das Unternehmen kann keine Kartenzahlungen mehr annehmen.
verwandte_regulierungen: "DSGVO-ZV, NIS2, DORA, eIDAS-2"
sap_bezug: "SAP Commerce Cloud (eCommerce) mit PSP-Integration via Tokenization; SAP Concur (T&E) Corporate-Karten-Feed Token-basiert; SAP Customer Checkout (POS) mit P2PE-Hardware; SAP CRM/C4C für Callcenter-Zahlungen mit DTMF-Masking (Agent Assisted Payment); Payment-Service-Provider-Integration (Stripe, Adyen, Worldpay, PayPal) als PA-DSS/PCI-SSF-validierte Gateways — Tokens statt PAN in SAP-Stammdaten, dadurch ERP-Scope-Reduktion; SAP Information Lifecycle Management (ILM) für Retention-Policies; SAP Enterprise Threat Detection (ETD) für Req. 10 Logging"
bussgeld: "kein gesetzliches Bußgeld (kein EU-/DE-Gesetz); vertragliche Strafen Acquirer/Card Networks $5.000-$100.000/Monat bis Compliance-Wiederherstellung; bei Data Breach zusätzlich: Forensic-Audit-Kosten ~$50k-$200k, Card-Reissuance ~$5/Karte, Fraud Losses; Class-Action-Klagen (US); parallel DSGVO-Bußgeld bis 20 Mio. EUR oder 4 % Konzernumsatz"
pruefpflicht: "Level 1 (> 6 Mio. Transaktionen p.a.): jährliches On-Site-Audit durch QSA mit Report on Compliance (ROC) + Attestation of Compliance (AOC) + Quarterly ASV Scan; Level 2 (1-6 Mio.): SAQ D oder ROC, Quarterly ASV Scan; Level 3/4: passender SAQ (A, A-EP, B, B-IP, C, C-VT, D, P2PE) jährlich + Quarterly ASV Scan bei externen IPs; alle Level: jährliches internes + externes Penetration Testing bei SAQ D / ROC"
aufwand_tshirt: "L"
---

# PCI DSS v4.0 — Vertiefung: Scope-Reduktion und Corporate-Implementierung

## 12 Anforderungs-Domänen im Überblick

| # | Anforderung | Kern-Controls |
|---|---|---|
| 1 | Network Security Controls | Firewall/NSC-Regeln, DMZ-Segmentierung |
| 2 | Secure Configurations | CIS Benchmarks, Default-Passwörter ändern |
| 3 | Protect Stored Account Data | PAN-Masking, Strong Cryptography, kein SAD-Speichern |
| 4 | Strong Cryptography in Transit | TLS 1.2+, keine öffentlichen Netze unverschlüsselt |
| 5 | Protect Against Malicious Software | EDR, Anti-Malware, Anti-Phishing |
| 6 | Develop and Maintain Secure Systems | SDLC, Patch-Mgmt, WAF, Script-Integrity |
| 7 | Restrict Access by Business Need | RBAC, Least Privilege |
| 8 | Identify Users / Authenticate | Unique IDs, MFA (Req. 8.4 — deadline 31.03.2025) |
| 9 | Restrict Physical Access | Badge-Systeme, Media Destruction |
| 10 | Log and Monitor | Centralised Logging, 1 Jahr Retention |
| 11 | Test Security Regularly | ASV Scans, Pentests, Change Detection |
| 12 | Information Security Policy | Policy, Training, Incident Response |

## Compliance Levels Merchant

| Level | Transaktionen p.a. | Validation |
|---|---|---|
| 1 | > 6 Mio. Visa/MC oder Post-Breach | QSA On-Site Audit + ROC + AOC + ASV Scan |
| 2 | 1-6 Mio. | SAQ D oder freiwilliger ROC + ASV Scan |
| 3 | 20k-1 Mio. E-Commerce | SAQ + ASV Scan |
| 4 | < 20k E-Commerce / < 1 Mio. Total | SAQ + ASV Scan (bei externen IPs) |

## SAQ-Typen (Self-Assessment Questionnaire)

| SAQ | Anwendungsfall | Controls |
|---|---|---|
| A | E-Commerce vollständig outgesourct (Hosted Payment Page / Redirect) | ~22 |
| A-EP | E-Commerce mit eigenem Server (iFrame, Direct Post), kein PAN-Storage | ~152 |
| B | Imprint Machines / Standalone Dial-Out Terminals | ~41 |
| B-IP | Standalone IP-POS-Terminals | ~82 |
| C-VT | Virtual Terminal (Browser-basiert, kein PAN-Storage) | ~79 |
| C | Payment Applications mit Internet-Verbindung | ~161 |
| P2PE | Validated P2PE-Lösung aktiv genutzt | ~33 |
| D | Alle anderen Merchants + Service Provider | ~329 |

## SAP-Implementierung für Industrie-Corporate

1) **SAP Commerce Cloud (E-Commerce Webshop, Direktvertrieb)**: PSP-Integration ausschließlich über Tokenization (z. B. Adyen Drop-in, Stripe Elements als iFrame). PAN niemals im SAP-Backend; Scope = SAQ A oder A-EP.
2) **SAP Customer Checkout (POS, Werksverkauf/Outlet)**: Ausschließlich PCI-SSC-listed P2PE Solution (z. B. Ingenico Move/5000 mit Worldline P2PE, Verifone mit ADYEN P2PE). Scope = SAQ P2PE.
3) **SAP Concur (T&E)**: Kartenstamm im Issuer-Vault (Amex, Visa IntelliLink), Feed in Concur nur mit maskierter PAN (erste 6 + letzte 4) — PCI-Scope beim Issuer, nicht bei Corporate.
4) **Callcenter / Order-to-Cash**: DTMF-Masking-Lösungen (Semafone, PCI Pal, Sycurio) halten Agent außerhalb des CDE-Scope.
5) **SAP BC-SEC & Enterprise Threat Detection**: Req. 10 Logging / Req. 11.5 File-Integrity-Monitoring.
6) **Auslagerungsregister**: TPSP-Liste mit AOC-Datum pro Anbieter, Written Agreement § 12.8; parallel DORA-Art.-28-Register führen.

## Timeline v4.0

- 31.03.2022: v4.0 veröffentlicht
- 31.03.2024: v3.2.1 retired, v4.0 verpflichtend
- 31.03.2025: neue Anforderungen "Future-dated" werden Pflicht (u. a. MFA 8.4.2, Script-Integrity 6.4.3, Change Detection 11.6.1, Targeted Risk Analysis 12.3.1)
