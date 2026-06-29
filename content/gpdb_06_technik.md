# Technische Verbindungsstandards

Überblick über die wichtigsten Verbindungsprotokolle für den elektronischen Zahlungsverkehr zwischen Unternehmen und Banken.

## ebics

### Überblick

EBICS (Electronic Banking Internet Communication Standard) ist der in DACH und Frankreich dominierende Standard für den sicheren Datenaustausch zwischen Unternehmen und Banken über das Internet. Er wird vom Zentralen Kreditausschuss (ZKA) betrieben und ist seit 2008 Pflichtstandard der deutschen Banken.

### Funktionsweise

EBICS basiert auf einem dreistufigen Sicherheitsmodell mit drei RSA-Schlüsselpaaren pro Teilnehmer:
- **A005 / A006**: Authentisierungsschlüssel (Signatur der Aufträge)
- **X002**: Verschlüsselungsschlüssel (Transportverschlüsselung)
- **E002**: Initialisierungsschlüssel (Erstinitialisierung)

Jede EBICS-Transaktion durchläuft vier Phasen: Initialisierung, Übertragung, Quittierung und Validierung. Die Bank prüft Signatur und Berechtigung, bevor Dateien verarbeitet werden.

### EBICS 3.0 Neuerungen

EBICS 3.0 (2018) vereinheitlicht die europäischen EBICS-Dialekte. Wichtigste Änderungen:
- Harmonisierte Auftragsarten (BTF - Business Transaction Format) ersetzen länderspezifische Codes
- Verbesserte Zertifikatsunterstützung (X.509)
- Einheitliche Fehlerbehandlung

### SAP-Konfiguration

In SAP wird EBICS über folgende Komponenten konfiguriert:
- **BCM (Bank Communication Management)**: Zentrales Cockpit für EBICS-Verbindungen
- **MBC (Multi-Bank Connectivity)**: Cloud-basierter EBICS-Zugang ohne lokale Installation
- **DME Engine**: Generierung der Zahlungsdateien (pain.001, pain.008)

Technische Schritte: Bankschlüssel initialisieren → Zertifikate austauschen → Kommunikationstest → Pilotbuchung

### Häufige Fehler

- **EBICS_INVALID_USER_STATE**: Benutzer noch nicht aktiviert oder gesperrt — Bankrückfrage nötig
- **EBICS_AUTHENTICATION_FAILED**: Falscher Authentisierungsschlüssel — Schlüssel neu einreichen
- **EBICS_TX_ABORT**: Transaktionsabbruch wegen Timeout — Dateiübertragung wiederholen
- Schlüsseldatei verloren: Neues Ini-Schreiben und erneute Bankfreigabe erforderlich

### Vergleich zu Alternativen

| Merkmal | EBICS | H2H | SWIFT |
|---|---|---|---|
| Verbreitung | DACH + FR | Bilateral | Global |
| Aufwand Setup | Mittel | Hoch | Sehr hoch |
| Kosten | Niedrig | Mittel | Hoch |
| SAP-Nativ | Ja (BCM/MBC) | Nein | Teilweise |

---

## h2h

### Überblick

Host-to-Host (H2H) bezeichnet eine direkte Punkt-zu-Punkt-Verbindung zwischen dem ERP-System des Unternehmens und dem Bankrechner, typischerweise über SFTP oder AS2. Keine Middleware, keine Standard-Protokollschicht — jede Bank definiert ihr eigenes Setup.

### Funktionsweise

Das Unternehmen stellt Zahlungsdateien (pain.001, proprietäre Formate) auf einen SFTP-Server der Bank bereit. Die Bank verarbeitet die Dateien und stellt Statusrückmeldungen (pain.002, camt.053) zurück. Die Verbindung läuft über SSH-Schlüssel oder Zertifikate.

### SAP-Konfiguration

In SAP wird H2H meist über externe Middleware (z.B. Axway, IBM Sterling) oder direkte SFTP-Integrationen realisiert. Der Prozess:
1. SFTP-Verbindungsparameter in SAP hinterlegen (Transaktion FI12 oder BCM)
2. Dateipfade und Dateinamensmuster mit Bank abstimmen
3. Zeitgesteuerte Jobs für Upload/Download konfigurieren (SM36)
4. Statusmonitoring einrichten

### Häufige Fehler

- SSH-Schlüsselablauf: Schlüssel haben Gültigkeitsdauer — Erneuerungsprozess mit Bank vereinbaren
- Dateinamenkonventionen: Jede Bank hat eigene Regeln — genaue Abstimmung nötig
- Zeitzonendifferenzen bei Cut-off-Zeiten führen zu verspäteten Buchungen

### Vergleich zu Alternativen

H2H ist sinnvoll wenn: Großvolumige Transaktionen, spezifische Bankanforderungen, EBICS nicht verfügbar (z.B. außerhalb DACH). Nachteil: Hoher Einrichtungsaufwand, kein Standard.

