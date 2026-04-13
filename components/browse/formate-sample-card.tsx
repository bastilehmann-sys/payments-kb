'use client';

import React from 'react';
import Link from 'next/link';
import type { FormatVersion } from '@/lib/queries/entries';

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function IconCompare() {
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
      <path d="M2 8h12" />
      <path d="M5 5l-3 3 3 3" />
      <path d="M11 5l3 3-3 3" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

// ─── Fallback single-sample mapping (when no DB versions available) ───────────

const FALLBACK_SAMPLES: Record<string, { file: string; label: string }> = {
  'pain.001': { file: '/samples/formate/pain.001.001.03.xml', label: 'pain.001.001.03 (Credit Transfer)' },
  'pain.002': { file: '/samples/formate/pain.002.001.03.xml', label: 'pain.002.001.03 (Status Report)' },
  'pain.008': { file: '/samples/formate/pain.008.001.02.xml', label: 'pain.008.001.02 (Direct Debit)' },
  'camt.052': { file: '/samples/formate/camt.052.001.02.xml', label: 'camt.052.001.02 (Account Report)' },
  'camt.053': { file: '/samples/formate/camt.053.001.02.xml', label: 'camt.053.001.02 (Statement)' },
  'camt.054': { file: '/samples/formate/camt.054.001.02.xml', label: 'camt.054.001.02 (Debit/Credit Notification)' },
  'mt103':    { file: '/samples/formate/MT103.txt',            label: 'MT103 (Customer Credit Transfer)' },
};

function findFallback(formatName: string): { file: string; label: string } | null {
  const lower = formatName.toLowerCase();
  for (const [key, val] of Object.entries(FALLBACK_SAMPLES)) {
    if (lower.startsWith(key.toLowerCase())) return val;
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FormatSampleCardProps {
  formatName: string;
  versions?: FormatVersion[];
}

export function FormatSampleCard({ formatName, versions }: FormatSampleCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  // Filter versions matching this format
  const formatKey = formatName.toLowerCase().split(' ')[0]; // e.g. "pain.001" from "pain.001"
  const matchedVersions = versions?.filter(
    (v) => v.format_name.toLowerCase() === formatKey
  ) ?? [];

  // If we have DB versions, show enhanced card
  if (matchedVersions.length > 0) {
    const currentVersion = matchedVersions.find((v) => v.is_current) ?? matchedVersions[matchedVersions.length - 1];
    const compareUrl = `/formate/vergleich?a=${encodeURIComponent(formatKey + '.' + currentVersion.version)}`;

    return (
      <div className="mb-6 rounded-xl border border-border bg-muted/20 overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Beispiel-Dateien · {matchedVersions.length} Versionen
            </div>
            <div className="text-base text-foreground/90">
              <span className="font-medium">{formatName}</span>
              {currentVersion && (
                <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                  Aktuell: {currentVersion.version}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {currentVersion?.sample_file && (
              <a
                href={currentVersion.sample_file}
                download
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <IconDownload />
                Aktuell
              </a>
            )}
            <Link
              href={compareUrl}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted/50 transition-colors"
            >
              <IconCompare />
              Vergleichen
            </Link>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? 'Einklappen' : 'Alle Versionen'}
              <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                <IconChevron />
              </span>
            </button>
          </div>
        </div>

        {/* Expanded version list */}
        {expanded && (
          <div className="border-t border-border">
            <div className="divide-y divide-border">
              {matchedVersions.map((v) => {
                const versionId = `${v.format_name}.${v.version}`;
                return (
                  <div
                    key={v.id}
                    className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-medium text-foreground/90">
                          {v.format_name}.{v.version}
                        </span>
                        {v.is_current && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                            Aktuell
                          </span>
                        )}
                        {v.released && (
                          <span className="text-xs text-muted-foreground/60">{v.released}</span>
                        )}
                      </div>
                      {v.notes && (
                        <p className="mt-0.5 text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
                          {v.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {v.sample_file && (
                        <a
                          href={v.sample_file}
                          download
                          className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
                          title={`${versionId} herunterladen`}
                        >
                          <IconDownload />
                          Download
                        </a>
                      )}
                      <Link
                        href={`/formate/vergleich?a=${encodeURIComponent(versionId)}`}
                        className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title="Mit anderer Version vergleichen"
                      >
                        <IconCompare />
                        Vergl.
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback: single file (no DB versions)
  const sample = findFallback(formatName);
  if (!sample) return null;

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 p-5">
      <div>
        <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Beispiel-Datei
        </div>
        <div className="text-base text-foreground/90">{sample.label}</div>
      </div>
      <a
        href={sample.file}
        download
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <IconDownload />
        Download
      </a>
    </div>
  );
}
