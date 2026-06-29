import fs from 'node:fs';

export function extractSection(md: string, section: string): string {
  const lines = md.split('\n');
  let inSection = false;
  let sectionLevel = 2;
  const result: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3}) (.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      if (!inSection && title.toLowerCase().includes(section.toLowerCase())) {
        inSection = true;
        sectionLevel = level;
      } else if (inSection && level <= sectionLevel) {
        break;
      }
    }
    if (inSection) result.push(line);
  }

  return result.join('\n');
}

export function replaceSection(md: string, section: string, newContent: string): string {
  const lines = md.split('\n');
  let sectionStart = -1;
  let sectionEnd = lines.length;
  let sectionLevel = 2;

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^(#{1,3}) (.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      if (sectionStart === -1 && title.toLowerCase().includes(section.toLowerCase())) {
        sectionStart = i;
        sectionLevel = level;
      } else if (sectionStart !== -1 && level <= sectionLevel) {
        sectionEnd = i;
        break;
      }
    }
  }

  if (sectionStart === -1) {
    return md.trimEnd() + '\n\n' + newContent;
  }

  const before = lines.slice(0, sectionStart).join('\n');
  const after = lines.slice(sectionEnd).join('\n');
  return [before.trimEnd(), newContent, after.trimStart()].filter(Boolean).join('\n\n');
}

export function getNextFileIndex(contentDir: string): string {
  const files = fs.readdirSync(contentDir).filter(f => /^gpdb_\d{2}_/.test(f));
  if (files.length === 0) return '08';
  const indices = files.map(f => parseInt(f.match(/^gpdb_(\d{2})_/)![1], 10));
  return String(Math.max(...indices) + 1).padStart(2, '0');
}
