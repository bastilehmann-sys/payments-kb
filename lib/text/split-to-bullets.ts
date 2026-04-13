/**
 * Shared bullet-splitting utility.
 *
 * Rules (in priority order):
 *  1. Numbered list  — "1) Foo 2) Bar" or "1. Foo 2. Bar"
 *  2. Bullet chars   — • · ● ▪ – —
 *  3. Dash-separated — " - " (space-hyphen-space) appearing 2+ times
 *  4. ALL-CAPS topic — NEU: / GEÄNDERT: / ENTFERNT: etc. appear 2+ times
 *  5. Long-sentence  — length > 300, 3+ sentence boundaries ". [A-Z]"
 *  6. Colon-sections — length > 400, 3+ "Word: text" micro-sections
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SplitResult =
  | { kind: 'none'; text: string }
  | { kind: 'list'; items: string[]; intro?: string };

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Abbreviations that should NOT trigger a sentence split. */
const ABBREV_BLACKLIST = [
  'z.B', 'etc', 'ggf', 'bzw', 'o.ä', 'd.h', 'vs', 'Abs', 'Art',
  'u.a', 'u.U', 'i.d.R', 'sog', 'inkl', 'exkl', 'max', 'min',
  'ca', 'Nr', 'Str', 'vgl',
];

/**
 * ALL-CAPS keywords that mark topic-starts in German payment-format prose.
 * Order matters — longer variants before shorter (NEU! before NEU).
 */
const TOPIC_KEYWORDS = [
  'NEU!', 'ENTFERNT!', 'NICHT ÄNDERN',
  'NEU', 'GEÄNDERT', 'ENTFERNT', 'ERWEITERT',
  'PFLICHT', 'OPTIONAL', 'WICHTIG', 'HINWEIS', 'UPDATE',
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Validate a candidate list: >= minItems items, avg length >= minAvg chars. */
function isValid(items: string[], minItems = 2, minAvg = 15): boolean {
  if (items.length < minItems) return false;
  const avg = items.reduce((s, x) => s + x.length, 0) / items.length;
  return avg >= minAvg;
}

function clean(parts: string[]): string[] {
  return parts.map((s) => s.trim()).filter(Boolean);
}

// ─── Rule 1: Numbered list ─────────────────────────────────────────────────────

function tryNumbered(text: string): string[] | null {
  const rx = /(?:^|\s)\d+[).]\s+(?=[A-Za-zÄÖÜäöüß])/g;
  const matches = [...text.matchAll(rx)];
  if (matches.length < 2) return null;
  const parts = clean(text.split(/\s*\d+[).]\s+(?=[A-Za-zÄÖÜäöüß])/));
  return isValid(parts) ? parts : null;
}

// ─── Rule 2: Bullet characters ─────────────────────────────────────────────────

function tryBulletChars(text: string): string[] | null {
  const parts = clean(text.split(/\s*[•·●▪–—]\s+/));
  return parts.length >= 2 && isValid(parts) ? parts : null;
}

// ─── Rule 3: Dash-separated list ───────────────────────────────────────────────

function tryDashSeparated(text: string): { items: string[]; intro?: string } | null {
  // Require at least 2 occurrences of " - "
  const occurrences = (text.match(/ - /g) ?? []).length;
  if (occurrences < 2) return null;

  const raw = clean(text.split(/ - /));
  if (raw.length < 3) return null; // too few — likely "Foo - Bar" range
  if (!isValid(raw)) return null;

  // If first part ends with ":" treat it as an intro paragraph
  if (raw[0].endsWith(':')) {
    const [intro, ...items] = raw;
    return isValid(items) ? { items, intro } : null;
  }

  return { items: raw };
}

// ─── Rule 4: ALL-CAPS topic split ──────────────────────────────────────────────

function tryTopicKeywords(text: string): string[] | null {
  // Build a regex that matches any keyword followed by : or !
  // We look for \s<KEYWORD>[!:] patterns
  const keywordPattern = TOPIC_KEYWORDS
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  // Split positions: find "KEYWORD:" or "KEYWORD!" preceded by whitespace (or at start)
  const splitRx = new RegExp(`(?<=\\s|^)(${keywordPattern})[!:]`, 'g');
  const matchPositions: number[] = [];
  let m: RegExpExecArray | null;

  const testRx = new RegExp(`(\\s|^)(${keywordPattern})[!:]`, 'g');
  while ((m = testRx.exec(text)) !== null) {
    // m.index is the start; the keyword starts after any leading whitespace
    const keywordStart = m.index + (m[1] === '' ? 0 : m[1].length);
    matchPositions.push(keywordStart);
  }

  if (matchPositions.length < 2) return null;

  // Split text at each keyword position
  const parts: string[] = [];
  let prev = 0;
  for (const pos of matchPositions) {
    const chunk = text.slice(prev, pos).trim();
    if (chunk) parts.push(chunk);
    prev = pos;
  }
  // last segment
  const tail = text.slice(prev).trim();
  if (tail) parts.push(tail);

  // Filter out a short leading non-keyword intro (< 20 chars)
  let result = parts;
  if (result.length > 1 && result[0].length < 20 && !TOPIC_KEYWORDS.some((k) => result[0].startsWith(k))) {
    result = result.slice(1);
  }

  return isValid(result) ? result : null;
}

