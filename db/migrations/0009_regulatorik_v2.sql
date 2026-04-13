-- Regulatorik v2: 5 neue Felder + Unique-Index auf kuerzel
ALTER TABLE regulatorik_entries
  ADD COLUMN IF NOT EXISTS verwandte_regulierungen text,
  ADD COLUMN IF NOT EXISTS sap_bezug text,
  ADD COLUMN IF NOT EXISTS bussgeld text,
  ADD COLUMN IF NOT EXISTS pruefpflicht text,
  ADD COLUMN IF NOT EXISTS aufwand_tshirt text;

CREATE UNIQUE INDEX IF NOT EXISTS regulatorik_entries_kuerzel_uniq
  ON regulatorik_entries (kuerzel)
  WHERE kuerzel IS NOT NULL;
