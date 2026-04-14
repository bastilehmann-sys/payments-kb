import { getClearingEntries, getZahlungsartenForClearing, type ZahlungsartWithLink } from '@/lib/queries/entries';
import { SplitView, type Column } from '@/components/browse/split-view';
import { RelatedItemsPanel } from '@/components/browse/related-items-panel';
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

  // Fetch related Zahlungsarten for every clearing entry in parallel
  const relatedMap = Object.fromEntries(
    await Promise.all(
      data.map(async (c) => [c.id, await getZahlungsartenForClearing(c.id)])
    )
  );

  type ClearingItem = typeof data[number] & { relatedZahlungsarten?: typeof relatedMap[string] };

  const enriched: ClearingItem[] = data.map((c) => ({
    ...c,
    relatedZahlungsarten: relatedMap[c.id] ?? [],
  }));

  return (
    <Suspense>
      <SplitView
        items={enriched as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
        primaryField="name"
        secondaryField="region"
        searchFields={['name', 'abkuerzung', 'region', 'typ', 'betreiber']}
        filterField="region"
        filterLabel="Alle Regionen"
        headerBadgeField="abkuerzung"
        summaryField="beschreibung_einsteiger"
        editTable="clearing_entries"
        relatedPanel={(item) => {
          const typed = item as ClearingItem;
          const zahlungsarten: ZahlungsartWithLink[] = (typed.relatedZahlungsarten as ZahlungsartWithLink[]) ?? [];
          return (
            <RelatedItemsPanel
              title="Zahlungsarten über dieses System"
              items={zahlungsarten.map((z: ZahlungsartWithLink) => ({
                id: z.id,
                label: z.name,
                abkuerzung: z.kuerzel,
                note: z.note,
                primary: z.is_primary,
              }))}
              targetPath="/zahlungsarten"
            />
          );
        }}
      />
    </Suspense>
  );
}
