import { getFormatEntries, getFormatVersions } from '@/lib/queries/entries';
import { type Column } from '@/components/browse/split-view';
import { FormateClient } from './formate-client';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formate — Payments KB',
};

const COLUMNS: Column[] = [
  // Allgemein
  { key: 'format_name',      label: 'Format-Name',           section: 'Allgemein' },
  { key: 'aktuelle_version', label: 'Diese Version',         section: 'Allgemein' },
  { key: 'nachrichtentyp',   label: 'Nachrichtentyp',        section: 'Allgemein' },
  { key: 'familie_standard', label: 'Familie / Standard',    section: 'Allgemein' },
  { key: 'datenrichtung',    label: 'Datenrichtung',         section: 'Allgemein' },
  { key: 'sap_relevanz',     label: 'SAP-Relevanz',          section: 'Allgemein' },
  { key: 'status',           label: 'Status',                section: 'Allgemein' },
  { key: 'version_released', label: 'Veröffentlicht',        section: 'Allgemein' },
  { key: 'version_notes',    label: 'Versionshinweise',      section: 'Allgemein' },
  // Versionen
  { key: 'versionshistorie', label: 'Versionshistorie', section: 'Versionen' },
  // Beschreibung
  { key: 'beschreibung_experte',   label: 'Beschreibung (Experte)',   section: 'Beschreibung' },
  { key: 'beschreibung_einsteiger',label: 'Beschreibung (Einsteiger)',section: 'Beschreibung' },
  // Aufbau
  { key: 'wichtige_felder', label: 'Wichtige Felder', section: 'Aufbau' },
  { key: 'pflichtfelder',   label: 'Pflichtfelder',   section: 'Aufbau' },
  // SAP
  { key: 'sap_mapping_experte',   label: 'SAP Mapping (Experte)',   section: 'SAP' },
  { key: 'sap_mapping_einsteiger',label: 'SAP Mapping (Einsteiger)',section: 'SAP' },
  // Fehler
  { key: 'fehlerquellen_experte',   label: 'Fehlerquellen (Experte)',   section: 'Fehler & Risiken' },
  { key: 'fehlerquellen_einsteiger',label: 'Fehlerquellen (Einsteiger)',section: 'Fehler & Risiken' },
  { key: 'projektfehler_experte',   label: 'Projektfehler (Experte)',   section: 'Fehler & Risiken' },
  { key: 'projektfehler_einsteiger',label: 'Projektfehler (Einsteiger)',section: 'Fehler & Risiken' },
];

export default async function FormatePage() {
  const session = await auth();
  if (!session) redirect('/login');

  const [data, versions] = await Promise.all([
    getFormatEntries(),
    getFormatVersions().catch(() => []),
  ]);

  // Build a lookup map: format_name → base entry
  const entryByName = new Map(data.map((e) => [e.format_name.toLowerCase(), e]));

  // Build synthetic list items — one per format_version row.
  // If a format has no versions at all, fall back to one item per format_entry.
  const versionedFormatNames = new Set(versions.map((v) => v.format_name.toLowerCase()));

  const syntheticItems: Record<string, unknown>[] = [];

  // 1. Version-backed items
  for (const v of versions) {
    const base = entryByName.get(v.format_name.toLowerCase());
    const fullVersion = `${v.format_name}.${v.version}`;
    syntheticItems.push({
      // Unique id for URL selection
      format_version_id: v.id,
      // Version-level primary fields
      format_name: v.format_name,
      version: v.version,
      aktuelle_version: fullVersion,
      version_released: v.released ?? '',
      version_notes: v.notes ?? '',
      version_sample_file: v.sample_file ?? '',
      version_is_current: v.is_current ?? false,
      // Base fields from format_entries (same across all versions of a family)
      nachrichtentyp: base?.nachrichtentyp ?? '',
      familie_standard: base?.familie_standard ?? '',
      datenrichtung: base?.datenrichtung ?? '',
      sap_relevanz: base?.sap_relevanz ?? '',
      status: base?.status ?? '',
      beschreibung_experte: base?.beschreibung_experte ?? '',
      beschreibung_einsteiger: base?.beschreibung_einsteiger ?? '',
      wichtige_felder: base?.wichtige_felder ?? '',
      pflichtfelder: base?.pflichtfelder ?? '',
      sap_mapping_experte: base?.sap_mapping_experte ?? '',
      sap_mapping_einsteiger: base?.sap_mapping_einsteiger ?? '',
      fehlerquellen_experte: base?.fehlerquellen_experte ?? '',
      fehlerquellen_einsteiger: base?.fehlerquellen_einsteiger ?? '',
      projektfehler_experte: base?.projektfehler_experte ?? '',
      projektfehler_einsteiger: base?.projektfehler_einsteiger ?? '',
      versionshistorie: base?.versionshistorie ?? '',
      // Carry base entry id for edit link
      base_entry_id: base?.id ?? '',
    });
  }

  // 2. Formats without any version row — show as a single item
  for (const entry of data) {
    if (!versionedFormatNames.has(entry.format_name.toLowerCase())) {
      syntheticItems.push({
        format_version_id: entry.id,
        format_name: entry.format_name,
        version: '',
        aktuelle_version: entry.aktuelle_version ?? '',
        version_released: '',
        version_notes: '',
        version_sample_file: '',
        version_is_current: false,
        nachrichtentyp: entry.nachrichtentyp ?? '',
        familie_standard: entry.familie_standard ?? '',
        datenrichtung: entry.datenrichtung ?? '',
        sap_relevanz: entry.sap_relevanz ?? '',
        status: entry.status ?? '',
        beschreibung_experte: entry.beschreibung_experte ?? '',
        beschreibung_einsteiger: entry.beschreibung_einsteiger ?? '',
        wichtige_felder: entry.wichtige_felder ?? '',
        pflichtfelder: entry.pflichtfelder ?? '',
        sap_mapping_experte: entry.sap_mapping_experte ?? '',
        sap_mapping_einsteiger: entry.sap_mapping_einsteiger ?? '',
        fehlerquellen_experte: entry.fehlerquellen_experte ?? '',
        fehlerquellen_einsteiger: entry.fehlerquellen_einsteiger ?? '',
        projektfehler_experte: entry.projektfehler_experte ?? '',
        projektfehler_einsteiger: entry.projektfehler_einsteiger ?? '',
        versionshistorie: entry.versionshistorie ?? '',
        base_entry_id: entry.id,
      });
    }
  }

  return (
    <Suspense>
      <FormateClient
        items={syntheticItems}
        columns={COLUMNS}
        versions={versions}
      />
    </Suspense>
  );
}
