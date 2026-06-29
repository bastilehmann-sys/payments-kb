import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSapImplementationPhases } from '@/lib/queries/sap';
import { SapImplementierungClient } from './sap-implementierung-client';
import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SAP Implementierung — Payments KB' };

export default async function SapImplementierungPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const phases = await getSapImplementationPhases();
  const mdPath = path.join(process.cwd(), 'content', 'gpdb_07_sap.md');
  const mdContent = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf-8') : '';

  return <SapImplementierungClient phases={phases} mdContent={mdContent} />;
}
