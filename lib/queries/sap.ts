import { db } from '@/db/client';
import { sapRoadmapItems, sapImplementationPhases } from '@/db/schema';
import { asc } from 'drizzle-orm';

export type SapRoadmapItem = typeof sapRoadmapItems.$inferSelect;
export type SapImplementationPhase = typeof sapImplementationPhases.$inferSelect;

export async function getSapRoadmapItems(): Promise<SapRoadmapItem[]> {
  return db.select().from(sapRoadmapItems).orderBy(asc(sapRoadmapItems.sort_order));
}

export async function getSapImplementationPhases(): Promise<SapImplementationPhase[]> {
  return db.select().from(sapImplementationPhases).orderBy(asc(sapImplementationPhases.phase_nr));
}
