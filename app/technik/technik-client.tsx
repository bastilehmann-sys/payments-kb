'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TechnikEntry } from '@/lib/queries/technik';

const FILTERS = [
  { label: 'Alle', value: '' },
  { label: 'Bank-seitig', value: 'bank' },
  { label: 'SAP-nativ', value: 'sap' },
  { label: 'SWIFT', value: 'swift' },
];

const COMPLEXITY_COLORS: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-green-400',
  3: 'bg-yellow-400',
  4: 'bg-orange-400',
  5: 'bg-red-400',
};

interface Props {
  entries: TechnikEntry[];
}

export function TechnikClient({ entries }: Props) {
  const [activeFilter, setActiveFilter] = useState('');

  const filtered = activeFilter
    ? entries.filter(e => e.category === activeFilter)
    : entries;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Technik</h1>
        <p className="mt-1 text-muted-foreground">
          Verbindungsprotokolle für den elektronischen Zahlungsverkehr
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filter:
        </span>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              activeFilter === f.value
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">Keine Einträge für diesen Filter.</p>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(entry => (
          <Link
            key={entry.id}
            href={`/technik/${entry.id}`}
            className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                {entry.name}
              </h2>
              <div className="flex shrink-0 flex-wrap justify-end gap-1">
                {(entry.badges as string[]).slice(0, 2).map(badge => (
                  <span
                    key={badge}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {entry.subtitle}
            </p>

            <div className="flex flex-wrap gap-1">
              {(entry.tags as string[]).slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {entry.komplexitaet !== null && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Komplexität:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 w-4 rounded-full',
                        i < (entry.komplexitaet ?? 0)
                          ? COMPLEXITY_COLORS[entry.komplexitaet ?? 1]
                          : 'bg-muted'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
