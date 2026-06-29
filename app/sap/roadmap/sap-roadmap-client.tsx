'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { SapRoadmapItem } from '@/lib/queries/sap';

const STATUS_STYLES: Record<string, { dot: string; badge: string; border: string }> = {
  available: {
    dot: 'bg-green-500 ring-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    border: 'border-green-200 dark:border-green-900',
  },
  announced: {
    dot: 'bg-blue-500 ring-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-900',
  },
  planned: {
    dot: 'bg-zinc-400 ring-zinc-400',
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
  },
};

const STATUS_LABELS: Record<string, string> = {
  available: 'Verfügbar',
  announced: 'Angekündigt',
  planned: 'Geplant',
};

interface Props { items: SapRoadmapItem[] }

export function SapRoadmapClient({ items }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">SAP</h1>
      </div>

      {/* Sub-tabs */}
      <div className="mb-8 flex gap-2">
        <div className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Produktroadmap
        </div>
        <Link
          href="/sap/implementierung"
          className="rounded-md bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Implementierungspfade
        </Link>
      </div>

      <h2 className="mb-6 font-heading text-lg font-semibold text-foreground">
        SAP Payment-relevante Releases
      </h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Keine Einträge vorhanden. Bitte Seed-Skript ausführen.</p>
      ) : (
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
          <div className="flex flex-col gap-4">
            {items.map(item => {
              const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.planned;
              return (
                <div key={item.id} className="relative">
                  <div
                    className={cn(
                      'absolute -left-4 top-4 h-2.5 w-2.5 rounded-full ring-2 ring-background',
                      s.dot
                    )}
                  />
                  <div className={cn('rounded-xl border bg-card p-4', s.border)}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        {item.tags && (item.tags as string[]).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(item.tags as string[]).map(tag => (
                              <span
                                key={tag}
                                className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {item.release_date && (
                          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', s.badge)}>
                            {item.release_date}
                          </span>
                        )}
                        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', s.badge)}>
                          {STATUS_LABELS[item.status] ?? item.status}
                        </span>
                      </div>
                    </div>
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
