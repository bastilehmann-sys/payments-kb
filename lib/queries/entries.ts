/**
 * Queries for structured entry tables (Excel sheets 01-05).
 */
import { db } from '@/db/client';
import {
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  zahlungsartEntries,
  ihbEntries,
} from '@/db/schema';
import { asc } from 'drizzle-orm';

export type RegulatorikEntry = typeof regulatorikEntries.$inferSelect;
export type FormatEntry = typeof formatEntries.$inferSelect;
export type ClearingEntry = typeof clearingEntries.$inferSelect;
export type ZahlungsartEntry = typeof zahlungsartEntries.$inferSelect;
export type IhbEntry = typeof ihbEntries.$inferSelect;

export async function getRegulatorikEntries(): Promise<RegulatorikEntry[]> {
  return db
    .select()
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
