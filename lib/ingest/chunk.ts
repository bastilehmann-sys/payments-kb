/**
 * chunkMarkdown — splits a markdown string into semantic chunks.
 *
 * Strategy:
 *  1. Split on H2 headings (`## `).
 *  2. If any H2 block exceeds 1500 chars, further split on H3 headings (`### `).
 *  3. Content before the first H2 is preserved as chunk 0, heading = first H1 found (or "").
 *  4. Filter out chunks whose content (beyond the heading line) is empty/whitespace only.
 *  5. chunk_index is a running counter starting at 0.
 */

export interface Chunk {
  heading: string;
  chunk_index: number;
  content: string;
}

const H2_RE = /^## (.+)$/m;
const H3_RE = /^### (.+)$/m;
const H1_RE = /^# (.+)$/m;

/**
 * Extract the heading text from a block that starts with a heading line.
 * Returns empty string if no heading found.
 */
function extractHeading(block: string, re: RegExp): string {
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

/**
 * Split text by a regex that matches heading lines (lines starting with `## ` or `### `).
 * The heading line is kept at the start of each resulting segment.
 */
function splitByHeading(text: string, prefix: string): string[] {
  // Split lines, then group by heading
  const lines = text.split('\n');
  const segments: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.startsWith(prefix) && current.length > 0) {
      segments.push(current.join('\n'));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    segments.push(current.join('\n'));
  }
  return segments;
}

/**
 * Returns true if a block has meaningful content beyond its heading line.
 */
function hasContent(block: string): boolean {
  const lines = block.split('\n');
  // Skip first line (the heading itself) and check if remaining has non-whitespace
  const body = lines.slice(1).join('\n').trim();
  return body.length > 0;
}

export function chunkMarkdown(md: string): Chunk[] {
  if (!md || md.trim().length === 0) return [];

  const chunks: Chunk[] = [];
  let idx = 0;

  // Split by H2
  const h2Segments = splitByHeading(md, '## ');

  for (let i = 0; i < h2Segments.length; i++) {
    const segment = h2Segments[i];

    if (i === 0) {
      // This is preamble (content before the first H2, or the first H2 itself if the doc starts with one)
      if (segment.startsWith('## ')) {
        // Doc starts with H2 — fall through to normal processing below
        // (handled by the else branch — but we re-enter with the check)
      } else {
        // Preamble — use H1 text as heading
        if (!hasContent(segment)) continue;
        const h1Match = segment.match(H1_RE);
        const heading = h1Match ? h1Match[1].trim() : '';
        chunks.push({ heading, chunk_index: idx++, content: segment.trimEnd() });
        continue;
      }
    }

    // Segment starts with ## heading
    if (segment.trim().length === 0) continue;

    const h2Heading = extractHeading(segment, H2_RE);

    if (segment.length > 1500) {
      // Try to split further by H3
      const h3Segments = splitByHeading(segment, '### ');

      if (h3Segments.length > 1) {
        // First h3Segment is the H2 block before any H3 — it becomes the H2 chunk if non-empty
        const [h2Preamble, ...h3Rest] = h3Segments;
        if (hasContent(h2Preamble)) {
          chunks.push({ heading: h2Heading, chunk_index: idx++, content: h2Preamble.trimEnd() });
        }
        for (const h3Seg of h3Rest) {
          if (!hasContent(h3Seg)) continue;
          const h3Heading = extractHeading(h3Seg, H3_RE);
          chunks.push({ heading: h3Heading, chunk_index: idx++, content: h3Seg.trimEnd() });
        }
        continue;
      }
    }

    // Normal H2 chunk (fits within 1500 chars, or no H3s found)
    if (!hasContent(segment)) continue;
    chunks.push({ heading: h2Heading, chunk_index: idx++, content: segment.trimEnd() });
  }

  return chunks;
}
