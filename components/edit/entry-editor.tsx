'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Column } from '@/components/browse/split-view';
import { AuditHistory } from './audit-history';

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconSave() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 11v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2M8 2v8M5 7l3 3 3-3" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 2" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" />
    </svg>
  );
}

// ─── EntryField ────────────────────────────────────────────────────────────────

function EntryField({
  label,
  fieldKey,
  value,
  isDirty,
  onChange,
}: {
  label: string;
  fieldKey: string;
  value: string;
  isDirty: boolean;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          {label}
        </label>
        {isDirty && (
          <span
            className="inline-block size-2 rounded-full bg-amber-400 shrink-0"
            title="Geändert"
          />
        )}
      </div>
      <TextareaAutosize
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        minRows={2}
        className={cn(
          'w-full resize-none rounded-md border bg-background px-3 py-2.5 text-base leading-relaxed text-foreground outline-none transition-colors',
          isDirty
            ? 'border-amber-400/60 focus:border-amber-400'
            : 'border-border focus:border-[#86bc25]/60',
        )}
      />
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-4 mt-8 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86bc25]/80">
        {title}
      </h3>
    </div>
  );
}

// ─── Live preview panel (minimal, mirrors split-view structure) ────────────────

function PreviewPanel({
  current,
  columns,
}: {
  current: Record<string, string>;
  columns: Column[];
}) {
  // Group columns by section
  const sections: Record<string, Column[]> = {};
  for (const col of columns) {
    const s = col.section ?? 'Allgemein';
    if (!sections[s]) sections[s] = [];
    sections[s].push(col);
  }

  return (
    <div className="px-8 py-6 text-base">
      {Object.entries(sections).map(([section, cols]) => (
        <div key={section}>
          <div className="mb-3 mt-8 border-t border-border pt-5 first:mt-0 first:border-t-0 first:pt-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86bc25]/80">
              {section}
            </h3>
          </div>
          {cols.map((col) => {
            const val = current[col.key] ?? '';
            if (!val) return null;
            return (
              <div key={col.key} className="mb-5">
                <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                  {col.label}
                </dt>
                <dd className="whitespace-pre-line text-base leading-relaxed text-foreground/85">
                  {val}
                </dd>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── EntryEditor ──────────────────────────────────────────────────────────────

interface EntryEditorProps {
  table: string;
  id: string;
  initial: Record<string, unknown>;
  columns: Column[];
}

export function EntryEditor({ table, id, initial, columns }: EntryEditorProps) {
  const router = useRouter();

  // Derive editable fields from columns (skip system cols)
  const SKIP = new Set(['id', 'created_at', 'source_row']);
  const editableColumns = columns.filter((c) => !SKIP.has(c.key));

  // State
  const [current, setCurrent] = React.useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const col of editableColumns) {
      out[col.key] = initial[col.key] != null ? String(initial[col.key]) : '';
    }
    return out;
  });

  const [dirty, setDirty] = React.useState<Set<string>>(new Set());
  const [saving, setSaving] = React.useState(false);
  const [showAudit, setShowAudit] = React.useState(false);
  const [auditKey, setAuditKey] = React.useState(0); // increment to refetch

  function handleChange(key: string, val: string) {
    const orig = initial[key] != null ? String(initial[key]) : '';
    setCurrent((prev) => ({ ...prev, [key]: val }));
    setDirty((prev) => {
      const next = new Set(prev);
      if (val === orig) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleSave() {
    if (dirty.size === 0 || saving) return;
    setSaving(true);
    try {
      const fields: Record<string, string | null> = {};
      for (const key of dirty) {
        fields[key] = current[key] || null;
      }
      const res = await fetch(`/api/entries/${table}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json() as { updated: number; fields: string[] };
      setDirty(new Set());
      setAuditKey((k) => k + 1);
      toast.success(`Gespeichert — ${json.updated} Feld${json.updated === 1 ? '' : 'er'} aktualisiert`);
      router.refresh();
    } catch (err) {
      toast.error('Fehler beim Speichern');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (dirty.size > 0) {
      if (!confirm('Änderungen verwerfen?')) return;
    }
    router.back();
  }

  // Title: prefer kuerzel, then name, then format_name, then land, then code
  const title =
    String(initial.kuerzel ?? initial.name ?? initial.format_name ?? initial.land ?? initial.code ?? 'Eintrag');

  // Group editableColumns by section
  const sections: Record<string, Column[]> = {};
  for (const col of editableColumns) {
    const s = col.section ?? 'Allgemein';
    if (!sections[s]) sections[s] = [];
    sections[s].push(col);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 border-b border-border bg-background px-6 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <IconPencil />
            <span className="text-xs uppercase tracking-wider font-medium">Bearbeiten</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-foreground leading-tight truncate">
            {title}
          </h1>
        </div>

        {dirty.size > 0 && (
          <span className="shrink-0 text-xs text-amber-500 font-medium">
            {dirty.size} Feld{dirty.size === 1 ? '' : 'er'} geändert
          </span>
        )}

        <button
          onClick={() => setShowAudit((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-base transition-colors',
            showAudit
              ? 'border-[#86bc25]/40 bg-[#86bc25]/10 text-[#86bc25]'
              : 'border-border text-muted-foreground hover:border-[#86bc25]/40 hover:text-foreground',
          )}
          title="Änderungshistorie"
        >
          <IconHistory />
          <span className="hidden sm:inline">Historie</span>
        </button>

        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-base text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          <IconClose />
          <span className="hidden sm:inline">Abbrechen</span>
        </button>

        <button
          onClick={handleSave}
          disabled={dirty.size === 0 || saving}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-4 py-1.5 text-base font-medium transition-colors',
            dirty.size > 0 && !saving
              ? 'bg-[#86bc25] text-white hover:bg-[#76ac15]'
              : 'bg-muted text-muted-foreground cursor-not-allowed',
          )}
        >
          <IconSave />
          {saving ? 'Speichern…' : 'Speichern'}
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: form */}
        <div className="flex w-1/2 flex-col overflow-hidden border-r border-border">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <p className="mb-6 text-xs text-muted-foreground/60">
              Tabelle: <code className="font-mono">{table}</code> · ID: <code className="font-mono text-[11px]">{id}</code>
            </p>
            {Object.entries(sections).map(([section, cols]) => (
              <div key={section}>
                <SectionHeading title={section} />
                {cols.map((col) => (
                  <EntryField
                    key={col.key}
                    label={col.label}
                    fieldKey={col.key}
                    value={current[col.key] ?? ''}
                    isDirty={dirty.has(col.key)}
                    onChange={handleChange}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: preview + optional audit sidebar */}
        <div className="flex w-1/2 flex-col overflow-hidden">
          {showAudit ? (
            <AuditHistory
              table={table}
              id={id}
              key={auditKey}
              onClose={() => setShowAudit(false)}
            />
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="shrink-0 border-b border-border px-8 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                  Live-Vorschau
                </p>
              </div>
              <PreviewPanel current={current} columns={editableColumns} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
