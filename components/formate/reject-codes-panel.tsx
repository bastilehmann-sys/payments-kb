'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { RejectCode } from '@/lib/formats/types';

interface Props {
  codes: RejectCode[];
  title?: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export function RejectCodesPanel({ codes, title = 'Häufige Rückgabe-Codes', sourceLabel, sourceUrl }: Props) {
  const [filter, setFilter] = React.useState<string>('ALL');
  const groups = Array.from(new Set(codes.map((r) => r.group)));
  const filtered = filter === 'ALL' ? codes : codes.filter((r) => r.group === filter);
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{filtered.length} von {codes.length} Codes</span>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button onClick={() => setFilter('ALL')} className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium ring-1', filter === 'ALL' ? 'bg-foreground text-background ring-foreground' : 'bg-background text-muted-foreground ring-border hover:text-foreground')}>Alle</button>
        {groups.map((g) => (
          <button key={g} onClick={() => setFilter(g)} className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium ring-1', filter === g ? 'bg-foreground text-background ring-foreground' : 'bg-background text-muted-foreground ring-border hover:text-foreground')}>{g}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((r) => (
          <div key={r.code} className="rounded-lg border border-border/60 bg-background p-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-bold text-foreground">{r.code}</code>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{r.group}</span>
              <span className="text-sm font-medium text-foreground">{r.name}</span>
            </div>
            <p className="mt-1.5 text-sm text-foreground/85">{r.meaning}</p>
            <div className="mt-1.5 rounded-md border-l-2 border-emerald-400/50 bg-emerald-50/30 px-3 py-1.5 text-sm text-foreground/85 dark:border-emerald-700/40 dark:bg-emerald-950/15">
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">Was tun: </span>
              {r.remediation}
            </div>
          </div>
        ))}
      </div>
      {sourceLabel && sourceUrl && (
        <div className="mt-3 text-xs text-muted-foreground">
          Quelle: <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{sourceLabel}</a>
        </div>
      )}
    </section>
  );
}