// ─── Rule 5: Long-sentence split ───────────────────────────────────────────────

/**
 * Build a regex that splits on ". " followed by an uppercase letter,
 * but NOT when the preceding token is a known abbreviation.
 */
function trySentenceSplit(text: string): string[] | null {
  if (text.length <= 300) return null;

  // Find all ". [A-ZÄÖÜ]" positions that are NOT abbreviations
  const sentRx = /\.\s+(?=[A-ZÄÖÜ])/g;
  const splitPositions: number[] = [];
  let ms: RegExpExecArray | null;

  while ((ms = sentRx.exec(text)) !== null) {
    const beforeDot = text.slice(0, ms.index);
    // Check if the word before the dot is an abbreviation
    const wordMatch = beforeDot.match(/(\S+)$/);
    const lastWord = wordMatch ? wordMatch[1] : '';
    const isAbbrev = ABBREV_BLACKLIST.some((abbr) => lastWord === abbr || lastWord.endsWith('.' + abbr) || lastWord === abbr + '.');
    if (!isAbbrev) {
      splitPositions.push(ms.index);
    }
  }

  if (splitPositions.length < 2) return null; // need 3+ sentences = 2+ splits

  // Reconstruct parts
  const parts: string[] = [];
  let prev = 0;
  for (const pos of splitPositions) {
    // Include the period in the current part
    const chunk = text.slice(prev, pos + 1).trim();
    if (chunk) parts.push(chunk);
    prev = pos + 2; // skip ". "
  }
  const tail = text.slice(prev).trim();
  if (tail) parts.push(tail);

  return isValid(parts, 3, 20) ? parts : null;
}

// ─── Rule 6: Colon-section split ───────────────────────────────────────────────

function tryColonSections(text: string): string[] | null {
  if (text.length <= 400) return null;

  // Pattern: one or more words starting with uppercase, followed by ": "
  // e.g. "SAP-Implikation: ...", "Standard-DMEE: ..."
  const colonRx = /(?:^|\s)([A-ZÄÖÜ][^\s:]{1,30}(?:\s[A-ZÄÖÜ][^\s:]{0,20})?)\s*:\s+(?=[A-Za-zÄÖÜäöüß0-9])/g;
  const matchPositions: number[] = [];
  let mc: RegExpExecArray | null;

  while ((mc = colonRx.exec(text)) !== null) {
    // position of the capitalised word
    const wordStart = mc.index + (mc[0].startsWith(' ') ? 1 : 0);
    matchPositions.push(wordStart);
  }

  if (matchPositions.length < 3) return null;

  const parts: string[] = [];
  let prev = 0;
  for (const pos of matchPositions) {
    const chunk = text.slice(prev, pos).trim();
    if (chunk) parts.push(chunk);
    prev = pos;
  }
  const tail = text.slice(prev).trim();
  if (tail) parts.push(tail);

  return isValid(parts, 3, 15) ? parts : null;
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function splitToBullets(text: string): SplitResult {
  if (!text) return { kind: 'none', text };

  // Rule 1
  const numbered = tryNumbered(text);
  if (numbered) return { kind: 'list', items: numbered };

  // Rule 2
  const bulletChars = tryBulletChars(text);
  if (bulletChars) return { kind: 'list', items: bulletChars };

  // Rule 3
  const dashed = tryDashSeparated(text);
  if (dashed) return { kind: 'list', items: dashed.items, intro: dashed.intro };

  // Rule 4
  const topics = tryTopicKeywords(text);
  if (topics) return { kind: 'list', items: topics };

  // Rule 5
  const sentences = trySentenceSplit(text);
  if (sentences) return { kind: 'list', items: sentences };

  // Rule 6
  const colons = tryColonSections(text);
  if (colons) return { kind: 'list', items: colons };

  return { kind: 'none', text };
}
