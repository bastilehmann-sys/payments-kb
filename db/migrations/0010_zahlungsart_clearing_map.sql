CREATE TABLE zahlungsart_clearing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zahlungsart_id uuid NOT NULL REFERENCES zahlungsart_entries(id) ON DELETE CASCADE,
  clearing_id uuid NOT NULL REFERENCES clearing_entries(id) ON DELETE CASCADE,
  note text,
  is_primary boolean DEFAULT false,
  UNIQUE (zahlungsart_id, clearing_id)
);
CREATE INDEX zac_zahlungsart_idx ON zahlungsart_clearing (zahlungsart_id);
CREATE INDEX zac_clearing_idx ON zahlungsart_clearing (clearing_id);
