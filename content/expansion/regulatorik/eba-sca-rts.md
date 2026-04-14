---
kuerzel: "EBA-SCA-RTS"
name: "Delegierte Verordnung (EU) 2018/389 — Regulatory Technical Standards zu Strong Customer Authentication und Common Secure Communication"
typ: "EU-Verordnung (delegierter Rechtsakt zu PSD2)"
kategorie: "EU / Zahlungsverkehr / Sicherheit"
geltungsbereich: "EU-weit; gilt für Zahlungsdienstleister (Kreditinstitute, Zahlungsinstitute, E-Geld-Institute) und Drittdienstleister (AISP, PISP, CBPII); mittelbar für Industrie-Corporates als Zahler bei Online-Banking, Firmenkartenzahlungen, EBICS-Zugängen und als Betreiber von Payment Factories mit dedizierten Treasury-Workflows (Corporate-Payment-Process-Ausnahme Art. 17)"
status_version: "Delegierte VO (EU) 2018/389 vom 27.11.2017; anwendbar seit 14.09.2019; ergänzt durch EBA-Opinions (EBA-Op-2018-04, EBA-Op-2019-06, EBA-Op-2020-10 — SCA-Migrationsfristen Kartenhandel); Überarbeitung im Rahmen PSD3/PSR erwartet"
in_kraft_seit: "14.09.2019"
naechste_aenderung: "PSD3/PSR (COM(2023) 366/367) bringt SCA-RTS-Nachfolger — voraussichtlich 2026–2027; EBA arbeitet an neuen RTS zu CSC/APIs und TRA"
behoerde_link: "https://www.eba.europa.eu/regulation-and-policy/payment-services-and-electronic-money/regulatory-technical-standards-on-strong-customer-authentication-and-secure-communication-under-psd2"
betroffene_abteilungen: "Treasury, IT-Security, Compliance, Corporate Card Management, Accounts Payable, Accounts Receivable"
beschreibung_experte: |
  Die Delegierte Verordnung (EU) 2018/389 konkretisiert Art. 98 PSD2 und ist seit dem 14.09.2019 anwendbar. Sie enthält zwei Regelungskomplexe: 1) Strong Customer Authentication (SCA) in Art. 1–18; 2) Common and Secure Communication (CSC) zwischen Kontoführenden PSPs (ASPSP) und Drittdiensten (TPP) in Art. 28–37. Kern der SCA ist die Zwei-Faktor-Authentifizierung aus mindestens zwei voneinander unabhängigen Elementen der Kategorien Wissen (Art. 6 — PIN, Passwort), Besitz (Art. 7 — Hardware-Token, App, SIM) und Inhärenz (Art. 8 — Fingerabdruck, Gesichtsscan); ein kompromittierter Faktor darf die Zuverlässigkeit der anderen nicht beeinträchtigen. Art. 5 verlangt Dynamic Linking: der Authentisierungscode ist spezifisch für Betrag und Empfänger-IBAN zu generieren — wichtig für Corporate-Massenzahlungsläufe. Die praktisch bedeutsamen Ausnahmen stehen in Art. 10–18: Art. 10 Kontoinformationen (SCA nur alle 180 Tage); Art. 11 Kontaktlose Niedrigbeträge an Terminals (≤ 50 EUR pro Transaktion, kumuliert ≤ 150 EUR oder 5 Transaktionen); Art. 12 Verkehrsmittel-Terminals (ÖPV, Parken); Art. 13 Vertrauenswürdige Begünstigte (Trusted-Beneficiary-Whitelist beim ASPSP); Art. 14 Wiederkehrende Transaktionen (Initial-Zahlung SCA, Folge-Zahlungen gleicher Betrag/Empfänger ohne); Art. 15 Überweisungen zwischen eigenen Konten desselben PSP; Art. 16 Niedrige Online-Beträge (≤ 30 EUR, kumuliert ≤ 100 EUR oder 5 Transaktionen); Art. 17 Sichere Corporate-Zahlungsverfahren (CoPP — Corporate Payment Processes); Art. 18 Transaktionsrisikoanalyse (TRA — Ausnahme abhängig vom Fraud-Rate-Cluster des PSP: 500/250/100 EUR bei 13/6/1 bps Fraud Rate). Für Corporate-Treasury ist Art. 17 der zentrale Hebel: dedizierte Treasury-Workflows über EBICS, SWIFT FIN/gpi, Host-to-Host-Kanäle können SCA-befreit werden, wenn eine schriftliche Vereinbarung mit dem ASPSP besteht und der PSP seinerseits ein gleichwertiges Sicherheitsniveau gewährleistet (FIN-Netzwerk, EBICS-T mit elektronischer Unterschrift EBICS-TS, mTLS-Zertifikate, HSM-gestützte qualifizierte elektronische Signaturen nach eIDAS). Der CSC-Teil (Art. 28–37) regelt die dedicated interface (XS2A-API) und ermöglicht seit September 2019 den standardisierten TPP-Zugriff; Standardisierung über Berlin Group NextGenPSD2, STET PSD2 API, OBIE UK (inzwischen nicht mehr EU-relevant); EBA-Working-Group-on-APIs publiziert klarstellende Positionen. Die SCA-Durchsetzung für Kartenhandel wurde durch nationale Aufsichtsbehörden phasenweise bis Ende 2021 migriert (EBA-Op-2019-06).
