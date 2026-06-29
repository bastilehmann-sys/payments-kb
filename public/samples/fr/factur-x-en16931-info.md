# Factur-X / Chorus Pro / PPF — FR E-Rechnung

## Factur-X (PDF/A-3 Hybrid)

**Factur-X** ist der französisch-deutsche Hybrid-Standard für E-Rechnungen —
funktional identisch mit deutscher **ZUGFeRD**.

- **Format:** PDF/A-3 mit eingebettetem XML (CII / UN/CEFACT Cross Industry Invoice)
- **Profile:** MINIMUM, BASIC, BASIC WL, EN 16931 (Standard), EXTENDED
- **Quelle:** https://fnfe-mpe.org / https://www.factur-x.org

> Hinweis: Eine echte Factur-X-Datei ist eine **binäre PDF/A-3-Datei** mit
> eingebettetem XML — kann hier nicht als Text-Sample bereitgestellt werden.
> Beispieldateien direkt von FNFE-MPE oder über SAP DRC generieren.

## Embedded XML — CII Excerpt

Das in der PDF/A-3 eingebettete XML folgt **UN/CEFACT Cross Industry Invoice (CII)**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice
    xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
    xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>FACT-FR-2026-04-0089</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">20260415</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>EXEMPLE SARL</ram:Name>
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">FR55212022200</ram:ID>
        </ram:SpecifiedTaxRegistration>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>FOURNISSEUR INDUSTRIE SAS</ram:Name>
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">FR98765432100</ram:ID>
        </ram:SpecifiedTaxRegistration>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>10250.00</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>10250.00</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">2050.00</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>12300.00</ram:GrandTotalAmount>
        <ram:DuePayableAmount>12300.00</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>
```

## Chorus Pro / PPF — B2G/B2B-Pflicht

| Empfängertyp | Plattform | Pflicht seit |
|---|---|---|
| Bund/Staat | Chorus Pro | 01.01.2017 (große), 01.01.2020 (alle) |
| B2B Empfangspflicht | PPF + PDP (Y-Modell) | 01.09.2026 |
| B2B Sendepflicht große Unt. | PPF/PDP | 01.09.2026 |
| B2B Sendepflicht KMU | PPF/PDP | 01.09.2027 |

- **Chorus Pro:** https://chorus-pro.gouv.fr
- **PPF:** Plateforme nationale de l'État (DGFiP)
- **PDP:** zertifizierte private Provider (Generix, Esker, Pagero, Tradeshift, Yooz)

## SAP-Integration

- **SAP Document and Reporting Compliance (DRC) für FR**
- Generiert Factur-X (Profil EN 16931) oder UBL/CII reines XML
- Versendet via Chorus-Pro-API (B2G) oder PPF/PDP (B2B ab 09/2026)
- SIRET der Empfänger korrekt im KNA1 pflegen

## Migration-Roadmap

| Phase | Zeitpunkt | Aufgabe |
|---|---|---|
| Q4 2025 | jetzt | PPF-Pilot starten, PDP-Provider auswählen |
| Q1 2026 | jetzt+3 | PPF-Onboarding mit Zertifizierung |
| Q3 2026 | jetzt+5 | Go-Live PPF B2B (Empfangspflicht alle) |
| Q3 2027 | jetzt+17 | KMU/Microentreprises Sendepflicht |
