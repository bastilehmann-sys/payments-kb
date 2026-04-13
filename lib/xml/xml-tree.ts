import { XMLParser } from 'fast-xml-parser';

export interface TreeNode {
  name: string;     // element tag name
  path: string;     // full path like "Document/CstmrCdtTrfInitn/GrpHdr"
  children: TreeNode[];
  depth: number;
}

/** Parse an XML string into a deduplicated tree (structure only, no repeated siblings). */
export function parseXmlTree(xml: string): TreeNode | null {
  const parser = new XMLParser({
    ignoreAttributes: true,
    removeNSPrefix: true,
    isArray: () => false,
  });

  let parsed: unknown;
  try {
    parsed = parser.parse(xml);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;

  const root = parsed as Record<string, unknown>;
  // Find the actual root element (skip ?xml etc.)
  const rootKeys = Object.keys(root).filter((k) => !k.startsWith('?') && !k.startsWith('@'));
  if (rootKeys.length === 0) return null;

  const rootKey = rootKeys[0];

  function buildNode(name: string, val: unknown, parentPath: string, depth: number): TreeNode {
    const path = parentPath ? `${parentPath}/${name}` : name;
    const children: TreeNode[] = [];

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const seen = new Set<string>();
      for (const [key, child] of Object.entries(val as Record<string, unknown>)) {
        if (key.startsWith('?') || key.startsWith('@') || key === '#text') continue;
        if (seen.has(key)) continue;
        seen.add(key);
        // Unwrap arrays: treat as single representative element
        const childVal = Array.isArray(child) ? child[0] : child;
        children.push(buildNode(key, childVal, path, depth + 1));
      }
    }

    return { name, path, children, depth };
  }

  return buildNode(rootKey, root[rootKey], '', 0);
}
