'use client';

import { DataGrid, type DataGridColumn } from '@/components/browse/data-grid';
import type { FormatEntry } from '@/lib/queries/entries';

const columns: DataGridColumn<FormatEntry>[] = [
  {
    accessorKey: 'format_name',
    label: 'Format-Name',
    header: 'Format',
    size: 120,
    cell: ({ getValue }) => (
      <span className="font-mono text-sm font-semibold text-primary">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: 'nachrichtentyp',
    label: 'Nachrichtentyp',
    header: 'Nachrichtentyp',
    size: 180,
  },
  {
    accessorKey: 'familie_standard',
    label: 'Familie / Standard',
    header: 'Standard',
    size: 120,
  },
  {
    accessorKey: 'aktuelle_version',
    label: 'Version',
    header: 'Version',
    size: 90,
  },
  {
    accessorKey: 'sap_relevanz',
    label: 'SAP-Relevanz',
    header: 'SAP-Relevanz',
    size: 140,
  },
  {
    accessorKey: 'status',
    label: 'Status',
    header: 'Status',
    size: 120,
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return (
        <span className="inline-flex rounded-full px-2 py-0.5 text-sm font-medium ring-1 ring-border">
          {v}
        </span>
      );
    },
  },
  {
    accessorKey: 'beschreibung_einsteiger',
    label: 'Beschreibung (Einsteiger)',
    header: 'Beschreibung',
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return <span className="line-clamp-2 text-sm text-muted-foreground">{v}</span>;
    },
  },
  { accessorKey: 'beschreibung_experte', label: 'Beschreibung (Experte)', header: 'Beschreibung (Exp.)' },
  { accessorKey: 'versionshistorie', label: 'Versionshistorie', header: 'Versionshistorie' },
  { accessorKey: 'wichtige_felder', label: 'Wichtige Felder', header: 'Wichtige Felder' },
  { accessorKey: 'pflichtfelder', label: 'Pflichtfelder', header: 'Pflichtfelder' },
  { accessorKey: 'datenrichtung', label: 'Datenrichtung', header: 'Datenrichtung' },
  { accessorKey: 'fehlerquellen_experte', label: 'Fehlerquellen (Experte)', header: 'Fehlerquellen (Exp.)' },
  { accessorKey: 'fehlerquellen_einsteiger', label: 'Fehlerquellen (Einsteiger)', header: 'Fehlerquellen' },
  { accessorKey: 'sap_mapping_experte', label: 'SAP-Mapping (Experte)', header: 'SAP-Mapping (Exp.)' },
  { accessorKey: 'sap_mapping_einsteiger', label: 'SAP-Mapping (Einsteiger)', header: 'SAP-Mapping' },
  { accessorKey: 'projektfehler_experte', label: 'Projektfehler (Experte)', header: 'Projektfehler (Exp.)' },
  { accessorKey: 'projektfehler_einsteiger', label: 'Projektfehler (Einsteiger)', header: 'Projektfehler' },
];

const EXPANDED_COLS = [
  'beschreibung_experte', 'beschreibung_einsteiger', 'versionshistorie', 'wichtige_felder',
  'pflichtfelder', 'datenrichtung', 'fehlerquellen_experte', 'fehlerquellen_einsteiger',
  'sap_mapping_experte', 'sap_mapping_einsteiger', 'projektfehler_experte', 'projektfehler_einsteiger',
];

interface Props {
  data: FormatEntry[];
}

export function FormateGrid({ data }: Props) {
  return (
    <DataGrid
      data={data}
      columns={columns}
      expandedColumns={EXPANDED_COLS}
    />
  );
}
