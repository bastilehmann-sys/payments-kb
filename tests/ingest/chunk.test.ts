import { describe, it, expect } from 'vitest';
import { chunkMarkdown } from '@/lib/ingest/chunk';
import { hash } from '@/lib/ingest/hash';

// ─── chunkMarkdown ────────────────────────────────────────────────────────────

describe('chunkMarkdown', () => {
  it('empty input returns []', () => {
    expect(chunkMarkdown('')).toEqual([]);
    expect(chunkMarkdown('   \n  ')).toEqual([]);
  });

  it('2-H2 doc produces 2 chunks with correct headings', () => {
    const md = `# My Doc

Some intro.

## Section One

Content for section one.

## Section Two

Content for section two.
`;
    const chunks = chunkMarkdown(md);
    // Preamble (intro) + two H2 sections = 3 chunks
    // But preamble has content so it should also be included
    const h2Chunks = chunks.filter(c => c.heading === 'Section One' || c.heading === 'Section Two');
    expect(h2Chunks).toHaveLength(2);
    expect(h2Chunks[0].heading).toBe('Section One');
    expect(h2Chunks[1].heading).toBe('Section Two');
    // chunk_index must be sequential
    expect(h2Chunks[0].chunk_index).toBeLessThan(h2Chunks[1].chunk_index);
  });

  it('2-H2 doc without preamble produces exactly 2 chunks', () => {
    const md = `## Alpha

Content A.

## Beta

Content B.
`;
    const chunks = chunkMarkdown(md);
    expect(chunks).toHaveLength(2);
    expect(chunks[0].heading).toBe('Alpha');
    expect(chunks[1].heading).toBe('Beta');
    expect(chunks[0].chunk_index).toBe(0);
    expect(chunks[1].chunk_index).toBe(1);
  });

  it('large H2 block (>1500 chars) with H3s inside splits into sub-chunks', () => {
    const longParagraph = 'x'.repeat(600);
    const md = [
      '## Big Section',
      '',
      longParagraph,
      '',
      '### Sub A',
      '',
      longParagraph,
      '',
      '### Sub B',
      '',
      longParagraph,
    ].join('\n');

    // Total is well over 1500 chars
    expect(md.length).toBeGreaterThan(1500);

    const chunks = chunkMarkdown(md);
    const headings = chunks.map(c => c.heading);
    // Should have split into H3 sub-chunks
    expect(headings).toContain('Sub A');
    expect(headings).toContain('Sub B');
    // chunk_indexes must be sequential starting at 0
    expect(chunks[0].chunk_index).toBe(0);
    for (let i = 1; i < chunks.length; i++) {
      expect(chunks[i].chunk_index).toBe(chunks[i - 1].chunk_index + 1);
    }
  });

  it('small H2 block (<=1500 chars) is NOT split even with H3s', () => {
    const md = `## Small Section

Some text.

### Sub heading

More text.
`;
    expect(md.length).toBeLessThanOrEqual(1500);
    const chunks = chunkMarkdown(md);
    // Should stay as one chunk under H2 heading
    expect(chunks).toHaveLength(1);
    expect(chunks[0].heading).toBe('Small Section');
    expect(chunks[0].content).toContain('### Sub heading');
  });

  it('preamble before first H2 is preserved as chunk 0 with H1 heading', () => {
    const md = `# Document Title

This is preamble content before any section.

## First Section

Section content.
`;
    const chunks = chunkMarkdown(md);
    expect(chunks[0].heading).toBe('Document Title');
    expect(chunks[0].content).toContain('preamble content');
    expect(chunks[0].chunk_index).toBe(0);
  });

  it('preamble without H1 gets empty heading', () => {
    // Content before any H2 that has no H1 gets heading = ""
    const md = `Some text without a heading.

More content here to make it non-empty.

## Section

Content.
`;
    const chunks = chunkMarkdown(md);
    // First chunk is the preamble (no H1 → heading = "")
    expect(chunks[0].heading).toBe('');
    expect(chunks[0].content).toContain('Some text without a heading.');
  });

  it('each chunk content includes the heading line itself', () => {
    const md = `## Section Alpha

Alpha content here.
`;
    const chunks = chunkMarkdown(md);
    expect(chunks[0].content).toContain('## Section Alpha');
  });

  it('empty H2 sections (no body) are filtered out', () => {
    const md = `## Empty Section

## Real Section

Has content.
`;
    const chunks = chunkMarkdown(md);
    expect(chunks.every(c => c.heading !== 'Empty Section')).toBe(true);
    expect(chunks.find(c => c.heading === 'Real Section')).toBeDefined();
  });

  it('chunk_index is a sequential running counter across all chunks', () => {
    const md = `# Intro

Preamble.

## A

Content A.

## B

Content B.

## C

Content C.
`;
    const chunks = chunkMarkdown(md);
    chunks.forEach((chunk, i) => {
      expect(chunk.chunk_index).toBe(i);
    });
  });
});

// ─── hash ─────────────────────────────────────────────────────────────────────

describe('hash', () => {
  it('returns a 64-char hex string (sha256)', () => {
    const result = hash('hello');
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]+$/);
  });

  it('known sha256 value for "hello"', () => {
    // sha256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    expect(hash('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('same input produces same hash (deterministic)', () => {
    expect(hash('test string')).toBe(hash('test string'));
  });

  it('different inputs produce different hashes', () => {
    expect(hash('foo')).not.toBe(hash('bar'));
  });

  it('empty string produces a valid hash', () => {
    const result = hash('');
    expect(result).toHaveLength(64);
  });
});
