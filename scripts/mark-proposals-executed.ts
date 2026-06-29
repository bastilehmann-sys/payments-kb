import { db } from '../db/client';
import { proposals, proposalItems } from '../db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const allProposals = await db.select().from(proposals);

  for (const p of allProposals) {
    if (p.status === 'executed') continue;
    const items = await db.select().from(proposalItems).where(eq(proposalItems.proposal_id, p.id));
    const allDone = items.length > 0 && items.every(i => i.status === 'executed' || i.status === 'rejected');
    if (allDone) {
      await db.update(proposals).set({ status: 'executed' }).where(eq(proposals.id, p.id));
      console.log(`[executed] proposal ${p.id.substring(0, 8)}`);
    } else {
      console.log(`[skip] proposal ${p.id.substring(0, 8)} — items: ${items.map(i => i.status).join(', ')}`);
    }
  }
  console.log('Done.');
}

main().catch(console.error);
