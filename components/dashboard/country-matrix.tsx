import Link from 'next/link';
import type { getCountries } from '@/lib/queries/dashboard';

type Country = Awaited<ReturnType<typeof getCountries>>[number];

const AMPEL_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

function AmpelDot({ complexity }: { complexity: string }) {
  const color = AMPEL_COLORS[complexity] ?? '#7d87a0';
  return (
    <span
      aria-label={complexity}
      style={{ backgroundColor: color }}
      className="inline-block size-2 rounded-full flex-shrink-0"
    />
  );
}

function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/laender/${country.code.toLowerCase()}`}
      className="group flex flex-col gap-2 rounded-lg bg-card p-3 ring-1 ring-foreground/10 transition-all duration-150 hover:ring-primary/60 hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase leading-none">
          {country.code}
        </span>
        <AmpelDot complexity={country.complexity} />
      </div>
      <span className="text-sm font-semibold leading-tight text-card-foreground line-clamp-2">
        {country.name}
      </span>
    </Link>
  );
}

interface CountryMatrixProps {
  countries: Awaited<ReturnType<typeof getCountries>>;
}

export function CountryMatrix({ countries }: CountryMatrixProps) {
  if (countries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Keine Länder gefunden — bitte{' '}
        <code className="font-mono text-xs">pnpm db:seed:countries</code> ausführen.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {countries.map((country) => (
        <CountryCard key={country.id} country={country} />
      ))}
    </div>
  );
}
