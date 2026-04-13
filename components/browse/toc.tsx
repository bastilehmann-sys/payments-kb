'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/browse/toc';

export type { TocEntry };

interface TocProps {
  entries: TocEntry[];
}

export function Toc({ entries }: TocProps) {
  const [activeSlug, setActiveSlug] = useState<string>('');

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (obs) => {
        for (const entry of obs) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    for (const entry of entries) {
      const el = document.getElementById(entry.slug);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Inhaltsverzeichnis" className="space-y-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Inhalt
      </p>
      <ul className="space-y-0.5">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <a
              href={`#${entry.slug}`}
              className={`block truncate py-0.5 text-xs transition-colors ${
                entry.level === 3 ? 'pl-3' : 'pl-0'
              } ${
                activeSlug === entry.slug
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