beschreibung_einsteiger: |
  Die EBA-SCA-RTS ist eine EU-Verordnung, die zur Zahlungsdiensterichtlinie PSD2 gehört. Sie verpflichtet Banken, bei Online-Zahlungen eine starke Authentifizierung zu verlangen — das heißt: zwei voneinander unabhängige Faktoren wie Passwort plus SMS-Code oder App-Bestätigung plus Fingerabdruck. Für Industrieunternehmen ist diese Verordnung aus zwei Gründen wichtig: 1) Beim täglichen Online-Banking und bei Firmenkarten gelten die Sicherheitsabfragen. 2) Für wiederkehrende Zahlläufe im Treasury (z. B. Lohnzahlung, Lieferantenzahlung über EBICS) gibt es die wichtige Ausnahme "Corporate Payment Processes" (Art. 17): Wenn die Bank schriftlich bestätigt, dass der Treasury-Workflow sicher genug ist (z. B. EBICS mit elektronischer Unterschrift und Hardware-Sicherheit), entfallen die ständigen Sicherheitsabfragen. Diese Vereinbarung mit jeder Hausbank einzeln treffen spart dem Treasury im Alltag viel Zeit. Aufsicht: EBA auf EU-Ebene, BaFin in Deutschland.
auswirkungen_experte: |
  1) Corporate-Payment-Process-Ausnahme (Art. 17) mit allen Hausbanken schriftlich vereinbaren: Scope-Definition je Zahlungskanal (EBICS-T/TS, SWIFT FIN, Host-to-Host); Nachweis gleichwertiger Sicherheitsmaßnahmen (mTLS, EBICS-elektronische-Signatur nach DFÜ-Abkommen, HSM, qualifizierte elektronische Signatur eIDAS).
  2) Dynamic Linking (Art. 5) in Massenzahlungsläufen: Bei DMEEX-/pain.001-basierten F110-Läufen kryptographische Bindung von Betrag + Empfänger-IBAN an Signatur; bei Mismatch Ablehnung durch Bank.
  3) SCA-fähige Benutzerrollen in SAP BCM / SAP Multi-Bank Connectivity: Zwei-Faktor-Auth bei Einzelfreigabe kritischer Zahlungen (Vier-Augen-Prinzip über 2FA); Integration Hardware-Token (Yubikey, SecurID) oder mobile Apps (PhotoTAN, ChipTAN).
  4) EBICS-Kanal-Strategie: EBICS-T (nur Transport) allein genügt nicht mehr; EBICS-TS mit Transport und Signatur ist Standard für Corporate-Zugang — Migration bei veralteten Bankverbindungen prüfen.
  5) Firmenkartenprogramme: 3DS2-Enrolment aller Firmenkarten; SCA-Exemption-Management durch Karten-Issuer (TRA, Trusted Beneficiary, wiederkehrende Transaktionen) beeinflusst Declined-Rate — mit Issuer verhandelbar.
  6) Trusted-Beneficiary-Whitelisting (Art. 13) für hochfrequent genutzte Empfänger (Steuerbehörden, Sozialversicherung, Konzern-Hausbanken) reduziert Interaktionsaufwand.
