'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { runEngine } from '@/lib/scope/engine';
import type { KbData, ScopeParams, ReportData, TechnikResult } from '@/lib/scope/engine';
import type { ScopeAnalysis } from '@/lib/queries/scope';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  kbData: KbData;
  initialSaved: ScopeAnalysis[];
}

// ─── CountrySelect ────────────────────────────────────────────────────────────

interface CountrySelectProps {
  label: string;
  hint: string;
  value: string[];
  onChange: (v: string[]) => void;
  countries: { code: string; name: string }[];
  chipClass: string;
}

function CountrySelect({ label, hint, value, onChange, countries, chipClass }: CountrySelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = countries
    .filter(c =>
      !value.includes(c.code) &&
      (c.code.toLowerCase().includes(query.toLowerCase()) ||
       c.name.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 8);

  const isKb = (code: string) => countries.some(c => c.code === code);

  function add(code: string) {
    onChange([...value, code]);
    setQuery('');
  }

  function remove(code: string) {
    onChange(value.filter(c => c !== code));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const code = query.trim().toUpperCase().slice(0, 2);
      if (code.length >= 2 && !value.includes(code)) add(code);
    }
    if (e.key === 'Backspace' && !query && value.length > 0) {
      remove(value[value.length - 1]);
    }
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="text-xs text-muted-foreground/60">{hint}</div>
      <div
        className="min-h-[38px] cursor-text rounded-md border border-input bg-background px-2 py-1.5 flex flex-wrap gap-1.5 items-center focus-within:ring-1 focus-within:ring-primary relative"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(code => (
          <span key={code} className={cn('inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium', chipClass, !isKb(code) && 'opacity-60')}>
            {code}
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(code); }} className="ml-0.5 hover:opacity-70 leading-none" aria-label={`${code} entfernen`}>×</button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[80px]">
          <input
            ref={inputRef}
            className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/40"
            placeholder={value.length === 0 ? 'Suchen oder ISO-Code eingeben…' : ''}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKeyDown}
          />
          {open && filtered.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-52 overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent text-left"
                  onMouseDown={e => { e.preventDefault(); add(c.code); }}
                >
                  <span className="font-mono font-semibold w-6 text-muted-foreground">{c.code}</span>
                  <span className="truncate text-foreground">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {value.filter(c => !isKb(c)).length > 0 && (
        <p className="text-xs text-amber-600">
          {value.filter(c => !isKb(c)).join(', ')}: Kein KB-Eintrag vorhanden
        </p>
      )}
    </div>
  );
}

// ─── Report Cards ─────────────────────────────────────────────────────────────

function CardShell({ title, accentClass, children, href, linkLabel }: {
  title: string; accentClass: string; children: React.ReactNode; href: string; linkLabel: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 gap-3">
      <div className={cn('text-xs font-bold uppercase tracking-wider', accentClass)}>{title}</div>
      <div className="flex-1 text-sm text-foreground">{children}</div>
      <Link href={href} className={cn('text-xs font-semibold', accentClass)}>→ {linkLabel}</Link>
    </div>
  );
}

function TechnikCard({ t }: { t: TechnikResult }) {
  const dots = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={cn('inline-block h-2 w-2 rounded-full', i < t.complexity ? 'bg-primary' : 'bg-muted')} />
  ));
  return (
    <CardShell title="Verbindungsprotokoll" accentClass="text-primary" href="/technik" linkLabel="Technik-Details">
      <p className="font-semibold mb-1">{t.primary.join(' + ')}</p>
      <p className="text-xs text-muted-foreground mb-2">
        Alternativ: {t.alternatives.join(', ')}
      </p>
      <div className="flex items-center gap-1 mb-2">{dots}<span className="ml-1 text-xs text-muted-foreground">Komplexität</span></div>
      <ul className="text-xs text-muted-foreground space-y-0.5">
        {t.reasons.map((r, i) => <li key={i}>• {r}</li>)}
      </ul>
    </CardShell>
  );
}

