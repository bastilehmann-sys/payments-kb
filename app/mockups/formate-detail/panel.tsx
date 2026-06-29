'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Entry = Record<string, string | null>;

interface Props {
  entry: Entry;
}

// ─── Token-Highlight ──────────────────────────────────────────────────────────

const TOKEN_RE = /\b(?:LFA1|LFB1|T001|T042Y|BSEG|BKPF|REGUH|FBZP|FBKP|OBY\d|OB\d{2,3}|SE\d{2,3}|SCAL|F110|FB\d{2}|MIRO|FI-BL|TRM-TM|TRM-CM|BC-SEC|BCM|FSCM|DRC|DMEE|DMEEX|EBICS|H2H|SWIFT|SCA|IBAN|BIC|pain\.\d{3}\.\d{3}\.\d{2}|pacs\.\d{3}\.\d{3}\.\d{2}|camt\.\d{3}\.\d{3}\.\d{2}|MT\d{3}|BAdI|InitgPty|Dbtr|Cdtr|GrpHdr|PmtInf|CdtTrfTxInf|EndToEndId|InstrId|UETR)\b/g;

function highlight(text: string | null): React.ReactNode[] {
  if (!text) return [];
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > cursor) nodes.push(text.slice(cursor, m.index));
    nodes.push(
      <code key={m.index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">
        {m[0]}
      </code>,
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function inlineMd(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) parts.push(...highlight(text.slice(cursor, m.index)));
    parts.push(<strong key={m.index} className="font-semibold text-foreground">{highlight(m[1])}</strong>);
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(...highlight(text.slice(cursor)));
  return parts;
}

function Markdown({ text }: { text: string | null }) {
  if (!text?.trim()) return null;
  const lines = text.split('\n').map((l) => l.trim());
  const bullets = lines.filter((l) => /^[-•]\s+/.test(l));
  if (bullets.length >= 2 && bullets.length / lines.filter(Boolean).length > 0.5) {
    const items = lines.filter((l) => /^[-•]\s+/.test(l)).map((l) => l.replace(/^[-•]\s+/, ''));
    return (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/60">
        {items.map((it, i) => (
          <li key={i} className="text-base leading-relaxed text-foreground/90">
            {inlineMd(it)}
          </li>
        ))}
      </ul>
    );
  }
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line text-base leading-relaxed text-foreground/85">
          {inlineMd(p)}
        </p>
      ))}
    </>
  );
}

// ─── Status / Family chips ────────────────────────────────────────────────────

const STATUS_CLASS: Record<string, string> = {
  current:    'bg-emerald-100 text-emerald-900 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200',
  aktiv:      'bg-emerald-100 text-emerald-900 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200',
  veraltet:   'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200',
  abgekündigt:'bg-rose-100 text-rose-900 ring-rose-300 dark:bg-rose-950/40 dark:text-rose-200',
  zukünftig:  'bg-sky-100 text-sky-900 ring-sky-300 dark:bg-sky-950/40 dark:text-sky-200',
};

