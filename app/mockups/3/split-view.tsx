'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { RegulatorikEntry } from '@/lib/queries/entries';

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-muted-foreground/60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

function IconChevron() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
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

// ─── Detail section ───────────────────────────────────────────────────────────

function DetailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2 py-5 border-b border-border last:border-b-0', className)}>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-[#b47aff]/80">{title}</dt>
      <dd className="text-base text-foreground/80 leading-relaxed whitespace-pre-line max-w-prose">
        {children}
      </dd>
    </div>
  );
}

// ─── Detail panel (right side) ───────────────────────────────────────────────

function DetailPanel({ entry }: { entry: RegulatorikEntry | null }) {
  if (!entry) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30">
          <svg viewBox="0 0 24 24" className="size-5 text-muted-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-base text-muted-foreground/60">Eintrag auswählen</p>
        <p className="text-xs text-muted-foreground/40">Klick auf einen Eintrag in der linken Liste</p>
      </div>
    );
  }

  const meta: Array<[string, string | null]> = [
    ['Typ', entry.typ],
    ['Kategorie', entry.kategorie],
    ['In Kraft seit', entry.in_kraft_seit],
    ['Nächste Änderung', entry.naechste_aenderung],
    ['Status / Version', entry.status_version],
    ['Geltungsbereich', entry.geltungsbereich],
    ['Betroffene Abteilungen', entry.betroffene_abteilungen],
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Detail header */}
      <div className="border-b border-border px-6 py-5 space-y-3">
        <div className="flex items-start gap-4">
          {/* Big kürzel badge */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#b47aff]/40 bg-[#b47aff]/10">
            <span className="font-mono text-lg font-bold text-[#b47aff] leading-none">
              {entry.kuerzel ?? '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <h2 className="font-heading text-2xl font-bold text-foreground leading-snug">
              {entry.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {entry.typ && (
                <span className="rounded-full border border-[#b47aff]/40 bg-[#b47aff]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#b47aff]">
                  {entry.typ}
                </span>
              )}
              {entry.kategorie && (
                <span className="text-xs text-muted-foreground">{entry.kategorie}</span>
              )}
            </div>
          </div>
        </div>

        {/* Inline meta strip */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg bg-muted/20 px-4 py-3">
          {meta.map(([label, val]) =>
            val ? (
              <div key={label} className="space-y-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 block">
                  {label}
                </span>
                <span className="text-xs text-foreground/80">{val}</span>
              </div>
            ) : null,
          )}
        </div>

        {entry.behoerde_link && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground/60">Behörde:</span>
            <a
              href={entry.behoerde_link.startsWith('http') ? entry.behoerde_link : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#b47aff] hover:underline break-all"
            >
              {entry.behoerde_link}
              <IconExternalLink />
            </a>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6">
        <dl>
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
          {entry.pflichtmassnahmen_einsteiger && (
            <DetailSection title="Pflichtmaßnahmen (Einsteiger)">{entry.pflichtmassnahmen_einsteiger}</DetailSection>
          )}
          {entry.best_practice_experte && (
            <DetailSection title="Best Practice">{entry.best_practice_experte}</DetailSection>
          )}
          {entry.best_practice_einsteiger && (
            <DetailSection title="Best Practice (Einsteiger)">{entry.best_practice_einsteiger}</DetailSection>
          )}
          {entry.risiken_experte && (
            <DetailSection title="Risiken">{entry.risiken_experte}</DetailSection>
          )}
          {entry.risiken_einsteiger && (
            <DetailSection title="Risiken (Einsteiger)">{entry.risiken_einsteiger}</DetailSection>
          )}
        </dl>
      </div>
    </div>
  );
}

// ─── Left list item ───────────────────────────────────────────────────────────

function ListItem({
  entry,
  isSelected,
  onClick,
}: {
  entry: RegulatorikEntry;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-3 rounded-md transition-all duration-150 relative border',
        isSelected
          ? 'bg-[#b47aff]/12 border-[#b47aff]/40 shadow-sm'
          : 'border-transparent hover:bg-muted/40 hover:border-border',
      )}
    >
      {/* Selected accent */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-0.5 rounded-r bg-[#b47aff]" />
      )}

      <div className="space-y-0.5 pl-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-mono text-[11px] font-bold leading-none transition-colors',
              isSelected ? 'text-[#b47aff]' : 'text-muted-foreground/80',
            )}
          >
            {entry.kuerzel ?? '—'}
          </span>
          {entry.typ && (
            <span className="rounded px-1 py-0.5 text-[9px] font-medium bg-muted/60 text-muted-foreground/70">
              {entry.typ}
            </span>
          )}
        </div>
        <p
          className={cn(
            'text-xs leading-snug line-clamp-1 transition-colors',
            isSelected ? 'text-foreground font-medium' : 'text-foreground/70',
          )}
        >
          {entry.name}
        </p>
        {entry.kategorie && (
          <p className="text-[10px] text-muted-foreground/60 leading-snug">{entry.kategorie}</p>
        )}
      </div>
    </button>
  );
}

