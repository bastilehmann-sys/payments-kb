'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { RegulatorikEntry } from '@/lib/queries/entries';

// ─── Field labels ────────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  kuerzel: 'Kürzel',
  name: 'Bezeichnung',
  typ: 'Typ',
  kategorie: 'Kategorie',
  in_kraft_seit: 'In Kraft seit',
  naechste_aenderung: 'Nächste Änderung',
  beschreibung_experte: 'Beschreibung (Experte)',
  beschreibung_einsteiger: 'Beschreibung (Einsteiger)',
  auswirkungen_experte: 'Auswirkungen (Experte)',
  auswirkungen_einsteiger: 'Auswirkungen (Einsteiger)',
  pflichtmassnahmen_experte: 'Pflichtmaßnahmen',
  pflichtmassnahmen_einsteiger: 'Pflichtmaßnahmen (Einsteiger)',
  best_practice_experte: 'Best Practice',
  best_practice_einsteiger: 'Best Practice (Einsteiger)',
  risiken_experte: 'Risiken',
  risiken_einsteiger: 'Risiken (Einsteiger)',
  betroffene_abteilungen: 'Betroffene Abteilungen',
  behoerde_link: 'Behörden-Link',
  geltungsbereich: 'Geltungsbereich',
  status_version: 'Status / Version',
};

// ─── Columns shown in the table ──────────────────────────────────────────────

interface Col {
  key: keyof RegulatorikEntry;
  label: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  render?: (val: string | null) => React.ReactNode;
}

const COLUMNS: Col[] = [
  {
    key: 'kuerzel',
    label: 'Kürzel',
    width: 'w-[80px]',
    render: (v) => (
      <span className="font-mono text-[11px] font-semibold text-primary">{v ?? '—'}</span>
    ),
  },
  {
    key: 'name',
    label: 'Bezeichnung',
    width: 'w-[220px]',
    render: (v) => (
      <span className="font-medium text-foreground truncate" title={v ?? ''}>
        {v ?? '—'}
      </span>
    ),
  },
  {
    key: 'typ',
    label: 'Typ',
    width: 'w-[110px]',
    render: (v) => v ? (
      <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
        {v}
      </span>
    ) : <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: 'kategorie',
    label: 'Kategorie',
    width: 'w-[130px]',
    render: (v) => (
      <span className="truncate text-muted-foreground text-xs" title={v ?? ''}>
        {v ?? '—'}
      </span>
    ),
  },
  {
    key: 'in_kraft_seit',
    label: 'In Kraft seit',
    width: 'w-[100px]',
    align: 'center',
    render: (v) => (
      <span className="text-xs text-muted-foreground tabular-nums">{v ?? '—'}</span>
    ),
  },
  {
    key: 'beschreibung_einsteiger',
    label: 'Beschreibung',
    render: (v) => v ? (
      <span className="truncate text-xs text-foreground/70 leading-relaxed" title={v}>
        {v}
      </span>
    ) : null,
  },
  {
    key: 'betroffene_abteilungen',
    label: 'Abteilungen',
    width: 'w-[140px]',
    render: (v) => (
      <span className="truncate text-xs text-muted-foreground" title={v ?? ''}>
        {v ?? '—'}
      </span>
    ),
  },
];

// ─── All chip-filter groups ───────────────────────────────────────────────────

const CHIP_FILTER_KEYS: Array<{ key: keyof RegulatorikEntry; label: string }> = [
  { key: 'typ', label: 'Typ' },
  { key: 'kategorie', label: 'Kategorie' },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="6.5" r="4" />
      <path d="M9.5 9.5L13 13" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M10 2h4m0 0v4M14 2L7.5 8.5" />
    </svg>
  );
}

// ─── Detail panel section ────────────────────────────────────────────────────

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {title}
      </h3>
      <div className="text-base text-foreground/80 leading-relaxed whitespace-pre-line max-w-prose">
        {children}
      </div>
    </div>
  );
}

// ─── Side panel ─────────────────────────────────────────────────────────────

