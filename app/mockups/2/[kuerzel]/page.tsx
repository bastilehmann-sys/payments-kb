import { getRegulatorikEntries } from '@/lib/queries/entries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ kuerzel: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kuerzel } = await params;
  return { title: `${decodeURIComponent(kuerzel)} — Regulatorik` };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
        <span>{title}</span>
        <span className="flex-1 border-t border-border" />
      </h2>
      <div className="text-base text-foreground/80 leading-relaxed whitespace-pre-line max-w-prose">
        {children}
      </div>
    </section>
  );
}

function MetaPair({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        {label}
      </dt>
      <dd className="text-base text-foreground/80">{value}</dd>
    </div>
  );
}

export default async function Mockup2DetailPage({ params }: Props) {
  const { kuerzel } = await params;
  const decoded = decodeURIComponent(kuerzel);
  const data = await getRegulatorikEntries();
  const entry = data.find((e) => e.kuerzel === decoded);

  if (!entry) notFound();

  const meta: string[] = [
    entry.typ,
    entry.kategorie,
    entry.in_kraft_seit ? `In Kraft: ${entry.in_kraft_seit}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/mockups" className="hover:text-foreground transition-colors">Mockups</Link>
        <span>/</span>
        <Link href="/mockups/2" className="hover:text-foreground transition-colors">Variante 02</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{entry.kuerzel}</span>
      </nav>

      {/* Header card */}
      <div className="rounded-xl border border-[#4a9eff]/30 bg-card overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#4a9eff] to-[#4a9eff]/20" />

        <div className="flex items-start gap-6 px-8 py-6">
          {/* Kürzel badge */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-[#4a9eff]/40 bg-[#4a9eff]/10">
            <span className="font-mono text-xl font-bold text-[#4a9eff]">
              {entry.kuerzel ?? '?'}
            </span>
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0 space-y-2">
            <h1 className="font-heading text-3xl font-bold text-foreground leading-tight">
              {entry.name}
            </h1>
            {meta.length > 0 && (
              <p className="text-base text-muted-foreground">{meta.join(' · ')}</p>
            )}
          </div>

          {/* Back link */}
          <Link
            href="/mockups/2"
            className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-[#4a9eff]/40 hover:text-foreground transition-colors"
          >
            ← Zurück
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        {/* Main content */}
        <div className="space-y-8">
          {entry.beschreibung_experte && (
            <Section title="Beschreibung (Experte)">{entry.beschreibung_experte}</Section>
          )}
          {entry.beschreibung_einsteiger && (
            <Section title="Beschreibung (Einsteiger)">{entry.beschreibung_einsteiger}</Section>
          )}
          {entry.auswirkungen_experte && (
            <Section title="Auswirkungen (Experte)">{entry.auswirkungen_experte}</Section>
          )}
          {entry.auswirkungen_einsteiger && (
            <Section title="Auswirkungen (Einsteiger)">{entry.auswirkungen_einsteiger}</Section>
          )}
          {entry.pflichtmassnahmen_experte && (
            <Section title="Pflichtmaßnahmen">{entry.pflichtmassnahmen_experte}</Section>
          )}
          {entry.pflichtmassnahmen_einsteiger && (
            <Section title="Pflichtmaßnahmen (Einsteiger)">{entry.pflichtmassnahmen_einsteiger}</Section>
          )}
          {entry.best_practice_experte && (
            <Section title="Best Practice">{entry.best_practice_experte}</Section>
          )}
          {entry.best_practice_einsteiger && (
            <Section title="Best Practice (Einsteiger)">{entry.best_practice_einsteiger}</Section>
          )}
          {entry.risiken_experte && (
            <Section title="Risiken">{entry.risiken_experte}</Section>
          )}
          {entry.risiken_einsteiger && (
            <Section title="Risiken (Einsteiger)">{entry.risiken_einsteiger}</Section>
          )}
        </div>

        {/* Sidebar metadata */}
        <aside className="space-y-5">
          <div className="rounded-lg border border-border bg-muted/20 px-4 py-5 space-y-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Metadaten
            </h3>
            <dl className="space-y-4">
              <MetaPair label="Kürzel" value={entry.kuerzel} />
              <MetaPair label="Typ" value={entry.typ} />
              <MetaPair label="Kategorie" value={entry.kategorie} />
              <MetaPair label="In Kraft seit" value={entry.in_kraft_seit} />
              <MetaPair label="Nächste Änderung" value={entry.naechste_aenderung} />
              <MetaPair label="Status / Version" value={entry.status_version} />
              <MetaPair label="Geltungsbereich" value={entry.geltungsbereich} />
              <MetaPair label="Betroffene Abteilungen" value={entry.betroffene_abteilungen} />
            </dl>
          </div>

          {entry.behoerde_link && (
            <div className="rounded-lg border border-border bg-muted/20 px-4 py-4 space-y-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Behörden-Link
              </h3>
              <a
                href={entry.behoerde_link.startsWith('http') ? entry.behoerde_link : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 break-all text-xs text-[#4a9eff] hover:underline"
              >
                {entry.behoerde_link}
                <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M10 2h4m0 0v4M14 2L7.5 8.5" />
                </svg>
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