---

## sap-mbc

### Überblick

SAP Multi-Bank Connectivity (MBC) ist ein cloudbasierter SAP-eigener Service, der Unternehmen eine standardisierte Verbindung zu mehreren Banken über ein zentrales SAP-Netzwerk ermöglicht — ohne lokale Middleware oder individuelle H2H-Verbindungen.

### Funktionsweise

MBC fungiert als Intermediär zwischen SAP S/4HANA und den teilnehmenden Banken. Das Unternehmen sendet Zahlungsdateien (pain.001) an MBC; MBC übersetzt und leitet sie bankspezifisch weiter. Verfügbar als Teil von SAP Business Technology Platform (BTP).

Vorteile:
- Einmalige Integration für alle teilnehmenden Banken
- Automatische Formatkonvertierung
- Zentrales Monitoring im SAP Cockpit
- Kein EBICS-Schlüsselmanagement nötig

### SAP-Konfiguration

1. MBC in SAP BTP aktivieren (über SAP Cloud Connector)
2. Bankverbindungen im MBC Portal anlegen
3. In S/4HANA: Zahlungsweg auf MBC-Kanal konfigurieren (FI12)
4. Test mit Pilotbank durchführen

### Häufige Fehler

- Nicht alle Banken sind MBC-Partner — vor Projektstart Bankenliste prüfen
- Cloud Connector Konfiguration fehleranfällig — SAP BTP Dokumentation beachten
- Latenz höher als bei direktem EBICS

---

## swift

### Überblick

SWIFT (Society for Worldwide Interbank Financial Telecommunication) ist das weltweite Interbanken-Netzwerk für internationale Zahlungen und Finanzinformationen. Corporates können über SWIFT-Direktmitgliedschaft oder Service Bureau auf das Netzwerk zugreifen.

### Nachrichtenformate

- **MT-Formate** (klassisch): MT101 (Überweisungsauftrag), MT940/942 (Kontoauszug), MT103 (Einzelüberweisung)
- **MX-Formate** (ISO 20022): pain.001, camt.053 — Migration bis 2025 abgeschlossen
- **SWIFT gpi**: Global Payments Innovation — Echtzeit-Tracking internationaler Zahlungen

### SWIFT-Zugang für Corporates

Corporates haben drei Zugangsmöglichkeiten:
1. **Direktmitglied** (MA-CUG): Eigene BIC, eigene Infrastruktur — aufwendig und teuer
2. **Service Bureau**: Zugang über Drittanbieter (→ siehe Service Bureau Artikel)
3. **Banken-Connectivity**: Bank stellt SWIFT-Kanal bereit (meistens EBICS oder H2H dahinter)

### SAP-Konfiguration

SWIFT-Integration in SAP läuft typischerweise über:
- **SAP Financial Services Network (FSN)**: SAP-eigener SWIFT-Kanal (ähnlich MBC)
- **Drittanbieter-Middleware**: Axway, SunGard, Finastra
- In BCM: SWIFT als Kommunikationskanal konfigurieren

### Häufige Fehler

- BIC/BICFI Verwechslung bei Migration (MT→MX): BICFI enthält immer 11 Zeichen
- gpi-Tracking funktioniert nur wenn alle Banken in der Kette gpi-fähig sind
- MT940 vs camt.053: Formatwechsel erfordert Anpassung der SAP-Kontoauszugsverarbeitung

---

## swift-service-bureau

### Überblick

Ein SWIFT Service Bureau ist ein zertifizierter Drittanbieter, der Corporates SWIFT-Netzzugang ohne eigene SWIFT-Infrastruktur ermöglicht. Das Bureau übernimmt Betrieb, Compliance und Wartung der SWIFT-Verbindung.

### Funktionsweise

Das Unternehmen sendet Zahlungsdateien an das Service Bureau (via SFTP oder API). Das Bureau übersetzt in SWIFT-Nachrichten und leitet über das SWIFT-Netz weiter. Statusrückmeldungen laufen denselben Weg zurück.

Bekannte Service-Bureau-Anbieter: Finastra, Axway, TCS, Société Générale

### Vorteile gegenüber Direktmitgliedschaft

- Keine eigene SWIFT-Infrastruktur nötig (kein HSM, kein Alliance-Server)
- Kein SWIFT-Compliance-Aufwand (wird vom Bureau übernommen)
- Schnellerer Go-Live (Wochen statt Monate)
- Geringere laufende Kosten bei mittelgroßen Transaktionsvolumen

### Nachteile

- Abhängigkeit vom Bureau-Anbieter
- Höhere Transaktionskosten als Direktmitglied bei sehr hohem Volumen
- Datenschutz: Zahlungsdaten gehen durch Dritte

### SAP-Konfiguration

Die SAP-Integration erfolgt wie bei H2H — Verbindung zum Bureau via SFTP oder API. Das Bureau erscheint aus SAP-Sicht wie eine normale Bankverbindung.
