-- Migration 0008: country_blocks table for structured country profiles
CREATE TABLE IF NOT EXISTS country_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  block_no int NOT NULL,
  block_title text NOT NULL,
  row_order int NOT NULL,
  feld text NOT NULL,
  experte text,
  einsteiger text,
  praxis text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS country_blocks_lookup
  ON country_blocks (country_code, block_no, row_order);
