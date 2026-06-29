import { describe, it, expect } from 'vitest';
import { extractSection } from '@/lib/technik/parse-md';

describe('extractSection', () => {
  const md = `# Technische Verbindungsstandards

## ebics

EBICS Inhalt hier.

### Unterabschnitt

Mehr Inhalt.

## h2h

H2H Inhalt hier.

## swift

SWIFT Inhalt.
`;

  it('extracts matching section content', () => {
    const result = extractSection(md, 'ebics');
    expect(result).toContain('EBICS Inhalt hier.');
    expect(result).toContain('Unterabschnitt');
    expect(result).not.toContain('H2H Inhalt');
  });

  it('extracts last section correctly', () => {
    const result = extractSection(md, 'swift');
    expect(result).toContain('SWIFT Inhalt.');
    expect(result).not.toContain('EBICS');
  });

  it('returns null for unknown slug', () => {
    expect(extractSection(md, 'unknown')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(extractSection('', 'ebics')).toBeNull();
  });
});
