# Serbien — Payments Country Profile

*Letzte Aktualisierung: April 2026*

Serbien ist eine der am stärksten regulierten Payment-Jurisdiktionen in Südosteuropa. Die Kernzahlungssysteme (NBS RTGS, NBS Clearing, IPS) sind seit November 2025 vollständig auf ISO 20022 migriert — die regulatorische Schicht darüber (NBS-Zahlungscodes, KZ-Meldungen, 60-Tage-Repatriierung, eingeschränkte IHB-Teilnahme) erzeugt jedoch mehrere spezifische Anforderungen, die in einer Payment Factory und in SAP APM sauber abgebildet werden müssen.

## Key Facts

- **Währung:** RSD (Serbian dinar) — managed float, eng an EUR gepeggt
- **Zentralbank:** National Bank of Serbia (NBS) — Regulator *und* Betreiber der Zahlungssysteme
- **Banken:** ~20 (Stand 03/2025, 77 % Marktanteil in ausländischer Hand)
- **Bilanzsumme:** ~USD 62 Mrd. (≈ 69 % des BIP)
- **FX-Aufsicht:** seit 01.01.2019 NBS (vorher Steuerbehörde)
- **ISO 20022:** abgeschlossen für alle NBS-Systeme (11/2025)
- **Instant Payments:** IPS NBS, seit 10/2018, 24/7/365, ~1,2 sec

## Die 4 wichtigsten Constraints für Treasury & APM-Design

1. **NBS Mittelkurs ist Pflicht** für alle Buchhaltung, Statistik, Zoll und Steuer — *nicht* der interne Konzernkurs, *nicht* der Bankkurs. Tägliches Feed in SAP nötig.
2. **Cash Pooling und IHB sind stark eingeschränkt** — grenzüberschreitendes physisches Pooling für FX-Konten praktisch verboten; IC-Kredite innerhalb 10 Tagen KZ-meldepflichtig.
3. **NBS-Zahlungscodes (sifra placanja) sind auf jeder Zahlung Pflicht** — falscher Code = Ordnungswidrigkeit beim Residenten, nicht bei der Bank.
4. **Quartalsweise FX-Meldungen an NBS (DI-1, KZ-Formulare)** — Bank kann einreichen, Haftung liegt beim Residenten.

## Regulatorischer Rahmen

| Gesetz / Verordnung | Anwendungsbereich |
|---|---|
| Law on Foreign Exchange Operations (Zakon o deviznom poslovanju) | Devisenkonvertierung, Cross-Border, IC-Kredite, FX-Reporting. Stand 2025. |
| Law on Payment Services (Zakon o platnim uslugama) | Inland-/Grenz-Zahlungsdienste, Zahlungsinstitute. EU-PSD2-aligned. |
| Law on Banks (Zakon o bankama) | Lizenzierung, Eigenkapital, Related-Party-Exposure (max. 25 % des Bankkapitals). |
| Law on the NBS | NBS-Kompetenzen, Geldpolitik, FX-Intervention, Aufsicht über Payment Systems. |
| Decision on Reporting Foreign Credit Transactions | KZ-1 bis KZ-3B-Formulare für jede IC-Kreditmeldung mit Nicht-Residenten. |
| Decision on Opening and Managing FX Accounts | Kontotypen, Eröffnung, Betriebsregeln. |

## Zahlungssysteme (NBS-Betrieb)

| System | Währung | Schwelle | Typ | Zeiten | Format |
|---|---|---|---|---|---|
| NBS RTGS | RSD | ≥ 300.000 | RTGS | 09:00–18:00 | ISO 20022 (seit 11/2025) |
| NBS Clearing | RSD | < 300.000 | Multilateral Net | Business days | ISO 20022 (seit 11/2025) |
| IPS NBS | RSD | ≤ 300.000 / Tx | Instant | 24/7/365, ~1,2 s | ISO 20022 (seit Launch 2018) |
| NBS Interbank FX Clearing | EUR/USD/other | alle | FX-Clearing RS-intern | Business days | ISO 20022 (seit 11/2025) |
| International FX Clearing | EUR/USD | alle | Cross-Border mit BA & ME | Business days | ISO 20022 (seit 11/2025) |
| DinaCard | RSD | Karten | Nationaler Card Scheme | Daily | proprietär |

