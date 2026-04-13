'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { Components } from 'react-markdown';
import { splitToBullets } from '@/lib/text/split-to-bullets';

// Detect list patterns in prose text and split into items.
// Returns null if no meaningful list pattern found.
function splitIntoItems(text: string): { items: string[]; intro?: string } | null {
  const result = splitToBullets(text);
  if (result.kind === 'list') {
    return { items: result.items, intro: result.intro };
  }
  return null;
}

// Extract plain text from React children for pattern detection
function childrenToText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return childrenToText(children.props.children);
  }
  return '';
}

// ─── Custom renderers matching detail-pane aesthetics ──────────────────────────

const components: Components = {
  // H1: suppress — "Vollständiges Länderprofil" section heading already serves as title
  h1: () => null,

  // H2 (BLOCK headers): uppercase section heading matching SectionHeading style
  h2({ children }) {
    return (
      <div className="mb-4 mt-10 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#86bc25]/80">
          {children}
        </h2>
      </div>
    );
  },

  // H3: field-label style
  h3({ children }) {
    return (
      <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
        {children}
      </h3>
    );
  },

  // H4/H5: compact sub-heading
  h4({ children }) {
    return (
      <h4 className="mb-1 mt-4 text-sm font-semibold text-foreground/80">
        {children}
      </h4>
    );
  },
  h5({ children }) {
    return (
      <h5 className="mb-1 mt-3 text-sm font-semibold text-foreground/70">
        {children}
      </h5>
    );
  },

  // Paragraph — auto-detect inline numbered/bullet lists and split into <ul>
  p({ children }) {
    const text = childrenToText(children);
    const split = splitIntoItems(text);
    if (split) {
      return (
        <>
          {split.intro && (
            <p className="mb-2 text-base leading-relaxed text-foreground/90">
              {split.intro}
            </p>
          )}
          <ul className="mb-4 list-disc space-y-2 pl-6 marker:text-primary/60">
            {split.items.map((item, i) => (
              <li key={i} className="text-base leading-relaxed text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </>
      );
    }
    return (
      <p className="mb-4 text-base leading-relaxed text-foreground/90">
        {children}
      </p>
    );
  },

  // Lists
  ul({ children }) {
    return (
      <ul className="mb-4 list-disc space-y-2 pl-6">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="mb-4 list-decimal space-y-2 pl-6">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return (
      <li className="text-base leading-relaxed text-foreground/90">
        {children}
      </li>
    );
  },

  // Table
  table({ children }) {
    return (
      <div className="mb-6 w-full overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return <thead>{children}</thead>;
  },
  tbody({ children }) {
    return <tbody>{children}</tbody>;
  },
  tr({ children }) {
    return (
      <tr className="border-b border-border/50 last:border-b-0">
        {children}
      </tr>
    );
  },
  th({ children }) {
    return (
      <th className="border-b border-border bg-muted/50 px-4 py-2 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-4 py-2 align-top text-sm text-foreground/90">
        {children}
      </td>
    );
  },

  // HR
  hr() {
    return <hr className="my-10 border-border" />;
  },

  // Blockquote — keep as muted meta line
  blockquote({ children }) {
    return (
      <blockquote className="mb-4 border-l-2 border-primary/40 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    );
  },

  // Inline code
  code({ children, className }) {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className={className}>
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
        {children}
      </code>
    );
  },

  // Code block
  pre({ children }) {
    return (
      <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm">
        {children}
      </pre>
    );
  },

  // Strong / em
  strong({ children }) {
    return (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    );
  },

  // Links
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-primary/80"
      >
        {children}
      </a>
    );
  },
};

// ─── Strip leading H1 line ─────────────────────────────────────────────────────
function stripLeadingH1(content: string): string {
  return content.replace(/^#\s+[^\n]*\n?/, '');
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DocumentDetailProps {
  content: string;
}

export function DocumentDetail({ content }: DocumentDetailProps) {
  const processed = stripLeadingH1(content);

  return (
    <div className="space-y-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
