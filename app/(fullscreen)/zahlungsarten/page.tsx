import { getZahlungsartEntries } from '@/lib/queries/entries';
import { SplitView, type Column } from '@/components/browse/split-view';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zahlungsarten — Payments KB',
};

const COLUMNS: Column[] = [
  // Allgemein
  { key: 'name',                    label: 'Name',                    section: 'Allgemein' },
  { key: 'kuerzel',                 label: 'Kürzel',                  section: 'Allgemein' },
  { key: 'instrument_typ',          label: 'Instrument / Typ',        section: 'Allgemein' },
  { key: 'geltungsbereich_waehrung',label: 'Geltungsbereich / Währung',section: 'Allgemein' },
  { key: 'clearing_system',         label: 'Clearing-System',         section: 'Allgemein' },
  { key: 'nachrichtenformat',       label: 'Nachrichtenformat',       section: 'Allgemein' },
  // Beschreibung
  { key: 'beschreibung_experte',   label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger',label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Timing
  { key: 'cut_off',                label: 'Cut-off-Zeiten',           section: 'Timing' },
  { key: 'value_date_auftraggeber',label: 'Value Date (Auftraggeber)', section: 'Timing' },
  { key: 'value_date_empfaenger',  label: 'Value Date (Empfänger)',   section: 'Timing' },
  { key: 'fristen_vorlaufzeiten',  label: 'Fristen & Vorlaufzeiten', section: 'Timing' },
  // Kosten & Limits
  { key: 'kosten', label: 'Kosten',  section: 'Kosten & Limits' },
  { key: 'limits', label: 'Limits',  section: 'Kosten & Limits' },
  // Corporate
  { key: 'corporate_relevanz_experte',   label: 'Corporate-Relevanz (Experte)',   section: 'Corporate' },
  { key: 'corporate_relevanz_einsteiger',label: 'Corporate-Relevanz (Einsteiger)',section: 'Corporate' },
  // Risiken
  { key: 'risiken_experte',   label: 'Risiken (Experte)',   section: 'Risiken' },
  { key: 'risiken_einsteiger',label: 'Risiken (Einsteiger)',section: 'Risiken' },
  // Länder
  { key: 'laenderverfuegbarkeit',   label: 'Länderverfügbarkeit',   section: 'Länder' },
  { key: 'laender_einschraenkungen',label: 'Länder-Einschränkungen',section: 'Länder' },
];

export default async function ZahlungsartenPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getZahlungsartEntries();

  return (
    <Suspense>
      <SplitView
        items={data as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
        primaryField="name"
        secondaryField="instrument_typ"
        searchFields={['name', 'kuerzel', 'instrument_typ', 'clearing_system', 'nachrichtenformat']}
        filterField="instrument_typ"
        filterLabel="Alle Typen"
        summaryField="beschreibung_einsteiger"
        editTable="zahlungsart_entries"
      />
    </Suspense>
  );
}
