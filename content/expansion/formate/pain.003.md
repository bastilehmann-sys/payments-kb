---
format_name: pain.003
aktuelle_version: "001.001.02"
nachrichtentyp: CustomerDirectDebitReversalInitiation
familie_standard: ISO 20022 / pain
datenrichtung: Ausgehend (Corporate → Bank)
sap_relevanz: SAP S/4HANA Treasury / FI-BL (Electronic Bank Statement, Rückgabe-Verarbeitung)
status: Aktiv (EPC SEPA SDD Reversal Rulebook)
---

# pain.003 — Customer Direct Debit Reversal Initiation

**Stand:** April 2026 | **Quellen:** ISO 20022, EPC SEPA SDD Rulebook, SAP-Dokumentation

## Zweck & Verwendung

### Experte

pain.003 ist die ISO-20022-Nachricht, mit der ein **Zahlungsdienstleister (Bank) im Auftrag des Creditors** die Rückabwicklung einer bereits ausgeführten SEPA-Lastschrift initiiert (Reversal). Sie unterscheidet sich fundamental von der Rückgabe (pain.002 / pacs.004): Beim Reversal war die Lastschrift technisch erfolgreich, wird aber auf Initiative des Creditors (z. B. irrtümliche Doppelbelastung, Widerruf vor Settlement) storniert. Die Nachricht referenziert zwingend die Originaltransaktion via `OrgnlEndToEndId`, `OrgnlMndtId` und `OrgnlCdtrSchmeId`. Der Reversal-Grund wird im `RevrslRsnInf`-Block kodiert (EPC-Codes: DUPL, FRAD, TECH, CUST). Die Deadline beträgt unter EPC SEPA SDD Core **5 Bankarbeitstage** nach dem Fälligkeitstag (D+5).

### Einsteiger

Mit pain.003 kann eine Firma (als Gläubiger) eine eingezogene Lastschrift beim eigenen Geldinstitut wieder rückgängig machen — z. B. weil irrtümlich zu viel abgebucht wurde oder eine Zahlung doppelt eingezogen wurde. Die Bank leitet die Stornierung dann über das Zahlungssystem an die Bank des Schuldners weiter. Das Gegenteil — wenn der Schuldner zurückruft — läuft über einen anderen Prozess.

## Versionshistorie

| Version | Jahr | Änderungen |
|---|---|---|
| 001.001.01 | 2009 | Erstveröffentlichung EPC SEPA SDD Rulebook v2 |
| 001.001.02 | 2013 | Aktuell: Strukturierter `RevrslRsnInf`-Block, Alignment mit pain.008.001.02; BIC-Pflicht entfallen (SEPA-Migration) |

## Wichtige Felder (technisch)

| XML-Element | Bedeutung | Pflicht |
|---|---|---|
| `GrpHdr/MsgId` | Eindeutige Nachrichtenreferenz | Ja |
| `GrpHdr/NbOfTxs` | Anzahl Reversal-Transaktionen | Ja |
| `OrgnlGrpInf/OrgnlMsgId` | MsgId der Original-pain.008 | Ja |
| `OrgnlGrpInf/OrgnlMsgNmId` | `pain.008.001.02` | Ja |
| `TxInf/OrgnlEndToEndId` | End-to-End-ID der Originallastschrift | Ja |
| `TxInf/OrgnlMndtId` | Mandatsreferenz | Ja |
| `TxInf/OrgnlCdtrSchmeId` | Gläubiger-ID (CI) | Ja |
| `TxInf/RevrslRsnInf/Rsn/Cd` | EPC-Reversal-Code (DUPL, FRAD, TECH, CUST) | Ja |
| `TxInf/RvsdIntrBkSttlmAmt` | Rückabwicklungsbetrag | Ja |

## Pflichtfelder (Kurzliste)

`MsgId` · `CreDtTm` · `NbOfTxs` · `OrgnlMsgId` · `OrgnlMsgNmId` · `OrgnlEndToEndId` · `OrgnlMndtId` · `RevrslRsnInf/Rsn/Cd` · `RvsdIntrBkSttlmAmt`

## SAP-Mapping

### Experte

