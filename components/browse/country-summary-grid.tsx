import * as React from 'react';

type CountryLike = {
  currency?: string;
  central_bank?: string;
  iso20022_status?: string;
  instant_payments?: string;
  intercompany_netting?: string;
  cash_pooling_external?: string;
  pobo?: string;
  pino_routing?: string;
  special_format_requirements?: string;
  special_regulatory_requirements?: string;
};

const FIELDS: { key: keyof CountryLike; label: string }[] = [
  { key: 'currency', label: 'Währung' },
  { key: 'central_bank', label: 'Zentralbank' },
  { key: 'iso20022_status', label: 'ISO 20022 umgesetzt?' },
  { key: 'instant_payments', label: 'Instant Payments möglich?' },
  { key: 'intercompany_netting', label: 'Intercompany Netting möglich?' },
  { key: 'cash_pooling_external', label: 'Externes Cash Pooling' },
  { key: 'pobo', label: 'POBO' },
  { key: 'pino_routing', label: 'PINO / PINO Routing' },
  { key: 'special_format_requirements', label: 'Spezielle Formatanforderungen (ISO 20022)' },
  { key: 'special_regulatory_requirements', label: 'Spezielle regulatorische Anforderungen' },
];

export function CountrySummaryGrid({ country }: { country: CountryLike }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
      {FIELDS.map(({ key, label }) => {
        const value = (country[key] ?? '').toString().trim();
        return (
          <div key={String(key)} className="flex flex-col border-b border-primary/10 pb-2">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 text-base leading-relaxed text-foreground/90">
              {value || <span className="text-muted-foreground/60">—</span>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
