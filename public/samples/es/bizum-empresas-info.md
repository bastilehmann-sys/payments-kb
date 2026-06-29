# Bizum Empresas — Info-Übersicht

## Was ist Bizum?

**Bizum** ist das spanische mobile Echtzeit-Bezahlsystem, gestartet 2016 von
27 ES-Banken gemeinsam (heute alle Großbanken). Über **26 Millionen Nutzer**
(April 2026) — größtes ES-Mobile-Payment-System.

- **Backend:** SNCE / TIPS (Iberpay)
- **Identifier:** Mobilnummer (MSISDN) → IBAN
- **Quelle:** https://bizum.es

## Bizum Privat (P2P)

| Limit | Wert |
|---|---|
| Max. pro Zahlung | EUR 1.000 |
| Max. pro Tag | EUR 2.000 |
| Verfügbarkeit | 24/7 |

## Bizum Empresas (B2C)

Die Corporate-Variante ermöglicht Unternehmen, Zahlungen von Konsumenten
via Bizum zu empfangen.

| Use Case | Beispiel |
|---|---|
| E-Commerce | Online-Shop "Mit Bizum bezahlen" |
| Restaurants/Cafés | QR-Code am Tisch |
| NGOs / Spenden | Mobilnummer für Spenden |
| Mietzahlungen | Privater Vermieter empfängt Miete |

| Limit | Wert |
|---|---|
| Max. pro Zahlung | EUR 50.000 |
| Verfügbarkeit | 24/7 |
| Settlement | Echtzeit (SCT Inst) |

## SAP-Integration

- **Kein SAP-Standard-Connector** für Bizum
- **Verbuchung der Eingänge** als SEPA SCT Inst Gutschrift im camt.054
- **Erkennung** über `BkTxCd` und `Prtry: BIZUM` (bankspezifische Zusatzinfo)

```xml
<BkTxCd>
  <Domn>
    <Cd>PMNT</Cd>
    <Fmly><Cd>ICDT</Cd><SubFmlyCd>ESCT</SubFmlyCd></Fmly>
  </Domn>
  <Prtry>
    <Id>BIZUM</Id>
    <Issr>IBERPAY</Issr>
  </Prtry>
</BkTxCd>
```

## Integration für eigene Bizum Empresas-Anbindung

| Pfad | Aufwand | Details |
|---|---|---|
| Iberpay-API | hoch | direkt; nur für Banken/PSPs |
| Bank-Gateway | mittel | CaixaBank Sign, BBVA-Cash, Santander Box |
| PSP | gering | Adyen, Redsys, RedFlag |

## Hinweise für Treasury

- **B2C-Instrument** — irrelevant für Outgoing-Payments
- Bei ES-B2C-Töchtern (Retail, Gastro): **fast Pflicht** für Conversion
- Limits regelmäßig prüfen — Bizum-Limits werden alle 12-24 Monate angehoben
