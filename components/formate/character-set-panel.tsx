'use client';
import { cn } from '@/lib/utils';
import type { CharacterSetVariant } from '@/lib/formats/types';
import { SEPA_LATIN_CHARSET } from '@/lib/formats/iso-base';

const VARIANTS: Record<CharacterSetVariant, { title: string; allowed: string; examples: { wrong: string; right: string }[]; sourceLabel: string; sourceUrl: string; intro: string }> = {
  'sepa-latin': {
    title: 'SEPA Latin Character Set (EPC EBS204)',
    allowed: SEPA_LATIN_CHARSET.allowed,
    examples: SEPA_LATIN_CHARSET.examples,
    sourceLabel: SEPA_LATIN_CHARSET.source.label,
    sourceUrl:   SEPA_LATIN_CHARSET.source.url,
    intro: 'Erlaubter Zeichensatz für alle SEPA-Nachrichten — strenger als ISO-20022-UTF-8.',
  },
  'swift-x':    { title: 'SWIFT Character Set X (FIN)', allowed: 'a-z A-Z 0-9 / - ? : ( ) . , \' + Leerzeichen', examples: [{ wrong: 'Müller', right: 'Mueller' }, { wrong: 'Café', right: 'Cafe' }], sourceLabel: 'SWIFT Standards Release Guide', sourceUrl: 'https://www.swift.com/standards', intro: 'Eingeschränkter Zeichensatz für FIN MT-Nachrichten — keine Akzente, keine Umlaute.' },
  'cn-gb18030': { title: 'GB18030 (China) + UTF-8',     allowed: 'Latin + Chinesische Zeichen (vereinfacht)', examples: [], sourceLabel: 'PBoC CNAPS Spec', sourceUrl: 'http://www.pbc.gov.cn/', intro: 'Chinesische Zeichen erlaubt; ISO-20022/CIPS bevorzugt UTF-8, CNAPS oft GB18030.' },
  'us-ascii':   { title: 'US-ASCII (NACHA / Fedwire)',  allowed: 'a-z A-Z 0-9 + Sonderzeichen . , - / ( ) Leerzeichen', examples: [{ wrong: 'Mr. André', right: 'Mr. Andre' }], sourceLabel: 'NACHA Operating Rules', sourceUrl: 'https://www.nacha.org/rules', intro: 'NACHA und Fedwire FAIM verlangen pure ASCII — keine Sonderzeichen, kein UTF-8.' },
  'jp-shift-jis':{ title: 'Shift-JIS / UTF-8 (Zengin)', allowed: 'Latin + Hiragana + Katakana + Kanji', examples: [], sourceLabel: 'Zenginkyo Standard', sourceUrl: 'https://www.zenginkyo.or.jp/en/', intro: 'Zengin-Net erlaubt Shift-JIS oder UTF-8; Kanji in Verwendungszweck üblich.' },
  'utf-8':      { title: 'UTF-8 (uneingeschränkt)',     allowed: 'Voller Unicode-Zeichensatz', examples: [], sourceLabel: 'ISO 20022 General', sourceUrl: 'https://www.iso20022.org/', intro: 'Vollständiger Unicode — gilt für ISO 20022 Cross-Border (CBPR+, gpi).' },
};

export function CharacterSetPanel({ variant }: { variant: CharacterSetVariant }) {
  const v = VARIANTS[variant];
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 text-base font-semibold text-foreground">{v.title}</h3>
      <p className="mb-3 text-base text-foreground/85">{v.intro}</p>
      <div className="rounded-md border border-border/60 bg-background p-3 font-mono text-sm text-foreground/90">{v.allowed}</div>
      {v.examples.length > 0 && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-rose-300/50 bg-rose-50/30 p-3 dark:border-rose-700/30 dark:bg-rose-950/15">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-rose-900 dark:text-rose-200">Vermeiden</div>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {v.examples.map((e, i) => <li key={i}><code className="rounded bg-muted px-1 font-mono text-[0.85em]">{e.wrong}</code></li>)}
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-300/50 bg-emerald-50/30 p-3 dark:border-emerald-700/30 dark:bg-emerald-950/15">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">Stattdessen</div>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {v.examples.map((e, i) => <li key={i}><code className="rounded bg-muted px-1 font-mono text-[0.85em]">{e.right}</code></li>)}
            </ul>
          </div>
        </div>
      )}
      <div className="mt-3 text-xs text-muted-foreground">
        Quelle: <a href={v.sourceUrl} target="_blank" rel="noreferrer" className={cn('text-primary hover:underline')}>{v.sourceLabel}</a>
      </div>
    </section>
  );
}
