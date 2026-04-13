import { createHash } from 'node:crypto';

/**
 * Returns the SHA-256 hex digest of the input string.
 */
export function hash(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}
