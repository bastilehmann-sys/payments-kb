'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SchemaDiffResult {
  added: string[];
  removed: string[];
  common: number;
  total: { a: number; b: number };
}

interface SchemaDiffPanelProps {
  sampleA?: string | null;
  sampleB?: string | null;
}

function isXml(path: string): boolean {
  return path.toLowerCase().endsWith('.xml');
}

function PathList({ paths, colorClass }: { paths: string[]; colorClass: string }) {
  if (paths.length === 0) {
    return (
      <p className="text-xs text-muted-foreground/50 italic">Keine</p>
    );
  }
  return (
    <ul className="space-y-0.5">
      {paths.map((p) => (
        <li
          key={p}
          className={cn('rounded px-2 py-0.5 font-mono text-xs break-all', colorClass)}
        >
          {p}
        </li>
      ))}
    </ul>
  );
}

export function SchemaDiffPanel({ sampleA, sampleB }: SchemaDiffPanelProps) {
  const [open, setOpen] = React.useState(true);
  const [data, setData] = React.useState<SchemaDiffResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const bothXml = !!(sampleA && sampleB && isXml(sampleA) && isXml(sampleB));

  React.useEffect(() => {
    if (!bothXml) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    const url = `/api/formate/schema-diff?a=${encodeURIComponent(sampleA!)}&b=${encodeURIComponent(sampleB!)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) return res.json().then((e) => { throw new Error(e.error ?? res.statusText); });
        return res.json() as Promise<SchemaDiffResult>;
      })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [sampleA, sampleB, bothXml]);

  // Not applicable: one or both samples not XML
  if (!bothXml) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground/60">
        Schema-Diff nur für XML-Sample-Files verfügbar
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-background overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground/80">Schema-Unterschiede</span>
          {data && (
            <div className="flex items-center gap-2">
              {data.added.length > 0 && (
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                  +{data.added.length}
                </span>
              )}
              {data.removed.length > 0 && (
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                  -{data.removed.length}
                </span>
              )}
              <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {data.common} gemeinsam
              </span>
            </div>
          )}
          {loading && (
            <span className="text-xs text-muted-foreground/60 animate-pulse">Wird geladen…</span>
          )}
        </div>
        <svg
          viewBox="0 0 16 16"
          className={cn('size-4 text-muted-foreground transition-transform', open ? 'rotate-180' : '')}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-border">
          {error && (
            <div className="px-4 py-3 text-xs text-red-600 dark:text-red-400">
              Fehler: {error}
            </div>
          )}

          {loading && !error && (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground/60 animate-pulse">
              Schema wird analysiert…
            </div>
          )}

          {data && !loading && (
            <div className="grid grid-cols-3 divide-x divide-border">
              {/* Added */}
              <div className="p-4 bg-green-500/5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
                  Hinzugefügt ({data.added.length})
                </p>
                <PathList paths={data.added} colorClass="bg-green-500/10 text-green-800 dark:text-green-300" />
              </div>

              {/* Removed */}
              <div className="p-4 bg-red-500/5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
                  Entfernt ({data.removed.length})
                </p>
                <PathList paths={data.removed} colorClass="bg-red-500/10 text-red-800 dark:text-red-300" />
              </div>

              {/* Common (count only) */}
              <div className="p-4 flex flex-col justify-start gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Gemeinsam
                </p>
                <div className="text-3xl font-bold tabular-nums text-foreground/70">
                  {data.common}
                </div>
                <p className="text-xs text-muted-foreground/50">
                  Pfade in beiden Versionen vorhanden
                </p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground/50">
                  <div>A: {data.total.a} Pfade gesamt</div>
                  <div>B: {data.total.b} Pfade gesamt</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
