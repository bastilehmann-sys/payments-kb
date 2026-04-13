import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getMockupStats,
  getRecentAuditEntries,
  getHighComplexityCountries,
  getCurrentFormatVersions,
  getMockupCountries,
} from '@/lib/queries/dashboard-mockups';
import { HubSearchButton } from './hub-search-button';

export const metadata: Metadata = {
  title: 'Variante A: Wissens-Hub — Dashboard Mockups',
};

// Curated regulatory deadlines
const DEADLINES = [
  {
    id: 'dora',
    title: 'DORA',
    subtitle: 'Digital Operational Resilience Act',
    date: '17.01.2025',
    status: 'aktiv',
    color: 'green',
    slug: 'dora',
  },
  {
    id: 'sepa-instant',
    title: 'SEPA Instant Annahmepflicht',
    subtitle: 'Verpflichtende Instant-Zahlungen für PSPs',
    date: '09.10.2025',
    status: 'aktiv',
    color: 'green',
    slug: 'sepa-instant-payments-regulation',
  },
  {
    id: 'mt103',
    title: 'MT103 abgelöst',
    subtitle: 'SWIFT Migration zu ISO 20022',
    date: '22.11.2025',
    status: 'bevorstehend',
    color: 'amber',
    slug: 'swift-iso-20022',
  },
  {
    id: 'cbpr',
    title: 'ISO 20022 CBPR+',
    subtitle: 'Cross-Border Payments & Reporting',
    date: '22.11.2025',
    status: 'bevorstehend',
    color: 'amber',
    slug: 'cbpr-plus',
  },
];

const COMPLEXITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

function tableLabel(tableName: string): string {
  const MAP: Record<string, string> = {
    regulatorik_entries: 'Regulatorik',
    format_entries: 'Formate',
    clearing_entries: 'Clearing',
    zahlungsart_entries: 'Zahlungsarten',
    ihb_entries: 'IHB/POBO',
    countries: 'Länder',
  };
  return MAP[tableName] ?? tableName;
}

function timeAgo(date: Date | null): string {
  if (!date) return '—';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tagen`;
}

export default async function HubPage() {
  const [stats, auditEntries, highCountries, currentVersions, allCountries] = await Promise.all([
    getMockupStats(),
    getRecentAuditEntries(5),
    getHighComplexityCountries(5),
    getCurrentFormatVersions(),
    getMockupCountries(),
  ]);

  const complexityOrder = ['high', 'medium', 'low'] as const;

  return (
    <div className="space-y-10">
      {/* Back + badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Variante A
          </span>
          <span className="text-xs text-muted-foreground">Wissens-Hub</span>
        </div>
        <Link
          href="/mockups/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Dashboard Mockups
        </Link>
      </div>

      {/* ── Hero row: Title + Search ─────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent px-8 py-12 text-center">
        <div className="space-y-2">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            Payments Wissensdatenbank
          </h1>
          <p className="text-base text-muted-foreground">
            ISO 20022 · Regulatorik · Clearing · Länder · SAP Treasury
          </p>
        </div>
        {/* Search trigger — opens SearchDialog */}
        <HubSearchButton />
      </div>

      {/* ── Deadlines strip ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Regulatorische Deadlines
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {DEADLINES.map((d) => {
            const isGreen = d.color === 'green';
            const bg = isGreen ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200';
            const badgeBg = isGreen ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
            const dateBg = isGreen
              ? 'bg-green-500/10 text-green-700'
              : 'bg-amber-500/10 text-amber-700';

            return (
              <Link
                key={d.id}
                href={`/regulatorik/${d.slug}`}
                className={`group flex flex-col gap-2.5 rounded-lg border p-4 transition-all duration-150 hover:shadow-md ${bg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-heading text-sm font-semibold text-foreground leading-snug">
                    {d.title}
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badgeBg}`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{d.subtitle}</p>
                <span className={`self-start rounded-md px-2 py-0.5 text-xs font-mono font-medium ${dateBg}`}>
                  {d.date}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 3-column grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Col 1: Recent audit changes */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Letzte Änderungen
          </h2>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
            {auditEntries.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                Noch keine Änderungen
              </p>
            ) : (
              auditEntries.map((entry) => {
                const tableSlug =
                  entry.table_name === 'regulatorik_entries'
                    ? 'regulatorik'
                    : entry.table_name === 'format_entries'
                    ? 'formate'
                    : entry.table_name === 'clearing_entries'
                    ? 'clearing'
                    : entry.table_name === 'zahlungsart_entries'
                    ? 'zahlungsarten'
                    : entry.table_name === 'ihb_entries'
                    ? 'ihb'
                    : 'regulatorik';

                return (
                  <Link
                    key={entry.id}
                    href={`/edit/${entry.table_name}/${entry.row_id}`}
                    className="group flex items-start justify-between gap-2 px-4 py-3 text-sm hover:bg-muted/40 transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                          {tableLabel(entry.table_name)}
                        </span>
                        <span className="truncate text-xs text-muted-foreground font-mono">
                          {entry.field}
                        </span>
                      </div>
                      {entry.new_value && (
                        <p className="truncate text-xs text-foreground/60 mt-0.5">
                          → {entry.new_value.slice(0, 60)}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {timeAgo(entry.edited_at)}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Col 2: High-complexity countries */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            High-Complexity Länder
          </h2>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
            {highCountries.map((c) => (
              <Link
                key={c.id}
                href={`/laender/${c.code.toLowerCase()}`}
                className="group flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ background: COMPLEXITY_COLOR[c.complexity] ?? '#86bc25' }}
                >
                  !
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {c.code}
                    </span>
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </div>
                  {c.summary && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.summary}</p>
                  )}
                </div>
              </Link>
            ))}
            {highCountries.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                Keine High-Complexity Länder
              </p>
            )}
          </div>
        </section>

        {/* Col 3: Current format versions */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Aktuelle Format-Versionen
          </h2>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
            {currentVersions.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                Keine aktuellen Versionen
              </p>
            ) : (
              currentVersions.map((v) => (
                <Link
                  key={v.id}
                  href="/formate"
                  className="group flex items-center justify-between gap-2 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{v.format_name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{v.version}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {v.released && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {v.released}
                      </span>
                    )}
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                      aktuell
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── Compact Länder-Matrix ────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Länder-Komplexität
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {(['high', 'medium', 'low'] as const).map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ background: COMPLEXITY_COLOR[c] }}
                />
                {c === 'high' ? 'Hoch' : c === 'medium' ? 'Mittel' : 'Niedrig'}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allCountries.map((c) => (
            <Link
              key={c.id}
              href={`/laender/${c.code.toLowerCase()}`}
              title={c.name}
              className="group relative flex h-8 min-w-[2.75rem] items-center justify-center rounded-md border border-border px-2 text-xs font-mono font-medium text-foreground transition-all duration-150 hover:border-primary/60 hover:shadow-sm"
              style={{
                borderLeftWidth: '3px',
                borderLeftColor: COMPLEXITY_COLOR[c.complexity] ?? '#86bc25',
              }}
            >
              {c.code}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
