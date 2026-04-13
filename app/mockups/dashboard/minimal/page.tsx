import Link from 'next/link';
import type { Metadata } from 'next';
import { getMockupStats } from '@/lib/queries/dashboard-mockups';
import { MinimalSearchButton } from './minimal-search-button';

export const metadata: Metadata = {
  title: 'Variante C: Minimal — Dashboard Mockups',
};

export default async function MinimalPage() {
  const stats = await getMockupStats();

  const SECTIONS = [
    {
      label: 'Regulatorik',
      count: stats.regulatorik,
      href: '/regulatorik',
      color: '#86bc25',
      svgPath: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2v8l5.5 3.18-.72 1.25L11 13.27V4h1z',
      description: 'Gesetze, Verordnungen & Fristen',
    },
    {
      label: 'Formate',
      count: stats.formate,
      href: '/formate',
      color: '#4a9eff',
      svgPath: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h4v1.5H8V10z',
      description: 'ISO 20022, SWIFT, pain, camt',
    },
    {
      label: 'Clearing',
      count: stats.clearing,
      href: '/clearing',
      color: '#f59e0b',
      svgPath: 'M4 6h16M4 10h16M4 14h10M17 14l2 2 4-4',
      description: 'Clearing-Systeme & Settlement',
    },
    {
      label: 'Zahlungsarten',
      count: stats.zahlungsarten,
      href: '/zahlungsarten',
      color: '#9b59b6',
      svgPath: 'M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm0 4h20M6 15h2M10 15h4',
      description: 'SCT, SDD, Instant, SWIFT, Checks',
    },
    {
      label: 'IHB / POBO',
      count: stats.ihb,
      href: '/ihb',
      color: '#ef4444',
      svgPath: 'M2 20h20M4 20V10l8-7 8 7v10M10 20v-6h4v6',
      description: 'In-House Banking & On-Behalf-Of',
    },
    {
      label: 'Länder',
      count: stats.laender,
      href: '/laender',
      color: '#06b6d4',
      svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
      description: 'Länder-Komplexität & Anforderungen',
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col">
      {/* Back + badge */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#9b59b6]/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#9b59b6]">
            Variante C
          </span>
          <span className="text-xs text-muted-foreground">Minimal</span>
        </div>
        <Link
          href="/mockups/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Dashboard Mockups
        </Link>
      </div>

      {/* Central search */}
      <div className="flex flex-col items-center gap-8 py-10">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Payments KB
          </h1>
          <p className="text-sm text-muted-foreground">
            SAP Treasury Payments Wissensdatenbank
          </p>
        </div>

        <MinimalSearchButton />
      </div>

      {/* 6 section tiles — 3x2 grid */}
      <div className="grid flex-1 grid-cols-2 gap-4 pb-6 md:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-[var(--hover-color)] hover:shadow-xl"
            style={{ '--hover-color': s.color + '60' } as React.CSSProperties}
          >
            {/* Icon + count row */}
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: s.color + '18' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d={s.svgPath} />
                </svg>
              </div>
              <span
                className="font-heading text-3xl font-bold tabular-nums"
                style={{ color: s.color }}
              >
                {s.count}
              </span>
            </div>

            {/* Label + desc */}
            <div>
              <h2
                className="font-heading text-lg font-semibold text-foreground transition-colors duration-150 group-hover:text-[var(--hover-color)]"
                style={{ '--hover-color': s.color } as React.CSSProperties}
              >
                {s.label}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground leading-snug">{s.description}</p>
            </div>

            {/* Arrow */}
            <div className="mt-auto flex items-center gap-1 text-xs font-medium" style={{ color: s.color }}>
              <span>Öffnen</span>
              <svg
                viewBox="0 0 16 16"
                className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
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

      {/* Minimal footer */}
      <div className="flex items-center justify-center gap-6 border-t border-border pt-4 pb-2">
        <Link
          href="/changelog"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Changelog
        </Link>
        <span className="text-xs text-border">·</span>
        <Link
          href="/admin"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
