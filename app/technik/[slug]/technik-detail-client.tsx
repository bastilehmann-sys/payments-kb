'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TechnikEntry } from '@/lib/queries/technik';

const COMPLEXITY_LABELS: Record<number, string> = {
  1: 'Sehr niedrig',
  2: 'Niedrig',
  3: 'Mittel',
  4: 'Hoch',
  5: 'Sehr hoch',
};

interface Props {
  entry: TechnikEntry;
  articleMd: string;
}

export function TechnikDetailClient({ entry, articleMd }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/technik" className="hover:text-foreground">Technik</Link>
        <span>›</span>
        <span className="text-foreground">{entry.name}</span>
      </div>

      {/* Steckbrief Header */}
      <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
              Verbindungsprotokoll
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">{entry.name}</h1>
            {entry.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{entry.subtitle}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5">
            {(entry.badges as string[]).map(badge => (
              <span
                key={badge}
                className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Steckbrief Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Einsatzgebiet', value: entry.einsatzgebiet },
            { label: 'Sicherheit', value: entry.sicherheit },
            { label: 'Verbreitung', value: entry.verbreitung },
            { label: 'SAP-Integration', value: entry.sap_integration },
            { label: 'Version aktuell', value: entry.version_aktuell },
            { label: 'Formate', value: (entry.formate as string[]).join(', ') },
            { label: 'Alternativen', value: (entry.alternativen as string[]).join(', ') },
            {
              label: 'Komplexität Setup',
              value: entry.komplexitaet
                ? `${entry.komplexitaet}/5 — ${COMPLEXITY_LABELS[entry.komplexitaet]}`
                : undefined,
            },
          ].map(({ label, value }) =>
            value ? (
              <div
                key={label}
                className="rounded-lg border border-green-200 bg-white p-3 dark:border-green-900 dark:bg-background"
              >
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
                <div className="text-sm font-medium text-foreground">{value}</div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Artikel */}
      {articleMd ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 border-b border-border pb-2 font-heading text-lg font-semibold text-foreground">
            Artikel
          </h2>
          <div className="space-y-2 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleMd}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
          Kein Artikel für dieses Protokoll vorhanden. Artikel in{' '}
          <code className="rounded bg-muted px-1">content/gpdb_06_technik.md</code> unter{' '}
          <code className="rounded bg-muted px-1">## {entry.id}</code> eintragen.
        </div>
      )}
    </div>
  );
}
