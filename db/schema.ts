import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  boolean,
  customType,
} from 'drizzle-orm/pg-core';

// --- Custom types ---

// tsvector — generated/read-only column
const tsvectorType = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'tsvector';
  },
});

// --- Tables ---

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  source_file: text('source_file'),
  section: text('section'), // 'regulatorik' | 'formate' | 'clearing' | 'ihb' | 'laender'
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  content_md: text('content_md').notNull(),
  content_hash: text('content_hash').notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const chunks = pgTable('chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  document_id: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }),
  chunk_index: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  heading: text('heading'),
  tsv: tsvectorType('tsv'),
  metadata: jsonb('metadata'),
});

// ============================================================
// Structured entry tables (Excel sheets 01-05)
// ============================================================

export const regulatorikEntries = pgTable('regulatorik_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  kuerzel: text('kuerzel'),
  name: text('name').notNull(),
  kategorie: text('kategorie'),
  typ: text('typ'),
  beschreibung_experte: text('beschreibung_experte'),
  beschreibung_einsteiger: text('beschreibung_einsteiger'),
  geltungsbereich: text('geltungsbereich'),
  status_version: text('status_version'),
  in_kraft_seit: text('in_kraft_seit'),
  naechste_aenderung: text('naechste_aenderung'),
  behoerde_link: text('behoerde_link'),
  betroffene_abteilungen: text('betroffene_abteilungen'),
  auswirkungen_experte: text('auswirkungen_experte'),
  auswirkungen_einsteiger: text('auswirkungen_einsteiger'),
  pflichtmassnahmen_experte: text('pflichtmassnahmen_experte'),
  pflichtmassnahmen_einsteiger: text('pflichtmassnahmen_einsteiger'),
  best_practice_experte: text('best_practice_experte'),
  best_practice_einsteiger: text('best_practice_einsteiger'),
  risiken_experte: text('risiken_experte'),
  risiken_einsteiger: text('risiken_einsteiger'),
  source_row: integer('source_row'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const formatEntries = pgTable('format_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  format_name: text('format_name').notNull(),
  nachrichtentyp: text('nachrichtentyp'),
  familie_standard: text('familie_standard'),
  aktuelle_version: text('aktuelle_version'),
  versionshistorie: text('versionshistorie'),
  beschreibung_experte: text('beschreibung_experte'),
  beschreibung_einsteiger: text('beschreibung_einsteiger'),
  wichtige_felder: text('wichtige_felder'),
  pflichtfelder: text('pflichtfelder'),
  datenrichtung: text('datenrichtung'),
  sap_relevanz: text('sap_relevanz'),
  fehlerquellen_experte: text('fehlerquellen_experte'),
  fehlerquellen_einsteiger: text('fehlerquellen_einsteiger'),
  sap_mapping_experte: text('sap_mapping_experte'),
  sap_mapping_einsteiger: text('sap_mapping_einsteiger'),
  projektfehler_experte: text('projektfehler_experte'),
  projektfehler_einsteiger: text('projektfehler_einsteiger'),
  status: text('status'),
  source_row: integer('source_row'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const clearingEntries = pgTable('clearing_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  abkuerzung: text('abkuerzung'),
  typ: text('typ'),
  region: text('region'),
  betreiber: text('betreiber'),
  beschreibung_experte: text('beschreibung_experte'),
  beschreibung_einsteiger: text('beschreibung_einsteiger'),
  nachrichtenformat: text('nachrichtenformat'),
  settlement_modell: text('settlement_modell'),
  cut_off: text('cut_off'),
  teilnehmer: text('teilnehmer'),
  relevanz_experte: text('relevanz_experte'),
  relevanz_einsteiger: text('relevanz_einsteiger'),
  corporate_zugang_experte: text('corporate_zugang_experte'),
  corporate_zugang_einsteiger: text('corporate_zugang_einsteiger'),
  status: text('status'),
  source_row: integer('source_row'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const zahlungsartEntries = pgTable('zahlungsart_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  kuerzel: text('kuerzel'),
  instrument_typ: text('instrument_typ'),
  geltungsbereich_waehrung: text('geltungsbereich_waehrung'),
  clearing_system: text('clearing_system'),
  nachrichtenformat: text('nachrichtenformat'),
  beschreibung_experte: text('beschreibung_experte'),
  beschreibung_einsteiger: text('beschreibung_einsteiger'),
  cut_off: text('cut_off'),
  value_date_auftraggeber: text('value_date_auftraggeber'),
  value_date_empfaenger: text('value_date_empfaenger'),
  fristen_vorlaufzeiten: text('fristen_vorlaufzeiten'),
  kosten: text('kosten'),
  limits: text('limits'),
  corporate_relevanz_experte: text('corporate_relevanz_experte'),
  corporate_relevanz_einsteiger: text('corporate_relevanz_einsteiger'),
  risiken_experte: text('risiken_experte'),
  risiken_einsteiger: text('risiken_einsteiger'),
  laenderverfuegbarkeit: text('laenderverfuegbarkeit'),
  laender_einschraenkungen: text('laender_einschraenkungen'),
  source_row: integer('source_row'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const ihbEntries = pgTable('ihb_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  land: text('land').notNull(),
  iso_waehrung: text('iso_waehrung'),
  region: text('region'),
  ihb_bewertung: text('ihb_bewertung'),
  pobo_status: text('pobo_status'),
  cobo_status: text('cobo_status'),
  netting_erlaubt: text('netting_erlaubt'),
  lokales_konto: text('lokales_konto'),
  einschraenkungen_experte: text('einschraenkungen_experte'),
  einschraenkungen_einsteiger: text('einschraenkungen_einsteiger'),
  rechtsgrundlage: text('rechtsgrundlage'),
  ihb_design_experte: text('ihb_design_experte'),
  ihb_design_einsteiger: text('ihb_design_einsteiger'),
  sap_config_experte: text('sap_config_experte'),
  sap_config_einsteiger: text('sap_config_einsteiger'),
  handlungsempfehlung: text('handlungsempfehlung'),
  source_row: integer('source_row'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================
// Countries table (Sheet 06)
// ============================================================

// ============================================================
// format_versions table (per-version metadata for ISO 20022 format families)
// ============================================================

export const formatVersions = pgTable('format_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  format_name: text('format_name').notNull(),
  version: text('version').notNull(),
  released: text('released'),
  sample_file: text('sample_file'),
  is_current: boolean('is_current').default(false),
  notes: text('notes'),
  schema_uri: text('schema_uri'),
  source_standard: text('source_standard'),
});

export const countries = pgTable('countries', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  complexity: text('complexity').notNull(), // 'low' | 'medium' | 'high'
  summary: text('summary'),
  document_id: uuid('document_id').references(() => documents.id, { onDelete: 'set null' }),
  // Enrichment columns from Sheet 06
  currency: text('currency'),
  payment_infra: text('payment_infra'),
  ihb_pobo_cobo: text('ihb_pobo_cobo'),
  regulatorik: text('regulatorik'),
  local_specifics: text('local_specifics'),
  sap_effort: text('sap_effort'),
  key_note: text('key_note'),
});
