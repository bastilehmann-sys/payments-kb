'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Entry = Record<string, string | null>;
type Version = Record<string, string | null | boolean>;

interface Props {
  base: Entry;
  version: Version;
  allVersions: Version[];
}

// ─── Token-Highlight ──────────────────────────────────────────────────────────

const TOKEN_RE = /\b(?:LFA1|LFB1|T001|BSEG|BKPF|REGUH|FBZP|OBY\d|OB\d{2,3}|F110|FB\d{2}|MIRO|FI-BL|TRM-TM|BC-SEC|BCM|FSCM|DRC|DMEE|DMEEX|EBICS|H2H|SWIFT|SCA|IBAN|BIC|BICFI|LEI|UETR|UltimateOriginator|PostalAddress24|StrtNm|BldgNb|BldgNm|Flr|PstBx|Room|PstCd|TwnNm|TwnLctnNm|DstrctNm|CtrySubDvsn|Ctry|InitgPty|Dbtr|Cdtr|GrpHdr|PmtInf|CdtTrfTxInf|EndToEndId|InstrId|ReqdExctnDt|OrgId|pain\.\d{3}\.\d{3}\.\d{2}|pacs\.\d{3}\.\d{3}\.\d{2}|camt\.\d{3}\.\d{3}\.\d{2}|MT\d{3})\b/g;

function highlight(text: string | null): React.ReactNode[] {
  if (!text) return [];
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > cursor) nodes.push(text.slice(cursor, m.index));
    nodes.push(
      <code key={m.index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">
        {m[0]}
      </code>,
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function inlineMd(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) parts.push(...highlight(text.slice(cursor, m.index)));
    parts.push(<strong key={m.index} className="font-semibold text-foreground">{highlight(m[1])}</strong>);
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(...highlight(text.slice(cursor)));
  return parts;
}

function Markdown({ text }: { text: string | null }) {
  if (!text?.trim()) return null;
  const lines = text.split('\n').map((l) => l.trim());
  const bullets = lines.filter((l) => /^[-•]\s+/.test(l));
  if (bullets.length >= 2 && bullets.length / lines.filter(Boolean).length > 0.5) {
    const items = lines.filter((l) => /^[-•]\s+/.test(l)).map((l) => l.replace(/^[-•]\s+/, ''));
    return (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/60">
        {items.map((it, i) => (
          <li key={i} className="text-base leading-relaxed text-foreground/90">{inlineMd(it)}</li>
        ))}
      </ul>
    );
  }
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className="whitespace-pre-line text-base leading-relaxed text-foreground/85">{inlineMd(p)}</p>
      ))}
    </>
  );
}

// ─── Version-spezifische Feature-Erkennung aus den Notes ──────────────────────

type Feature = { name: string; what: string; tokens: string[] };

