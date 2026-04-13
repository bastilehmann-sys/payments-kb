import { listCountries } from '@/lib/queries/documents';
import { CountryMatrix } from '@/components/dashboard/country-matrix';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Länder — Payments KB',
};

export default async function LaenderPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const countries = await listCountries();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Länder</h1>
        <p className="text-sm text-muted-foreground">
          Länder-Komplexitäten und Profile für internationale Zahlungen.
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
        <span className="ml-auto text-muted-foreground/60">
          {countries.length} {countries.length === 1 ? 'Land' : 'Länder'}
        </span>
      </div>

      <CountryMatrix countries={countries} />
    </div>
  );
}
