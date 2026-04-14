'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Entry = Record<string, string | null>;

interface Props {
  entry: Entry;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOKEN_RE = /\b(?:LFA1|LFB1|T001|T042Y|BSEG|BKPF|REGUH|FBZP|FBKP|OBY\d|OB\d{2,3}|SE\d{2,3}|SCAL|F110|FB\d{2}|MIRO|FI-BL|TRM-TM|TRM-CM|TRM-SE|BC-SEC|BCM|FSCM|DRC|EBICS|SWIFT|SCA|POBO|COBO|IBAN|pain\.\d{3}\.\d{3}\.\d{2}|pacs\.\d{3}\.\d{3}\.\d{2}|camt\.\d{3}\.\d{3}\.\d{2}|MT\d{3}|BAdI)\b/g;

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

/** Inline Markdown: **bold** + Auto-Highlight von Tokens. */
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

/** Render bullet-list ("- …") oder Fließtext mit Absätzen. */
function Markdown({ text }: { text: string | null }) {
  if (!text?.trim()) return null;
  const lines = text.split('\n').map((l) => l.trim());
  const bulletLines = lines.filter((l) => /^[-•]\s+/.test(l));
  if (bulletLines.length >= 2 && bulletLines.length / lines.filter(Boolean).length > 0.5) {
    // Als Liste rendern
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
  // Absätze
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

const AUFWAND_CLASS: Record<string, string> = {
  S: 'bg-emerald-100 text-emerald-900 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200',
  M: 'bg-sky-100 text-sky-900 ring-sky-300 dark:bg-sky-950/40 dark:text-sky-200',
  L: 'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200',
  XL: 'bg-rose-100 text-rose-900 ring-rose-300 dark:bg-rose-950/40 dark:text-rose-200',
};

function Badge({ label, value, cls }: { label: string; value: string | null | undefined; cls?: string }) {
  if (!value) return null;
  return (
    <div className={cn('rounded-lg border border-border/60 bg-background p-3 ring-1 ring-transparent', cls)}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}


// ─── Section block ────────────────────────────────────────────────────────────

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

// ─── Querverweise als klickbare Pills ─────────────────────────────────────────

function VerwandteRegulierungen({ raw }: { raw: string | null }) {
  if (!raw) return null;
  const items = raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-base font-semibold text-foreground">Querverweise</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((k) => (
          <a
            key={k}
            href={`/regulatorik?id=${encodeURIComponent(k)}`}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10"
          >
            {k}
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── SAP-Bezug Panel mit Token-Chips ──────────────────────────────────────────

const SAP_CHIP_RE = /\b(?:FI-[A-Z]{2,3}|TRM-[A-Z]{2,3}|BC-[A-Z]{2,3}|FSCM-[A-Z]{2,4}|BCM|DRC|DMEE|DMEEX|EBICS|H2H|SWIFT|SAP\s+GTS|GTS|OT\d{2,3}|FBZP|OB\d{2,3}|SE\d{2,3}|F110|FBKP|IHC|MDG)\b/g;

function SapBezugPanel({ text }: { text: string | null }) {
  if (!text?.trim()) return null;
  const chips = Array.from(new Set(text.match(SAP_CHIP_RE) ?? []));
  return (
    <section className="rounded-xl border-2 border-sky-500/40 bg-gradient-to-br from-sky-50 to-sky-100/40 p-5 shadow-sm dark:border-sky-700/40 dark:from-sky-950/30 dark:to-sky-950/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="12" height="10" rx="1" />
            <path d="M2 7h12M6 13V7M10 13V7" />
          </svg>
          SAP-Auswirkung
        </span>
        <h3 className="text-base font-semibold text-sky-900 dark:text-sky-100">Was bedeutet das für dein SAP-System?</h3>
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
      <p className="whitespace-pre-line text-base leading-relaxed text-foreground/85">{highlight(text)}</p>
    </section>
  );
}

// ─── Compliance-Folgen Panel ──────────────────────────────────────────────────

function CompliancePanel({ bussgeld, pruefpflicht }: { bussgeld: string | null; pruefpflicht: string | null }) {
  if (!bussgeld && !pruefpflicht) return null;
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {bussgeld && (
        <div className="rounded-xl border border-rose-300/40 bg-rose-50/40 p-5 dark:border-rose-700/30 dark:bg-rose-950/20">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-900 dark:text-rose-200">
            Bußgeld / Sanktion
          </div>
          <div className="whitespace-pre-line text-base font-medium leading-relaxed text-foreground/90">{bussgeld}</div>
        </div>
      )}
      {pruefpflicht && (
        <div className="rounded-xl border border-violet-300/40 bg-violet-50/40 p-5 dark:border-violet-700/30 dark:bg-violet-950/20">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-violet-900 dark:text-violet-200">
            Prüfpflicht / Audit
          </div>
          <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90">{pruefpflicht}</div>
        </div>
      )}
    </section>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function RegulatorikDetailPanel({ entry }: Props) {
  const [tab, setTab] = React.useState<'was' | 'todo' | 'risk'>('was');
  const aufwand = (entry.aufwand_tshirt ?? '').trim().toUpperCase();

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

      {/* Key Facts Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Badge label="Typ" value={entry.typ} />
        <Badge label="Geltung" value={entry.geltungsbereich?.split(/[,;]/)[0]?.trim() ?? entry.geltungsbereich} />
        <Badge label="In Kraft" value={entry.in_kraft_seit} />
        <Badge
          label="Aufwand"
          value={aufwand || null}
          cls={AUFWAND_CLASS[aufwand] ?? ''}
        />
        <Badge label="Nächste Änderung" value={entry.naechste_aenderung} />
      </div>

      {/* SAP-Bezug — permanent sichtbar */}
      <SapBezugPanel text={entry.sap_bezug} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {[
          { id: 'was', label: 'Was regelt das?' },
          { id: 'todo', label: 'Was ist zu tun?' },
          { id: 'risk', label: 'Risiken & Folgen' },
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
          <VerwandteRegulierungen raw={entry.verwandte_regulierungen} />
          {entry.behoerde_link && (
            <div className="rounded-lg border-l-4 border-primary/50 bg-primary/5 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Zuständige Behörde / Quelle
              </div>
              <a
                href={entry.behoerde_link}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary underline hover:no-underline"
              >
                {entry.behoerde_link}
              </a>
            </div>
          )}
        </div>
      )}

      {tab === 'todo' && (
        <div className="space-y-4">
          <ContentSection
            title="Pflichtmaßnahmen"
            einsteiger={entry.pflichtmassnahmen_einsteiger}
            experte={entry.pflichtmassnahmen_experte}
          />
          <ContentSection
            title="Best Practice"
            einsteiger={entry.best_practice_einsteiger}
            experte={entry.best_practice_experte}
          />
        </div>
      )}

      {tab === 'risk' && (
        <div className="space-y-4">
          <ContentSection
            title="Risiken"
            einsteiger={entry.risiken_einsteiger}
            experte={entry.risiken_experte}
          />
          <ContentSection
            title="Auswirkungen aufs Unternehmen"
            einsteiger={entry.auswirkungen_einsteiger}
            experte={entry.auswirkungen_experte}
          />
          <CompliancePanel bussgeld={entry.bussgeld} pruefpflicht={entry.pruefpflicht} />
        </div>
      )}
    </div>
  );
}
