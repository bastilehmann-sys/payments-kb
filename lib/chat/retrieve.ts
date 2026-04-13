import { sql as neonSql } from '@/db/client';
import { embed } from '@/lib/ingest/embed';

export type RetrievedChunk = {
  chunk_id: string;
  content: string;
  heading: string | null;
  doc_slug: string;
  doc_title: string;
  doc_section: string;
  score: number;
};

export async function retrieve(query: string, openaiKey: string, k = 8): Promise<RetrievedChunk[]> {
  const [qEmbed] = await embed([query], openaiKey);
  const vec = `[${qEmbed.join(',')}]`;
  const rows = await neonSql`
    SELECT c.id as chunk_id, c.content, c.heading,
           d.slug as doc_slug, d.title as doc_title, d.section as doc_section,
           1 - (c.embedding <=> ${vec}::vector) AS score
    FROM chunks c
    JOIN documents d ON d.id = c.document_id
    ORDER BY c.embedding <=> ${vec}::vector
    LIMIT ${k}
  `;
  return rows as RetrievedChunk[];
}
