'use client';

type SourceItem = {
  chunk_id: string;
  doc_slug: string;
  heading: string | null;
  doc_section: string;
};

interface SourcePillsProps {
  sources: SourceItem[];
}

function headingToSlug(heading: string | null): string {
  if (!heading) return '';
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function SourcePills({ sources }: SourcePillsProps) {
  if (!sources.length) return null;

  // Deduplicate by doc_slug + heading
  const seen = new Set<string>();
  const unique = sources.filter((s) => {
    const key = `${s.doc_slug}:${s.heading ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {unique.map((s, i) => {
        const slug = headingToSlug(s.heading);
        const href = `/${s.doc_section}/${s.doc_slug}${slug ? `#${slug}` : ''}`;
        const label = s.heading ? `${s.doc_slug} § ${s.heading}` : s.doc_slug;

        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
          >
            {/* Link icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 shrink-0"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <span className="max-w-[200px] truncate">{label}</span>
          </a>
        );
      })}
    </div>
  );
}
