'use client';

import { DataGrid, type DataGridColumn } from '@/components/browse/data-grid';
import type { RegulatorikEntry } from '@/lib/queries/entries';

const columns: DataGridColumn<RegulatorikEntry>[] = [
  {
    accessorKey: 'kuerzel',
    label: 'Kürzel',
    header: 'Kürzel',
    size: 90,
    cell: ({ getValue }) => (
      <span className="font-mono text-base font-semibold text-primary">
        {getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    label: 'Name',
    header: 'Name',
    size: 220,
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'kategorie',
    label: 'Kategorie',
    header: 'Kategorie',
    size: 140,
  },
  {
    accessorKey: 'typ',
    label: 'Typ',
    header: 'Typ',
    size: 110,
  },
  {
    accessorKey: 'geltungsbereich',
    label: 'Geltungsbereich',
    header: 'Geltungsbereich',
    size: 140,
  },
  {
    accessorKey: 'beschreibung_einsteiger',
    label: 'Beschreibung (Einsteiger)',
    header: 'Beschreibung',
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return (
        <span className="line-clamp-2 text-base text-muted-foreground" title={v}>
          {v}
        </span>
      );
    },
  },
  { accessorKey: 'beschreibung_experte', label: 'Beschreibung (Experte)', header: 'Beschreibung (Exp.)' },
  { accessorKey: 'status_version', label: 'Status / Version', header: 'Status' },
  { accessorKey: 'in_kraft_seit', label: 'In Kraft seit', header: 'In Kraft seit' },
  { accessorKey: 'naechste_aenderung', label: 'Nächste Änderung', header: 'Nächste Änderung' },
  { accessorKey: 'behoerde_link', label: 'Behörde & Link', header: 'Behörde' },
  { accessorKey: 'betroffene_abteilungen', label: 'Betroffene Abteilungen', header: 'Betroffene Abt.' },
  { accessorKey: 'auswirkungen_experte', label: 'Auswirkungen (Experte)', header: 'Auswirkungen (Exp.)' },
  { accessorKey: 'auswirkungen_einsteiger', label: 'Auswirkungen (Einsteiger)', header: 'Auswirkungen' },
  { accessorKey: 'pflichtmassnahmen_experte', label: 'Pflichtmaßnahmen (Experte)', header: 'Pflichtmaßn. (Exp.)' },
  { accessorKey: 'pflichtmassnahmen_einsteiger', label: 'Pflichtmaßnahmen (Einsteiger)', header: 'Pflichtmaßnahmen' },
  { accessorKey: 'best_practice_experte', label: 'Best Practice (Experte)', header: 'Best Practice (Exp.)' },
  { accessorKey: 'best_practice_einsteiger', label: 'Best Practice (Einsteiger)', header: 'Best Practice' },
  { accessorKey: 'risiken_experte', label: 'Risiken (Experte)', header: 'Risiken (Exp.)' },
  { accessorKey: 'risiken_einsteiger', label: 'Risiken (Einsteiger)', header: 'Risiken' },
];

// Long-text columns visible in expanded row
const EXPANDED_COLS = [
  'beschreibung_experte', 'beschreibung_einsteiger', 'auswirkungen_experte',
  'auswirkungen_einsteiger', 'pflichtmassnahmen_experte', 'pflichtmassnahmen_einsteiger',
  'best_practice_experte', 'best_practice_einsteiger', 'risiken_experte', 'risiken_einsteiger',
  'behoerde_link', 'betroffene_abteilungen', 'status_version', 'in_kraft_seit', 'naechste_aenderung',
];

interface Props {
  data: RegulatorikEntry[];
}

export function RegulatorikGrid({ data }: Props) {
  return (
    <DataGrid
      data={data}
      columns={columns}
      expandedColumns={EXPANDED_COLS}
      initialSort={[]}
    />
  );
}