function SidePanel({
  entry,
  onClose,
}: {
  entry: RegulatorikEntry | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!entry) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [entry, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-200',
          entry ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out overflow-hidden',
          'md:w-[50%]',
          entry ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Detail-Panel"
      >
        {entry && (
          <>
            {/* Panel header */}
            <div className="flex items-start gap-4 border-b border-border px-6 py-5">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {entry.kuerzel && (
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 rounded px-2 py-0.5">
                      {entry.kuerzel}
                    </span>
                  )}
                  {entry.typ && (
                    <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {entry.typ}
                    </span>
                  )}
                  {entry.kategorie && (
                    <span className="text-xs text-muted-foreground">{entry.kategorie}</span>
                  )}
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground leading-snug">
                  {entry.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Panel schließen (Esc)"
              >
                <IconClose />
              </button>
            </div>

            {/* Panel body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-muted/30 px-4 py-4 text-xs">
                {([
                  ['In Kraft seit', entry.in_kraft_seit],
                  ['Nächste Änderung', entry.naechste_aenderung],
                  ['Status / Version', entry.status_version],
                  ['Geltungsbereich', entry.geltungsbereich],
                  ['Betroffene Abteilungen', entry.betroffene_abteilungen],
                ] as [string, string | null][]).map(([label, val]) =>
                  val ? (
                    <div key={label} className="space-y-0.5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        {label}
                      </dt>
                      <dd className="text-foreground/80">{val}</dd>
                    </div>
                  ) : null,
                )}
              </div>

              {/* Behörde link */}
              {entry.behoerde_link && (
                <div className="space-y-1">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Behörden-Link
                  </dt>
                  <a
                    href={entry.behoerde_link.startsWith('http') ? entry.behoerde_link : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <span className="break-all">{entry.behoerde_link}</span>
                    <IconExternalLink />
                  </a>
                </div>
              )}

              {/* Long text sections */}
              {entry.beschreibung_experte && (
                <DetailSection title="Beschreibung (Experte)">{entry.beschreibung_experte}</DetailSection>
              )}
              {entry.beschreibung_einsteiger && (
                <DetailSection title="Beschreibung (Einsteiger)">{entry.beschreibung_einsteiger}</DetailSection>
              )}
              {entry.auswirkungen_experte && (
                <DetailSection title="Auswirkungen (Experte)">{entry.auswirkungen_experte}</DetailSection>
              )}
              {entry.auswirkungen_einsteiger && (
                <DetailSection title="Auswirkungen (Einsteiger)">{entry.auswirkungen_einsteiger}</DetailSection>
              )}
              {entry.pflichtmassnahmen_experte && (
                <DetailSection title="Pflichtmaßnahmen">{entry.pflichtmassnahmen_experte}</DetailSection>
              )}
              {entry.best_practice_experte && (
                <DetailSection title="Best Practice">{entry.best_practice_experte}</DetailSection>
              )}
              {entry.risiken_experte && (
                <DetailSection title="Risiken">{entry.risiken_experte}</DetailSection>
              )}
            </div>

            {/* Panel footer */}
            <div className="border-t border-border px-6 py-3 text-[10px] text-muted-foreground/60">
              Esc zum Schließen · ↑↓ zum Navigieren
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ─── Main grid ───────────────────────────────────────────────────────────────

export function LinearGrid({ data }: { data: RegulatorikEntry[] }) {
  const [search, setSearch] = React.useState('');
  const [activeChips, setActiveChips] = React.useState<Record<string, string | null>>({});
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const rowRefs = React.useRef<Record<string, HTMLTableRowElement | null>>({});

  // Unique chip values
  const chipOptions = React.useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const { key } of CHIP_FILTER_KEYS) {
      const vals = [...new Set(data.map((d) => d[key] as string | null).filter(Boolean))] as string[];
      result[key as string] = vals.sort();
    }
    return result;
  }, [data]);

  // Filtered data
  const filtered = React.useMemo(() => {
    let rows = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(q)),
      );
    }
    for (const { key } of CHIP_FILTER_KEYS) {
      const active = activeChips[key as string];
      if (active) {
        rows = rows.filter((r) => (r[key] as string | null) === active);
      }
    }
    return rows;
  }, [data, search, activeChips]);

  const selectedEntry = filtered.find((r) => r.id === selectedId) ?? null;

  // Keyboard navigation
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!filtered.length) return;
      const idx = filtered.findIndex((r) => r.id === selectedId);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = filtered[Math.min(idx + 1, filtered.length - 1)];
        setSelectedId(next.id);
        rowRefs.current[next.id]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = filtered[Math.max(idx - 1, 0)];
        setSelectedId(prev.id);
        rowRefs.current[prev.id]?.scrollIntoView({ block: 'nearest' });
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [filtered, selectedId]);

  function toggleChip(key: string, val: string) {
    setActiveChips((prev) => ({
      ...prev,
      [key]: prev[key] === val ? null : val,
    }));
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5 min-w-[200px]">
          <IconSearch />
          <input
            type="text"
            placeholder="Suche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Suche löschen"
            >
              <IconClose />
            </button>
          )}
        </div>

        {/* Chip filters */}
        {CHIP_FILTER_KEYS.map(({ key, label }) => (
          <div key={key as string} className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 shrink-0">
              {label}:
            </span>
            {chipOptions[key as string]?.map((val) => (
              <button
                key={val}
                onClick={() => toggleChip(key as string, val)}
                className={cn(
                  'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-150',
                  activeChips[key as string] === val
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {val}
              </button>
            ))}
          </div>
        ))}

        {/* Result count */}
        <span className="ml-auto text-xs text-muted-foreground/60 shrink-0">
          {filtered.length} von {data.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key as string}
                    className={cn(
                      'px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 select-none',
                      col.width,
                      col.align === 'center' && 'text-center',
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-10 text-center text-base text-muted-foreground"
                  >
                    Keine Einträge gefunden
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const isSelected = row.id === selectedId;
                  return (
                    <tr
                      key={row.id}
                      ref={(el) => { rowRefs.current[row.id] = el; }}
                      onClick={() => setSelectedId(isSelected ? null : row.id)}
                      className={cn(
                        'h-9 cursor-pointer border-b border-border/50 transition-colors duration-100 relative',
                        i % 2 === 0 ? 'bg-card' : 'bg-muted/20',
                        isSelected
                          ? 'bg-primary/8 border-l-2 border-l-primary'
                          : 'hover:bg-muted/40',
                      )}
                      tabIndex={0}
                      aria-selected={isSelected}
                    >
                      {COLUMNS.map((col) => {
                        const val = row[col.key] as string | null;
                        return (
                          <td
                            key={col.key as string}
                            className={cn(
                              'max-w-0 overflow-hidden px-3 py-0 align-middle',
                              col.align === 'center' && 'text-center',
                            )}
                          >
                            <div className="truncate">
                              {col.render ? col.render(val) : (
                                <span className="truncate text-xs text-muted-foreground" title={val ?? ''}>
                                  {val ?? '—'}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side panel */}
      <SidePanel entry={selectedEntry} onClose={() => setSelectedId(null)} />
    </>
  );
}
