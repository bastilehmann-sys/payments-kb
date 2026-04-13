import Link from 'next/link';
import type { DocumentRow } from '@/lib/queries/documents';

const SECTION_LABELS: Record<string, string> = {
  regulatorik: 'Regulatorik',
  formate: 'Formate',
  clearing: 'Clearing',
  ihb: 'IHB / POBO',
  laender: 'Länder',
};

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

interface DocumentListProps {
  documents: DocumentRow[];
  section: string;
}

export function DocumentList({ documents, section }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 h-10 w-10 text-muted-foreground/40"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
        <p className="text-base font-medium text-muted-foreground">
          Keine Dokumente in dieser Sektion
        </p>
        <p className="mt-1 text-base text-muted-foreground/60">
          Dokumente werden nach dem nächsten Ingest hier angezeigt.
        </p>
      </div>
    );
  }

  const sectionLabel = SECTION_LABELS[section] ?? section;

  return (
    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
      {documents.map((doc) => (
        <Link
          key={doc.id}
          href={`/${section}/${doc.slug}`}
          className="group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:bg-muted/40"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path d="M14 2v6h6" />
            </svg>
            <span className="truncate text-base font-medium text-foreground group-hover:text-primary transition-colors">
              {doc.title}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden rounded-full border border-border bg-muted/40 px-2 py-0.5 text-base text-muted-foreground sm:inline">
              {sectionLabel}
            </span>
            <span className="text-base tabular-nums text-muted-foreground/60">
              {formatDate(doc.updated_at)}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
