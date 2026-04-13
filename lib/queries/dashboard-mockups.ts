/**
 * Queries for the 3 dashboard mockup variants.
 */
import { db } from '@/db/client';
import {
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  zahlungsartEntries,
  ihbEntries,
  formatVersions,
  entryAudit,
  countries,
} from '@/db/schema';
import { asc, count, desc, eq, sql } from 'drizzle-orm';

/** All counts in one call */
export async function getMockupStats() {
  const [regulatorikRow] = await db.select({ total: count() }).from(regulatorikEntries);
  const [formateRow] = await db.select({ total: count() }).from(formatEntries);
  const [clearingRow] = await db.select({ total: count() }).from(clearingEntries);
  const [zahlungsartenRow] = await db.select({ total: count() }).from(zahlungsartEntries);
  const [ihbRow] = await db.select({ total: count() }).from(ihbEntries);
  const [countryRow] = await db.select({ total: count() }).from(countries);

  return {
    regulatorik: regulatorikRow?.total ?? 0,
    formate: formateRow?.total ?? 0,
    clearing: clearingRow?.total ?? 0,
    zahlungsarten: zahlungsartenRow?.total ?? 0,
    ihb: ihbRow?.total ?? 0,
    laender: countryRow?.total ?? 0,
  };
}

/** Last N audit entries */
export async function getRecentAuditEntries(limit = 5) {
  return db
    .select({
      id: entryAudit.id,
      table_name: entryAudit.table_name,
      row_id: entryAudit.row_id,
      field: entryAudit.field,
      old_value: entryAudit.old_value,
      new_value: entryAudit.new_value,
      edited_at: entryAudit.edited_at,
      edited_by: entryAudit.edited_by,
    })
    .from(entryAudit)
    .orderBy(desc(entryAudit.edited_at))
    .limit(limit);
}

/** High-complexity countries */
export async function getHighComplexityCountries(limit = 5) {
  return db
    .select({
      id: countries.id,
      code: countries.code,
      name: countries.name,
      complexity: countries.complexity,
      summary: countries.summary,
    })
    .from(countries)
    .where(eq(countries.complexity, 'high'))
    .orderBy(asc(countries.name))
    .limit(limit);
}

/** All countries ordered by complexity */
export async function getMockupCountries() {
  return db
    .select({
      id: countries.id,
      code: countries.code,
      name: countries.name,
      complexity: countries.complexity,
      summary: countries.summary,
    })
    .from(countries)
    .orderBy(
      sql`CASE ${countries.complexity} WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END`,
      asc(countries.name)
    );
}

/** Latest format_versions sorted by created desc */
export async function getLatestFormatVersions(limit = 10) {
  return db
    .select({
      id: formatVersions.id,
      format_name: formatVersions.format_name,
      version: formatVersions.version,
      released: formatVersions.released,
      is_current: formatVersions.is_current,
      notes: formatVersions.notes,
    })
    .from(formatVersions)
    .orderBy(desc(formatVersions.released))
    .limit(limit);
}

/** Current (latest) format versions per format family */
export async function getCurrentFormatVersions() {
  return db
    .select({
      id: formatVersions.id,
      format_name: formatVersions.format_name,
      version: formatVersions.version,
      released: formatVersions.released,
      is_current: formatVersions.is_current,
      notes: formatVersions.notes,
    })
    .from(formatVersions)
    .where(eq(formatVersions.is_current, true))
    .orderBy(asc(formatVersions.format_name))
    .limit(8);
}
