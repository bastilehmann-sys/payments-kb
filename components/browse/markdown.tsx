'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Components } from 'react-markdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const components: Components = {
  table({ children, ...props }) {
    return (
      <Table {...(props as React.ComponentProps<'table'>)}>{children}</Table>
    );
  },
  thead({ children, ...props }) {
    return (
      <TableHeader {...(props as React.ComponentProps<'thead'>)}>
        {children}
      </TableHeader>
    );
  },
  tbody({ children, ...props }) {
    return (
      <TableBody {...(props as React.ComponentProps<'tbody'>)}>
        {children}
      </TableBody>
    );
  },
  tr({ children, ...props }) {
    return (
      <TableRow {...(props as React.ComponentProps<'tr'>)}>{children}</TableRow>
    );
  },
  th({ children, ...props }) {
    return (
      <TableHead {...(props as React.ComponentProps<'th'>)}>{children}</TableHead>
    );
  },
  td({ children, ...props }) {
    return (
      <TableCell {...(props as React.ComponentProps<'td'>)}>{children}</TableCell>
    );
  },
};

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <div
      className="
        prose prose-sm max-w-none
        dark:prose-invert
        prose-headings:font-heading prose-headings:text-foreground
        prose-h1:text-2xl prose-h1:font-semibold
        prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-foreground/90 prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono prose-code:text-foreground
        prose-pre:rounded-lg prose-pre:bg-muted prose-pre:ring-1 prose-pre:ring-border
        prose-blockquote:border-l-primary/50 prose-blockquote:text-muted-foreground
        prose-li:text-foreground/90
        prose-strong:text-foreground prose-strong:font-semibold
        prose-hr:border-border
        prose-table:text-sm
        [&_table]:!m-0 [&_table]:w-full
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
