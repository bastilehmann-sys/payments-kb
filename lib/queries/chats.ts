// Chat removed — lookup-only mode
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

export async function listChats(): Promise<ChatRow[]> { return []; }
export async function createChat(_title: string): Promise<ChatRow> {
  throw new Error('Chat removed');
}
export async function renameChat(_id: string, _title: string): Promise<void> {}
export async function deleteChat(_id: string): Promise<void> {}
export async function listMessages(_chatId: string): Promise<MessageRow[]> { return []; }
