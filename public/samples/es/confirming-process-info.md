# Confirming (Reverse Factoring) — ES-Prozess

## Was ist Confirming?

**Confirming** ist ein in Spanien sehr verbreitetes Lieferantenfinanzierungs-
Instrument. Eine Bank übernimmt die Zahlungsverpflichtung des Käufers und
bietet dem Lieferanten eine **Frühauszahlung gegen Diskont** an.

Marktanteil ES-Lieferantenfinanzierung > 60%. Akteure: alle Großbanken
(CaixaBank, BBVA, Santander, Sabadell).

- **Quelle:** https://www.aebanca.es (Asociación Española de Banca)

## Prozessablauf

```
┌─────────────────┐                  ┌──────────────────┐
│  Käufer (KMU)   │   1. Rechnung    │  Lieferant       │
│  EJEMPLO SA     │ ◄──────────────  │  GARCIA SL       │
└────┬────────────┘                  └────────▲─────────┘
     │ 2. Confirming-                          │
     │    Auftrag                              │ 5. Frühauszahlung
     ▼                                          │    (oder Wartung)
┌─────────────────┐  3. Notification  ┌────────┴─────────┐
│  Hausbank       │ ──────────────►   │  Lieferanten-    │
│  CAIXABANK      │                   │  Bank (frei wähl.)│
│                 │  4. Diskont-      │                  │
│                 │     Angebot       │                  │
│                 │ ◄──────────────► │                   │
└─────────────────┘  6. Zahlung am   └──────────────────┘
                       Fälligkeitstag
```

## SAP-Relevanz

**Kein SAP-Standard** für Confirming. Add-Ons:

- **Serrala FS² Confirming** — für CaixaBank, BBVA, Santander
- **Hanse Orga FS² Confirming** — Multi-Bank
- **Serres Confirming** — Bankspezifisch

## Beispiel-Confirming-Auftrag (CSV-Format CaixaBank)

```csv
"NIF_PROVEEDOR";"NOMBRE";"IBAN";"FECHA_VENC";"IMPORTE";"REF_FACTURA";"DIVISA"
"B98765432";"SUMINISTROS GARCÍA SL";"ES7901824567890987654321";"15/05/2026";"8920.00";"FACT-2026-04-0307";"EUR"
"B22334455";"PROVEEDOR INDUSTRIAL SL";"ES2401822233445566778899";"20/05/2026";"3450.00";"FACT-2026-04-0312";"EUR"
```

## Auswirkungen auf die Buchhaltung

| Sicht | Buchung |
|---|---|
| Käufer (EJEMPLO SA) | Lieferant offen bis Bank-Zahlung am Fälligkeitstag |
| Lieferant (Frühauszahlung) | Bank-Zahlung sofort, Diskont als Aufwand |
| Lieferant (Warten) | Normale Bank-Zahlung am Fälligkeitstag |

## Hinweise für Treasury

- Bei großem ES-Lieferantenvolumen (> EUR 10 Mio./Jahr): Add-On wirtschaftlich
- Confirming-Konditionen verhandelbar mit Hausbank — typisch 1-3% Diskont
- Für Lieferanten-Beziehungsmanagement attraktiv: weniger Working-Capital-Druck
