import { db } from '@/db/client';
import { documents, countries, countryBlocks } from '@/db/schema';
import { eq, asc, sql } from 'drizzle-orm';

export type DocumentRow = {
  id: string;
  slug: string;
  title: string;
  section: string | null;
  source_file: string | null;
  updated_at: Date | null;
};

export type DocumentDetail = DocumentRow & {
  content_md: string;
};

export async function listDocuments(section: string): Promise<DocumentRow[]> {
  return db
    .select({
      id: documents.id,
      slug: documents.slug,
      title: documents.title,
      section: documents.section,
      source_file: documents.source_file,
      updated_at: documents.updated_at,
    })
    .from(documents)
    .where(eq(documents.section, section))
    .orderBy(asc(documents.title));
}

export async function getDocumentBySlug(slug: string): Promise<DocumentDetail | null> {
  const rows = await db
    .select({
      id: documents.id,
      slug: documents.slug,
      title: documents.title,
      section: documents.section,
      source_file: documents.source_file,
      updated_at: documents.updated_at,
      content_md: documents.content_md,
    })
    .from(documents)
    .where(eq(documents.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}

export type CountryRow = {
  id: string;
  code: string;
  name: string;
  complexity: string;
  summary: string | null;
  document_id: string | null;
  // Enrichment columns from Excel matrix
  currency: string | null;
  payment_infra: string | null;
  ihb_pobo_cobo: string | null;
  regulatorik: string | null;
  local_specifics: string | null;
  sap_effort: string | null;
  key_note: string | null;
};

export type CountryWithDocument = CountryRow & {
  document: DocumentDetail | null;
};

export async function listCountries(): Promise<CountryRow[]> {
  return db
    .select({
      id: countries.id,
      code: countries.code,
      name: countries.name,
      complexity: countries.complexity,
      summary: countries.summary,
      document_id: countries.document_id,
      currency: countries.currency,
      payment_infra: countries.payment_infra,
      ihb_pobo_cobo: countries.ihb_pobo_cobo,
      regulatorik: countries.regulatorik,
      local_specifics: countries.local_specifics,
      sap_effort: countries.sap_effort,
      key_note: countries.key_note,
    })
    .from(countries)
    .orderBy(
      sql`CASE ${countries.complexity} WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END`,
      asc(countries.name)
    );
}

/**
 * List countries with their linked document markdown content.
 * Used by the fullscreen Länder split-view.
 */
export async function listCountriesWithDocuments(): Promise<CountryWithDocument[]> {
  const rows = await listCountries();

  const result: CountryWithDocument[] = [];
  for (const row of rows) {
    if (row.document_id) {
      const docRows = await db
        .select({
          id: documents.id,
          slug: documents.slug,
          title: documents.title,
          section: documents.section,
          source_file: documents.source_file,
          updated_at: documents.updated_at,
          content_md: documents.content_md,
        })
        .from(documents)
        .where(eq(documents.id, row.document_id))
        .limit(1);
      result.push({ ...row, document: docRows[0] ?? null });
    } else {
      result.push({ ...row, document: null });
    }
  }
  return result;
}

// ─── Country Blocks ───────────────────────────────────────────────────────────

export type CountryBlockRow = {
  blockNo: number;
  blockTitle: string;
  rowOrder: number;
  feld: string;
  experte: string | null;
  einsteiger: string | null;
  praxis: string | null;
};

export type CountryBlockGroup = {
  blockNo: number;
  blockTitle: string;
  rows: CountryBlockRow[];
  /** If set, replaces the default rows rendering with custom JSX (e.g. IHB-Panel). */
  customContent?: import('react').ReactNode;
};

export async function getCountryBlocks(code: string): Promise<CountryBlockGroup[]> {
  const rows = await db
    .select({
      block_no: countryBlocks.block_no,
      block_title: countryBlocks.block_title,
      row_order: countryBlocks.row_order,
      feld: countryBlocks.feld,
      experte: countryBlocks.experte,
      einsteiger: countryBlocks.einsteiger,
      praxis: countryBlocks.praxis,
    })
    .from(countryBlocks)
    .where(eq(countryBlocks.country_code, code.toUpperCase()))
    .orderBy(asc(countryBlocks.block_no), asc(countryBlocks.row_order));

  const blockMap = new Map<number, CountryBlockGroup>();
  for (const r of rows) {
    if (!blockMap.has(r.block_no)) {
      blockMap.set(r.block_no, {
        blockNo: r.block_no,
        blockTitle: r.block_title,
        rows: [],
      });
    }
    blockMap.get(r.block_no)!.rows.push({
      blockNo: r.block_no,
      blockTitle: r.block_title,
      rowOrder: r.row_order,
      feld: r.feld,
      experte: r.experte,
      einsteiger: r.einsteiger,
      praxis: r.praxis,
    });
  }
  return Array.from(blockMap.values());
}

export async function getCountry(code: string): Promise<CountryWithDocument | null> {
  const rows = await db
    .select({
      id: countries.id,
      code: countries.code,
      name: countries.name,
      complexity: countries.complexity,
      summary: countries.summary,
      document_id: countries.document_id,
      currency: countries.currency,
      payment_infra: countries.payment_infra,
      ihb_pobo_cobo: countries.ihb_pobo_cobo,
      regulatorik: countries.regulatorik,
      local_specifics: countries.local_specifics,
      sap_effort: countries.sap_effort,
      key_note: countries.key_note,
    })
    .from(countries)
    .where(eq(countries.code, code.toUpperCase()))
    .limit(1);

  const country = rows[0];
  if (!country) return null;

  let document: DocumentDetail | null = null;
  if (country.document_id) {
    const docRows = await db
      .select({
        id: documents.id,
        slug: documents.slug,
        title: documents.title,
        section: documents.section,
        source_file: documents.source_file,
        updated_at: documents.updated_at,
        content_md: documents.content_md,
      })
      .from(documents)
      .where(eq(documents.id, country.document_id))
      .limit(1);
    document = docRows[0] ?? null;
  }

  return { ...country, document };
}
