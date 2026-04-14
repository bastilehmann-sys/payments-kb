import { listCountriesWithDocuments, getCountryBlocks } from '@/lib/queries/documents';
import { getIhbEntries } from '@/lib/queries/entries';
import { type Column } from '@/components/browse/split-view';
import { LaenderClient } from './laender-client';
import { IhbPanel } from '@/components/laender/ihb-panel';
import { RegulatorikItPanel } from '@/components/laender/regulatorik-it-panel';
import { ClearingItPanel } from '@/components/laender/clearing-it-panel';
import { SapItPanel } from '@/components/laender/sap-it-panel';
import { FormateItPanel } from '@/components/laender/formate-it-panel';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Länder — Payments KB',
};

const COLUMNS: Column[] = [
  // Wichtigster Hinweis (alle IHB-Daten werden über das IhbPanel im extraDetailHeader gerendert)
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
    // Synthetischen IHB / POBO / COBO-Tab als zweiten einfügen (nach „Allgemein")
    const italyIhb = ihbByLand.get('italien');
    const ihbTab = italyIhb
      ? [{
          blockNo: 1.5,
          blockTitle: 'IHB / POBO / COBO',
          rows: [],
          customContent: (
            <IhbPanel
              data={{
                ihb_bewertung: italyIhb.ihb_bewertung,
                pobo_status: italyIhb.pobo_status,
                cobo_status: italyIhb.cobo_status,
                netting_erlaubt: italyIhb.netting_erlaubt,
                lokales_konto: italyIhb.lokales_konto,
                einschraenkungen_experte: italyIhb.einschraenkungen_experte,
                einschraenkungen_einsteiger: italyIhb.einschraenkungen_einsteiger,
                rechtsgrundlage: italyIhb.rechtsgrundlage,
                handlungsempfehlung: italyIhb.handlungsempfehlung,
              }}
            />
          ),
        }]
      : [];
    // Regulatorik (#2) und Clearing (#3) durch Card-Panels ersetzen
    const enrichedBlocks = filteredItBlocks.map((b) => {
      if (b.blockNo === 2) return { ...b, customContent: <RegulatorikItPanel rows={b.rows} /> };
      if (b.blockNo === 3) return { ...b, customContent: <ClearingItPanel rows={b.rows} /> };
      if (b.blockNo === 4) return { ...b, customContent: <SapItPanel rows={b.rows} /> };
      if (b.blockNo === 5) return { ...b, customContent: <FormateItPanel rows={b.rows} /> };
      return b;
    });
    const ordered = [...enrichedBlocks, ...ihbTab].sort((a, b) => a.blockNo - b.blockNo);
    countryBlocksMap['IT'] = ordered;
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
      <LaenderClient
        items={items as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
        countryBlocksMap={countryBlocksMap}
      />
    </Suspense>
  );
}
