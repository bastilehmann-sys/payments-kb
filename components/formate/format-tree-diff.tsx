'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { parseXmlTree } from '@/lib/xml/xml-tree';
import { diffTrees, countByKind } from '@/lib/xml/tree-diff';
import type { DiffNode, DiffKind } from '@/lib/xml/tree-diff';

// ─── Tree glyph helpers ───────────────────────────────────────────────────────

function buildGlyph(prefixes: boolean[], isLast: boolean): string {
  // prefixes: true = parent had more siblings (draw │), false = parent was last
  const parts = prefixes.map((hasMore) => (hasMore ? '│   ' : '    '));
  const connector = isLast ? '└─ ' : '├─ ';
  return parts.join('') + connector;
}

// ─── Line styling ─────────────────────────────────────────────────────────────

function lineClasses(kind: DiffKind, side: 'left' | 'right', isPlaceholder: boolean): string {
  if (isPlaceholder) {
    return 'text-muted-foreground/25 italic select-none';
  }
  if (kind === 'only-a' && side === 'left') {
    return 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200';
  }
  if (kind === 'only-b' && side === 'right') {
    return 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200';
  }
  // same — or the "ghost" of the opposite side rendered as placeholder
  return 'text-foreground/80';
}

// ─── Single node row ──────────────────────────────────────────────────────────

interface NodeRowProps {
  node: DiffNode;
  side: 'left' | 'right';
  prefixes: boolean[];
  isLast: boolean;
  collapsed: Set<string>;
  onToggle: (path: string) => void;
}

function NodeRow({ node, side, prefixes, isLast, collapsed, onToggle }: NodeRowProps) {
  const glyph  = node.depth === 0 ? '' : buildGlyph(prefixes, isLast);
  const isPlaceholder =
    (side === 'left'  && node.kind === 'only-b') ||
    (side === 'right' && node.kind === 'only-a');

  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed.has(node.path);
  const label = isPlaceholder
    ? `(nicht in ${side === 'left' ? 'A' : 'B'})`
    : node.name + (hasChildren ? '/' : '');

  const lineClass = lineClasses(node.kind, side, isPlaceholder);

  return (
    <>
      <div
        className={cn(
          'flex items-baseline gap-0 px-2 py-[1px] leading-5 min-h-[20px]',
          lineClass,
          hasChildren && !isPlaceholder && 'cursor-pointer hover:opacity-80',
        )}
        onClick={hasChildren && !isPlaceholder ? () => onToggle(node.path) : undefined}
        title={isPlaceholder ? undefined : node.path}
      >
        {/* Glyph */}
        {glyph && (
          <span className="shrink-0 select-none font-mono text-[10px] text-muted-foreground/40 mr-0.5 whitespace-pre">
            {glyph}
          </span>
        )}
        {/* Name */}
        <span className="font-mono text-xs truncate">
          {hasChildren && !isPlaceholder && (
            <span className="mr-0.5 text-muted-foreground/50">{isCollapsed ? '▶ ' : '▼ '}</span>
          )}
          {label}
        </span>
      </div>

      {/* Recurse into children */}
      {hasChildren && !isCollapsed && !isPlaceholder &&
        node.children.map((child, idx) => {
          const childIsLast = idx === node.children.length - 1;
          const childPrefixes = node.depth === 0 ? [] : [...prefixes, !isLast];
          return (
            <NodeRow
              key={child.path}
              node={child}
              side={side}
              prefixes={childPrefixes}
              isLast={childIsLast}
              collapsed={collapsed}
              onToggle={onToggle}
            />
          );
        })}
    </>
  );
}

// ─── One side panel ───────────────────────────────────────────────────────────

interface TreePanelProps {
  root: DiffNode;
  side: 'left' | 'right';
  label: string;
  formatLabel: string;
  collapsed: Set<string>;
  onToggle: (path: string) => void;
  isB?: boolean;
}

