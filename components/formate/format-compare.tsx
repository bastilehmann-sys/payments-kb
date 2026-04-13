'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { FormatVersion } from '@/lib/queries/entries';
import type { FormatEntry } from '@/lib/queries/entries';
import { FormatTreeDiff } from '@/components/formate/format-tree-diff';
import { DiffPair } from '@/components/formate/diff-pair';

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSwap() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 3v14M5 3L2 6M5 3l3 3" />
      <path d="M15 17V3M15 17l3-3M15 17l-3-3" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v8M5 7l3 3 3-3" />
      <path d="M2 12h12" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4 shrink-0 mt-0.5 text-blue-500 dark:text-blue-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5" />
      <circle cx="10" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormatCompareProps {
  versions: FormatVersion[];
  entries: FormatEntry[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseSelection(val: string | null): { formatName: string; version: string } | null {
  if (!val) return null;
  const legacyMatch = val.match(/^(.+)\.legacy$/i);
  if (legacyMatch) return { formatName: legacyMatch[1], version: 'legacy' };
  const parts = val.split('.');
  if (parts.length >= 4) {
    const version = parts.slice(-3).join('.');
    const formatName = parts.slice(0, -3).join('.');
    return { formatName, version };
  }
  if (parts.length === 2) {
    return { formatName: parts[0], version: parts[1] };
  }
  return null;
}

function groupVersionsByFormat(versions: FormatVersion[]): Record<string, FormatVersion[]> {
  const groups: Record<string, FormatVersion[]> = {};
  for (const v of versions) {
    if (!groups[v.format_name]) groups[v.format_name] = [];
    groups[v.format_name].push(v);
  }
  return groups;
}

function findEntry(entries: FormatEntry[], formatName: string): FormatEntry | null {
  const lower = formatName.toLowerCase();
  return (
    entries.find((e) => (e.format_name ?? '').toLowerCase() === lower) ??
    entries.find((e) => (e.format_name ?? '').toLowerCase().startsWith(lower)) ??
    null
  );
}

// ─── Metadata rows ────────────────────────────────────────────────────────────

const SECTION_ROWS: { key: string; label: string; source: 'entry' | 'version' }[] = [
  { key: 'nachrichtentyp',          label: 'Nachrichtentyp',       source: 'entry' },
  { key: 'familie_standard',        label: 'Familie / Standard',   source: 'entry' },
  { key: 'aktuelle_version',        label: 'Aktuelle Version',     source: 'entry' },
  { key: 'datenrichtung',           label: 'Datenrichtung',        source: 'entry' },
  { key: 'sap_relevanz',            label: 'SAP-Relevanz',         source: 'entry' },
  { key: 'status',                  label: 'Status',               source: 'entry' },
  { key: 'released',                label: 'Veröffentlicht',       source: 'version' },
  { key: 'source_standard',        label: 'Standard / Rulebook',  source: 'version' },
  { key: 'schema_uri',              label: 'Schema URI',           source: 'version' },
  { key: 'notes',                   label: 'Versions-Notes',       source: 'version' },
  { key: 'beschreibung_einsteiger', label: 'Beschreibung',         source: 'entry' },
  { key: 'wichtige_felder',         label: 'Wichtige Felder',      source: 'entry' },
  { key: 'sap_mapping_einsteiger',  label: 'SAP-Mapping',         source: 'entry' },
  { key: 'fehlerquellen_einsteiger', label: 'Typische Fehler',    source: 'entry' },
];

function getValue(
  row: { key: string; source: 'entry' | 'version' },
  entry: FormatEntry | null,
  version: FormatVersion | null,
): string {
  if (row.source === 'version' && version) {
    return String((version as Record<string, unknown>)[row.key] ?? '');
  }
  if (row.source === 'entry' && entry) {
    return String((entry as Record<string, unknown>)[row.key] ?? '');
  }
  return '';
}

// ─── Sample download button ───────────────────────────────────────────────────

function SampleButton({
  href,
  isB,
}: {
  href: string;
  isB?: boolean;
}) {
  return (
    <a
      href={href}
      download
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium transition-colors',
        isB
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
          : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
      )}
    >
      <IconDownload />
      Sample
    </a>
  );
}

// ─── Main compare component ───────────────────────────────────────────────────

