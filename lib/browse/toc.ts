export interface TocEntry {
  level: 2 | 3;
  text: string;
  slug: string;
}

function githubSlugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function extractToc(contentMd: string): TocEntry[] {
  const lines = contentMd.split('\n');
  const toc: TocEntry[] = [];

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);
    if (h3) {
      toc.push({ level: 3, text: h3[1].trim(), slug: githubSlugify(h3[1].trim()) });
    } else if (h2) {
      toc.push({ level: 2, text: h2[1].trim(), slug: githubSlugify(h2[1].trim()) });
    }
  }

  return toc;
}
