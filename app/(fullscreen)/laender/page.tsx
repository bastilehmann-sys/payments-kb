import { listCountriesWithDocuments, getCountryBlocks } from '@/lib/queries/documents';
import { getIhbEntries } from '@/lib/queries/entries';
import { type Column } from '@/components/browse/split-view';
import { LaenderClient } from './laender-client';
import { IhbPanel } from '@/components/laender/ihb-panel';
import { RegulatorikItPanel } from '@/components/laender/regulatorik-it-panel';
import { ClearingItPanel } from '@/components/laender/clearing-it-panel';
import { SapItPanel } from '@/components/laender/sap-it-panel';
import { FormateItPanel } from '@/components/laender/formate-it-panel';
import { SerbienCodesDetails } from '@/components/laender/serbien-codes-details';
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

  const [countriesWithDocs, itBlocks, cnBlocks, rsBlocks, ihbEntries] = await Promise.all([
    listCountriesWithDocuments(),
    getCountryBlocks('IT'),
    getCountryBlocks('CN'),
    getCountryBlocks('RS'),
    getIhbEntries(),
  ]);

  // Index IHB entries by normalized land name
  const ihbByLand = new Map<string, (typeof ihbEntries)[number]>();
  for (const e of ihbEntries) {
    const key = normalizeLand(e.land);
    if (key && !ihbByLand.has(key)) ihbByLand.set(key, e);
  }

  // Build blocks map: country code → block groups
  type BlockGroup = Awaited<ReturnType<typeof getCountryBlocks>>[number];
  const countryBlocksMap: Record<string, BlockGroup[]> = {};

  function buildCountryBlocks(rawBlocks: BlockGroup[], landName: string, countryLabel: string, countryCode: string): BlockGroup[] {
    if (rawBlocks.length === 0) return [];
    // Quick-Reference-Block ausblenden (war in IT block 6)
    const filtered = rawBlocks.filter((b) => !/quick reference/i.test(b.blockTitle ?? ''));
    // Inhaltliche Panels nach blockTitle-Pattern
    const enriched = filtered.map((b) => {
      const t = (b.blockTitle ?? '').toLowerCase();
      if (/regulatorik/i.test(t))               return { ...b, customContent: <RegulatorikItPanel rows={b.rows} /> };
      if (/clearing|banken/i.test(t))           return { ...b, customContent: <ClearingItPanel rows={b.rows} countryLabel={countryLabel} /> };
      if (/sap[- ]/i.test(t))                   return { ...b, customContent: <SapItPanel rows={b.rows} /> };
      if (/format|instrument/i.test(t))         return { ...b, customContent: <FormateItPanel rows={b.rows} extraDetails={countryCode === 'RS' ? <SerbienCodesDetails /> : undefined} /> };
      return b;
    });
    // IHB / POBO / COBO synthetisch als zweiter Tab
    const ihb = ihbByLand.get(landName.toLowerCase());
    const ihbTab: BlockGroup[] = ihb
      ? [{
          blockNo: 1.5,
          blockTitle: 'IHB / POBO / COBO',
          rows: [],
          customContent: (
            <IhbPanel
              data={{
                ihb_bewertung: ihb.ihb_bewertung,
                pobo_status: ihb.pobo_status,
                cobo_status: ihb.cobo_status,
                netting_erlaubt: ihb.netting_erlaubt,
                lokales_konto: ihb.lokales_konto,
                einschraenkungen_experte: ihb.einschraenkungen_experte,
                einschraenkungen_einsteiger: ihb.einschraenkungen_einsteiger,
                rechtsgrundlage: ihb.rechtsgrundlage,
                handlungsempfehlung: ihb.handlungsempfehlung,
              }}
            />
          ),
        }]
      : [];
    return [...enriched, ...ihbTab].sort((a, b) => a.blockNo - b.blockNo);
  }

  const itOrdered = buildCountryBlocks(itBlocks, 'italien', 'Italien', 'IT');
  if (itOrdered.length > 0) countryBlocksMap['IT'] = itOrdered;

  const cnOrdered = buildCountryBlocks(cnBlocks, 'china', 'China', 'CN');
  if (cnOrdered.length > 0) countryBlocksMap['CN'] = cnOrdered;

  const rsOrdered = buildCountryBlocks(rsBlocks, 'serbien', 'Serbien', 'RS');
  if (rsOrdered.length > 0) countryBlocksMap['RS'] = rsOrdered;

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
      central_bank: c.central_bank ?? '',
      iso20022_status: c.iso20022_status ?? '',
      instant_payments: c.instant_payments ?? '',
      intercompany_netting: c.intercompany_netting ?? '',
      cash_pooling_external: c.cash_pooling_external ?? '',
      pobo: c.pobo ?? '',
      pino_routing: c.pino_routing ?? '',
      special_format_requirements: c.special_format_requirements ?? '',
      special_regulatory_requirements: c.special_regulatory_requirements ?? '',
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
