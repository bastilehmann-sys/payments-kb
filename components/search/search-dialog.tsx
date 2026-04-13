'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/app/api/search/route';

function githubSlugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const SECTION_LABELS: Record<string, string> = {
  regulatorik: 'Regulatorik',
  formate: 'Formate',
  clearing: 'Clearing',
  ihb: 'IHB / POBO',
  laender: 'Länder',
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search
  const runSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    runSearch(val);
  }

  function navigateToResult(result: SearchResult) {
    const headingAnchor = result.heading ? `#${githubSlugify(result.heading)}` : '';
    const href = `/${result.section}/${result.doc_slug}${headingAnchor}`;
    onOpenChange(false);
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const result = results[activeIndex];
      if (result) navigateToResult(result);
    }
  }

  // Group results by section
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const key = r.section;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  // Flat index map for keyboard nav
  const flat = results;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-black/40 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-[15vh] left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl bg-popover shadow-2xl ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Suche in der Knowledge Base…"
              className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Volltext-Suche"
            />
            {loading && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 shrink-0 animate-spin text-muted-foreground"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            )}
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-base text-muted-foreground sm:inline">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {query.trim().length >= 2 && !loading && results.length === 0 && (
              <p className="px-4 py-8 text-center text-base text-muted-foreground">
                Keine Ergebnisse für &ldquo;{query}&rdquo;
              </p>
            )}

            {query.trim().length < 2 && (
              <p className="px-4 py-8 text-center text-base text-muted-foreground">
                Mindestens 2 Zeichen eingeben…
              </p>
            )}

            {Object.entries(grouped).map(([section, sectionResults]) => (
              <div key={section}>
                <div className="px-4 pb-1 pt-3">
                  <span className="text-base font-semibold uppercase tracking-wider text-muted-foreground">
                    {SECTION_LABELS[section] ?? section}
                  </span>
                </div>
                {sectionResults.map((result) => {
                  const flatIdx = flat.indexOf(result);
                  const isActive = flatIdx === activeIndex;
                  return (
                    <button
                      key={`${result.doc_slug}-${result.heading ?? 'root'}`}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onClick={() => navigateToResult(result)}
                      className={cn(
                        'w-full cursor-pointer px-4 py-2.5 text-left transition-colors',
                        isActive ? 'bg-accent/60' : 'hover:bg-accent/30'
                      )}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="truncate text-base font-medium text-foreground">
                          {result.doc_title}
                        </span>
                        {result.heading && (
                          <span className="shrink-0 text-base text-muted-foreground">
                            #{result.heading}
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-0.5 line-clamp-2 text-base text-muted-foreground [&_mark]:bg-primary/20 [&_mark]:text-foreground"
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-base text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-base">↑↓</kbd>
                navigieren
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-base">↵</kbd>
                öffnen
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-base">Esc</kbd>
                schließen
              </span>
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
