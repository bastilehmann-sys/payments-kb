import { listDocuments } from '@/lib/queries/documents';
import { DocumentList } from '@/components/browse/document-list';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulatorik — Payments KB',
};

export default async function RegulatorikPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const docs = await listDocuments('regulatorik');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Regulatorik</h1>
        <p className="text-sm text-muted-foreground">
          Regulatorische Anforderungen und Compliance-Dokumente für Zahlungsverkehr.
        </p>
      </div>
      <DocumentList documents={docs} section="regulatorik" />
    </div>
  );
}
