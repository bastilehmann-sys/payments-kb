import { db } from '@/db/client';
import { documents } from '@/db/schema';
import { desc } from 'drizzle-orm';

export interface ChangelogEntry {
  id: string;
  slug: string;
  title: string;
  section: string | null;
  updated_at: Date | null;
}

export interface ChangelogMonth {
  /** e.g. "April 2026" */
  label: string;
  /** ISO month key for sorting, e.g. "2026-04" */
  key: string;
  entries: ChangelogEntry[];
}

export async function getChangelog(): Promise<ChangelogMonth[]> {
  const rows = await db
    .select({
      id: documents.id,
      slug: documents.slug,
      title: documents.title,
      section: documents.section,
      updated_at: documents.updated_at,
    })
    .from(documents)
    .orderBy(desc(documents.updated_at));

  // Group in memory by year-month
  const monthMap = new Map<string, ChangelogMonth>();

  for (const row of rows) {
    const date = row.updated_at ?? new Date(0);
    // "2026-04"
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthMap.has(key)) {
      const label = date.toLocaleDateString('de-DE', {
        month: 'long',
        year: 'numeric',
      });
      monthMap.set(key, { key, label, entries: [] });
    }

    monthMap.get(key)!.entries.push({
      id: row.id,
      slug: row.slug,
      title: row.title,
      section: row.section,
      updated_at: row.updated_at,
    });
  }

  // Return sorted newest first (Map preserves insertion order, rows already sorted by updated_at desc)
  return Array.from(monthMap.values());
}
