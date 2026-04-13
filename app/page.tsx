import { getCountries, getStats, getRecentUpdates } from '@/lib/queries/dashboard';
import { StatsRow } from '@/components/dashboard/stats-row';
import { CountryMatrix } from '@/components/dashboard/country-matrix';
import { RecentUpdates } from '@/components/dashboard/recent-updates';

export default async function HomePage() {
  const [countries, stats, recentUpdates] = await Promise.all([
    getCountries(),
    getStats(),
    getRecentUpdates(5),
  ]);

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Überblick über alle Zahlungsmarkt-Dokumente und Länder-Komplexitäten.
        </p>
      </div>

      {/* Stats row */}
      <StatsRow stats={stats} />

      {/* Country matrix */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Länder-Komplexität
          </h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-[#22c55e]" />
              Niedrig
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-[#f59e0b]" />
              Mittel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-[#ef4444]" />
              Hoch
            </span>
          </div>
        </div>
        <CountryMatrix countries={countries} />
      </section>

      {/* Recent updates */}
      <RecentUpdates updates={recentUpdates} />
    </div>
  );
}
