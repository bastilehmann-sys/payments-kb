-- Structured Management Summary fields for countries.
-- Replaces the free-text `key_note` bullet list on the Länder detail view.
ALTER TABLE countries ADD COLUMN IF NOT EXISTS central_bank text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS iso20022_status text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS instant_payments text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS intercompany_netting text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS cash_pooling_external text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS pobo text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS pino_routing text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS special_format_requirements text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS special_regulatory_requirements text;
