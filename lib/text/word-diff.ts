import diff from 'fast-diff';

export type DiffSegment = { type: 'equal' | 'add' | 'remove'; text: string };

export interface WordDiffResult {
  left: DiffSegment[];   // for old/A side: equal + remove
  right: DiffSegment[];  // for new/B side: equal + add
  hasChanges: boolean;
}

/**
 * Tokenises a string into an array of tokens (words + whitespace runs).
 * We keep whitespace as separate tokens so the diff result preserves spacing.
 */
function tokenise(s: string): string[] {
  return s.match(/\S+|\s+/g) ?? [];
}

/**
 * Produces a word-level diff between strings `a` (old) and `b` (new).
 *
 * Strategy:
 *   1. Tokenise both sides into words+whitespace arrays.
 *   2. Join tokens with a sentinel character (U+0000) that can never appear
 *      in real text, so fast-diff operates on the sentinel-delimited string
 *      at "word" granularity without confusing characters inside a word.
 *   3. Re-split the diff output on the sentinel and map back to segments.
 *
 * Edge cases handled:
 *   - Both empty → hasChanges: false, both arrays empty
 *   - One side empty → fully add / remove on the non-empty side
 *   - Identical strings → hasChanges: false, both arrays have one 'equal' segment
 */
export function wordDiff(a: string, b: string): WordDiffResult {
  // Edge: both empty
  if (a === '' && b === '') {
    return { left: [], right: [], hasChanges: false };
  }

  // Edge: identical
  if (a === b) {
    const seg: DiffSegment = { type: 'equal', text: a };
    return { left: [seg], right: [seg], hasChanges: false };
  }

  const SEP = '\x00'; // null character sentinel — never in normal text

  const tokensA = tokenise(a);
  const tokensB = tokenise(b);

  // Edge: one side empty
  if (tokensA.length === 0) {
    return {
      left: [],
      right: [{ type: 'add', text: b }],
      hasChanges: true,
    };
  }
  if (tokensB.length === 0) {
    return {
      left: [{ type: 'remove', text: a }],
      right: [],
      hasChanges: true,
    };
  }

  const strA = tokensA.join(SEP);
  const strB = tokensB.join(SEP);

  // fast-diff returns: Array<[type, text]> where type is -1 (remove), 0 (equal), 1 (add)
  const raw = diff(strA, strB);

  const left: DiffSegment[] = [];
  const right: DiffSegment[] = [];
  let hasChanges = false;

  for (const [op, chunk] of raw) {
    // Split the chunk back into tokens using the sentinel; filter empty strings
    const tokens = chunk.split(SEP).filter((t) => t !== '');
    const text = tokens.join('');
    if (!text) continue;

    if (op === 0) {
      // equal — appears on both sides
      left.push({ type: 'equal', text });
      right.push({ type: 'equal', text });
    } else if (op === -1) {
      // removed from A
      left.push({ type: 'remove', text });
      hasChanges = true;
    } else {
      // added in B
      right.push({ type: 'add', text });
      hasChanges = true;
    }
  }

  return { left, right, hasChanges };
}
