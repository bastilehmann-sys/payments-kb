import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllTechnikEntries } from '@/lib/queries/technik';
import { TechnikClient } from './technik-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technik — Payments KB',
};

export default async function TechnikPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const entries = await getAllTechnikEntries();
  return <TechnikClient entries={entries} />;
}
