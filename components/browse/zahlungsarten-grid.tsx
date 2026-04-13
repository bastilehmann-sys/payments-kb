'use client';

import { DataGrid, type DataGridColumn } from '@/components/browse/data-grid';
import type { ZahlungsartEntry } from '@/lib/queries/entries';

const columns: DataGridColumn<ZahlungsartEntry>[] = [
  {
    accessorKey: 'name',
    label: 'Zahlungsart',
    header: 'Zahlungsart',
    size: 220,
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'kuerzel',
    label: 'Kürzel / Code',
    header: 'Code',
    size: 100,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs font-semibold text-primary">
        {getValue<string>() ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'instrument_typ',
    label: 'Instrument-Typ',
    header: 'Typ',
    size: 120,
  },
  {
    accessorKey: 'geltungsbereich_waehrung',
    label: 'Geltungsbereich & Währung',
    header: 'Währung',
    size: 120,
  },
  {
    accessorKey: 'cut_off',
    label: 'Cut-off Zeiten',
    header: 'Cut-off',
    size: 140,
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return <span className="line-clamp-2 text-sm">{v}</span>;
    },
  },
  {
    accessorKey: 'laenderverfuegbarkeit',
    label: 'Länderverfügbarkeit',
    header: 'Länder',
    cell: ({ getValue }) => {
      const v = getValue<string>();
      if (!v) return null;
      return <span className="line-clamp-2 text-sm text-muted-foreground">{v}</span>;
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
  { accessorKey: 'clearing_system', label: 'Clearing-System', header: 'Clearing' },
  { accessorKey: 'nachrichtenformat', label: 'Nachrichtenformat', header: 'Format' },
  { accessorKey: 'value_date_auftraggeber', label: 'Value Date Auftraggeber', header: 'Value Date (AG)' },
  { accessorKey: 'value_date_empfaenger', label: 'Value Date Empfänger', header: 'Value Date (E)' },
  { accessorKey: 'fristen_vorlaufzeiten', label: 'Fristen & Vorlaufzeiten', header: 'Fristen' },
  { accessorKey: 'kosten', label: 'Kosten (Richtwerte)', header: 'Kosten' },
  { accessorKey: 'limits', label: 'Betragslimits', header: 'Limits' },
  { accessorKey: 'corporate_relevanz_experte', label: 'Corporate Relevanz (Experte)', header: 'Corp. Relevanz (Exp.)' },
  { accessorKey: 'corporate_relevanz_einsteiger', label: 'Corporate Relevanz (Einsteiger)', header: 'Corp. Relevanz' },
  { accessorKey: 'risiken_experte', label: 'Risiken (Experte)', header: 'Risiken (Exp.)' },
  { accessorKey: 'risiken_einsteiger', label: 'Risiken (Einsteiger)', header: 'Risiken' },
  { accessorKey: 'laender_einschraenkungen', label: 'Länder mit Einschränkungen', header: 'Einschränkungen' },
];

const EXPANDED_COLS = [
  'beschreibung_experte', 'beschreibung_einsteiger', 'clearing_system', 'nachrichtenformat',
  'cut_off', 'value_date_auftraggeber', 'value_date_empfaenger', 'fristen_vorlaufzeiten',
  'kosten', 'limits', 'corporate_relevanz_experte', 'corporate_relevanz_einsteiger',
  'risiken_experte', 'risiken_einsteiger', 'laenderverfuegbarkeit', 'laender_einschraenkungen',
];

interface Props {
  data: ZahlungsartEntry[];
}

export function ZahlungsartenGrid({ data }: Props) {
  return (
    <DataGrid
      data={data}
      columns={columns}
      expandedColumns={EXPANDED_COLS}
    />
  );
}
