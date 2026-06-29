'use client';

import Link from 'next/link';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { SapImplementationPhase } from '@/lib/queries/sap';

const COLOR_STYLES: Record<string, { bg: string; border: string; label: string; active: string }> = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-950/30',   border: 'border-blue-200 dark:border-blue-900',   label: 'text-blue-600 dark:text-blue-400',   active: 'ring-blue-400' },
  green:  { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-900', label: 'text-green-600 dark:text-green-400', active: 'ring-green-400' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-900', label: 'text-yellow-600 dark:text-yellow-400', active: 'ring-yellow-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900', label: 'text-orange-600 dark:text-orange-400', active: 'ring-orange-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-900', label: 'text-purple-600 dark:text-purple-400', active: 'ring-purple-400' },
};

interface Props {
  phases: SapImplementationPhase[];
  sectionMap: Record<string, string>;
}

export function SapImplementierungClient({ phases, sectionMap }: Props) {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const selectedPhase = phases.find(p => p.phase_nr === activePhase);
  const articleMd = selectedPhase?.md_anchor
    ? sectionMap[selectedPhase.md_anchor] ?? ''
    : '';

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">SAP</h1>
      </div>

      {/* Sub-tabs */}
      <div className="mb-8 flex gap-2">
        <Link
          href="/sap/roadmap"
          className="rounded-md bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Produktroadmap
        </Link>
        <div className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Implementierungspfade
        </div>
      </div>

      <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
        Typische Phasen — SAP Payment-Implementierung
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Klicke auf eine Phase für Details.
      </p>

      {/* Phase tiles */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-5">
        {phases.map(phase => {
          const c = COLOR_STYLES[phase.color] ?? COLOR_STYLES.blue;
          const isActive = activePhase === phase.phase_nr;
          return (
            <button
              key={phase.phase_nr}
              onClick={() => setActivePhase(isActive ? null : phase.phase_nr)}
              className={cn(
                'rounded-xl border p-4 text-left transition-all',
                c.bg, c.border,
                isActive && `ring-2 ${c.active}`
              )}
            >
              <div className={cn('mb-1 text-xs font-bold uppercase tracking-wider', c.label)}>
                Phase {phase.phase_nr}
              </div>
              <div className="text-sm font-semibold text-foreground">{phase.title}</div>
              <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {phase.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Phase detail */}
      {selectedPhase && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 border-b border-border pb-2 font-heading text-lg font-semibold text-foreground">
            Phase {selectedPhase.phase_nr}: {selectedPhase.title}
          </h3>
          {articleMd ? (
            <div className="space-y-2 text-sm text-foreground leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleMd}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Kein Artikel für diese Phase vorhanden.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
