'use client';

import Link from 'next/link';

export type RelatedItem = {
  id: string;
  label: string;
  abkuerzung?: string | null;
  note?: string | null;
  primary?: boolean | null;
};

export function RelatedItemsPanel({
  title,
  items,
  targetPath,
}: {
  title: string;
  items: RelatedItem[];
  targetPath: '/clearing' | '/zahlungsarten';
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-10 border-t border-border pt-6">
      <h3 className="mb-4 font-heading text-base font-semibold uppercase tracking-wider text-[#86bc25]/80">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <Link
            key={i.id}
            href={`${targetPath}?id=${i.id}`}
            className="group inline-flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 px-4 py-2 transition-colors hover:border-[#86bc25]/40 hover:bg-[#86bc25]/5"
          >
            <span className="text-base font-medium">{i.label}</span>
            {i.abkuerzung && (
              <span className="font-mono text-sm text-muted-foreground">{i.abkuerzung}</span>
            )}
            {i.primary && (
              <span className="rounded-full bg-[#86bc25]/15 px-2 py-0.5 text-sm text-[#86bc25]">
                primär
              </span>
            )}
            {i.note && (
              <span className="text-sm text-muted-foreground">— {i.note}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
