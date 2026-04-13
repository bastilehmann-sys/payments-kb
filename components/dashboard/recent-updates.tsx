import Link from 'next/link';
import type { RecentUpdate } from '@/lib/queries/dashboard';

const SECTION_LABELS: Record<string, string> = {
  regulatorik: 'Regulatorik',
  formate: 'Formate',
  clearing: 'Clearing',
  ihb: 'IHB',
  laender: 'Länder',
};

const SECTION_COLORS: Record<string, string> = {
  regulatorik: 'bg-chart-1/15 text-chart-1',
  formate: 'bg-chart-2/15 text-chart-2',
  clearing: 'bg-chart-3/15 text-chart-3',
  ihb: 'bg-chart-4/15 text-chart-4',
  laender: 'bg-chart-5/15 text-chart-5',
};

function relativeTime(date: Date | null): string {
  if (!date) return '—';

  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  const rtf = new Intl.RelativeTimeFormat('de-DE', { numeric: 'auto' });

  if (diffSec < 60) return 'gerade eben';
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHrs < 24) return rtf.format(-diffHrs, 'hour');
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return rtf.format(-diffMonths, 'month');
  return rtf.format(-Math.floor(diffDays / 365), 'year');
}

function SectionBadge({ section }: { section: string | null }) {
  if (!section) return null;
  const label = SECTION_LABELS[section] ?? section;
  const color = SECTION_COLORS[section] ?? 'bg-muted text-muted-foreground';
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-base font-medium uppercase tracking-wide ${color}`}
    >
      {label}
    </span>
  );
}

interface RecentUpdatesProps {
  updates: RecentUpdate[];
}

export function RecentUpdates({ updates }: RecentUpdatesProps) {
  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      <div className="border-b border-foreground/[0.06] px-5 py-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Letzte Updates
        </h2>
      </div>

      {updates.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-base text-muted-foreground">
            Noch keine Dokumente — bitte unter{' '}
            <Link
              href="/admin"
              className="text-primary underline-offset-4 hover:underline"
            >
              /admin
            </Link>{' '}
            reindizieren.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-foreground/[0.06]">
          {updates.map((doc) => (
            <li key={doc.id}>
              <Link
                href={`/${doc.section ?? 'docs'}/${doc.slug}`}
                className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:bg-muted/30"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="truncate text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {doc.title}
                  </span>
                  <SectionBadge section={doc.section} />
                </div>
                <span className="shrink-0 text-base text-muted-foreground pt-0.5">
                  {relativeTime(doc.updated_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
