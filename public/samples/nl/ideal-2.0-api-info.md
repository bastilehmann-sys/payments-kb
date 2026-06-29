# iDEAL 2.0 — NL-Online-Zahlungssystem

## Was ist iDEAL?

**iDEAL** ist das **niederländische Online-Zahlungssystem** und eines der
erfolgreichsten nationalen Online-Zahlungssysteme weltweit.

- **Marktanteil NL Online:** ca. 70%
- **Volumen 2024:** > 1,5 Mrd. Transaktionen/Jahr
- **Betreiber:** Currence (Gemeinschaftsunternehmen NL-Banken)
- **Backend:** SEPA SCT Inst über TIPS
- **Quelle:** https://www.ideal.nl

## iDEAL 2.0 (ab 2025)

Vereinheitlichtes API-System auf Open-Banking-Standard. Vorteile gegenüber
iDEAL 1.0:

| Feature | iDEAL 1.0 | iDEAL 2.0 |
|---|---|---|
| API | bankspezifisch | Open Banking Standard |
| Tokenisierung | nein | ja (wiederkehrende Zahlungen) |
| Multi-Currency | nein | ja |
| Identity Service | basic | erweitert (KYC light) |
| Add-on: iDEAL Subscription | — | ja (recurring payments) |

## Funktionsweise

```
1. Konsument wählt im Webshop "Met iDEAL betalen"
   ↓
2. Auswahl der eigenen Bank (ING, ABN, Rabobank, etc.)
   ↓
3. Weiterleitung zum Online-Banking der gewählten Bank
   ↓
4. Konsument autorisiert Zahlung (SCA: PIN, Fingerprint, FaceID)
   ↓
5. SEPA SCT Inst Zahlung wird ausgelöst
   ↓
6. Händler erhält Bestätigung in <10 Sekunden
   ↓
7. Verbuchung in Händler-Bank: camt.054 mit BkTxCd PMNT/RCDT/ESCT
```

## SAP-Integration

iDEAL ist **B2C-Eingang** — keine SAP-Outgoing-Logik.

| Pfad | Aufwand | Empfehlung |
|---|---|---|
| Direkt von Currence | hoch | nur große Händler |
| **PSP** (Adyen, Mollie, Stripe NL) | gering | Standard für E-Commerce |

### Beispiel — Adyen Payment Request (vereinfacht)

```http
POST /v1/payments
Content-Type: application/json
X-API-Key: ...

{
  "amount": {
    "value": 11950,
    "currency": "EUR"
  },
  "paymentMethod": {
    "type": "ideal",
    "issuer": "1121"
  },
  "reference": "ORDER-20260421-1547",
  "merchantAccount": "VoorbeeldBVMerchant",
  "returnUrl": "https://shop.voorbeeld.nl/return"
}
```

### Beispiel — camt.054 Eingang

```xml
<BkTxCd>
  <Domn>
    <Cd>PMNT</Cd>
    <Fmly>
      <Cd>RCDT</Cd>
      <SubFmlyCd>ESCT</SubFmlyCd>
    </Fmly>
  </Domn>
  <Prtry>
    <Id>IDEAL</Id>
    <Issr>CURRENCE</Issr>
  </Prtry>
</BkTxCd>
```

## NL E-Commerce-Best-Practices

- **iDEAL = Pflicht** für NL-Webshops (ohne iDEAL ca. 70% Conversion-Verlust)
- **PSP-Auswahl:** Adyen für Multi-Channel, Mollie für KMU, Stripe für SaaS
- **Confirmation of Payee (CoP):** seit 2017 in NL Standard — zukünftig PSD3-Pflicht EU-weit

## Tikkie (P2P)

**Tikkie** ist die P2P-Zahlungsapp von ABN AMRO auf iDEAL-Basis (gratis).
Sehr verbreitet in NL. Für Corporate **B2B nicht relevant**.
