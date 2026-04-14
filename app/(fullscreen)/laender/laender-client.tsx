'use client';

import * as React from 'react';
import { SplitView, type Column } from '@/components/browse/split-view';
import { CountrySummaryGrid } from '@/components/browse/country-summary-grid';
import type { CountryBlockGroup } from '@/lib/queries/documents';

interface Props {
  items: Record<string, unknown>[];
  columns: Column[];
  countryBlocksMap: Record<string, CountryBlockGroup[]>;
}

export function LaenderClient({ items, columns, countryBlocksMap }: Props) {
  const renderSummary = React.useCallback(
    (item: Record<string, unknown>) => <CountrySummaryGrid country={item} />,
    []
  );
  return (
    <SplitView
      items={items}
      columns={columns}
      primaryField="code"
      secondaryField="name"
      searchFields={['code', 'name', 'currency', 'summary']}
      filterField="complexity"
      filterLabel="Alle Komplexitäten"
      idField="code"
      complexityField="complexity"
      documentField="document_md"
      summaryField="key_note"
      editTable="countries"
      countryBlocksMap={countryBlocksMap}
      renderSummary={renderSummary}
    />
  );
}
