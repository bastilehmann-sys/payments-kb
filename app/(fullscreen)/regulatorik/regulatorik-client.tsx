'use client';

import * as React from 'react';
import { SplitView, type Column } from '@/components/browse/split-view';
import { RegulatorikSapMatrix } from '@/components/regulatorik/sap-matrix';
import { RegulatorikDetailPanel } from '@/components/regulatorik/detail-panel';

interface Props {
  items: Record<string, unknown>[];
  columns: Column[];
}

export function RegulatorikClient({ items, columns }: Props) {
  return (
    <SplitView
      items={items}
      columns={columns}
      primaryField="kuerzel"
      secondaryField="name"
      searchFields={['kuerzel', 'name', 'kategorie', 'typ']}
      filterField="typ"
      filterLabel="Alle Typen"
      summaryField="beschreibung_einsteiger"
      editTable="regulatorik_entries"
      pinnedLinks={[
        {
          label: 'SAP-Matrix',
          sublabel: 'Alle 34 Regelungen im Überblick',
          content: <RegulatorikSapMatrix items={items} />,
        },
      ]}
      renderDetail={(item) => (
        <RegulatorikDetailPanel
          entry={item as unknown as Record<string, string | null>}
          editTable="regulatorik_entries"
        />
      )}
    />
  );
}
