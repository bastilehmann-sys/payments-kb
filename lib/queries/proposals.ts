import { db } from '@/db/client';
import { proposals, proposalItems } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export type Proposal = typeof proposals.$inferSelect;
export type ProposalItem = typeof proposalItems.$inferSelect;
export type ProposalWithItems = Proposal & { items: ProposalItem[] };

export async function getAllProposals(): Promise<ProposalWithItems[]> {
  const allProposals = await db
    .select()
    .from(proposals)
    .orderBy(desc(proposals.created_at));

  return Promise.all(
    allProposals.map(async proposal => ({
      ...proposal,
      items: await db
        .select()
        .from(proposalItems)
        .where(eq(proposalItems.proposal_id, proposal.id)),
    }))
  );
}

export async function getProposalWithItems(id: string): Promise<ProposalWithItems | null> {
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1);
  if (!proposal) return null;

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposal_id, id));

  return { ...proposal, items };
}
