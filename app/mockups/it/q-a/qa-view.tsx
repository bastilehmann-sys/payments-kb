'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockGroup, CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  blocks: CountryBlockGroup[];
}

interface FlatRow extends CountryBlockRow {
  question: string;
  answer: string;
}

/** Convert a feld name to a natural-language question */
function toQuestion(feld: string): string {
  const map: Record<string, string> = {
    'Währung': 'Welche Währung nutzt Italien?',
    'Landessprache': 'Welche Sprache wird in Italien gesprochen?',
    'Zeitzone': 'In welcher Zeitzone liegt Italien?',
    'Bankarbeitstage': 'Was sind die Bankarbeitstage in Italien?',
    'Feiertage': 'Welche Feiertage sind in Italien relevant?',
    'IBAN-Format': 'Wie ist das IBAN-Format in Italien aufgebaut?',
    'BIC / SWIFT': 'Wie werden BIC/SWIFT-Codes in Italien verwendet?',
    'Regulierungsbehörde': 'Wer reguliert den Zahlungsverkehr in Italien?',
    'Hauptzahlungsformat': 'Welches Zahlungsformat wird in Italien hauptsächlich genutzt?',
    'SEPA-Mitglied': 'Ist Italien SEPA-Mitglied?',
  };

  if (map[feld]) return map[feld];

  // Generic pattern
  const trimmed = feld.trim();
  return `Was gilt für „${trimmed}" in Italien?`;
}

/** Build a concise answer from einsteiger + relevant praxis bits */
function buildAnswer(row: CountryBlockRow): string {
  const parts: string[] = [];
  if (row.einsteiger?.trim()) parts.push(row.einsteiger.trim());
  if (row.praxis?.trim()) {
    const praxis = row.praxis.trim();
    // Only show first sentence of praxis as a hint
    const first = praxis.match(/^[^.!?]+[.!?]/)?.[0] ?? praxis.slice(0, 120);
    if (first && !parts.some((p) => p.includes(first.slice(0, 20)))) {
      parts.push(first);
    }
  }
  return parts.join(' ') || '—';
}

interface QAItemProps {
  item: FlatRow;
  blockColor: string;
}

function QAItem({ item, blockColor }: QAItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasExpert = item.experte && item.experte.trim().length > 0;

  return (
    <div className="border-b border-border/60 last:border-0 py-5">
      <button
        className="w-full text-left group"
        onClick={() => hasExpert && setExpanded((p) => !p)}
      >
        <div className="flex items-start gap-3">
          {/* Q mark */}
          <span
            className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
            style={{ background: blockColor + '20', color: blockColor }}
          >
            Q
          </span>

          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-medium leading-snug',
              hasExpert ? 'text-foreground group-hover:text-violet-700 transition-colors' : 'text-foreground'
            )}>
              {item.question}
            </p>

            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{item.answer}</p>

            {/* Tags */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{ background: blockColor + '18', color: blockColor }}
              >
                Block {item.blockNo} · {item.blockTitle}
              </span>
            </div>
          </div>

          {/* Expand chevron */}
          {hasExpert && (
            <svg
              viewBox="0 0 16 16"
              className={cn(
                'mt-0.5 shrink-0 size-4 text-muted-foreground transition-transform duration-200',
                expanded && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          )}
        </div>
      </button>

      {/* Expanded expert view */}
      {expanded && hasExpert && (
        <div className="mt-4 ml-8 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
            Experten-Ansicht
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">{item.experte}</p>
          {item.praxis && item.praxis.trim() && (
            <div className="mt-3 border-t border-amber-200/60 pt-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                SAP-Praxis
              </p>
              <p className="text-xs font-mono text-foreground/70 leading-relaxed">{item.praxis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BLOCK_COLORS = [
  '#f59e0b',
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
];

export function QAView({ blocks }: Props) {
  const [search, setSearch] = useState('');
  const [activeBlock, setActiveBlock] = useState<number | null>(null);

  // Flatten all blocks into one list of FlatRow
  const flatRows: FlatRow[] = useMemo(() => {
    return blocks.flatMap((block) =>
      block.rows.map((row) => ({
        ...row,
        question: toQuestion(row.feld),
        answer: buildAnswer(row),
      }))
    );
  }, [blocks]);

  // Filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return flatRows.filter((row) => {
      if (activeBlock !== null && row.blockNo !== activeBlock) return false;
      if (!q) return true;
      return (
        row.question.toLowerCase().includes(q) ||
        row.answer.toLowerCase().includes(q) ||
        row.feld.toLowerCase().includes(q) ||
        (row.einsteiger?.toLowerCase().includes(q) ?? false) ||
        (row.experte?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [flatRows, search, activeBlock]);

  const blockColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    blocks.forEach((b, i) => {
      map[b.blockNo] = BLOCK_COLORS[i % BLOCK_COLORS.length];
    });
    return map;
  }, [blocks]);

  return (
    <div className="space-y-5">
      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Felder durchsuchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                <path d="M12 4 4 12M4 4l8 8" />
              </svg>
            </button>
          )}
        </div>

        {/* Block tags */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveBlock(null)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeBlock === null
                ? 'bg-violet-600 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            Alle
          </button>
          {blocks.map((block) => (
            <button
              key={block.blockNo}
              onClick={() => setActiveBlock(activeBlock === block.blockNo ? null : block.blockNo)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                activeBlock === block.blockNo
                  ? 'text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
              style={
                activeBlock === block.blockNo
                  ? { background: blockColorMap[block.blockNo] }
                  : undefined
              }
            >
              {block.blockTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} von {flatRows.length} Feldern
        {search && <> · Suche: &ldquo;{search}&rdquo;</>}
      </p>

      {/* Q&A list */}
      <div className="rounded-xl border border-border bg-card px-6">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <QAItem
              key={`${item.blockNo}-${item.rowOrder}`}
              item={item}
              blockColor={blockColorMap[item.blockNo]}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Keine Felder gefunden für &ldquo;{search}&rdquo;.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveBlock(null); }}
              className="mt-3 text-xs text-violet-600 hover:underline"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
