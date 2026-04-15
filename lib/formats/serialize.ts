import type { FeatureDef } from './types';

export type FeatureDefSerialized = {
  pattern: string;
  flags: string;
  name: string;
  what: string;
  tokens: string[];
};

export function serializeFeatureDef(f: FeatureDef): FeatureDefSerialized {
  return {
    pattern: f.match.source,
    flags: f.match.flags,
    name: f.name,
    what: f.what,
    tokens: f.tokens,
  };
}

export function deserializeFeatureDef(s: FeatureDefSerialized): FeatureDef {
  return {
    match: new RegExp(s.pattern, s.flags),
    name: s.name,
    what: s.what,
    tokens: s.tokens,
  };
}

export function serializeFeatureDefs(list: FeatureDef[]): FeatureDefSerialized[] {
  return list.map(serializeFeatureDef);
}

export function deserializeFeatureDefs(raw: unknown): FeatureDef[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => deserializeFeatureDef(s as FeatureDefSerialized));
}
