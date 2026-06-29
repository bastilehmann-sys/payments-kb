import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';
import { getProposalWithItems } from '@/lib/queries/proposals';
import { extractSection } from '@/lib/proposals/section-utils';
import fs from 'node:fs';
import path from 'node:path';

export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const proposal = await getProposalWithItems(id);
  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });

  const approved = proposal.items.filter(item => item.status === 'approved');
  if (approved.length === 0) {
    return Response.json({ error: 'No approved items' }, { status: 400 });
  }

  const client = new Anthropic();
  const contentDir = path.join(process.cwd(), 'content');

  for (const item of approved) {
    let existingSection = '';
    if (item.target_file !== 'new') {
      const filePath = path.join(contentDir, item.target_file);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        existingSection = item.target_section
          ? extractSection(fileContent, item.target_section)
          : '';
      }
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Du bist ein Payments-Fachexperte. Schreibe strukturiertes Markdown für eine interne Wissensdatenbank.

Thema: ${item.topic}
Ziel-Datei: ${item.target_file !== 'new' ? item.target_file : 'Neue Länderdatei'}
${item.target_section ? `Abschnitt: ${item.target_section}` : ''}
Geplanter Inhalt: ${item.content_outline}
Quellen: ${JSON.stringify(item.sources)}
${existingSection ? `\nBestehender Abschnitt (wird ersetzt):\n${existingSection}` : ''}

Schreibe nur den Markdown-Block selbst. Kein Präambel, kein Kommentar.`,
        },
      ],
    });

    const generated = message.content[0].type === 'text' ? message.content[0].text : '';

    await db
      .update(proposalItems)
      .set({ generated_content: generated })
      .where(eq(proposalItems.id, item.id));
  }

  return Response.json({ generated: approved.length });
}