In SAP S/4HANA wird pain.003 im Kontext des **Electronic Bank Statement (EBS / FF.5 / FF_5)** verarbeitet: eingehende Reversal-Confirmations werden als Kontobewegung interpretiert. Für den **Outbound**-Pfad (Corporate initiiert Reversal) wird pain.003 über die **Payment Medium Workbench (PMW)** oder das **DMEEX-Framework** erzeugt — Transaktion **F110** mit Sonderbelegtyp `DR`. Das Mandat-Repository (SEPA Mandate Management, Transaktion `UDM_MANDATE`) muss auf Basis des `OrgnlMndtId` referenziert werden. Bei SDD-Reversal in SAP: Beleg in `FEBEP` (Electronic Bank Statement Posting), Stornobuchung über FI-Modul mit Schlüssel **39** oder **31** je nach Buchungslogik.

### Einsteiger

In SAP gibt es keine eigene Transaktion nur für pain.003 — es läuft im Hintergrund beim Bankverbindungsmanagement. Wenn eine Lastschrift storniert werden muss, wird im System entweder über den Zahlungsausgang (F110) oder manuell ein Storno-Beleg erzeugt, und die Bank erzeugt dann automatisch die pain.003-Nachricht. Der Buchhalter sieht die Rückbuchung als Bankbewegung im Kontoauszug-Import (FF_5).

## Typische Fehlerquellen

### Experte

- **Falsche `OrgnlMsgNmId`**: Muss exakt `pain.008.001.02` lauten — viele Implementierungen schreiben `pain.008.003.02` (falsch). Führt zu Rejection am Clearingsystem (Reason: NARR/AM05).
- **Deadline überschritten**: Reversal nur bis D+5 zulässig; bei Überschreitung muss ein **Refund** (pacs.004 mit Reason FOCR) ausgelöst werden — andere Nachricht, anderer Prozess.
- **Falscher `RevrslRsnInf/Cd`**: CUST (Customer Request) vs. DUPL (Duplicate) hat unterschiedliche Rückforderungsregeln und SLA-Fristen.
- **Fehlende Mandatsdaten**: `OrgnlMndtId` und `OrgnlCdtrSchmeId` müssen mit den Originaldaten übereinstimmen — Abweichungen führen zu Silent Rejections.

### Einsteiger

- Man verwendet pain.003 nach Ablauf der 5-Tage-Frist — dann ist es zu spät, und man muss einen anderen Weg nehmen (Rückforderung per Bankauftrag).
- Die Referenznummern (Mandatsnummer, End-to-End-ID) aus der Originalzahlung werden falsch oder gar nicht mitgegeben — die Bank kann die Originallastschrift nicht zuordnen und lehnt ab.
- Verwechslung mit pain.002 (Status-Nachricht): pain.003 ist ein aktiver Storno-Auftrag, kein Statusbericht.

## Häufige Projektfehler

### Experte

- **DMEEX-Formatdatei fehlt für pain.003**: Viele SAP-Standard-Installationen haben DMEEX-Formate nur für pain.001/008, nicht für pain.003 — muss manuell aufgebaut oder per PMW-Erweiterung implementiert werden.
- **Mandats-Lifecycle ignoriert**: Bei Reversal-DUPL sollte das Mandat nicht gelöscht werden; bei CUST auf Creditor-Initiative ist eine Prüfung des Mandat-Status erforderlich — wird im Projekt häufig übergangen.
- **Settlement-Datum-Kalkulation fehlt**: Der Reversal-Betrag darf erst nach Ablauf des Reversal-Fensters gebucht werden — unkorrekte Buchungsdaten führen zu False Positives im Liquiditätsmanagement.

### Einsteiger

- Teams wissen nicht, dass pain.003 nur innerhalb von 5 Bankarbeitstagen funktioniert — nach dieser Frist muss die Buchhaltung einen manuellen Rückforderungsweg gehen.
- In SAP wird der pain.003-Prozess oft nicht konfiguriert, weil er selten genutzt wird — im Projekttest fällt auf, dass er fehlt, und die Einrichtung kostet Zeit.
- Verwechslung mit einer internen Stornobuchung in SAP (FI-Beleg) — die Stornobuchung im System und die Reversal-Nachricht an die Bank sind zwei verschiedene Schritte, die beide gemacht werden müssen.
