import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '@/db/client';
import { sapRoadmapItems, sapImplementationPhases } from '@/db/schema';

const ROADMAP_ITEMS = [
  {
    title: 'S/4HANA 2025 — BCM Enhancement',
    description: 'EBICS 3.0 nativ, erweiterte pain.001 v09 Unterstützung, ISO 20022 MX Ready',
    release_date: 'Q4 2025',
    status: 'announced',
    tags: ['BCM', 'EBICS', 'ISO20022'],
    sort_order: 1,
  },
  {
    title: 'SAP MBC 2.0 — Multi-Bank Connectivity',
    description: 'Neue Bank-Konnektoren, SWIFT gpi Integration, Echtzeit-Statustracking',
    release_date: 'Q2 2026',
    status: 'announced',
    tags: ['MBC', 'SWIFT', 'gpi'],
    sort_order: 2,
  },
  {
    title: 'PAYM Next-Gen (geplant)',
    description: 'Vollständige ISO 20022 Migration, ERP Payments Harmonisierung',
    release_date: '2027+',
    status: 'planned',
    tags: ['PAYM', 'ISO20022'],
    sort_order: 3,
  },
];

const PHASES = [
  {
    phase_nr: 1,
    title: 'Blueprint',
    description: 'Bankenlandschaft, Formate und Clearing-Wege analysieren',
    color: 'blue',
    md_anchor: 'phase-1-blueprint',
  },
  {
    phase_nr: 2,
    title: 'Connectivity',
    description: 'EBICS/H2H Setup, Bankschlüssel, MBC Konfiguration',
    color: 'green',
    md_anchor: 'phase-2-connectivity',
  },
  {
    phase_nr: 3,
    title: 'Formate',
    description: 'DMEE/DMEEX, pain.001, Zahlungsträger konfigurieren',
    color: 'yellow',
    md_anchor: 'phase-3-formate',
  },
  {
    phase_nr: 4,
    title: 'Test',
    description: 'Banktest, Pilotbuchungen, Fehlerbehandlung, Rückmeldungen',
    color: 'orange',
    md_anchor: 'phase-4-test',
  },
  {
    phase_nr: 5,
    title: 'Go-Live',
    description: 'Cutover, Hypercare, Monitoring, Dokumentation',
    color: 'purple',
    md_anchor: 'phase-5-go-live',
  },
];

async function seedSap() {
  console.log('Seeding sap_roadmap_items...');
  for (const item of ROADMAP_ITEMS) {
    await db.insert(sapRoadmapItems).values(item).onConflictDoNothing();
    console.log(`  ✓ ${item.title}`);
  }

  console.log('Seeding sap_implementation_phases...');
  for (const phase of PHASES) {
    await db
      .insert(sapImplementationPhases)
      .values(phase)
      .onConflictDoUpdate({
        target: sapImplementationPhases.phase_nr,
        set: {
          title: phase.title,
          description: phase.description,
          color: phase.color,
          md_anchor: phase.md_anchor,
        },
      });
    console.log(`  ✓ Phase ${phase.phase_nr}: ${phase.title}`);
  }

  console.log('Done.');
  process.exit(0);
}

seedSap().catch(err => { console.error(err); process.exit(1); });
