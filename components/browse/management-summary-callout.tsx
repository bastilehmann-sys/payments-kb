'use client';

import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  initialValue: string;
  editTable?: string;
  itemId?: string;
  fieldKey?: string;
  /** Children render the read-only formatted view (e.g. rendered bullets) */
  children: React.ReactNode;
}

function IconPencil() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" />
    </svg>
  );
}

export function ManagementSummaryCallout({
  initialValue,
  editTable,
  itemId,
  fieldKey,
  children,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const canEdit = Boolean(editTable && itemId && fieldKey);

  async function save() {
    if (!canEdit) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/entries/${editTable}/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { [fieldKey!]: value } }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      toast.success('Management Summary gespeichert');
      setEditing(false);
      router.refresh();
    } catch (e) {
      toast.error(`Speichern fehlgeschlagen: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="group relative mb-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-semibold uppercase tracking-wider text-primary">
          Management Summary
        </div>
        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
            title="Management Summary bearbeiten"
          >
            <IconPencil />
            Bearbeiten
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <TextareaAutosize
            value={value}
            onChange={(e) => setValue(e.target.value)}
            minRows={4}
            className="w-full resize-none rounded-md border border-border bg-background p-3 text-base leading-relaxed text-foreground/90 focus:border-primary focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving || value === initialValue}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {saving ? 'Speichern…' : 'Speichern'}
            </button>
            <button
              type="button"
              onClick={() => { setValue(initialValue); setEditing(false); }}
              disabled={saving}
              className="rounded-md border border-border px-3 py-1.5 text-sm"
            >
              Abbrechen
            </button>
            <span className="ml-2 text-xs text-muted-foreground">
              Markdown wird im Lese-Modus gerendert (z. B. <code>- **Was:** …</code>)
            </span>
          </div>
        </div>
      ) : (
        <div className="text-lg leading-relaxed text-foreground/90">{children}</div>
      )}
    </div>
  );
}
