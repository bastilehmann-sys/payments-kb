import { listCountriesWithDocuments } from '@/lib/queries/documents';
import { SplitView, type Column } from '@/components/browse/split-view';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Länder — Payments KB',
};

const COLUMNS: Column[] = [
  // Übersicht
  { key: 'code',       label: 'ISO-Code',  section: 'Übersicht' },
  { key: 'name',       label: 'Land',      section: 'Übersicht' },
  { key: 'complexity', label: 'Komplexität',section: 'Übersicht' },
  { key: 'currency',   label: 'Währung',   section: 'Übersicht' },
  { key: 'summary',    label: 'Zusammenfassung', section: 'Übersicht' },
  // Payment-Infrastruktur
  { key: 'payment_infra', label: 'Payment-Infrastruktur', section: 'Payment-Infrastruktur' },
  // IHB/POBO/COBO
  { key: 'ihb_pobo_cobo', label: 'IHB / POBO / COBO', section: 'IHB / POBO / COBO' },
  // Regulatorik
  { key: 'regulatorik', label: 'Regulatorik', section: 'Regulatorik' },
  // Lokale Besonderheiten
  { key: 'local_specifics', label: 'Lokale Besonderheiten', section: 'Lokale Besonderheiten' },
  // SAP-Aufwand
  { key: 'sap_effort', label: 'SAP-Aufwand', section: 'SAP-Aufwand' },
  // Wichtigster Hinweis
  { key: 'key_note', label: 'Wichtigster Hinweis', section: 'Wichtigster Hinweis' },
];

export default async function LaenderPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const countriesWithDocs = await listCountriesWithDocuments();

  // Flatten document content_md into the item for SplitView
  const items = countriesWithDocs.map((c) => ({
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
  }));

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
      />
    </Suspense>
  );
}
