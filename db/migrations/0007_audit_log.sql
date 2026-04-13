CREATE TABLE entry_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  row_id uuid NOT NULL,
  field text NOT NULL,
  old_value text,
  new_value text,
  edited_at timestamptz DEFAULT now(),
  edited_by text DEFAULT 'shared'
);
CREATE INDEX entry_audit_lookup ON entry_audit (table_name, row_id, edited_at DESC);
