'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { FormatVersion } from '@/lib/queries/entries';
import type { FormatEntry } from '@/lib/queries/entries';
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

function IconDelta() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-3 shrink-0 text-amber-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L1 10h10L6 2z" />
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
  // Expected: "pain.001.001.03" or "pain.001.legacy" or "mt103.legacy"
  // Split on last dot-group that matches version pattern (001.001.XX or legacy)
  const legacyMatch = val.match(/^(.+)\.legacy$/i);
  if (legacyMatch) return { formatName: legacyMatch[1], version: 'legacy' };

  // Try splitting: format_name is everything up to the version portion
  // version is like "001.001.03"
  const parts = val.split('.');
  if (parts.length >= 4) {
    // Last 3 parts are the version (e.g. 001.001.03)
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

// ─── Compare row categories ───────────────────────────────────────────────────

const SECTION_ROWS: { key: string; label: string; source: 'entry' | 'version' }[] = [
  { key: 'nachrichtentyp',        label: 'Nachrichtentyp',         source: 'entry' },
  { key: 'familie_standard',      label: 'Familie / Standard',     source: 'entry' },
  { key: 'aktuelle_version',      label: 'Aktuelle Version',       source: 'entry' },
  { key: 'datenrichtung',         label: 'Datenrichtung',          source: 'entry' },
  { key: 'sap_relevanz',          label: 'SAP-Relevanz',           source: 'entry' },
  { key: 'status',                label: 'Status',                 source: 'entry' },
  { key: 'released',              label: 'Veröffentlicht',         source: 'version' },
  { key: 'source_standard',       label: 'Standard / Rulebook',   source: 'version' },
  { key: 'schema_uri',            label: 'Schema URI',             source: 'version' },
  { key: 'notes',                 label: 'Versions-Notes',         source: 'version' },
  { key: 'beschreibung_einsteiger', label: 'Beschreibung',         source: 'entry' },
  { key: 'wichtige_felder',       label: 'Wichtige Felder',        source: 'entry' },
  { key: 'sap_mapping_einsteiger', label: 'SAP-Mapping',          source: 'entry' },
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

// ─── Side panel ───────────────────────────────────────────────────────────────

function SidePanel({
  label,
  version,
  entry,
  isB,
}: {
  label: string;
  version: FormatVersion | null;
  entry: FormatEntry | null;
  isB?: boolean;
}) {
  const title = version
    ? `${version.format_name}.${version.version}`
    : (entry?.format_name ?? '—');

  return (
    <div className={cn('flex flex-col h-full', isB && 'border-l border-border')}>
      {/* Panel header */}
      <div className={cn(
        'shrink-0 px-6 py-4 border-b border-border',
        isB ? 'bg-blue-500/5' : 'bg-primary/5',
      )}>
        <div className={cn(
          'text-xs font-semibold uppercase tracking-wider mb-1',
          isB ? 'text-blue-500/70' : 'text-primary/70',
        )}>
          {label}
        </div>
        <h3 className="font-mono text-lg font-bold text-foreground">{title}</h3>
        {version?.source_standard && (
          <p className="mt-1 text-xs text-muted-foreground">{version.source_standard}</p>
        )}
        {version?.sample_file && (
          <a
            href={version.sample_file}
            download
            className={cn(
              'mt-3 inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-medium transition-colors',
              isB
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
            )}
          >
            <IconDownload />
            Sample herunterladen
          </a>
        )}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {!version && !entry ? (
          <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground/60 text-center">
            Wähle eine Version aus dem Dropdown oben
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main compare component ───────────────────────────────────────────────────

export function FormatCompare({ versions, entries }: FormatCompareProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramA = searchParams.get('a');
  const paramB = searchParams.get('b');

  const selA = parseSelection(paramA);
  const selB = parseSelection(paramB);

  const groups = React.useMemo(() => groupVersionsByFormat(versions), [versions]);
  const formatNames = Object.keys(groups).sort();

  function buildSelectValue(v: FormatVersion) {
    return `${v.format_name}.${v.version}`;
  }

  function updateParam(side: 'a' | 'b', value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(side, value);
    } else {
      params.delete(side);
    }
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

  // Resolve selected versions and entries
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

  const [showDiff, setShowDiff] = React.useState(true);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar: dropdowns + swap */}
      <div className="shrink-0 border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Format A
            </label>
            <div className="relative">
              <select
                value={currentValueA}
                onChange={(e) => updateParam('a', e.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-border bg-primary/5 px-3 pr-8 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
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
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4 4 4-4"/></svg>
              </span>
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

          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Format B
            </label>
            <div className="relative">
              <select
                value={currentValueB}
                onChange={(e) => updateParam('b', e.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-border bg-blue-500/5 px-3 pr-8 text-sm text-foreground outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
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
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4 4 4-4"/></svg>
              </span>
            </div>
          </div>

          {/* Diff toggle */}
          <div className="flex flex-col items-center self-end pb-0.5">
            <span className="mb-1.5 block text-xs text-transparent select-none">Diff</span>
            <button
              onClick={() => setShowDiff((v) => !v)}
              className={cn(
                'h-10 rounded-md border px-3 text-xs font-medium transition-colors whitespace-nowrap',
                showDiff
                  ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20'
                  : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
              title={showDiff ? 'Diff ausblenden' : 'Diff anzeigen'}
            >
              {showDiff ? 'Diff an' : 'Plain'}
            </button>
          </div>
        </div>
      </div>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Format A */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <SidePanel label="Format A" version={versionA} entry={entryA} />
        </div>

        {/* Right: Format B */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <SidePanel label="Format B" version={versionB} entry={entryB} isB />
        </div>
      </div>

      {/* Comparison rows */}
      {(versionA || entryA || versionB || entryB) && (
        <div className="shrink-0 border-t border-border overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-background border-b border-border">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 w-36">
                  Feld
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-primary/70">
                  Format A
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-500/70">
                  Format B
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
                    className={cn(
                      'align-top',
                      differs && 'bg-amber-500/5',
                    )}
                  >
                    <td className={cn(
                      'px-4 py-3 text-xs font-medium text-muted-foreground/70 whitespace-nowrap',
                      differs && 'border-l-2 border-amber-500/60',
                    )}>
                      <div className="flex items-center gap-1.5">
                        {differs && <IconDelta />}
                        {row.label}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/85 max-w-xs">
                      <DiffPair left={valA} right={valB} showDiff={showDiff} side="left" />
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/85 max-w-xs">
                      <DiffPair left={valA} right={valB} showDiff={showDiff} side="right" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}


      {/* Empty state */}
      {!versionA && !entryA && !versionB && !entryB && (
        <div className="flex flex-1 items-center justify-center p-12 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/30">
              <svg viewBox="0 0 24 24" className="size-6 text-muted-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4M14 3h7m0 0v7m0-7L10 14" />
              </svg>
            </div>
            <p className="text-base font-medium text-foreground/70">Zwei Formate zum Vergleichen wählen</p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Wähle aus den Dropdowns oben ein Format A und Format B aus.<br />
              Unterschiede werden mit einem Δ-Symbol markiert.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
