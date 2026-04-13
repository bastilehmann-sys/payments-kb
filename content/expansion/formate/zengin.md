---
format_name: Zengin Text
aktuelle_version: "Zengin File Format (全銀協フォーマット, aktuell)"
nachrichtentyp: Japan Domestic Payment File — Fixed-Width Textformat (全国銀行協会 / Zengin Data Telecommunication System)
familie_standard: Japan Local
datenrichtung: Ausgehend (Corporate → Bank)
sap_relevanz: SAP ERP / S/4HANA — DMEE-Formatdefinition für Zengin; F110-Zahlungsprogramm; Japan-spezifische SAP-Lokalisierung (SAP Localization Hub Japan); Ausgabe per ANSER/SWIFT FileAct
status: Aktiv — Kernformat des japanischen Massenzahlungsverkehrs; keine Ablösung durch ISO 20022 kurzfristig; Zengin System abwickelt >100 Mio. Transaktionen täglich
---

# Zengin Text — Japan Domestic Payment Format (全銀協フォーマット)

**Stand:** April 2026 | **Quellen:** 全国銀行協会 (Japanese Bankers Association), Zengin Data Telecommunication System, SAP Japan

## Zweck & Verwendung

### Experte

Das **Zengin Text Format** (全銀協フォーマット, Zengin-kyō Fōmatto) ist das Standard-Dateiformat des **Zengin Data Telecommunication System** — dem zentralen Clearing-Netz für japanischen Inlandszahlungsverkehr, betrieben von der **全国銀行協会 (Japanese Bankers Association, JBA)**. Das System verarbeitet täglich über 100 Millionen Transaktionen und ist das Rückgrat für:

- **Überweisungen (Furikomi, 振込)**: Kreditübertragungen zwischen japanischen Bankkonten
- **Lastschriften (Furikae, 振替)**: Automatisierter Einzug, vergleichbar mit SEPA Direct Debit
- **Lohn- und Gehaltsabrechnungen**: Massenüberweisungen an Mitarbeiterkonten

**Technisches Format**: Fixed-Width-Textformat mit **120-Byte-Records**. Japanische Zeichenkodierung in zwei Modi:
- **JIS (Japan Industrial Standard)**: Halbraumzeichen (半角文字, Hankaku) — alphanumerisch
- **KANA**: Katakana-Schrift für Empfänger-/Auftraggeber-Namen (半角カナ, Hankaku Katakana)

**Dateistruktur:**
| Satzart | Inhalt |
|---|---|
| 1-Satz (Vorsatz) | Kennung, Datum, Auftraggeber-Name (Katakana), Kontonummer |
| 2-Satz (Datensatz) | Bankcode (4-stellig), Filialcode (3-stellig), Kontonummer (7-stellig), Kontoinhaber-Name (Katakana), Betrag (Yen, ganzzahlig) |
| 8-Satz (Nachsatz) | Anzahl Transaktionen, Summe Beträge |
| 9-Satz (Endsatz) | Dummy-Füllung für Bandsatz-Kompatibilität |

**Japanische Bankstruktur**: Statt BIC/IBAN verwendet Japan:
- **Bankcode (銀行コード)**: 4-stelliger Code (z.B. 0001 = Bank of Japan, 0009 = Mizuho)
- **Filialcode (支店コード)**: 3-stellige Filial-Nummer
- **Kontonummer (口座番号)**: 7-stellig, Kontenart (普通 = Ordinary, 当座 = Checking, 貯蓄 = Savings)

### Einsteiger

Das Zengin-Format ist Japans Version von SEPA — das Standard-Format für alle Inlandsüberweisungen in Japan. Statt IBAN und BIC verwendet Japan eigene Bank- und Filialnummern. Das Format ist alt (aus den 1970ern), aber zuverlässig und überall verbreitet. Wenn ein japanisches Unternehmen SAP nutzt, muss SAP Zengin-Dateien erzeugen können — dafür gibt es spezielle SAP-Konfigurationen. Wichtig: Empfänger-Namen müssen in japanischer Katakana-Schrift angegeben werden, nicht in Lateinschrift.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1973 | Zengin System eingeführt — Magnetband-Datenträgeraustausch zwischen japanischen Banken |
| 1982 | Öffnung für Firmenkunden — Corporate-to-Bank-Einreichung möglich |
| 1992 | Erweiterung auf 120-Byte-Records (von vormals 80 Byte) |
| 2011 | Katastrophen-resilientes Backup-System nach Tōhoku-Erdbeben implementiert |
| 2018 | Zengin System 7th Generation — Real-Time-Clearing 24/7 für Einzel-Zahlungen |
| 2022 | 24/7-Clearing-Erweiterung für Massenzahlungen; Zengin verarbeitet 10 Mrd. Transaktionen p.a. |
| 2023 | ISO 20022-Evaluierung begonnen; kein verbindliches Migrationsdatum festgesetzt |

## Wichtige Felder (technisch)

| Feld (2-Satz) | Position | Beschreibung | Pflicht |
|---|---|---|---|
| Kennung | 1 | "2" für Datensatz | Ja |
| Bankcode | 2-5 | 4-stelliger Bankcode (z.B. 0009 für Mizuho) | Ja |
| Filialcode | 6-8 | 3-stelliger Filialcode | Ja |
| Kontenart | 9 | 1=普通(Ordinary), 2=当座(Checking), 4=貯蓄(Savings) | Ja |
| Kontonummer | 10-16 | 7-stellig, linksbündig mit Leerzeichen | Ja |
| Kontoinhaber (Kana) | 17-47 | 30 Zeichen Katakana (半角カナ) | Ja |
| Betrag (Yen) | 48-57 | 10-stellig, rechtsbündig mit führenden Nullen | Ja |
| Neuer Kunde | 58 | "Y" = neuer Empfänger, " " = bekannt | Nein |
| Kundenreferenz | 59-78 | 20 Zeichen freitext | Nein |
| Füllung | 79-120 | Spaces | — |

