'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DocumentDetail } from '@/components/browse/document-detail';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Column = {
  key: string;
  label: string;
  section?: string;
};

export type SplitViewProps<T extends Record<string, unknown>> = {
  items: T[];
  columns: Column[];
  primaryField: keyof T;
  secondaryField: keyof T;
  searchFields: (keyof T)[];
  filterField?: keyof T;
  filterLabel?: string;
  emptyLabel?: string;
  idField?: keyof T;
  /** Optional extra line shown in list item (e.g. abbreviation) */
  tertiaryField?: keyof T;
  /** Detail header badge/extra (e.g. abkuerzung next to name) */
  headerBadgeField?: keyof T;
  /** Complexity dot for countries */
  complexityField?: keyof T;
  /** Document markdown to append at end of detail */
  documentField?: keyof T;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-muted-foreground/60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="6.5" r="4" />
      <path d="M9.5 9.5L13 13" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3L5 8l5 5" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M10 2h4m0 0v4M14 2L7.5 8.5" />
    </svg>
  );
}

// ─── Complexity dot ───────────────────────────────────────────────────────────

const COMPLEXITY_COLOR: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const COMPLEXITY_LABEL: Record<string, string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
};

function ComplexityDot({ value }: { value: string }) {
  const color = COMPLEXITY_COLOR[value] ?? '#7d87a0';
  const label = COMPLEXITY_LABEL[value] ?? value;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color }}>
      <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getItemId<T extends Record<string, unknown>>(item: T, idField?: keyof T): string {
  if (idField) return String(item[idField] ?? '');
  if ('id' in item) return String(item['id'] ?? '');
  return String(item['code'] ?? item['name'] ?? '');
}

function str(val: unknown): string {
  if (val == null) return '';
  return String(val);
}

// Group paired fields: e.g. beschreibung_experte + beschreibung_einsteiger → paired
function groupPairs(columns: Column[]): Array<{ type: 'pair'; base: string; expert: Column; beginner: Column; section: string } | { type: 'single'; col: Column }> {
  const result: Array<{ type: 'pair'; base: string; expert: Column; beginner: Column; section: string } | { type: 'single'; col: Column }> = [];
  const used = new Set<string>();

  for (const col of columns) {
    if (used.has(col.key)) continue;

    if (col.key.endsWith('_experte')) {
      const base = col.key.slice(0, -'_experte'.length);
      const partnered = columns.find((c) => c.key === base + '_einsteiger');
      if (partnered && !used.has(partnered.key)) {
        used.add(col.key);
        used.add(partnered.key);
        result.push({
          type: 'pair',
          base,
          expert: col,
          beginner: partnered,
          section: col.section ?? 'Allgemein',
        });
        continue;
      }
    }

    used.add(col.key);
    result.push({ type: 'single', col });
  }

  return result;
}

// ─── Detail section heading ───────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-3 mt-8 bg-card px-4 py-3 first:mt-0 md:-mx-10 md:px-10">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#86bc25]/80">
        {title}
      </h3>
    </div>
  );
}

// ─── Single field row ─────────────────────────────────────────────────────────

