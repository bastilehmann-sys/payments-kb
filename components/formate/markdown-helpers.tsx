'use client';
import * as React from 'react';

// ─── Token-Highlight ──────────────────────────────────────────────────────────

const TOKEN_RE = /\b(?:LFA1|LFB1|T001|BSEG|BKPF|REGUH|FBZP|OBY\d|OB\d{2,3}|F110|FB\d{2}|MIRO|FI-BL|TRM-TM|BC-SEC|BCM|FSCM|DRC|DMEE|DMEEX|EBICS|H2H|SWIFT|SCA|IBAN|BIC|BICFI|LEI|UETR|UltimateOriginator|PostalAddress24|StrtNm|BldgNb|BldgNm|Flr|PstBx|Room|PstCd|TwnNm|TwnLctnNm|DstrctNm|CtrySubDvsn|Ctry|InitgPty|Dbtr|Cdtr|GrpHdr|PmtInf|CdtTrfTxInf|EndToEndId|InstrId|ReqdExctnDt|OrgId|pain\.\d{3}\.\d{3}\.\d{2}|pacs\.\d{3}\.\d{3}\.\d{2}|camt\.\d{3}\.\d{3}\.\d{2}|MT\d{3})\b/g;

export function highlight(text: string | null): React.ReactNode[] {
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

export function inlineMd(text: string): React.ReactNode[] {
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

export function Markdown({ text }: { text: string | null }) {
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
