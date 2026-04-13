'use client';

import * as React from 'react';
import type { CountryBlockGroup } from '@/lib/queries/documents';

interface CountryBlocksViewProps {
  blocks: CountryBlockGroup[];
}

export function CountryBlocksView({ blocks }: CountryBlocksViewProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="mt-10 border-t border-border pt-6">
      <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-[#86bc25]/80">
        Länderprofil (detailliert)
      </h3>

      {blocks.map((block) => (
        <div key={block.blockNo} className="mb-10">
          {/* Block subheading */}
          <h4 className="mb-4 text-base font-bold text-foreground/90">
            BLOCK {block.blockNo} — {block.blockTitle}
          </h4>

          {/* Desktop 4-column table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-[20%] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Feld
                  </th>
                  <th className="w-[30%] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Experte-Detail
                  </th>
                  <th className="w-[30%] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Einsteiger-Erläuterung
                  </th>
                  <th className="w-[20%] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    SAP-Relevanz
                  </th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/60 last:border-b-0 odd:bg-transparent even:bg-muted/10 align-top"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground/90 leading-snug whitespace-pre-line">
                      {row.feld}
                    </td>
                    <td className="px-4 py-3 leading-relaxed text-foreground/85 whitespace-pre-line">
                      {row.experte ?? '—'}
                    </td>
                    <td className="px-4 py-3 leading-relaxed text-muted-foreground italic whitespace-pre-line">
                      {row.einsteiger ?? ''}
                    </td>
                    <td className="px-4 py-3 leading-relaxed text-foreground/80 whitespace-pre-line">
                      {row.praxis ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked view */}
          <div className="md:hidden space-y-4">
            {block.rows.map((row, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-muted/10 p-4 space-y-3"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Feld
                  </div>
                  <div className="font-semibold text-foreground/90 whitespace-pre-line leading-snug">
                    {row.feld}
                  </div>
                </div>

                {row.experte && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Experte-Detail
                    </div>
                    <div className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                      {row.experte}
                    </div>
                  </div>
                )}

                {row.einsteiger && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Einsteiger-Erläuterung
                    </div>
                    <div className="text-sm leading-relaxed text-muted-foreground italic whitespace-pre-line">
                      {row.einsteiger}
                    </div>
                  </div>
                )}

                {row.praxis && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      SAP-Relevanz
                    </div>
                    <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                      {row.praxis}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
