import { db } from '@/db/client';
import {
  documents,
  countries,
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  zahlungsartEntries,
  ihbEntries,
} from '@/db/schema';
import { asc, desc, count, sql } from 'drizzle-orm';

// All countries ordered by complexity (high first) then name
export async function getCountries() {
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

export interface Stats {
  regulatorik: number;
  formate: number;
  clearing: number;
  zahlungsarten: number;
  ihb: number;
  totalCountries: number;
  lastUpdatedAt: Date | null;
}

export async function getStats(): Promise<Stats> {
  // Count each structured entry table
  const [regulatorikRow] = await db.select({ total: count() }).from(regulatorikEntries);
  const [formateRow] = await db.select({ total: count() }).from(formatEntries);
  const [clearingRow] = await db.select({ total: count() }).from(clearingEntries);
  const [zahlungsartenRow] = await db.select({ total: count() }).from(zahlungsartEntries);
  const [ihbRow] = await db.select({ total: count() }).from(ihbEntries);

  // Total countries
  const [countryRow] = await db.select({ total: count() }).from(countries);

  // Last updated_at from documents (still used for changelog / recent updates)
  const [latestRow] = await db
    .select({ last: sql<Date | null>`MAX(${documents.updated_at})` })
    .from(documents);

  return {
    regulatorik: regulatorikRow?.total ?? 0,
    formate: formateRow?.total ?? 0,
    clearing: clearingRow?.total ?? 0,
    zahlungsarten: zahlungsartenRow?.total ?? 0,
    ihb: ihbRow?.total ?? 0,
    totalCountries: countryRow?.total ?? 0,
    lastUpdatedAt: latestRow?.last ?? null,
  };
}

export interface RecentUpdate {
  id: string;
  slug: string;
  section: string | null;
  title: string;
  updated_at: Date | null;
}

export async function getRecentUpdates(limit = 5): Promise<RecentUpdate[]> {
  return db
    .select({
      id: documents.id,
      slug: documents.slug,
      section: documents.section,
      title: documents.title,
      updated_at: documents.updated_at,
    })
    .from(documents)
    .orderBy(desc(documents.updated_at))
    .limit(limit);
}
