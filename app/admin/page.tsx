import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminPageClient from './AdminPageClient';

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return <AdminPageClient />;
}
