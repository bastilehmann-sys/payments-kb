import { auth } from '@/auth';
import { db } from '@/db/client';
import { proposalItems, proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getProposalWithItems } from '@/lib/queries/proposals';
import { replaceSection, getNextFileIndex } from '@/lib/proposals/section-utils';
import { reindex } from '@/lib/ingest/reindex';
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
  const { item_ids } = await request.json() as { item_ids: string[] };

  const proposal = await getProposalWithItems(id);
  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 });

  const contentDir = path.join(process.cwd(), 'content');

  const toConfirm = proposal.items.filter(
    item => item_ids.includes(item.id) && item.generated_content != null
  );

  for (const item of toConfirm) {
    if (item.target_file === 'new') {
      // Derive slug from topic: lowercase, non-alphanumeric → '-'
      const slug = item.topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const index = getNextFileIndex(contentDir);
      const filename = `gpdb_${index}_${slug}.md`;
      fs.writeFileSync(path.join(contentDir, filename), item.generated_content!, 'utf-8');
    } else {
      const filePath = path.join(contentDir, item.target_file);
      if (!path.resolve(filePath).startsWith(path.resolve(contentDir) + path.sep)) {
        console.warn('[security] rejected out-of-bounds target_file:', item.target_file);
        continue;
      }
      const existing = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

      const updated = item.target_section
        ? replaceSection(existing, item.target_section, item.generated_content!)
        : existing.trimEnd() + '\n\n' + item.generated_content!;

      fs.writeFileSync(filePath, updated, 'utf-8');
    }

    await db
      .update(proposalItems)
      .set({ status: 'executed', executed_at: new Date() })
      .where(eq(proposalItems.id, item.id));
  }

  if (toConfirm.length === 0) {
    return Response.json({ confirmed: 0 });
  }

  // Reindex all changed content into DB chunks + FTS
  await reindex();

  // Mark proposal as executed if all items are done (executed or rejected)
  const updated = await getProposalWithItems(id);
  const allDone = updated?.items.every(
    item => item.status === 'executed' || item.status === 'rejected'
  );
  if (allDone) {
    await db.update(proposals).set({ status: 'executed' }).where(eq(proposals.id, id));
  }

  return Response.json({ confirmed: toConfirm.length });
}
