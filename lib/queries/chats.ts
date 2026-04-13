import { db } from '@/db/client';
import { chats, messages } from '@/db/schema';
import { desc, eq, asc } from 'drizzle-orm';

export type ChatRow = {
  id: string;
  title: string;
  created_at: Date | null;
  updated_at: Date | null;
};

export type MessageRow = {
  id: string;
  chat_id: string | null;
  role: string;
  content: string;
  sources: unknown;
  created_at: Date | null;
};

export async function listChats(): Promise<ChatRow[]> {
  return db
    .select({
      id: chats.id,
      title: chats.title,
      created_at: chats.created_at,
      updated_at: chats.updated_at,
    })
    .from(chats)
    .orderBy(desc(chats.updated_at));
}

export async function createChat(title: string): Promise<ChatRow> {
  const [row] = await db
    .insert(chats)
    .values({ title })
    .returning({
      id: chats.id,
      title: chats.title,
      created_at: chats.created_at,
      updated_at: chats.updated_at,
    });
  return row;
}

export async function renameChat(id: string, title: string): Promise<void> {
  await db.update(chats).set({ title }).where(eq(chats.id, id));
}

export async function deleteChat(id: string): Promise<void> {
  await db.delete(chats).where(eq(chats.id, id));
}

export async function listMessages(chatId: string): Promise<MessageRow[]> {
  return db
    .select({
      id: messages.id,
      chat_id: messages.chat_id,
      role: messages.role,
      content: messages.content,
      sources: messages.sources,
      created_at: messages.created_at,
    })
    .from(messages)
    .where(eq(messages.chat_id, chatId))
    .orderBy(asc(messages.created_at));
}
