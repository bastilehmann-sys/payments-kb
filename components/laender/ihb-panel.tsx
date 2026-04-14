'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Known source URLs — extendable. Keys sind Lowercase-Fragmente; erste treffende wins.
const SOURCE_LINKS: { pattern: RegExp; url: (match: string) => string; label?: (match: string) => string }[] = [
  // D.P.R. 633/1972  →  normattiva
  {
    pattern: /D\.?P\.?R\.?\s*(\d+)\/(\d{4})/gi,
    url: (m) => {
      const [, n, y] = m.match(/(\d+)\/(\d{4})/)!;
      return `https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:${y};${n}`;
    },
  },
  // D.Lgs. 127/2015  →  normattiva
  {
    pattern: /D\.?Lgs\.?\s*(\d+)\/(\d{4})/gi,
    url: (m) => {
      const [, n, y] = m.match(/(\d+)\/(\d{4})/)!;
      return `https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:${y};${n}`;
    },
  },
  // Legge <name> 2018 / Legge 205/2017 etc. → Normattiva search
  {
    pattern: /Legge(?:\s+(?:di\s+)?[\wäöüÄÖÜ]+)?\s+\d{4}/gi,
    url: (m) => `https://www.normattiva.it/ricerca/fullText?query=${encodeURIComponent(m)}`,
  },
  // Agenzia delle Entrate
  {
    pattern: /Agenzia\s+delle\s+Entrate/gi,
    url: () => 'https://www.agenziaentrate.gov.it',
  },
  // Banca d'Italia
  {
    pattern: /Banca\s+d['’]Italia/gi,
    url: () => 'https://www.bancaditalia.it',
  },
];

// ─── Handlungsempfehlung-Parser ──────────────────────────────────────────────

type ActionTag = { label: string; cls: string };

const TAG_RULES: { match: RegExp; tag: ActionTag }[] = [
  { match: /\b(sap|dmee|ebics|customizing|fiori|s\/4|fscm|trm)\b/i, tag: { label: 'SAP', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200' } },
  { match: /\b(steuer|berater|finanz|legal|wp|wirtschaftsprüfer)\w*/i, tag: { label: 'Externe', cls: 'bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200' } },
  { match: /\b(konto|bank|hausbank|riba|sbf|cbi)\b/i, tag: { label: 'Banking', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200' } },
  { match: /\b(evaluier|prüf|bewert|review|analy|pilot)\w*/i, tag: { label: 'Decision', cls: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-200' } },
  { match: /\b(stammdat|pfleg|aktualisier|migration|setup|implementier)\w*/i, tag: { label: 'Implementation', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' } },
];

function tagFor(item: string): ActionTag {
  for (const r of TAG_RULES) if (r.match.test(item)) return r.tag;
  return { label: 'Generell', cls: 'bg-muted text-foreground/70' };
}

function parseRecommendation(text: string): { headline?: string; subline?: string; items: string[] } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: string[] = [];
  let headline: string | undefined;
  let subline: string | undefined;
  let buf: string | null = null;

  const numberedRe = /^\d+[\.\)]\s*(.+)$/;

  for (const raw of lines) {
    const m = raw.match(numberedRe);
    if (m) {
      if (buf) items.push(buf);
      buf = m[1];
    } else if (buf !== null) {
      // continuation of last item
      buf += ' ' + raw;
    } else {
      // before first numbered item
      if (!headline) {
        const head = raw.match(/^([A-ZÄÖÜ][^:]+):\s*(.*)$/);
        if (head) {
          headline = head[1].trim();
          subline = head[2].trim();
        } else {
          headline = raw;
        }
      } else if (!subline) {
        subline = raw;
      }
    }
  }
  if (buf) items.push(buf);
  return { headline, subline, items };
}

function Handlungsempfehlung({ text }: { text: string }) {
  const { headline, subline, items } = parseRecommendation(text);
  return (
    <section className="rounded-xl border border-emerald-300/40 bg-emerald-50/40 p-6 dark:border-emerald-700/30 dark:bg-emerald-950/15">
      <header className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">Handlungsempfehlung</h2>
        {headline && (
          <span className="rounded-md bg-emerald-600/15 px-2 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-100">
            {headline}
          </span>
        )}
        {subline && <span className="text-xs text-emerald-800/70 dark:text-emerald-100/70">{subline}</span>}
      </header>

      <ol className="space-y-2">
        {items.map((it, idx) => {
          const tag = tagFor(it);
          return (
            <li
              key={idx}
              className="group flex items-start gap-3 rounded-lg border border-transparent bg-background/60 p-3 transition-colors hover:border-emerald-300/60 hover:bg-background"
            >
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-100">
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-sm leading-relaxed text-foreground/90">{it}</p>
                <span className={cn('inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', tag.cls)}>
                  {tag.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function linkify(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  // Collect all matches with positions
  const matches: { start: number; end: number; match: string; url: string }[] = [];
  for (const { pattern, url } of SOURCE_LINKS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, match: m[0], url: url(m[0]) });
    }
  }
  // Deduplicate overlapping, keep earliest-start then longest
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const chosen: typeof matches = [];
  let lastEnd = -1;
  for (const mm of matches) {
    if (mm.start >= lastEnd) {
      chosen.push(mm);
      lastEnd = mm.end;
    }
  }
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

interface Props {
  data: {
    ihb_bewertung: string | null;
    pobo_status: string | null;
    cobo_status: string | null;
    netting_erlaubt: string | null;
    lokales_konto: string | null;
    einschraenkungen_experte: string | null;
    einschraenkungen_einsteiger: string | null;
    rechtsgrundlage: string | null;
    handlungsempfehlung: string | null;
  };
}

type Tone = 'pos' | 'warn' | 'neg' | 'neutral';

function classifyStatus(raw: string | null | undefined): { label: string; tone: Tone; icon: string } {
  const s = (raw ?? '').trim();
  if (/✓/.test(s) || /^möglich$|^ja$/i.test(s)) return { label: s.replace(/^[✓]\s*/, ''), tone: 'pos', icon: '✓' };
  if (/✗/.test(s) || /^nein$/i.test(s)) return { label: s.replace(/^[✗]\s*/, ''), tone: 'neg', icon: '✗' };
  if (/⚠|eingeschränkt|bedingt|teilweise|einschränkung/i.test(s)) {
    return { label: s.replace(/^[⚠]\s*/, ''), tone: 'warn', icon: '!' };
  }
  return { label: s || '—', tone: 'neutral', icon: '·' };
}

const TONE_BADGE: Record<Tone, string> = {
  pos: 'bg-emerald-100 text-emerald-900 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800/50',
  warn: 'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800/50',
  neg: 'bg-rose-100 text-rose-900 ring-rose-300 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-800/50',
  neutral: 'bg-muted text-foreground/70 ring-border',
};

const TONE_DOT: Record<Tone, string> = {
  pos: 'bg-emerald-500',
  warn: 'bg-amber-500',
  neg: 'bg-rose-500',
  neutral: 'bg-muted-foreground/40',
};

function StatusCard({ label, raw }: { label: string; raw: string | null | undefined }) {
  const c = classifyStatus(raw);
  return (
    <div className={cn('flex flex-col gap-1.5 rounded-lg p-3 ring-1', TONE_BADGE[c.tone])}>
      <div className="flex items-center gap-2">
        <span className={cn('size-2 rounded-full', TONE_DOT[c.tone])} />
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <div className="text-sm font-semibold">{c.label}</div>
    </div>
  );
}

/** Turn free-text with newlines into bullet list + paragraph breaks. */
function RenderText({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/); // paragraphs
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground/85">
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const isBullets = lines.every((l) => l.startsWith('•') || l.startsWith('-'));
        if (isBullets && lines.length > 1) {
          return (
            <ul key={i} className="ml-4 list-disc space-y-1.5">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^[•\-]\s*/, '')}</li>
              ))}
            </ul>
          );
        }
        const [first, ...rest] = lines;
        const isHeading = /^[A-ZÄÖÜ][A-ZÄÖÜ \-/:,0-9]{5,}$/.test(first);
        return (
          <div key={i}>
            {isHeading ? (
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-foreground/70">{first}</div>
            ) : (
              <p>{first}</p>
            )}
            {rest.map((l, j) => (
              <p key={j} className={j === 0 && isHeading ? '' : 'mt-1'}>
                {l.replace(/^[•\-]\s*/, '• ')}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function IhbPanel({ data }: Props) {
  const einschraenkungen = data.einschraenkungen_einsteiger ?? data.einschraenkungen_experte;

  return (
    <div className="space-y-6">
      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatusCard label="IHB-Bewertung" raw={data.ihb_bewertung} />
        <StatusCard label="POBO" raw={data.pobo_status} />
        <StatusCard label="COBO" raw={data.cobo_status} />
        <StatusCard label="Netting" raw={data.netting_erlaubt} />
        <StatusCard label="Lokales Konto" raw={data.lokales_konto} />
      </div>

      {/* Einschränkungen — zentrale Karte */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Einschränkungen & Besonderheiten</h2>
        {einschraenkungen ? (
          <RenderText text={einschraenkungen} />
        ) : (
          <p className="text-sm text-muted-foreground">Keine spezifischen Einschränkungen dokumentiert.</p>
        )}
      </section>

      {/* Rechtsgrundlage — kleiner Callout mit Quellen-Links */}
      {data.rechtsgrundlage && (
        <section className="rounded-lg border-l-4 border-primary/50 bg-primary/5 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Rechtsgrundlage
          </div>
          <div className="text-sm text-foreground/80 whitespace-pre-line">
            {linkify(data.rechtsgrundlage)}
          </div>
        </section>
      )}

      {/* Handlungsempfehlung — strukturierte Checkliste */}
      {data.handlungsempfehlung && (
        <Handlungsempfehlung text={data.handlungsempfehlung} />
      )}
    </div>
  );
}
