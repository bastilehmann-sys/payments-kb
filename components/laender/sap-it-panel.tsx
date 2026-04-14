'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  rows: CountryBlockRow[];
}

// ─── Group categorisation ─────────────────────────────────────────────────────

type Group = 'header' | 'stammdaten' | 'format' | 'connectivity' | 'config' | 'function';

function groupOf(feld: string): Group {
  const f = feld.toLowerCase();
  if (/^sap-bereich|^thema/i.test(feld)) return 'header';
  if (/codice fiscale|partita|fabrikkalender/.test(f)) return 'stammdaten';
  if (/zahlungsformat|format|dmee|pain\.001/.test(f)) return 'format';
  if (/bcm|kanal|ebics|swift|h2h/.test(f)) return 'connectivity';
  if (/bam|kontoauszug|camt/.test(f)) return 'function';
  if (/ihb|pobo|cobo|fattura|drc|sdd|lastschrift/.test(f)) return 'function';
  return 'config';
}

const GROUP_INFO: Record<Group, { label: string; description: string; cls: string }> = {
  header:       { label: 'Übersicht',       description: '',                                                       cls: 'bg-muted text-muted-foreground' },
  stammdaten:   { label: 'Stammdaten',      description: 'Pflichtfelder im Geschäftspartner & Buchungskreis',       cls: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200' },
  format:       { label: 'Format',          description: 'pain/camt-Variante & DMEE-Anpassungen',                  cls: 'bg-violet-100 text-violet-900 dark:bg-violet-950/40 dark:text-violet-200' },
  connectivity: { label: 'Connectivity',    description: 'BCM-Kanal, EBICS, SWIFT, H2H',                           cls: 'bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200' },
  function:     { label: 'Funktion / Add-on', description: 'Pflicht-Funktionen & SAP-Add-ons',                     cls: 'bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-200' },
  config:       { label: 'Customizing',     description: 'Konfiguration & Customizing-Pfade',                      cls: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200' },
};

// ─── Token extraction (TCODEs, Tabellen, BAdIs etc.) ──────────────────────────

const TCODE_RE = /\b(?:[A-Z]{1,4}\d{1,4}[A-Z]?|F\d{2,4}|FBZP|FBKP|OBY\d|OB\d{2,3}|SCAL|SE11|SE16N|SE38|SE80|SM30|SM37|SPRO|MIRO|MIR7|FB60|F-\d{2}|VL\d{2}|RFFO[A-Z_]+|FCHN|FCH5|FCH9|J1[A-Z]{2,5})\b/g;
const TABLE_RE = /\b(LFA1|LFB1|LFBK|LFM1|KNA1|KNB1|KNBK|KNVV|BSEG|BKPF|BSAK|BSIK|BSAD|BSID|REGUH|REGUT|T001|T001Z|T012|T012K|T042Y|T077A|T030|T030B|TAXBAS1|TAXIT|FEBKO|FEBEP|FEBRE|VBAK|VBAP|EKKO|EKPO)\b/g;
const BADI_RE = /\b(BAdI|User\s+Exit|Enhancement|MV45AFZ\w*|MM\d{2}AFZ\w*)\b/gi;

function extractTokens(text: string): { tcodes: string[]; tables: string[]; badis: string[] } {
  const tcodes = Array.from(new Set(text.match(TCODE_RE) ?? []));
  const tables = Array.from(new Set(text.match(TABLE_RE) ?? []));
  const badis = Array.from(new Set(text.match(BADI_RE) ?? [])).map((s) => s.replace(/\s+/g, ' '));
  return { tcodes, tables, badis };
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Chip({ kind, label }: { kind: 'tcode' | 'table' | 'badi'; label: string }) {
  const cls =
    kind === 'tcode'
      ? 'bg-emerald-100 text-emerald-900 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800/40'
      : kind === 'table'
        ? 'bg-violet-100 text-violet-900 ring-violet-300 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-800/40'
        : 'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800/40';
  return (
    <span className={cn('inline-flex rounded px-1.5 py-0.5 font-mono text-xs font-semibold ring-1', cls)}>
      {label}
    </span>
  );
}

function shorten(t: string, max = 280): string {
  const s = t.replace(/\s+/g, ' ').trim();
  return s.length <= max ? s : s.slice(0, max).replace(/\s\S*$/, '') + '…';
}

function Card({ row, group }: { row: CountryBlockRow; group: Group }) {
  const [open, setOpen] = React.useState(false);
  const titleParts = row.feld.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = titleParts[0] ?? row.feld;
  const subtitle = titleParts.slice(1).join(' · ');
  const info = GROUP_INFO[group];

  // Token-Extraction über Experte + Praxis
  const tokenSrc = `${row.experte ?? ''} ${row.praxis ?? ''}`;
  const { tcodes, tables, badis } = extractTokens(tokenSrc);

  const summary = (row.einsteiger ?? '').trim();

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <header className="mb-3 min-h-[3.5rem]">
        <div className="flex items-center gap-2">
          <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', info.cls)}>
            {info.label}
          </span>
        </div>
        <h3 className="mt-1.5 text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle || '\u00A0'}</p>
      </header>

      {(tcodes.length > 0 || tables.length > 0 || badis.length > 0) && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {tcodes.slice(0, 5).map((t) => <Chip key={t} kind="tcode" label={t} />)}
          {tables.slice(0, 5).map((t) => <Chip key={t} kind="table" label={t} />)}
          {badis.slice(0, 3).map((t) => <Chip key={t} kind="badi" label={t} />)}
        </div>
      )}

      {summary && (
        <p className="flex-1 whitespace-pre-line text-base leading-relaxed text-foreground/85">
          {shorten(summary, 280)}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {open ? 'Weniger anzeigen' : 'Konkrete Schritte & TCODEs'}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-border/60 pt-4 text-base">
          {row.einsteiger && row.einsteiger.length > 280 && (
            <Section label="Einsteiger" body={row.einsteiger} />
          )}
          {row.experte && <Section label="Experte" body={row.experte} />}
          {row.praxis && (
            <section className="rounded-lg border border-emerald-300/40 bg-emerald-50/40 p-3 dark:border-emerald-700/30 dark:bg-emerald-950/20">
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
      <p className="whitespace-pre-line leading-relaxed text-foreground/85">{body}</p>
    </section>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

const ORDERED: Group[] = ['stammdaten', 'format', 'connectivity', 'function', 'config'];

export function SapItPanel({ rows }: Props) {
  const [filter, setFilter] = React.useState<Group | 'ALL'>('ALL');
  const usable = rows.filter((r) => groupOf(r.feld) !== 'header');
  const visibleGroups = ORDERED.filter((g) => usable.some((r) => groupOf(r.feld) === g));
  const filtered = filter === 'ALL' ? usable : usable.filter((r) => groupOf(r.feld) === filter);

  return (
    <div className="space-y-5">
      {/* Filter */}
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
          Alle ({usable.length})
        </button>
        {visibleGroups.map((g) => {
          const count = usable.filter((r) => groupOf(r.feld) === g).length;
          const info = GROUP_INFO[g];
          const active = filter === g;
          return (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors',
                active ? cn(info.cls, 'ring-current') : 'bg-background text-muted-foreground ring-border hover:text-foreground',
              )}
            >
              {info.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid items-stretch gap-4 md:grid-cols-2">
        {filtered.map((r, i) => (
          <Card key={i} row={r} group={groupOf(r.feld)} />
        ))}
      </div>
    </div>
  );
}
