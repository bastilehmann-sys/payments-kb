import type { FormatContent } from './types';

const REGISTRY: Record<string, FormatContent> = {};

export function registerFormat(c: FormatContent) {
  REGISTRY[c.formatName] = c;
}
export function getFormat(name: string): FormatContent | undefined {
  return REGISTRY[name];
}
