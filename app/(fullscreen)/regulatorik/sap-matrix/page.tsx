import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getRegulatorikEntries } from '@/lib/queries/entries';
import { RegulatorikSapMatrix } from '@/components/regulatorik/sap-matrix';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulatorik — SAP-Matrix — Payments KB',
};

export default async function RegulatorikSapMatrixPage() {
  const session = await auth();
  if (!session) redirect('/login');
  const data = await getRegulatorikEntries();
  return <RegulatorikSapMatrix items={data as unknown as Record<string, unknown>[]} />;
}
