-- format_entries v3: strukturierter Content pro Format
ALTER TABLE format_entries
  ADD COLUMN IF NOT EXISTS structure           jsonb,
  ADD COLUMN IF NOT EXISTS migrations          jsonb,
  ADD COLUMN IF NOT EXISTS feature_defs        jsonb,
  ADD COLUMN IF NOT EXISTS character_set       text,
  ADD COLUMN IF NOT EXISTS reject_code_group   text,
  ADD COLUMN IF NOT EXISTS schema_uri_pattern  text,
  ADD COLUMN IF NOT EXISTS region              text,
  ADD COLUMN IF NOT EXISTS source_refs         jsonb,
  ADD COLUMN IF NOT EXISTS content_status      text;

COMMENT ON COLUMN format_entries.content_status IS 'verified | partial | unknown';
