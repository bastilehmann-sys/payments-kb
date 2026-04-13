import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockups — Payments KB',
};

const VARIANTS = [
  {
    href: '/mockups/1',
    number: '01',
    title: 'Dense Linear / Notion Style',
    pitch:
      'Kompakte Tabellenzeilen mit Ellipsis-Truncation, Tooltip on hover, Chip-Filter-Bar und einem Slide-in Side-Panel (50 % Breite). Keyboard-navigierbar: Esc schließt, ↑↓ navigiert Zeilen. Feel: Linear · Attio · Notion Database.',
    accent: '#86bc25',
  },
  {
    href: '/mockups/2',
    number: '02',
    title: 'Card-Row Hybrid',
    pitch:
      'Jede Zeile ist eine horizontale Strip-Card: links das Kürzel-Badge, Mitte Titel + kurze Beschreibung, rechts Metadaten. Klick öffnet eine vollständige Detail-Seite. Feel: Stripe Docs · Vercel Dashboard.',
    accent: '#4a9eff',
  },
  {
    href: '/mockups/3',
    number: '03',
    title: 'Split Master-Detail',
    pitch:
      'Permanente Split-View: links schmale Inbox-Liste, rechts strukturiertes Detail mit Abschnitt-Labels. Auswahl updated rechts ohne Navigation. Feel: Apple Mail · Bear · Obsidian.',
    accent: '#b47aff',
  },
];

export default function MockupsIndexPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Dev-Only
          </span>
          <span className="text-xs text-muted-foreground">Regulatorik · Data-Grid Mockups</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          3 Varianten zur Auswahl
        </h1>
        <p className="max-w-2xl text-base text-foreground/70 leading-relaxed">
          Drei unterschiedliche Ansichten für die Regulatorik-Daten. Jede Variante nutzt echte
          Datenbankdaten. Wähle die Variante, die am besten passt — oder kombiniere Ideen.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        {VARIANTS.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="group relative flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Number + accent line */}
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold"
                style={{ background: v.accent + '22', color: v.accent }}
              >
                {v.number}
              </span>
              <span className="h-px flex-1 rounded" style={{ background: v.accent + '33' }} />
            </div>

            {/* Title */}
            <h2 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
              {v.title}
            </h2>

            {/* Pitch */}
            <p className="flex-1 text-sm text-foreground/65 leading-relaxed">{v.pitch}</p>

            {/* CTA */}
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: v.accent }}>
              <span>Variante ansehen</span>
              <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
