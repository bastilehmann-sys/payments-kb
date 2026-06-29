import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSapRoadmapItems } from '@/lib/queries/sap';
import { SapRoadmapClient } from './sap-roadmap-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SAP Roadmap — Payments KB' };

export default async function SapRoadmapPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const items = await getSapRoadmapItems();
  return <SapRoadmapClient items={items} />;
}
