'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  rows: CountryBlockRow[];
}

// ─── Sectionizer: split rows into intro + named sections ─────────────────────

type Section = {
  number: string;       // "5.1", "5.2", ...
  title: string;        // "FatturaPA XML (...)"
  shortLabel: string;   // "FatturaPA"
  rows: CountryBlockRow[];
};

const SECTION_RE = /^►\s*(\d+\.\d+)\s*[—\-]\s*(.+)$/;

function isSectionHeader(feld: string): RegExpMatchArray | null {
  const first = feld.split('\n')[0].trim();
  return first.match(SECTION_RE);
}

function shortLabelOf(title: string): string {
  // Extract first 1-3 meaningful tokens
  const cleaned = title.replace(/\(.*?\)/g, '').trim();
  const parts = cleaned.split(/\s+/).slice(0, 3);
  return parts.join(' ').replace(/[—\-:].*$/, '').trim();
}

function sectionize(rows: CountryBlockRow[]): { intro: CountryBlockRow[]; sections: Section[] } {
  const intro: CountryBlockRow[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const r of rows) {
    const m = isSectionHeader(r.feld);
    if (m) {
      const title = m[2].trim();
      current = { number: m[1], title, shortLabel: shortLabelOf(title), rows: [] };
      sections.push(current);
    } else if (current) {
      current.rows.push(r);
    } else {
      intro.push(r);
    }
  }
  return { intro, sections };
}

// ─── Field row ────────────────────────────────────────────────────────────────

const TOKEN_RE = /\b(?:LFA1|LFB1|LFM1|LFBK|T001|T012|BSEG|REGUH|FBZP|OBY\d|OB\d{2,3}|SE\d{2,3}|SCAL|F110|FB\d{2}|MIRO|DRC|EBICS|H2H|SWIFT|SDI|FatturaPA|RIBA|SBF|CBI|pain\.\d{3}\.\d{3}\.\d{2}|pacs\.\d{3}\.\d{3}\.\d{2}|camt\.\d{3}\.\d{3}\.\d{2}|MT\d{3})\b/g;

