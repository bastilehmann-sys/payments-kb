/**
 * TEMPLATE — Country Blocks Seed Script
 * =====================================
 *
 * Standardstruktur für alle Länder-Seiten in /laender?code=XX.
 * Kopieren als `seed-<land>-blocks.ts`, COUNTRY_CODE + COUNTRY_NAME setzen,
 * Inhalte befüllen, Run:
 *
 *   DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-<land>-blocks.ts
 *
 * ─── Block-Reihenfolge (identisch zu IT + CN) ────────────────────────────────
 *   Block 1 — Country Master         (ISO, Währung, Konto-/IBAN-Format, BIC,
 *                                     Zeitzone, Zentralbank, Sprache, Feiertage,
 *                                     Wirtschaftskontext)
 *   Block 2 — Regulatorik            (PSD2/3, SEPA, e-Invoice, AML, Steuer-ID,
 *                                     Instant-VO, DORA/NIS2, lokale Devisen-
 *                                     kontrollen)
 *   Block 3 — Clearing / Banken      (nationales RTGS, Instant-Rail, Bulk,
 *                                     Top-Banken, lokales Konto, Feiertags-
 *                                     Cut-offs)
 *   Block 4 — SAP-Besonderheiten     (Localization-Paket, DMEE, Steuer-
 *                                     Integration, IHB/POBO/COBO, Reporting)
 *   Block 5 — Formate / Instrumente  (pain.001-Standardfall + Sub-Tabs mit
 *                                     Section-Markern `► 5.N — Titel` ODER
 *                                     länderspezifisch `► N.N — Titel`,
 *                                     gemappt in formate-it-panel.tsx SAMPLES)
 *   Block 6 — Purpose Codes          (optional, nur bei Ländern mit harten
 *                                     Zahlungszweck-Codes: CN BOP, IN RBI,
 *                                     BR BACEN, ZA SARB etc.)
 *
 * ─── Renderer-Konventionen ────────────────────────────────────────────────────
 *   • Sub-Tabs im Formate-Block: Zeile mit `feld: '► N.N — Titel'` ohne weitere
 *     Spalten. Alle folgenden Zeilen gehören zur Section bis zum nächsten `►`.
 *   • Sample-Files: in /public/samples/<cc>/ ablegen UND in
 *     components/laender/formate-it-panel.tsx → SAMPLES[`N.N`] eintragen.
 *   • Feld-Spalten: experte = Fachdetails + Paragraphen/Links, einsteiger =
 *     1-Satz-Erklärung, praxis = SAP-Konfiguration/T-Code/BTE.
 *   • Externe Links im experte-Feld als nackte URL einfügen — der Panel-
 *     Highlighter rendert sie (bzw. ergänzt Linkifier im country-panel).
 *   • Quick-Reference-Blöcke werden im Panel automatisch ausgefiltert.
 *
 * ─── IHB-Panel ────────────────────────────────────────────────────────────────
 *   IHB/POBO/COBO-Daten kommen aus der Excel-Tabelle (ihb_entries), NICHT
 *   aus diesem Script. Werden automatisch als synthetischer Tab angehängt.
 */
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq } from 'drizzle-orm';

// ════════════════════════════════════════════════════════════════════════════
// TODO: anpassen
// ════════════════════════════════════════════════════════════════════════════
const COUNTRY_CODE = 'XX';          // ISO alpha-2
const COUNTRY_NAME = 'Musterland';   // für Logs

type Row = { feld: string; experte?: string; einsteiger?: string; praxis?: string };
type Block = { no: number; title: string; rows: Row[] };

