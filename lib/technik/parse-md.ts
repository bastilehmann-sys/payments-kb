/**
 * Extracts the content of a top-level H2 section (## slug) from a markdown file.
 * Returns null if the slug is not found.
 */
export function extractSection(md: string, slug: string): string | null {
  if (!md.trim()) return null;

  const lines = md.split('\n');
  const headerPattern = new RegExp(`^##\\s+${slug}\\s*$`, 'i');

  let inSection = false;
  const sectionLines: string[] = [];

  for (const line of lines) {
    if (inSection) {
      // Stop at next H2 (but not H3+)
      if (/^##\s+/.test(line) && !/^###/.test(line)) break;
      sectionLines.push(line);
    } else if (headerPattern.test(line)) {
      inSection = true;
    }
  }

  if (!inSection) return null;
  return sectionLines.join('\n').trim() || null;
}
