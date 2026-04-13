'use client';

import * as React from 'react';
import type { CountryBlockGroup } from '@/lib/queries/documents';

interface CountryBlocksViewProps {
  blocks: CountryBlockGroup[];
}

/**
 * Render a cell value. When the value contains explicit line breaks with
 * bullet-like prefixes (•, -, 1), 2), etc.) on their own lines, render as <ul>.
 * Otherwise render as <p> with preserved whitespace.
 * Does NOT try to split inline prose — respects the source structure from Excel.
 */
function CellValue({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n').map((l) => l.trim());
  const nonEmpty = lines.filter(Boolean);
  if (nonEmpty.length === 0) return null;

  // Detect if each non-empty line starts with a bullet/number pattern
  const bulletPrefix = /^(?:[•·●▪\-–—*]|\d+[).]|[a-z][).])\s+/;
  const bulletLines = nonEmpty.filter((l) => bulletPrefix.test(l));
  const isList = bulletLines.length >= 2 && bulletLines.length / nonEmpty.length >= 0.6;

  if (isList) {
    return (
      <ul className="list-disc space-y-1 pl-5 marker:text-primary/60">
        {nonEmpty.map((line, i) => {
          const cleaned = line.replace(bulletPrefix, '');
          return (
            <li key={i} className="text-sm leading-relaxed text-foreground/90">
              {cleaned}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
      {text}
    </p>
  );
}

export function CountryBlocksView({ blocks }: CountryBlocksViewProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="mt-10 border-t border-border pt-6">
      <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-[#86bc25]/80">
        Länderprofil (detailliert)
      </h3>

      {blocks.map((block) => (
        <section key={block.blockNo} className="mb-12">
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#86bc25]/80 border-t border-border pt-5">
            Block {block.blockNo} — {block.blockTitle}
          </h4>

          <div className="space-y-8">
            {block.rows.map((row, idx) => (
              <div key={idx} className="space-y-3">
                {/* Field label */}
                <div className="text-base font-semibold text-foreground whitespace-pre-line leading-snug">
                  {row.feld}
                </div>

                {/* Grouped cells stacked */}
                <div className="space-y-3 pl-1">
                  {row.experte && (
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Experte
                      </div>
                      <CellValue text={row.experte} />
                    </div>
                  )}
                  {row.einsteiger && (
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Einsteiger
                      </div>
                      <CellValue text={row.einsteiger} />
                    </div>
                  )}
                  {row.praxis && (
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        SAP / Praxis
                      </div>
                      <CellValue text={row.praxis} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
