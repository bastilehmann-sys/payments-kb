'use client';

import { DataGrid, type DataGridColumn } from '@/components/browse/data-grid';
import type { IhbEntry } from '@/lib/queries/entries';

const STATUS_COLORS: Record<string, string> = {
  'Vollständig möglich': 'text-[#22c55e]',
  'Eingeschränkt': 'text-[#f59e0b]',
  'Nicht möglich': 'text-[#ef4444]',
  'Verboten': 'text-[#ef4444]',
};

function StatusCell({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const colorClass = Object.entries(STATUS_COLORS).find(([key]) =>
    value.toLowerCase().includes(key.toLowerCase())
  )?.[1] ?? 'text-foreground';
  return (
    <span className={`text-sm font-medium ${colorClass}`}>
      {value}
    </span>
  );
}

const columns: DataGridColumn<IhbEntry>[] = [
  {
    accessorKey: 'land',
    label: 'Land',
    header: 'Land',
    size: 130,
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'iso_waehrung',
    label: 'ISO / Währung',
    header: 'ISO',
    size: 90,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'region',
    label: 'Region',
    header: 'Region',
    size: 110,
  },
  {
    accessorKey: 'ihb_bewertung',
    label: 'IHB-Bewertung',
    header: 'IHB-Bewertung',
    size: 130,
    cell: ({ getValue }) => <StatusCell value={getValue<string>()} />,
  },
  {
    accessorKey: 'pobo_status',
    label: 'POBO möglich?',
    header: 'POBO',
    size: 100,
    cell: ({ getValue }) => <StatusCell value={getValue<string>()} />,
  },
  {
    accessorKey: 'cobo_status',
    label: 'COBO möglich?',
    header: 'COBO',
    size: 100,
    cell: ({ getValue }) => <StatusCell value={getValue<string>()} />,
  },
  {
    accessorKey: 'netting_erlaubt',
    label: 'Netting erlaubt?',
    header: 'Netting',
    size: 90,
  },
  {
    accessorKey: 'lokales_konto',
    label: 'Lokales Konto erforderlich?',
    header: 'Lok. Konto',
    size: 100,
  },
  {
    accessorKey: 'handlungsempfehlung',
    label: 'Handlungsempfehlung',
    header: 'Empfehlung',
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return <span className="line-clamp-2 text-sm text-muted-foreground">{v}</span>;
    },
  },
  { accessorKey: 'einschraenkungen_experte', label: 'Einschränkungen (Experte)', header: 'Einschränkungen (Exp.)' },
  { accessorKey: 'einschraenkungen_einsteiger', label: 'Einschränkungen (Einsteiger)', header: 'Einschränkungen' },
  { accessorKey: 'rechtsgrundlage', label: 'Rechtliche Grundlage', header: 'Rechtsgrundlage' },
  { accessorKey: 'ihb_design_experte', label: 'IHB-Design (Experte)', header: 'IHB-Design (Exp.)' },
  { accessorKey: 'ihb_design_einsteiger', label: 'IHB-Design (Einsteiger)', header: 'IHB-Design' },
  { accessorKey: 'sap_config_experte', label: 'SAP-Konfiguration (Experte)', header: 'SAP-Config (Exp.)' },
  { accessorKey: 'sap_config_einsteiger', label: 'SAP-Konfiguration (Einsteiger)', header: 'SAP-Config' },
];

const EXPANDED_COLS = [
  'einschraenkungen_experte', 'einschraenkungen_einsteiger', 'rechtsgrundlage',
  'ihb_design_experte', 'ihb_design_einsteiger', 'sap_config_experte', 'sap_config_einsteiger',
  'handlungsempfehlung', 'netting_erlaubt', 'lokales_konto',
];

interface Props {
  data: IhbEntry[];
}

export function IhbGrid({ data }: Props) {
  return (
    <DataGrid
      data={data}
      columns={columns}
      expandedColumns={EXPANDED_COLS}
    />
  );
}
