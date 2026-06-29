import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/db/client';
import {
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  ihbEntries,
  countries,
  technikEntries,
} from '@/db/schema';
import { asc } from 'drizzle-orm';
import { getScopeAnalyses } from '@/lib/queries/scope';
import { ScopeClient } from './scope-client';
import type { KbData } from '@/lib/scope/engine';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scope-Analyse — Payments KB',
};

export default async function ScopePage() {
  const session = await auth();
  if (!session) redirect('/login');

  const [
    regulatorik,
    formate,
    clearing,
    ihb,
    countryList,
    technik,
    savedAnalyses,
  ] = await Promise.all([
    db.select({
      id:                      regulatorikEntries.id,
      name:                    regulatorikEntries.name,
      kuerzel:                 regulatorikEntries.kuerzel,
      kategorie:               regulatorikEntries.kategorie,
      geltungsbereich:         regulatorikEntries.geltungsbereich,
      beschreibung_einsteiger: regulatorikEntries.beschreibung_einsteiger,
      aufwand_tshirt:          regulatorikEntries.aufwand_tshirt,
    }).from(regulatorikEntries),

    db.select({
      id:                      formatEntries.id,
      format_name:             formatEntries.format_name,
      region:                  formatEntries.region,
      nachrichtentyp:          formatEntries.nachrichtentyp,
      familie_standard:        formatEntries.familie_standard,
      beschreibung_einsteiger: formatEntries.beschreibung_einsteiger,
    }).from(formatEntries),

    db.select({
      id:         clearingEntries.id,
      name:       clearingEntries.name,
      abkuerzung: clearingEntries.abkuerzung,
      region:     clearingEntries.region,
      cut_off:    clearingEntries.cut_off,
      typ:        clearingEntries.typ,
    }).from(clearingEntries),

    db.select({
      id:           ihbEntries.id,
      land:         ihbEntries.land,
      iso_waehrung: ihbEntries.iso_waehrung,
      pobo_status:  ihbEntries.pobo_status,
      cobo_status:  ihbEntries.cobo_status,
      ihb_bewertung:ihbEntries.ihb_bewertung,
      netting_erlaubt: ihbEntries.netting_erlaubt,
      lokales_konto:   ihbEntries.lokales_konto,
    }).from(ihbEntries),

    db.select({
      code:         countries.code,
      name:         countries.name,
      complexity:   countries.complexity,
      currency:     countries.currency,
      payment_infra: countries.payment_infra,
    }).from(countries).orderBy(asc(countries.name)),

    db.select({
      id:           technikEntries.id,
      name:         technikEntries.name,
      subtitle:     technikEntries.subtitle,
      category:     technikEntries.category,
      komplexitaet: technikEntries.komplexitaet,
      einsatzgebiet: technikEntries.einsatzgebiet,
      badges:       technikEntries.badges,
      tags:         technikEntries.tags,
    }).from(technikEntries),

    getScopeAnalyses(),
  ]);

  const kbData: KbData = { regulatorik, formate, clearing, ihb, countries: countryList, technik };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <ScopeClient kbData={kbData} initialSaved={savedAnalyses} />
    </div>
  );
}
