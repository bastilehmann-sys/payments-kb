import type { FormatContent, StructureNode, Migration } from './types';
import { deserializeFeatureDefs } from './serialize';

const REGISTRY: Record<string, FormatContent> = {};

export function registerFormat(c: FormatContent) {
  REGISTRY[c.formatName] = c;
}
export function getFormat(name: string): FormatContent | undefined {
  return REGISTRY[name];
}

export function formatContentFromDb(row: Record<string, unknown>): FormatContent | undefined {
  // Nur dann als content verwenden, wenn mindestens structure vorhanden
  if (!row.structure && !row.migrations && !row.feature_defs) return undefined;
  return {
    formatName: String(row.format_name ?? ''),
    structure:           (row.structure         as StructureNode[] | null) ?? undefined,
    migrations:          (row.migrations        as Migration[] | null)     ?? undefined,
    featureDefs:         deserializeFeatureDefs(row.feature_defs) || undefined,
    characterSet:        (row.character_set     as any) ?? undefined,
    rejectCodeGroup:     (row.reject_code_group as any) ?? undefined,
    schemaUriPattern:    (row.schema_uri_pattern as string | null) ?? undefined,
    region:              (row.region            as string | null) ?? undefined,
  };
}
