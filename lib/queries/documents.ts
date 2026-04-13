import { db } from '@/db/client';
import { documents, countries } from '@/db/schema';
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
