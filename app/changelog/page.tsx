import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getChangelog } from '@/lib/queries/changelog';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — Payments KB',
};

const SECTION_LABELS: Record<string, string> = {
  regulatorik: 'Regulatorik',
  formate: 'Formate',
  clearing: 'Clearing',
  ihb: 'IHB / POBO',
  laender: 'Länder',
};

const SECTION_COLORS: Record<string, string> = {
  regulatorik: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  formate: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  clearing: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  ihb: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  laender: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
};

export default async function ChangelogPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const months = await getChangelog();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Changelog</h1>
        <p className="text-sm text-muted-foreground">
          Alle aktualisierten Dokumente in chronologischer Reihenfolge.
        </p>
      </div>

      {months.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <svg
            className="size-10 text-muted-foreground/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <p className="mt-4 text-sm font-medium text-foreground">Noch keine Änderungen</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Bitte zuerst unter{' '}
            <Link href="/admin" className="underline underline-offset-4 hover:text-foreground">
              /admin
            </Link>{' '}
            indizieren.
          </p>
        </div>
      ) : (
        /* Timeline */
        <div className="relative space-y-10">
          {/* Vertical line */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
            aria-hidden="true"
          />

          {months.map((month) => (
            <div key={month.key} className="relative pl-8">
              {/* Dot on the timeline */}
              <div
                className="absolute left-0 top-1 size-[15px] rounded-full border-2 border-primary bg-background"
                aria-hidden="true"
              />

              {/* Month heading */}
              <h2 className="font-heading text-base font-semibold text-foreground capitalize">
                {month.label}
              </h2>

              {/* Entries list */}
              <ul className="mt-3 space-y-2">
                {month.entries.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/${entry.section ?? 'regulatorik'}/${entry.slug}`}
                      className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-card/80"
                    >
                      {/* Section badge */}
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
                          SECTION_COLORS[entry.section ?? ''] ??
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        {SECTION_LABELS[entry.section ?? ''] ?? entry.section ?? '—'}
                      </span>

                      {/* Title */}
                      <span className="flex-1 truncate text-sm font-medium text-foreground group-hover:text-primary">
                        {entry.title}
                      </span>

                      {/* Date */}
                      <time
                        dateTime={entry.updated_at?.toISOString()}
                        className="shrink-0 text-xs tabular-nums text-muted-foreground"
                      >
                        {entry.updated_at?.toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }) ?? '—'}
                      </time>

                      {/* Chevron */}
                      <svg
                        className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary/60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