function FormateCard({ formate }: { formate: ReportData['formate'] }) {
  const byRegion = formate.reduce<Record<string, string[]>>((acc, f) => {
    const r = f.region ?? 'Global';
    (acc[r] ??= []).push(f.format_name);
    return acc;
  }, {});
  return (
    <CardShell title="Zahlungsformate" accentClass="text-blue-600 dark:text-blue-400" href="/formate" linkLabel="Format-Bibliothek">
      {Object.entries(byRegion).map(([region, names]) => (
        <div key={region} className="mb-2">
          <div className="text-xs text-muted-foreground mb-1">{region}</div>
          <div className="flex flex-wrap gap-1">
            {names.map(n => (
              <span key={n} className="rounded bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">{n}</span>
            ))}
          </div>
        </div>
      ))}
      {formate.length === 0 && <p className="text-xs text-muted-foreground">Keine Treffer.</p>}
    </CardShell>
  );
}

function ClearingCard({ clearing }: { clearing: ReportData['clearing'] }) {
  return (
    <CardShell title="Clearing-Systeme" accentClass="text-purple-600 dark:text-purple-400" href="/clearing" linkLabel="Clearing-Details">
      {clearing.length === 0 && <p className="text-xs text-muted-foreground">Keine Treffer.</p>}
      <div className="space-y-1">
        {clearing.map(c => (
          <div key={c.id} className="flex items-baseline justify-between text-xs">
            <span className="font-medium">{c.abkuerzung ?? c.name}</span>
            <span className="text-muted-foreground ml-2">{c.region}</span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function RegulatorikCard({ regulatorik }: { regulatorik: ReportData['regulatorik'] }) {
  return (
    <CardShell title="Regulatorik" accentClass="text-red-600 dark:text-red-400" href="/regulatorik" linkLabel="Regulatorik-Detail">
      {regulatorik.length === 0 && <p className="text-xs text-muted-foreground">Keine Treffer.</p>}
      <div className="space-y-1">
        {regulatorik.slice(0, 6).map(r => (
          <div key={r.id} className="flex items-center gap-1.5 text-xs">
            <span className="text-green-600">✔</span>
            <span className="font-medium">{r.kuerzel ?? r.name}</span>
            {r.aufwand_tshirt && <span className="ml-auto text-muted-foreground">{r.aufwand_tshirt}</span>}
          </div>
        ))}
        {regulatorik.length > 6 && (
          <p className="text-xs text-muted-foreground">+ {regulatorik.length - 6} weitere…</p>
        )}
      </div>
    </CardShell>
  );
}

const IHB_AMPEL: Record<string, string> = {
  grün: '🟢', green: '🟢',
  gelb: '🟡', yellow: '🟡', eingeschränkt: '🟡',
  rot: '🔴', red: '🔴', 'nicht erlaubt': '🔴',
};

function getAmpel(val: string | null): string {
  if (!val) return '🟡';
  const lower = val.toLowerCase();
  for (const [key, emoji] of Object.entries(IHB_AMPEL)) {
    if (lower.includes(key)) return emoji;
  }
  return '🟡';
}

function IhbCard({ ihb }: { ihb: ReportData['ihb'] }) {
  return (
    <div className="flex flex-col rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 gap-3">
      <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">IHB / POBO / COBO</div>
      <div className="flex-1 space-y-1">
        {ihb.map(e => (
          <div key={e.id} className="text-xs flex items-baseline gap-1.5">
            <span>{getAmpel(e.pobo_status)}</span>
            <span className="font-mono font-semibold w-5">{e.land.length <= 2 ? e.land.toUpperCase() : e.land.slice(0, 2).toUpperCase()}</span>
            <span className="text-muted-foreground">POBO: {e.pobo_status ?? '?'} · COBO: {e.cobo_status ?? '?'}</span>
          </div>
        ))}
        {ihb.length === 0 && <p className="text-xs text-muted-foreground">Keine IHB-Einträge gefunden.</p>}
      </div>
      <Link href="/laender" className="text-xs font-semibold text-amber-700 dark:text-amber-400">→ IHB-Komplexitätsmatrix</Link>
    </div>
  );
}

const COMPLEXITY_DOT: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

function LaenderCard({ laender, fremdlaender }: { laender: ReportData['laender']; fremdlaender: string[] }) {
  return (
    <CardShell title="Länderspezifika" accentClass="text-slate-600 dark:text-slate-400" href="/laender" linkLabel="Länder-KB">
      <div className="space-y-1">
        {laender.map(c => (
          <Link key={c.code} href={`/laender/${c.code.toLowerCase()}`} className="flex items-center gap-2 text-xs hover:text-primary group">
            <span className={cn('h-2 w-2 rounded-full shrink-0', COMPLEXITY_DOT[c.complexity] ?? 'bg-muted')} />
            <span className="font-mono font-semibold w-5">{c.code}</span>
            <span className="text-muted-foreground group-hover:text-foreground">{c.currency} · {c.payment_infra?.split(',')[0]}</span>
          </Link>
        ))}
        {fremdlaender.map(code => (
          <div key={code} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-muted shrink-0" />
            <span className="font-mono font-semibold w-5">{code}</span>
            <span className="italic">Kein KB-Eintrag</span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function SapCard({ components }: { components: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">SAP-Konfiguration</div>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {components.map(c => (
          <span key={c} className="text-xs flex items-center gap-1">
            <span className="text-green-600">✔</span> {c}
          </span>
        ))}
      </div>
      <Link href="/sap/implementierung" className="mt-3 inline-block text-xs font-semibold text-slate-600 dark:text-slate-400">→ SAP Implementierungspfade</Link>
    </div>
  );
}

// ─── Summary Banner ───────────────────────────────────────────────────────────

function SummaryBanner({ report, allCodes }: { report: ReportData; allCodes: string[] }) {
  const regions = [...new Set([
    ...report.clearing.map(c => c.region).filter(Boolean),
    ...report.formate.map(f => f.region).filter(Boolean),
  ])];
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-3 flex flex-wrap gap-x-4 gap-y-1 items-center text-sm">
      <span className="font-semibold">{allCodes.length} {allCodes.length === 1 ? 'Land' : 'Länder'}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{regions.length} Regionen</span>
      <span className="text-muted-foreground">·</span>
      <span>Protokoll: <strong>{report.technik.primary.join(' + ')}</strong></span>
      {report.technik.complexity >= 4 && (
        <><span className="text-muted-foreground">·</span><span className="text-red-600 font-medium">Hohe Komplexität</span></>
      )}
      {report.fremdlaender.length > 0 && (
        <><span className="text-muted-foreground">·</span><span className="text-amber-600">{report.fremdlaender.length} Land/Länder ohne KB-Eintrag</span></>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ScopeClient({ kbData, initialSaved }: Props) {
  const [heimatland, setHeimatland] = useState('');
  const [opsLaender, setOpsLaender] = useState<string[]>([]);
  const [hausbankLaender, setHausbankLaender] = useState<string[]>([]);
  const [flagKonzern, setFlagKonzern] = useState(false);
  const [flagS4hana, setFlagS4hana] = useState(false);
  const [flagDringend, setFlagDringend] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [savedList, setSavedList] = useState<ScopeAnalysis[]>(initialSaved);
  const [saveOpen, setSaveOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const countryOptions = kbData.countries.map(c => ({ code: c.code, name: c.name }));

  const allCodes = [...new Set([heimatland, ...opsLaender, ...hausbankLaender].filter(Boolean))];

  function buildParams(): ScopeParams {
    return { heimatland, opsLaender, hausbankLaender, flagKonzern, flagS4hana, flagDringend };
  }

  function handleAnalyse() {
    if (!heimatland) return;
    setReport(runEngine(buildParams(), kbData));
  }

  function loadAnalysis(a: ScopeAnalysis) {
    setHeimatland(a.heimatland);
    setOpsLaender(a.ops_laender ?? []);
    setHausbankLaender(a.hausbank_laender ?? []);
    setFlagKonzern(a.flag_konzern ?? false);
    setFlagS4hana(a.flag_s4hana ?? false);
    setFlagDringend(a.flag_dringend ?? false);
    const params: ScopeParams = {
      heimatland: a.heimatland,
      opsLaender: a.ops_laender ?? [],
      hausbankLaender: a.hausbank_laender ?? [],
      flagKonzern: a.flag_konzern ?? false,
      flagS4hana: a.flag_s4hana ?? false,
      flagDringend: a.flag_dringend ?? false,
    };
    setReport(runEngine(params, kbData));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:             projectName || undefined,
          heimatland,
          ops_laender:      opsLaender,
          hausbank_laender: hausbankLaender,
          flag_konzern:     flagKonzern,
          flag_s4hana:      flagS4hana,
          flag_dringend:    flagDringend,
        }),
      });
      if (res.ok) {
        const saved = await res.json() as ScopeAnalysis;
        setSavedList(prev => [saved, ...prev].slice(0, 10));
        setSaveOpen(false);
        setProjectName('');
        setSaveError('');
      } else {
        setSaveError('Speichern fehlgeschlagen. Bitte erneut versuchen.');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/scope/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 404) {
        setSavedList(prev => prev.filter(a => a.id !== id));
      }
    } catch {
      // network error — leave list unchanged
    }
  }

  function formatSavedLabel(a: ScopeAnalysis): string {
    const date = a.created_at ? new Date(a.created_at).toLocaleDateString('de-DE') : '';
    const extra = (a.ops_laender?.length ?? 0) + (a.hausbank_laender?.length ?? 0);
    return `${a.heimatland}${extra > 0 ? ` + ${extra} Länder` : ''} · ${date}`;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Scope-Analyse</h1>
        <p className="text-sm text-muted-foreground">Wähle Länder und erhalte alle relevanten KB-Inhalte für dein Projekt.</p>
      </div>

      {/* Saved analyses */}
      {savedList.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gespeicherte Analysen</div>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
            {savedList.map(a => (
              <div key={a.id} className="flex items-center justify-between px-4 py-2.5 group">
                <button
                  type="button"
                  onClick={() => loadAnalysis(a)}
                  className="flex-1 text-left text-sm hover:text-primary"
                >
                  <span className="font-medium">{a.name ?? 'Ohne Name'}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{formatSavedLabel(a)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="ml-4 text-muted-foreground hover:text-destructive text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Löschen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input form */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projektparameter</div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Heimatland */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Heimatland / SAP-Standort</div>
            <select
              value={heimatland}
              onChange={e => setHeimatland(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">— Bitte wählen —</option>
              {countryOptions.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Operationsländer */}
          <CountrySelect
            label="Operationsländer"
            hint="Wo zahlt das Unternehmen?"
            value={opsLaender}
            onChange={setOpsLaender}
            countries={countryOptions}
            chipClass="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          />

          {/* Hausbank-Länder */}
          <CountrySelect
            label="Hausbank-Länder"
            hint="Wo liegen die Banken?"
            value={hausbankLaender}
            onChange={setHausbankLaender}
            countries={countryOptions}
            chipClass="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <span className="text-xs font-semibold text-muted-foreground">Optionen:</span>
          <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
            <input type="checkbox" checked={flagKonzern} onChange={e => setFlagKonzern(e.target.checked)} className="accent-primary" />
            Konzern / Gruppenstruktur
          </label>
          <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
            <input type="checkbox" checked={flagS4hana} onChange={e => setFlagS4hana(e.target.checked)} className="accent-primary" />
            Nur SAP S/4HANA
          </label>
          <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
            <input type="checkbox" checked={flagDringend} onChange={e => setFlagDringend(e.target.checked)} className="accent-primary" />
            Dringend (&lt; 3 Monate Go-Live)
          </label>
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleAnalyse}
              disabled={!heimatland}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              Analyse starten →
            </button>
          </div>
        </div>
      </div>

      {/* Report */}
      {report && (
        <div className="space-y-4">
          <SummaryBanner report={report} allCodes={allCodes} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <TechnikCard t={report.technik} />
            <FormateCard formate={report.formate} />
            <ClearingCard clearing={report.clearing} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RegulatorikCard regulatorik={report.regulatorik} />
            {report.ihb.length > 0 && <IhbCard ihb={report.ihb} />}
            <LaenderCard laender={report.laender} fremdlaender={report.fremdlaender} />
          </div>

          <SapCard components={report.technik.sapComponents} />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => { setSaveOpen(true); setSaveError(''); }}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Analyse speichern
            </button>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {saveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl mx-4" role="dialog" aria-modal="true" aria-labelledby="save-modal-title">
            <h2 id="save-modal-title" className="font-heading text-lg font-semibold mb-4">Analyse speichern</h2>
            <input
              type="text"
              placeholder="Projektname (optional)"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaveOpen(false); }}
              autoFocus
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-4"
            />
            {saveError && (
              <p className="text-xs text-destructive mb-3">{saveError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSaveOpen(false)}
                className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                {saving ? 'Speichern…' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
