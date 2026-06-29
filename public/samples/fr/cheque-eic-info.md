# Chèque & EIC — FR-Scheckverkehr

## Chèque Bancaire (Bankscheck)

In Frankreich weiterhin verbreitet — anders als in DE/NL praktisch obsolet.
Marktanteil rückläufig, aber besonders in Bau, KMU, Vereinen und der älteren
Generation noch präsent.

- **Keine gesetzliche Scheckgebühr** in FR (im Gegensatz zu DE)
- **Scheckbetrug** als reales Risiko → FR-Banken nutzen FNCI-System

## EIC — Échange Image Chèques

Elektronisches Verarbeitungssystem für Schecks, betrieben von **STET** (gleicher
Betreiber wie CORE-FR). Bank scannt eingereichte Schecks, das Bild wird
elektronisch verarbeitet — der physische Scheck wird vernichtet.

- **Quelle:** https://www.banque-france.fr / https://www.stet.eu

## FNCI — Fichier National des Chèques Irréguliers

Nationale Datenbank für **gesperrte Schecks und Konten**. Banken prüfen vor
Einreichung gegen FNCI. Betreiber: Banque de France.

- **Zweck:** Vermeidung von Scheckbetrug (gestohlene/gesperrte Schecks)

## SAP-Integration

| Bereich | Standard | Empfehlung |
|---|---|---|
| Scheckausstellung | F-58 / F110 | bei großem Volumen: Outsourcing |
| Scheckeinreichung | manuell | bei großem Volumen: EIC via Hausbank |
| EIC-Verarbeitung | kein Standard | Hausbank-Portal nutzen |

## Outsourcing-Optionen

Bei größerem Scheckvolumen empfehlen sich Dienstleister:

- **Edenred** (mahnte Mahnpapiere, Lohnschecks)
- **Yousign** (digitale Schecks für KMU)
- **Hausbank-Lösungen** (BNP, SocGen bieten Scheck-Centers)

## Trend

Chèque-Volumen sinkt jährlich um ca. 8-12%. Migration auf SEPA SCT, LCR oder
Karten/Bizum-äquivalente FR-Systeme im Gange. Bei Neuinstallationen: kein
neuer Aufwand, nur Restbestand verwalten.
