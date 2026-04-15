'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { FormatContent, FeatureDef } from '@/lib/formats/types';
import { ISO20022_REJECT_CODES, SWIFT_MT_NAK_CODES } from '@/lib/formats/iso-base';
import { StructureTree } from './structure-tree';
import { MigrationDiff } from './migration-diff';
import { CharacterSetPanel } from './character-set-panel';
import { RejectCodesPanel } from './reject-codes-panel';
import { Markdown, inlineMd } from './markdown-helpers';

type Entry = Record<string, string | null>;
type Version = Record<string, string | null | boolean>;

interface Props {
  base: Entry;
  version: Version;
  allVersions: Version[];
  content?: FormatContent;
}

// ─── SAP Chip-RE ──────────────────────────────────────────────────────────────

const SAP_CHIP_RE = /\b(?:FI-[A-Z]{2,3}|TRM-[A-Z]{2,3}|BC-[A-Z]{2,3}|FSCM-[A-Z]{2,4}|BCM|DRC|DMEE|DMEEX|EBICS|H2H|SWIFT|MBC|FBZP|OB\d{2,3}|OT\d{2,3}|F110|MIRO|XK\d{2}|XD\d{2}|LFA\d|T001|BSEG|REGUH)\b/g;

// ─── Feature Card ─────────────────────────────────────────────────────────────

