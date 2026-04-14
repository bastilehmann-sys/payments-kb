'use client';
import { cn } from '@/lib/utils';
import type { Migration } from '@/lib/formats/types';

const TYPE_STYLE = {
  new:     'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
  changed: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  removed: 'bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200',
};

export function MigrationDiff({ migration }: { migration: Migration }) {
  const counts = {
    new: migration.changes.filter((c) => c.type === 'new').length,
    changed: migration.changes.filter((c) => c.type === 'changed').length,
    removed: migration.changes.filter((c) => c.type === 'removed').length,
  };
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <h3 className="text-base font-semibold text-foreground">Migration {migration.label}</h3>
        <span className="text-xs text-muted-foreground">{counts.new} neu · {counts.changed} geändert · {counts.removed} entfernt</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-medium">Feld</th>
              <th className="py-2 pr-3 font-medium">Vorher</th>
              <th className="py-2 pr-3 font-medium">Nachher</th>
              <th className="py-2 font-medium">Typ</th>
            </tr>
          </thead>
          <tbody>
            {migration.changes.map((c, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-2 pr-3 font-mono text-xs font-semibold text-foreground">{c.field}</td>
                <td className="py-2 pr-3 text-foreground/70">{c.oldValue}</td>
                <td className="py-2 pr-3 text-foreground/90">{c.newValue}</td>
                <td className="py-2">
                  <span className={cn('inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', TYPE_STYLE[c.type])}>
                    {c.type === 'new' ? 'neu' : c.type === 'changed' ? 'geändert' : 'entfernt'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
