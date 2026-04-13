'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockGroup, CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  blocks: CountryBlockGroup[];
}

function FieldRow({ row }: { row: CountryBlockRow }) {
  const [expanded, setExpanded] = useState(false);

  const hasDetails =
    (row.experte && row.experte.trim().length > 0) ||
    (row.praxis && row.praxis.trim().length > 0);

  return (
    <div className="group border-b border-border/60 last:border-0 py-4">
      <div className="flex items-start gap-4">
        {/* Field name */}
        <div className="w-44 shrink-0 pt-0.5">
          <span className="text-sm font-semibold text-foreground">{row.feld}</span>
        </div>

        {/* Einsteiger text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/80 leading-relaxed">
            {row.einsteiger ?? <span className="text-muted-foreground italic">—</span>}
          </p>

          {/* Expanded: Experte + Praxis */}
          {expanded && (
            <div className="mt-4 space-y-3 border-l-2 border-amber-400/60 pl-4">
              {row.experte && row.experte.trim() && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                    Experte
                  </p>
                  <p className="text-sm text-foreground/75 leading-relaxed">{row.experte}</p>
                </div>
              )}
              {row.praxis && row.praxis.trim() && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                    SAP-Praxis
                  </p>
                  <p className="text-sm text-foreground/75 leading-relaxed font-mono text-xs">
                    {row.praxis}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expand toggle */}
        {hasDetails && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="shrink-0 mt-0.5 rounded-md border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-700 transition-colors"
          >
            {expanded ? 'Einklappen' : 'Details'}
          </button>
        )}
      </div>
    </div>
  );
}

export function CountryBlocksTabs({ blocks }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const active = blocks[activeTab];

  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-border bg-muted/30 px-4 gap-1 pt-3">
        {blocks.map((block, idx) => (
          <button
            key={block.blockNo}
            onClick={() => setActiveTab(idx)}
            className={cn(
              'shrink-0 rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === idx
                ? 'border-amber-500 text-amber-700 bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/60'
            )}
          >
            <span className="mr-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
              {block.blockNo}
            </span>
            {block.blockTitle}
          </button>
        ))}
      </div>

      {/* Content */}
      {active && (
        <div className="p-6">
          {/* Block header */}
          <div className="mb-5 flex items-center gap-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {active.blockTitle}
            </h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {active.rows.length} Felder
            </span>
          </div>

          {/* Column headers */}
          <div className="mb-2 flex items-center gap-4 px-0">
            <div className="w-44 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Feld
            </div>
            <div className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Einsteiger
            </div>
          </div>

          {/* Rows */}
          <div>
            {active.rows.map((row) => (
              <FieldRow key={`${row.blockNo}-${row.rowOrder}`} row={row} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
