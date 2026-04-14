'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  rows: CountryBlockRow[];
}

// ─── Categorization ───────────────────────────────────────────────────────────

type Group = 'clearing' | 'standard' | 'banks';

function groupOf(feld: string): Group {
  const f = feld.toLowerCase();
  if (/step2|tips|target|t2|fps|chips|fedwire/.test(f)) return 'clearing';
  if (/bank|hausbank|intesa|unicredit|empfehlung/.test(f)) return 'banks';
  return 'standard';
}

const GROUPS: { id: Group; label: string; description: string }[] = [
  { id: 'clearing', label: 'Clearing-Systeme', description: 'Wege, auf denen Geld nach Italien fließt' },
  { id: 'standard', label: 'Standards & lokale Instrumente', description: 'Was IT-spezifisch gilt — und was du davon brauchst' },
  { id: 'banks', label: 'Hauptbanken Italien', description: 'Banken-Empfehlungen + technische Anbindung' },
];

// ─── Quick-Facts pro Clearing-Eintrag ─────────────────────────────────────────

function attrFor(feld: string): {
  speedLabel: string;
  speedTone: 'fast' | 'slow' | 'mid';
  scope: string;
  forWhat: string;
} {
  const f = feld.toLowerCase();
  if (/tips/.test(f)) return { speedLabel: '< 10 Sek', speedTone: 'fast', scope: 'EUR · 24/7', forWhat: 'Instant Payments' };
  if (/step2/.test(f)) return { speedLabel: '1 Tag', speedTone: 'mid', scope: 'EUR · SEPA', forWhat: 'Standard-Lieferantenzahlung' };
  if (/target|t2/.test(f)) return { speedLabel: 'Real-time', speedTone: 'fast', scope: 'EUR · Großbeträge', forWhat: 'Eilige & große Zahlungen' };
  return { speedLabel: '—', speedTone: 'mid', scope: '—', forWhat: '—' };
}

const SPEED_STYLE: Record<string, string> = {
  fast: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
  mid: 'bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200',
  slow: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
};

// ─── Linkifier (kompakt) ──────────────────────────────────────────────────────

const LINKS: { pattern: RegExp; url: (m: string) => string }[] = [
  { pattern: /Banca\s+d['’]Italia/gi, url: () => 'https://www.bancaditalia.it' },
  { pattern: /Intesa\s+Sanpaolo/gi, url: () => 'https://www.intesasanpaolo.com' },
  { pattern: /UniCredit/gi, url: () => 'https://www.unicreditgroup.eu' },
  { pattern: /BancoBPM|Banco\s+BPM/gi, url: () => 'https://gruppo.bancobpm.it' },
  { pattern: /CBI\b/g, url: () => 'https://www.cbi-org.eu' },
  { pattern: /STEP2/g, url: () => 'https://www.ebaclearing.eu/services/step2-sct/overview/' },
  { pattern: /TIPS/g, url: () => 'https://www.ecb.europa.eu/paym/target/tips/html/index.en.html' },
  { pattern: /TARGET2|T2\b/g, url: () => 'https://www.ecb.europa.eu/paym/target/t2/html/index.en.html' },
];

function linkify(text: string): React.ReactNode[] {
  const matches: { start: number; end: number; match: string; url: string }[] = [];
  for (const { pattern, url } of LINKS) {
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

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ row, group }: { row: CountryBlockRow; group: Group }) {
  const [open, setOpen] = React.useState(false);
  const titleParts = row.feld.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = titleParts[0] ?? row.feld;
  const subtitle = titleParts.slice(1).join(' · ');
  const summary = (row.einsteiger ?? '').trim();

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <header className="mb-3 min-h-[3.25rem]">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle || '\u00A0'}</p>
      </header>

      {group === 'clearing' && (
        <ClearingFacts feld={row.feld} />
      )}

      {summary && (
        <p className="mt-3 flex-1 whitespace-pre-line text-base leading-relaxed text-foreground/85">
          {linkify(shorten(summary, 320))}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {open ? 'Weniger anzeigen' : 'Details & SAP-Praxis'}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-4 border-t border-border/60 pt-4 text-base">
          {row.einsteiger && row.einsteiger.length > 320 && (
            <Section label="Einsteiger" body={row.einsteiger} />
          )}
          {row.experte && <Section label="Experte" body={row.experte} />}
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

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <p className="whitespace-pre-line leading-relaxed text-foreground/85">{linkify(body)}</p>
    </section>
  );
}

function ClearingFacts({ feld }: { feld: string }) {
  const a = attrFor(feld);
  return (
    <dl className="space-y-1.5 rounded-md border border-border/60 bg-background p-3">
      <FactRow label="Tempo" value={a.speedLabel} cls={SPEED_STYLE[a.speedTone]} />
      <FactRow label="Scope" value={a.scope} />
      <FactRow label="Wofür" value={a.forWhat} />
    </dl>
  );
}

function FactRow({ label, value, cls }: { label: string; value: string; cls?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className={cn('min-w-0 break-words text-right text-sm font-medium', cls && `inline-flex rounded px-2 py-0.5 ${cls}`)}>
        {value}
      </dd>
    </div>
  );
}

function shorten(text: string, max = 320): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max).replace(/\s\S*$/, '') + '…';
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function ClearingItPanel({ rows }: Props) {
  const grouped = GROUPS.map((g) => ({ ...g, rows: rows.filter((r) => groupOf(r.feld) === g.id) }));

  return (
    <div className="space-y-8">
      {grouped.map((g) => (
        g.rows.length > 0 && (
          <section key={g.id} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">{g.label}</h2>
              <p className="text-sm text-muted-foreground">{g.description}</p>
            </div>
            <div className={cn('grid items-stretch gap-4', g.id === 'clearing' ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
              {g.rows.map((r, i) => (
                <Card key={i} row={r} group={g.id} />
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  );
}
