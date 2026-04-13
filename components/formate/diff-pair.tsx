'use client';

import React from 'react';
import { wordDiff } from '@/lib/text/word-diff';
import type { DiffSegment } from '@/lib/text/word-diff';

interface DiffPairProps {
  left: string;
  right: string;
  side: 'left' | 'right';
  showDiff?: boolean;
}

function renderSegments(segs: DiffSegment[]) {
  return segs.map((s, i) => {
    if (s.type === 'equal') {
      return <span key={i}>{s.text}</span>;
    }
    if (s.type === 'remove') {
      return (
        <span
          key={i}
          className="bg-red-500/20 text-red-700 dark:text-red-400 line-through rounded px-0.5"
        >
          {s.text}
        </span>
      );
    }
    // add
    return (
      <span
        key={i}
        className="bg-green-500/20 text-green-700 dark:text-green-400 rounded px-0.5"
      >
        {s.text}
      </span>
    );
  });
}

/**
 * Renders one side of a word-level diff.
 *
 * Use `side="left"` in the Format A column and `side="right"` in Format B.
 * Both instances are called with the same `left`/`right` strings — the diff
 * is computed independently per render (memoised).
 *
 * When `showDiff` is false or both strings are identical (`hasChanges: false`)
 * the component falls back to plain text — no colour, no strikethrough.
 */
export function DiffPair({ left, right, side, showDiff = true }: DiffPairProps) {
  const result = React.useMemo(() => wordDiff(left, right), [left, right]);
  const { hasChanges } = result;

  const value = side === 'left' ? left : right;
  const segs = side === 'left' ? result.left : result.right;

  // No changes or diff is toggled off → plain text
  if (!hasChanges || !showDiff) {
    return (
      <span className="break-words leading-relaxed whitespace-pre-wrap">
        {value || <span className="text-muted-foreground/40">—</span>}
      </span>
    );
  }

  // With diff
  return (
    <span className="break-words leading-relaxed whitespace-pre-wrap">
      {segs.length > 0
        ? renderSegments(segs)
        : <span className="text-muted-foreground/40">—</span>}
    </span>
  );
}