function parseFeatures(notes: string | null): Feature[] {
  if (!notes) return [];
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

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className="rounded-xl border border-emerald-300/40 bg-emerald-50/30 p-5 dark:border-emerald-700/30 dark:bg-emerald-950/15">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Neu in v.09</div>
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

// ─── Versions-Timeline ────────────────────────────────────────────────────────

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
                  pain.001.{ver}
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

// ─── Generic Section + SAP-Panel (wie Regulatorik-Detail) ─────────────────────

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

const SAP_CHIP_RE = /\b(?:FI-[A-Z]{2,3}|TRM-[A-Z]{2,3}|BC-[A-Z]{2,3}|FSCM-[A-Z]{2,4}|BCM|DRC|DMEE|DMEEX|EBICS|H2H|SWIFT|MBC|FBZP|OB\d{2,3}|OT\d{2,3}|F110|MIRO|XK\d{2}|XD\d{2}|LFA\d|T001|BSEG|REGUH)\b/g;

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

// ─── ISO 20022 pain.001.001.09 Struktur ──────────────────────────────────────

type Card = '1' | '0..1' | '1..N' | '0..N';
type Node = {
  name: string;
  card: Card;
  type?: string;
  desc: string;
  v9New?: boolean;
  children?: Node[];
};

const CARD_STYLE: Record<Card, string> = {
  '1':    'bg-rose-100 text-rose-900 ring-rose-300 dark:bg-rose-950/40 dark:text-rose-200',
  '0..1': 'bg-muted text-muted-foreground ring-border',
  '1..N': 'bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200',
  '0..N': 'bg-sky-100 text-sky-900 ring-sky-300 dark:bg-sky-950/40 dark:text-sky-200',
};

const PAIN_001_09_STRUCTURE: Node[] = [
  {
    name: 'GrpHdr',
    card: '1',
    type: 'GroupHeader',
    desc: 'Header der Nachricht — gilt für ALLE Zahlungen im File.',
    children: [
      { name: 'MsgId', card: '1', type: 'Max35Text', desc: 'Eindeutige Message-ID des Senders. Konvention: <BUKRS>-<JJJJMMTT>-<lfd>.' },
      { name: 'CreDtTm', card: '1', type: 'ISODateTime', desc: 'Erstellungs-Zeitstempel. SAP: aus DMEEX zum Lauf-Zeitpunkt.' },
      { name: 'NbOfTxs', card: '1', type: 'Max15NumericText', desc: 'Anzahl Einzeltransaktionen im File (Summe aller CdtTrfTxInf).' },
      { name: 'CtrlSum', card: '0..1', type: 'DecimalNumber', desc: 'Kontrollsumme aller InstdAmt-Beträge. Optional, aber stark empfohlen.' },
      {
        name: 'InitgPty',
        card: '1',
        type: 'PartyIdentification135',
        desc: 'Auftraggebende Partei (i.d.R. Konzern-Treasury / Hausbankzugang).',
        children: [
          { name: 'Nm', card: '0..1', type: 'Max140Text', desc: 'Name der Initiating Party.' },
          { name: 'PstlAdr', card: '0..1', type: 'PostalAddress24', desc: 'Strukturierte Adresse — alle Subfelder einzeln.', v9New: true },
          { name: 'Id', card: '0..1', type: 'Party38Choice', desc: 'OrgId (LEI/BIC/Other) oder PrvtId.', v9New: true },
        ],
      },
      { name: 'FwdgAgt', card: '0..1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'Forwarding Agent — wenn Zwischen-PSP eingeschaltet.' },
      { name: 'InitnSrc', card: '0..1', type: 'PaymentInitiationSource1', desc: 'Quelle (Software-Name + Version) — neu in v.09.', v9New: true },
    ],
  },
  {
    name: 'PmtInf',
    card: '1..N',
    type: 'PaymentInstruction34',
    desc: 'Zahlungsblock — gruppiert Transaktionen mit gleichem Auftraggeberkonto, Ausführungsdatum und Service-Level.',
    children: [
      { name: 'PmtInfId', card: '1', type: 'Max35Text', desc: 'ID des Zahlungsblocks (Batch-Id).' },
      { name: 'PmtMtd', card: '1', type: 'PaymentMethod3Code', desc: 'TRF (Transfer), DD (Direct Debit), CHK (Cheque). Für SEPA SCT immer TRF.' },
      { name: 'BtchBookg', card: '0..1', type: 'BatchBookingIndicator', desc: 'true = Sammelbuchung, false = Einzelbuchungen auf Konto.' },
      { name: 'NbOfTxs', card: '0..1', type: 'Max15NumericText', desc: 'Anzahl Transaktionen in diesem Block.' },
      { name: 'CtrlSum', card: '0..1', type: 'DecimalNumber', desc: 'Kontrollsumme dieses Blocks.' },
      {
        name: 'PmtTpInf',
        card: '0..1',
        type: 'PaymentTypeInformation26',
        desc: 'Service-Level / Local Instrument / Category Purpose.',
        children: [
          { name: 'InstrPrty', card: '0..1', type: 'Priority2Code', desc: 'NORM oder HIGH.' },
          { name: 'SvcLvl', card: '0..N', type: 'ServiceLevel8Choice', desc: 'SEPA, INST (Instant), URGP, SDVA.' },
          { name: 'LclInstrm', card: '0..1', type: 'LocalInstrument2Choice', desc: 'B2B vs CORE bei SDD; CN-spezifische Codes.' },
          { name: 'CtgyPurp', card: '0..1', type: 'CategoryPurpose1Choice', desc: 'CASH, CORT, GOVT, SUPP, TAXS — beeinflusst Settlement.' },
        ],
      },
      { name: 'ReqdExctnDt', card: '1', type: 'DateAndDateTime2Choice', desc: 'Gewünschtes Ausführungsdatum — komplexes Element mit <Dt> oder <DtTm>.', v9New: true },
      { name: 'PoolgAdjstmntDt', card: '0..1', type: 'ISODate', desc: 'Adjustierungsdatum bei Pooled-Konten.' },
      {
        name: 'Dbtr',
        card: '1',
        type: 'PartyIdentification135',
        desc: 'Schuldner = Kontoinhaber. SAP: aus T001 (Buchungskreis-Stammdaten).',
        children: [
          { name: 'Nm', card: '0..1', type: 'Max140Text', desc: 'Name laut Kontoinhaber-Stammdaten.' },
          { name: 'PstlAdr', card: '0..1', type: 'PostalAddress24', desc: 'Strukturierte Adresse — Pflicht ab EPC SCT 2025!', v9New: true },
          { name: 'Id', card: '0..1', type: 'Party38Choice', desc: 'OrgId mit LEI / BIC / Other (Tax-ID, USCI bei CN).', v9New: true },
          { name: 'CtryOfRes', card: '0..1', type: 'CountryCode', desc: 'ISO-Ländercode der Ansässigkeit.' },
        ],
      },
      {
        name: 'DbtrAcct',
        card: '1',
        type: 'CashAccount38',
        desc: 'Schuldner-Konto.',
        children: [
          { name: 'Id', card: '1', type: 'AccountIdentification4Choice', desc: '<IBAN> oder <Othr><Id> für Non-IBAN-Länder (CN, US, JP).' },
          { name: 'Tp', card: '0..1', type: 'CashAccountType2Choice', desc: 'CACC, SVGS, etc.' },
          { name: 'Ccy', card: '0..1', type: 'ActiveOrHistoricCurrencyCode', desc: 'Konto-Währung.' },
        ],
      },
      {
        name: 'DbtrAgt',
        card: '1',
        type: 'BranchAndFinancialInstitutionIdentification6',
        desc: 'Schuldner-Bank.',
        children: [
          { name: 'FinInstnId', card: '1', type: 'FinancialInstitutionIdentification18', desc: 'BICFI (ersetzt BIC) + ggf. ClrSysMmbId.', v9New: true },
        ],
      },
      { name: 'ChrgBr', card: '0..1', type: 'ChargeBearerType1Code', desc: 'SLEV (für SEPA), SHAR, CRED, DEBT.' },
      { name: 'UltmtDbtr', card: '0..1', type: 'PartyIdentification135', desc: 'Original-Auftraggeber bei POBO — neu strukturiert in v.09.', v9New: true },
      {
        name: 'CdtTrfTxInf',
        card: '1..N',
        type: 'CreditTransferTransaction40',
        desc: 'Einzelne Zahlung — eine pro Transaktion.',
        children: [
          {
            name: 'PmtId',
            card: '1',
            type: 'PaymentIdentification6',
            desc: 'IDs der Einzelzahlung.',
            children: [
              { name: 'InstrId', card: '0..1', type: 'Max35Text', desc: 'Instruction-ID — interne Referenz zwischen Sender und Bank.' },
              { name: 'EndToEndId', card: '1', type: 'Max35Text', desc: 'Pflicht — Ende-zu-Ende-Referenz, durchgereicht bis Empfänger.' },
              { name: 'UETR', card: '0..1', type: 'UUID', desc: 'Unique End-to-end Transaction Reference (gpi-Tracking).', v9New: true },
            ],
          },
          {
            name: 'Amt',
            card: '1',
            type: 'AmountType4Choice',
            desc: 'Betrag mit Währung.',
            children: [
              { name: 'InstdAmt', card: '0..1', type: 'ActiveOrHistoricCurrencyAndAmount', desc: 'Vom Auftraggeber instruierter Betrag (Standardfall).' },
              { name: 'EqvtAmt', card: '0..1', type: 'EquivalentAmount2', desc: 'Bei Cross-Currency: Gegenwert in anderer Währung.' },
            ],
          },
          { name: 'ChrgBr', card: '0..1', type: 'ChargeBearerType1Code', desc: 'Kann pro Transaktion vom PmtInf-Default abweichen.' },
          {
            name: 'CdtrAgt',
            card: '0..1',
            type: 'BranchAndFinancialInstitutionIdentification6',
            desc: 'Empfänger-Bank.',
            children: [
              { name: 'FinInstnId', card: '1', type: 'FinancialInstitutionIdentification18', desc: 'BICFI des Empfänger-PSPs.', v9New: true },
            ],
          },
          {
            name: 'Cdtr',
            card: '1',
            type: 'PartyIdentification135',
            desc: 'Empfänger.',
            children: [
              { name: 'Nm', card: '0..1', type: 'Max140Text', desc: 'Name des Empfängers — bei PSD3-CoP entscheidend!' },
              { name: 'PstlAdr', card: '0..1', type: 'PostalAddress24', desc: 'Strukturierte Adresse.', v9New: true },
              { name: 'Id', card: '0..1', type: 'Party38Choice', desc: 'OrgId (LEI/USCI/Tax-ID) oder PrvtId.', v9New: true },
            ],
          },
          {
            name: 'CdtrAcct',
            card: '1',
            type: 'CashAccount38',
            desc: 'Empfänger-Konto (IBAN für SEPA, Othr für Non-IBAN).',
          },
          { name: 'UltmtCdtr', card: '0..1', type: 'PartyIdentification135', desc: 'Tatsächlicher End-Empfänger bei COBO.' },
          { name: 'Purp', card: '0..1', type: 'Purpose2Choice', desc: 'External Purpose Code (z.B. SUPP, SALA, INTC).' },
          { name: 'RgltryRptg', card: '0..N', type: 'RegulatoryReporting3', desc: 'AWV-Z4 / SAFE-Codes für Cross-Border-Reporting.' },
          {
            name: 'RmtInf',
            card: '0..1',
            type: 'RemittanceInformation16',
            desc: 'Verwendungszweck.',
            children: [
              { name: 'Ustrd', card: '0..N', type: 'Max140Text', desc: 'Freitext-Verwendungszweck (mehrfach möglich).' },
              { name: 'Strd', card: '0..N', type: 'StructuredRemittanceInformation16', desc: 'Strukturierter Verwendungszweck — Pflicht für SEPA SDD-Mandate, Rechnungsreferenz.' },
            ],
          },
        ],
      },
    ],
  },
];

function FieldNode({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = React.useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div className={cn('border-l border-border/60 pl-4', depth === 0 && 'border-l-0 pl-0')}>
      <div className="flex items-start gap-2 py-1.5">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={open ? 'Zuklappen' : 'Aufklappen'}
          >
            <svg viewBox="0 0 16 16" className={cn('size-3 transition-transform', open && 'rotate-90')} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 4l5 4-5 4" />
            </svg>
          </button>
        ) : (
          <span className="mt-0.5 inline-block size-4 shrink-0" />
        )}
        <code className={cn('rounded px-1.5 py-0.5 font-mono text-sm font-semibold', node.v9New ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800/40' : 'bg-muted text-foreground')}>
          {node.name}
        </code>
        <span className={cn('inline-flex shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1', CARD_STYLE[node.card])}>
          {node.card}
        </span>
        {node.type && (
          <span className="hidden shrink-0 rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            {node.type}
          </span>
        )}
        {node.v9New && (
          <span className="inline-flex shrink-0 rounded bg-emerald-600/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            v.09
          </span>
        )}
        <p className="min-w-0 flex-1 text-sm text-foreground/80">{node.desc}</p>
      </div>
      {hasChildren && open && (
        <div className="ml-2">
          {node.children!.map((c) => (
            <FieldNode key={c.name} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Migration v.03 → v.09 ────────────────────────────────────────────────────

type Change = { field: string; v03: string; v09: string; type: 'new' | 'changed' | 'removed' };
const MIGRATION_03_TO_09: Change[] = [
  { field: 'Adressfelder (Dbtr/Cdtr/InitgPty)', v03: 'PostalAddress6 (Freitext AdrLine)', v09: 'PostalAddress24 (strukturiert: StrtNm, BldgNb, PstCd, TwnNm, Ctry)', type: 'changed' },
  { field: 'BIC-Element', v03: 'BIC oder BICOrBEI', v09: 'BICFI', type: 'changed' },
  { field: 'OrgId', v03: 'BICOrBEI / Other', v09: 'AnyBIC, LEI, Other', type: 'changed' },
  { field: 'PmtId/UETR', v03: '— nicht vorhanden', v09: 'UETR (UUID) für gpi-Tracking', type: 'new' },
  { field: 'ReqdExctnDt', v03: 'ISODate (nur Datum)', v09: 'DateAndDateTime2Choice (Datum ODER Datum+Zeit)', type: 'changed' },
  { field: 'GrpHdr/InitnSrc', v03: '— nicht vorhanden', v09: 'PaymentInitiationSource1 (Software-Name + Version)', type: 'new' },
  { field: 'UltmtDbtr / UltmtCdtr', v03: 'PartyIdentification32 (eingeschränkt)', v09: 'PartyIdentification135 (vollwertig, POBO/COBO-tauglich)', type: 'changed' },
  { field: 'CdtTrfTxInf/Tax', v03: 'TaxInformation3', v09: 'TaxInformation8 (mit DueAmt-Struktur, MwSt-Aufschlüsselung)', type: 'changed' },
  { field: 'RmtInf/Strd/AddtlRmtInf', v03: 'Max140Text', v09: 'Max140Text · 0..3 (vorher 0..1) — bis zu 3 Zusatztexte', type: 'changed' },
  { field: 'CtrlSum-Pflicht im PmtInf', v03: 'optional', v09: 'optional, aber EPC-Business-Rule erzwingt sie für SEPA SCT', type: 'changed' },
];

function MigrationDiff() {
  const counts = {
    new: MIGRATION_03_TO_09.filter((c) => c.type === 'new').length,
    changed: MIGRATION_03_TO_09.filter((c) => c.type === 'changed').length,
    removed: MIGRATION_03_TO_09.filter((c) => c.type === 'removed').length,
  };
  const TYPE_STYLE: Record<Change['type'], string> = {
    new: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
    changed: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
    removed: 'bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200',
  };
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <h3 className="text-base font-semibold text-foreground">Migration pain.001.001.03 → .09</h3>
        <span className="text-xs text-muted-foreground">
          {counts.new} neu · {counts.changed} geändert · {counts.removed} entfernt
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-medium">Feld</th>
              <th className="py-2 pr-3 font-medium">v.03</th>
              <th className="py-2 pr-3 font-medium">v.09</th>
              <th className="py-2 font-medium">Typ</th>
            </tr>
          </thead>
          <tbody>
            {MIGRATION_03_TO_09.map((c, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-2 pr-3 font-mono text-xs font-semibold text-foreground">{c.field}</td>
                <td className="py-2 pr-3 text-foreground/70">{c.v03}</td>
                <td className="py-2 pr-3 text-foreground/90">{c.v09}</td>
                <td className="py-2">
                  <span className={cn('inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', TYPE_STYLE[c.type])}>
                    {c.type === 'new' ? 'neu' : c.type === 'changed' ? 'geändert' : 'entfernt'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Charakter-Set EPC Latin ──────────────────────────────────────────────────

function CharacterSetPanel() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-base font-semibold text-foreground">Charakter-Set & Encoding</h3>
      <div className="space-y-3 text-base text-foreground/85">
        <p>
          <strong>SEPA Latin Character Set</strong> (EPC EBS204) — der erlaubte Zeichensatz für alle SEPA-Nachrichten,
          ungeachtet der ISO-20022-Spezifikation, die UTF-8 zulässt. Sender-Banken weisen Dateien mit Sonder-/Akzentzeichen ab.
        </p>
        <div className="rounded-md border border-border/60 bg-background p-3 font-mono text-sm text-foreground/90">
          a b c d e f g h i j k l m n o p q r s t u v w x y z<br />
          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br />
          0 1 2 3 4 5 6 7 8 9<br />
          / − ? : ( ) . , ' + Leerzeichen
        </div>
        <p className="text-sm text-muted-foreground">
          Alles andere (deutsche Umlaute ä/ö/ü/ß, Akzente, kyrillische/chinesische Zeichen, Tab) muss vor Ausgang transliteriert werden:
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">ä</code>→<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">ae</code>,
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">é</code>→<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">e</code>,
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">ß</code>→<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">ss</code>.
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-rose-300/50 bg-rose-50/30 p-3 dark:border-rose-700/30 dark:bg-rose-950/15">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-900 dark:text-rose-200">
            Häufige Fail-Trigger
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/85">
            <li>Müller GmbH → Mueller GmbH (sonst Reject AC03/AC04)</li>
            <li>Übersee Logistik → Uebersee Logistik</li>
            <li>Café & Bar → Cafe und Bar (kaufmännisches &amp; nicht erlaubt)</li>
            <li>Tabulator/CR/LF in RmtInf — Bank entfernt oder rejected</li>
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-300/50 bg-emerald-50/30 p-3 dark:border-emerald-700/30 dark:bg-emerald-950/15">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
            Empfehlung
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/85">
            <li>SAP DMEEX-Mapping mit Funktionsbaustein <code className="rounded bg-muted px-1 font-mono text-[0.85em]">SCP_REPLACE_NON_LATIN</code></li>
            <li>Eingangskontrolle der Lieferanten-Stammdaten (BAdI <code className="rounded bg-muted px-1 font-mono text-[0.85em]">VENDOR_ADD_DATA_CS</code>)</li>
            <li>Cross-Border (Non-EU): UTF-8 erlaubt, aber CN/JP/KR-Banken oft trotzdem ASCII-strikt</li>
          </ul>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Quelle: EPC EBS204{' '}
        <a href="https://www.europeanpaymentscouncil.eu/document-library" target="_blank" rel="noreferrer" className="text-primary hover:underline">
          European Payments Council Document Library
        </a>
      </div>
    </section>
  );
}

// ─── pain.002 Status Report Codes ─────────────────────────────────────────────

type Reject = { code: string; name: string; meaning: string; remediation: string };
const REJECT_CODES: Reject[] = [
  { code: 'AC01', name: 'IncorrectAccountNumber', meaning: 'IBAN syntaktisch oder per Prüfziffer falsch.', remediation: 'IBAN-Validierung mit ISO 7064 vor Versand. SAP: BAdI BANK_VALIDATION.' },
  { code: 'AC04', name: 'ClosedAccountNumber', meaning: 'Konto existiert nicht (mehr) bei Empfänger-Bank.', remediation: 'Lieferantenstamm aktualisieren, Kontaktaufnahme mit Empfänger.' },
  { code: 'AC06', name: 'BlockedAccount', meaning: 'Konto gesperrt (Insolvenz, Pfändung, Verdacht).', remediation: 'Mit Empfänger / Bank klären. Bei Mahnverfahren neue Kontoangabe erfragen.' },
  { code: 'AG01', name: 'TransactionForbidden', meaning: 'Service-Level vom Empfänger-PSP nicht unterstützt (z.B. SCT Inst nicht angeboten).', remediation: 'Auf SCT (Standard) ausweichen oder SvcLvl prüfen.' },
  { code: 'AG02', name: 'InvalidBankOperationCode', meaning: 'Local Instrument ungültig (z.B. SDD B2B an CORE-only-Konto).', remediation: 'PmtTpInf/LclInstrm prüfen.' },
  { code: 'AM05', name: 'Duplication', meaning: 'Identische Zahlung schon mal gesendet (gleiche EndToEndId).', remediation: 'EndToEndId muss eindeutig sein. SAP: Sicherstellen, dass F110 keine Reposts erzeugt.' },
  { code: 'BE05', name: 'UnrecognisedInitiatingParty', meaning: 'InitgPty bei der Bank nicht freigeschaltet (Berechtigung).', remediation: 'EBICS-User / SCA-Berechtigung mit Hausbank klären.' },
  { code: 'CUST', name: 'CancelledByCustomer', meaning: 'Auftraggeber hat zurückgezogen (rückrufbar bei SCT INSO bis Settlement).', remediation: 'Kein Fehler — bewusst storniert.' },
  { code: 'DT01', name: 'InvalidDate', meaning: 'ReqdExctnDt liegt in der Vergangenheit oder am Bank-Feiertag.', remediation: 'Fabrikkalender SAP SCAL synchron mit TARGET2.' },
  { code: 'FF01', name: 'InvalidFileFormat', meaning: 'XML-Schema-Verletzung (oft Pflichtfeld leer, Cardinality verletzt).', remediation: 'Schema-Validierung in DMEEX vor Ausgang.' },
  { code: 'MS03', name: 'NotSpecifiedReason', meaning: 'Generisch — Bank gibt Detail nur auf Nachfrage / im Audit-Log.', remediation: 'Hausbank kontaktieren, ggf. Schematron-Validation.' },
  { code: 'NARR', name: 'Narrative', meaning: 'Kein Standard-Code — Erläuterung im Freitext-Feld.', remediation: 'pain.002 / camt.029 manuell auswerten.' },
  { code: 'RC01', name: 'BankIdentifierIncorrect', meaning: 'BICFI ungültig oder nicht im SWIFT-Verzeichnis.', remediation: 'BIC-Stamm-Update; bei CN: CIPS-MmbId statt BIC.' },
  { code: 'RR04', name: 'RegulatoryReason', meaning: 'Sanktions-/Embargo-Treffer (OFAC, EU-Sanktionen, SAFE-Block).', remediation: 'GTS-Screening prüfen, Sanktions-Hit lösen, ggf. Lizenz.' },
];

const REJECT_GROUPS: { prefix: string; label: string; cls: string }[] = [
  { prefix: 'AC', label: 'Account', cls: 'bg-rose-100 text-rose-900' },
  { prefix: 'AG', label: 'Agent', cls: 'bg-amber-100 text-amber-900' },
  { prefix: 'AM', label: 'Amount/Match', cls: 'bg-violet-100 text-violet-900' },
  { prefix: 'BE', label: 'Beneficiary', cls: 'bg-fuchsia-100 text-fuchsia-900' },
  { prefix: 'DT', label: 'Date', cls: 'bg-sky-100 text-sky-900' },
  { prefix: 'FF', label: 'File Format', cls: 'bg-yellow-100 text-yellow-900' },
  { prefix: 'MS', label: 'Misc', cls: 'bg-muted text-muted-foreground' },
  { prefix: 'NARR', label: 'Narrative', cls: 'bg-muted text-muted-foreground' },
  { prefix: 'RC', label: 'Routing', cls: 'bg-blue-100 text-blue-900' },
  { prefix: 'RR', label: 'Regulatory', cls: 'bg-emerald-100 text-emerald-900' },
  { prefix: 'CUST', label: 'Customer', cls: 'bg-muted text-muted-foreground' },
];

function groupOf(code: string): { label: string; cls: string } {
  const g = REJECT_GROUPS.find((g) => code.startsWith(g.prefix));
  return g ?? { label: 'Other', cls: 'bg-muted text-muted-foreground' };
}

function RejectCodesPanel() {
  const [filter, setFilter] = React.useState<string>('ALL');
  const groups = Array.from(new Set(REJECT_CODES.map((r) => groupOf(r.code).label)));
  const filtered = filter === 'ALL' ? REJECT_CODES : REJECT_CODES.filter((r) => groupOf(r.code).label === filter);
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <h3 className="text-base font-semibold text-foreground">pain.002 — Häufige Rückgabe-Codes</h3>
        <span className="text-xs text-muted-foreground">{filtered.length} von {REJECT_CODES.length} Codes</span>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter('ALL')}
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
            filter === 'ALL' ? 'bg-foreground text-background ring-foreground' : 'bg-background text-muted-foreground ring-border hover:text-foreground',
          )}
        >
          Alle
        </button>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
              filter === g ? 'bg-foreground text-background ring-foreground' : 'bg-background text-muted-foreground ring-border hover:text-foreground',
            )}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((r) => {
          const g = groupOf(r.code);
          return (
            <div key={r.code} className="rounded-lg border border-border/60 bg-background p-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-bold text-foreground">{r.code}</code>
                <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider', g.cls)}>{g.label}</span>
                <span className="text-sm font-medium text-foreground">{r.name}</span>
              </div>
              <p className="mt-1.5 text-sm text-foreground/85">{r.meaning}</p>
              <div className="mt-1.5 rounded-md border-l-2 border-emerald-400/50 bg-emerald-50/30 px-3 py-1.5 text-sm text-foreground/85 dark:border-emerald-700/40 dark:bg-emerald-950/15">
                <span className="font-semibold text-emerald-900 dark:text-emerald-200">Was tun: </span>
                {r.remediation}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Quelle: ISO 20022 External Code Sets (Reason Codes){' '}
        <a href="https://www.iso20022.org/external-code-sets" target="_blank" rel="noreferrer" className="text-primary hover:underline">
          iso20022.org/external-code-sets
        </a>
      </div>
    </section>
  );
}

function Iso20022StructureView() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="text-base font-semibold text-foreground">Nachrichtenstruktur (ISO 20022)</h3>
        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          urn:iso:std:iso:20022:tech:xsd:pain.001.001.09
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-rose-500" /> 1 = Pflicht</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-amber-500" /> 1..N = Pflicht, mehrfach</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-muted-foreground/60" /> 0..1 = Optional</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-sky-500" /> 0..N = Optional, mehrfach</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-emerald-500" /> Neu in v.09</span>
      </div>
      <div className="space-y-2">
        {PAIN_001_09_STRUCTURE.map((n) => (
          <div key={n.name} className="rounded-lg border border-border/60 bg-background p-3">
            <FieldNode node={n} depth={0} />
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Quelle: ISO 20022 — pain.001.001.09 Customer Credit Transfer Initiation V09 Schema.{' '}
        <a href="https://www.iso20022.org/iso-20022-message-definitions" target="_blank" rel="noreferrer" className="text-primary hover:underline">
          iso20022.org/iso-20022-message-definitions
        </a>
      </div>
    </section>
  );
}

// ─── Beispiel-Datei ───────────────────────────────────────────────────────────

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

// ─── Main ────────────────────────────────────────────────────────────────────

export function Pain001V09Panel({ base, version, allVersions }: Props) {
  const [tab, setTab] = React.useState<'neu' | 'aufbau' | 'fehler'>('neu');
  const features = parseFeatures(version.notes as string | null);

  return (
    <div className="space-y-5">
      {/* Header-Banner */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="rounded-md bg-primary px-2 py-1 font-mono text-sm font-bold text-primary-foreground">
            pain.001.001.09
          </span>
          <span className="text-base text-foreground/80">
            Customer Credit Transfer Initiation — EPC SEPA SCT 2023
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span><strong className="text-foreground">Released:</strong> {String(version.released ?? '—')}</span>
          <span><strong className="text-foreground">Aktuell:</strong> {version.is_current ? 'ja' : 'nein (höhere Versionen verfügbar)'}</span>
          <span><strong className="text-foreground">Quelle:</strong> {String(version.source_standard ?? 'ISO 20022')}</span>
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
          { id: 'neu',    label: 'Was ist neu in v.09?' },
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

      {tab === 'neu' && (
        <div className="space-y-4">
          {features.length > 0 && (
            <div className="grid items-stretch gap-3 md:grid-cols-2">
              {features.map((f) => <FeatureCard key={f.name} feature={f} />)}
            </div>
          )}
          <MigrationDiff />
          {version.notes && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-base font-semibold text-foreground">Vollständige Versions-Notes</h3>
              <Markdown text={String(version.notes)} />
            </section>
          )}
          <VersionTimeline versions={allVersions} currentVersion={String(version.version)} />
        </div>
      )}

      {tab === 'aufbau' && (
        <div className="space-y-4">
          <Iso20022StructureView />
          <CharacterSetPanel />
          {base.wichtige_felder && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-base font-semibold text-foreground">Hinweise des Hauses</h3>
              <Markdown text={base.wichtige_felder} />
            </section>
          )}
        </div>
      )}

      {tab === 'fehler' && (
        <div className="space-y-4">
          <RejectCodesPanel />
          <ContentSection title="Fehlerquellen" einsteiger={base.fehlerquellen_einsteiger} experte={base.fehlerquellen_experte} />
          <ContentSection title="Projektfehler" einsteiger={base.projektfehler_einsteiger} experte={base.projektfehler_experte} />
        </div>
      )}
    </div>
  );
}
