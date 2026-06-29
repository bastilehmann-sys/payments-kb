import { describe, it, expect } from 'vitest';
import { extractSection, replaceSection } from '@/lib/proposals/section-utils';

const SAMPLE_MD = `# Global Doc

## SEPA Credit Transfer

Old SEPA content here.

## Andere Sektion

Other content.
`;

describe('extractSection', () => {
  it('extracts an existing section', () => {
    const result = extractSection(SAMPLE_MD, 'SEPA Credit Transfer');
    expect(result).toContain('Old SEPA content here');
    expect(result).not.toContain('Other content');
  });

  it('returns empty string for unknown section', () => {
    expect(extractSection(SAMPLE_MD, 'Nicht vorhanden')).toBe('');
  });
});

describe('replaceSection', () => {
  it('replaces an existing section', () => {
    const result = replaceSection(SAMPLE_MD, 'SEPA Credit Transfer', '## SEPA Credit Transfer\n\nNew content.');
    expect(result).toContain('New content.');
    expect(result).not.toContain('Old SEPA content here');
    expect(result).toContain('Other content');
  });

  it('appends when section not found', () => {
    const result = replaceSection(SAMPLE_MD, 'Neue Sektion', '## Neue Sektion\n\nAppended.');
    expect(result).toContain('Old SEPA content here');
    expect(result).toContain('Appended.');
  });
});
