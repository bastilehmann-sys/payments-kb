import type { TreeNode } from './xml-tree';

export type DiffKind = 'same' | 'only-a' | 'only-b';

export interface DiffNode {
  name: string;
  path: string;
  children: DiffNode[];
  depth: number;
  kind: DiffKind;
}

/**
 * Build a merged diff tree from two parsed XML trees.
 *
 * Returns two parallel trees (left = A side, right = B side) where every node
 * carries its kind:
 *   same   → present in both A and B
 *   only-a → present only in A  (red on left, placeholder on right)
 *   only-b → present only in B  (placeholder on left, green on right)
 *
 * Both trees share the same structure so they can be rendered line-by-line in
 * lockstep without any row misalignment.
 */
export function diffTrees(
  a: TreeNode | null,
  b: TreeNode | null,
): { left: DiffNode; right: DiffNode } {
  // Collect all paths in each tree
  const pathsA = new Set<string>();
  const pathsB = new Set<string>();

  function collectPaths(node: TreeNode, set: Set<string>) {
    set.add(node.path);
    for (const c of node.children) collectPaths(c, set);
  }
  if (a) collectPaths(a, pathsA);
  if (b) collectPaths(b, pathsB);

  // Build a synthetic root when one side is null
  function syntheticRoot(source: TreeNode | null, other: TreeNode | null): TreeNode {
    if (source) return source;
    if (other) return { name: other.name, path: other.path, children: [], depth: 0 };
    return { name: '(empty)', path: '', children: [], depth: 0 };
  }

  const rootA = syntheticRoot(a, b);
  const rootB = syntheticRoot(b, a);

  /**
   * Merge children from both sides into an ordered list of (childA | null, childB | null) pairs.
   * Order: all keys from A first (preserving order), then any keys only in B.
   */
  function mergeChildren(
    childrenA: TreeNode[],
    childrenB: TreeNode[],
  ): Array<{ nodeA: TreeNode | null; nodeB: TreeNode | null }> {
    const mapA = new Map(childrenA.map((c) => [c.name, c]));
    const mapB = new Map(childrenB.map((c) => [c.name, c]));
    const ordered: Array<{ nodeA: TreeNode | null; nodeB: TreeNode | null }> = [];
    const seen = new Set<string>();

    for (const c of childrenA) {
      if (seen.has(c.name)) continue;
      seen.add(c.name);
      ordered.push({ nodeA: c, nodeB: mapB.get(c.name) ?? null });
    }
    for (const c of childrenB) {
      if (seen.has(c.name)) continue;
      seen.add(c.name);
      ordered.push({ nodeA: mapA.get(c.name) ?? null, nodeB: c });
    }
    return ordered;
  }

  function buildDiffNode(
    nodeA: TreeNode | null,
    nodeB: TreeNode | null,
    side: 'left' | 'right',
  ): DiffNode {
    const ref = (nodeA ?? nodeB)!;
    const inA = pathsA.has(ref.path);
    const inB = pathsB.has(ref.path);

    let kind: DiffKind;
    if (inA && inB) kind = 'same';
    else if (inA) kind = 'only-a';
    else kind = 'only-b';

    const childPairs = mergeChildren(nodeA?.children ?? [], nodeB?.children ?? []);
    const children = childPairs.map(({ nodeA: ca, nodeB: cb }) =>
      buildDiffNode(ca, cb, side),
    );

    return { name: ref.name, path: ref.path, children, depth: ref.depth, kind };
  }

  const left  = buildDiffNode(rootA, rootB, 'left');
  const right = buildDiffNode(rootA, rootB, 'right');

  return { left, right };
}

/** Count nodes by kind in a DiffNode tree (recursive). */
export function countByKind(node: DiffNode): { same: number; onlyA: number; onlyB: number } {
  let same = 0, onlyA = 0, onlyB = 0;
  function walk(n: DiffNode) {
    if (n.kind === 'same') same++;
    else if (n.kind === 'only-a') onlyA++;
    else onlyB++;
    for (const c of n.children) walk(c);
  }
  walk(node);
  return { same, onlyA, onlyB };
}
