'use client';

import { DataGrid, type DataGridColumn } from '@/components/browse/data-grid';
import type { ClearingEntry } from '@/lib/queries/entries';

const columns: DataGridColumn<ClearingEntry>[] = [
  {
    accessorKey: 'name',
    label: 'System-Name',
    header: 'System',
    size: 220,
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'abkuerzung',
    label: 'Abkürzung',
    header: 'Kürzel',
    size: 90,
    cell: ({ getValue }) => (
      <span className="font-mono text-base font-semibold text-primary">
        {getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'typ',
    label: 'Typ',
    header: 'Typ',
    size: 110,
  },
  {
    accessorKey: 'region',
    label: 'Region / Land',
    header: 'Region',
    size: 120,
  },
  {
    accessorKey: 'betreiber',
    label: 'Betreiber',
    header: 'Betreiber',
    size: 130,
  },
  {
    accessorKey: 'cut_off',
    label: 'Cut-off Zeiten',
    header: 'Cut-off',
    size: 140,
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return <span className="line-clamp-2 text-base">{v}</span>;
    },
  },
  {
    accessorKey: 'status',
    label: 'Status',
    header: 'Status',
    size: 120,
  },
  {
    accessorKey: 'beschreibung_einsteiger',
    label: 'Beschreibung (Einsteiger)',
    header: 'Beschreibung',
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return <span className="line-clamp-2 text-base text-muted-foreground">{v}</span>;
    },
  },
  { accessorKey: 'beschreibung_experte', label: 'Beschreibung (Experte)', header: 'Beschreibung (Exp.)' },
  { accessorKey: 'nachrichtenformat', label: 'Nachrichtenformat', header: 'Nachrichtenformat' },
  { accessorKey: 'settlement_modell', label: 'Settlement-Modell', header: 'Settlement' },
  { accessorKey: 'teilnehmer', label: 'Teilnehmer & Zugang', header: 'Teilnehmer' },
  { accessorKey: 'relevanz_experte', label: 'Relevanz (Experte)', header: 'Relevanz (Exp.)' },
  { accessorKey: 'relevanz_einsteiger', label: 'Relevanz (Einsteiger)', header: 'Relevanz' },
  { accessorKey: 'corporate_zugang_experte', label: 'Corporate Zugang (Experte)', header: 'Corp. Zugang (Exp.)' },
  { accessorKey: 'corporate_zugang_einsteiger', label: 'Corporate Zugang (Einsteiger)', header: 'Corp. Zugang' },
];

const EXPANDED_COLS = [
  'beschreibung_experte', 'beschreibung_einsteiger', 'nachrichtenformat', 'settlement_modell',
  'cut_off', 'teilnehmer', 'relevanz_experte', 'relevanz_einsteiger',
  'corporate_zugang_experte', 'corporate_zugang_einsteiger', 'status',
];

interface Props {
  data: ClearingEntry[];
}

export function ClearingGrid({ data }: Props) {
  return (
    <DataGrid
      data={data}
      columns={columns}
      expandedColumns={EXPANDED_COLS}
    />
  );
}
