import { auth } from '@/auth';
import { sql } from '@/db/client';
import { NextRequest } from 'next/server';

interface SearchRow {
  doc_slug: string;
  doc_title: string;
  section: string | null;
  heading: string | null;
  snippet: string;
  rank: number;
}

export interface SearchResult {
  doc_slug: string;
  doc_title: string;
  section: string;
  heading: string | null;
  snippet: string;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return Response.json({ results: [] });
  }

  try {
    const rows = await sql`
      SELECT
        d.slug        AS doc_slug,
        d.title       AS doc_title,
        d.section,
        c.heading,
        ts_headline(
          'simple',
          c.content,
          websearch_to_tsquery('simple', ${q}),
          'MaxWords=30, MinWords=15, ShortWord=3, HighlightAll=FALSE, MaxFragments=1, FragmentDelimiter=" … "'
        ) AS snippet,
        ts_rank(c.tsv, websearch_to_tsquery('simple', ${q})) AS rank
      FROM chunks c
      JOIN documents d ON d.id = c.document_id
      WHERE c.tsv @@ websearch_to_tsquery('simple', ${q})
      ORDER BY rank DESC
      LIMIT 20
    ` as SearchRow[];

    const results: SearchResult[] = rows.map((row) => ({
      doc_slug: row.doc_slug,
      doc_title: row.doc_title,
      section: row.section ?? 'regulatorik',
      heading: row.heading ?? null,
      snippet: row.snippet,
    }));

    return Response.json({ results });
  } catch (err) {
    console.error('[search] query error:', err);
    return Response.json({ error: 'Suchfehler' }, { status: 500 });
  }
}
