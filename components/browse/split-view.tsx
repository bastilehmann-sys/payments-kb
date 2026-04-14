'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DocumentDetail } from '@/components/browse/document-detail';
import { CountryBlocksView } from '@/components/browse/country-blocks-view';
import { splitToBullets, splitIntoSubtopics } from '@/lib/text/split-to-bullets';
import type { CountryBlockGroup } from '@/lib/queries/documents';

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
  /** Field to use as Management Summary callout at top of detail */
  summaryField?: keyof T;
  /** Optional extra content rendered between Management Summary and Einsteiger/Experte toggle */
  extraDetailHeader?: (item: T) => React.ReactNode;
  /** Table name for edit button (e.g. 'regulatorik_entries') */
  editTable?: string;
  /**
   * Map of country code → structured block data.
   * When set and the selected item has a matching code, renders block tables
   * INSTEAD of the document markdown.
   */
  countryBlocksMap?: Record<string, CountryBlockGroup[]>;
  /**
   * Optional panel rendered at the very bottom of the detail view,
   * below all tabs/sections content. Useful for cross-link panels.
   */
  relatedPanel?: (item: T) => React.ReactNode;
  /**
   * Optional links pinned above the filtered list in the sidebar.
   * Use e.g. for overview / matrix pages that live outside the item list.
   */
  pinnedLinks?: {
    label: string;
    sublabel?: string;
    /** If set, clicking navigates to this route (external). */
    href?: string;
    /** If set, clicking keeps the user on this page and renders this in the detail pane. */
    content?: React.ReactNode;
  }[];
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

function IconPencil() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" />
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
    <span className="inline-flex items-center gap-1.5 text-base" style={{ color }}>
      <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// ─── Field value renderer ─────────────────────────────────────────────────────

/**
 * Render a single bullet item, applying sub-topic splitting when the item
 * contains 2+ ALL-CAPS topic markers (e.g. "SAP-Implikation:", "NEU:").
 */
function renderBulletItem(item: string, key: number): React.ReactNode {
  const sub = splitIntoSubtopics(item);
  if (sub.kind === 'subtopics') {
    return (
      <li key={key} className="text-base leading-relaxed text-foreground/90">
        {sub.intro && (
          <p className="mb-1.5 text-base leading-relaxed italic text-foreground/80">{sub.intro}</p>
        )}
        <ul className="mt-1.5 list-none space-y-1.5 pl-0">
          {sub.topics.map((t, i) => (
            <li key={`${i}-${t.label}`} className="text-base">
              <span className="mr-1.5 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[13px] font-semibold text-primary">
                {t.label}
              </span>
              <span className="text-foreground/90">{t.body}</span>
            </li>
          ))}
        </ul>
      </li>
    );
  }
  return (
    <li key={key} className="text-lg leading-relaxed text-foreground/90">{item}</li>
  );
}

/**
 * Render a field value, auto-detecting list patterns via the shared
 * splitToBullets utility (rules 1-6) plus a line-break fallback.
 * Each bullet item is further processed for embedded ALL-CAPS sub-topics.
 */
function renderFieldValue(value: string): React.ReactNode {
  if (!value) return null;

  // ── Rules 1-6: shared splitter
  const result = splitToBullets(value);
  if (result.kind === 'list') {
    return (
      <>
        {result.intro && (
          <p className="mb-2 whitespace-pre-line text-lg leading-relaxed text-foreground/90">
            {result.intro}
          </p>
        )}
        <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/60">
          {result.items.map((item, i) => renderBulletItem(item, i))}
        </ul>
      </>
    );
  }

  // ── Fallback: line-break pattern (2+ newlines)
  if ((value.match(/\n/g) ?? []).length >= 2) {
    const lineParts = value.split('\n').map((s) => s.trim()).filter(Boolean);
    if (lineParts.length >= 2) {
      return (
        <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/60">
          {lineParts.map((item, i) => renderBulletItem(item, i))}
        </ul>
      );
    }
  }

  // ── Plain text
  return <p className="whitespace-pre-line">{value}</p>;
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
    <div className="mb-3 mt-10 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0">
      <h3 className="font-heading text-base font-semibold uppercase tracking-wider text-[#86bc25]/80">
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
      <dt className="mb-1.5 text-base font-semibold uppercase tracking-wider text-muted-foreground/60">
        {label}
      </dt>
      <dd className="text-lg text-foreground/85 leading-relaxed">
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
          renderFieldValue(value)
        )}
      </dd>
    </div>
  );
}

