import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems, proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';
import { getProposalWithItems } from '@/lib/queries/proposals';

export const maxDuration = 120;

interface RevisedItem {
  topic?: string;
  target_file?: string;
  target_section?: string;
  reasoning?: string;
  content_outline?: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const proposal = await getProposalWithItems(id);
  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });

  const toRevise = proposal.items.filter(item => item.comment && item.status === 'pending');
  if (toRevise.length === 0) {
    return Response.json({ error: 'No items with comments to revise' }, { status: 400 });
  }

  const client = new Anthropic();

  for (const item of toRevise) {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Du bist ein Payments-Wissens-Agent. Überarbeite diesen Proposal basierend auf dem Feedback.

Aktueller Proposal:
Thema: ${item.topic}
Ziel-Datei: ${item.target_file}${item.target_section ? ` / ${item.target_section}` : ''}
Begründung: ${item.reasoning}
Content-Outline: ${item.content_outline}
Quellen: ${JSON.stringify(item.sources)}

Feedback: ${item.comment}

Antworte nur mit einem JSON-Objekt (kein Markdown, kein Kommentar):
{"topic":"...","target_file":"...","target_section":"...","reasoning":"...","content_outline":"..."}`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    let revised: RevisedItem = {};
    try {
      revised = JSON.parse(text) as RevisedItem;
    } catch {
      continue;
    }

    await db
      .update(proposalItems)
      .set({
        topic: revised.topic ?? item.topic,
        target_file: revised.target_file ?? item.target_file,
        target_section: revised.target_section ?? item.target_section,
        reasoning: revised.reasoning ?? item.reasoning,
        content_outline: revised.content_outline ?? item.content_outline,
        comment: null,
        revised_at: new Date(),
      })
      .where(eq(proposalItems.id, item.id));
  }

  await db
    .update(proposals)
    .set({ status: 'draft' })
    .where(eq(proposals.id, id));

  return Response.json({ revised: toRevise.length });
}
