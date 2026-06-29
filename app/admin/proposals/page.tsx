import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllProposals } from '@/lib/queries/proposals';
import { ProposalsClient } from './proposals-client';

export default async function ProposalsPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const proposals = await getAllProposals();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Content Proposals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Wöchentlich vom Update-Agent generiert. Kommentieren, freigeben oder ablehnen.
        </p>
      </div>
      <ProposalsClient initialProposals={proposals} />
    </div>
  );
}
