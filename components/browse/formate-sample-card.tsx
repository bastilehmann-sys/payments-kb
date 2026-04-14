'use client';

import React from 'react';
import Link from 'next/link';
import type { FormatVersion } from '@/lib/queries/entries';

// ─── XSD availability (hardcoded for the 4 official XSD versions) ─────────────

const XSD_AVAILABLE = new Set([
  'pain.001.001.13',
  'pain.002.001.15',
  'pain.007.001.13',
  'pain.008.001.12',
]);

function xsdUrl(versionId: string): string | null {
  // versionId is e.g. "pain.001.001.13" — extract base (same as filename without extension)
  if (XSD_AVAILABLE.has(versionId)) {
    return `/samples/formate/xsd/${versionId}.xsd`;
  }
  return null;
}

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

function IconXsd() {
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
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <path d="M5 6l2 2-2 2M9 10h2" />
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

// ─── Changelog Callout ────────────────────────────────────────────────────────

interface ChangelogCalloutProps {
  currentVersionId: string;   // e.g. "pain.001.001.09"
  currentNotes: string | null;
  previousVersionId: string | null;
  compareUrl: string;
}

function ChangelogCallout({ currentVersionId, currentNotes, previousVersionId, compareUrl }: ChangelogCalloutProps) {
  if (!currentNotes) return null;

  const diffUrl = previousVersionId
    ? `/formate/vergleich?a=${encodeURIComponent(previousVersionId)}&b=${encodeURIComponent(currentVersionId)}`
    : compareUrl;

  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-800/40 dark:bg-amber-950/20 p-5">
      <div className="mb-2 text-base font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
        {previousVersionId ? `Änderungen gegenüber ${previousVersionId}` : 'Versionshinweis'}
      </div>
      <p className="text-base leading-relaxed text-amber-900/80 dark:text-amber-200/80">{currentNotes}</p>
      <Link
        href={diffUrl}
        className="mt-3 inline-flex items-center gap-2 text-base text-amber-700 dark:text-amber-400 hover:underline"
      >
        Vollständigen Diff anzeigen
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FormatSampleCardProps {
  formatName: string;
  /** Full version string for the currently selected list item (e.g. "pain.001.001.09") */
  selectedVersion?: string;
  /** Sample file URL for the selected version */
  selectedSampleFile?: string;
  /** Whether the selected version is flagged as current/latest */
  selectedIsCurrentVersion?: boolean;
  /** Notes for the currently selected version */
  selectedVersionNotes?: string;
  versions?: FormatVersion[];
}

export function FormatSampleCard({
  formatName,
  selectedVersion,
  selectedSampleFile,
  selectedIsCurrentVersion,
  selectedVersionNotes,
  versions,
}: FormatSampleCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  // Filter all versions for this format family
  const formatKey = formatName.toLowerCase().split(' ')[0]; // e.g. "pain.001"
  const matchedVersions = versions?.filter(
    (v) => v.format_name.toLowerCase() === formatKey
  ) ?? [];

  // ── New mode: per-version list item selected ──────────────────────────────
  if (selectedVersion) {
    const compareUrl = `/formate/vergleich?a=${encodeURIComponent(selectedVersion)}`;
    const otherVersions = matchedVersions.filter(
      (v) => `${v.format_name}.${v.version}` !== selectedVersion
    );

    // Compute previous version: find index of current version in sorted list, pick the one before it
    const sortedVersions = [...matchedVersions].sort((a, b) => a.version.localeCompare(b.version));
    const currentIdx = sortedVersions.findIndex(
      (v) => `${v.format_name}.${v.version}` === selectedVersion
        || `${v.format_name}.${v.version.replace(/^001\.001\./, '001.')}` === selectedVersion
    );
    const previousVersion = currentIdx > 0 ? sortedVersions[currentIdx - 1] : null;
    const previousVersionId = previousVersion
      ? `${previousVersion.format_name}.${previousVersion.version.replace(/^001\.001\./, '001.')}`
      : null;

    // Notes: use explicitly passed prop first, then look up from versions array
    const currentVersionFromDb = matchedVersions.find(
      (v) => `${v.format_name}.${v.version}` === selectedVersion
        || `${v.format_name}.${v.version.replace(/^001\.001\./, '001.')}` === selectedVersion
    );
    const notes = selectedVersionNotes || currentVersionFromDb?.notes || null;

    return (
      <div>
        {/* Changelog callout — amber accent, above the sample card */}
        <ChangelogCallout
          currentVersionId={selectedVersion}
          currentNotes={notes}
          previousVersionId={previousVersionId}
          compareUrl={compareUrl}
        />
        <div className="mb-6 rounded-xl border border-border bg-muted/20 overflow-hidden">
        {/* Header row — selected version */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-base font-semibold uppercase tracking-wider text-muted-foreground">
              Beispiel-Datei
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-lg text-foreground/90">{selectedVersion}</span>
              {selectedIsCurrentVersion && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  Aktuell
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {selectedSampleFile && (
              <a
                href={selectedSampleFile}
                download
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <IconDownload />
                Download
              </a>
            )}
            {selectedVersion && xsdUrl(selectedVersion) && (
              <a
                href={xsdUrl(selectedVersion)!}
                download
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-base font-medium text-foreground/80 hover:bg-muted/50 transition-colors"
                title={`Offizielles ISO 20022 XSD für ${selectedVersion} herunterladen`}
              >
                <IconXsd />
                XSD
              </a>
            )}
            <Link
              href={compareUrl}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-base font-medium text-foreground/80 hover:bg-muted/50 transition-colors"
            >
              <IconCompare />
              Vergleichen
            </Link>
            {otherVersions.length > 0 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-expanded={expanded}
              >
                {expanded ? 'Einklappen' : `${otherVersions.length} weitere`}
                <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                  <IconChevron />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable other versions */}
        {expanded && otherVersions.length > 0 && (
          <div className="border-t border-border">
            <div className="px-5 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Weitere Versionen ({formatName})
              </p>
            </div>
            <div className="divide-y divide-border">
              {otherVersions.map((v) => {
                const versionId = `${v.format_name}.${v.version}`;
                return (
                  <div
                    key={v.id}
                    className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-mono font-medium text-foreground/90">
                          {versionId}
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
                      {xsdUrl(versionId) && (
                        <a
                          href={xsdUrl(versionId)!}
                          download
                          className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
                          title={`Offizielles XSD für ${versionId}`}
                        >
                          <IconXsd />
                          XSD
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
        </div>{/* end inner card */}
      </div>
    );
  }

  // ── Legacy mode: no selectedVersion — show all matched versions ───────────
  if (matchedVersions.length > 0) {
    const currentVersion = matchedVersions.find((v) => v.is_current) ?? matchedVersions[matchedVersions.length - 1];
    const compareUrl = `/formate/vergleich?a=${encodeURIComponent(formatKey + '.' + currentVersion.version)}`;

    return (
      <div className="mb-6 rounded-xl border border-border bg-muted/20 overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-base font-semibold uppercase tracking-wider text-muted-foreground">
              Beispiel-Dateien · {matchedVersions.length} Versionen
            </div>
            <div className="text-lg text-foreground/90">
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
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <IconDownload />
                Aktuell
              </a>
            )}
            <Link
              href={compareUrl}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-base font-medium text-foreground/80 hover:bg-muted/50 transition-colors"
            >
              <IconCompare />
              Vergleichen
            </Link>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? 'Einklappen' : 'Alle Versionen'}
              <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                <IconChevron />
              </span>
            </button>
          </div>
        </div>

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
                        <span className="text-base font-mono font-medium text-foreground/90">
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
                      {xsdUrl(versionId) && (
                        <a
                          href={xsdUrl(versionId)!}
                          download
                          className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
                          title={`Offizielles XSD für ${versionId}`}
                        >
                          <IconXsd />
                          XSD
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
        <div className="mb-1 text-base font-semibold uppercase tracking-wider text-muted-foreground">
          Beispiel-Datei
        </div>
        <div className="text-lg text-foreground/90">{sample.label}</div>
      </div>
      <a
        href={sample.file}
        download
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <IconDownload />
        Download
      </a>
    </div>
  );
}
