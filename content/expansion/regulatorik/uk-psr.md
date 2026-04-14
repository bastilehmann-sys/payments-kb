---
kuerzel: "UK-PSR"
name: "UK Payment Services Regulations 2017 (SI 2017/752) + Payment Systems Regulator (PSR) Regulatorik post-Brexit"
typ: "UK Statutory Instrument (Onshoring der EU-PSD2)"
kategorie: "UK / Zahlungsverkehr (post-Brexit)"
geltungsbereich: "Vereinigtes Königreich (England, Wales, Schottland, Nordirland); gilt für UK-Zahlungsdienstleister, UK-Kreditinstitute, Electronic Money Institutions (EMIs) sowie mittelbar für DE-Industrie-Corporates mit UK-Entitäten, UK-Hausbankbeziehungen (Sterling-Konten) und Open-Banking-Nutzung"
status_version: "SI 2017/752 i. d. F. der Payment Services (Amendment) Regulations 2021 und 2023; APP Fraud Reimbursement Scheme PSR PS23/3 ab 07.10.2024"
in_kraft_seit: "13.01.2018 (PSR 2017); Onshoring 31.12.2020"
naechste_aenderung: "Future Regulatory Framework Review (FRF) — Reform 2025–2026; APP Fraud Reimbursement Scheme bereits seit 07.10.2024 in Kraft"
behoerde_link: "https://www.fca.org.uk/firms/payment-services-regulations"
betroffene_abteilungen: "Treasury, Legal, Compliance, Group Finance UK, IT/SAP BCM, Shared Service Center"
beschreibung_experte: |
  Die UK Payment Services Regulations 2017 (SI 2017/752) setzen die EU-PSD2 (RL (EU) 2015/2366) in britisches Recht um und wurden im Rahmen des EU Withdrawal Act 2018 per 31.12.2020 "onshored". Seither gelten UK-Spezifika, die zunehmend vom EU-Rechtsrahmen abweichen. Zuständige Aufsicht ist die Financial Conduct Authority (FCA); für die Aufsicht über Zahlungssysteme selbst (Faster Payments Scheme, BACS, CHAPS, LINK, Visa Europe, Mastercard Europe) ist der eigenständige Payment Systems Regulator (PSR) nach dem Financial Services (Banking Reform) Act 2013 zuständig. Open Banking UK ist seit 2018 für die CMA-9 (neun UK-Großbanken) verpflichtend und gilt als Vorreiter-Implementation; technisch basiert es auf dem Open Banking Standard (OBIE), nicht auf PSD2-RTS wie in der EU. Confirmation of Payee (CoP) ist seit Phase 2 (2024) für alle Faster-Payments-Teilnehmer verpflichtend — Begünstigten-Name-Match vor Zahlungsfreigabe. Faster Payments (FPS) läuft 24/7 in Realtime mit Limit derzeit GBP 1 Mio. pro Transaktion. Das APP Fraud Reimbursement Scheme (Authorised Push Payment) ist seit 07.10.2024 PSR-mandatorisch und weltweit einzigartig: Bei betrügerisch veranlassten Überweisungen bis GBP 85.000 wird der Geschädigte 50:50 zwischen sendender und empfangender Bank entschädigt (PSR Specific Direction SD20). Strong Customer Authentication folgt weitgehend der EU-RTS 2018/389, mit einigen UK-Abweichungen bei Dynamic Linking."
beschreibung_einsteiger: |
  Das UK-Zahlungsverkehrsrecht basiert im Kern noch auf der EU-Richtlinie PSD2, wurde aber nach dem Brexit in britisches Recht übernommen und entwickelt sich seither eigenständig weiter. Aufsicht ist die FCA. Für deutsche Unternehmen mit britischen Tochtergesellschaften oder Sterling-Konten sind vor allem drei Punkte wichtig: (1) Der britische Echtzeit-Zahlungsverkehr (Faster Payments) läuft rund um die Uhr und erfordert eine Anbindung an britische Banken. (2) Vor jeder Überweisung prüft die Bank automatisch, ob Empfängername und Kontonummer übereinstimmen (Confirmation of Payee). (3) Bei Betrugsfällen im UK-Zahlungsverkehr müssen die Banken den Schaden zu 50 % erstatten — das macht die Banken besonders kritisch bei Freigabe größerer oder ungewöhnlicher Überweisungen."
