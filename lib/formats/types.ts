export type Cardinality = '1' | '0..1' | '1..N' | '0..N';

export type StructureNode = {
  name: string;
  card: Cardinality;
  type?: string;
  desc: string;
  /** Set true to highlight as version-specific addition */
  versionFlag?: string; // z.B. 'v.09', 'CBPR+', '2025-revision'
  children?: StructureNode[];
};

export type MigrationChange = {
  field: string;
  oldValue: string;
  newValue: string;
  type: 'new' | 'changed' | 'removed';
};

export type Migration = {
  /** Human label, z.B. 'pain.001.001.03 → .09' */
  label: string;
  /** Machine identifier of the previous version, z.B. '001.001.03' */
  fromVersion: string;
  /** Machine identifier of the new version */
  toVersion: string;
  changes: MigrationChange[];
};

export type FeatureDef = {
  /** Pattern in version notes, oder einfach Feature-Name */
  match: RegExp;
  name: string;
  what: string;
  tokens: string[];
};

export type RejectCode = {
  code: string;
  name: string;
  meaning: string;
  remediation: string;
  /** ISO20022 / SWIFT / NACHA / Local */
  group: string;
};

export type CharacterSetVariant = 'sepa-latin' | 'swift-x' | 'cn-gb18030' | 'us-ascii' | 'jp-shift-jis' | 'utf-8';

export type FormatContent = {
  /** Match key — gleich format_name in DB */
  formatName: string;
  /** Strukturbaum (gilt für alle Versionen, version-Spezifika via versionFlag) */
  structure?: StructureNode[];
  /** Schema-URN (für Header-Banner) */
  schemaUriPattern?: string; // z.B. 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.<v>'
  /** Migrations-Map: Schlüssel = "from→to" oder Ziel-Version */
  migrations?: Migration[];
  /** Feature-Erkennungs-Regeln für Notes-Parsing */
  featureDefs?: FeatureDef[];
  /** Welcher Charakter-Set-Variante ist gültig? */
  characterSet?: CharacterSetVariant;
  /** Welche Reject-Code-Familie verwenden? */
  rejectCodeGroup?: 'iso20022' | 'swift-mt' | 'nacha' | 'fapiao' | null;
  /** Geltungs-Region (für Banner) */
  region?: string;
};
