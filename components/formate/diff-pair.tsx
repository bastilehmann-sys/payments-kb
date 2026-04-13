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
          className="bg-red-200 dark:bg-red-900/60 text-red-900 dark:text-red-200 font-medium line-through rounded px-1 py-0.5"
        >
          {s.text}
        </span>
      );
    }
    // add
    return (
      <span
        key={i}
        className="bg-green-200 dark:bg-green-900/60 text-green-900 dark:text-green-200 font-medium rounded px-1 py-0.5"
      >
        {s.text}
      </span>
    );
  });
}

/** Split text into paragraphs/lines, preserving empty lines as separators */
function splitLines(text: string): string[] {
  return text.split(/\n/);
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
 *
 * Multi-line behaviour:
 * - If there are diffs AND multiple lines, each line is diffed separately
 *   with a thin divider between lines.
 * - If there are NO diffs but text is long (>300 chars), it collapses to a
 *   summary with an expand button.
 */
export function DiffPair({ left, right, side, showDiff = true }: DiffPairProps) {
  const result = React.useMemo(() => wordDiff(left, right), [left, right]);
  const { hasChanges } = result;

  const value = side === 'left' ? left : right;

  // ── Collapse long identical values ──────────────────────────────────────────
  const [expanded, setExpanded] = React.useState(false);
  const lines = splitLines(value);
  const isLong = value.length > 300;
  const isMultiLine = lines.length > 1;

  // No changes or diff is toggled off → plain text (possibly collapsed)
  if (!hasChanges || !showDiff) {
    if (!isLong || expanded) {
      return (
        <span className="break-words leading-relaxed whitespace-pre-wrap">
          {value || <span className="text-muted-foreground/40">—</span>}
        </span>
      );
    }
    // Collapse long identical content
    const lineCount = lines.length;
    return (
      <span className="break-words leading-relaxed">
        <span className="text-muted-foreground/50 text-xs italic">
          Gleicher Inhalt ({lineCount} Zeile{lineCount !== 1 ? 'n' : ''})
        </span>
        <button
          onClick={() => setExpanded(true)}
          className="ml-2 text-xs text-primary/70 hover:text-primary underline underline-offset-2"
        >
          Anzeigen
        </button>
      </span>
    );
  }

  // ── With diff ────────────────────────────────────────────────────────────────
  const segs = side === 'left' ? result.left : result.right;

  if (segs.length === 0) {
    return (
      <span className="break-words leading-relaxed whitespace-pre-wrap">
        <span className="text-muted-foreground/40">—</span>
      </span>
    );
  }

  // Multi-line: split value by newline, diff each line separately
  if (isMultiLine) {
    const leftLines = splitLines(left);
    const rightLines = splitLines(right);
    const maxLen = Math.max(leftLines.length, rightLines.length);

    return (
      <span className="break-words leading-relaxed block space-y-1">
        {Array.from({ length: maxLen }, (_, idx) => {
          const lineLeft = leftLines[idx] ?? '';
          const lineRight = rightLines[idx] ?? '';
          const lineResult = wordDiff(lineLeft, lineRight);
          const lineSegs = side === 'left' ? lineResult.left : lineResult.right;
          const lineValue = side === 'left' ? lineLeft : lineRight;

          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <hr className="border-t border-border/30 my-0.5" />
              )}
              <span className="block whitespace-pre-wrap">
                {lineResult.hasChanges
                  ? (lineSegs.length > 0 ? renderSegments(lineSegs) : <span className="text-muted-foreground/40">—</span>)
                  : (lineValue || <span className="text-muted-foreground/40">—</span>)
                }
              </span>
            </React.Fragment>
          );
        })}
      </span>
    );
  }

  // Single-line diff
  return (
    <span className="break-words leading-relaxed whitespace-pre-wrap">
      {renderSegments(segs)}
    </span>
  );
}
