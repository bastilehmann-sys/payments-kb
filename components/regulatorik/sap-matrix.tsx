'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

type Item = Record<string, unknown>;
interface Props { items: Item[] }

const AUFWAND_COLORS: Record<string, string> = {
  S: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  M: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  L: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  XL: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

type SortKey = 'kuerzel' | 'name' | 'typ' | 'kategorie' | 'aufwand_tshirt';

export function RegulatorikSapMatrix({ items }: Props) {
  const [query, setQuery] = useState('');
  const [aufwandFilter, setAufwandFilter] = useState<'ALL' | 'S' | 'M' | 'L' | 'XL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('kuerzel');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = items.filter((it) => {
      if (aufwandFilter !== 'ALL' && String(it.aufwand_tshirt ?? '').trim().toUpperCase() !== aufwandFilter) return false;
      if (!q) return true;
      const hay = [it.kuerzel, it.name, it.sap_bezug].map(v => String(v ?? '').toLowerCase()).join(' | ');
      return hay.includes(q);
    });
    const cmp = (a: Item, b: Item) => {
      const av = String(a[sortKey] ?? '').toLowerCase();
      const bv = String(b[sortKey] ?? '').toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    };
    rows = [...rows].sort(cmp);
    return rows;
  }, [items, query, aufwandFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Regulatorik — SAP-Matrix</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{filtered.length} von {items.length} Einträgen sichtbar</p>
        </div>
        <Link href="/regulatorik" className="text-sm text-blue-600 hover:underline dark:text-blue-400">← zurück zur Übersicht</Link>
      </header>

      <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche in Kürzel, Name, SAP-Bezug…"
          className="w-80 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm"
        />
        <select
          value={aufwandFilter}
          onChange={(e) => setAufwandFilter(e.target.value as typeof aufwandFilter)}
          className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm"
        >
          <option value="ALL">Alle Aufwände</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-neutral-50 dark:bg-neutral-900 text-left">
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              <SortHeader label="Kürzel"    sortKey="kuerzel"        active={sortKey} dir={sortDir} onClick={handleSort} sticky />
              <SortHeader label="Name"      sortKey="name"           active={sortKey} dir={sortDir} onClick={handleSort} />
              <SortHeader label="Typ"       sortKey="typ"            active={sortKey} dir={sortDir} onClick={handleSort} />
              <SortHeader label="Kategorie" sortKey="kategorie"      active={sortKey} dir={sortDir} onClick={handleSort} />
              <SortHeader label="Aufwand"   sortKey="aufwand_tshirt" active={sortKey} dir={sortDir} onClick={handleSort} />
              <th className="px-3 py-2 font-medium">SAP-Bezug</th>
              <th className="px-3 py-2 font-medium">Bußgeld</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it, i) => {
              const kuerzel = String(it.kuerzel ?? '');
              const aufwand = String(it.aufwand_tshirt ?? '').trim().toUpperCase();
              const aufwandCls = AUFWAND_COLORS[aufwand] ?? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
              const bussgeld = String(it.bussgeld ?? '');
              return (
                <tr key={String(it.id ?? i)} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="sticky left-0 bg-white dark:bg-neutral-950 px-3 py-2 font-mono text-xs font-semibold">
                    <Link href={`/regulatorik?highlight=${encodeURIComponent(kuerzel)}`} className="hover:underline">{kuerzel}</Link>
                  </td>
                  <td className="px-3 py-2">{String(it.name ?? '')}</td>
                  <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{String(it.typ ?? '')}</td>
                  <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{String(it.kategorie ?? '')}</td>
                  <td className="px-3 py-2">
                    {aufwand ? (
                      <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${aufwandCls}`}>{aufwand}</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{String(it.sap_bezug ?? '')}</td>
                  <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400 max-w-xs truncate" title={bussgeld}>{bussgeld}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortHeader({ label, sortKey, active, dir, onClick, sticky }: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: 'asc' | 'desc';
  onClick: (k: SortKey) => void;
  sticky?: boolean;
}) {
  const isActive = active === sortKey;
  const arrow = isActive ? (dir === 'asc' ? '↑' : '↓') : '';
  return (
    <th className={`px-3 py-2 font-medium cursor-pointer select-none ${sticky ? 'sticky left-0 bg-neutral-50 dark:bg-neutral-900' : ''}`} onClick={() => onClick(sortKey)}>
      {label} {arrow && <span className="text-neutral-400">{arrow}</span>}
    </th>
  );
}
