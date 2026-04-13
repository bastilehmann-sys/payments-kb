import { XMLParser } from 'fast-xml-parser';

export interface SchemaDiff {
  added: string[];   // paths present in B but not A
  removed: string[]; // paths present in A but not B
  common: string[];  // paths in both
  total: { a: number; b: number };
}

/** Extract all element paths from an XML string. */
export function extractPaths(xml: string): string[] {
  const parser = new XMLParser({ ignoreAttributes: true, removeNSPrefix: true });
  let parsed: unknown;
  try {
    parsed = parser.parse(xml);
  } catch {
    return [];
  }
  const paths = new Set<string>();

  function walk(node: unknown, path: string) {
    if (!node || typeof node !== 'object') return;
    for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
      if (key.startsWith('?') || key.startsWith('@')) continue;
      const newPath = path ? `${path}/${key}` : key;
      paths.add(newPath);
      if (Array.isArray(val)) {
        for (const item of val) walk(item, newPath);
      } else if (typeof val === 'object' && val !== null) {
        walk(val, newPath);
      }
    }
  }

  walk(parsed, '');
  return Array.from(paths).sort();
}

export function schemaDiff(xmlA: string, xmlB: string): SchemaDiff {
  const pathsA = new Set(extractPaths(xmlA));
  const pathsB = new Set(extractPaths(xmlB));
  const added   = [...pathsB].filter((p) => !pathsA.has(p)).sort();
  const removed = [...pathsA].filter((p) => !pathsB.has(p)).sort();
  const common  = [...pathsA].filter((p) =>  pathsB.has(p)).sort();
  return { added, removed, common, total: { a: pathsA.size, b: pathsB.size } };
}
