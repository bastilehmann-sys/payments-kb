// ─── Lean data types (only fields needed for engine + display) ────────────────

export interface RegEntryLean {
  id: string;
  name: string;
  kuerzel: string | null;
  kategorie: string | null;
  geltungsbereich: string | null;
  beschreibung_einsteiger: string | null;
  aufwand_tshirt: string | null;
}

export interface FormatEntryLean {
  id: string;
  format_name: string;
  region: string | null;
  nachrichtentyp: string | null;
  familie_standard: string | null;
  beschreibung_einsteiger: string | null;
}

export interface ClearingEntryLean {
  id: string;
  name: string;
  abkuerzung: string | null;
  region: string | null;
  cut_off: string | null;
  typ: string | null;
}

export interface IhbEntryLean {
  id: string;
  land: string;
  iso_waehrung: string | null;
  pobo_status: string | null;
  cobo_status: string | null;
  ihb_bewertung: string | null;
  netting_erlaubt: string | null;
  lokales_konto: string | null;
}

export interface CountryLean {
  code: string;
  name: string;
  complexity: string;
  currency: string | null;
  payment_infra: string | null;
}

export interface TechnikEntryLean {
  id: string;
  name: string;
  subtitle: string | null;
  category: string;
  komplexitaet: number | null;
  einsatzgebiet: string | null;
  badges: string[] | null;
  tags: string[] | null;
}

export interface KbData {
  regulatorik: RegEntryLean[];
  formate: FormatEntryLean[];
  clearing: ClearingEntryLean[];
  ihb: IhbEntryLean[];
  countries: CountryLean[];
  technik: TechnikEntryLean[];
}

// ─── Engine input/output types ────────────────────────────────────────────────

export interface ScopeParams {
  heimatland: string;
  opsLaender: string[];
  hausbankLaender: string[];
  flagKonzern: boolean;
  flagS4hana: boolean;
  flagDringend: boolean;
}

export interface TechnikResult {
  primary: string[];
  alternatives: string[];
  complexity: number;
  entries: TechnikEntryLean[];
  sapComponents: string[];
  reasons: string[];
}

export interface ReportData {
  technik: TechnikResult;
  formate: FormatEntryLean[];
  clearing: ClearingEntryLean[];
  regulatorik: RegEntryLean[];
  ihb: IhbEntryLean[];
  laender: CountryLean[];
  fremdlaender: string[];
}

// ─── Geography sets ───────────────────────────────────────────────────────────

const EU = new Set([
  'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI',
  'FR','GR','HR','HU','IE','IT','LT','LU','LV','MT',
  'NL','PL','PT','RO','SE','SI','SK',
]);

// SEPA = EU + non-EU SEPA countries
const SEPA = new Set([...EU, 'CH','NO','IS','LI','GB','MC','SM','AD']);

const EBICS_COUNTRIES = new Set(['DE','AT','CH','FR']);

// ─── Keyword building for text matching ───────────────────────────────────────

function buildKeywords(codes: string[]): string[] {
  const kw: string[] = [...codes.map(c => c.toLowerCase()), 'global'];

  if (codes.some(c => EU.has(c)))   kw.push('eu', 'europa', 'european', 'europäisch');
  if (codes.some(c => SEPA.has(c))) kw.push('sepa');
  if (codes.some(c => c === 'DE' || c === 'AT' || c === 'CH')) kw.push('dach', 'dach-raum');
  if (codes.includes('DE'))  kw.push('deutschland', 'german');
  if (codes.includes('AT'))  kw.push('österreich', 'austria', 'oesterreich');
  if (codes.includes('CH'))  kw.push('schweiz', 'switzerland');
  if (codes.includes('FR'))  kw.push('frankreich', 'france');
  if (codes.includes('US'))  kw.push('usa', 'united states', 'vereinigte staaten');
  if (codes.includes('GB'))  kw.push('uk', 'united kingdom', 'großbritannien');
  if (codes.includes('CN'))  kw.push('china');
  if (codes.includes('JP'))  kw.push('japan');

  return kw;
}

