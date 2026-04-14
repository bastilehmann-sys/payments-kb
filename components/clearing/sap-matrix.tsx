'use client';

import { useMemo, useState } from 'react';

type Item = Record<string, unknown>;
interface Props {
  items: Item[];
}

type SortKey = 'abkuerzung' | 'name' | 'region' | 'nachrichtenformat';

export function ClearingSapMatrix({ items }: Props) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('abkuerzung');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = items.filter((it) => {
      if (!q) return true;
      const hay = [it.abkuerzung, it.name, it.region, it.sap_bezug, it.nachrichtenformat]
        .map((v) => String(v ?? '').toLowerCase())
        .join(' | ');
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
  }, [items, query, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Clearing — SAP-Matrix</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} von {items.length} Clearing-Systemen sichtbar
          </p>
        </div>
      </header>

      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche in Abk., Name, Region, SAP-Bezug…"
          className="w-80 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/50 text-left">
            <tr className="border-b border-border">
              <SortHeader label="Abk."            sortKey="abkuerzung"       active={sortKey} dir={sortDir} onClick={handleSort} sticky />
              <SortHeader label="Name"            sortKey="name"             active={sortKey} dir={sortDir} onClick={handleSort} />
              <SortHeader label="Region"          sortKey="region"           active={sortKey} dir={sortDir} onClick={handleSort} />
              <SortHeader label="Nachrichtenformat" sortKey="nachrichtenformat" active={sortKey} dir={sortDir} onClick={handleSort} />
              <th className="px-3 py-2 font-medium">Settlement</th>
              <th className="px-3 py-2 font-medium">SAP-Bezug</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it, i) => (
              <tr
                key={String(it.id ?? i)}
                className="border-b border-border/60 hover:bg-muted/30"
              >
                <td className="sticky left-0 bg-background px-3 py-2 font-mono text-xs font-semibold">
                  {String(it.abkuerzung ?? '')}
                </td>
                <td className="px-3 py-2">{String(it.name ?? '')}</td>
                <td className="px-3 py-2 text-muted-foreground">{String(it.region ?? '')}</td>
                <td className="px-3 py-2 text-muted-foreground">{String(it.nachrichtenformat ?? '')}</td>
                <td className="px-3 py-2 text-muted-foreground">{String(it.settlement_modell ?? '')}</td>
                <td className="px-3 py-2">{String(it.sap_bezug ?? '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onClick,
  sticky,
}: {
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
    <th
      className={`px-3 py-2 font-medium cursor-pointer select-none ${
        sticky ? 'sticky left-0 bg-muted/50' : ''
      }`}
      onClick={() => onClick(sortKey)}
    >
      {label} {arrow && <span className="text-muted-foreground">{arrow}</span>}
    </th>
  );
}