function FieldRow({ label, value }: { label: string; value: string }) {
  const isLink = value.startsWith('http');
  return (
    <div className="mb-6">
      <dt className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
        {label}
      </dt>
      <dd className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#86bc25] hover:underline break-all"
          >
            {value}
            <IconExternalLink />
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

// ─── Paired field row ─────────────────────────────────────────────────────────

function PairedRow({
  expertLabel,
  expertValue,
  beginnerLabel,
  beginnerValue,
}: {
  expertLabel: string;
  expertValue: string;
  beginnerLabel: string;
  beginnerValue: string;
}) {
  const hasExpert = !!expertValue;
  const hasBeginner = !!beginnerValue;
  if (!hasExpert && !hasBeginner) return null;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {hasExpert && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <dt className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#4a9eff]/80">
            {expertLabel}
          </dt>
          <dd className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">
            {expertValue}
          </dd>
        </div>
      )}
      {hasBeginner && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <dt className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#86bc25]/80">
            {beginnerLabel}
          </dt>
          <dd className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">
            {beginnerValue}
          </dd>
        </div>
      )}
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel<T extends Record<string, unknown>>({
  item,
  columns,
  primaryField,
  secondaryField,
  headerBadgeField,
  complexityField,
  documentField,
}: {
  item: T | null;
  columns: Column[];
  primaryField: keyof T;
  secondaryField: keyof T;
  headerBadgeField?: keyof T;
  complexityField?: keyof T;
  documentField?: keyof T;
}) {
  if (!item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30">
          <svg viewBox="0 0 24 24" className="size-5 text-muted-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground/60">Eintrag auswählen</p>
        <p className="text-xs text-muted-foreground/40">Klick auf einen Eintrag in der linken Liste</p>
      </div>
    );
  }

  const primaryVal = str(item[primaryField]);
  const secondaryVal = str(item[secondaryField]);
  const badgeVal = headerBadgeField ? str(item[headerBadgeField]) : '';
  const complexityVal = complexityField ? str(item[complexityField]) : '';
  const documentMd = documentField ? str(item[documentField]) : '';

  const grouped = groupPairs(columns);

  // Build sections map
  const sectionMap: Record<string, typeof grouped> = {};
  for (const entry of grouped) {
    const sectionKey = entry.type === 'pair' ? entry.section : (entry.col.section ?? 'Allgemein');
    if (!sectionMap[sectionKey]) sectionMap[sectionKey] = [];
    sectionMap[sectionKey].push(entry);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-10 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-4xl font-bold text-foreground leading-tight tracking-tight">
                {primaryVal || '—'}
              </h2>
              {badgeVal && (
                <span className="rounded-full border border-[#86bc25]/40 bg-[#86bc25]/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#86bc25]">
                  {badgeVal}
                </span>
              )}
            </div>
            {secondaryVal && (
              <p className="mt-2 text-lg text-muted-foreground">{secondaryVal}</p>
            )}
          </div>
          {complexityVal && (
            <div className="shrink-0">
              <ComplexityDot value={complexityVal} />
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-10">

        <dl>
          {Object.entries(sectionMap).map(([section, entries]) => (
            <div key={section}>
              <SectionHeading title={section} />
              {entries.map((entry) => {
                if (entry.type === 'pair') {
                  const ev = str(item[entry.expert.key as keyof T]);
                  const bv = str(item[entry.beginner.key as keyof T]);
                  if (!ev && !bv) return null;
                  return (
                    <PairedRow
                      key={entry.base}
                      expertLabel={entry.expert.label}
                      expertValue={ev}
                      beginnerLabel={entry.beginner.label}
                      beginnerValue={bv}
                    />
                  );
                } else {
                  const val = str(item[entry.col.key as keyof T]);
                  if (!val) return null;
                  return <FieldRow key={entry.col.key} label={entry.col.label} value={val} />;
                }
              })}
            </div>
          ))}

          {/* Linked document markdown */}
          {documentMd && (
            <div>
              <SectionHeading title="Vollständiges Länderprofil" />
              <DocumentDetail content={documentMd} />
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

// ─── List item ────────────────────────────────────────────────────────────────

function ListItem<T extends Record<string, unknown>>({
  item,
  isSelected,
  primaryField,
  secondaryField,
  tertiaryField,
  complexityField,
  onClick,
}: {
  item: T;
  isSelected: boolean;
  primaryField: keyof T;
  secondaryField: keyof T;
  tertiaryField?: keyof T;
  complexityField?: keyof T;
  onClick: () => void;
}) {
  const primary = str(item[primaryField]);
  const secondary = str(item[secondaryField]);
  const tertiary = tertiaryField ? str(item[tertiaryField]) : '';
  const complexity = complexityField ? str(item[complexityField]) : '';
  const complexityColor = complexity ? (COMPLEXITY_COLOR[complexity] ?? '#7d87a0') : '';

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full text-left px-3 py-3 rounded-md transition-all duration-100 border',
        isSelected
          ? 'bg-[#86bc25]/10 border-[#86bc25]/40 shadow-sm'
          : 'border-transparent hover:bg-muted/40 hover:border-border',
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r bg-[#86bc25]" />
      )}
      <div className="pl-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className={cn('text-base font-semibold leading-snug line-clamp-1', isSelected ? 'text-foreground' : 'text-foreground/80')}>
            {primary || '—'}
          </span>
          {complexityColor && (
            <span className="inline-block size-2 shrink-0 rounded-full" style={{ backgroundColor: complexityColor }} />
          )}
        </div>
        {secondary && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1">
            {secondary}
          </p>
        )}
        {tertiary && (
          <p className="text-xs text-muted-foreground/60 leading-snug">{tertiary}</p>
        )}
      </div>
    </button>
  );
}

// ─── Main SplitView ───────────────────────────────────────────────────────────

export function SplitView<T extends Record<string, unknown>>({
  items,
  columns,
  primaryField,
  secondaryField,
  searchFields,
  filterField,
  filterLabel = 'Alle',
  emptyLabel = 'Keine Einträge',
  idField,
  tertiaryField,
  headerBadgeField,
  complexityField,
  documentField,
}: SplitViewProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-based selection
  const urlId = searchParams.get('id') ?? searchParams.get('code');

  const [search, setSearch] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');
  const [showDetail, setShowDetail] = React.useState(false); // mobile toggle

  const getIdOf = React.useCallback((item: T) => getItemId(item, idField), [idField]);

  // Derive selected from URL or default to first
  const selectedId = React.useMemo(() => {
    if (urlId) {
      const found = items.find((i) => getIdOf(i) === urlId);
      if (found) return urlId;
    }
    return items[0] ? getIdOf(items[0]) : null;
  }, [urlId, items, getIdOf]);

  const setSelected = React.useCallback((id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Use 'code' for countries (code field), 'id' for others
    const paramKey = idField === 'code' ? 'code' : 'id';
    params.set(paramKey, id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setShowDetail(true);
  }, [router, pathname, searchParams, idField]);

  const filterOptions = React.useMemo(() => {
    if (!filterField) return [];
    return [...new Set(items.map((i) => str(i[filterField])).filter(Boolean))].sort();
  }, [items, filterField]);

  const filtered = React.useMemo(() => {
    let rows = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        searchFields.some((f) => str(r[f]).toLowerCase().includes(q))
      );
    }
    if (filterValue && filterField) {
      rows = rows.filter((r) => str(r[filterField]) === filterValue);
    }
    return rows;
  }, [items, search, filterValue, filterField, searchFields]);

  // If selected item filtered out, auto-select first visible
  React.useEffect(() => {
    if (selectedId && !filtered.find((r) => getIdOf(r) === selectedId)) {
      if (filtered[0]) {
        setSelected(getIdOf(filtered[0]));
      }
    }
  }, [filtered, selectedId, getIdOf, setSelected]);

  const selectedItem = items.find((r) => getIdOf(r) === selectedId) ?? null;

  // ── Left pane controls ──────────────────────────────────────────────────────
  const controls = (
    <div className="shrink-0 space-y-2 border-b border-border px-3 py-3">
      <div className="flex h-11 items-center gap-2 rounded-md border border-border bg-muted/30 px-3">
        <IconSearch />
        <input
          type="text"
          placeholder="Suche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
            <IconClose />
          </button>
        )}
      </div>

      {filterField && filterOptions.length > 0 && (
        <div className="relative">
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="h-11 w-full appearance-none rounded-md border border-border bg-muted/30 px-3 pr-7 text-base text-foreground outline-none focus:border-[#86bc25]/60"
          >
            <option value="">{filterLabel}</option>
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <IconChevron />
          </span>
        </div>
      )}

      <p className="text-sm text-muted-foreground/60 px-1">
        {filtered.length} von {items.length} Einträgen
      </p>
    </div>
  );

  // ── List ────────────────────────────────────────────────────────────────────
  const list = (
    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-xs text-muted-foreground/60">{emptyLabel}</p>
      ) : (
        filtered.map((item) => {
          const id = getIdOf(item);
          return (
            <ListItem
              key={id}
              item={item}
              isSelected={id === selectedId}
              primaryField={primaryField}
              secondaryField={secondaryField}
              tertiaryField={tertiaryField}
              complexityField={complexityField}
              onClick={() => setSelected(id)}
            />
          );
        })
      )}
    </div>
  );

  // ── Detail ──────────────────────────────────────────────────────────────────
  const detail = (
    <DetailPanel
      item={selectedItem}
      columns={columns}
      primaryField={primaryField}
      secondaryField={secondaryField}
      headerBadgeField={headerBadgeField}
      complexityField={complexityField}
      documentField={documentField}
    />
  );

  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden lg:flex h-full">
        {/* Left master list */}
        <div className="flex w-[340px] shrink-0 flex-col border-r border-border">
          {controls}
          {list}
        </div>
        {/* Right detail */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {detail}
        </div>
      </div>

      {/* Mobile: toggle between list and detail */}
      <div className="lg:hidden flex flex-col h-full">
        {showDetail && selectedItem ? (
          <>
            <div className="shrink-0 border-b border-border px-4 py-3">
              <button
                onClick={() => setShowDetail(false)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconBack />
                Zurück zur Liste
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              {detail}
            </div>
          </>
        ) : (
          <>
            {controls}
            {list}
          </>
        )}
      </div>
    </>
  );
}