const BLOCKS: Block[] = [
  // ───── Block 1: Country Master ─────────────────────────────────────────────
  {
    no: 1,
    title: 'Country Master',
    rows: [
      { feld: 'ISO-Ländercode', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Währung', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Kontoformat / IBAN', experte: '', einsteiger: '', praxis: '' },
      { feld: 'BIC/SWIFT', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Zeitzone', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Zentralbank', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Sprache / Zeichensatz', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Nationale Feiertage', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Wirtschaft / Kontext', experte: '', einsteiger: '', praxis: '' },
    ],
  },

  // ───── Block 2: Regulatorik ────────────────────────────────────────────────
  {
    no: 2,
    title: 'Regulatorik',
    rows: [
      { feld: 'Devisenaufsicht / Kapitalverkehr', experte: '', einsteiger: '', praxis: '' },
      { feld: 'PSD2 / PSD3 (oder Äquivalent)', experte: '', einsteiger: '', praxis: '' },
      { feld: 'e-Invoice-Pflicht', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Steuer-ID (Firmen)', experte: '', einsteiger: '', praxis: '' },
      { feld: 'AML / KYC', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Sanktionen', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Withholding Tax', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Datenlokalisierung / Privacy', experte: '', einsteiger: '', praxis: '' },
      { feld: 'DORA / NIS2 (oder lokale Cyber-Regulierung)', experte: '', einsteiger: '', praxis: '' },
    ],
  },

  // ───── Block 3: Clearing / Banken ──────────────────────────────────────────
  {
    no: 3,
    title: 'Clearing / Banken',
    rows: [
      { feld: 'Nationales RTGS', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Bulk / Batch Clearing', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Instant Payments', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Cross-Border-System', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Top Banken', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Lokales Konto Pflicht?', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Feiertags-Cut-offs', experte: '', einsteiger: '', praxis: '' },
    ],
  },

  // ───── Block 4: SAP-Besonderheiten ─────────────────────────────────────────
  {
    no: 4,
    title: 'SAP-Besonderheiten',
    rows: [
      { feld: 'Localization-Paket', experte: '', einsteiger: '', praxis: '' },
      { feld: 'DMEE / Formate pro Bank', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Steuer-Integration (e-Invoice/WHT)', experte: '', einsteiger: '', praxis: '' },
      { feld: 'IHB / POBO / COBO', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Regulatory Reporting', experte: '', einsteiger: '', praxis: '' },
    ],
  },

  // ───── Block 5: Formate / Instrumente ──────────────────────────────────────
  // Section-Marker: `► N.N — Titel` (Nummern müssen mit SAMPLES-Keys in
  // components/laender/formate-it-panel.tsx übereinstimmen).
  {
    no: 5,
    title: 'Formate / Instrumente',
    rows: [
      // Standardfall-Callout (wird automatisch gerendert wenn pain.001 im feld)
      { feld: 'pain.001.001.03 (SEPA / Cross-Border)', experte: '', einsteiger: '', praxis: '' },

      // Sektion N.1
      { feld: '► N.1 — Format A' },
      { feld: 'Message-Version', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Pflichtfelder', experte: '', einsteiger: '', praxis: '' },

      // Sektion N.2
      { feld: '► N.2 — Format B' },
      { feld: 'Dateiformat', experte: '', einsteiger: '', praxis: '' },

      // Sektion N.3
      { feld: '► N.3 — e-Invoice / Steuerdokument' },
      { feld: 'Typen', experte: '', einsteiger: '', praxis: '' },

      // Sektion N.4
      { feld: '► N.4 — camt.053 / Kontoauszug' },
      { feld: 'Bank Statement', experte: '', einsteiger: '', praxis: '' },
    ],
  },

  // ───── Block 6: Purpose Codes (OPTIONAL) ───────────────────────────────────
  // Nur für Länder mit harten Zahlungszweck-Codes (CN BOP, IN RBI Purpose,
  // BR BACEN, ZA SARB etc.). Andernfalls diesen Block löschen.
  {
    no: 6,
    title: 'Purpose Codes',
    rows: [
      { feld: 'Was ist ein Purpose Code?', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Struktur', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Trägerfeld im pain.001 / MT103', experte: '', einsteiger: '', praxis: '' },
      { feld: 'Offizielle Quelle', experte: '', einsteiger: '', praxis: '' },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Seeder (nicht anpassen)
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(`=== Seed ${COUNTRY_NAME} (${COUNTRY_CODE}) Blocks ===`);
  console.log(`Truncating country_blocks for ${COUNTRY_CODE}...`);
  await db.delete(countryBlocks).where(eq(countryBlocks.country_code, COUNTRY_CODE));

  const toInsert: (typeof countryBlocks.$inferInsert)[] = [];
  for (const block of BLOCKS) {
    block.rows.forEach((row, idx) => {
      toInsert.push({
        country_code: COUNTRY_CODE,
        block_no: block.no,
        block_title: block.title,
        row_order: idx,
        feld: row.feld,
        experte: row.experte?.trim() ? row.experte : null,
        einsteiger: row.einsteiger?.trim() ? row.einsteiger : null,
        praxis: row.praxis?.trim() ? row.praxis : null,
      });
    });
  }

  const BATCH = 50;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    await db.insert(countryBlocks).values(toInsert.slice(i, i + BATCH));
  }

  // Markdown-Dokument deaktivieren, damit Block-Ansicht greift
  await db.update(countries).set({ document_id: null }).where(eq(countries.code, COUNTRY_CODE));

  console.log(`Inserted ${toInsert.length} rows across ${BLOCKS.length} blocks.`);
  for (const b of BLOCKS) console.log(`  Block ${b.no} "${b.title}": ${b.rows.length} rows`);
  console.log('\nNächste Schritte:');
  console.log(`  1. app/(fullscreen)/laender/page.tsx: getCountryBlocks('${COUNTRY_CODE}') aufnehmen`);
  console.log(`  2. Sample-Dateien in /public/samples/${COUNTRY_CODE.toLowerCase()}/ ablegen`);
  console.log(`  3. formate-it-panel.tsx: SAMPLES['N.N'] ergänzen`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