auswirkungen_einsteiger: |
  Im Alltag merkt man die Verordnung zuerst bei Online-Banking-Zugängen: Man braucht oft zusätzlich zum Passwort eine App-Bestätigung, eine TAN oder eine Chipkarte. Bei Firmenkarten im Internet-Kauf kommt fast immer eine Push-Nachricht auf das Handy des Karteninhabers. Für das Treasury ist die wichtigste Aktion, mit jeder Hausbank eine schriftliche Vereinbarung über "sichere Unternehmens-Zahlungsverfahren" (Art. 17) abzuschließen — damit laufen große Zahlläufe ohne ständige Sicherheitsabfragen durch. Ohne diese Vereinbarung müsste bei jedem einzelnen Zahlungs-Upload eine Authentifizierung erfolgen; das wäre im Alltag kaum praktikabel.
pflichtmassnahmen_experte: |
  • Art.-17-Rahmenvereinbarung mit jeder Hausbank: Schriftliches Dokument mit Scope (Kanäle, Benutzerkreis), Sicherheitsmaßnahmen-Nachweis, Incident-Response-Klausel; Review mind. alle 3 Jahre
  • EBICS-TS-Implementierung: Transport + Signatur, T/TS-Benutzer sauber trennen; DFÜ-Abkommen der Deutschen Kreditwirtschaft (aktuelle Version V3.x) als Grundlage
  • HSM-Anbindung: hardware-gestützte Schlüsselverwaltung nach FIPS 140-2 Level 3 oder Common Criteria EAL4+; Nutzung für qualifizierte elektronische Signaturen nach eIDAS-VO (EU) 910/2014
  • Vier-Augen-Prinzip digital: SAP BCM oder SAP MBC mit zwingender zweiter Freigabe durch technisch unabhängige Benutzerrolle; Audit-Trail revisionssicher
  • Dynamic-Linking-Konformität: End-to-End-Integrität pain.001 → ISO-20022-Signaturblock → Bank-Verarbeitung; Hash-Bindung Betrag + Empfänger
  • TRA-/Exemption-Monitoring Firmenkarten: mit Issuer jährlich Fraud-Rate und Exemption-Nutzung reviewen
  • Incident-Response: Meldepflichten bei Kompromittierung von Authentisierungsfaktoren nach § 54 ZAG (DE) innerhalb kurzer Frist an BaFin — bei Corporate als Geschädigter Awareness der Bank-Prozesse
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Mit jeder Hausbank eine schriftliche "Corporate Payment Process"-Vereinbarung nach Art. 17 abschließen — die Bank hat dafür meist ein Standardformular. 2) Den EBICS-Zugang auf die sicherere Variante mit elektronischer Signatur (EBICS-TS statt nur EBICS-T) umstellen. 3) Firmenkarten beim Kartenanbieter für 3D-Secure aktivieren, damit Online-Einkäufe funktionieren. 4) Vier-Augen-Prinzip in der Zahlungssoftware aktivieren — zwei Personen müssen jede große Zahlung freigeben, idealerweise mit Hardware-Token oder App. 5) Häufige Zahlungsempfänger (Finanzamt, Sozialversicherung, Konzerngesellschaften) bei den Banken als "vertrauenswürdige Empfänger" eintragen lassen.
best_practice_experte: |
  • Einheitlicher EBICS-Standard über alle Hausbanken: möglichst EBICS-TS V3.x, um hybride Infrastrukturen zu vermeiden; ein zentraler EBICS-Client (z. B. Business Integration Suite, TIS, Serrala) für alle Banken
  • DFÜ-Abkommen Anlage 1–3 im Treasury-Archiv als Referenz für Diskussionen mit IT-Security und Bank-Support
  • Key-Ceremony-Prozess dokumentiert: Initialisierung EBICS-Keys, INI-/HIA-Briefe mit qualifizierter elektronischer Signatur, sichere Schlüsselverwahrung im HSM
  • Single-Sign-On auf Hardware-Token oder FIDO2-Authentifikator für Treasury-Benutzer; keine shared credentials
  • Art.-17-Vereinbarung als Template für neue Bankbeziehungen — spart Wochen in Onboarding
  • Periodische Penetrationstests der Treasury-Zahlungskette (Treasury-Workstation → SAP → EBICS → Bank) im Rahmen DORA-Art.-24–26-Resilienztests
