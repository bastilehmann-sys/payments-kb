import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/db/client';
import { chats } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { listMessages } from '@/lib/queries/chats';
import { ChatView } from '@/components/chat/chat-view';
import type { Metadata } from 'next';

type SourceItem = {
  chunk_id: string;
  doc_slug: string;
  heading: string | null;
  doc_section: string;
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const rows = await db
    .select({ title: chats.title })
    .from(chats)
    .where(eq(chats.id, id))
    .limit(1);
  return { title: rows[0] ? `${rows[0].title} — Chat` : 'Chat' };
}

export default async function ChatPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/login');

  const { id } = await params;

  const rows = await db
    .select({ id: chats.id, title: chats.title })
    .from(chats)
    .where(eq(chats.id, id))
    .limit(1);

  if (!rows[0]) notFound();

  const chat = rows[0];
  const msgs = await listMessages(id);

  return (
    <ChatView
      chatId={chat.id}
      chatTitle={chat.title}
      initialMessages={msgs.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        sources: m.sources as SourceItem[] | null,
      }))}
    />
  );
}
