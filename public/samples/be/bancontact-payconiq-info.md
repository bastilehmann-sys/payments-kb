# Bancontact / Payconiq — Info-Übersicht

## Was ist Bancontact?

Bancontact ist das **belgische Debitkartensystem** und das meistgenutzte
elektronische Zahlungsmittel in Belgien. Marktanteil > 50% bei BE-Online-Zahlungen,
> 80% an POS.

- **Betreiber:** Bancontact Company (gemeinsame Tochter der BE-Banken)
- **Backend für Online:** SEPA SCT Inst über Worldline-Acquiring
- **Format:** keine eigenen XML-Schemata — Verbuchung erfolgt im camt.054
  als SEPA-Gutschrift
- **Quelle:** https://www.bancontact.com

## Payconiq by Bancontact

QR-Code-basierte Mobile-Payment-App auf Bancontact-Infrastruktur. Settlement
ebenfalls via SEPA SCT Inst.

- **Quelle:** https://payconiq.be

## SAP-Integration

Da Bancontact-Eingänge **als SEPA SCT Inst Gutschriften** erscheinen, gibt es
**kein eigenes SAP-Format**. Verbuchung über:

1. **PSP-Auszug** (Worldline, Adyen, Mollie) als CSV/JSON in eigener Tabelle
2. **camt.054** der NL-/BE-Hausbank mit `BkTxCd: PMNT/ICDT/ESCT`
3. **Endkundenbuchung** über kundenseitige Referenz (EndToEndId mit Mandate)

Beispiel `BkTxCd` im camt.054 für Bancontact-Eingang:

```xml
<BkTxCd>
  <Domn>
    <Cd>PMNT</Cd>
    <Fmly>
      <Cd>ICDT</Cd>
      <SubFmlyCd>ESCT</SubFmlyCd>
    </Fmly>
  </Domn>
  <Prtry>
    <Id>BANCONTACT</Id>
    <Issr>WORLDLINE</Issr>
  </Prtry>
</BkTxCd>
```

## Hinweise für Treasury

- **B2C-Instrument** — irrelevant für B2B-Outgoing-Payments
- Bei NL-/BE-E-Commerce-Töchtern Bancontact als Zahlungseingang fast
  zwingend (Akzeptanzrate)
- Acquiring nur über Bancontact Company / Worldline — keine direkte
  Banken-API verfügbar
