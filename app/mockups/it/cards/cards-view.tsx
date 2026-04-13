'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockGroup, CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  blocks: CountryBlockGroup[];
}

/** Returns just the first sentence from a string */
function firstSentence(text: string | null): string {
  if (!text) return '';
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.slice(0, 100) + (text.length > 100 ? '…' : '');
}

interface DrawerProps {
  row: CountryBlockRow | null;
  onClose: () => void;
}

function Drawer({ row, onClose }: DrawerProps) {
  if (!row) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl">
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Block {row.blockNo} · {row.blockTitle}
            </p>
            <h2 className="font-heading text-lg font-semibold text-foreground mt-0.5">{row.feld}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Schließen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Einsteiger */}
          {row.einsteiger && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-green-600">
                Einsteiger
              </p>
              <p className="text-sm text-foreground/85 leading-relaxed">{row.einsteiger}</p>
            </div>
          )}

          {/* Experte */}
          {row.experte && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                Experte
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">{row.experte}</p>
            </div>
          )}

          {/* SAP-Praxis */}
          {row.praxis && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                SAP-Praxis
              </p>
              <p className="text-sm text-foreground/75 leading-relaxed font-mono text-xs bg-muted/40 rounded-lg px-4 py-3">
                {row.praxis}
              </p>
            </div>
          )}

          {!row.einsteiger && !row.experte && !row.praxis && (
            <p className="text-sm text-muted-foreground italic">Keine Informationen vorhanden.</p>
          )}
        </div>
      </div>
    </>
  );
}

function FieldCard({
  row,
  onClick,
}: {
  row: CountryBlockRow;
  onClick: (row: CountryBlockRow) => void;
}) {
  const pitch = firstSentence(row.einsteiger);
  const hasContent = row.experte || row.einsteiger || row.praxis;

  return (
    <button
      onClick={() => hasContent && onClick(row)}
      className={cn(
        'group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left transition-all duration-150',
        hasContent
          ? 'hover:border-blue-400/60 hover:shadow-sm hover:shadow-blue-500/5 cursor-pointer'
          : 'opacity-60 cursor-default'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-foreground group-hover:text-blue-700 transition-colors duration-150 leading-snug">
          {row.feld}
        </span>
        {hasContent && (
          <span className="mt-0.5 shrink-0">
            <svg
              viewBox="0 0 16 16"
              className="size-3.5 text-muted-foreground group-hover:text-blue-500 transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3h5v5M3 13l10-10" />
            </svg>
          </span>
        )}
      </div>

      {pitch ? (
        <p className="text-xs text-foreground/60 leading-relaxed line-clamp-2">{pitch}</p>
      ) : (
        <p className="text-xs text-muted-foreground italic">—</p>
      )}
    </button>
  );
}

export function CardsView({ blocks }: Props) {
  const [selected, setSelected] = useState<CountryBlockRow | null>(null);

  return (
    <>
      <div className="space-y-10">
        {blocks.map((block) => (
          <section key={block.blockNo}>
            {/* Block header */}
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-xs font-bold text-blue-600">
                {block.blockNo}
              </span>
              <h2 className="font-heading text-base font-semibold text-foreground">
                {block.blockTitle}
              </h2>
              <span className="text-xs text-muted-foreground">
                {block.rows.length} Felder
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {block.rows.map((row) => (
                <FieldCard
                  key={`${row.blockNo}-${row.rowOrder}`}
                  row={row}
                  onClick={setSelected}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Drawer */}
      {selected && <Drawer row={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
