'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { CountryBlockRow } from '@/lib/queries/documents';

interface Props {
  rows: CountryBlockRow[];
  /** Optional extra content rendered at the bottom of the panel (e.g. country-specific detail block). */
  extraDetails?: React.ReactNode;
}

// ─── Sectionizer: split rows into intro + named sections ─────────────────────

type Section = {
  number: string;       // "5.1", "5.2", ...
  title: string;        // "FatturaPA XML (...)"
  shortLabel: string;   // "FatturaPA"
  rows: CountryBlockRow[];
};

const SECTION_RE = /^►\s*(\d+\.\d+)\s*[—\-]\s*(.+)$/;

function isSectionHeader(feld: string): RegExpMatchArray | null {
  const first = feld.split('\n')[0].trim();
  return first.match(SECTION_RE);
}

function shortLabelOf(title: string): string {
  // Extract first 1-3 meaningful tokens
  const cleaned = title.replace(/\(.*?\)/g, '').trim();
  const parts = cleaned.split(/\s+/).slice(0, 3);
  return parts.join(' ').replace(/[—\-:].*$/, '').trim();
}

function sectionize(rows: CountryBlockRow[]): { intro: CountryBlockRow[]; sections: Section[] } {
  const intro: CountryBlockRow[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const r of rows) {
    const m = isSectionHeader(r.feld);
    if (m) {
      const title = m[2].trim();
      current = { number: m[1], title, shortLabel: shortLabelOf(title), rows: [] };
      sections.push(current);
    } else if (current) {
      current.rows.push(r);
    } else {
      intro.push(r);
    }
  }
  return { intro, sections };
}

// ─── Field row ────────────────────────────────────────────────────────────────

const TOKEN_RE = /\b(?:LFA1|LFB1|LFM1|LFBK|T001|T012|BSEG|REGUH|FBZP|OBY\d|OB\d{2,3}|SE\d{2,3}|SCAL|F110|FB\d{2}|MIRO|DRC|EBICS|H2H|SWIFT|SDI|FatturaPA|RIBA|SBF|CBI|pain\.\d{3}\.\d{3}\.\d{2}|pacs\.\d{3}\.\d{3}\.\d{2}|camt\.\d{3}\.\d{3}\.\d{2}|MT\d{3})\b/g;

function highlight(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > cursor) nodes.push(text.slice(cursor, m.index));
    nodes.push(
      <code
        key={m.index}
        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
      >
        {m[0]}
      </code>,
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function FieldCard({ row }: { row: CountryBlockRow }) {
  const [open, setOpen] = React.useState(false);
  const titleParts = row.feld.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = titleParts[0];
  const subtitle = titleParts.slice(1).join(' · ');
  const summary = (row.einsteiger ?? '').trim();
  const hasDetails = (row.experte && row.experte.trim()) || (row.praxis && row.praxis.trim()) || summary.length > 240;

  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <header className="mb-2">
        <div className="text-base font-semibold text-foreground">{title}</div>
        {subtitle && <div className="mt-0.5 text-sm text-muted-foreground">{subtitle}</div>}
      </header>
      {summary && (
        <p className="whitespace-pre-line text-base leading-relaxed text-foreground/85">
          {highlight(summary.length > 240 ? summary.slice(0, 240).replace(/\s\S*$/, '') + '…' : summary)}
        </p>
      )}
      {hasDetails && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-3 text-xs font-medium text-primary hover:underline"
        >
          {open ? 'Weniger anzeigen' : 'Details & SAP-Praxis'}
        </button>
      )}
      {open && (
        <div className="mt-3 space-y-3 border-t border-border/60 pt-3 text-base">
          {summary.length > 240 && (
            <Section label="Einsteiger" body={summary} />
          )}
          {row.experte && <Section label="Experte" body={row.experte} />}
          {row.praxis && (
            <section className="rounded-md border border-emerald-300/40 bg-emerald-50/40 p-3 dark:border-emerald-700/30 dark:bg-emerald-950/20">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                SAP-Praxis
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">{row.praxis}</pre>
            </section>
          )}
        </div>
      )}
    </article>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <p className="whitespace-pre-line leading-relaxed text-foreground/85">{highlight(body)}</p>
    </section>
  );
}

// ─── Beispiel-Dateien pro Format ──────────────────────────────────────────────