// ─── Main split view ─────────────────────────────────────────────────────────

export function SplitView({ data }: { data: RegulatorikEntry[] }) {
  const [selectedId, setSelectedId] = React.useState<string | null>(data[0]?.id ?? null);
  const [search, setSearch] = React.useState('');
  const [typFilter, setTypFilter] = React.useState<string>('');

  const typOptions = React.useMemo(
    () => [...new Set(data.map((d) => d.typ).filter(Boolean))].sort() as string[],
    [data],
  );

  const filtered = React.useMemo(() => {
    let rows = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.kuerzel?.toLowerCase().includes(q) ||
          r.name?.toLowerCase().includes(q) ||
          r.kategorie?.toLowerCase().includes(q),
      );
    }
    if (typFilter) {
      rows = rows.filter((r) => r.typ === typFilter);
    }
    return rows;
  }, [data, search, typFilter]);

  const selectedEntry = data.find((r) => r.id === selectedId) ?? null;

  // If selected entry filtered out, reset selection
  React.useEffect(() => {
    if (selectedId && !filtered.find((r) => r.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  }, [filtered, selectedId]);

  // Mobile: show master list or detail depending on state
  // Desktop: side by side

  return (
    <div>
      {/* Desktop: side by side */}
      <div className="hidden lg:flex gap-0 rounded-lg border border-border bg-card overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
        {/* Left: master list */}
        <div className="flex w-[380px] shrink-0 flex-col border-r border-border">
          {/* List header + filters */}
          <div className="space-y-2 border-b border-border px-3 py-3">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
              <IconSearch />
              <input
                type="text"
                placeholder="Suche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                  <IconClose />
                </button>
              )}
            </div>

            {/* Typ dropdown */}
            <div className="relative">
              <select
                value={typFilter}
                onChange={(e) => setTypFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-border bg-muted/30 px-3 py-1.5 pr-7 text-xs text-foreground outline-none focus:border-[#b47aff]/60"
              >
                <option value="">Alle Typen</option>
                {typOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <IconChevron />
              </span>
            </div>

            <p className="text-[10px] text-muted-foreground/60 px-1">
              {filtered.length} von {data.length} Einträgen
            </p>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground/60">Keine Einträge</p>
            ) : (
              filtered.map((entry) => (
                <ListItem
                  key={entry.id}
                  entry={entry}
                  isSelected={entry.id === selectedId}
                  onClick={() => setSelectedId(entry.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: detail */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DetailPanel entry={selectedEntry} />
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="lg:hidden space-y-4">
        {/* Master list */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="space-y-2 border-b border-border px-3 py-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
              <IconSearch />
              <input
                type="text"
                placeholder="Suche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
            </div>
          </div>
          <div className="px-2 py-2 space-y-0.5 max-h-64 overflow-y-auto">
            {filtered.map((entry) => (
              <ListItem
                key={entry.id}
                entry={entry}
                isSelected={entry.id === selectedId}
                onClick={() => setSelectedId(entry.id)}
              />
            ))}
          </div>
        </div>

        {/* Detail */}
        {selectedEntry && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DetailPanel entry={selectedEntry} />
          </div>
        )}
      </div>
    </div>
  );
}
