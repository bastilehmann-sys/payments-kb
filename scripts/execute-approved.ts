import { db } from '../db/client';
import { proposalItems, proposals } from '../db/schema';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';
import { replaceSection, getNextFileIndex } from '../lib/proposals/section-utils';
import { reindex } from '../lib/ingest/reindex';
import fs from 'node:fs';
import path from 'node:path';

async function main() {

const contentDir = path.join(process.cwd(), 'content');
const client = new Anthropic();

const approved = await db
  .select()
  .from(proposalItems)
  .where(eq(proposalItems.status, 'approved'));

console.log(`Found ${approved.length} approved items:`);
approved.forEach(i => console.log(' -', i.topic.substring(0, 70)));

if (approved.length === 0) {
  console.log('Nothing to do.');
  process.exit(0);
}

// Step 1: Generate content for each approved item
const toWrite: typeof approved = [];

for (const item of approved) {
  if (item.generated_content) {
    console.log(`[skip generate] ${item.topic.substring(0, 50)} — already has content`);
    toWrite.push(item);
    continue;
  }

  console.log(`[generate] ${item.topic.substring(0, 50)}...`);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Du bist ein Payments-Fachexperte. Schreibe strukturiertes Markdown für eine interne Wissensdatenbank.

Thema: ${item.topic}
Ziel-Datei: ${item.target_file !== 'new' ? item.target_file : 'Neue Länderdatei'}
${item.target_section ? `Abschnitt: ${item.target_section}` : ''}
Geplanter Inhalt: ${item.content_outline}
Quellen: ${JSON.stringify(item.sources)}

Schreibe nur den Markdown-Block selbst. Kein Präambel, kein Kommentar. Deutsch.`,
    }],
  });

  const generated = message.content[0].type === 'text' ? message.content[0].text : '';

  await db
    .update(proposalItems)
    .set({ generated_content: generated })
    .where(eq(proposalItems.id, item.id));

  toWrite.push({ ...item, generated_content: generated });
  console.log(`  → generated ${generated.length} chars`);
}

// Step 2: Write files
for (const item of toWrite) {
  if (!item.generated_content) continue;

  if (item.target_file === 'new') {
    const slug = item.topic
      .toLowerCase()
      .replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ä/g, 'ae').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);
    const index = getNextFileIndex(contentDir);
    const filename = `gpdb_${index}_${slug}.md`;
    const filePath = path.join(contentDir, filename);
    fs.writeFileSync(filePath, item.generated_content, 'utf-8');
    console.log(`[write] ${filename}`);
  } else {
    const filePath = path.join(contentDir, item.target_file);
    const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
    const updated = item.target_section
      ? replaceSection(existing, item.target_section, item.generated_content)
      : existing.trimEnd() + '\n\n' + item.generated_content;
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`[update] ${item.target_file}`);
  }

  await db
    .update(proposalItems)
    .set({ status: 'executed', executed_at: new Date() })
    .where(eq(proposalItems.id, item.id));
}

// Step 3: Reindex
console.log('[reindex] running...');
await reindex();
console.log('[reindex] done');

// Mark proposals as executed where all items are done
const proposalIds = [...new Set(toWrite.map(i => i.proposal_id))].filter((pid): pid is string => pid !== null);
for (const pid of proposalIds) {
  const all = await db.select().from(proposalItems).where(eq(proposalItems.proposal_id, pid));
  const allDone = all.every(i => i.status === 'executed' || i.status === 'rejected');
  if (allDone) {
    await db.update(proposals).set({ status: 'executed' }).where(eq(proposals.id, pid));
    console.log(`[proposal] ${pid} → executed`);
  }
}

console.log('Done.');
}

main().catch(console.error);