type Sample = {
  label: string;
  href: string;
  size: string;
  source?: { label: string; url: string };
};
const SAMPLES: Record<string, Sample[]> = {
  // Italien-Sektionen (Block 5)
  '5.1': [{
    label: 'fatturapa-1.2.xml',
    href: '/samples/it/fatturapa-1.2.xml',
    size: '~2 KB · XML',
    source: { label: 'Agenzia delle Entrate — Specifiche Tecniche FatturaPA v1.2', url: 'https://www.fatturapa.gov.it/it/norme-e-regole/documentazione-fatturapa/' },
  }],
  '5.2': [{
    label: 'cbi-bonifica.xml',
    href: '/samples/it/cbi-bonifica.xml',
    size: '~2 KB · XML',
    source: { label: 'CBI Globe — Tracciati e Standard', url: 'https://www.cbi-org.eu/Standards/Tracciati' },
  }],
  '5.3': [{
    label: 'riba.txt',
    href: '/samples/it/riba.txt',
    size: '~1 KB · Flat-File',
    source: { label: 'ABI — Standard Tracciato Riba', url: 'https://www.abi.it/' },
  }],
  '5.4': [{
    label: 'camt.053-it.xml',
    href: '/samples/it/camt.053-it.xml',
    size: '~3 KB · XML',
    source: { label: 'ISO 20022 — camt.053.001.08 Message Definition', url: 'https://www.iso20022.org/iso-20022-message-definitions' },
  }],
  // China-Sektionen (Block 6)
  '6.1': [
    {
      label: 'cips-pain.001-cn.xml',
      href: '/samples/cn/cips-pain.001-cn.xml',
      size: '~3 KB · XML',
      source: { label: 'CIPS — Business Specification (Customer Credit Transfer)', url: 'https://www.cips.com.cn/en/business_management/business_specification/index.html' },
    },
    {
      label: 'cips-pacs.008-cn.xml',
      href: '/samples/cn/cips-pacs.008-cn.xml',
      size: '~3 KB · XML',
      source: { label: 'CIPS — Business Specification (FI-to-FI)', url: 'https://www.cips.com.cn/en/business_management/business_specification/index.html' },
    },
  ],
  '6.2': [{
    label: 'cnaps-hvps.txt',
    href: '/samples/cn/cnaps-hvps.txt',
    size: '~1 KB · Flat-File',
    source: { label: 'People\'s Bank of China — CNAPS Documentation', url: 'http://www.pbc.gov.cn/' },
  }],
  '6.3': [{
    label: 'fapiao.xml',
    href: '/samples/cn/fapiao.xml',
    size: '~2 KB · XML',
    source: { label: 'State Tax Administration — Quan Mian Shu Zi Hua Fapiao Pilot', url: 'http://www.chinatax.gov.cn/' },
  }],
  '6.4': [{
    label: 'camt.053-cn.xml',
    href: '/samples/cn/camt.053-cn.xml',
    size: '~3 KB · XML',
    source: { label: 'ISO 20022 — camt.053.001.08 Message Definition', url: 'https://www.iso20022.org/iso-20022-message-definitions' },
  }],
  // Deutschland-Sektionen (Block 5, Sections 7.x)
  '7.1': [{
    label: 'sepa-sct-pain.001.xml',
    href: '/samples/de/sepa-sct-pain.001.xml',
    size: '~3 KB · XML',
    source: { label: 'EPC — SEPA Credit Transfer Scheme Rulebook', url: 'https://www.europeanpaymentscouncil.eu/document-library' },
  }],
  '7.2': [{
    label: 'sepa-sdd-pain.008.xml',
    href: '/samples/de/sepa-sdd-pain.008.xml',
    size: '~2 KB · XML',
    source: { label: 'EPC — SEPA Direct Debit Scheme Rulebook', url: 'https://www.europeanpaymentscouncil.eu/document-library' },
  }],
  '7.4': [{
    label: 'camt.053-de.xml',
    href: '/samples/de/camt.053-de.xml',
    size: '~3 KB · XML',
    source: { label: 'ISO 20022 — camt.053.001.08 Message Definition', url: 'https://www.iso20022.org/iso-20022-message-definitions' },
  }],
  '7.5': [{
    label: 'xrechnung-ubl.xml',
    href: '/samples/de/xrechnung-ubl.xml',
    size: '~4 KB · UBL 2.1 XML',
    source: { label: 'KoSIT — XRechnung Standard', url: 'https://xeinkauf.de/xrechnung/' },
  }],
  // USA-Sektionen (Block 5, Sections 8.x)
  '8.1': [{
    label: 'nacha-ach-ccd.txt',
    href: '/samples/us/nacha-ach-ccd.txt',
    size: '~1 KB · Flat-File (94-Char)',
    source: { label: 'NACHA — ACH Operating Rules & Guidelines', url: 'https://www.nacha.org/rules' },
  }],
  '8.2': [{
    label: 'fedwire-sample.txt',
    href: '/samples/us/fedwire-sample.txt',
    size: '~1 KB · Tag-Value',
    source: { label: 'Federal Reserve — Fedwire Funds Service Format Reference', url: 'https://www.frbservices.org/financial-services/wires' },
  }],
  '8.3': [{
    label: 'fednow-pacs.008.xml',
    href: '/samples/us/fednow-pacs.008.xml',
    size: '~3 KB · XML',
    source: { label: 'Federal Reserve — FedNow Service ISO 20022 Message Specification', url: 'https://www.frbservices.org/financial-services/fednow' },
  }],
  '8.4': [{
    label: 'edi-x12-820.txt',
    href: '/samples/us/edi-x12-820.txt',
    size: '~1 KB · EDI',
    source: { label: 'ANSI ASC X12 — Transaction Set 820 Payment Order/Remittance Advice', url: 'https://x12.org/' },
  }],
  '8.5': [{
    label: 'positive-pay.csv',
    href: '/samples/us/positive-pay.csv',
    size: '~1 KB · CSV',
    source: { label: 'Bank-spezifisch — Positive Pay File Format (Beispiel JPMorgan)', url: 'https://www.jpmorgan.com/' },
  }],
  '8.6': [{
    label: 'cbpr-pacs.008-us.xml',
    href: '/samples/us/cbpr-pacs.008-us.xml',
    size: '~3 KB · XML',
    source: { label: 'SWIFT — CBPR+ pacs.008 Usage Guidelines', url: 'https://www.swift.com/standards/iso-20022/iso-20022-programme/universal-confirmations' },
  }],
  // Schweiz-Sektionen (Block 5, Sections 9.x)
  '9.1': [{
    label: 'ch-pain.001.xml',
    href: '/samples/ch/ch-pain.001.xml',
    size: '~3 KB · XML',
    source: { label: 'SIX — Swiss Payment Standards Implementation Guidelines', url: 'https://www.six-group.com/en/products-services/banking-services/payment-standardization/standards/swiss-payment-standards.html' },
  }],
  '9.3': [{
    label: 'qr-rechnung-payload.txt',
    href: '/samples/ch/qr-rechnung-payload.txt',
    size: '~1 KB · SPC Text',
    source: { label: 'SIX — Swiss QR Bill Specification', url: 'https://www.six-group.com/en/products-services/banking-services/payment-standardization/standards/qr-bill.html' },
  }],
  '9.4': [{
    label: 'ch-lsv-pain.008.xml',
    href: '/samples/ch/ch-lsv-pain.008.xml',
    size: '~2 KB · XML',
    source: { label: 'SIX — Swiss Direct Debit Implementation Guidelines', url: 'https://www.six-group.com/en/products-services/banking-services/payment-standardization/standards/swiss-payment-standards.html' },
  }],
  '9.5': [{
    label: 'camt.053-ch.xml',
    href: '/samples/ch/camt.053-ch.xml',
    size: '~3 KB · XML',
    source: { label: 'SIX — Swiss camt Message Implementation Guidelines', url: 'https://www.six-group.com/en/products-services/banking-services/payment-standardization/standards/swiss-payment-standards.html' },
  }],
  // UK-Sektionen (Block 5, Sections 10.x)
  '10.1': [{
    label: 'bacs-std18.txt',
    href: '/samples/gb/bacs-std18.txt',
    size: '~1 KB · Fixed-Length',
    source: { label: 'Pay.UK — Bacs Standard 18 File Format Specification', url: 'https://www.bacs.co.uk/' },
  }],
  '10.2': [{
    label: 'fps-openbanking-domestic.json',
    href: '/samples/gb/fps-openbanking-domestic.json',
    size: '~2 KB · JSON',
    source: { label: 'Open Banking UK — Domestic Payment Message Formats v3.1', url: 'https://openbankinguk.github.io/read-write-api-site3/v3.1.5/references/domestic-payment-message-formats.html' },
  }],
  '10.3': [{
    label: 'chaps-pacs.008.xml',
    href: '/samples/gb/chaps-pacs.008.xml',
    size: '~3 KB · XML',
    source: { label: 'Bank of England — CHAPS ISO 20022 Message Specification', url: 'https://www.bankofengland.co.uk/payment-and-settlement/chaps' },
  }],
  '10.4': [{
    label: 'swift-pacs.008-gb.xml',
    href: '/samples/gb/swift-pacs.008-gb.xml',
    size: '~3 KB · XML',
    source: { label: 'SWIFT — CBPR+ pacs.008 Usage Guidelines (EU↔GB Post-Brexit)', url: 'https://www.swift.com/standards/iso-20022' },
  }],
  '10.5': [{
    label: 'camt.053-gb.xml',
    href: '/samples/gb/camt.053-gb.xml',
    size: '~2 KB · XML',
    source: { label: 'ISO 20022 — camt.053.001.08 Message Definition', url: 'https://www.iso20022.org/iso-20022-message-definitions' },
  }],
  // Indien-Sektionen (Block 5, Sections 11.x)
  '11.1': [{
    label: 'neft-rtgs-sample.csv',
    href: '/samples/in/neft-rtgs-sample.csv',
    size: '~1 KB · CSV',
    source: { label: 'Bankspezifisch — NEFT/RTGS H2H File Format (Beispiel)', url: 'https://rbi.org.in/' },
  }],
  '11.2': [{
    label: 'swift-pacs.008-in.xml',
    href: '/samples/in/swift-pacs.008-in.xml',
    size: '~3 KB · XML',
    source: { label: 'SWIFT — CBPR+ pacs.008 with RBI Purpose Code + IFSC + PAN', url: 'https://www.swift.com/standards/iso-20022' },
  }],
  '11.3': [{
    label: 'gst-einvoice-sample.json',
    href: '/samples/in/gst-einvoice-sample.json',
    size: '~2 KB · JSON',
    source: { label: 'GST Council — e-Invoice Schema v1.1', url: 'https://einvoice1.gst.gov.in/' },
  }],
  '11.4': [{
    label: 'mt940-in-sample.txt',
    href: '/samples/in/mt940-in-sample.txt',
    size: '~1 KB · SWIFT MT940',
    source: { label: 'SWIFT — MT940 Customer Statement Message', url: 'https://www.swift.com/' },
  }],
};
const STD_SAMPLES: Sample[] = [
  {
    label: 'pain.001.001.03.xml',
    href: '/samples/formate/pain.001.001.03.xml',
    size: 'SEPA SCT · XML',
    source: { label: 'EPC — SEPA Credit Transfer Scheme Customer-to-Bank Implementation Guidelines', url: 'https://www.europeanpaymentscouncil.eu/document-library' },
  },
];

