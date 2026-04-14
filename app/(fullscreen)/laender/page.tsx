import { listCountriesWithDocuments, getCountryBlocks } from '@/lib/queries/documents';
import { getIhbEntries } from '@/lib/queries/entries';
import { SplitView, type Column } from '@/components/browse/split-view';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Länder — Payments KB',
};

const COLUMNS: Column[] = [
  // IHB / POBO / COBO — Zusammenfassung + strukturierte Felder
  { key: 'ihb_pobo_cobo',   label: 'Zusammenfassung',        section: 'IHB / POBO / COBO' },
  { key: 'ihb_bewertung',   label: 'IHB-Bewertung',          section: 'IHB / POBO / COBO' },
  { key: 'pobo_status',     label: 'POBO-Status',            section: 'IHB / POBO / COBO' },
  { key: 'cobo_status',     label: 'COBO-Status',            section: 'IHB / POBO / COBO' },
  { key: 'netting_erlaubt', label: 'Netting erlaubt?',       section: 'IHB / POBO / COBO' },
  { key: 'lokales_konto',   label: 'Lokales Konto erforderlich?', section: 'IHB / POBO / COBO' },
  { key: 'ihb_einschraenkungen_experte',    label: 'Einschränkungen (Experte)',    section: 'IHB / POBO / COBO' },
  { key: 'ihb_einschraenkungen_einsteiger', label: 'Einschränkungen (Einsteiger)', section: 'IHB / POBO / COBO' },
  { key: 'ihb_rechtsgrundlage',  label: 'Rechtsgrundlage',        section: 'IHB / POBO / COBO' },
  { key: 'ihb_design_experte',   label: 'IHB-Design (Experte)',   section: 'IHB / POBO / COBO' },
  { key: 'ihb_design_einsteiger',label: 'IHB-Design (Einsteiger)',section: 'IHB / POBO / COBO' },
  { key: 'ihb_sap_config_experte',   label: 'SAP-Konfiguration (Experte)',   section: 'IHB / POBO / COBO' },
  { key: 'ihb_sap_config_einsteiger',label: 'SAP-Konfiguration (Einsteiger)',section: 'IHB / POBO / COBO' },
  { key: 'ihb_handlungsempfehlung',  label: 'Handlungsempfehlung',           section: 'IHB / POBO / COBO' },
  // Wichtigster Hinweis
  { key: 'key_note', label: 'Wichtigster Hinweis', section: 'Wichtigster Hinweis' },
];

function normalizeLand(s: string | null | undefined): string {
  return (s ?? '').trim().toLowerCase();
}

export default async function LaenderPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const [countriesWithDocs, itBlocks, ihbEntries] = await Promise.all([
    listCountriesWithDocuments(),
    getCountryBlocks('IT'),
    getIhbEntries(),
  ]);

  // Index IHB entries by normalized land name
  const ihbByLand = new Map<string, (typeof ihbEntries)[number]>();
  for (const e of ihbEntries) {
    const key = normalizeLand(e.land);
    if (key && !ihbByLand.has(key)) ihbByLand.set(key, e);
  }

  // Build blocks map: country code → block groups
  // Quick-Reference-Block (#6) ausblenden
  const filteredItBlocks = itBlocks.filter((b) => !/quick reference/i.test(b.blockTitle ?? ''));
  const countryBlocksMap: Record<string, Awaited<ReturnType<typeof getCountryBlocks>>> = {};
  if (filteredItBlocks.length > 0) {
    countryBlocksMap['IT'] = filteredItBlocks;
  }

  const items = countriesWithDocs.map((c) => {
    const ihb = ihbByLand.get(normalizeLand(c.name));
    return {
      id: c.id,
      code: c.code,
      name: c.name,
      complexity: c.complexity,
      currency: c.currency ?? '',
      summary: c.summary ?? '',
      payment_infra: c.payment_infra ?? '',
      ihb_pobo_cobo: c.ihb_pobo_cobo ?? '',
      regulatorik: c.regulatorik ?? '',
      local_specifics: c.local_specifics ?? '',
      sap_effort: c.sap_effort ?? '',
      key_note: c.key_note ?? '',
      document_id: c.document_id ?? '',
      document_md: c.document?.content_md ?? '',
      // IHB-Merge
      ihb_bewertung: ihb?.ihb_bewertung ?? '',
      pobo_status: ihb?.pobo_status ?? '',
      cobo_status: ihb?.cobo_status ?? '',
      netting_erlaubt: ihb?.netting_erlaubt ?? '',
      lokales_konto: ihb?.lokales_konto ?? '',
      ihb_einschraenkungen_experte: ihb?.einschraenkungen_experte ?? '',
      ihb_einschraenkungen_einsteiger: ihb?.einschraenkungen_einsteiger ?? '',
      ihb_rechtsgrundlage: ihb?.rechtsgrundlage ?? '',
      ihb_design_experte: ihb?.ihb_design_experte ?? '',
      ihb_design_einsteiger: ihb?.ihb_design_einsteiger ?? '',
      ihb_sap_config_experte: ihb?.sap_config_experte ?? '',
      ihb_sap_config_einsteiger: ihb?.sap_config_einsteiger ?? '',
      ihb_handlungsempfehlung: ihb?.handlungsempfehlung ?? '',
    };
  });

  return (
    <Suspense>
      <SplitView
        items={items}
        columns={COLUMNS}
        primaryField="code"
        secondaryField="name"
        searchFields={['code', 'name', 'currency', 'summary']}
        filterField="complexity"
        filterLabel="Alle Komplexitäten"
        idField="code"
        complexityField="complexity"
        documentField="document_md"
        summaryField="key_note"
        editTable="countries"
        countryBlocksMap={countryBlocksMap}
      />
    </Suspense>
  );
}