type Feature = { name: string; what: string; tokens: string[]; versionLabel?: string };

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className="rounded-xl border border-emerald-300/40 bg-emerald-50/30 p-5 dark:border-emerald-700/30 dark:bg-emerald-950/15">
      {feature.versionLabel && (
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Neu in {feature.versionLabel}</div>
      )}
      <h3 className="mb-2 text-base font-semibold text-foreground">{feature.name}</h3>
      <p className="text-base leading-relaxed text-foreground/85">{feature.what}</p>
      {feature.tokens.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {feature.tokens.map((t) => (
            <span key={t} className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-emerald-900 ring-1 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-100 dark:ring-emerald-800/40">
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

// ─── Version Timeline ─────────────────────────────────────────────────────────

function VersionTimeline({ versions, currentVersion }: { versions: Version[]; currentVersion: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-base font-semibold text-foreground">Versions-Timeline</h3>
      <ol className="relative space-y-4 border-l-2 border-border/50 pl-5">
        {versions.map((v) => {
          const ver = String(v.version ?? '');
          const isActive = ver === currentVersion;
          return (
            <li key={ver} className="relative">
              <span
                className={cn(
                  'absolute -left-[1.6rem] mt-1 size-3 rounded-full border-2',
                  isActive
                    ? 'border-primary bg-primary'
                    : v.is_current
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-border bg-background',
                )}
              />
              <div className="flex flex-wrap items-baseline gap-2">
                <span className={cn('font-mono text-sm font-semibold', isActive && 'text-primary')}>
                  {String(v.format_name ?? '')} {ver}
                </span>
                {Boolean(v.released) && (
                  <span className="text-xs text-muted-foreground">{String(v.released)}</span>
                )}
                {Boolean(v.is_current) && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                    aktuell
                  </span>
                )}
                {isActive && !v.is_current && (
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    diese Seite
                  </span>
                )}
              </div>
              {v.notes && (
                <p className="mt-1 text-xs text-muted-foreground">{String(v.notes).slice(0, 120)}…</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─── Content Section ──────────────────────────────────────────────────────────

function ContentSection({ title, einsteiger, experte }: { title: string; einsteiger: string | null; experte: string | null }) {
  if (!einsteiger?.trim() && !experte?.trim()) return null;
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-base font-semibold text-foreground">{title}</h3>
      {einsteiger?.trim() && <Markdown text={einsteiger} />}
      {experte?.trim() && (
        <div className="mt-4 rounded-lg border-l-2 border-amber-400/60 bg-amber-50/30 px-4 py-3 dark:bg-amber-950/15">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Fachliche Details
          </div>
          <Markdown text={experte} />
        </div>
      )}
    </section>
  );
}

// ─── SAP Mapping Panel ────────────────────────────────────────────────────────

function SapMappingPanel({ einsteiger, experte }: { einsteiger: string | null; experte: string | null }) {
  if (!einsteiger?.trim() && !experte?.trim()) return null;
  const tokenSrc = `${einsteiger ?? ''} ${experte ?? ''}`;
  const chips = Array.from(new Set(tokenSrc.match(SAP_CHIP_RE) ?? []));
  return (
    <section className="rounded-xl border-2 border-sky-500/40 bg-gradient-to-br from-sky-50 to-sky-100/40 p-5 shadow-sm dark:border-sky-700/40 dark:from-sky-950/30 dark:to-sky-950/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="12" height="10" rx="1" />
            <path d="M2 7h12M6 13V7M10 13V7" />
          </svg>
          SAP-Mapping
        </span>
        <h3 className="text-base font-semibold text-sky-900 dark:text-sky-100">Wo wird das Format in SAP gepflegt?</h3>
      </div>
      {chips.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {chips.slice(0, 12).map((c) => (
            <span key={c} className="rounded bg-white px-2 py-0.5 font-mono text-xs font-semibold text-sky-900 ring-1 ring-sky-300 shadow-sm dark:bg-sky-900/60 dark:text-sky-100 dark:ring-sky-700/60">
              {c}
            </span>
          ))}
        </div>
      )}
      {einsteiger?.trim() && <Markdown text={einsteiger} />}
      {experte?.trim() && (
        <div className="mt-4 rounded-lg border-l-2 border-amber-400/60 bg-amber-50/40 px-4 py-3 dark:bg-amber-950/15">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Fachliche Details
          </div>
          <Markdown text={experte} />
        </div>
      )}
    </section>
  );
}

// ─── Sample Block ─────────────────────────────────────────────────────────────

function SampleBlock({ version }: { version: Version }) {
  const file = (version.sample_file as string) || '';
  if (!file) return null;
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Beispiel-Datei (echte XSD-konforme Probe)
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <a
          href={file}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono font-medium text-primary hover:underline"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M10 2v3h3" />
          </svg>
          {file.split('/').pop()}
        </a>
        <span className="text-xs text-muted-foreground">XSD-konform</span>
      </div>
      {Boolean(version.schema_uri) && (
        <div className="mt-2 text-xs">
          <span className="text-muted-foreground">Schema:</span>{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">{String(version.schema_uri)}</code>
        </div>
      )}
      {Boolean(version.source_standard) && (
        <div className="mt-1 text-xs text-muted-foreground">Quelle: {String(version.source_standard)}</div>
      )}
    </div>
  );
}

// ─── Feature parsing from version notes (fallback when no featureDefs in content) ─

function parseFeatures(notes: string | null, featureDefs?: FeatureDef[]): Feature[] {
  if (!notes) return [];

  // Use content-provided featureDefs if available
  if (featureDefs && featureDefs.length > 0) {
    return featureDefs
      .filter((fd) => fd.match.test(notes))
      .map((fd) => ({ name: fd.name, what: fd.what, tokens: fd.tokens }));
  }

  // Fallback built-in patterns (same as pain-001-09 mockup)
  const knownPatterns: { name: string; pattern: RegExp; what: string; tokens: string[] }[] = [
    {
      name: 'PostalAddress24 (strukturierte Adresse)',
      pattern: /PostalAddress24/i,
      what: 'Alle Adressfelder einzeln strukturiert statt Freitext: StrtNm, BldgNb, PstCd, TwnNm, Ctry usw. Pflicht ab EPC SEPA SCT 2025.',
      tokens: ['PostalAddress24', 'StrtNm', 'BldgNb', 'PstCd', 'TwnNm', 'Ctry'],
    },
    {
      name: 'BICFI ersetzt BIC/BICOrBEI',
      pattern: /BICFI/i,
      what: 'ISO 20022 nutzt durchgängig BICFI (Business Identifier Code, Financial Institution). Alte Element-Namen sind veraltet.',
      tokens: ['BICFI', 'BIC'],
    },
    {
      name: 'LEI-Unterstützung in OrgId',
      pattern: /\bLEI\b/,
      what: 'Legal Entity Identifier (LEI) als Identifikation für juristische Personen — Voraussetzung für EMIR-Reporting und Wholesale-Trades.',
      tokens: ['LEI', 'OrgId'],
    },
    {
      name: 'UETR im PmtId-Block',
      pattern: /UETR/,
      what: 'Unique End-to-End Transaction Reference — globale Verfolgbarkeit über SWIFT gpi für Cross-Border-Zahlungen.',
      tokens: ['UETR', 'EndToEndId'],
    },
    {
      name: 'ReqdExctnDt als komplexes Element',
      pattern: /ReqdExctnDt/,
      what: 'Datum + Zeit + DateAndTimeChoice — präzise Steuerung des Ausführungs-Cut-Offs (vorher nur Date).',
      tokens: ['ReqdExctnDt'],
    },
    {
      name: 'UltimateOriginator (POBO-Support)',
      pattern: /UltimateOriginator/i,
      what: 'Original-Auftraggeber separat nachvollziehbar — Pflicht für Payment-on-Behalf-of-Konstruktionen (Konzern-IHB → Tochter).',
      tokens: ['UltimateOriginator'],
    },
  ];
  return knownPatterns.filter((p) => p.pattern.test(notes)).map((p) => ({
    name: p.name,
    what: p.what,
    tokens: p.tokens,
  }));
}

// ─── Reject codes lookup ──────────────────────────────────────────────────────

function getRejectCodes(group: FormatContent['rejectCodeGroup']) {
  if (group === 'iso20022') return ISO20022_REJECT_CODES;
  if (group === 'swift-mt') return SWIFT_MT_NAK_CODES;
  return null;
}

// ─── Main VersionDetailPanel ──────────────────────────────────────────────────

export function VersionDetailPanel({ base, version, allVersions, content }: Props) {
  const [tab, setTab] = React.useState<'neu' | 'aufbau' | 'fehler'>('neu');

  const formatName = String(version.format_name ?? base.format_name ?? '');
  const versionStr = String(version.version ?? '');
  const features = parseFeatures(version.notes as string | null, content?.featureDefs);
  const rejectCodes = content?.rejectCodeGroup != null ? getRejectCodes(content.rejectCodeGroup) : null;

  // Schema URI: try version row, then construct from content pattern
  const schemaUri = (version.schema_uri as string | null) ||
    (content?.schemaUriPattern ? content.schemaUriPattern.replace('<v>', versionStr) : null);

  return (
    <div className="space-y-5">
      {/* Header-Banner */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="rounded-md bg-primary px-2 py-1 font-mono text-sm font-bold text-primary-foreground">
            {formatName}{versionStr ? ` ${versionStr}` : ''}
          </span>
          {base.beschreibung_einsteiger && (
            <span className="text-base text-foreground/80">
              {String(base.beschreibung_einsteiger).slice(0, 100)}
            </span>
          )}
          {content?.region && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{content.region}</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {version.released && <span><strong className="text-foreground">Released:</strong> {String(version.released)}</span>}
          <span><strong className="text-foreground">Aktuell:</strong> {version.is_current ? 'ja' : 'nein (höhere Versionen verfügbar)'}</span>
          {version.source_standard && <span><strong className="text-foreground">Quelle:</strong> {String(version.source_standard)}</span>}
          {schemaUri && (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-muted-foreground">{schemaUri}</code>
          )}
        </div>
      </div>

      {/* Management Summary aus base */}
      {base.beschreibung_einsteiger && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Management Summary</div>
          <div className="text-lg">
            <Markdown text={base.beschreibung_einsteiger} />
          </div>
        </div>
      )}

      {/* SAP-Mapping permanent */}
      <SapMappingPanel einsteiger={base.sap_mapping_einsteiger} experte={base.sap_mapping_experte} />

      {/* Beispiel-Datei prominent */}
      <SampleBlock version={version} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {[
          { id: 'neu',    label: 'Was ist neu?' },
          { id: 'aufbau', label: 'Aufbau & Felder' },
          { id: 'fehler', label: 'Fehler & Risiken' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={cn(
              'shrink-0 rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition-colors -mb-px',
              tab === t.id
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Was ist neu */}
      {tab === 'neu' && (
        <div className="space-y-4">
          {features.length > 0 && (
            <div className="grid items-stretch gap-3 md:grid-cols-2">
              {features.map((f) => <FeatureCard key={f.name} feature={f} />)}
            </div>
          )}

          {/* Migration Diffs — nur wenn Migration AUF die aktuelle Version zielt */}
          {(() => {
            const currentVersion = String(version.version ?? '');
            const matching = (content?.migrations ?? []).filter((m) =>
              currentVersion && m.toVersion === currentVersion,
            );
            if (matching.length === 0) return null;
            return (
              <div className="space-y-4">
                {matching.map((m) => (
                  <MigrationDiff key={m.label} migration={m} />
                ))}
              </div>
            );
          })()}

          {/* Version notes */}
          {version.notes && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-base font-semibold text-foreground">Vollständige Versions-Notes</h3>
              <Markdown text={String(version.notes)} />
            </section>
          )}

          <VersionTimeline versions={allVersions} currentVersion={versionStr} />
        </div>
      )}

      {/* Tab: Aufbau & Felder */}
      {tab === 'aufbau' && (
        <div className="space-y-4">
          {/* Generic StructureTree when content.structure is set */}
          {content?.structure && content.structure.length > 0 ? (
            <StructureTree
              nodes={content.structure}
              schemaUri={schemaUri ?? undefined}
              currentVersion={versionStr || undefined}
            />
          ) : (
            /* Fallback: DB-field markdown when structure is missing */
            <>
              {base.wichtige_felder && (
                <section className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-3 text-base font-semibold text-foreground">Wichtige Felder</h3>
                  <Markdown text={base.wichtige_felder} />
                </section>
              )}
              {base.pflichtfelder && (
                <section className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-3 text-base font-semibold text-foreground">Pflichtfelder</h3>
                  <Markdown text={base.pflichtfelder} />
                </section>
              )}
            </>
          )}

          {/* Character Set panel when content.characterSet is set */}
          {content?.characterSet && (
            <CharacterSetPanel variant={content.characterSet} />
          )}

          {/* Additional house notes */}
          {base.wichtige_felder && content?.structure && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-base font-semibold text-foreground">Hinweise des Hauses</h3>
              <Markdown text={base.wichtige_felder} />
            </section>
          )}
        </div>
      )}

      {/* Tab: Fehler & Risiken */}
      {tab === 'fehler' && (
        <div className="space-y-4">
          {/* Reject codes panel when rejectCodeGroup is set */}
          {rejectCodes && rejectCodes.length > 0 && (
            <RejectCodesPanel
              codes={rejectCodes}
              title={content?.rejectCodeGroup === 'swift-mt' ? 'SWIFT MT NAK-Codes' : 'Häufige Rückgabe-Codes (ISO 20022)'}
              sourceLabel={content?.rejectCodeGroup === 'swift-mt' ? 'SWIFT Standards Release Guide' : 'ISO 20022 External Code Sets'}
              sourceUrl={content?.rejectCodeGroup === 'swift-mt' ? 'https://www.swift.com/standards' : 'https://www.iso20022.org/external-code-sets'}
            />
          )}
          <ContentSection title="Fehlerquellen" einsteiger={base.fehlerquellen_einsteiger} experte={base.fehlerquellen_experte} />
          <ContentSection title="Projektfehler" einsteiger={base.projektfehler_einsteiger} experte={base.projektfehler_experte} />
        </div>
      )}
    </div>
  );
}

// Re-export helpers so consumers can import from one place
export { inlineMd, Markdown };
