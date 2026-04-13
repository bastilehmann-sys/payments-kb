import { getClearingEntries } from '@/lib/queries/entries';
import { SplitView, type Column } from '@/components/browse/split-view';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clearing — Payments KB',
};

const COLUMNS: Column[] = [
  // Allgemein
  { key: 'name',           label: 'Name',            section: 'Allgemein' },
  { key: 'abkuerzung',     label: 'Abkürzung',       section: 'Allgemein' },
  { key: 'region',         label: 'Region',           section: 'Allgemein' },
  { key: 'typ',            label: 'Typ',              section: 'Allgemein' },
  { key: 'nachrichtenformat', label: 'Nachrichtenformat', section: 'Allgemein' },
  { key: 'betreiber',      label: 'Betreiber',        section: 'Allgemein' },
  { key: 'status',         label: 'Status',           section: 'Allgemein' },
  // Beschreibung
  { key: 'beschreibung_experte',   label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger',label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Aufbau & Settlement
  { key: 'settlement_modell', label: 'Settlement-Modell', section: 'Aufbau & Settlement' },
  { key: 'cut_off',           label: 'Cut-off-Zeiten',   section: 'Aufbau & Settlement' },
  // Teilnehmer
  { key: 'teilnehmer', label: 'Teilnehmer', section: 'Teilnehmer' },
  // Corporate
  { key: 'relevanz_experte',          label: 'Relevanz (Experte)',         section: 'Corporate' },
  { key: 'relevanz_einsteiger',       label: 'Relevanz (Einsteiger)',      section: 'Corporate' },
  { key: 'corporate_zugang_experte',  label: 'Corporate-Zugang (Experte)',  section: 'Corporate' },
  { key: 'corporate_zugang_einsteiger',label: 'Corporate-Zugang (Einsteiger)',section: 'Corporate' },
];

export default async function ClearingPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getClearingEntries();

  return (
    <Suspense>
      <SplitView
        items={data as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
        primaryField="name"
        secondaryField="region"
        searchFields={['name', 'abkuerzung', 'region', 'typ', 'betreiber']}
        filterField="region"
        filterLabel="Alle Regionen"
        headerBadgeField="abkuerzung"
        summaryField="beschreibung_einsteiger"
      />
    </Suspense>
  );
}
