'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { RegulatorikEntry } from '@/lib/queries/entries';

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

function IconArrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M10 2h4m0 0v4M14 2L7.5 8.5" />
    </svg>
  );
}

// ─── Typ badge colors ─────────────────────────────────────────────────────────

function typColor(typ: string | null): string {
  switch (typ?.toLowerCase()) {
    case 'eu-verordnung': return 'text-[#4a9eff] border-[#4a9eff]/40 bg-[#4a9eff]/10';
    case 'eu-richtlinie': return 'text-[#b47aff] border-[#b47aff]/40 bg-[#b47aff]/10';
    case 'standard': return 'text-[#86bc25] border-[#86bc25]/40 bg-[#86bc25]/10';
    case 'nationale regulierung': return 'text-[#ffb340] border-[#ffb340]/40 bg-[#ffb340]/10';
    default: return 'text-muted-foreground border-border bg-muted/30';
  }
}

// ─── Single card row ─────────────────────────────────────────────────────────

function CardRow({ entry }: { entry: RegulatorikEntry }) {
  const kuerzel = entry.kuerzel ?? '—';
  const description = entry.beschreibung_einsteiger ?? entry.beschreibung_experte ?? '';
  const meta: string[] = [
    entry.typ,
    entry.kategorie,
    entry.in_kraft_seit ? `In Kraft: ${entry.in_kraft_seit}` : null,
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/mockups/2/${encodeURIComponent(kuerzel)}`}
      className="group flex items-stretch gap-0 rounded-lg border border-border bg-card transition-all duration-200 hover:border-[#4a9eff]/40 hover:shadow-lg hover:shadow-[#4a9eff]/5 hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Left: Kürzel badge */}
      <div className="flex w-[120px] shrink-0 flex-col items-center justify-center gap-1 border-r border-border bg-muted/20 px-3 py-4">
        <span className="font-mono text-base font-bold text-[#4a9eff] text-center leading-tight">
          {kuerzel}
        </span>
        {entry.typ && (
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-center leading-tight',
              typColor(entry.typ),
            )}
          >
            {entry.typ}
          </span>
        )}
      </div>

      {/* Middle: content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-5 py-4">
        <h2 className="font-heading text-[17px] font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-[#4a9eff] transition-colors duration-150">
          {entry.name}
        </h2>
        {meta.length > 0 && (
          <p className="text-[11px] text-muted-foreground/70 font-medium">
            {meta.join(' · ')}
          </p>
        )}
        {description && (
          <p className="text-sm text-foreground/65 leading-relaxed line-clamp-2 max-w-prose">
            {description}
          </p>
        )}
      </div>

      {/* Right: meta block */}
      <div className="flex w-[200px] shrink-0 flex-col justify-center gap-2 border-l border-border px-4 py-4 text-xs">
        {entry.naechste_aenderung && (
          <div className="space-y-0.5">
            <dt className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Nächste Änderung
            </dt>
            <dd className="font-medium text-foreground/80 tabular-nums">{entry.naechste_aenderung}</dd>
          </div>
        )}
        {entry.behoerde_link && (
          <div className="space-y-0.5">
            <dt className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Behörde
            </dt>
            <dd className="flex items-center gap-1 text-[#4a9eff] truncate">
              <span className="truncate">{entry.behoerde_link.replace(/^https?:\/\//, '').split('/')[0]}</span>
              <IconExternalLink />
            </dd>
          </div>
        )}
        {entry.betroffene_abteilungen && (
          <div className="space-y-0.5">
            <dt className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Abteilungen
            </dt>
            <dd className="text-foreground/70 leading-relaxed">{entry.betroffene_abteilungen}</dd>
          </div>
        )}
        <div className="mt-auto flex items-center justify-end">
          <IconArrow />
        </div>
      </div>
    </Link>
  );
}

// ─── Filter + list ───────────────────────────────────────────────────────────

type SortKey = 'kuerzel' | 'name' | 'in_kraft_seit';

export function CardRowList({ data }: { data: RegulatorikEntry[] }) {
  const [search, setSearch] = React.useState('');
  const [activeTyp, setActiveTyp] = React.useState<string | null>(null);
  const [sortKey, setSortKey] = React.useState<SortKey>('kuerzel');

  const typOptions = React.useMemo(
    () => [...new Set(data.map((d) => d.typ).filter(Boolean))].sort() as string[],
    [data],
  );

  const filtered = React.useMemo(() => {
    let rows = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(q)),
      );
    }
    if (activeTyp) {
      rows = rows.filter((r) => r.typ === activeTyp);
    }
    return [...rows].sort((a, b) => {
      const av = (a[sortKey] ?? '') as string;
      const bv = (b[sortKey] ?? '') as string;
      return av.localeCompare(bv, 'de');
    });
  }, [data, search, activeTyp, sortKey]);

  return (
    <div className="space-y-4">
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
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
              <IconClose />
            </button>
          )}
        </div>

        {/* Typ chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 shrink-0">
            Typ:
          </span>
          {typOptions.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTyp((prev) => (prev === t ? null : t))}
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-150',
                activeTyp === t
                  ? 'border-[#4a9eff] bg-[#4a9eff]/15 text-[#4a9eff]'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-[#4a9eff]/40 hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Sortierung:</span>
          {([['kuerzel', 'Kürzel'], ['name', 'Name'], ['in_kraft_seit', 'Datum']] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={cn(
                'rounded px-2 py-0.5 text-[11px] font-medium transition-colors',
                sortKey === key ? 'bg-[#4a9eff]/15 text-[#4a9eff]' : 'hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
          <span className="text-muted-foreground/60">· {filtered.length} Einträge</span>
        </div>
      </div>

      {/* Card list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            Keine Einträge gefunden
          </div>
        ) : (
          filtered.map((entry) => <CardRow key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
