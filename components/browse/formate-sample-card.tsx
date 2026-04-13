'use client';

import React from 'react';

// ─── Sample file mapping ──────────────────────────────────────────────────────

const SAMPLES: Record<string, { file: string; label: string }> = {
  'pain.001': { file: '/samples/formate/pain.001.001.03.xml', label: 'pain.001.001.03 (Credit Transfer)' },
  'pain.002': { file: '/samples/formate/pain.002.001.03.xml', label: 'pain.002.001.03 (Status Report)' },
  'pain.008': { file: '/samples/formate/pain.008.001.02.xml', label: 'pain.008.001.02 (Direct Debit)' },
  'camt.052': { file: '/samples/formate/camt.052.001.02.xml', label: 'camt.052.001.02 (Account Report)' },
  'camt.053': { file: '/samples/formate/camt.053.001.02.xml', label: 'camt.053.001.02 (Statement)' },
  'camt.054': { file: '/samples/formate/camt.054.001.02.xml', label: 'camt.054.001.02 (Debit/Credit Notification)' },
  'mt103':    { file: '/samples/formate/MT103.txt',            label: 'MT103 (Customer Credit Transfer)' },
};

function findSample(formatName: string): { file: string; label: string } | null {
  const lower = formatName.toLowerCase();
  for (const [key, val] of Object.entries(SAMPLES)) {
    if (lower.startsWith(key.toLowerCase())) return val;
  }
  return null;
}

// ─── Download icon ────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

interface FormatSampleCardProps {
  formatName: string;
}

export function FormatSampleCard({ formatName }: FormatSampleCardProps) {
  const sample = findSample(formatName);
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
