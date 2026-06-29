import { db } from '@/db/client';
import { technikEntries } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export type TechnikEntry = typeof technikEntries.$inferSelect;

export async function getAllTechnikEntries(): Promise<TechnikEntry[]> {
  return db.select().from(technikEntries).orderBy(asc(technikEntries.name));
}

export async function getTechnikEntryBySlug(slug: string): Promise<TechnikEntry | null> {
  const rows = await db
    .select()
    .from(technikEntries)
    .where(eq(technikEntries.id, slug))
    .limit(1);
  return rows[0] ?? null;
}