function Badge({ label, value, cls }: { label: string; value: string | null | undefined; cls?: string }) {
  if (!value) return null;
  return (
    <div className={cn('rounded-lg border border-border/60 bg-background p-3', cls)}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

// ─── Content section (Einsteiger + Experte sichtbar) ──────────────────────────

function ContentSection({
  title,
  einsteiger,
  experte,
}: {
  title: string;
  einsteiger: string | null;
  experte: string | null;
}) {
  if (!einsteiger?.trim() && !experte?.trim()) return null;
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-base font-semibold text-foreground">{title}</h3>
      {einsteiger?.trim() && (
        <div className="space-y-3">
          <Markdown text={einsteiger} />
        </div>
      )}
      {experte?.trim() && (
        <div className="mt-4 rounded-lg border-l-2 border-amber-400/60 bg-amber-50/30 px-4 py-3 dark:bg-amber-950/15">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Fachliche Details
          </div>
          <div className="space-y-3">
            <Markdown text={experte} />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── SAP-Mapping permanent sichtbar (analog zu Regulatorik SAP-Bezug) ────────

const SAP_CHIP_RE = /\b(?:FI-[A-Z]{2,3}|TRM-[A-Z]{2,3}|BC-[A-Z]{2,3}|FSCM-[A-Z]{2,4}|BCM|DRC|DMEE|DMEEX|EBICS|H2H|SWIFT|MBC|FBZP|OB\d{2,3}|OT\d{2,3}|SE\d{2,3}|F110|FBKP|MIRO|VF\d{2}|XK\d{2}|XD\d{2}|LFA\d|LFB\d|T001|BSEG|BKPF|REGUH|REGUT)\b/g;

function SapMappingPanel({ einsteiger, experte }: { einsteiger: string | null; experte: string | null }) {
  if (!einsteiger?.trim() && !experte?.trim()) return null;
  const tokenSrc = `${einsteiger ?? ''} ${experte ?? ''}`;
  const chips = Array.from(new Set(tokenSrc.match(SAP_CHIP_RE) ?? []));
  return (
    <section className="rounded-xl border-2 border-sky-500/40 bg-gradient-to-br from-sky-50 to-sky-100/40 p-5 shadow-sm dark:border-sky-700/40 dark:from-sky-950/30 dark:to-sky-950/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="12" height="10" rx="1" />
            <path d="M2 7h12M6 13V7M10 13V7" />
          </svg>
          SAP-Mapping
        </span>
        <h3 className="text-base font-semibold text-sky-900 dark:text-sky-100">Wo wird das Format in SAP gepflegt?</h3>
      </div>
      {chips.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {chips.slice(0, 12).map((c) => (
            <span key={c} className="rounded bg-white px-2 py-0.5 font-mono text-xs font-semibold text-sky-900 ring-1 ring-sky-300 shadow-sm dark:bg-sky-900/60 dark:text-sky-100 dark:ring-sky-700/60">
              {c}
            </span>
          ))}
        </div>
      )}
      {einsteiger?.trim() && (
        <div className="space-y-3">
          <Markdown text={einsteiger} />
        </div>
      )}
      {experte?.trim() && (
        <div className="mt-4 rounded-lg border-l-2 border-amber-400/60 bg-amber-50/40 px-4 py-3 dark:bg-amber-950/15">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Fachliche Details
          </div>
          <div className="space-y-3">
            <Markdown text={experte} />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Sample file panel ────────────────────────────────────────────────────────

function SampleFile({ entry }: { entry: Entry }) {
  const file = entry.version_sample_file;
  if (!file) return null;
  const href = `/samples/formate/${file}`;
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Beispiel-Datei
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-mono font-medium text-primary hover:underline"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
          <path d="M10 2v3h3" />
        </svg>
        {file}
      </a>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function FormateDetailPanel({ entry }: Props) {
  const [tab, setTab] = React.useState<'was' | 'aufbau' | 'fehler'>('was');
  const status = (entry.status ?? '').toLowerCase().trim();
  const statusCls = STATUS_CLASS[status] ?? '';

  return (
    <div className="space-y-5">
      {/* Management Summary */}
      {entry.beschreibung_einsteiger && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Management Summary
          </div>
          <div className="text-lg">
            <Markdown text={entry.beschreibung_einsteiger} />
          </div>
        </div>
      )}

      {/* Key Facts */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Badge label="Nachrichtentyp" value={entry.nachrichtentyp} />
        <Badge label="Familie" value={entry.familie_standard} />
        <Badge label="Datenrichtung" value={entry.datenrichtung} />
        <Badge label="SAP-Relevanz" value={entry.sap_relevanz} />
        <Badge label="Status" value={entry.status} cls={statusCls} />
      </div>

      {/* SAP-Mapping permanent sichtbar */}
      <SapMappingPanel
        einsteiger={entry.sap_mapping_einsteiger}
        experte={entry.sap_mapping_experte}
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {[
          { id: 'was',    label: 'Was ist das?' },
          { id: 'aufbau', label: 'Aufbau & Felder' },
          { id: 'fehler', label: 'Fehler & Risiken' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={cn(
              'shrink-0 rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition-colors -mb-px',
              tab === t.id
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'was' && (
        <div className="space-y-4">
          <ContentSection
            title="Beschreibung"
            einsteiger={entry.beschreibung_einsteiger}
            experte={entry.beschreibung_experte}
          />
          {entry.versionshistorie && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-base font-semibold text-foreground">Versionshistorie</h3>
              <Markdown text={entry.versionshistorie} />
            </section>
          )}
          <SampleFile entry={entry} />
        </div>
      )}

      {tab === 'aufbau' && (
        <div className="space-y-4">
          {entry.wichtige_felder && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-base font-semibold text-foreground">Wichtige Felder</h3>
              <Markdown text={entry.wichtige_felder} />
            </section>
          )}
          {entry.pflichtfelder && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-base font-semibold text-foreground">Pflichtfelder</h3>
              <Markdown text={entry.pflichtfelder} />
            </section>
          )}
        </div>
      )}

      {tab === 'fehler' && (
        <div className="space-y-4">
          <ContentSection
            title="Fehlerquellen"
            einsteiger={entry.fehlerquellen_einsteiger}
            experte={entry.fehlerquellen_experte}
          />
          <ContentSection
            title="Projektfehler"
            einsteiger={entry.projektfehler_einsteiger}
            experte={entry.projektfehler_experte}
          />
        </div>
      )}
    </div>
  );
}