auswirkungen_experte: |
  1) Confirmation-of-Payee-Response-Handling: Beim Zahlungsausgang aus SAP via UK-Bank kommt ab 2024 ein CoP-Match/No-Match-Status zurück, der in pain.002 oder proprietären Response-Formaten abgebildet wird — Integration in SAP BCM Status-Workflow.
  2) Faster-Payments-Connectivity: UK-Echtzeit-Zahlungen erfordern H2H-Anbindung an UK-Hausbank oder SWIFT gpi; BACS-Format (3-Tage-Batch) weicht von SEPA ab und erfordert separates Customizing.
  3) Open Banking UK: Für AISP (Account Information) und PISP (Payment Initiation) werden FCA-akkreditierte TPPs eingesetzt (z. B. Token.io, TrueLayer, Yapily); jährlicher Vendor-Audit notwendig.
  4) APP Fraud Scheme: UK-Banken prüfen Zahlungen strenger, Treasury muss mit längeren Freigabezeiten bei atypischen Beträgen rechnen; interner Prozess für Rückfragen/Freigaben notwendig.
  5) SCA-UK-Spezifika: Dynamic Linking und 90-Tage-Reauthentifizierung etwas abweichend von EU — SAP Multi-Bank Connectivity Konfiguration prüfen.
  6) Divergenz EU-UK: Vereinzelte regulatorische Anpassungen (Smarter Regulatory Framework) führen langfristig zu doppelter Compliance-Pflicht bei EU+UK-Aktivitäten.
auswirkungen_einsteiger: |
  Wer Sterling-Konten oder eine britische Tochter betreibt, muss die Zahlungssoftware auf britische Besonderheiten vorbereiten: Echtzeit-Überweisungen laufen anders als SEPA, beim BACS-Format gibt es ein eigenes Dateiformat, und vor jeder Überweisung kommt eine automatische Namensprüfung zurück. Seit Oktober 2024 sind britische Banken bei Zahlungen besonders vorsichtig, weil sie bei Betrugsfällen 50 % des Schadens erstatten müssen — das kann dazu führen, dass Überweisungen für zusätzliche Prüfungen zurückgehalten werden. Open Banking im UK ist weit fortgeschritten und erlaubt automatisches Abrufen von Kontoinformationen, braucht aber einen zugelassenen britischen Dienstleister."
pflichtmassnahmen_experte: |
  • SAP BCM UK-Bank-Connector konfigurieren: BACS-XML, Faster Payments via H2H (Lloyds, Barclays, HSBC, NatWest) oder SWIFT FIN/FILEACT
  • CoP-Response-Handling im SAP F110-Nachlauf integrieren; Statusmapping pain.002 bzw. proprietäre Felder der UK-Banken
  • Open Banking TPP-Auswahl mit FCA-Register-Check; TPP-Vendor-Audit jährlich (SOC 2, ISO 27001, FCA-Status)
  • UK-spezifische SCA-Konfiguration in Treasury-Portalen (90-Tage-Reauthentifizierung, Dynamic Linking)
  • Interne Dokumentation APP-Fraud-Prozess: Rückfrageworkflow Hausbank → Treasury, Freigabeweg bei atypischen Zahlungen
  • Divergenz-Monitoring EU/UK: jährliche Rechts-Review auf neue UK-Abweichungen (z. B. durch HM Treasury, FCA CP)
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Zahlungssoftware und Hausbankverträge prüfen, ob sie BACS und Faster Payments korrekt abwickeln. 2) Die Namensprüfung (Confirmation of Payee) in den Zahlungsfreigabeprozess einbauen — bei No-Match muss jemand entscheiden, ob die Zahlung trotzdem ausgeführt wird. 3) Falls Open Banking genutzt werden soll: nur FCA-zugelassene Dienstleister beauftragen und jährlich prüfen. 4) Das Treasury-Team informieren, dass britische Zahlungen wegen des Betrugs-Schutzes häufiger nachgefragt werden können. 5) Einmal jährlich Rechtsberatung zu UK-Änderungen einholen, da EU und UK auseinanderdriften."
best_practice_experte: |
  • Nutzung eines UK-Cash-Management-Aggregators (z. B. TreasurUp, Kyriba, ION) statt direkte H2H-Anbindung — reduziert Onboarding- und Betriebsaufwand
  • CoP-No-Match-Workflow mit Vier-Augen-Prinzip in SAP BCM Approval-Path abbilden
  • Open Banking für Tages-Kontostandsabfragen statt MT940 — Realtime-Vorteil für UK-Cash-Pooling
  • Faster Payments nur für Beträge < GBP 250.000 nutzen, CHAPS für größere Beträge (RTGS, finalität am gleichen Tag)
  • Frühzeitige Einbindung der UK-Legal-Kanzlei (z. B. Slaughter and May, Linklaters UK) bei neuen FCA-Konsultationen
best_practice_einsteiger: |
  Statt jede UK-Bank einzeln anzubinden, lohnt sich ein zentraler Treasury-Aggregator — er spricht mit allen UK-Banken und bietet Open Banking gleich mit. Die automatische Namensprüfung sollte fest im Freigabeprozess verankert sein, sodass bei Abweichungen immer ein zweites Augenpaar entscheidet. Kleine Beträge gehen schnell über Faster Payments, größere Summen besser über CHAPS (das britische Realtime-Gross-Settlement-System)."
