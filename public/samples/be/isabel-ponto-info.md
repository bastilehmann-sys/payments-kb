# Isabel 6 / Ponto — BE-Multibank-Kanäle

## Isabel 6

**Isabel 6** ist die belgische Multibank-Plattform für Corporate Banking,
betrieben von der **Isabel Group** (Gemeinschaftsunternehmen der BE-Banken).

- **Status:** weit verbreitet bei BE-KMU ohne EBICS-Vertrag
- **Format:** proprietär, **kein EBICS**
- **Funktion:** Multibank in einer Oberfläche; SEPA-Upload, Kontoauszüge
  (CODA + camt.053)
- **Quelle:** https://www.isabel.eu

## Ponto API

**Ponto** ist die moderne PSD2-API-Plattform der Isabel Group — Nachfolger
für digitale Treasury-Integration.

- **Auth:** OAuth 2.0
- **Multi-Bank:** alle BE-Großbanken + viele EU-Banken
- **Use Cases:** Cloud Treasury, FinTech-Apps, Lieferantenportale
- **Quelle:** https://myponto.com

## SAP-Integration

| Pfad | Aufwand | Empfehlung |
|---|---|---|
| EBICS direkt | gering | wenn Hausbank EBICS bietet (Big 4 in BE) |
| Isabel 6 + Add-On | mittel | wenn KMU-BE-Tochter ohne EBICS |
| Ponto API | mittel-hoch | für Cloud-Treasury / S/4HANA Cloud |

**Add-On-Optionen für Isabel:**
- Serrala FS² Belgien-Modul
- Treamo Connect

**Beispiel Ponto API-Call** (Account Information Service, PSD2):

```http
GET /v1/financial-institutions/{financialInstitutionId}/accounts
Authorization: Bearer {access_token}
Content-Type: application/vnd.api+json
```

Response (gekürzt):

```json
{
  "data": [
    {
      "type": "account",
      "id": "ee52a-b58c-acct",
      "attributes": {
        "currency": "EUR",
        "subtype": "checking",
        "reference": "BE68539007547034",
        "referenceType": "IBAN"
      }
    }
  ]
}
```

## Migrationsempfehlung

Bei Neuinstallationen: **EBICS bevorzugen** (Big 4 BE bieten alle EBICS 3.0).
Isabel-/Ponto-Anbindung nur wenn Hausbank kein EBICS unterstützt oder bei
Cloud-only-Architektur.
