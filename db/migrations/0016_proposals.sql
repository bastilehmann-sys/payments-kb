CREATE TABLE proposals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_date  TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE proposal_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id       UUID REFERENCES proposals(id) ON DELETE CASCADE,
  topic             TEXT NOT NULL,
  target_file       TEXT NOT NULL,
  target_section    TEXT,
  reasoning         TEXT NOT NULL,
  sources           JSONB NOT NULL,
  content_outline   TEXT NOT NULL,
  comment           TEXT,
  generated_content TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  revised_at        TIMESTAMPTZ,
  executed_at       TIMESTAMPTZ
);
