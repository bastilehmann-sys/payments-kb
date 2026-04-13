'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type Row,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// ─── Icons (inline SVG, no library) ────────────────────────────────────────

function IconSortAsc() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 3l-4 5h8l-4-5zM4 11h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSortDesc() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 13l4-5H4l4 5zM4 5h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSort() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 3l-3 4h6L8 3zM8 13l-3-4h6l-3 4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn('size-3.5 shrink-0 transition-transform', open && 'rotate-180')}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconColumns() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2" width="5" height="12" rx="1" strokeLinecap="round" />
      <rect x="10" y="2" width="5" height="12" rx="1" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="6.5" r="4" />
      <path d="M9.5 9.5L13 13" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function IconExpand({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn('size-3 shrink-0 text-muted-foreground transition-transform', open && 'rotate-90')}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────

export type DataGridColumn<T> = ColumnDef<T> & {
  /** Human-readable label shown in column visibility picker */
  label?: string;
}

interface DataGridProps<T extends object> {
  columns: DataGridColumn<T>[];
  data: T[];
  /** Column id to expand in row detail view */
  expandedColumns?: string[];
  initialSort?: SortingState;
  initialFilters?: ColumnFiltersState;
  className?: string;
}

// ─── Row detail panel ────────────────────────────────────────────────────────

function RowDetail<T extends object>({
  row,
  columns,
  expandedColumns,
}: {
  row: Row<T>;
  columns: DataGridColumn<T>[];
  expandedColumns: string[];
}) {
  const cols = columns.filter((col) => {
    const id = (col as { accessorKey?: string }).accessorKey ?? (col as { id?: string }).id ?? '';
    return expandedColumns.includes(id);
  });

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {cols.map((col) => {
        const id = (col as { accessorKey?: string }).accessorKey ?? (col as { id?: string }).id ?? '';
        const label = col.label ?? id;
        const cell = row.getValue<string>(id);
        if (!cell) return null;
        return (
          <div key={id} className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {cell}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Column visibility dropdown ──────────────────────────────────────────────

function ColumnVisibilityDropdown<T extends object>({
  columns,
  visibility,
  onToggle,
}: {
  columns: DataGridColumn<T>[];
  visibility: VisibilityState;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleableCols = columns.filter((col) => {
    const id = (col as { accessorKey?: string }).accessorKey ?? (col as { id?: string }).id ?? '';
    return id && id !== 'expander';
  });

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="gap-1.5"
      >
        <IconColumns />
        Spalten
        <IconChevronDown open={open} />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-border bg-popover p-1 shadow-lg">
          {toggleableCols.map((col) => {
            const id = (col as { accessorKey?: string }).accessorKey ?? (col as { id?: string }).id ?? '';
            const label = col.label ?? id;
            const visible = visibility[id] !== false;
            return (
              <button
                key={id}
                onClick={() => onToggle(id)}
                className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded border',
                    visible
                      ? 'border-primary bg-primary'
                      : 'border-border bg-transparent'
                  )}
                >
                  {visible && (
                    <svg viewBox="0 0 10 10" className="size-2.5" fill="none" stroke="white" strokeWidth="1.8">
                      <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-foreground">{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main DataGrid component ─────────────────────────────────────────────────

export function DataGrid<T extends object>({
  columns,
  data,
  expandedColumns = [],
  initialSort = [],
  initialFilters = [],
  className,
}: DataGridProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFilters);
  const [sorting, setSorting] = React.useState<SortingState>(initialSort);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  const [showColumnFilters, setShowColumnFilters] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  });

  const rows = table.getRowModel().rows;
  const totalRows = data.length;
  const filteredCount = rows.length;

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleColumnVisibility = (id: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  const hasActiveFilters = globalFilter.length > 0 || columnFilters.length > 0;

  const clearAllFilters = () => {
    setGlobalFilter('');
    setColumnFilters([]);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Global search */}
        <div className="relative flex min-w-[200px] flex-1 items-center">
          <span className="pointer-events-none absolute left-2.5">
            <IconSearch />
          </span>
          <Input
            type="search"
            placeholder="Suchen…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Toggle per-column filters */}
        <Button
          variant={showColumnFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowColumnFilters((v) => !v)}
          className="gap-1.5"
        >
          <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 3h14M3 8h10M6 13h4" strokeLinecap="round" />
          </svg>
          Filter
        </Button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1.5 text-destructive">
            <IconClose />
            Filter löschen
          </Button>
        )}

        {/* Column visibility */}
        <ColumnVisibilityDropdown
          columns={columns}
          visibility={columnVisibility}
          onToggle={toggleColumnVisibility}
        />
      </div>

      {/* Table wrapper — horizontal scroll on small screens */}
      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-sm">
          {/* Sticky header */}
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-3 py-2.5 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      <div className="flex flex-col gap-1">
                        {/* Header label + sort button */}
                        <button
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          className={cn(
                            'flex items-center gap-1 text-left',
                            canSort && 'cursor-pointer hover:text-foreground'
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="ml-0.5">
                              {sorted === 'asc' ? <IconSortAsc /> : sorted === 'desc' ? <IconSortDesc /> : <IconSort />}
                            </span>
                          )}
                        </button>

                        {/* Per-column filter input */}
                        {showColumnFilters && header.column.getCanFilter() && (
                          <Input
                            type="text"
                            placeholder="…"
                            value={(header.column.getFilterValue() as string) ?? ''}
                            onChange={(e) => header.column.setFilterValue(e.target.value)}
                            className="h-6 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  Keine Einträge gefunden.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isExpanded = expandedRows.has(row.id);
                const hasExpandable = expandedColumns.length > 0;

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={hasExpandable ? () => toggleRow(row.id) : undefined}
                      className={cn(
                        'transition-colors',
                        hasExpandable && 'cursor-pointer hover:bg-muted/40',
                        isExpanded && 'bg-muted/30'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 py-2.5 align-top text-sm text-foreground"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}

                      {/* Expand indicator column */}
                      {hasExpandable && (
                        <td className="w-6 pr-2 align-middle">
                          <IconExpand open={isExpanded} />
                        </td>
                      )}
                    </tr>

                    {/* Expanded row detail */}
                    {isExpanded && hasExpandable && (
                      <tr className="bg-muted/20">
                        <td colSpan={row.getVisibleCells().length + 1} className="p-0">
                          <RowDetail
                            row={row}
                            columns={columns}
                            expandedColumns={expandedColumns}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: row count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredCount === totalRows
            ? `${totalRows} Einträge`
            : `${filteredCount} von ${totalRows} Einträgen`}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
