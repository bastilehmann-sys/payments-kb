-- Migration: Typed tables for Excel sheets 01-05
-- Sheet 01: Regulatorik-Glossar
-- Sheet 02: Format-Bibliothek
-- Sheet 03: Clearing-Systeme
-- Sheet 04: Zahlungsarten
-- Sheet 05: IHB-POBO-COBO

-- ============================================================
-- Sheet 01: Regulatorik-Glossar
-- Columns from row 4: Kürzel | Vollständiger Name | Kategorie | Typ
--   | Kurzbeschreibung (Experten-Version) | Kurzbeschreibung (Einsteiger-Version)
--   | Geltungsbereich | Status / Version | In Kraft seit | Nächste Änderung
--   | Zuständige Behörde & Link | Betroffene Abteilungen
--   | Auswirkungen (Experte) | Auswirkungen (Einsteiger)
--   | Pflichtmaßnahmen (Experte) | Pflichtmaßnahmen (Einsteiger)
--   | Best Practice (Experte) | Best Practice (Einsteiger)
--   | Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger)
-- ============================================================
CREATE TABLE IF NOT EXISTS regulatorik_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kuerzel text,
  name text NOT NULL,
  kategorie text,
  typ text,
  beschreibung_experte text,
  beschreibung_einsteiger text,
  geltungsbereich text,
  status_version text,
  in_kraft_seit text,
  naechste_aenderung text,
  behoerde_link text,
  betroffene_abteilungen text,
  auswirkungen_experte text,
  auswirkungen_einsteiger text,
  pflichtmassnahmen_experte text,
  pflichtmassnahmen_einsteiger text,
  best_practice_experte text,
  best_practice_einsteiger text,
  risiken_experte text,
  risiken_einsteiger text,
  source_row int,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Sheet 02: Format-Bibliothek
-- Columns from row 4: Format-Name | Nachrichtentyp | Familie / Standard
--   | Aktuelle Version | Versionshistorie | Zweck & Verwendung (Experte)
--   | Zweck & Verwendung (Einsteiger) | Wichtige Felder (technisch)
--   | Pflichtfelder | Datenrichtung | SAP-Relevanz (Bereich)
--   | Typische Fehlerquellen (Experte) | Typische Fehlerquellen (Einsteiger)
--   | SAP-Mapping (Experte) | SAP-Mapping (Einsteiger)
--   | Häufige Projektfehler (Experte) | Häufige Projektfehler (Einsteiger)
--   | Status / Ablösung
-- ============================================================
CREATE TABLE IF NOT EXISTS format_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  format_name text NOT NULL,
  nachrichtentyp text,
  familie_standard text,
  aktuelle_version text,
  versionshistorie text,
  beschreibung_experte text,
  beschreibung_einsteiger text,
  wichtige_felder text,
  pflichtfelder text,
  datenrichtung text,
  sap_relevanz text,
  fehlerquellen_experte text,
  fehlerquellen_einsteiger text,
  sap_mapping_experte text,
  sap_mapping_einsteiger text,
  projektfehler_experte text,
  projektfehler_einsteiger text,
  status text,
  source_row int,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Sheet 03: Clearing-Systeme
-- Columns from row 4: System-Name | Abkürzung | Typ | Region / Land | Betreiber
--   | Systembeschreibung (Experte) | Systembeschreibung (Einsteiger)
--   | Nachrichtenformat | Settlement-Modell & Zyklen | Betriebszeiten & Cut-offs
--   | Direkte Teilnehmer & Zugang | Relevanz & Auswirkung (Experte)
--   | Relevanz & Auswirkung (Einsteiger) | Corporate Zugang & SAP-Anbindung (Experte)
--   | Corporate Zugang & SAP-Anbindung (Einsteiger) | Status / Entwicklung
-- ============================================================
CREATE TABLE IF NOT EXISTS clearing_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  abkuerzung text,
  typ text,
  region text,
  betreiber text,
  beschreibung_experte text,
  beschreibung_einsteiger text,
  nachrichtenformat text,
  settlement_modell text,
  cut_off text,
  teilnehmer text,
  relevanz_experte text,
  relevanz_einsteiger text,
  corporate_zugang_experte text,
  corporate_zugang_einsteiger text,
  status text,
  source_row int,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Sheet 04: Zahlungsarten
-- Columns from row 4: Zahlungsart | Kürzel / Code | Instrument-Typ
--   | Geltungsbereich & Währung | Clearing-System | Nachrichtenformat
--   | Beschreibung (Experte) | Beschreibung (Einsteiger)
--   | Cut-off-Zeiten (Einreichung bei Bank) | Value Date Auftraggeber
--   | Value Date Empfänger | Besondere Fristen & Vorlaufzeiten
--   | Typische Kosten (Richtwerte) | Betragslimits
--   | Corporate Relevanz & SAP-Praxis (Experte) | Corporate Relevanz & SAP-Praxis (Einsteiger)
--   | Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger)
--   | Länderverfügbarkeit & regionale Besonderheiten
--   | Länder mit Einschränkungen & lokale Varianten
-- ============================================================
CREATE TABLE IF NOT EXISTS zahlungsart_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kuerzel text,
  instrument_typ text,
  geltungsbereich_waehrung text,
  clearing_system text,
  nachrichtenformat text,
  beschreibung_experte text,
  beschreibung_einsteiger text,
  cut_off text,
  value_date_auftraggeber text,
  value_date_empfaenger text,
  fristen_vorlaufzeiten text,
  kosten text,
  limits text,
  corporate_relevanz_experte text,
  corporate_relevanz_einsteiger text,
  risiken_experte text,
  risiken_einsteiger text,
  laenderverfuegbarkeit text,
  laender_einschraenkungen text,
  source_row int,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Sheet 05: IHB-POBO-COBO
-- Columns from row 4: Land | ISO-Code / Währung | Region | Gesamt-Bewertung IHB
--   | POBO möglich? | COBO möglich? | Intragroup Netting erlaubt?
--   | Lokales Konto erforderlich? | Einschränkungsgründe (Experte)
--   | Einschränkungsgründe (Einsteiger) | Rechtliche Grundlage & Behörde
--   | Auswirkung auf IHB-Design (Experte) | Auswirkung auf IHB-Design (Einsteiger)
--   | SAP-Konfiguration (Experte) | SAP-Konfiguration (Einsteiger)
--   | Handlungsempfehlung & nächste Schritte
-- ============================================================
CREATE TABLE IF NOT EXISTS ihb_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  land text NOT NULL,
  iso_waehrung text,
  region text,
  ihb_bewertung text,
  pobo_status text,
  cobo_status text,
  netting_erlaubt text,
  lokales_konto text,
  einschraenkungen_experte text,
  einschraenkungen_einsteiger text,
  rechtsgrundlage text,
  ihb_design_experte text,
  ihb_design_einsteiger text,
  sap_config_experte text,
  sap_config_einsteiger text,
  handlungsempfehlung text,
  source_row int,
  created_at timestamptz DEFAULT now()
);
