-- Migration: format_versions table for per-version metadata per ISO 20022 format family
CREATE TABLE IF NOT EXISTS format_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  format_name text NOT NULL,        -- 'pain.001', 'pain.002', 'camt.053', 'MT103', etc.
  version text NOT NULL,             -- '001.001.03', '001.001.09', etc.
  released text,                     -- year or date
  sample_file text,                  -- '/samples/formate/pain.001.001.03.xml'
  is_current boolean DEFAULT false,
  notes text,                        -- 1–2 sentence summary of what's new
  schema_uri text,                   -- 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03'
  source_standard text,              -- 'ISO 20022 EPC SEPA 2009', 'ISO 20022 HVPS+', etc.
  UNIQUE (format_name, version)
);
