'use client';

import * as React from 'react';

type Code = { code: string; name: string; category: string; note: string };

// Vollständige NBS-Dinar-Zahlungscode-Liste (ca. 50 Codes).
// Quelle: NBS (https://www.nbs.rs/sr/drugi-nivo-navigacije/servisi/sifarnik-placanja/)
// und Serbia_NBS_Payment_Codes_DeepDive.docx, Abschnitt 4.
const CODES: Code[] = [
  // 4.1 Waren, Dienstleistungen, Investitionen (20–31)
  { code: '220', name: 'Waren/DL — Vorleistung (bar)', category: 'Waren / DL', note: 'Rohmaterial, Energie, Fremdleistung' },
  { code: '221', name: 'Waren/DL — Endverbrauch (unbar)', category: 'Waren / DL', note: 'Standard-B2B-Lieferantenzahlung inkl. Kommissionen/Gebühren' },
  { code: '222', name: 'Öffentliche Versorgung (unbar)', category: 'Waren / DL', note: 'Wasser, Strom, Telekom' },
  { code: '223', name: 'Investitionen Gebäude/Anlagen (unbar)', category: 'Capex', note: 'Capex — Bau, Maschinen, inkl. Lieferung/Installation' },
  { code: '224', name: 'Sonstige Investitionen (unbar)', category: 'Capex', note: 'Capex außer Gebäude/Anlagen' },
  { code: '225', name: 'Miete staatl. Immobilien (unbar)', category: 'Miete', note: 'Leasing staatlicher Immobilien' },
  { code: '226', name: 'Miete steuerpflichtig (unbar)', category: 'Miete', note: 'Standard-B2B/B2C-Miete' },
  { code: '227', name: 'Subventionen (Treasury)', category: 'Subventionen', note: 'Vom konsolidierten Treasury-Konto' },
  { code: '228', name: 'Subventionen (sonstige)', category: 'Subventionen', note: 'Von sonstigen Konten' },
  { code: '231', name: 'Zoll & Importabgaben', category: 'Zoll', note: 'Konsolidierte Zollzahlungen' },
  // 4.2 Gehälter und Sozialleistungen (40–49)
  { code: '240', name: 'Gehalt — Mitarbeiterverdienst (unbar)', category: 'Gehalt', note: '⚠ Kritisch: falscher Code = Bank registriert keine Gehaltszahlung; blockiert Mitarbeiter-Kreditanträge und Steuer-Reporting' },
  { code: '241', name: 'Steuerfreie AG-Leistungen', category: 'Gehalt', note: 'Reisekosten, Jubiläumsgeschenke, Kindergeld-Zuschüsse' },
  { code: '242', name: 'Entgeltfortzahlung durch AG', category: 'Gehalt', note: 'Krankengeld, Arbeitsunfall-Entschädigung' },
  { code: '245', name: 'Renten', category: 'Gehalt', note: 'Rentenzahlungen an Rentner' },
  { code: '247', name: 'Sonstige Sozialleistungen', category: 'Sozial', note: 'Arbeitslosengeld, Invalidität, Sozialhilfe' },
  { code: '248', name: 'Investment-Einkommen', category: 'Einkommen', note: 'Dividenden, Zinsen, Miete, Versicherungsleistungen' },
  { code: '249', name: 'Sonstiges Einkommen', category: 'Einkommen', note: 'Dienstleistungsverträge, Urheberrechte, Stipendien' },
  // 4.3 Öffentliche Einnahmen (53–58)
  { code: '253', name: 'Laufende öffentliche Einnahmen', category: 'Steuer', note: 'Workhorse-Code: Grundsteuer, Quellensteuer, Gebühren' },
  { code: '254', name: 'Quellensteuer & Beiträge (konsolidiert)', category: 'Steuer', note: 'Gehalts-Quellensteuer via objedinjena naplata' },
  { code: '257', name: 'Rückerstattung überzahlter öff. Einnahmen', category: 'Steuer', note: 'Steuerrückerstattungen' },
  { code: '258', name: 'Umbuchung überzahlter öff. Einnahmen', category: 'Steuer', note: 'Steuerkorrekturen' },
  // 4.5 Transfers (60–66)
  { code: '260', name: 'Versicherungsprämien und -leistungen', category: 'Versicherung', note: 'Prämien, Rückversicherung, Schadensregulierung' },
  { code: '261', name: 'Verteilung laufender Einnahmen', category: 'Transfer', note: 'Verteilung von Steuern / Beiträgen an Empfänger' },
  { code: '262', name: 'Transfers innerhalb staatlicher Organe', category: 'Transfer', note: 'Treasury-Konten, Haushaltsnutzer-Transfers' },
  { code: '263', name: 'Sonstige Transfers', category: 'Transfer', note: 'Transfers innerhalb derselben juristischen Person (andere Bank); Gewinnausschüttung' },
  { code: '265', name: 'Bareinzahlung Tageskasse („pazar")', category: 'Transfer', note: 'Täglicher Einzahlungsschluss Retail-Bargeld' },
  { code: '266', name: 'Barabhebung', category: 'Transfer', note: 'Alle Cash-Abhebungen von Firmen-/Unternehmer-Konten' },
  // 4.4 Finanztransaktionen (70–90)
  { code: '270', name: 'Kurzfrist-Kredit (Auszahlung)', category: 'Finanz', note: 'Principal-Auszahlung — auch für IC-Kredite! Triggert KZ-3B' },
  { code: '271', name: 'Langfrist-Kredit (Auszahlung)', category: 'Finanz', note: 'Langfristige Principal-Auszahlung' },
  { code: '272', name: 'Aktive Zinsen', category: 'Finanz', note: 'Zinsen auf ausstehende Kredite' },
  { code: '276', name: 'Tilgung Kurzfrist-Kredit', category: 'Finanz', note: 'Kurzfrist-Tilgung' },
  { code: '277', name: 'Tilgung Langfrist-Kredit', category: 'Finanz', note: 'Langfrist-Tilgung' },
  { code: '278', name: 'Festgeld-Abhebung', category: 'Finanz', note: 'Beendigung Termineinlage' },
  { code: '279', name: 'Passive Zinsen', category: 'Finanz', note: 'Zinsen auf Einlagen' },
  { code: '281', name: 'Gesellschafterdarlehen (Einlage)', category: 'Finanz', note: 'Gesellschafter bringt Betriebsmittel in das Unternehmen' },
  { code: '282', name: 'Rückzahlung Gesellschafterdarlehen', category: 'Finanz', note: 'Unternehmen zahlt das Liquiditätsdarlehen zurück' },
  { code: '283', name: 'Schecks von natürlichen Personen', category: 'Finanz', note: 'Einzug' },
  { code: '284', name: 'Zahlungskarten', category: 'Finanz', note: 'Kartentransaktionen' },
  { code: '285', name: 'FX-Operationen', category: 'Finanz', note: 'Devisentausch über autorisierte Händler' },
  { code: '286', name: 'FX Kauf/Verkauf', category: 'Finanz', note: 'FX-Markt-Transaktionen' },
  { code: '287', name: 'Spenden und Sponsoring', category: 'Spende', note: 'CSR-Spenden' },
  { code: '288', name: 'Internationale Spenden', category: 'Spende', note: 'Spenden aus internationalen Abkommen' },
  { code: '289', name: 'Transaktionen im Auftrag natürlicher Personen', category: 'P2P', note: 'P2P-Zahlungen von Privaten' },
  { code: '290', name: 'Sonstige Transaktionen', category: 'Sonstiges', note: 'Catch-all — sparsam nutzen, NBS prüft systematisch' },
];

