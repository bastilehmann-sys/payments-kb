-- Clearing v2: SAP-Bezug-Feld
ALTER TABLE clearing_entries
  ADD COLUMN IF NOT EXISTS sap_bezug text;