function highlight(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > cursor) nodes.push(text.slice(cursor, m.index));
    nodes.push(
      <code
        key={m.index}
        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
      >
        {m[0]}
      </code>,
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function FieldCard({ row }: { row: CountryBlockRow }) {
  const [open, setOpen] = React.useState(false);
  const titleParts = row.feld.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = titleParts[0];
  const subtitle = titleParts.slice(1).join(' · ');
  const summary = (row.einsteiger ?? '').trim();
  const hasDetails = (row.experte && row.experte.trim()) || (row.praxis && row.praxis.trim()) || summary.length > 240;

  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <header className="mb-2">
        <div className="text-base font-semibold text-foreground">{title}</div>
        {subtitle && <div className="mt-0.5 text-sm text-muted-foreground">{subtitle}</div>}
      </header>
      {summary && (
        <p className="whitespace-pre-line text-base leading-relaxed text-foreground/85">
          {highlight(summary.length > 240 ? summary.slice(0, 240).replace(/\s\S*$/, '') + '…' : summary)}
        </p>
      )}
      {hasDetails && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-3 text-xs font-medium text-primary hover:underline"
        >
          {open ? 'Weniger anzeigen' : 'Details & SAP-Praxis'}
        </button>
      )}
      {open && (
        <div className="mt-3 space-y-3 border-t border-border/60 pt-3 text-base">
          {summary.length > 240 && (
            <Section label="Einsteiger" body={summary} />
          )}
          {row.experte && <Section label="Experte" body={row.experte} />}
          {row.praxis && (
            <section className="rounded-md border border-emerald-300/40 bg-emerald-50/40 p-3 dark:border-emerald-700/30 dark:bg-emerald-950/20">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                SAP-Praxis
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">{row.praxis}</pre>
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
      <p className="whitespace-pre-line leading-relaxed text-foreground/85">{highlight(body)}</p>
    </section>
  );
}

// ─── Beispiel-Dateien pro Format ──────────────────────────────────────────────

type Sample = { label: string; href: string; size: string };
const SAMPLES: Record<string, Sample[]> = {
  // Italien-Sektionen (Block 5)
  '5.1': [{ label: 'fatturapa-1.2.xml', href: '/samples/it/fatturapa-1.2.xml', size: '~2 KB · XML' }],
  '5.2': [{ label: 'cbi-bonifica.xml',  href: '/samples/it/cbi-bonifica.xml',  size: '~2 KB · XML' }],
  '5.3': [{ label: 'riba.txt',          href: '/samples/it/riba.txt',          size: '~1 KB · Flat-File' }],
  '5.4': [{ label: 'camt.053-it.xml',   href: '/samples/it/camt.053-it.xml',   size: '~3 KB · XML' }],
  // China-Sektionen (Block 6)
  '6.1': [{ label: 'cips-pacs.008-cn.xml', href: '/samples/cn/cips-pacs.008-cn.xml', size: '~3 KB · XML' }],
  '6.2': [{ label: 'cnaps-hvps.txt',       href: '/samples/cn/cnaps-hvps.txt',       size: '~1 KB · Flat-File' }],
  '6.3': [{ label: 'fapiao.xml',           href: '/samples/cn/fapiao.xml',           size: '~2 KB · XML' }],
  '6.4': [{ label: 'camt.053-cn.xml',      href: '/samples/cn/camt.053-cn.xml',      size: '~3 KB · XML' }],
};
const STD_SAMPLES: Sample[] = [
  { label: 'pain.001.001.03.xml', href: '/samples/formate/pain.001.001.03.xml', size: 'SEPA SCT · XML' },
];

function SampleList({ samples, label = 'Beispiel-Datei' }: { samples: Sample[]; label?: string }) {
  if (!samples.length) return null;
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <ul className="space-y-1.5">
        {samples.map((s) => (
          <li key={s.href} className="flex items-center justify-between gap-3 text-sm">
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono font-medium text-primary hover:underline"
            >
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
                <path d="M10 2v3h3" />
              </svg>
              {s.label}
            </a>
            <span className="text-xs text-muted-foreground">{s.size}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function FormateItPanel({ rows }: Props) {
  const { intro, sections } = sectionize(rows);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const activeSection = sections[activeIdx];

  // Intro: show the most relevant intro row (e.g. pain.001.001.03 row) as a callout
  const introRow = intro.find((r) => /pain\.001/.test(r.feld));

  return (
    <div className="space-y-5">
      {introRow && (
        <div className="space-y-3 rounded-lg border-l-4 border-primary/60 bg-primary/5 p-4">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Standardfall
            </div>
            <div className="text-base font-semibold text-foreground">{introRow.feld.split('\n')[0]}</div>
            {introRow.einsteiger && (
              <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground/85">
                {highlight(introRow.einsteiger)}
              </p>
            )}
          </div>
          <SampleList samples={STD_SAMPLES} />
        </div>
      )}

      {/* Sub-Tabs für die Format-Sektionen */}
      {sections.length > 0 && (
        <>
          <div className="flex flex-wrap gap-1.5 border-b border-border">
            {sections.map((s, i) => (
              <button
                key={s.number}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  'shrink-0 rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-px',
                  activeIdx === i
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="mr-1.5 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                  {s.number}
                </span>
                {s.shortLabel}
              </button>
            ))}
          </div>

          {activeSection && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{activeSection.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {activeSection.rows.length} Felder im Format
                </p>
              </div>
              <SampleList samples={SAMPLES[activeSection.number] ?? []} />
              <div className="grid items-stretch gap-3 md:grid-cols-2">
                {activeSection.rows.map((r, i) => (
                  <FieldCard key={i} row={r} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
