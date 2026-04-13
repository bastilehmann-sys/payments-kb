import { listDocuments } from '@/lib/queries/documents';
import { DocumentList } from '@/components/browse/document-list';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formate — Payments KB',
};

export default async function FormateePage() {
  const session = await auth();
  if (!session) redirect('/login');

  const docs = await listDocuments('formate');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Formate</h1>
        <p className="text-sm text-muted-foreground">
          Zahlungsformate und XML-Schemata (ISO 20022, pain.001, CAMT u.a.).
        </p>
      </div>
      <DocumentList documents={docs} section="formate" />
    </div>
  );
}
