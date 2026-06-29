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
  let revisedCount = 0;

  for (const item of toRevise) {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a payments knowledge-base agent. Revise the following proposal item based on the user's feedback.

Current proposal item:
topic: ${item.topic}
target_file: ${item.target_file}${item.target_section ? `\ntarget_section: ${item.target_section}` : ''}
reasoning: ${item.reasoning}
content_outline: ${item.content_outline}
sources: ${JSON.stringify(item.sources)}

User feedback: ${item.comment}

Return only a raw JSON object with these exact keys: topic, target_file, target_section, reasoning, content_outline. No markdown fences, no commentary, no explanation — just the JSON object.`,
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

    revisedCount++;
  }

  await db
    .update(proposals)
    .set({ status: 'draft' })
    .where(eq(proposals.id, id));

  return Response.json({ revised: revisedCount });
}
