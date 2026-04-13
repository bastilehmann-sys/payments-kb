import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
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
