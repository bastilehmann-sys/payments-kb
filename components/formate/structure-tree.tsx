'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { StructureNode, Cardinality } from '@/lib/formats/types';

const CARD_STYLE: Record<Cardinality, string> = {
  '1':    'bg-rose-100 text-rose-900 ring-rose-300 dark:bg-rose-950/40 dark:text-rose-200',
  '0..1': 'bg-muted text-muted-foreground ring-border',
  '1..N': 'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200',
  '0..N': 'bg-sky-100 text-sky-900 ring-sky-300 dark:bg-sky-950/40 dark:text-sky-200',
};

function FieldNode({ node, depth = 0, currentVersion }: { node: StructureNode; depth?: number; currentVersion?: string }) {
  const [open, setOpen] = React.useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  const isVersionNew = node.versionFlag && currentVersion && node.versionFlag === currentVersion;
  return (
    <div className={cn('border-l border-border/60 pl-4', depth === 0 && 'border-l-0 pl-0')}>
      <div className="flex items-start gap-2 py-1.5">
        {hasChildren ? (
          <button type="button" onClick={() => setOpen((o) => !o)} className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
            <svg viewBox="0 0 16 16" className={cn('size-3 transition-transform', open && 'rotate-90')} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 4l5 4-5 4" />
            </svg>
          </button>
        ) : (
          <span className="mt-0.5 inline-block size-4 shrink-0" />
        )}
        <code className={cn('rounded px-1.5 py-0.5 font-mono text-sm font-semibold', isVersionNew ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800/40' : 'bg-muted text-foreground')}>
          {node.name}
        </code>
        <span className={cn('inline-flex shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1', CARD_STYLE[node.card])}>
          {node.card}
        </span>
        {node.type && (
          <span className="hidden shrink-0 rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">{node.type}</span>
        )}
        {isVersionNew && (
          <span className="inline-flex shrink-0 rounded bg-emerald-600/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">{node.versionFlag}</span>
        )}
        <p className="min-w-0 flex-1 text-sm text-foreground/80">{node.desc}</p>
      </div>
      {hasChildren && open && (
        <div className="ml-2">
          {node.children!.map((c) => (
            <FieldNode key={c.name} node={c} depth={depth + 1} currentVersion={currentVersion} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StructureTree({ nodes, schemaUri, currentVersion }: { nodes: StructureNode[]; schemaUri?: string; currentVersion?: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="text-base font-semibold text-foreground">Nachrichtenstruktur</h3>
        {schemaUri && <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{schemaUri}</span>}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-rose-500" /> 1 = Pflicht</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-amber-500" /> 1..N = Pflicht, mehrfach</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-muted-foreground/60" /> 0..1 = Optional</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-sky-500" /> 0..N = Optional, mehrfach</span>
        {currentVersion && <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-emerald-500" /> Neu in {currentVersion}</span>}
      </div>
      <div className="space-y-2">
        {nodes.map((n) => (
          <div key={n.name} className="rounded-lg border border-border/60 bg-background p-3">
            <FieldNode node={n} depth={0} currentVersion={currentVersion} />
          </div>
        ))}
      </div>
    </section>
  );
}
