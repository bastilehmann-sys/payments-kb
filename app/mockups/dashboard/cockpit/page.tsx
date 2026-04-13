import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getLatestFormatVersions,
  getMockupCountries,
} from '@/lib/queries/dashboard-mockups';

export const metadata: Metadata = {
  title: 'Variante B: Treasury-Cockpit — Dashboard Mockups',
};

// Curated regulatory timeline entries
const TIMELINE_EVENTS = [
  { id: 'tfr', year: 2024, month: 12, label: 'TFR', full: 'Transfer of Funds Regulation', color: '#86bc25', slug: 'transfer-of-funds-regulation' },
  { id: 'mica', year: 2024, month: 6, label: 'MiCA', full: 'Markets in Crypto-Assets Regulation', color: '#4a9eff', slug: 'mica' },
  { id: 'dora', year: 2025, month: 1, label: 'DORA', full: 'Digital Operational Resilience Act', color: '#86bc25', slug: 'dora' },
  { id: 'sepa-rulebook', year: 2025, month: 11, label: 'SEPA Rulebook', full: 'SEPA Credit Transfer Rulebook 2025', color: '#86bc25', slug: 'sepa-credit-transfer' },
  { id: 'cbpr', year: 2025, month: 11, label: 'CBPR+', full: 'ISO 20022 Cross-Border Payments & Reporting', color: '#f59e0b', slug: 'cbpr-plus' },
  { id: 'psd3', year: 2026, month: 6, label: 'PSD3', full: 'Payment Services Directive 3 (TBD)', color: '#9b59b6', slug: 'psd3' },
];

// My-countries selection (hardcoded demo)
const MY_COUNTRIES = [
  { code: 'DE', name: 'Deutschland', complexity: 'medium' },
  { code: 'FR', name: 'Frankreich', complexity: 'medium' },
  { code: 'IT', name: 'Italien', complexity: 'high' },
  { code: 'GB', name: 'Vereinigtes Königreich', complexity: 'high' },
];

// Curated SAP relevance matrix
const SAP_MATRIX = [
  { title: 'Zahllauf-Formate', desc: 'pain.001 / DMEE / PMW', href: '/formate' },
  { title: 'Kontoauszug-Formate', desc: 'camt.053 / MT940 / SWIFT', href: '/formate' },
  { title: 'Länder-DMEE-Config', desc: 'Länderspez. Zahlungsformate', href: '/laender' },
  { title: 'Payment Medium Workbench', desc: 'PMW-Format-Konfiguration', href: '/formate' },
  { title: 'BCM-Konfiguration', desc: 'Bank Communication Mgmt', href: '/clearing' },
  { title: 'EBICS', desc: 'Bankanbindung & Übertragung', href: '/clearing' },
  { title: 'Mandatsverwaltung', desc: 'SEPA-Mandate & Lastschrift', href: '/zahlungsarten' },
  { title: 'Sanktions-Screening', desc: 'Compliance & Screening-Tools', href: '/regulatorik' },
  { title: 'Saldenabgleich', desc: 'Kontoabgleich & Reconciliation', href: '/ihb' },
  { title: 'CashPool-Reporting', desc: 'IHB & Konzern-Cash-Mgmt', href: '/ihb' },
  { title: 'Treasury-Integration', desc: 'TRM ↔ FI ↔ Bank', href: '/ihb' },
  { title: 'Zahlungsverkehr', desc: 'SCT / SDD / Instant / SWIFT', href: '/zahlungsarten' },
];

const COMPLEXITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

function formatMonthYear(year: number, month: number): string {
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  return `${months[month - 1]} ${year}`;
}

function timeAgoFromString(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'heute';
    if (days === 1) return 'gestern';
    if (days < 30) return `vor ${days} Tagen`;
    const months = Math.floor(days / 30);
    return `vor ${months} Mon.`;
  } catch {
    return dateStr;
  }
}

