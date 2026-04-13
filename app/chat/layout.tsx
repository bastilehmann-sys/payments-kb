import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { listChats } from '@/lib/queries/chats';
import { ChatListSidebar } from '@/components/chat/chat-list';

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');

  const chatList = await listChats();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -mx-6 -my-6 md:-mx-8 md:-my-8 overflow-hidden">
      <ChatListSidebar initialChats={chatList} />
      <div className="flex-1 min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
