import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from '@/db/client';
import { technikEntries } from '@/db/schema';

const ENTRIES = [
  {
    id: 'ebics',
    name: 'EBICS',
    subtitle: 'Electronic Banking Internet Communication Standard',
    category: 'bank',
    badges: ['DACH Standard', 'Bank-seitig'],
    einsatzgebiet: 'Massenzahlungen, Kontoauszüge',
    sicherheit: '3-Schlüssel (A005, X002, E002)',
    verbreitung: 'DACH + FR, sehr hoch',
    sap_integration: 'BCM, MBC, DME Engine',
    version_aktuell: 'EBICS 3.0',
    formate: ['pain.001', 'pain.008', 'camt.053'],
    alternativen: ['H2H', 'SWIFT'],
    komplexitaet: 3,
    tags: ['bank-seitig', 'pain.001', 'camt.053'],
  },
  {
    id: 'h2h',
    name: 'H2H',
    subtitle: 'Host-to-Host',
    category: 'bank',
    badges: ['Direktverbindung', 'Bank-seitig'],
    einsatzgebiet: 'Direktverbindung ERP → Bank via SFTP/AS2',
    sicherheit: 'SSH-Schlüssel, Zertifikate',
    verbreitung: 'Bilateral, mittel',
    sap_integration: 'BCM, externe Middleware (Axway, Sterling)',
    version_aktuell: 'Kein Standard — bankspezifisch',
    formate: ['pain.001', 'MT101', 'bankspezifisch'],
    alternativen: ['EBICS', 'MBC'],
    komplexitaet: 4,
    tags: ['bank-seitig', 'SFTP', 'AS2'],
  },
  {
    id: 'sap-mbc',
    name: 'SAP MBC',
    subtitle: 'Multi-Bank Connectivity',
    category: 'sap',
    badges: ['SAP-nativ', 'Cloud', 'S/4HANA'],
    einsatzgebiet: 'Zentrales SAP-Banknetzwerk ohne Middleware',
    sicherheit: 'SAP BTP, TLS, OAuth',
    verbreitung: 'Wachsend, S/4HANA-Fokus',
    sap_integration: 'Nativ in S/4HANA, BTP',
    version_aktuell: 'MBC 2.0',
    formate: ['pain.001', 'camt.053'],
    alternativen: ['EBICS', 'H2H'],
    komplexitaet: 3,
    tags: ['SAP-nativ', 'Cloud', 'S4HANA'],
  },
  {
    id: 'swift',
    name: 'SWIFT',
    subtitle: 'Society for Worldwide Interbank Financial Telecommunication',
    category: 'swift',
    badges: ['Global', 'Interbanken'],
    einsatzgebiet: 'Internationale Zahlungen und Finanzinformationen',
    sicherheit: 'SWIFT PKI, HSM, Alliance-Infrastruktur',
    verbreitung: 'Global, sehr hoch',
    sap_integration: 'SAP FSN, Drittanbieter-Middleware',
    version_aktuell: 'MX (ISO 20022) + SWIFT gpi',
    formate: ['MT101', 'MT940', 'pain.001', 'camt.053'],
    alternativen: ['EBICS (DACH)', 'MBC'],
    komplexitaet: 5,
    tags: ['SWIFT', 'Global', 'MT101', 'gpi', 'MX'],
  },
  {
    id: 'swift-service-bureau',
    name: 'SWIFT Service Bureau',
    subtitle: 'Managed SWIFT-Zugang über Drittanbieter',
    category: 'swift',
    badges: ['Global', 'Outsourcing'],
    einsatzgebiet: 'SWIFT-Zugang ohne eigene Infrastruktur',
    sicherheit: 'Über Bureau-Anbieter (HSM, Compliance)',
    verbreitung: 'Mittel, für mid-size Corporates',
    sap_integration: 'Wie H2H — SFTP/API zum Bureau',
    version_aktuell: 'Abhängig vom Bureau-Anbieter',
    formate: ['MT101', 'pain.001', 'camt.053'],
    alternativen: ['SWIFT Direktmitglied', 'EBICS'],
    komplexitaet: 3,
    tags: ['SWIFT', 'Outsourcing', 'Service-Bureau'],
  },
];

async function seedTechnik() {
  console.log('Seeding technik_entries...');
  for (const entry of ENTRIES) {
    await db
      .insert(technikEntries)
      .values(entry)
      .onConflictDoUpdate({
        target: technikEntries.id,
        set: {
          name: entry.name,
          subtitle: entry.subtitle,
          category: entry.category,
          badges: entry.badges,
          einsatzgebiet: entry.einsatzgebiet,
          sicherheit: entry.sicherheit,
          verbreitung: entry.verbreitung,
          sap_integration: entry.sap_integration,
          version_aktuell: entry.version_aktuell,
          formate: entry.formate,
          alternativen: entry.alternativen,
          komplexitaet: entry.komplexitaet,
          tags: entry.tags,
          updated_at: new Date(),
        },
      });
    console.log(`  ✓ ${entry.name}`);
  }
  console.log('Done.');
  process.exit(0);
}

seedTechnik().catch(err => { console.error(err); process.exit(1); });
