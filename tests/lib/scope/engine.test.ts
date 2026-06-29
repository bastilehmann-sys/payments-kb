import { describe, it, expect } from 'vitest';
import { runEngine } from '@/lib/scope/engine';
import type { ScopeParams, KbData } from '@/lib/scope/engine';

const MINIMAL_KB: KbData = {
  regulatorik: [
    { id: '1', name: 'SEPA-Verordnung', kuerzel: 'SEPA', kategorie: null, geltungsbereich: 'EU / SEPA-Raum', beschreibung_einsteiger: null, aufwand_tshirt: null },
    { id: '2', name: 'Dodd-Frank', kuerzel: null, kategorie: null, geltungsbereich: 'USA', beschreibung_einsteiger: null, aufwand_tshirt: null },
    { id: '3', name: 'AML Global', kuerzel: null, kategorie: null, geltungsbereich: 'Global', beschreibung_einsteiger: null, aufwand_tshirt: null },
  ],
  formate: [
    { id: '1', format_name: 'pain.001', region: 'SEPA', nachrichtentyp: 'Credit Transfer', familie_standard: 'ISO 20022', beschreibung_einsteiger: null },
    { id: '2', format_name: 'MT103', region: 'SWIFT/Global', nachrichtentyp: 'Single Credit Transfer', familie_standard: 'SWIFT MT', beschreibung_einsteiger: null },
  ],
  clearing: [
    { id: '1', name: 'SEPA CT', abkuerzung: 'SCT', region: 'EU / SEPA', cut_off: null, typ: 'Retail' },
    { id: '2', name: 'Fedwire', abkuerzung: null, region: 'USA', cut_off: '18:30 ET', typ: 'RTGS' },
  ],
  ihb: [
    { id: '1', land: 'DE', iso_waehrung: 'EUR', pobo_status: 'Erlaubt', cobo_status: 'Erlaubt', ihb_bewertung: 'Grün', netting_erlaubt: 'Ja', lokales_konto: null },
    { id: '2', land: 'US', iso_waehrung: 'USD', pobo_status: 'Eingeschränkt', cobo_status: 'Eingeschränkt', ihb_bewertung: 'Rot', netting_erlaubt: 'Nein', lokales_konto: 'Pflicht' },
  ],
  countries: [
    { code: 'DE', name: 'Deutschland', complexity: 'low', currency: 'EUR', payment_infra: 'EBICS, SEPA' },
    { code: 'US', name: 'USA', complexity: 'high', currency: 'USD', payment_infra: 'ACH, Fedwire' },
  ],
  technik: [
    { id: 'ebics', name: 'EBICS', subtitle: null, category: 'bank', komplexitaet: 3, einsatzgebiet: 'DACH + FR', badges: ['DACH'], tags: ['ebics'] },
    { id: 'swift', name: 'SWIFT', subtitle: null, category: 'bank', komplexitaet: 4, einsatzgebiet: 'Global', badges: ['Global'], tags: ['swift'] },
    { id: 'h2h', name: 'Host-to-Host', subtitle: null, category: 'bank', komplexitaet: 2, einsatzgebiet: 'Universal', badges: [], tags: ['h2h'] },
  ],
};

const BASE: ScopeParams = {
  heimatland: 'DE',
  opsLaender: [],
  hausbankLaender: [],
  flagKonzern: false,
  flagS4hana: false,
  flagDringend: false,
};

describe('runEngine — technik rules', () => {
  it('selects EBICS when Heimatland is DE', () => {
    expect(runEngine(BASE, MINIMAL_KB).technik.primary).toContain('EBICS');
  });

  it('adds SWIFT when a non-SEPA ops-land is included', () => {
    const p = { ...BASE, opsLaender: ['US'] };
    expect(runEngine(p, MINIMAL_KB).technik.primary).toContain('SWIFT');
  });

  it('does not add SWIFT for SEPA-only selection', () => {
    const p = { ...BASE, opsLaender: ['FR', 'NL'] };
    expect(runEngine(p, MINIMAL_KB).technik.primary).not.toContain('SWIFT');
  });

  it('H2H always in alternatives', () => {
    expect(runEngine(BASE, MINIMAL_KB).technik.alternatives).toContain('H2H');
  });
});

describe('runEngine — regulatorik matching', () => {
  it('always includes global entries', () => {
    expect(runEngine(BASE, MINIMAL_KB).regulatorik.some(r => r.name === 'AML Global')).toBe(true);
  });

  it('includes US regulatorik when US is selected', () => {
    const p = { ...BASE, opsLaender: ['US'] };
    expect(runEngine(p, MINIMAL_KB).regulatorik.some(r => r.name === 'Dodd-Frank')).toBe(true);
  });

  it('excludes US regulatorik when US is not selected', () => {
    expect(runEngine(BASE, MINIMAL_KB).regulatorik.some(r => r.name === 'Dodd-Frank')).toBe(false);
  });
});

describe('runEngine — IHB', () => {
  it('returns empty IHB when flagKonzern is false', () => {
    expect(runEngine(BASE, MINIMAL_KB).ihb).toHaveLength(0);
  });

  it('includes matching IHB entries when flagKonzern is true', () => {
    const p = { ...BASE, flagKonzern: true };
    expect(runEngine(p, MINIMAL_KB).ihb.some(e => e.land === 'DE')).toBe(true);
  });
});

describe('runEngine — fremdlaender', () => {
  it('marks countries not in KB as fremdlaender', () => {
    const p = { ...BASE, opsLaender: ['JP'] };
    expect(runEngine(p, MINIMAL_KB).fremdlaender).toContain('JP');
  });

  it('does not mark KB countries as fremdlaender', () => {
    expect(runEngine(BASE, MINIMAL_KB).fremdlaender).not.toContain('DE');
  });
});
