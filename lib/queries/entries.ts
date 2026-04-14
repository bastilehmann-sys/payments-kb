/**
 * Queries for structured entry tables (Excel sheets 01-05) + format_versions.
 */
import { db } from '@/db/client';
import {
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  zahlungsartEntries,
  ihbEntries,
  formatVersions,
  zahlungsartClearing,
} from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export type RegulatorikEntry = typeof regulatorikEntries.$inferSelect;
export type FormatEntry = typeof formatEntries.$inferSelect;
export type ClearingEntry = typeof clearingEntries.$inferSelect;
export type ZahlungsartEntry = typeof zahlungsartEntries.$inferSelect;
export type IhbEntry = typeof ihbEntries.$inferSelect;
export type FormatVersion = typeof formatVersions.$inferSelect;

export async function getRegulatorikEntries(): Promise<RegulatorikEntry[]> {
  return db
    .select({
      id: regulatorikEntries.id,
      kuerzel: regulatorikEntries.kuerzel,
      name: regulatorikEntries.name,
      kategorie: regulatorikEntries.kategorie,
      typ: regulatorikEntries.typ,
      beschreibung_experte: regulatorikEntries.beschreibung_experte,
      beschreibung_einsteiger: regulatorikEntries.beschreibung_einsteiger,
      geltungsbereich: regulatorikEntries.geltungsbereich,
      status_version: regulatorikEntries.status_version,
      in_kraft_seit: regulatorikEntries.in_kraft_seit,
      naechste_aenderung: regulatorikEntries.naechste_aenderung,
      behoerde_link: regulatorikEntries.behoerde_link,
      betroffene_abteilungen: regulatorikEntries.betroffene_abteilungen,
      auswirkungen_experte: regulatorikEntries.auswirkungen_experte,
      auswirkungen_einsteiger: regulatorikEntries.auswirkungen_einsteiger,
      pflichtmassnahmen_experte: regulatorikEntries.pflichtmassnahmen_experte,
      pflichtmassnahmen_einsteiger: regulatorikEntries.pflichtmassnahmen_einsteiger,
      best_practice_experte: regulatorikEntries.best_practice_experte,
      best_practice_einsteiger: regulatorikEntries.best_practice_einsteiger,
      risiken_experte: regulatorikEntries.risiken_experte,
      risiken_einsteiger: regulatorikEntries.risiken_einsteiger,
      verwandte_regulierungen: regulatorikEntries.verwandte_regulierungen,
      sap_bezug: regulatorikEntries.sap_bezug,
      bussgeld: regulatorikEntries.bussgeld,
      pruefpflicht: regulatorikEntries.pruefpflicht,
      aufwand_tshirt: regulatorikEntries.aufwand_tshirt,
      source_row: regulatorikEntries.source_row,
      created_at: regulatorikEntries.created_at,
    })
    .from(regulatorikEntries)
    .orderBy(asc(regulatorikEntries.source_row));
}

export async function getFormatEntries(): Promise<FormatEntry[]> {
  return db
    .select()
    .from(formatEntries)
    .orderBy(asc(formatEntries.source_row));
}

export async function getClearingEntries(): Promise<ClearingEntry[]> {
  return db
    .select()
    .from(clearingEntries)
    .orderBy(asc(clearingEntries.source_row));
}

export async function getZahlungsartEntries(): Promise<ZahlungsartEntry[]> {
  return db
    .select()
    .from(zahlungsartEntries)
    .orderBy(asc(zahlungsartEntries.source_row));
}

export async function getIhbEntries(): Promise<IhbEntry[]> {
  return db
    .select()
    .from(ihbEntries)
    .orderBy(asc(ihbEntries.source_row));
}

export async function getFormatVersions(): Promise<FormatVersion[]> {
  return db
    .select()
    .from(formatVersions)
    .orderBy(asc(formatVersions.format_name), asc(formatVersions.version));
}

export async function getFormatVersionsByName(formatName: string): Promise<FormatVersion[]> {
  return db
    .select()
    .from(formatVersions)
    .where(eq(formatVersions.format_name, formatName))
    .orderBy(asc(formatVersions.version));
}

// ============================================================
// Cross-link queries: zahlungsart ↔ clearing
// ============================================================

