'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type ChatItem = {
  id: string;
  title: string;
  updated_at: Date | null;
  created_at: Date | null;
};

interface ChatListSidebarProps {
  initialChats: ChatItem[];
}

export function ChatListSidebar({ initialChats }: ChatListSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  const [open, setOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingId]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpenId) return;
    const handler = () => setMenuOpenId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpenId]);

  async function handleNewChat() {
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Neuer Chat' }),
    });
    if (res.ok) {
      const data = await res.json() as { chat: ChatItem };
      setChats((prev) => [data.chat, ...prev]);
      router.push(`/chat/${data.chat.id}`);
    }
  }

  async function handleDelete(id: string) {
    setMenuOpenId(null);
    await fetch(`/api/chats/${id}`, { method: 'DELETE' });
    setChats((prev) => prev.filter((c) => c.id !== id));
    // If we deleted the active chat, navigate to /chat
    if (pathname === `/chat/${id}`) {
      router.push('/chat');
    }
  }

  function startRename(chat: ChatItem) {
    setMenuOpenId(null);
    setEditingId(chat.id);
    setEditValue(chat.title);
  }

  async function commitRename(id: string) {
    const trimmed = editValue.trim();
    if (trimmed) {
      await fetch(`/api/chats/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: trimmed } : c))
      );
    }
    setEditingId(null);
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="absolute left-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat-Liste umschalten"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-sidebar transition-all duration-200',
          open ? 'w-64 shrink-0' : 'w-0 overflow-hidden'
        )}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3">
          <span className="font-heading text-sm font-semibold text-foreground">Chats</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              title="Neuer Chat"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button
              onClick={() => setOpen(false)}
              title="Sidebar schließen"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {chats.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              Noch keine Chats
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5 px-1">
              {chats.map((chat) => {
                const isActive = pathname === `/chat/${chat.id}`;
                return (
                  <li key={chat.id} className="relative">
                    {editingId === chat.id ? (
                      <input
                        ref={editRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitRename(chat.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename(chat.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-full rounded-md border border-primary bg-background px-3 py-1.5 text-sm text-foreground outline-none"
                      />
                    ) : (
                      <div
                        className={cn(
                          'group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground'
                        )}
                        onClick={() => router.push(`/chat/${chat.id}`)}
                      >
                        <span className="flex-1 truncate">{chat.title}</span>

                        {/* Context menu trigger */}
                        <button
                          className={cn(
                            'ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100',
                            menuOpenId === chat.id && 'opacity-100'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId((prev) => (prev === chat.id ? null : chat.id));
                          }}
                          aria-label="Optionen"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                            <circle cx="5" cy="12" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="19" cy="12" r="1.5" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Dropdown */}
                    {menuOpenId === chat.id && (
                      <div
                        className="absolute right-1 top-8 z-50 min-w-[140px] rounded-lg border border-border bg-popover py-1 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
                          onClick={() => startRename(chat)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Umbenennen
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                          onClick={() => handleDelete(chat.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                          Löschen
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>
    </>
  );
}
