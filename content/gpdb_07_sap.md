# SAP Treasury — Produktroadmap & Implementierung

Überblick über SAP-relevante Payment-Releases und typische Implementierungspfade für SAP Treasury/Payments-Projekte.

## produktroadmap

### Überblick

Die SAP-Produktroadmap für Payment-relevante Module zeigt geplante und verfügbare Features in S/4HANA, BCM, PAYM und MBC.

### S/4HANA 2025 — BCM Enhancement

EBICS 3.0 wird nativ unterstützt. Erweiterte pain.001 v09 Unterstützung. ISO 20022 MX Ready Certification für alle relevanten Module.

### SAP MBC 2.0 — Multi-Bank Connectivity

Neue Bank-Konnektoren für weitere europäische Banken. SWIFT gpi Integration für Echtzeit-Statustracking. Verbessertes Monitoring-Dashboard in BTP.

### PAYM Next-Gen (geplant 2027+)

Vollständige ISO 20022 Migration aller Zahlungsformate. ERP Payments Harmonisierung zwischen S/4HANA und ECC-Nachfolger. Vereinfachte BCM-Konfiguration durch geführte Einrichtungsassistenten.

## phase-1-blueprint

### Phase 1: Blueprint

Ziel: Vollständiges Verständnis der Ist-Situation und Anforderungen.

Aktivitäten:
- Bankenlandschaft aufnehmen: Welche Banken, welche Konten, welche Währungen?
- Zahlungsformate ermitteln: Welche Formate erwartet jede Bank (pain.001 v3/v9, MT101, proprietär)?
- Clearing-Wege analysieren: SEPA, SWIFT, lokale Systeme
- IHB/POBO-Anforderungen prüfen: Rechtliche Freigaben, lokale Restriktionen
- Verbindungsprotokoll je Bank festlegen: EBICS, H2H, MBC, SWIFT

Typische Dauer: 2–4 Wochen. Wichtigstes Dokument: Banken-Konnektivitätsmatrix.

## phase-2-connectivity

### Phase 2: Connectivity

Ziel: Technische Verbindung zu allen Banken aufgebaut und getestet.

Aktivitäten:
- EBICS: Bankschlüssel initialisieren, Zertifikate einreichen, Ini-Schreiben
- H2H: SFTP-Zugangsdaten beschaffen, Verbindungstest, Dateinamenkonventionen klären
- MBC: BTP-Konfiguration, Cloud Connector, Bankportale einrichten
- SAP BCM: Kommunikationskanäle anlegen (FI12), Zahlungsprogramm konfigurieren
- Banktest-Umgebungen nutzen — nicht direkt in Produktion testen

Typische Dauer: 3–6 Wochen. Häufiger Blocker: Banken-Ansprechpartner zu langsam.

## phase-3-formate

### Phase 3: Formate

Ziel: Alle Zahlungsformate korrekt konfiguriert und validiert.

Aktivitäten:
- DMEE/DMEEX-Bäume anlegen oder importieren
- pain.001 Version je Bank festlegen (v3, v8, v9 — prüfen per Bankspezifikation)
- Zahlungsträger und Zahlwege in SAP konfigurieren (FBZP)
- Formatvalidierung mit echten Testdaten

Typische Dauer: 4–8 Wochen. Aufwand stark abhängig von Anzahl Banken und Formatkomplexität.

## phase-4-test

### Phase 4: Test

Ziel: Alle Zahlungstypen mit echten Bankdaten erfolgreich getestet.

Aktivitäten:
- Pilotbuchungen mit Kleinstbeträgen (<1€) für jeden Zahlungsweg
- pain.002 Statusrückmeldungen prüfen und in SAP verarbeiten
- camt.053 Kontoauszüge einlesen und buchen
- Fehlerszenarien testen: abgelehnte Zahlungen, falsche IBANs, fehlende BICs
- Negativtests: zu späte Einreichung, überschrittene Limits

Typische Dauer: 3–5 Wochen. Zweite Runde häufig nötig nach Bankrückmeldungen.

## phase-5-go-live

### Phase 5: Go-Live

Ziel: Produktivschaltung mit sicherem Cutover und Hypercare.

Aktivitäten:
- Cutover-Plan erstellen: letzter Altlauf, erster Neulauf, Parallelphase
- Erste produktive Zahlungen mit erhöhter Aufmerksamkeit begleiten
- Monitoring-Dashboard einrichten (BCM Payment Monitor)
- Hypercare-Phase: 2–4 Wochen dedizierter Support
- Dokumentation finalisieren: Betriebshandbuch, Kontakte, Eskalationswege

Typische Dauer: 1–2 Wochen Cutover, 2–4 Wochen Hypercare.