export type ClearingWithLink = ClearingEntry & { note: string | null; is_primary: boolean | null };
export type ZahlungsartWithLink = ZahlungsartEntry & { note: string | null; is_primary: boolean | null };

export async function getClearingForZahlungsart(zahlungsartId: string): Promise<ClearingWithLink[]> {
  const rows = await db
    .select({
      // All clearing_entries columns
      id: clearingEntries.id,
      name: clearingEntries.name,
      abkuerzung: clearingEntries.abkuerzung,
      typ: clearingEntries.typ,
      region: clearingEntries.region,
      betreiber: clearingEntries.betreiber,
      beschreibung_experte: clearingEntries.beschreibung_experte,
      beschreibung_einsteiger: clearingEntries.beschreibung_einsteiger,
      nachrichtenformat: clearingEntries.nachrichtenformat,
      settlement_modell: clearingEntries.settlement_modell,
      cut_off: clearingEntries.cut_off,
      teilnehmer: clearingEntries.teilnehmer,
      relevanz_experte: clearingEntries.relevanz_experte,
      relevanz_einsteiger: clearingEntries.relevanz_einsteiger,
      corporate_zugang_experte: clearingEntries.corporate_zugang_experte,
      corporate_zugang_einsteiger: clearingEntries.corporate_zugang_einsteiger,
      status: clearingEntries.status,
      source_row: clearingEntries.source_row,
      created_at: clearingEntries.created_at,
      // Link fields
      note: zahlungsartClearing.note,
      is_primary: zahlungsartClearing.is_primary,
    })
    .from(zahlungsartClearing)
    .innerJoin(clearingEntries, eq(zahlungsartClearing.clearing_id, clearingEntries.id))
    .where(eq(zahlungsartClearing.zahlungsart_id, zahlungsartId))
    .orderBy(asc(zahlungsartClearing.is_primary));

  // Sort: primary first
  return rows.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
}

export async function getZahlungsartenForClearing(clearingId: string): Promise<ZahlungsartWithLink[]> {
  const rows = await db
    .select({
      // All zahlungsart_entries columns
      id: zahlungsartEntries.id,
      name: zahlungsartEntries.name,
      kuerzel: zahlungsartEntries.kuerzel,
      instrument_typ: zahlungsartEntries.instrument_typ,
      geltungsbereich_waehrung: zahlungsartEntries.geltungsbereich_waehrung,
      clearing_system: zahlungsartEntries.clearing_system,
      nachrichtenformat: zahlungsartEntries.nachrichtenformat,
      beschreibung_experte: zahlungsartEntries.beschreibung_experte,
      beschreibung_einsteiger: zahlungsartEntries.beschreibung_einsteiger,
      cut_off: zahlungsartEntries.cut_off,
      value_date_auftraggeber: zahlungsartEntries.value_date_auftraggeber,
      value_date_empfaenger: zahlungsartEntries.value_date_empfaenger,
      fristen_vorlaufzeiten: zahlungsartEntries.fristen_vorlaufzeiten,
      kosten: zahlungsartEntries.kosten,
      limits: zahlungsartEntries.limits,
      corporate_relevanz_experte: zahlungsartEntries.corporate_relevanz_experte,
      corporate_relevanz_einsteiger: zahlungsartEntries.corporate_relevanz_einsteiger,
      risiken_experte: zahlungsartEntries.risiken_experte,
      risiken_einsteiger: zahlungsartEntries.risiken_einsteiger,
      laenderverfuegbarkeit: zahlungsartEntries.laenderverfuegbarkeit,
      laender_einschraenkungen: zahlungsartEntries.laender_einschraenkungen,
      source_row: zahlungsartEntries.source_row,
      created_at: zahlungsartEntries.created_at,
      // Link fields
      note: zahlungsartClearing.note,
      is_primary: zahlungsartClearing.is_primary,
    })
    .from(zahlungsartClearing)
    .innerJoin(zahlungsartEntries, eq(zahlungsartClearing.zahlungsart_id, zahlungsartEntries.id))
    .where(eq(zahlungsartClearing.clearing_id, clearingId))
    .orderBy(asc(zahlungsartClearing.is_primary));

  // Sort: primary first
  return rows.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
}
