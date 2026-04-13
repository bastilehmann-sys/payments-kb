'use client';

import * as React from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AuditRow {
  id: string;
  table_name: string;
  row_id: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  edited_at: string;
  edited_by: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'gerade eben';
  if (mins < 60) return `vor ${mins} Min.`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `vor ${hrs} Std.`;
  const days = Math.floor(hrs / 24);
  return `vor ${days} Tag${days === 1 ? '' : 'en'}`;
}

function truncate(s: string | null, n = 80): string {
  if (!s) return '—';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

// ─── DiffPair ─────────────────────────────────────────────────────────────────

function DiffPair({ old: oldVal, new: newVal }: { old: string | null; new: string | null }) {
  return (
    <div className="mt-2 space-y-1 rounded-md border border-border bg-muted/20 p-2 text-[11px] font-mono leading-relaxed">
      <div className="flex gap-2">
        <span className="shrink-0 text-red-500 font-bold">−</span>
        <span className="text-muted-foreground line-through">{truncate(oldVal)}</span>
      </div>
      <div className="flex gap-2">
        <span className="shrink-0 text-green-500 font-bold">+</span>
        <span className="text-foreground/90">{truncate(newVal)}</span>
      </div>
    </div>
  );
}

// ─── AuditHistory ─────────────────────────────────────────────────────────────

interface AuditHistoryProps {
  table: string;
  id: string;
  onClose: () => void;
}

export function AuditHistory({ table, id, onClose }: AuditHistoryProps) {
  const [rows, setRows] = React.useState<AuditRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/entries/${table}/${id}/audit`)
      .then((r) => r.json())
      .then((data: AuditRow[]) => {
        if (!cancelled) {
          setRows(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [table, id]);

  function toggleExpand(rowId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-border px-8 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
          Änderungshistorie
        </p>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Vorschau anzeigen
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {loading ? (
          <p className="text-sm text-muted-foreground/60">Lädt…</p>
        ) : rows.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground/60">Noch keine Änderungen</p>
            <p className="mt-1 text-xs text-muted-foreground/40">
              Änderungen erscheinen hier nach dem ersten Speichern.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-border bg-muted/10 p-3"
              >
                <button
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => toggleExpand(row.id)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      <code className="font-mono text-[11px] text-primary">{row.field}</code>
                      {' '}geändert
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/60">
                      {relativeTime(row.edited_at)} · {row.edited_by ?? 'shared'}
                    </p>
                  </div>
                  <span className="shrink-0 mt-0.5 text-muted-foreground/40 text-xs">
                    {expanded.has(row.id) ? '▲' : '▼'}
                  </span>
                </button>

                {expanded.has(row.id) && (
                  <DiffPair old={row.old_value} new={row.new_value} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