// ─── Mode type ────────────────────────────────────────────────────────────────

type Mode = 'einsteiger' | 'experte';

// ─── Merged paired field row ──────────────────────────────────────────────────

function MergedPairedRow({
  label,
  expertValue,
  beginnerValue,
}: {
  label: string;
  expertValue: string;
  beginnerValue: string;
  mode?: Mode;
}) {
  // Merge both variants into a single continuous block — no distinction shown.
  const parts = [beginnerValue, expertValue].filter((v) => v && v.trim());
  if (parts.length === 0) return null;
  const merged = parts.join('\n\n');
  return <FieldRow label={label} value={merged} />;
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
  summaryField,
  extraDetailHeader,
  editTable,
  itemId,
  countryBlocks,
  relatedPanel,
}: {
  item: T | null;
  columns: Column[];
  primaryField: keyof T;
  secondaryField: keyof T;
  headerBadgeField?: keyof T;
  complexityField?: keyof T;
  documentField?: keyof T;
  summaryField?: keyof T;
  extraDetailHeader?: (item: T) => React.ReactNode;
  editTable?: string;
  itemId?: string;
  countryBlocks?: CountryBlockGroup[];
  relatedPanel?: (item: T) => React.ReactNode;
}) {
  const [mode, setMode] = React.useState<Mode>('einsteiger');
  const [activeTab, setActiveTab] = React.useState<string>('');

  // Reset mode and active tab whenever the selected item changes
  React.useEffect(() => {
    setMode('einsteiger');
    setActiveTab('');
  }, [item]);

  if (!item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30">
          <svg viewBox="0 0 24 24" className="size-5 text-muted-foreground/40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-base text-muted-foreground/60">Eintrag auswählen</p>
        <p className="text-base text-muted-foreground/40">Klick auf einen Eintrag in der linken Liste</p>
      </div>
    );
  }

  const primaryVal = str(item[primaryField]);
  const secondaryVal = str(item[secondaryField]);
  const badgeVal = headerBadgeField ? str(item[headerBadgeField]) : '';
  const complexityVal = complexityField ? str(item[complexityField]) : '';
  const documentMd = documentField ? str(item[documentField]) : '';
  const summaryVal = summaryField ? str(item[summaryField]) : '';

  // Determine which column keys to exclude from the section rendering:
  // - the summaryField itself (rendered as the callout card above)
  // - if summaryField ends with "_einsteiger", also suppress the paired _einsteiger column
  //   (the _experte partner will be rendered as a single field instead of a pair)
  const summaryKey = summaryField ? String(summaryField) : '';
  const summaryIsEinsteiger = summaryKey.endsWith('_einsteiger');

  // Build the filtered columns for section rendering
  const filteredColumns = summaryKey
    ? columns.filter((col) => col.key !== summaryKey)
    : columns;

  // For the paired rendering: when summaryField is the _einsteiger half of a pair,
  // convert the _experte column to a plain single field (rename label by stripping " (Experte)" suffix)
  const displayColumns: Column[] = summaryIsEinsteiger
    ? filteredColumns.map((col) => {
        const expectedExpert = summaryKey.slice(0, -'_einsteiger'.length) + '_experte';
        if (col.key === expectedExpert) {
          const newLabel = col.label.replace(/\s*\(Experte\)\s*$/i, '').trim() || col.label;
          return { ...col, label: newLabel };
        }
        return col;
      })
    : filteredColumns;

  const grouped = groupPairs(displayColumns);

  // Build sections map, preserving insertion order
  const sectionMap: Record<string, typeof grouped> = {};
  for (const entry of grouped) {
    const sectionKey = entry.type === 'pair' ? entry.section : (entry.col.section ?? 'Allgemein');
    if (!sectionMap[sectionKey]) sectionMap[sectionKey] = [];
    sectionMap[sectionKey].push(entry);
  }

  // Determine if any paired fields exist (to conditionally show toggle)
  const hasPairs = grouped.some((e) => e.type === 'pair');

  // Strip base label from pair — remove trailing " (Experte)" or " (Einsteiger)" suffix,
  // then also remove the remaining " (Experte)" from the expert column label if present.
  function stripPairLabel(expertLabel: string): string {
    return expertLabel
      .replace(/\s*\(Experte\)\s*$/i, '')
      .replace(/\s*\(Einsteiger\)\s*$/i, '')
      .trim();
  }

  // Helper: check if a section has any visible data for the current item
  function sectionHasData(entries: typeof grouped): boolean {
    return entries.some((entry) => {
      if (entry.type === 'pair') {
        return (
          !!str(item![entry.expert.key as keyof T]) ||
          !!str(item![entry.beginner.key as keyof T])
        );
      }
      return !!str(item![entry.col.key as keyof T]);
    });
  }

  // Only include sections that have at least one non-empty value for this item
  const visibleSections = Object.keys(sectionMap).filter((s) =>
    sectionHasData(sectionMap[s])
  );

  // Determine the effective active tab (first visible section as default)
  const effectiveTab =
    activeTab && visibleSections.includes(activeTab)
      ? activeTab
      : visibleSections[0] ?? '';

  // When country blocks are present, skip column-section tabs and use block tabs directly
  const hasCountryBlocks = countryBlocks && countryBlocks.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-10 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-5xl font-bold text-foreground leading-tight tracking-tight">
                {primaryVal || '—'}
              </h2>
              {badgeVal && (
                <span className="rounded-full border border-[#86bc25]/40 bg-[#86bc25]/10 px-2.5 py-1 text-base font-bold uppercase tracking-wider text-[#86bc25]">
                  {badgeVal}
                </span>
              )}
            </div>
            {secondaryVal && (
              <p className="mt-2 text-xl text-muted-foreground">{secondaryVal}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {complexityVal && <ComplexityDot value={complexityVal} />}
            {editTable && itemId && (
              <a
                href={`/edit/${editTable}/${itemId}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-[#86bc25]/40 hover:bg-[#86bc25]/5 hover:text-[#86bc25]"
                title="Bearbeiten"
              >
                <IconPencil />
                Bearbeiten
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-10">

        {/* Management Summary callout */}
        {summaryVal && (
          <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="mb-2 text-base font-semibold uppercase tracking-wider text-primary">
              Management Summary
            </div>
            <div className="text-lg leading-relaxed text-foreground/90">
              {renderFieldValue(summaryVal)}
            </div>
          </div>
        )}

        {/* Extra detail header (e.g. sample file card) */}
        {extraDetailHeader && item && extraDetailHeader(item)}

        {/* ── Country with block tabs: render metadata above, then block tabs ── */}
        {hasCountryBlocks ? (
          <>
            {/* Top-level column fields (code, name, complexity, currency, etc.) */}
            {visibleSections.length > 0 && (
              <dl className="mb-8">
                {visibleSections.map((section) => (
                  <div key={section}>
                    {visibleSections.length > 1 && <SectionHeading title={section} />}
                    {sectionMap[section].map((entry) => {
                      if (entry.type === 'pair') {
                        const ev = str(item[entry.expert.key as keyof T]);
                        const bv = str(item[entry.beginner.key as keyof T]);
                        if (!ev && !bv) return null;
                        return (
                          <MergedPairedRow
                            key={entry.base}
                            label={stripPairLabel(entry.expert.label)}
                            expertValue={ev}
                            beginnerValue={bv}
                            mode={mode}
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
              </dl>
            )}
            {/* Block tabs */}
            <CountryBlocksView blocks={countryBlocks!} />
          </>
        ) : (
          /* ── Standard column-section tabs ── */
          <>
            {/* Tab bar — only render when there are 2+ visible sections */}
            {visibleSections.length > 1 && (
              <div className="mb-6 flex items-center gap-1 border-b border-border overflow-x-auto">
                {visibleSections.map((name) => (
                  <button
                    key={name}
                    onClick={() => setActiveTab(name)}
                    className={cn(
                      'px-4 py-2.5 text-base font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                      effectiveTab === name
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            {/* Active section entries */}
            {effectiveTab && (
              <dl>
                {(sectionMap[effectiveTab] ?? []).map((entry) => {
                  if (entry.type === 'pair') {
                    const ev = str(item[entry.expert.key as keyof T]);
                    const bv = str(item[entry.beginner.key as keyof T]);
                    if (!ev && !bv) return null;
                    return (
                      <MergedPairedRow
                        key={entry.base}
                        label={stripPairLabel(entry.expert.label)}
                        expertValue={ev}
                        beginnerValue={bv}
                        mode={mode}
                      />
                    );
                  } else {
                    const val = str(item[entry.col.key as keyof T]);
                    if (!val) return null;
                    return <FieldRow key={entry.col.key} label={entry.col.label} value={val} />;
                  }
                })}

                {/* Document markdown fallback — shown below the active section if present */}
                {documentMd && visibleSections.indexOf(effectiveTab) === visibleSections.length - 1 && (
                  <div>
                    <SectionHeading title="Vollständiges Länderprofil" />
                    <DocumentDetail content={documentMd} />
                  </div>
                )}
              </dl>
            )}
          </>
        )}

        {/* Related cross-link panel — always shown at the very bottom */}
        {item && relatedPanel && relatedPanel(item)}
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

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [isSelected]);

  return (
    <button
      ref={ref}
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
          <span className={cn('text-lg font-semibold leading-snug line-clamp-1', isSelected ? 'text-foreground' : 'text-foreground/80')}>
            {primary || '—'}
          </span>
          {complexityColor && (
            <span className="inline-block size-2 shrink-0 rounded-full" style={{ backgroundColor: complexityColor }} />
          )}
        </div>
        {secondary && (
          <p className="text-base text-muted-foreground leading-relaxed line-clamp-1">
            {secondary}
          </p>
        )}
        {tertiary && (
          <p className="text-base text-muted-foreground/60 leading-snug">{tertiary}</p>
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
  summaryField,
  extraDetailHeader,
  editTable,
  countryBlocksMap,
  relatedPanel,
  pinnedLinks,
}: SplitViewProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-based selection
  const urlId = searchParams.get('id') ?? searchParams.get('code');

  const [search, setSearch] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');
  const [showDetail, setShowDetail] = React.useState(false); // mobile toggle
  const [activePinned, setActivePinned] = React.useState<string | null>(null);

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
          className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/50 outline-none"
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
            className="h-11 w-full appearance-none rounded-md border border-border bg-muted/30 px-3 pr-7 text-lg text-foreground outline-none focus:border-[#86bc25]/60"
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

      <p className="text-base text-muted-foreground/60 px-1">
        {filtered.length} von {items.length} Einträgen
      </p>
    </div>
  );

  // ── List ────────────────────────────────────────────────────────────────────
  const list = (
    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
      {pinnedLinks && pinnedLinks.length > 0 && (
        <div className="mb-2 space-y-0.5">
          {pinnedLinks.map((pl) => {
            const isActive = activePinned === pl.label;
            const cls = cn(
              'block w-full rounded-md border px-3 py-3 text-left transition-all duration-100',
              isActive
                ? 'border-[#86bc25]/60 bg-[#86bc25]/15 shadow-sm'
                : 'border-[#86bc25]/40 bg-[#86bc25]/5 hover:bg-[#86bc25]/10',
            );
            const inner = (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{pl.label}</div>
                  {pl.sublabel && (
                    <div className="text-xs text-muted-foreground/70 truncate">{pl.sublabel}</div>
                  )}
                </div>
                <span className="text-muted-foreground/60">→</span>
              </div>
            );
            if (pl.content !== undefined) {
              return (
                <button
                  key={pl.label}
                  type="button"
                  onClick={() => { setActivePinned(pl.label); setShowDetail(true); }}
                  className={cls}
                >
                  {inner}
                </button>
              );
            }
            return (
              <Link key={pl.label} href={pl.href ?? '#'} className={cls}>
                {inner}
              </Link>
            );
          })}
          <div className="border-b border-border/60 pt-2" />
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-base text-muted-foreground/60">{emptyLabel}</p>
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
              onClick={() => { setSelected(id); setActivePinned(null); }}
            />
          );
        })
      )}
    </div>
  );

  // ── Detail ──────────────────────────────────────────────────────────────────
  // Resolve country blocks for the selected item (by idField key, typically 'code')
  const selectedCountryBlocks = React.useMemo(() => {
    if (!countryBlocksMap || !selectedItem) return undefined;
    const keyVal = idField ? String(selectedItem[idField] ?? '') : String(selectedItem['code'] ?? selectedItem['id'] ?? '');
    return countryBlocksMap[keyVal] ?? undefined;
  }, [countryBlocksMap, selectedItem, idField]);

  const activePinnedEntry = activePinned
    ? pinnedLinks?.find((pl) => pl.label === activePinned && pl.content !== undefined)
    : undefined;

  const detail = activePinnedEntry ? (
    <div className="h-full overflow-hidden">{activePinnedEntry.content}</div>
  ) : (
    <DetailPanel
      item={selectedItem}
      columns={columns}
      primaryField={primaryField}
      secondaryField={secondaryField}
      headerBadgeField={headerBadgeField}
      complexityField={complexityField}
      documentField={documentField}
      summaryField={summaryField}
      extraDetailHeader={extraDetailHeader}
      editTable={editTable}
      itemId={selectedId ?? undefined}
      countryBlocks={selectedCountryBlocks}
      relatedPanel={relatedPanel}
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
                className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
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