## NBS-Zahlungscodes (sifra placanja)

Jede Inlandszahlung muss einen **dreistelligen Zifferncode** tragen, der die wirtschaftliche Natur der Transaktion identifiziert.

**Struktur:** 1. Ziffer = Form der Zahlung (1=Cash, 2=Unbar, 3=Settlement, 9=Umbuchung). 2.+3. Ziffer = Basis (z. B. 21 = Waren/Dienstleistungen Endverbrauch, 40 = Gehälter).

**ISO-20022-Ablage:** `<CdtTrfTxInf><Purp><Prtry>221</Prtry></Purp>` — **nicht** `<Cd>`, da NBS-Codes nicht Teil des ISO-Registry sind. Für Cross-Border zusätzlich `<RgltryRptg>`.

### Häufigste Codes (Top 20)

| Code | Bedeutung | Use Case |
|---|---|---|
| 221 | Waren/DL — Endverbrauch (unbar) | Standard-B2B-Lieferantenzahlung |
| 220 | Waren/DL — Vorleistung | Rohmaterial, Energie, Fremdleistung |
| 222 | Öffentliche Versorgung | Wasser, Strom, Telekom |
| 223 | Investitionen Gebäude/Anlagen | Capex |
| 231 | Zoll & Import | Konsolidierte Zollzahlungen |
| 240 | Gehalt (unbar) | **Kritisch:** falscher Code = Bank erkennt keine Gehaltszahlung |
| 248 | Investment-Einkommen | Dividende, Zinsen, Miete |
| 253 | Laufende öffentliche Einnahmen | Grundsteuer, Quellensteuer — Standard-Steuercode |
| 254 | Quellensteuer & Beiträge (konsolidiert) | objedinjena naplata |
| 263 | Sonstige Transfers | Transfers innerhalb derselben Rechtseinheit |
| 266 | Barabhebung | Alle Cash Withdrawals |
| 270 / 271 | Kurz-/Langfristige Kreditauszahlung | **Auch IC-Kredite!** |
| 272 / 279 | Aktive / passive Zinsen | |
| 276 / 277 | Kredittilgung kurz-/langfristig | |
| 281 / 282 | Gesellschafterdarlehen / Rückzahlung | |
| 287 | Spenden / Sponsoring | |
| 290 | Sonstige | Catch-all — sparsam nutzen, NBS prüft |

## IHB / POBO / COBO — Warum Serbien nicht in einen Standard-IHB passt

| Restriktion | Schwere | Detail | Workaround |
|---|---|---|---|
| FX Cross-Border Pooling | ⚠ nicht umsetzbar | NBS prüft jede Cross-Currency-IC-Transaktion individuell | Wöchentliche/monatliche manuelle Transfers |
| IC-Kreditmeldung (KZ-Formulare) | ⚠ hoher Aufwand | KZ-1 innerhalb 10 Tagen, KZ-3B pro Transaktion | Dokumentieren, nach jedem Bankvorgang KZ-3B bestätigen |
| Notional Pooling / Cross-Guarantees | ⚠ nicht umsetzbar | Related-Party-Exposure auf 25 % Bankkapital begrenzt | Serbien aus internationalem Notional Pool ausnehmen |
| 60-Tage-Repatriierung | blockiert COBO | Exporterlöse binnen 60 Tagen auf RS-Konto | Kein COBO — Erlöse direkt lokal einziehen |
| Cash-Pooling "protected funds"-Regel | blockiert IHB | Mittel einzelner Teilnehmer dürfen nicht andere finanzieren | Manuelle dokumentierte IC-Transfers |
| NBS-Code auf IC-Transfers | operativ | 270 / 276 / 277 / 272 / 279 / 281 / 282 | Code-Mapping im APM Routing Object |
| FX-Kontrolle auf IC-Transfers | langsam | Individuelle NBS-Prüfung, Dokumentation oft nötig | Audit Trail, lokale Bank als Partner |

