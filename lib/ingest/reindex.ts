import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { sql as neonSql } from 'drizzle-orm';
import { db } from '@/db/client';
import { documents, chunks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from './hash';
import { chunkMarkdown } from './chunk';
import { embed } from './embed';

// --- Types ---

export interface ReindexResult {
  processed: number;
  skipped: number;
  chunks_created: number;
  per_file: Record<string, FileResult>;
}

interface FileResult {
  status: 'skipped' | 'processed';
  chunks_created: number;
  reason?: string;
}

// --- Section mapping ---

const SECTION_MAP: Record<string, string> = {
  '01_regulatorik': 'regulatorik',
  '02_formate': 'formate',
  '03_clearing_zahlungsarten': 'clearing',
  '04_ihb_komplexitaet': 'ihb',
  '05_italien': 'laender',
};

const SLUG_MAP: Record<string, string> = {
  regulatorik: 'regulatorik',
  formate: 'formate',
  clearing: 'clearing',
  ihb: 'ihb',
  laender: 'italien',
};

// Excel-derived MD files: filename → { section, slug }
const EXCEL_FILE_MAP: Record<string, { section: string; slug: string }> = {
  'excel_01_regulatorik_glossar.md': { section: 'regulatorik', slug: 'excel-regulatorik-glossar' },
  'excel_02_format_bibliothek.md':   { section: 'formate',     slug: 'excel-format-bibliothek' },
  'excel_03_clearing_systeme.md':    { section: 'clearing',    slug: 'excel-clearing-systeme' },
  'excel_04_zahlungsarten.md':       { section: 'clearing',    slug: 'excel-zahlungsarten' },
  'excel_05_ihb_pobo_cobo.md':       { section: 'ihb',         slug: 'excel-ihb-pobo-cobo' },
  'excel_06_laenderkomplexitaet_matrix.md': { section: 'laender', slug: 'excel-laenderkomplexitaet-matrix' },
  'excel_07_land_italien.md':        { section: 'laender',     slug: 'excel-italien' },
};

function filenameToSection(filename: string): string | null {
  // e.g. "gpdb_01_regulatorik.md" → "01_regulatorik"
  const m = filename.match(/^gpdb_(\d{2}_[^.]+)\.md$/);
  if (!m) return null;
  const key = m[1];
  return SECTION_MAP[key] ?? null;
}

function extractTitle(md: string, fallback: string): string {
  const m = md.match(/^# (.+)$/m);
  return m ? m[1].trim() : fallback;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[äöüÄÖÜ]/g, c =>
      ({ ä: 'ae', ö: 'oe', ü: 'ue', Ä: 'Ae', Ö: 'Oe', Ü: 'Ue' }[c] ?? c)
    )
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// --- Main ---

// --- File list building ---

interface IndexableFile {
  filename: string;   // basename
  filePath: string;   // absolute path
  section: string;
  slug: string;
}

function buildFileList(contentDir: string): IndexableFile[] {
  const files: IndexableFile[] = [];

  // gpdb_*.md files in content/
  const gpdbFiles = fs.readdirSync(contentDir).filter(f => /^gpdb_.*\.md$/.test(f));
  for (const filename of gpdbFiles) {
    const section = filenameToSection(filename);
    if (!section) continue;
    const slug = SLUG_MAP[section] ?? slugify(filename);
    files.push({ filename, filePath: path.join(contentDir, filename), section, slug });
  }

  // excel/*.md files in content/excel/
  const excelDir = path.join(contentDir, 'excel');
  if (fs.existsSync(excelDir)) {
    const excelFiles = fs.readdirSync(excelDir).filter(f => /^excel_.*\.md$/.test(f));
    for (const filename of excelFiles) {
      const meta = EXCEL_FILE_MAP[filename];
      if (!meta) continue;
      files.push({
        filename: `excel/${filename}`,
        filePath: path.join(excelDir, filename),
        section: meta.section,
        slug: meta.slug,
      });
    }
  }

  return files;
}

export async function reindex(opts: { openaiKey: string }): Promise<ReindexResult> {
  const contentDir = path.join(process.cwd(), 'content');
  const allFiles = buildFileList(contentDir);

  const result: ReindexResult = {
    processed: 0,
    skipped: 0,
    chunks_created: 0,
    per_file: {},
  };

  for (const fileEntry of allFiles) {
    const { filename, filePath, section, slug } = fileEntry;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { content: contentMd } = matter(raw);

    const contentHash = hash(contentMd);
    const title = extractTitle(contentMd, section);

    // Check for existing document by source_file
    const existing = await db
      .select()
      .from(documents)
      .where(eq(documents.source_file, filename))
      .limit(1);

    if (existing.length > 0 && existing[0].content_hash === contentHash) {
      result.per_file[filename] = {
        status: 'skipped',
        chunks_created: 0,
        reason: 'Content hash unchanged',
      };
      result.skipped++;
      continue;
    }

    // Chunk and embed
    const chunkList = chunkMarkdown(contentMd);
    const chunkContents = chunkList.map(c => c.content);
    const embeddings = await embed(chunkContents, opts.openaiKey);

    // Delete existing chunks if doc existed
    let documentId: string;

    if (existing.length > 0) {
      documentId = existing[0].id;
      await db.delete(chunks).where(eq(chunks.document_id, documentId));

      // Update document
      await db
        .update(documents)
        .set({
          section,
          slug,
          title,
          content_md: contentMd,
          content_hash: contentHash,
          updated_at: new Date(),
        })
        .where(eq(documents.id, documentId));
    } else {
      // Insert document
      const inserted = await db
        .insert(documents)
        .values({
          source_file: filename,
          section,
          slug,
          title,
          content_md: contentMd,
          content_hash: contentHash,
        })
        .returning({ id: documents.id });
      documentId = inserted[0].id;
    }

    // Insert chunks with raw SQL for tsv column
    let chunksCreated = 0;
    for (let i = 0; i < chunkList.length; i++) {
      const chunk = chunkList[i];
      const embedding = embeddings[i];
      const embeddingStr = `[${embedding.join(',')}]`;

      await db.execute(
        neonSql`
          INSERT INTO chunks (id, document_id, chunk_index, content, heading, embedding, tsv, metadata)
          VALUES (
            gen_random_uuid(),
            ${documentId},
            ${chunk.chunk_index},
            ${chunk.content},
            ${chunk.heading ?? null},
            ${embeddingStr}::vector,
            to_tsvector('simple', ${chunk.content}),
            NULL
          )
        `
      );
      chunksCreated++;
    }

    result.per_file[filename] = {
      status: 'processed',
      chunks_created: chunksCreated,
    };
    result.processed++;
    result.chunks_created += chunksCreated;
  }

  return result;
}