best_practice_einsteiger: |
  Einheitlichkeit spart am meisten Aufwand: Wenn alle Hausbanken denselben EBICS-Standard nutzen und dieselbe Treasury-Software verwendet wird, sinkt die Komplexität erheblich. Die Art.-17-Vereinbarung sollte bei jedem neuen Bankvertrag mitverhandelt werden — wer sie nachträglich aufsetzen muss, verliert oft Wochen. Hardware-Token (wie YubiKey) statt SMS-TAN sind sicherer und komfortabler.
risiken_experte: |
  • Ohne Art.-17-Vereinbarung: jede einzelne Zahlung im Online-Kanal SCA-pflichtig — Treasury-Alltag nicht umsetzbar; Workaround über Offline-Kanäle (papierhafte Eilüberweisungen) ineffizient und fehleranfällig
  • Kompromittierung EBICS-Schlüssel: Missbrauch zur Erstellung gültig signierter pain.001-Dateien möglich; Meldung nach § 54 ZAG, Reputations- und Vertrauensschaden
  • Dynamic-Linking-Fehler: manipulierte Payment-Files werden abgelehnt — operationelles Risiko bei zeitkritischen Zahlungen (Steuerzahlungen, Sozialversicherungsbeiträge mit Fristen)
  • Firmenkarten-Declines durch SCA-Fehlfunktion: Reise- und Beschaffungsprozesse können blockiert sein; Mitarbeitende sind unerreichbar für Push-Notifikationen im Ausland
  • Abhängigkeit vom Mobilgerät: SCA oft App-basiert — Geräteverlust oder Rufnummernmitnahme zu neuem SIM (SIM-Swap-Angriff) bedrohen operativen Treasury-Betrieb
  • PSD3/PSR-Transition-Risiko: ab 2026/2027 kommen neue Standards; frühzeitige Roadmap mit Banken klären
risiken_einsteiger: |
  Das größte Alltagsrisiko ist, dass Zahlungen blockiert werden: entweder weil die Art.-17-Vereinbarung fehlt und dauernd Authentifizierung nötig ist, oder weil der Hardware-Token, das Handy oder die App nicht verfügbar sind. Wenn Zahlungen mit Frist anstehen (Steuern, Sozialversicherung), kann das richtig teuer werden. Ein zweites Risiko: Wenn die EBICS-Schlüssel in falsche Hände geraten, kann jemand scheinbar legitime Zahlungen erzeugen — deshalb müssen diese Schlüssel besonders gut geschützt werden (Hardware-Tresore, Vier-Augen-Prinzip bei der Erstellung).
verwandte_regulierungen: "PSD2, PSD3/PSR, ZAG, DORA, DSGVO, eIDAS-VO, GwG"
sap_bezug: "SAP BCM (Bank Communication Management) — zentrale Freigabesteuerung mit Vier-Augen-Prinzip und 2FA; SAP Multi-Bank Connectivity (MBC) — gemanagte EBICS/SWIFT-Konnektivität inkl. HSM-Anbindung; EBICS-T/TS-Pi-Profile; Customizing FIBHA (Hausbanken) und FIBHU (Benutzer) für EBICS-User und Berechtigungen; Integration von Hardware-Token (Yubikey/FIDO2) und Mobile-Signatur (PhotoTAN); qualifizierte elektronische Signaturen nach eIDAS über HSM; DMEEX-/pain.001-Generierung mit ISO-20022-Signaturblock (XMLDSig) für Dynamic-Linking-Konformität"
bussgeld: "Über nationale PSD2-Umsetzung — DE: § 64 ZAG bis 5 Mio. EUR oder 10 % des jährlichen Gesamtumsatzes (juristische Personen); unerlaubte Zahlungsdienste § 63 ZAG: Freiheitsstrafe bis 5 Jahre; direkte Adressaten sind PSPs"
pruefpflicht: "Jährliches IT-Audit der SCA-Implementierung bei Zahlungsdienstleistern (§ 27 ZAG i.V.m. Prüfungsberichtsverordnung); Corporates: WP-Plausibilitätsprüfung der EBICS-Einrichtung im Rahmen Jahresabschluss und IKS-Prüfung; interne Revision der Art.-17-Vereinbarungen und Schlüsselverwaltung"
aufwand_tshirt: "M"
---

