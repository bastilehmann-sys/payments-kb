ALTER TABLE countries ADD COLUMN IF NOT EXISTS currency text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS payment_infra text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS ihb_pobo_cobo text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS regulatorik text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS local_specifics text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS sap_effort text;
ALTER TABLE countries ADD COLUMN IF NOT EXISTS key_note text;
