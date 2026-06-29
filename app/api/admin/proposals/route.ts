import { auth } from '@/auth';
import { validateApiKey } from '@/lib/api-auth';
import { db } from '@/db/client';
import { proposals, proposalItems } from '@/db/schema';
import { getAllProposals } from '@/lib/queries/proposals';

interface ProposalItemInput {
  topic: string;
  target_file: string;
  target_section?: string;
  reasoning: string;
  sources: Array<{ title: string; url: string; date: string }>;
  content_outline: string;
}

export async function POST(request: Request) {
  if (!validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { week_date: string; items: ProposalItemInput[] };

  if (!body.week_date || !Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: 'week_date and items required' }, { status: 400 });
  }

  const [proposal] = await db
    .insert(proposals)
    .values({ week_date: body.week_date, status: 'draft' })
    .returning();

  const inserted = await db
    .insert(proposalItems)
    .values(
      body.items.map(item => ({
        proposal_id: proposal.id,
        topic: item.topic,
        target_file: item.target_file,
        target_section: item.target_section ?? null,
        reasoning: item.reasoning,
        sources: item.sources,
        content_outline: item.content_outline,
        status: 'pending',
      }))
    )
    .returning({ id: proposalItems.id });

  return Response.json({ proposal_id: proposal.id, items_created: inserted.length });
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const all = await getAllProposals();
  return Response.json(all);
}