## Pflichtfelder (Kurzliste)

Bankcode · Filialcode · Kontenart · Kontonummer · Kontoinhaber (Katakana) · Betrag (Yen)

## SAP-Mapping

### Experte

SAP Japan Lokalisierung unterstützt Zengin über mehrere Wege:
- **DMEE-Format**: SAP liefert DMEE-Formatdefinition für Zengin (`JP_BANKS` oder `ZENGIN`). Konfiguration in Transaktion `DMEE` — Japan-spezifische DMEE-Bäume sind Teil der SAP Japan Localization.
- **SAP Localization Hub Japan**: S/4HANA-Nachfolger für Japan-spezifische Zahlungsformate. Zengin-Erzeugung integriert.
- **F110 (Zahlungsprogramm)**: Zahlungsweg `Z` (Zengin) konfigurieren. Japan-Bankdaten in SAP: Bankcode (4-stellig) in `BNKA.BANKL`, Filialcode in `BNKA.PROVZ`.
- **Katakana-Konvertierung**: SAP konvertiert automatisch Lateinbuchstaben in Katakana-Transkription — muss aber geprüft werden (z.B. "Smith" → "スミス", "Müller" → problematisch). Transkriptions-Mapping in SAP-Customizing.
- **Yen ohne Dezimalstellen**: SAP-Betragsfelder müssen für JPY auf 0 Dezimalstellen konfiguriert sein (ISO 4217: JPY = 0 Dezimalstellen). Falsche Konfiguration führt zu Centangaben statt Yen.
- **Bankleitzahl (ZENGIN BANKCODE)**: Japan nutzt kein SWIFT BIC für inländische Zahlungen. SAP-Kreditoren-Stammdaten müssen japanischen Bankcode + Filialcode statt BIC enthalten.

### Einsteiger

SAP hat für Japan eine spezielle Zahlungs-Konfiguration. Nach dem Zahlungslauf (F110) erzeugt SAP automatisch eine Zengin-Datei. Wichtig: Empfänger-Namen müssen in japanischer Katakana-Schrift eingegeben sein — das ist oft eine Hürde, wenn Stammdaten in lateinischen Buchstaben gepflegt wurden. Außerdem: Yen hat keine Centbeträge — SAP muss entsprechend konfiguriert sein.

## Typische Fehlerquellen

### Experte

- **Katakana-Konvertierungsfehler**: SAP-interne Katakana-Transkription funktioniert für westliche Namen häufig nicht korrekt (keine offiziellen Regeln für Umlaute, Sonderzeichen) — manuelle Pflege der Katakana-Stammdaten oft notwendig.
- **Yen-Dezimalstellen**: JPY hat keine Dezimalstellen (ISO 4217) — falls SAP-System auf 2 Dezimalstellen konfiguriert ist, werden Beträge um Faktor 100 zu groß oder zu klein übermittelt.
- **Bankcode vs. BIC**: Japan-Bankdaten haben kein BIC-Feld — SAP-Kreditoren-Stammdaten müssen Bankcode (4-stellig) und Filialcode (3-stellig) enthalten. Häufig werden BIC-Felder falsch befüllt.
- **Filial-Code nicht bekannt**: Empfängerkonto braucht spezifischen 3-stelligen Filialcode — bei Massenimport von Stammdaten oft unbekannt oder leer.
- **Encoding-Problem**: Zengin erfordert Shift-JIS-Encoding — moderne UTF-8-Systeme müssen explizit konvertieren. SAP-Output muss auf Shift-JIS/Hankaku-Kana geprüft werden.

### Einsteiger

- Zahlung schlägt fehl, weil Empfängername in Lateinschrift statt Katakana vorliegt.
- Beträge sind um Faktor 100 falsch — Yen vs. Sen-Verwechslung.
- Filialcode der Empfängerbank fehlt — Zahlung kann nicht geroutet werden.

## Häufige Projektfehler

### Experte

- **Keine Japan-Lokalisierung eingeplant**: SAP Japan Zengin-Unterstützung erfordert Japan-Lokalisierungs-Paket — Projekte planen es nicht rechtzeitig ein, was zu Implementierungsverzögerungen führt.
- **Stammdaten-Qualität vernachlässigt**: Katakana-Namen müssen für alle japanischen Lieferanten gepflegt sein — massenhafter Import westlicher Stammdaten ohne Japan-Felder ist kritischer Fehler.
- **Real-Time vs. Batch nicht unterschieden**: Zengin System 7th Generation (2018) unterstützt 24/7-Echtzeit für Einzelzahlungen — Projekte konfigurieren nur Batch-Einreichung und verpassen Vorteile von Real-Time-Zahlungen.
- **Test mit Echtsystemen nicht möglich**: Japanische Banken bieten selten vollwertige Test-Environments an — Produktionstests mit kleinen Beträgen sind in Japan üblich, aber riskant.

### Einsteiger

- Das Projekt startet, ohne zu wissen, dass SAP Japan-Lokalisierung separat lizenziert wird.
- Alle japanischen Lieferanten haben nur lateinische Namenseinträge — Katakana fehlt komplett.
- Überweisungen gehen zu keiner Echtzeit-Clearing-Option, obwohl die Bank das anbietet.
