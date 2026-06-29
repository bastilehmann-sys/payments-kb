import { validateApiKey } from '@/lib/api-auth';
import { sendProposalNotification } from '@/lib/email/proposal-notification';

export async function POST(request: Request) {
  if (!validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as {
    proposal_id: string;
    week_date: string;
    items: Array<{ topic: string; reasoning: string }>;
  };

  await sendProposalNotification({
    proposalId: body.proposal_id,
    weekDate: body.week_date,
    items: body.items,
  });

  return Response.json({ ok: true });
}