risiken_experte: |
  • FCA-Sanktionen unter FSMA 2000 § 66: theoretisch unbegrenzte Geldbußen; aktuelle FCA-Settlements mit PSPs über GBP 100 Mio.
  • PSR 2017 Schedule 6: civil penalties unbegrenzt
  • APP-Fraud-Scheme: Reputationsrisiko und Haftung der empfangenden Bank bei Durchleitung betrügerischer Gelder — kann sich auf Corporate-Konto auswirken
  • CoP-No-Match ignoriert: Bei Betrugsfall trägt der Zahler die volle Last, wenn die Warnung dokumentiert übergangen wurde
  • Divergenz-Risiko EU/UK: unterschiedliche Anforderungen an SCA, Datenflüsse, Open Banking Standards
  • Brexit-Folgen: Fehlende Passporting-Rechte für EU-PSPs im UK — DE-Tochter-PSP kann UK-Kunden nicht ohne UK-Lizenz bedienen
  • Betriebsrisiko bei TPP-Ausfall: abhängig von FCA-regulierten Drittanbietern
risiken_einsteiger: |
  Die britische Aufsicht FCA kann praktisch unbegrenzte Bußgelder verhängen. Für deutsche Unternehmen ist wichtiger: Wenn die Namensprüfung (CoP) eine Warnung ausgibt und die Zahlung trotzdem freigegeben wird, trägt das Unternehmen bei Betrug den Schaden allein. Außerdem entfernt sich das britische Recht immer weiter vom europäischen — was heute noch funktioniert, kann morgen geändert sein. Für britische Kunden kann eine deutsche Gesellschaft nicht einfach mehr Zahlungsdienste anbieten — dafür wäre eine eigene UK-Lizenz nötig."
verwandte_regulierungen: "PSD2, PSD3, EBA-SCA-RTS, DORA, UK-MLR 2017, UK-FSMA 2000"
sap_bezug: "SAP BCM UK-Bank-Connector (BACS XML Standard 18, Faster Payments via H2H oder SWIFT FIN/FILEACT); CoP-Response-Handling in pain.002 bzw. proprietären Feldern der UK-Banken (Customizing BCM Status-Mapping); SAP Multi-Bank Connectivity (MBC) mit FCA-akkreditierten Aggregatoren wie Token.io, TrueLayer, Yapily für Open Banking UK; SAP FI-BL Customizing OT83/FIBHS für UK-Hausbank-Stammdaten (sort code, account number statt IBAN)"
bussgeld: "FCA-Sanktionen unter FSMA 2000 § 66 theoretisch unbegrenzt; PSR 2017 Schedule 6 civil penalties unbegrenzt; aktuelle FCA-Settlements mit PSPs > GBP 100 Mio. (z. B. Santander UK 2022: GBP 107,8 Mio.); APP-Fraud-Scheme: 50 % Haftung der beteiligten Banken bis GBP 85.000 pro Fall"
pruefpflicht: "Bei FCA-regulierten Firmen jährliche ARROW-/AUP-Prüfung; Corporate-seitig bei Open-Banking-Nutzung jährlicher TPP-Vendor-Audit (SOC 2 Type II, FCA-Register-Check); für UK-Tochter ohne Lizenz Plausibilitätsprüfung im Rahmen Jahresabschluss"
aufwand_tshirt: "M"
---

# UK-PSR — Vertiefung: Post-Brexit-Zahlungsverkehr und APP Fraud Scheme

## UK-Zahlungssysteme im Überblick

| System | Typ | Limit | Settlement |
|---|---|---|---|
| BACS | Batch (3-Tage-Zyklus) | kein praktisches Limit | D+3 |
| Faster Payments (FPS) | Realtime 24/7 | GBP 1 Mio. | Sekunden |
| CHAPS | RTGS | unbegrenzt | Same day |
| LINK | ATM-Netzwerk | — | — |

## APP Fraud Reimbursement Scheme (seit 07.10.2024)

1) **Scope**: alle Faster-Payments-Zahlungen bis GBP 85.000 pro Fall
2) **Haftung**: 50 % sendende Bank, 50 % empfangende Bank
3) **Ausnahmen**: grobe Fahrlässigkeit des Opfers (eng auszulegen), First-Party-Fraud
4) **Corporate-Impact**: verschärfte Due-Diligence bei atypischen Empfängern, potentiell längere Freigabezeiten

## SAP-Umsetzung

1) **SAP BCM**: UK-Bank-Connector mit BACS-Standard-18-Format; Faster Payments via H2H oder SWIFT gpi.
2) **CoP-Integration**: Response-Mapping in BCM Status-Cockpit; Vier-Augen-Workflow bei No-Match.
3) **Open Banking**: Anbindung über FCA-akkreditierten TPP; jährlicher Vendor-Audit im Auslagerungsregister dokumentieren.
