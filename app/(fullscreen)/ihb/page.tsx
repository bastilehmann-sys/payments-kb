import { getIhbEntries } from '@/lib/queries/entries';
import { SplitView, type Column } from '@/components/browse/split-view';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IHB / POBO — Payments KB',
};

const COLUMNS: Column[] = [
  // Land
  { key: 'land',        label: 'Land',          section: 'Land' },
  { key: 'iso_waehrung',label: 'ISO / Währung', section: 'Land' },
  { key: 'region',      label: 'Region',         section: 'Land' },
  { key: 'ihb_bewertung',label: 'IHB-Bewertung', section: 'Land' },
  // Status
  { key: 'pobo_status',     label: 'POBO-Status',             section: 'Status' },
  { key: 'cobo_status',     label: 'COBO-Status',             section: 'Status' },
  { key: 'netting_erlaubt', label: 'Netting erlaubt?',        section: 'Status' },
  { key: 'lokales_konto',   label: 'Lokales Konto erforderlich?', section: 'Status' },
  // Einschränkungen
  { key: 'einschraenkungen_experte',   label: 'Einschränkungen (Experte)',   section: 'Einschränkungen' },
  { key: 'einschraenkungen_einsteiger',label: 'Einschränkungen (Einsteiger)',section: 'Einschränkungen' },
  // Rechtlich
  { key: 'rechtsgrundlage', label: 'Rechtsgrundlage', section: 'Rechtlich' },
  // Design
  { key: 'ihb_design_experte',   label: 'IHB-Design (Experte)',   section: 'Design' },
  { key: 'ihb_design_einsteiger',label: 'IHB-Design (Einsteiger)',section: 'Design' },
  // SAP
  { key: 'sap_config_experte',   label: 'SAP-Konfiguration (Experte)',   section: 'SAP' },
  { key: 'sap_config_einsteiger',label: 'SAP-Konfiguration (Einsteiger)',section: 'SAP' },
  // Empfehlung
  { key: 'handlungsempfehlung', label: 'Handlungsempfehlung', section: 'Empfehlung' },
];

export default async function IhbPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getIhbEntries();

  return (
    <Suspense>
      <SplitView
        items={data as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
        primaryField="land"
        secondaryField="ihb_bewertung"
        searchFields={['land', 'iso_waehrung', 'region', 'ihb_bewertung']}
        filterField="ihb_bewertung"
        filterLabel="Alle Bewertungen"
        tertiaryField="region"
        summaryField="handlungsempfehlung"
        editTable="ihb_entries"
      />
    </Suspense>
  );
}
