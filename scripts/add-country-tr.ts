import { db } from '../db/client';
import { countries, documents } from '../db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  // Find the TR document
  const doc = await db
    .select({ id: documents.id })
    .from(documents)
    .where(eq(documents.source_file, 'gpdb_08_tuerkiye-tr-fast-echtzeitzahlungssystem-.md'))
    .limit(1);

  if (doc.length === 0) {
    console.error('Document not found — run reindex first');
    process.exit(1);
  }

  const docId = doc[0].id;
  console.log('Document ID:', docId);

  // Check if TR already exists
  const existing = await db.select().from(countries).where(eq(countries.code, 'TR')).limit(1);

  if (existing.length > 0) {
    // Update document_id
    await db.update(countries).set({ document_id: docId }).where(eq(countries.code, 'TR'));
    console.log('Updated existing TR entry with document_id');
  } else {
    // Insert new country
    await db.insert(countries).values({
      code: 'TR',
      name: 'Türkiye',
      complexity: 'high',
      currency: 'TRY',
      summary: 'Echtzeitzahlungssystem FAST (24/7), TCMB-reguliert, kein SEPA-Mitglied, hohe TRY-Volatilität',
      payment_infra: 'FAST (Echtzeit, ≤250.000 TRY), ESTS/RTGS (Großbeträge), SWIFT',
      central_bank: 'TCMB (Türkiye Cumhuriyet Merkez Bankası)',
      iso20022_status: 'Infrastrukturebene (pacs.008/pacs.002), Schnittstelle bankspezifisch',
      instant_payments: 'FAST — 24/7/365, <25 Sek., Limit 250.000 TRY (ab Feb 2026)',
      regulatorik: 'Gesetz Nr. 6493, TCMB-Rundschreiben, BDDK-Lizenz erforderlich',
      ihb_pobo_cobo: 'Lokales TRY-Konto Pflicht, kein SEPA-Durchleitungsmodell',
      sap_effort: 'Hoch — separater Zahlungsweg für FAST/ESTS, TRY-Neubewertung täglich, Kapitalverkehrsmeldung',
      key_note: 'Kein SEPA-Mitglied. FAST-Limit Feb 2026 auf 250.000 TRY angehoben. TRY-Volatilität erfordert tägl. Neubewertung.',
      document_id: docId,
    });
    console.log('Inserted TR into countries table');
  }

  console.log('Done.');
}

main().catch(console.error);
