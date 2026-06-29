CREATE TABLE scope_analyses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT,
  heimatland       TEXT NOT NULL,
  ops_laender      TEXT[] NOT NULL DEFAULT '{}',
  hausbank_laender TEXT[] NOT NULL DEFAULT '{}',
  flag_konzern     BOOLEAN NOT NULL DEFAULT false,
  flag_s4hana      BOOLEAN NOT NULL DEFAULT false,
  flag_dringend    BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
