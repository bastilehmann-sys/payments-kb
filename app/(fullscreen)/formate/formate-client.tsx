'use client';

import '@/content/formats/all';

import { SplitView, type Column } from '@/components/browse/split-view';
import { VersionDetailPanel } from '@/components/formate/version-detail-panel';
import { getFormat } from '@/lib/formats/registry';

interface FormateClientProps {
  items: Record<string, unknown>[];
  columns: Column[];
  versions?: Record<string, unknown>[];
}

export function FormateClient({ items, columns }: FormateClientProps) {
  return (
    <SplitView
      items={items}
      columns={columns}
      idField="format_version_id"
      primaryField="aktuelle_version"
      secondaryField="nachrichtentyp"
      tertiaryField="familie_standard"
      searchFields={['format_name', 'aktuelle_version', 'nachrichtentyp', 'familie_standard', 'version_notes']}
      filterField="familie_standard"
      filterLabel="Alle Familien"
      summaryField="beschreibung_einsteiger"
      editTable="format_entries"
      renderDetail={(item) => {
        const formatName = String(item['format_name'] ?? '');
        const allVersions = items.filter(
          (i) => String(i['format_name'] ?? '') === formatName,
        );
        return (
          <VersionDetailPanel
            base={item as Record<string, string | null>}
            version={item as Record<string, string | null | boolean>}
            allVersions={allVersions as Record<string, string | null | boolean>[]}
            content={getFormat(formatName)}
          />
        );
      }}
    />
  );
}