# EBA-SCA-RTS — Vertiefung: Corporate Payment Process Ausnahme (Art. 17)

## SCA-Faktoren und Ausnahmen

| Faktor / Ausnahme | Norm | Corporate-Relevanz |
|---|---|---|
| Wissen (PIN, Passwort) | Art. 6 | Basisfaktor Online-Banking |
| Besitz (App, Token, SIM) | Art. 7 | Hardware-Token für Treasury-Freigabe |
| Inhärenz (Biometrie) | Art. 8 | Mobile-App-Entsperrung |
| Dynamic Linking | Art. 5 | pain.001-Signaturbindung Betrag + IBAN |
| Kontoinformationen | Art. 10 | 180-Tage-Takt bei View-only-Zugängen |
| Kontaktlos ≤ 50 EUR | Art. 11 | Firmenkarten-Kleinbeträge |
| Trusted Beneficiaries | Art. 13 | Steuerbehörde, SV, Konzerngesellschaften |
| Wiederkehrend gleich | Art. 14 | Daueraufträge, Standardlöhne |
| Niedrige Beträge online ≤ 30 EUR | Art. 16 | Firmenkarten-Kleineinkäufe |
| **Corporate Payment Process** | **Art. 17** | **Kern-Ausnahme Treasury-Kanal** |
| TRA (Risikoanalyse) | Art. 18 | issuer-seitig, indirekt |

## Prüfpunkte-Tabelle (Corporate-Treasury-Praxis)

| Prüfpunkt | Norm | Frequenz | Verantwortung |
|---|---|---|---|
| Art.-17-Rahmenvereinbarung je Bank | Art. 17 | einmalig + Review 3-jährlich | Treasury / Legal |
| EBICS-TS statt -T | DFÜ V3.x | bei Bank-Onboarding | Treasury IT |
| HSM-Schlüsselverwaltung | eIDAS-VO | dauerhaft | IT-Security |
| Vier-Augen-Prinzip 2FA | Art. 4 + 17 | je Zahlungslauf | Treasury Ops |
| Trusted-Beneficiary-Liste | Art. 13 | halbjährlich | Treasury / AP |
| Firmenkarten 3DS2-Enrolment | Art. 5, 18 | bei Kartenausgabe | Card-Admin |
| Incident-Meldefähigkeit | § 54 ZAG | dauerhaft | IT-Security / Treasury |

## SAP-Treasury-Umsetzung

1) **SAP BCM**: zentrale Freigabe-Workflow-Steuerung; rollenbasiertes Vier-Augen-Prinzip (Ersteller / Freigeber); 2FA-Integration (HSM-gestützte Signatur)
2) **SAP MBC + EBICS**: Pi-Profile für EBICS-TS; Customizing FIBHA/FIBHU; Schlüsselinitialisierung (INI/HIA) revisionssicher
3) **pain.001 + XMLDSig**: ISO-20022-Signaturblock nach Berlin-Group-EBICS-Profil; Dynamic-Linking-konforme Hash-Bindung Betrag + Empfänger-IBAN
4) **eIDAS-Integration**: qualifizierte elektronische Signaturen über HSM (z. B. Utimaco, Thales); Vertrauensdiensteanbieter (TSP) aus EU-Trust-List
5) **Monitoring**: SIEM-Anbindung für Login-/Freigabe-Events; Anomalie-Erkennung bei außergewöhnlichen Zahlungsmustern