**Was erlaubt ist:** PINO Forwarding (RS-Entität löst APM-seitig aus, Ausführung lokal), PINO Routing (APM wählt optimales RS-Konto), lokales Cash Management mit periodischen Transfers, dokumentierte IC-Kredite.

## NBS-Reporting-Pflichten (DI-1 / KZ-Formulare)

| Form | Zweck | Frequenz | Deadline | Einreicher | Haftung |
|---|---|---|---|---|---|
| DI-1 | Ausländische Direktinvestitionen in RS | Quartal | 10.04, 10.07, 10.10, 10.01 | Resident direkt (elektr.) | Resident |
| KZ-1 | Neuer Auslandskreditvertrag | pro Vertrag | 10 Tage ab Unterzeichnung | Via Bank | Resident |
| KZ-2 | Änderung/Beendigung | pro Änderung | 10 Tage | Via Bank | Resident |
| KZ-3 / 3A | Periodische Bestandsmeldung | Quartal/Jahr | NBS-Zyklus | Via Bank | Resident |
| KZ-3B | Jede Auszahlung/Rückzahlung | pro Transaktion | pro Vorgang | Bank elektronisch | **Resident — nach jedem Vorgang mit Bank verifizieren** |

## SAP APM / Treasury Konfiguration — Checkliste

1. Serbisches Company Code (RSD als lokale Währung, parallel EUR/USD) — OBY6
2. Currency Config — OB22
3. Dedizierter NBS-Wechselkurstyp (z. B. ZNBS) — OB07
4. Täglicher NBS-Kurs-Upload (kursnaListaModul) — OB08 + Custom Interface
5. Serbische Bankkonten in BAM, House-Bank-Country = RS
6. NBS-Code Masterdata (Z-Tabelle ZNBS_PAY_CODES), Quartalsupdate via XML-Feed
7. Routing Object für Ländercode RS = **lokaler Pfad, NICHT IHB**
8. DMEEX-Formatbaum für RS-pain.001 mit `<Purp><Prtry>` + strukturiertem "poziv na broj"
9. camt.053-Import mit NBS-Code-Erkennung
10. BCM-Approval-Workflow mit RS-Cut-offs (RTGS 09–18, IPS 24/7)
11. APM-Validierungsregel: `<Purp><Prtry>` MUSS gesetzt sein für RS-Outgoing
12. KZ-Reporting-Interface für IC-Kredite
13. FI-Wechselkursdifferenzkonten (NBS-Kurs vs. Bankkurs)
14. Vendor-Masterdata mit Default-NBS-Code (B2B typ. 221)
15. Solution-Doku: RS explizit nicht im IHB Routing

## Quellen

- NBS — [sifarnik-placanja](https://www.nbs.rs/sr/drugi-nivo-navigacije/servisi/sifarnik-placanja/)
- NBS — [Payment System Overview](https://www.nbs.rs/en/ciljevi-i-funkcije/platni-sistem/nbs-operator/)
- NBS — [kursnaListaModul](https://www.nbs.rs/kursnaListaModul/srednjiKurs.faces)
- NBS — [ISO 20022 Working Paper (2024)](https://www.nbs.rs/export/sites/NBS_site/documents-eng/publikacije/wp_bulletin/wp_bulletin_03_24_3.pdf)
- Law on Foreign Exchange Operations ([EN consolidated](https://www.nbs.rs/export/sites/NBS_site/documents-eng/propisi/zakoni/law_foreign_exchange_operations.pdf))
- Karanovic & Partners — [KZ Forms Guide](https://www.karanovicpartners.com/news/reporting-on-fx-operations-in-serbia-common-mistakes-leading-to-misdemeanour-liability/)
- SWIFT PMPG — [ISO 20022 Market Practice](https://www.swift.com/swift-resource/252216/download)

*Disclaimer: Stand April 2026. Serbische FX- und Payment-Regulierung ändert sich häufig — vor Implementierung stets aktuellen Stand mit NBS oder lokaler Kanzlei verifizieren. Bankspezifische DMEEX-/XML-Details bilateral mit jeder RS-Hausbank klären.*