export default async function CockpitPage() {
  const [formatFeed, allCountries] = await Promise.all([
    getLatestFormatVersions(10),
    getMockupCountries(),
  ]);

  // Compute timeline SVG positions
  // Range: Jan 2024 → Dec 2026 = 36 months
  const SVG_W = 900;
  const SVG_H = 120;
  const PAD = 40;
  const RANGE_MONTHS = 36; // Jan 2024 → Dec 2026
  const START_YEAR = 2024;
  const START_MONTH = 1;

  function toX(year: number, month: number): number {
    const totalMonths = (year - START_YEAR) * 12 + (month - START_MONTH);
    return PAD + (totalMonths / RANGE_MONTHS) * (SVG_W - PAD * 2);
  }

  // Alternate top/bottom placement to avoid overlap
  const upperY = 40;
  const lowerY = 80;

  return (
    <div className="space-y-8">
      {/* Back + badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#4a9eff]/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#4a9eff]">
            Variante B
          </span>
          <span className="text-xs text-muted-foreground">Treasury-Cockpit</span>
        </div>
        <Link
          href="/mockups/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Dashboard Mockups
        </Link>
      </div>

      {/* ── Regulatorik Timeline ─────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Regulatorik-Timeline 2024–2026
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card p-4">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{ minWidth: '560px', height: `${SVG_H}px` }}
            aria-label="Regulatorik-Timeline"
          >
            {/* Baseline */}
            <line
              x1={PAD}
              y1={SVG_H / 2}
              x2={SVG_W - PAD}
              y2={SVG_H / 2}
              stroke="#e5e7eb"
              strokeWidth="2"
            />

            {/* Year markers */}
            {[2024, 2025, 2026].map((yr) => {
              const x = toX(yr, 1);
              return (
                <g key={yr}>
                  <line x1={x} y1={SVG_H / 2 - 6} x2={x} y2={SVG_H / 2 + 6} stroke="#9ca3af" strokeWidth="1.5" />
                  <text x={x} y={SVG_H - 6} textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="inherit">
                    {yr}
                  </text>
                </g>
              );
            })}

            {/* Events */}
            {TIMELINE_EVENTS.map((ev, i) => {
              const x = toX(ev.year, ev.month);
              const isUpper = i % 2 === 0;
              const dotY = SVG_H / 2;
              const labelY = isUpper ? upperY : lowerY;
              const lineEndY = isUpper ? dotY - 8 : dotY + 8;

              return (
                <g key={ev.id}>
                  {/* Connector line */}
                  <line x1={x} y1={lineEndY} x2={x} y2={labelY + (isUpper ? 4 : -4)} stroke={ev.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                  {/* Dot */}
                  <circle cx={x} cy={dotY} r="5" fill={ev.color} />
                  {/* Label background */}
                  <rect
                    x={x - 22}
                    y={isUpper ? labelY - 14 : labelY - 2}
                    width="44"
                    height="16"
                    rx="4"
                    fill={ev.color + '22'}
                  />
                  {/* Label text */}
                  <text
                    x={x}
                    y={isUpper ? labelY - 2 : labelY + 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill={ev.color}
                    fontFamily="inherit"
                  >
                    {ev.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Event legend below the SVG */}
          <div className="mt-3 flex flex-wrap gap-2">
            {TIMELINE_EVENTS.map((ev) => (
              <Link
                key={ev.id}
                href={`/regulatorik/${ev.slug}`}
                className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs transition-colors hover:border-primary/40 hover:bg-muted"
              >
                <span className="size-2 rounded-full shrink-0" style={{ background: ev.color }} />
                <span className="font-medium text-foreground">{ev.label}</span>
                <span className="text-muted-foreground">{formatMonthYear(ev.year, ev.month)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-column grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Col 1+2: Meine Länder + Format Feed */}

        {/* Meine Länder */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Meine Länder
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {MY_COUNTRIES.map((c) => (
              <Link
                key={c.code}
                href={`/laender/${c.code.toLowerCase()}`}
                className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                {/* Flag emoji via Unicode */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg">
                    {c.code
                      .split('')
                      .map((ch) => String.fromCodePoint(ch.charCodeAt(0) + 127397))
                      .join('')}
                  </span>
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ background: COMPLEXITY_COLOR[c.complexity] ?? '#86bc25' }}
                    title={`Komplexität: ${c.complexity}`}
                  />
                </div>
                <div>
                  <p className="font-mono text-xs font-semibold text-muted-foreground">{c.code}</p>
                  <p className="text-sm font-medium text-foreground leading-tight">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Format Changelog Feed */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Format-Changelog
          </h2>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
            {formatFeed.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                Keine Einträge
              </p>
            ) : (
              formatFeed.map((v) => (
                <Link
                  key={v.id}
                  href="/formate"
                  className="group flex items-start gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors"
                >
                  {/* Timeline dot */}
                  <div className="mt-1.5 flex shrink-0 flex-col items-center">
                    <span className="size-2 rounded-full bg-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{v.format_name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{v.version}</p>
                  </div>
                  {v.released && (
                    <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {timeAgoFromString(v.released)}
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>
        </section>

        {/* SAP Relevanz Kacheln */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            SAP-Relevanz-Matrix
          </h2>
          <div className="grid grid-cols-2 gap-1.5">
            {SAP_MATRIX.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-lg border border-border bg-card p-2.5 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
              >
                <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
