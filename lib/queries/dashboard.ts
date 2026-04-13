import { db } from '@/db/client';
import { documents, countries } from '@/db/schema';
import { asc, desc, eq, count, sql } from 'drizzle-orm';

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
  ihb: number;
  laender: number;
  totalCountries: number;
  lastUpdatedAt: Date | null;
}

export async function getStats(): Promise<Stats> {
  // Section counts
  const sectionCounts = await db
    .select({
      section: documents.section,
      count: count(),
    })
    .from(documents)
    .groupBy(documents.section);

  // Total countries
  const [countryRow] = await db
    .select({ total: count() })
    .from(countries);

  // Last updated_at from documents
  const [latestRow] = await db
    .select({ last: sql<Date | null>`MAX(${documents.updated_at})` })
    .from(documents);

  const bySection: Record<string, number> = {};
  for (const row of sectionCounts) {
    if (row.section) {
      bySection[row.section] = row.count;
    }
  }

  return {
    regulatorik: bySection['regulatorik'] ?? 0,
    formate: bySection['formate'] ?? 0,
    clearing: bySection['clearing'] ?? 0,
    ihb: bySection['ihb'] ?? 0,
    laender: bySection['laender'] ?? 0,
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