const SAMPLE_XML_HREF = '/samples/rs/pain.001-rs-domestic.xml';

export function SerbienCodesDetails() {
  const [open, setOpen] = React.useState(false);

  return (
    <section className="rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted/40"
        aria-expanded={open}
      >
        <div>
          <div className="text-base font-semibold text-foreground">
            Vollständige NBS-Zahlungscode-Liste & pain.001-Beispiel
          </div>
          <div className="text-sm text-muted-foreground">
            {CODES.length} Inlands-Dinar-Codes (sifra placanja) · 1 pain.001.001.09-Beispieldatei
          </div>
        </div>
        <span
          className={`inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-primary transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="space-y-6 border-t border-border/60 px-4 py-4">
          {/* Sample download */}
          <div className="rounded-md border border-emerald-300/40 bg-emerald-50/40 p-3 dark:border-emerald-700/30 dark:bg-emerald-950/20">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
              Beispiel-Datei
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <a
                href={SAMPLE_XML_HREF}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono font-medium text-primary hover:underline"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
                  <path d="M10 2v3h3" />
                </svg>
                pain.001-rs-domestic.xml
              </a>
              <span className="text-xs text-muted-foreground">pain.001.001.09 · NBS-Code 221 · RSD 250.000</span>
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground">
              Norival d.o.o. Beograd → Balkan Trade d.o.o. Novi Sad. Zeigt <code className="rounded bg-muted px-1">&lt;Purp&gt;&lt;Prtry&gt;221&lt;/Prtry&gt;&lt;/Purp&gt;</code> und „poziv na broj" (Model 97).
              Quelle: NBS DeepDive Appendix (Serbia_NBS_Payment_Codes_DeepDive.docx).
            </div>
          </div>

          {/* Full code list */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Bezeichnung</th>
                  <th className="px-3 py-2">Kategorie</th>
                  <th className="px-3 py-2">Hinweis</th>
                </tr>
              </thead>
              <tbody>
                {CODES.map((c) => (
                  <tr key={c.code} className="border-b border-border/40 align-top">
                    <td className="px-3 py-2 font-mono font-semibold text-foreground">{c.code}</td>
                    <td className="px-3 py-2 text-foreground/90">{c.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{c.category}</td>
                    <td className="px-3 py-2 text-foreground/80">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            Die verbindliche Liste wird von der NBS gepflegt (jährliche Updates):{' '}
            <a
              href="https://www.nbs.rs/sr/drugi-nivo-navigacije/servisi/sifarnik-placanja/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              nbs.rs/sifarnik-placanja
            </a>
            . Cross-Border-Codes (IMF BOP-Methodik, Nummernkreise 100–999) werden in einer separaten NBS-Tabelle geführt.
          </p>
        </div>
      )}
    </section>
  );
}
