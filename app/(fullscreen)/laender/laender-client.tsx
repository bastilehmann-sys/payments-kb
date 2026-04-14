'use client';

import * as React from 'react';
import { SplitView, type Column } from '@/components/browse/split-view';
import type { CountryBlockGroup } from '@/lib/queries/documents';

interface Props {
  items: Record<string, unknown>[];
  columns: Column[];
  countryBlocksMap: Record<string, CountryBlockGroup[]>;
  renderSummary?: (item: Record<string, unknown>) => React.ReactNode;
}

export function LaenderClient({ items, columns, countryBlocksMap, renderSummary }: Props) {
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
