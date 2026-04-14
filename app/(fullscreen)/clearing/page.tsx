import { getClearingEntries, getZahlungsartenForClearing } from '@/lib/queries/entries';
import { type Column } from '@/components/browse/split-view';
import { ClearingClient } from './clearing-client';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clearing — Payments KB',
};

const COLUMNS: Column[] = [
  { key: 'name',              label: 'Name',                     section: 'Allgemein' },
  { key: 'abkuerzung',        label: 'Abkürzung',                section: 'Allgemein' },
  { key: 'region',            label: 'Region',                    section: 'Allgemein' },
  { key: 'typ',               label: 'Typ',                       section: 'Allgemein' },
  { key: 'nachrichtenformat', label: 'Nachrichtenformat',         section: 'Allgemein' },
  { key: 'betreiber',         label: 'Betreiber',                 section: 'Allgemein' },
  { key: 'status',            label: 'Status',                    section: 'Allgemein' },
  { key: 'beschreibung_experte',   label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger',label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  { key: 'settlement_modell', label: 'Settlement-Modell',  section: 'Aufbau & Settlement' },
  { key: 'cut_off',           label: 'Cut-off-Zeiten',     section: 'Aufbau & Settlement' },
  { key: 'teilnehmer',        label: 'Teilnehmer',         section: 'Teilnehmer' },
  { key: 'relevanz_experte',           label: 'Relevanz (Experte)',           section: 'Corporate' },
  { key: 'relevanz_einsteiger',        label: 'Relevanz (Einsteiger)',        section: 'Corporate' },
  { key: 'corporate_zugang_experte',   label: 'Corporate-Zugang (Experte)',   section: 'Corporate' },
  { key: 'corporate_zugang_einsteiger',label: 'Corporate-Zugang (Einsteiger)',section: 'Corporate' },
];

export default async function ClearingPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getClearingEntries();

  const relatedMap = Object.fromEntries(
    await Promise.all(
      data.map(async (c) => [c.id, await getZahlungsartenForClearing(c.id)]),
    ),
  );

  const enriched = data.map((c) => ({
    ...c,
    relatedZahlungsarten: relatedMap[c.id] ?? [],
  }));

  return (
    <Suspense>
      <ClearingClient
        items={enriched as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
      />
    </Suspense>
  );
}
