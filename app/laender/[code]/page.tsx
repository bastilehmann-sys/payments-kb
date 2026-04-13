import { getCountry } from '@/lib/queries/documents';
import { Markdown } from '@/components/browse/markdown';
import { Toc } from '@/components/browse/toc';
import { extractToc } from '@/lib/browse/toc';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ code: string }>;
}

const COMPLEXITY_LABEL: Record<string, string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
};

const COMPLEXITY_COLOR: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const country = await getCountry(code);
  return {
    title: country ? `${country.name} — Payments KB` : 'Land nicht gefunden',
  };
}

export default async function CountryPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/login');

  const { code } = await params;
  const country = await getCountry(code);
  if (!country) notFound();

  const toc = country.document ? extractToc(country.document.content_md) : [];
  const complexityColor = COMPLEXITY_COLOR[country.complexity] ?? '#7d87a0';
  const complexityLabel = COMPLEXITY_LABEL[country.complexity] ?? country.complexity;

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/laender" className="hover:text-foreground transition-colors">
            Länder
          </Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-foreground">{country.name}</span>
        </nav>

        {/* Country header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {country.code}
              </div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">
                {country.name}
              </h1>
            </div>
            <span
              className="mt-1 flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium"
              style={{ color: complexityColor }}
            >
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: complexityColor }}
                aria-hidden="true"
              />
              Komplexität: {complexityLabel}
            </span>
          </div>
          {country.summary && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {country.summary}
            </p>
          )}
        </div>

        {/* Structured country profile fields from Excel matrix */}
        {(country.currency || country.payment_infra || country.ihb_pobo_cobo ||
          country.regulatorik || country.local_specifics || country.sap_effort ||
          country.key_note) && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Strukturiertes Länderprofil
              </h2>
            </div>
            <dl className="divide-y divide-border">
              {country.currency && (
                <div className="flex items-start gap-4 px-5 py-3">
                  <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                    Währung
                  </dt>
                  <dd className="text-sm text-foreground">{country.currency}</dd>
                </div>
              )}
              {country.payment_infra && (
                <div className="flex items-start gap-4 px-5 py-3">
                  <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                    Payment-Infrastruktur
                  </dt>
                  <dd className="text-sm text-foreground">{country.payment_infra}</dd>
                </div>
              )}
              {country.ihb_pobo_cobo && (
                <div className="flex items-start gap-4 px-5 py-3">
                  <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                    IHB / POBO / COBO
                  </dt>
                  <dd className="text-sm text-foreground">{country.ihb_pobo_cobo}</dd>
                </div>
              )}
              {country.regulatorik && (
                <div className="flex items-start gap-4 px-5 py-3">
                  <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                    Regulatorik
                  </dt>
                  <dd className="text-sm text-foreground">{country.regulatorik}</dd>
                </div>
              )}
              {country.local_specifics && (
                <div className="flex items-start gap-4 px-5 py-3">
                  <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                    Lokale Besonderheiten
                  </dt>
                  <dd className="text-sm text-foreground">{country.local_specifics}</dd>
                </div>
              )}
              {country.sap_effort && (
                <div className="flex items-start gap-4 px-5 py-3">
                  <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                    SAP-Aufwand
                  </dt>
                  <dd className="text-sm text-foreground">{country.sap_effort}</dd>
                </div>
              )}
              {country.key_note && (
                <div className="flex items-start gap-4 px-5 py-4 bg-muted/30">
                  <dt className="w-44 shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
                    Wichtigster Hinweis
                  </dt>
                  <dd className="text-sm text-foreground leading-relaxed">{country.key_note}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Document or placeholder */}
        {country.document ? (
          <div>
            <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
              Länderprofil
            </h2>
            <Markdown content={country.document.content_md} />
          </div>
        ) : (
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-sm font-medium text-muted-foreground">
              Profil für dieses Land noch nicht verfügbar
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Das Länderprofil wird nach dem nächsten Ingest hier angezeigt.
            </p>
          </div>
        )}
      </div>

      {/* TOC */}
      {toc.length > 0 && (
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-20">
            <Toc entries={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
