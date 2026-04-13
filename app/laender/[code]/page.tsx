import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return { title: `${code.toUpperCase()} — Payments KB` };
}

/**
 * Redirect old /laender/[code] URLs to the new split-view at /laender?code=CODE
 */
export default async function CountryRedirectPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/login');

  const { code } = await params;
  redirect(`/laender?code=${code.toUpperCase()}`);
}
