import { db } from '@/db/client';
import { scopeAnalyses } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export type ScopeAnalysis = typeof scopeAnalyses.$inferSelect;

export async function getScopeAnalyses(): Promise<ScopeAnalysis[]> {
  return db
    .select()
    .from(scopeAnalyses)
    .orderBy(desc(scopeAnalyses.created_at))
    .limit(10);
}

export async function deleteScopeAnalysis(id: string): Promise<void> {
  await db.delete(scopeAnalyses).where(eq(scopeAnalyses.id, id));
}