function matchText(text: string | null | undefined, keywords: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

function matchIhb(land: string, codes: string[], countryList: CountryLean[]): boolean {
  const lower = land.toLowerCase();
  for (const code of codes) {
    if (lower === code.toLowerCase()) return true;
    if (lower.includes(code.toLowerCase())) return true;
    const country = countryList.find(c => c.code === code);
    if (country && lower.includes(country.name.toLowerCase())) return true;
  }
  return false;
}

// ─── Main engine function ─────────────────────────────────────────────────────

export function runEngine(params: ScopeParams, kbData: KbData): ReportData {
  const allCodes = [
    ...new Set(
      [params.heimatland, ...params.opsLaender, ...params.hausbankLaender].filter(Boolean)
    ),
  ];

  const keywords = buildKeywords(allCodes);

  // Regulatorik: match geltungsbereich text
  const regulatorik = kbData.regulatorik.filter(e =>
    matchText(e.geltungsbereich, keywords)
  );

  // Formate: entries with no region = global (always include)
  const formate = kbData.formate.filter(e =>
    !e.region || e.region.toLowerCase() === 'global' || matchText(e.region, keywords)
  );

  // Clearing: match region text
  const clearing = kbData.clearing.filter(e => matchText(e.region, keywords));

  // IHB: exact land match, only when flagKonzern
  const ihb = params.flagKonzern
    ? kbData.ihb.filter(e => matchIhb(e.land, allCodes, kbData.countries))
    : [];

  // Countries: exact code match
  const laender = kbData.countries.filter(e => allCodes.includes(e.code));
  const fremdlaender = allCodes.filter(c => !kbData.countries.some(e => e.code === c));

  // Technik rules
  const hasEbics = allCodes.some(c => EBICS_COUNTRIES.has(c));
  const hasNonSepa = allCodes.some(c => !SEPA.has(c));

  const primary: string[] = [];
  const reasons: string[] = [];

  if (hasEbics) {
    primary.push('EBICS');
    reasons.push(`EBICS: ${allCodes.filter(c => EBICS_COUNTRIES.has(c)).join(', ')} im EBICS-Raum (DACH + FR)`);
  }
  if (hasNonSepa) {
    primary.push('SWIFT');
    reasons.push(`SWIFT: ${allCodes.filter(c => !SEPA.has(c)).join(', ')} außerhalb SEPA`);
  }
  if (primary.length === 0) {
    primary.push('H2H');
    reasons.push('H2H als Standard (nur SEPA-Länder)');
  }

  const alternatives = ['H2H'];
  if (params.flagS4hana && hasEbics) {
    alternatives.push('SAP MBC');
    reasons.push('SAP MBC als Alternative zum lokalen EBICS-Client (S/4HANA)');
  }

  const complexity = Math.min(5,
    1 +
    (hasEbics ? 1 : 0) +
    (hasNonSepa ? 2 : 0) +
    (params.flagKonzern ? 1 : 0)
  );

  const technikEntries = kbData.technik.filter(e => {
    const t = e.tags ?? [];
    if (primary.includes('EBICS') && (e.id === 'ebics' || t.includes('ebics'))) return true;
    if (primary.includes('SWIFT') && (e.id === 'swift' || t.includes('swift'))) return true;
    if (e.id === 'h2h' || t.includes('h2h')) return true;
    return false;
  });

  const sapComponents: string[] = [
    'DMEEX / DME-Formate aktivieren',
    'Zahlungswege (FBZP) je Land einrichten',
  ];
  if (hasEbics)            sapComponents.push('BCM – EBICS-Anbindung konfigurieren');
  if (hasNonSepa)          sapComponents.push('SWIFT FSN oder MBC aktivieren');
  if (params.flagS4hana)   sapComponents.push('SAP MBC prüfen (statt lokalem EBICS-Client)');
  if (params.flagKonzern)  sapComponents.push('In-House Bank Modul aktivieren', 'POBO/COBO-Customizing je Land prüfen');

  return {
    technik: { primary, alternatives, complexity, entries: technikEntries, sapComponents, reasons },
    formate,
    clearing,
    regulatorik,
    ihb,
    laender,
    fremdlaender,
  };
}
