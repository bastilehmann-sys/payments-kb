'use client';

import { SplitView, type Column } from '@/components/browse/split-view';
import { FormatSampleCard } from '@/components/browse/formate-sample-card';
import type { FormatVersion } from '@/lib/queries/entries';

interface FormateClientProps {
  items: Record<string, unknown>[];
  columns: Column[];
  versions?: FormatVersion[];
}

export function FormateClient({ items, columns, versions }: FormateClientProps) {
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
      extraDetailHeader={(item) => (
        <FormatSampleCard
          formatName={String(item['format_name'] ?? '')}
          selectedVersion={String(item['aktuelle_version'] ?? '')}
          selectedSampleFile={String(item['version_sample_file'] ?? '')}
          selectedIsCurrentVersion={Boolean(item['version_is_current'])}
          selectedVersionNotes={String(item['version_notes'] ?? '')}
          versions={versions}
        />
      )}
    />
  );
}
