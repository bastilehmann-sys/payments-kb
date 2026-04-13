import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { listChats, createChat } from '@/lib/queries/chats';

export default async function ChatIndexPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const existing = await listChats();
  if (existing.length > 0) {
    redirect(`/chat/${existing[0].id}`);
  }

  // No chats yet — create a blank one and redirect
  const chat = await createChat('Neuer Chat');
  redirect(`/chat/${chat.id}`);
}
