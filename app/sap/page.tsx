import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SapPage() {
  const session = await auth();
  if (!session) redirect('/login');
  redirect('/sap/roadmap');
}
