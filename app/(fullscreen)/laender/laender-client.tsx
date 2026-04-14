'use client';

import { SplitView, type Column } from '@/components/browse/split-view';
import type { CountryBlockGroup } from '@/lib/queries/documents';

interface Props {
  items: Record<string, unknown>[];
  columns: Column[];
  countryBlocksMap: Record<string, CountryBlockGroup[]>;
}

export function LaenderClient({ items, columns, countryBlocksMap }: Props) {
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
    />
  );
}
