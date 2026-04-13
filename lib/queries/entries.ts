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