function TreePanel({ root, side, label, formatLabel, collapsed, onToggle, isB }: TreePanelProps) {
  return (
    <div className={cn('flex flex-col', isB && 'border-l border-border')}>
      {/* Panel header */}
      <div className={cn(
        'shrink-0 px-4 py-2 border-b border-border',
        isB ? 'bg-blue-500/5' : 'bg-primary/5',
      )}>
        <div className={cn(
          'text-[10px] font-semibold uppercase tracking-wider',
          isB ? 'text-blue-500/70' : 'text-primary/70',
        )}>
          {label}
        </div>
        <div className="font-mono text-sm font-bold text-foreground truncate">{formatLabel}</div>
      </div>

      {/* Tree rows */}
      <div className="overflow-x-auto">
        <NodeRow
          node={root}
          side={side}
          prefixes={[]}
          isLast
          collapsed={collapsed}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface FormatTreeDiffProps {
  sampleA?: string | null;   // URL like /samples/formate/pain.001.001.03.xml
  sampleB?: string | null;
  labelA?: string;
  labelB?: string;
}

function isXmlUrl(url?: string | null): boolean {
  return !!url && url.toLowerCase().endsWith('.xml');
}

export function FormatTreeDiff({ sampleA, sampleB, labelA = 'Format A', labelB = 'Format B' }: FormatTreeDiffProps) {
  const [xmlA, setXmlA] = React.useState<string | null>(null);
  const [xmlB, setXmlB] = React.useState<string | null>(null);
  const [loadingA, setLoadingA] = React.useState(false);
  const [loadingB, setLoadingB] = React.useState(false);
  const [errorA, setErrorA] = React.useState<string | null>(null);
  const [errorB, setErrorB] = React.useState<string | null>(null);
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());

  const bothXml = isXmlUrl(sampleA) && isXmlUrl(sampleB);

  // Fetch A
  React.useEffect(() => {
    if (!isXmlUrl(sampleA)) { setXmlA(null); return; }
    let cancelled = false;
    setLoadingA(true);
    setErrorA(null);
    fetch(sampleA!)
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.text(); })
      .then((text) => { if (!cancelled) { setXmlA(text); setLoadingA(false); } })
      .catch((e: unknown) => { if (!cancelled) { setErrorA(String(e)); setLoadingA(false); } });
    return () => { cancelled = true; };
  }, [sampleA]);

  // Fetch B
  React.useEffect(() => {
    if (!isXmlUrl(sampleB)) { setXmlB(null); return; }
    let cancelled = false;
    setLoadingB(true);
    setErrorB(null);
    fetch(sampleB!)
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.text(); })
      .then((text) => { if (!cancelled) { setXmlB(text); setLoadingB(false); } })
      .catch((e: unknown) => { if (!cancelled) { setErrorB(String(e)); setLoadingB(false); } });
    return () => { cancelled = true; };
  }, [sampleB]);

  // Parse + diff
  const diffResult = React.useMemo(() => {
    if (!xmlA || !xmlB) return null;
    const treeA = parseXmlTree(xmlA);
    const treeB = parseXmlTree(xmlB);
    return diffTrees(treeA, treeB);
  }, [xmlA, xmlB]);

  const stats = React.useMemo(() => {
    if (!diffResult) return null;
    // Count from left tree (same+onlyA+onlyB all present there)
    return countByKind(diffResult.left);
  }, [diffResult]);

  function toggleCollapse(path: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function collapseAll() {
    if (!diffResult) return;
    const paths = new Set<string>();
    function collect(node: DiffNode) {
      if (node.children.length > 0) paths.add(node.path);
      for (const c of node.children) collect(c);
    }
    collect(diffResult.left);
    setCollapsed(paths);
  }

  function expandAll() {
    setCollapsed(new Set());
  }

  // ── Non-XML fallback ──
  if (!bothXml) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground/70 italic">
        Baum-Diff nur für XML-Formate verfügbar. Siehe Metadaten-Vergleich unten.
      </div>
    );
  }

  // ── Loading / error states ──
  if (loadingA || loadingB) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground/60 animate-pulse">
        XML wird geladen…
      </div>
    );
  }
  if (errorA || errorB) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
        Fehler beim Laden: {errorA ?? errorB}
      </div>
    );
  }
  if (!diffResult) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground/60">
        Wähle zwei XML-Formate aus.
      </div>
    );
  }

  const nameA = sampleA?.split('/').pop()?.replace('.xml', '') ?? labelA;
  const nameB = sampleB?.split('/').pop()?.replace('.xml', '') ?? labelB;

  return (
    <div className="flex flex-col gap-2">
      {/* Stats + controls bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {stats && (
          <>
            {stats.onlyA > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                <span className="font-mono">−</span>{stats.onlyA} nur in A
              </span>
            )}
            {stats.onlyB > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                <span className="font-mono">+</span>{stats.onlyB} nur in B
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {stats.same} gemeinsame Elemente
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={expandAll}
            className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            Alle aufklappen
          </button>
          <button
            onClick={collapseAll}
            className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            Alle einklappen
          </button>
        </div>
      </div>

      {/* Side-by-side trees — panels scroll together on the outer wrapper */}
      <div
        className="grid grid-cols-2 rounded-lg border border-border bg-background overflow-auto"
        style={{ maxHeight: 'calc(100vh - 240px)' }}
      >
        <TreePanel
          root={diffResult.left}
          side="left"
          label="Format A"
          formatLabel={nameA}
          collapsed={collapsed}
          onToggle={toggleCollapse}
        />
        <TreePanel
          root={diffResult.right}
          side="right"
          label="Format B"
          formatLabel={nameB}
          collapsed={collapsed}
          onToggle={toggleCollapse}
          isB
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-200 dark:bg-red-900/60" />
          Nur in A vorhanden
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-200 dark:bg-green-900/60" />
          Nur in B vorhanden
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-foreground/10" />
          In beiden vorhanden
        </span>
        <span className="flex items-center gap-1.5 italic">
          (nicht in A/B) = Platzhalter für gegenüberliegende Seite
        </span>
      </div>
    </div>
  );
}