export function FormatCompare({ versions, entries }: FormatCompareProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramA = searchParams.get('a');
  const paramB = searchParams.get('b');

  const selA = parseSelection(paramA);
  const selB = parseSelection(paramB);

  const groups      = React.useMemo(() => groupVersionsByFormat(versions), [versions]);
  const formatNames = Object.keys(groups).sort();

  function buildSelectValue(v: FormatVersion) {
    return `${v.format_name}.${v.version}`;
  }

  function updateParam(side: 'a' | 'b', value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(side, value);
    else params.delete(side);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function swap() {
    const params = new URLSearchParams(searchParams.toString());
    const a = params.get('a') ?? '';
    const b = params.get('b') ?? '';
    if (a) params.set('b', a); else params.delete('b');
    if (b) params.set('a', b); else params.delete('a');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const versionA = selA
    ? versions.find((v) => v.format_name === selA.formatName && v.version === selA.version) ?? null
    : null;
  const versionB = selB
    ? versions.find((v) => v.format_name === selB.formatName && v.version === selB.version) ?? null
    : null;

  const entryA = selA ? findEntry(entries, selA.formatName) : null;
  const entryB = selB ? findEntry(entries, selB.formatName) : null;

  const currentValueA = paramA ?? '';
  const currentValueB = paramB ?? '';

  const [metaOpen, setMetaOpen] = React.useState(false);

  const hasSelections = !!(versionA || entryA || versionB || entryB);
  const bothSelected  = !!(versionA || entryA) && !!(versionB || entryB);

  // ── Format labels ────────────────────────────────────────────────────────────
  const labelA = versionA ? `${versionA.format_name}.${versionA.version}` : (entryA?.format_name ?? 'Format A');
  const labelB = versionB ? `${versionB.format_name}.${versionB.version}` : (entryB?.format_name ?? 'Format B');

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Top bar: dropdowns + swap ─────────────────────────────────────── */}
      <div className="shrink-0 border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">

          {/* Format A dropdown */}
          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Format A
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={currentValueA}
                  onChange={(e) => updateParam('a', e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-border bg-primary/5 px-3 pr-8 text-base text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                >
                  <option value="">— Format A wählen —</option>
                  {formatNames.map((name) => (
                    <optgroup key={name} label={name}>
                      {groups[name].map((v) => (
                        <option key={v.id} value={buildSelectValue(v)}>
                          {name} › {v.version}
                          {v.is_current ? ' ★' : ''}
                          {v.released ? ` (${v.released})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4 4 4-4" /></svg>
                </span>
              </div>
              {versionA?.sample_file && <SampleButton href={versionA.sample_file} />}
            </div>
          </div>

          {/* Swap button */}
          <div className="flex flex-col items-center self-end pb-0.5">
            <span className="mb-1.5 block text-xs text-transparent select-none">Swap</span>
            <button
              onClick={swap}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              title="A und B tauschen"
              aria-label="A und B tauschen"
            >
              <IconSwap />
            </button>
          </div>

          {/* Format B dropdown */}
          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Format B
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={currentValueB}
                  onChange={(e) => updateParam('b', e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-border bg-blue-500/5 px-3 pr-8 text-base text-foreground outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
                >
                  <option value="">— Format B wählen —</option>
                  {formatNames.map((name) => (
                    <optgroup key={name} label={name}>
                      {groups[name].map((v) => (
                        <option key={v.id} value={buildSelectValue(v)}>
                          {name} › {v.version}
                          {v.is_current ? ' ★' : ''}
                          {v.released ? ` (${v.released})` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4 4 4-4" /></svg>
                </span>
              </div>
              {versionB?.sample_file && <SampleButton href={versionB.sample_file} isB />}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* Empty state */}
        {!hasSelections && (
          <div className="flex h-full min-h-64 items-center justify-center p-12 text-center">
            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/30">
                <svg viewBox="0 0 24 24" className="size-6 text-muted-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4M14 3h7m0 0v7m0-7L10 14" />
                </svg>
              </div>
              <p className="text-lg font-medium text-foreground/70">Zwei Formate zum Vergleichen wählen</p>
              <p className="mt-1 text-base text-muted-foreground/60">
                Wähle aus den Dropdowns oben ein Format A und Format B aus.<br />
                Der XML-Elementbaum beider Formate wird nebeneinander gezeigt.
              </p>
            </div>
          </div>
        )}

        {/* Single selection hint */}
        {hasSelections && !bothSelected && (
          <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground/70">
            Wähle auch das {!versionA && !entryA ? 'Format A' : 'Format B'} aus, um den Vergleich zu starten.
          </div>
        )}

        {/* Tree diff */}
        {bothSelected && (
          <>
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-sm">
              <IconInfo />
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-200">Hinweis zum Diff</div>
                <p className="mt-1 text-blue-900/80 dark:text-blue-200/80 leading-relaxed">
                  Der Baum zeigt Unterschiede basierend auf den hinterlegten Beispiel-Dateien.
                  Für die autoritative Schema-Definition siehe ISO 20022 / EPC / CGI-MP.
                  Kuratierte Versionshinweise findest du im Callout oben.
                </p>
              </div>
            </div>
            <FormatTreeDiff
              sampleA={versionA?.sample_file}
              sampleB={versionB?.sample_file}
              labelA={labelA}
              labelB={labelB}
            />
          </>
        )}

        {/* ── Metadaten-Vergleich (collapsible) ──────────────────────────── */}
        {hasSelections && (
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <button
              onClick={() => setMetaOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/20 transition-colors"
            >
              <span className="text-base font-semibold text-foreground/80">Metadaten-Vergleich</span>
              <IconChevron open={metaOpen} />
            </button>

            {metaOpen && (
              <div className="border-t border-border overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="sticky top-0 z-10 bg-background border-b border-border">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-36">
                        Feld
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-primary/70">
                        {labelA}
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-500/70">
                        {labelB}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {SECTION_ROWS.map((row) => {
                      const valA = getValue(row, entryA, versionA);
                      const valB = getValue(row, entryB, versionB);
                      const differs = !!(valA || valB) && valA !== valB;
                      if (!valA && !valB) return null;

                      return (
                        <tr
                          key={row.key}
                          className={cn('align-top', differs && 'bg-amber-50/50 dark:bg-amber-950/20')}
                        >
                          <td className={cn(
                            'px-4 py-3 text-xs whitespace-nowrap',
                            differs
                              ? 'font-semibold text-amber-700 dark:text-amber-300 border-l-4 border-l-amber-500'
                              : 'font-medium text-muted-foreground/70',
                          )}>
                            {row.label}
                          </td>
                          <td className="px-4 py-3 text-base text-foreground/85 max-w-xs">
                            <DiffPair left={valA} right={valB} showDiff={false} side="left" />
                          </td>
                          <td className="px-4 py-3 text-base text-foreground/85 max-w-xs">
                            <DiffPair left={valA} right={valB} showDiff={false} side="right" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
