import { getRegulatorikEntries } from '@/lib/queries/entries';
import { SplitView, type Column } from '@/components/browse/split-view';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulatorik — Payments KB',
};

const COLUMNS: Column[] = [
  // Allgemein
  { key: 'kuerzel',               label: 'Kürzel',               section: 'Allgemein' },
  { key: 'name',                  label: 'Name',                  section: 'Allgemein' },
  { key: 'typ',                   label: 'Typ',                   section: 'Allgemein' },
  { key: 'kategorie',             label: 'Kategorie',             section: 'Allgemein' },
  { key: 'geltungsbereich',       label: 'Geltungsbereich',       section: 'Allgemein' },
  { key: 'status_version',        label: 'Status / Version',      section: 'Allgemein' },
  { key: 'in_kraft_seit',         label: 'In Kraft seit',         section: 'Allgemein' },
  { key: 'naechste_aenderung',    label: 'Nächste Änderung',      section: 'Allgemein' },
  { key: 'behoerde_link',         label: 'Behörde / Link',        section: 'Allgemein' },
  { key: 'betroffene_abteilungen',label: 'Betroffene Abteilungen',section: 'Allgemein' },
  // Beschreibung
  { key: 'beschreibung_experte',   label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger',label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Auswirkungen
  { key: 'auswirkungen_experte',   label: 'Auswirkungen (Experte)',   section: 'Auswirkungen' },
  { key: 'auswirkungen_einsteiger',label: 'Auswirkungen (Einsteiger)',section: 'Auswirkungen' },
  // Pflichtmaßnahmen
  { key: 'pflichtmassnahmen_experte',   label: 'Pflichtmaßnahmen (Experte)',   section: 'Pflichtmaßnahmen' },
  { key: 'pflichtmassnahmen_einsteiger',label: 'Pflichtmaßnahmen (Einsteiger)',section: 'Pflichtmaßnahmen' },
  // Best Practice
  { key: 'best_practice_experte',   label: 'Best Practice (Experte)',   section: 'Best Practice' },
  { key: 'best_practice_einsteiger',label: 'Best Practice (Einsteiger)',section: 'Best Practice' },
  // Risiken
  { key: 'risiken_experte',   label: 'Risiken (Experte)',   section: 'Risiken' },
  { key: 'risiken_einsteiger',label: 'Risiken (Einsteiger)',section: 'Risiken' },
  // Querverweise
  { key: 'verwandte_regulierungen', label: 'Verwandte Regulierungen', section: 'Querverweise' },
  // Compliance-Folgen
  { key: 'bussgeld',     label: 'Bußgeld / Sanktionshöhe',         section: 'Compliance-Folgen' },
  { key: 'pruefpflicht', label: 'Prüfpflicht / Audit-Relevanz',    section: 'Compliance-Folgen' },
  // SAP & System
  { key: 'sap_bezug', label: 'SAP-Bezug / System-Auswirkung', section: 'SAP & System' },
  // Umsetzung
  { key: 'aufwand_tshirt', label: 'Implementierungsaufwand (T-Shirt)', section: 'Umsetzung' },
];

export default async function RegulatorikPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const data = await getRegulatorikEntries();

  return (
    <Suspense>
      <SplitView
        items={data as unknown as Record<string, unknown>[]}
        columns={COLUMNS}
        primaryField="kuerzel"
        secondaryField="name"
        searchFields={['kuerzel', 'name', 'kategorie', 'typ']}
        filterField="typ"
        filterLabel="Alle Typen"
        summaryField="beschreibung_einsteiger"
        editTable="regulatorik_entries"
        pinnedLinks={[
          { label: 'SAP-Matrix', sublabel: 'Alle 34 Regelungen im Überblick', href: '/regulatorik/sap-matrix' },
        ]}
      />
    </Suspense>
  );
}
