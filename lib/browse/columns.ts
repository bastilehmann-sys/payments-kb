/**
 * Shared column definitions for all section pages.
 * Imported by both section browse pages and the edit page.
 */
import type { Column } from '@/components/browse/split-view';

export const REGULATORIK_COLUMNS: Column[] = [
  // Allgemein
  { key: 'kuerzel',                label: 'Kürzel',                section: 'Allgemein' },
  { key: 'name',                   label: 'Name',                  section: 'Allgemein' },
  { key: 'typ',                    label: 'Typ',                   section: 'Allgemein' },
  { key: 'kategorie',              label: 'Kategorie',             section: 'Allgemein' },
  { key: 'geltungsbereich',        label: 'Geltungsbereich',       section: 'Allgemein' },
  { key: 'status_version',         label: 'Status / Version',      section: 'Allgemein' },
  { key: 'in_kraft_seit',          label: 'In Kraft seit',         section: 'Allgemein' },
  { key: 'naechste_aenderung',     label: 'Nächste Änderung',      section: 'Allgemein' },
  { key: 'behoerde_link',          label: 'Behörde / Link',        section: 'Allgemein' },
  { key: 'betroffene_abteilungen', label: 'Betroffene Abteilungen',section: 'Allgemein' },
  // Beschreibung
  { key: 'beschreibung_experte',    label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger', label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Auswirkungen
  { key: 'auswirkungen_experte',    label: 'Auswirkungen (Experte)',   section: 'Auswirkungen' },
  { key: 'auswirkungen_einsteiger', label: 'Auswirkungen (Einsteiger)',section: 'Auswirkungen' },
  // Pflichtmaßnahmen
  { key: 'pflichtmassnahmen_experte',    label: 'Pflichtmaßnahmen (Experte)',   section: 'Pflichtmaßnahmen' },
  { key: 'pflichtmassnahmen_einsteiger', label: 'Pflichtmaßnahmen (Einsteiger)',section: 'Pflichtmaßnahmen' },
  // Best Practice
  { key: 'best_practice_experte',    label: 'Best Practice (Experte)',   section: 'Best Practice' },
  { key: 'best_practice_einsteiger', label: 'Best Practice (Einsteiger)',section: 'Best Practice' },
  // Risiken
  { key: 'risiken_experte',    label: 'Risiken (Experte)',   section: 'Risiken' },
  { key: 'risiken_einsteiger', label: 'Risiken (Einsteiger)',section: 'Risiken' },
];

export const FORMAT_COLUMNS: Column[] = [
  // Allgemein
  { key: 'format_name',      label: 'Format-Name',        section: 'Allgemein' },
  { key: 'aktuelle_version', label: 'Aktuelle Version',   section: 'Allgemein' },
  { key: 'nachrichtentyp',   label: 'Nachrichtentyp',     section: 'Allgemein' },
  { key: 'familie_standard', label: 'Familie / Standard', section: 'Allgemein' },
  { key: 'datenrichtung',    label: 'Datenrichtung',      section: 'Allgemein' },
  { key: 'sap_relevanz',     label: 'SAP-Relevanz',       section: 'Allgemein' },
  { key: 'status',           label: 'Status',             section: 'Allgemein' },
  // Versionen
  { key: 'versionshistorie', label: 'Versionshistorie', section: 'Versionen' },
  // Beschreibung
  { key: 'beschreibung_experte',    label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger', label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Aufbau
  { key: 'wichtige_felder', label: 'Wichtige Felder', section: 'Aufbau' },
  { key: 'pflichtfelder',   label: 'Pflichtfelder',   section: 'Aufbau' },
  // SAP
  { key: 'sap_mapping_experte',    label: 'SAP Mapping (Experte)',   section: 'SAP' },
  { key: 'sap_mapping_einsteiger', label: 'SAP Mapping (Einsteiger)',section: 'SAP' },
  // Fehler
  { key: 'fehlerquellen_experte',    label: 'Fehlerquellen (Experte)',   section: 'Fehler & Risiken' },
  { key: 'fehlerquellen_einsteiger', label: 'Fehlerquellen (Einsteiger)',section: 'Fehler & Risiken' },
  { key: 'projektfehler_experte',    label: 'Projektfehler (Experte)',   section: 'Fehler & Risiken' },
  { key: 'projektfehler_einsteiger', label: 'Projektfehler (Einsteiger)',section: 'Fehler & Risiken' },
];

export const CLEARING_COLUMNS: Column[] = [
  // Allgemein
  { key: 'name',              label: 'Name',             section: 'Allgemein' },
  { key: 'abkuerzung',        label: 'Abkürzung',        section: 'Allgemein' },
  { key: 'region',            label: 'Region',           section: 'Allgemein' },
  { key: 'typ',               label: 'Typ',              section: 'Allgemein' },
  { key: 'nachrichtenformat', label: 'Nachrichtenformat',section: 'Allgemein' },
  { key: 'betreiber',         label: 'Betreiber',        section: 'Allgemein' },
  { key: 'status',            label: 'Status',           section: 'Allgemein' },
  // Beschreibung
  { key: 'beschreibung_experte',    label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger', label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Aufbau & Settlement
  { key: 'settlement_modell', label: 'Settlement-Modell',section: 'Aufbau & Settlement' },
  { key: 'cut_off',           label: 'Cut-off-Zeiten',  section: 'Aufbau & Settlement' },
  // Teilnehmer
  { key: 'teilnehmer', label: 'Teilnehmer', section: 'Teilnehmer' },
  // Corporate
  { key: 'relevanz_experte',           label: 'Relevanz (Experte)',          section: 'Corporate' },
  { key: 'relevanz_einsteiger',        label: 'Relevanz (Einsteiger)',       section: 'Corporate' },
  { key: 'corporate_zugang_experte',   label: 'Corporate-Zugang (Experte)',  section: 'Corporate' },
  { key: 'corporate_zugang_einsteiger',label: 'Corporate-Zugang (Einsteiger)',section: 'Corporate' },
];

export const ZAHLUNGSART_COLUMNS: Column[] = [
  // Allgemein
  { key: 'name',                     label: 'Name',                     section: 'Allgemein' },
  { key: 'kuerzel',                  label: 'Kürzel',                   section: 'Allgemein' },
  { key: 'instrument_typ',           label: 'Instrument / Typ',         section: 'Allgemein' },
  { key: 'geltungsbereich_waehrung', label: 'Geltungsbereich / Währung',section: 'Allgemein' },
  { key: 'clearing_system',          label: 'Clearing-System',          section: 'Allgemein' },
  { key: 'nachrichtenformat',        label: 'Nachrichtenformat',        section: 'Allgemein' },
  // Beschreibung
  { key: 'beschreibung_experte',    label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger', label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Timing
  { key: 'cut_off',                 label: 'Cut-off-Zeiten',           section: 'Timing' },
  { key: 'value_date_auftraggeber', label: 'Value Date (Auftraggeber)', section: 'Timing' },
  { key: 'value_date_empfaenger',   label: 'Value Date (Empfänger)',   section: 'Timing' },
  { key: 'fristen_vorlaufzeiten',   label: 'Fristen & Vorlaufzeiten',  section: 'Timing' },
  // Kosten & Limits
  { key: 'kosten', label: 'Kosten', section: 'Kosten & Limits' },
  { key: 'limits', label: 'Limits', section: 'Kosten & Limits' },
  // Corporate
  { key: 'corporate_relevanz_experte',    label: 'Corporate-Relevanz (Experte)',   section: 'Corporate' },
  { key: 'corporate_relevanz_einsteiger', label: 'Corporate-Relevanz (Einsteiger)',section: 'Corporate' },
  // Risiken
  { key: 'risiken_experte',    label: 'Risiken (Experte)',   section: 'Risiken' },
  { key: 'risiken_einsteiger', label: 'Risiken (Einsteiger)',section: 'Risiken' },
  // Länder
  { key: 'laenderverfuegbarkeit',    label: 'Länderverfügbarkeit',   section: 'Länder' },
  { key: 'laender_einschraenkungen', label: 'Länder-Einschränkungen',section: 'Länder' },
];

export const IHB_COLUMNS: Column[] = [
  // Land
  { key: 'land',         label: 'Land',          section: 'Land' },
  { key: 'iso_waehrung', label: 'ISO / Währung', section: 'Land' },
  { key: 'region',       label: 'Region',         section: 'Land' },
  { key: 'ihb_bewertung',label: 'IHB-Bewertung', section: 'Land' },
  // Status
  { key: 'pobo_status',     label: 'POBO-Status',                section: 'Status' },
  { key: 'cobo_status',     label: 'COBO-Status',                section: 'Status' },
  { key: 'netting_erlaubt', label: 'Netting erlaubt?',           section: 'Status' },
  { key: 'lokales_konto',   label: 'Lokales Konto erforderlich?',section: 'Status' },
  // Einschränkungen
  { key: 'einschraenkungen_experte',    label: 'Einschränkungen (Experte)',   section: 'Einschränkungen' },
  { key: 'einschraenkungen_einsteiger', label: 'Einschränkungen (Einsteiger)',section: 'Einschränkungen' },
  // Rechtlich
  { key: 'rechtsgrundlage', label: 'Rechtsgrundlage', section: 'Rechtlich' },
  // Design
  { key: 'ihb_design_experte',    label: 'IHB-Design (Experte)',   section: 'Design' },
  { key: 'ihb_design_einsteiger', label: 'IHB-Design (Einsteiger)',section: 'Design' },
  // SAP
  { key: 'sap_config_experte',    label: 'SAP-Konfiguration (Experte)',   section: 'SAP' },
  { key: 'sap_config_einsteiger', label: 'SAP-Konfiguration (Einsteiger)',section: 'SAP' },
  // Empfehlung
  { key: 'handlungsempfehlung', label: 'Handlungsempfehlung', section: 'Empfehlung' },
];

export const COUNTRIES_COLUMNS: Column[] = [
  // Übersicht
  { key: 'code',       label: 'ISO-Code',         section: 'Übersicht' },
  { key: 'name',       label: 'Land',             section: 'Übersicht' },
  { key: 'complexity', label: 'Komplexität',       section: 'Übersicht' },
  { key: 'currency',   label: 'Währung',           section: 'Übersicht' },
  { key: 'summary',    label: 'Zusammenfassung',   section: 'Übersicht' },
  // Payment-Infrastruktur
  { key: 'payment_infra', label: 'Payment-Infrastruktur', section: 'Payment-Infrastruktur' },
  // IHB/POBO/COBO
  { key: 'ihb_pobo_cobo', label: 'IHB / POBO / COBO', section: 'IHB / POBO / COBO' },
  // Regulatorik
  { key: 'regulatorik', label: 'Regulatorik', section: 'Regulatorik' },
  // Lokale Besonderheiten
  { key: 'local_specifics', label: 'Lokale Besonderheiten', section: 'Lokale Besonderheiten' },
  // SAP-Aufwand
  { key: 'sap_effort', label: 'SAP-Aufwand', section: 'SAP-Aufwand' },
  // Wichtigster Hinweis
  { key: 'key_note', label: 'Wichtigster Hinweis', section: 'Wichtigster Hinweis' },
];

export const COLUMNS_FOR_TABLE: Record<string, Column[]> = {
  regulatorik_entries: REGULATORIK_COLUMNS,
  format_entries:      FORMAT_COLUMNS,
  clearing_entries:    CLEARING_COLUMNS,
  zahlungsart_entries: ZAHLUNGSART_COLUMNS,
  ihb_entries:         IHB_COLUMNS,
  countries:           COUNTRIES_COLUMNS,
};
