import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Mockups — Payments KB',
};

const VARIANTS = [
  {
    href: '/mockups/dashboard/hub',
    number: 'A',
    title: 'Wissens-Hub',
    pitch:
      'Hero-Suche + Deadline-Streifen mit Regulatorik-Fristen + 3-Spalten-Grid (letzte Änderungen, High-Complexity-Länder, aktuelle Formate) + kompakte Länder-Matrix. Zentraler Einstiegspunkt mit Kontext.',
    accent: '#86bc25',
    tags: ['Suche zentriert', 'Deadlines', 'Audit-Feed', 'Länder-Matrix'],
  },
  {
    href: '/mockups/dashboard/cockpit',
    number: 'B',
    title: 'Treasury-Cockpit',
    pitch:
      'Regulatorik-Timeline (SVG, 2024–2026) + Meine-Länder-Quick-Picks + Format-Changelog-Feed + kuratierte SAP-Relevanz-Matrix. Strukturiertes Monitoring mit zeitlichem Fokus.',
    accent: '#4a9eff',
    tags: ['Timeline-Widget', 'Länder-Picks', 'Format-Feed', 'SAP-Matrix'],
  },
  {
    href: '/mockups/dashboard/minimal',
    number: 'C',
    title: 'Minimal',
    pitch:
      'Großes zentrales Suchfeld + 6 riesige Section-Kacheln mit Counts. Nichts anderes. Maximale Klarheit für erfahrene Nutzer die wissen was sie suchen.',
    accent: '#9b59b6',
    tags: ['Search-First', '6 Sections', 'Ultra-Clean', 'No Noise'],
  },
];

export default function DashboardMockupsIndexPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-600">
            Dev-Only
          </span>
          <span className="text-xs text-muted-foreground">Dashboard · 3 Varianten zur Auswahl</span>
        </div>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Dashboard Mockups
        </h1>
        <p className="max-w-2xl text-lg text-foreground/70 leading-relaxed">
          Drei unterschiedliche Dashboard-Konzepte für Payments KB. Alle nutzen echte Datenbankdaten.
          Wähle die Variante, die am besten zum Arbeitsfluss passt — oder kombiniere Ideen.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        {VARIANTS.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="group relative flex flex-col gap-5 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Number badge + accent line */}
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
                style={{ background: v.accent + '22', color: v.accent }}
              >
                {v.number}
              </span>
              <span className="h-px flex-1 rounded" style={{ background: v.accent + '33' }} />
            </div>

            {/* Title */}
            <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
              {v.title}
            </h2>

            {/* Pitch */}
            <p className="flex-1 text-base text-foreground/65 leading-relaxed">{v.pitch}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {v.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-xs font-medium"
                  style={{ background: v.accent + '18', color: v.accent }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: v.accent }}>
              <span>Variante ansehen</span>
              <svg
                viewBox="0 0 16 16"
                className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Back link */}
      <div className="pt-2">
        <Link
          href="/mockups"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Alle Mockups
        </Link>
      </div>
    </div>
  );
}
