'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReindexResult } from '@/lib/ingest/reindex';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: ReindexResult }
  | { status: 'error'; message: string };

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: 'idle' });

  async function handleReindex() {
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/admin/reindex', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setState({ status: 'error', message: data.error ?? `HTTP ${res.status}` });
        return;
      }
      setState({ status: 'success', result: data as ReindexResult });
      router.refresh();
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Netzwerkfehler',
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Verwaltung und Wartung der Knowledge Base.
        </p>
      </div>

      {/* Reindex card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Inhalte neu indizieren
          </h2>
          <p className="text-sm text-muted-foreground">
            Liest alle Markdown-Dokumente aus dem Content-Verzeichnis, erstellt Embeddings und
            aktualisiert die Datenbank. Unveränderte Dateien werden übersprungen.
          </p>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          <svg
            className="mt-0.5 size-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>
            <strong>Hinweis:</strong> Dies kann 1–2 Minuten dauern und OpenAI-Credits verbrauchen.
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleReindex}
          disabled={state.status === 'loading'}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.status === 'loading' ? (
            <>
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Indizierung läuft…
            </>
          ) : (
            <>
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10" />
                <polyline points="23 20 23 14 17 14" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
              Inhalte neu indizieren
            </>
          )}
        </button>

        {/* Error state */}
        {state.status === 'error' && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <strong>Fehler:</strong> {state.message}
          </div>
        )}

        {/* Success state */}
        {state.status === 'success' && (
          <div className="space-y-4">
            {/* Summary badges */}
            <div className="flex flex-wrap gap-3">
              <StatBadge
                label="Verarbeitet"
                value={state.result.processed}
                color="green"
              />
              <StatBadge
                label="Übersprungen"
                value={state.result.skipped}
                color="neutral"
              />
              <StatBadge
                label="Chunks erstellt"
                value={state.result.chunks_created}
                color="blue"
              />
            </div>

            {/* Per-file list */}
            {Object.keys(state.result.per_file).length > 0 && (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Datei
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                        Chunks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Object.entries(state.result.per_file).map(([filename, fileResult]) => (
                      <tr key={filename} className="bg-card">
                        <td className="px-4 py-2 font-mono text-xs text-foreground">
                          {filename}
                        </td>
                        <td className="px-4 py-2">
                          {fileResult.status === 'processed' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Verarbeitet
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                              {fileResult.reason ?? 'Übersprungen'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                          {fileResult.chunks_created}
                        </td>
                      </tr>
                    ))}
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

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'green' | 'blue' | 'neutral';
}) {
  const colorClasses = {
    green: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    neutral: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-center min-w-[100px] ${colorClasses[color]}`}
    >
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs">{label}</div>
    </div>
  );
}
