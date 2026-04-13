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
  // Much more conservative: only triggers on long analytical prose with
  // clearly distinct topic-sections, not on data listings like "Feiertage: ... Mailand: ... Rom: ..."
  if (text.length <= 600) return null;

  // Skip if text has lots of inline numerical data (dates, amounts) — suggests data listing, not prose
  const dataLikePattern = /\d{1,2}[.:]\d{1,2}/g;
  const dataHits = (text.match(dataLikePattern) ?? []).length;
  if (dataHits > 3) return null;

  const colonRx = /(?:^|\s)([A-ZÄÖÜ][^\s:]{1,30}(?:\s[A-ZÄÖÜ][^\s:]{0,20})?)\s*:\s+(?=[A-Za-zÄÖÜäöüß0-9])/g;
  const matchPositions: number[] = [];
  let mc: RegExpExecArray | null;

  while ((mc = colonRx.exec(text)) !== null) {
    const wordStart = mc.index + (mc[0].startsWith(' ') ? 1 : 0);
    matchPositions.push(wordStart);
  }

  // Require 4+ markers (was 3)
  if (matchPositions.length < 4) return null;

  const parts: string[] = [];
  let prev = 0;
  for (const pos of matchPositions) {
    const chunk = text.slice(prev, pos).trim();
    if (chunk) parts.push(chunk);
    prev = pos;
  }
  const tail = text.slice(prev).trim();
  if (tail) parts.push(tail);

  // Require minimum 40 chars avg (was 15) — short data fields like "Mailand: 07.12 (X)" won't pass
  return isValid(parts, 4, 40) ? parts : null;
}

// ─── Sub-topic splitting ───────────────────────────────────────────────────────

export type SubtopicResult =
  | { kind: 'plain' }
  | { kind: 'subtopics'; intro: string; topics: { label: string; body: string }[] };

/**
 * Within a single bullet item, detect 2+ ALL-CAPS topic markers like:
 *   "SAP-Implikation:", "NEU PRO VERSION:", "GEÄNDERT:", "ERWEITERT:", etc.
 *
 * Pattern: a phrase whose first word starts uppercase, ends with ":" or "!",
 * and the whole match is at least 3 chars. The first word may contain hyphens
 * and digits (e.g. "SAP-Implikation"). Multi-word labels like "NEU PRO VERSION:"
 * are captured by allowing spaces between words up to 5 words / 50 chars total.
 *
 * Returns the intro text (before the first marker) and an array of { label, body }.
 * Returns { kind: 'plain' } when fewer than 2 markers are found.
 */
export function splitIntoSubtopics(text: string): SubtopicResult {
  if (!text) return { kind: 'plain' };

  // Match: (optional leading spaces) then a capitalised label ending with : or !
  // Label rules:
  //   - starts with uppercase letter or digit+uppercase (e.g. "SAP-Implikation")
  //   - may contain hyphens, slashes, digits, spaces (up to ~50 chars)
  //   - ends with ':' or '!' (NOT preceded by lowercase run that looks like normal prose)
  //   - must be followed by a space or end of string
  //
  // We use a positive-lookahead approach: look for patterns where the WHOLE
  // label is ≤ 6 words and ≤ 55 chars and contains no lowercase-only words
  // (pure lowercase words would indicate normal prose rather than a marker).
  //
  // Implementation: find all occurrences of the pattern, require ≥ 2 matches.

  const markerRx = /(?:^|(?<=\s))([A-ZÄÖÜ0-9][A-Za-zÄÖÜäöüß0-9\-\/\(\)]{0,20}(?:\s+[A-ZÄÖÜ0-9][A-Za-zÄÖÜäöüß0-9\-\/]{0,20}){0,4})[!:]\s/g;

  const matches: Array<{ index: number; label: string }> = [];
  let m: RegExpExecArray | null;

  while ((m = markerRx.exec(text)) !== null) {
    // Reject if label contains a purely lowercase word (suggests normal prose colon, e.g. "z.B.: text")
    const label = m[1];
    const words = label.split(/\s+/);
    const hasPureLowerWord = words.some(
      (w) => w.length >= 3 && w === w.toLowerCase() && /[a-zäöü]/.test(w[0]),
    );
    if (hasPureLowerWord) continue;

    // The match starts after the leading whitespace captured in lookbehind
    // m.index is position of the full match start; label starts there (lookbehind is zero-width)
    matches.push({ index: m.index, label });
  }

  if (matches.length < 2) return { kind: 'plain' };

  // Extract intro = text before first marker
  const intro = text.slice(0, matches[0].index).trim();

  const topics: { label: string; body: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const { index, label } = matches[i];
    const afterMarker = index + label.length + 2; // +2 for the ":" / "!" and space
    const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const body = text.slice(afterMarker, bodyEnd).trim();
    topics.push({ label, body });
  }

  return { kind: 'subtopics', intro, topics };
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
