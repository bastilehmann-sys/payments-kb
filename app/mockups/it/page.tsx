import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mockups IT — Payments KB',
};

const VARIANTS = [
  {
    href: '/mockups/it/tabs',
    number: 'A',
    title: 'Tab-Blöcke mit Einsteiger-First',
    pitch:
      'Tab-Bar für alle 6 Blöcke. Jedes Feld zeigt nur den Einsteiger-Text — schnell scanbar. Ein "Details"-Button klappt Experten- und Praxis-Infos auf. Keine Tabellen, keine 3 Spalten.',
    accent: '#f59e0b',
  },
  {
    href: '/mockups/it/cards',
    number: 'B',
    title: 'Kompakte Karten-Grid',
    pitch:
      'Pro Block eine Section mit Karten im 2-Spalten-Grid. Karte zeigt Feld-Name + ersten Satz. Klick öffnet einen Drawer rechts mit dem vollständigen Inhalt (Experte, Einsteiger, Praxis).',
    accent: '#3b82f6',
  },
  {
    href: '/mockups/it/q-a',
    number: 'C',
    title: 'FAQ-Stil Fragen/Antworten',
    pitch:
      'Flache Liste aller 80 Felder als Fragen formuliert. Suchfeld filtert in Echtzeit. Tag-Pills gruppieren nach Block. Accordion klappt die Expert-Version auf.',
    accent: '#8b5cf6',
  },
];

export default function MockupsItIndexPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Dev-Only
          </span>
          <span className="text-xs text-muted-foreground">Länder · Italien Country Detail Mockups</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          IT · 3 vereinfachte Detailansichten
        </h1>
        <p className="max-w-2xl text-base text-foreground/70 leading-relaxed">
          Die aktuelle{' '}
          <a href="/laender?code=IT" className="text-primary underline underline-offset-2 hover:text-primary/80">
            /laender?code=IT
          </a>{' '}
          zeigt 80 Felder × 3 Varianten als dichte Tabelle. Diese Mockups zeigen drei
          schlankere Alternativen — alle mit echten DB-Daten.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="/mockups"
            className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            ← Alle Mockups
          </a>
          <a
            href="/laender?code=IT"
            className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
          >
            Aktuell: /laender?code=IT →
          </a>
        </div>
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
                className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
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
              <svg
                viewBox="0 0 16 16"
                className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
