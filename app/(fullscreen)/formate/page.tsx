import { getFormatEntries } from '@/lib/queries/entries';
import { type Column } from '@/components/browse/split-view';
import { FormateClient } from './formate-client';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formate — Payments KB',
};

const COLUMNS: Column[] = [
  // Allgemein
  { key: 'format_name',      label: 'Format-Name',           section: 'Allgemein' },
  { key: 'aktuelle_version', label: 'Aktuelle Version',      section: 'Allgemein' },
  { key: 'nachrichtentyp',   label: 'Nachrichtentyp',        section: 'Allgemein' },
  { key: 'familie_standard', label: 'Familie / Standard',    section: 'Allgemein' },
  { key: 'datenrichtung',    label: 'Datenrichtung',         section: 'Allgemein' },
  { key: 'sap_relevanz',     label: 'SAP-Relevanz',          section: 'Allgemein' },
  { key: 'status',           label: 'Status',                section: 'Allgemein' },
  // Versionen
  { key: 'versionshistorie', label: 'Versionshistorie', section: 'Versionen' },
  // Beschreibung
  { key: 'beschreibung_experte',   label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger',label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Aufbau
  { key: 'wichtige_felder', label: 'Wichtige Felder', section: 'Aufbau' },
  { key: 'pflichtfelder',   label: 'Pflichtfelder',   section: 'Aufbau' },
  // SAP
  { key: 'sap_mapping_experte',   label: 'SAP Mapping (Experte)',   section: 'SAP' },
  { key: 'sap_mapping_einsteiger',label: 'SAP Mapping (Einsteiger)',section: 'SAP' },
  // Fehler
  { key: 'fehlerquellen_experte',   label: 'Fehlerquellen (Experte)',   section: 'Fehler & Risiken' },
  { key: 'fehlerquellen_einsteiger',label: 'Fehlerquellen (Einsteiger)',section: 'Fehler & Risiken' },
  { key: 'projektfehler_experte',   label: 'Projektfehler (Experte)',   section: 'Fehler & Risiken' },
  { key: 'projektfehler_einsteiger',label: 'Projektfehler (Einsteiger)',section: 'Fehler & Risiken' },
];

export default async function FormatePage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getFormatEntries();

  return (
    <Suspense>
      <FormateClient
        items={data as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
      />
    </Suspense>
  );
}