function SampleList({ samples, label = 'Beispiel-Datei' }: { samples: Sample[]; label?: string }) {
  if (!samples.length) return null;
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <ul className="space-y-2">
        {samples.map((s) => (
          <li key={s.href} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <a
                href={s.href}
                download={s.label}
                className="inline-flex items-center gap-1.5 font-mono font-medium text-primary hover:underline"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
                  <path d="M10 2v3h3" />
                </svg>
                {s.label}
              </a>
              <span className="text-xs text-muted-foreground">{s.size}</span>
            </div>
            {s.source && (
              <div className="pl-5 text-xs text-muted-foreground">
                Quelle:{' '}
                <a
                  href={s.source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary/80 hover:text-primary hover:underline"
                >
                  {s.source.label}
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function FormateItPanel({ rows, extraDetails }: Props) {
  const { intro, sections } = sectionize(rows);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const activeSection = sections[activeIdx];

  // Intro: show the most relevant intro row (e.g. pain.001.001.03 row) as a callout
  const introRow = intro.find((r) => /pain\.001/.test(r.feld));
  // Remaining intro rows (non-section, non-callout) render as flat card grid below
  const flatIntroRows = intro.filter((r) => r !== introRow);

  return (
    <div className="space-y-5">
      {introRow && (
        <div className="space-y-3 rounded-lg border-l-4 border-primary/60 bg-primary/5 p-4">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Standardfall
            </div>
            <div className="text-base font-semibold text-foreground">{introRow.feld.split('\n')[0]}</div>
            {introRow.einsteiger && (
              <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground/85">
                {highlight(introRow.einsteiger)}
              </p>
            )}
          </div>
          <SampleList samples={STD_SAMPLES} />
        </div>
      )}

      {/* Sub-Tabs für die Format-Sektionen */}
      {sections.length > 0 && (
        <>
          <div className="flex flex-wrap gap-1.5 border-b border-border">
            {sections.map((s, i) => (
              <button
                key={s.number}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  'shrink-0 rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-px',
                  activeIdx === i
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="mr-1.5 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                  {s.number}
                </span>
                {s.shortLabel}
              </button>
            ))}
          </div>

          {activeSection && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{activeSection.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {activeSection.rows.length} Felder im Format
                </p>
              </div>
              <SampleList samples={SAMPLES[activeSection.number] ?? []} />
              <div className="grid items-stretch gap-3 md:grid-cols-2">
                {activeSection.rows.map((r, i) => (
                  <FieldCard key={i} row={r} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Fallback: if there are no section headers, render the remaining intro rows as a flat grid */}
      {sections.length === 0 && flatIntroRows.length > 0 && (
        <div className="grid items-stretch gap-3 md:grid-cols-2">
          {flatIntroRows.map((r, i) => (
            <FieldCard key={i} row={r} />
          ))}
        </div>
      )}

      {extraDetails}
    </div>
  );
}
