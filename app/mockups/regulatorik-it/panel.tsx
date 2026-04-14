'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  rows: CountryBlockRow[];
}

// ─── Source linkifier (Italian + EU) ──────────────────────────────────────────

const SOURCE_LINKS: { pattern: RegExp; url: (m: string) => string }[] = [
  {
    pattern: /D\.?P\.?R\.?\s*(\d+)\/(\d{4})/gi,
    url: (m) => {
      const [, n, y] = m.match(/(\d+)\/(\d{4})/)!;
      return `https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:${y};${n}`;
    },
  },
  {
    pattern: /D\.?Lgs\.?\s*(\d+)\/(\d{4})/gi,
    url: (m) => {
      const [, n, y] = m.match(/(\d+)\/(\d{4})/)!;
      return `https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:${y};${n}`;
    },
  },
  {
    pattern: /Legge(?:\s+(?:di\s+)?[\wäöüÄÖÜ]+)?\s+\d{4}/gi,
    url: (m) => `https://www.normattiva.it/ricerca/fullText?query=${encodeURIComponent(m)}`,
  },
  {
    pattern: /\bEU\s+(\d{4})\/(\d+)/gi,
    url: (m) => {
      const [, y, n] = m.match(/(\d{4})\/(\d+)/)!;
      return `https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:3${y}R${n.padStart(4, '0')}`;
    },
  },
  {
    pattern: /\bEU\s+(\d+)\/(\d{4})/gi,
    url: (m) => {
      const [, n, y] = m.match(/(\d+)\/(\d{4})/)!;
      return `https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:3${y}R${n.padStart(4, '0')}`;
    },
  },
  { pattern: /Agenzia\s+delle\s+Entrate/gi, url: () => 'https://www.agenziaentrate.gov.it' },
  { pattern: /Banca\s+d['’]Italia/gi, url: () => 'https://www.bancaditalia.it' },
  { pattern: /\bDORA\b/g, url: () => 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022R2554' },
  { pattern: /\bNIS2\b/g, url: () => 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2555' },
  { pattern: /\bSDI\b/g, url: () => 'https://www.fatturapa.gov.it/' },
];

function linkify(text: string): React.ReactNode[] {
  const matches: { start: number; end: number; match: string; url: string }[] = [];
  for (const { pattern, url } of SOURCE_LINKS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, match: m[0], url: url(m[0]) });
    }
  }
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const chosen: typeof matches = [];
  let lastEnd = -1;
  for (const mm of matches) {
    if (mm.start >= lastEnd) {
      chosen.push(mm);
      lastEnd = mm.end;
    }
  }
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  for (const mm of chosen) {
    if (mm.start > cursor) nodes.push(text.slice(cursor, mm.start));
    nodes.push(
      <a
        key={mm.start}
        href={mm.url}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {mm.match}
      </a>,
    );
    cursor = mm.end;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

// ─── Categorization ───────────────────────────────────────────────────────────

type Category = 'AML' | 'eInvoice' | 'Banking' | 'Tax' | 'Resilience' | 'Generell';

const CATEGORY_RULES: { match: RegExp; cat: Category }[] = [
  { match: /aml|geldwäsche|antiriciclag|231\/2007/i, cat: 'AML' },
  { match: /fattur|e-invoice|sdi|elettronic/i, cat: 'eInvoice' },
  { match: /sepa|instant|sct|sdd|psp|bank/i, cat: 'Banking' },
  { match: /codice fiscale|partita iva|steuer|tax|iva/i, cat: 'Tax' },
  { match: /dora|nis2|resilien|cyber|ikt|risiko/i, cat: 'Resilience' },
];

function categorize(feld: string): Category {
  for (const r of CATEGORY_RULES) if (r.match.test(feld)) return r.cat;
  return 'Generell';
}

const CATEGORY_STYLE: Record<Category, { label: string; cls: string; accent: string }> = {
  AML:        { label: 'AML',         cls: 'bg-rose-100 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200',         accent: 'border-l-rose-400' },
  eInvoice:   { label: 'e-Invoice',   cls: 'bg-violet-100 text-violet-900 dark:bg-violet-950/30 dark:text-violet-200', accent: 'border-l-violet-400' },
  Banking:    { label: 'Banking',     cls: 'bg-sky-100 text-sky-900 dark:bg-sky-950/30 dark:text-sky-200',             accent: 'border-l-sky-400' },
  Tax:        { label: 'Steuer',      cls: 'bg-amber-100 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200',     accent: 'border-l-amber-400' },
  Resilience: { label: 'IT-Resilienz',cls: 'bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950/30 dark:text-fuchsia-200', accent: 'border-l-fuchsia-400' },
  Generell:   { label: 'Generell',    cls: 'bg-muted text-foreground/70',                                              accent: 'border-l-muted-foreground/40' },
};

// ─── Status detection ─────────────────────────────────────────────────────────

type Status = 'pflicht' | 'kommt' | 'optional' | null;

function detectStatus(text: string): { status: Status; label: string } {
  if (/ab\s+(?:oktober|november|dezember|januar|februar|märz|april|mai|juni|juli|august|september|jan|feb|mär|apr|mai|jun|jul|aug|sep|okt|nov|dez)\.?\s*\d{4}/i.test(text) ||
      /(?:wird|kommt|geplant|inkrafttret|verabschiedet|2026|2027)\b/i.test(text)) {
    return { status: 'kommt', label: 'Demnächst' };
  }
  if (/pflicht|verpflichten|muss|zwingend|verpflichtend|gilt seit|in kraft seit|gilt für|gilt direkt/i.test(text)) {
    return { status: 'pflicht', label: 'Pflicht' };
  }
  if (/optional|empfohlen|kann/i.test(text)) {
    return { status: 'optional', label: 'Optional' };
  }
  return { status: null, label: '' };
}

const STATUS_STYLE: Record<Exclude<Status, null>, string> = {
  pflicht: 'bg-rose-100 text-rose-900 ring-rose-300 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-800/40',
  kommt: 'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800/40',
  optional: 'bg-emerald-100 text-emerald-900 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800/40',
};

// ─── Quick facts extractor (best-effort) ──────────────────────────────────────

function extractQuickFacts(text: string): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const grenze = text.match(/(?:max\.?|maximal|obergrenze|limit|schwellenwert)[^.\n]*?((?:EUR|€)\s*[\d.,]+)/i);
  if (grenze) out.push({ label: 'Schwellenwert', value: grenze[1].trim() });
  const stand = text.match(/(?:gilt seit|in kraft seit|seit)\s+([\w.\d ]+\d{4})/i);
  if (stand) out.push({ label: 'Stand', value: stand[1].trim() });
  const frist = text.match(/ab\s+([\w.]+\s*\d{4})/i);
  if (frist) out.push({ label: 'Frist', value: frist[1].trim() });
  return out.slice(0, 3);
}

function shorten(text: string, maxChars = 220): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).replace(/\s\S*$/, '') + '…';
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function RegulationCard({ row }: { row: CountryBlockRow }) {
  const [open, setOpen] = React.useState(false);
  const cat = categorize(row.feld);
  const style = CATEGORY_STYLE[cat];
  const titleParts = row.feld.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = titleParts[0] ?? row.feld;
  const subtitle = titleParts.slice(1).join(' · ');
  const statusBase = `${row.einsteiger ?? ''} ${row.experte ?? ''}`;
  const status = detectStatus(statusBase);
  const quickFacts = extractQuickFacts(statusBase);
  const summary = row.einsteiger ? shorten(row.einsteiger, 240) : '';

  return (
    <article className={cn('rounded-xl border bg-card border-l-4 shadow-sm', style.accent)}>
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', style.cls)}>
              {style.label}
            </span>
            {status.status && (
              <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1', STATUS_STYLE[status.status])}>
                {status.label}
              </span>
            )}
          </div>
          {subtitle && (
            <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </header>

      {quickFacts.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 px-5 text-xs">
          {quickFacts.map((f, i) => (
            <div key={i}>
              <span className="text-muted-foreground">{f.label}:</span>{' '}
              <span className="font-medium text-foreground">{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {summary && (
        <p className="mt-3 px-5 text-sm leading-relaxed text-foreground/85">{linkify(summary)}</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 px-5 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {open ? 'Weniger anzeigen' : 'Details & SAP-Praxis'}
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-border/60 bg-muted/20 px-5 py-4 text-sm">
          {row.einsteiger && row.einsteiger.length > 240 && (
            <section>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Einsteiger
              </div>
              <p className="whitespace-pre-line leading-relaxed text-foreground/85">{linkify(row.einsteiger)}</p>
            </section>
          )}
          {row.experte && (
            <section>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Experte
              </div>
              <p className="whitespace-pre-line leading-relaxed text-foreground/85">{linkify(row.experte)}</p>
            </section>
          )}
          {row.praxis && (
            <section className="rounded-lg border border-sky-300/40 bg-sky-50/40 p-3 dark:border-sky-700/30 dark:bg-sky-950/20">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-sky-900 dark:text-sky-200">
                SAP-Praxis
              </div>
              <p className="whitespace-pre-line leading-relaxed text-foreground/90">{linkify(row.praxis)}</p>
            </section>
          )}
        </div>
      )}
    </article>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function RegulatorikItPanel({ rows }: Props) {
  const [filter, setFilter] = React.useState<Category | 'ALL'>('ALL');

  const filtered = filter === 'ALL' ? rows : rows.filter((r) => categorize(r.feld) === filter);

  const cats = Array.from(new Set(rows.map((r) => categorize(r.feld))));

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors',
            filter === 'ALL'
              ? 'bg-foreground text-background ring-foreground'
              : 'bg-background text-muted-foreground ring-border hover:text-foreground',
          )}
        >
          Alle ({rows.length})
        </button>
        {cats.map((c) => {
          const count = rows.filter((r) => categorize(r.feld) === c).length;
          const active = filter === c;
          const s = CATEGORY_STYLE[c];
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors',
                active ? cn(s.cls, 'ring-current') : 'bg-background text-muted-foreground ring-border hover:text-foreground',
              )}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((row, i) => (
          <RegulationCard key={`${row.feld}-${i}`} row={row} />
        ))}
      </div>
    </div>
  );
}
