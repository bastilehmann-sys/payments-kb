'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageBubble, type Message } from './message-bubble';
import { cn } from '@/lib/utils';

type SourceItem = {
  chunk_id: string;
  doc_slug: string;
  heading: string | null;
  doc_section: string;
};

interface ChatViewProps {
  chatId: string;
  chatTitle: string;
  initialMessages: Message[];
}

const EXAMPLE_PROMPTS = [
  'Was ist SEPA und welche Zahlungsarten gibt es?',
  'Erkläre den pain.001 XML-Aufbau',
  'Welche Länder haben besondere Zahlungsanforderungen?',
  'Was ist der Unterschied zwischen DMEEX und DMEE?',
];

const STREAMING_ID = '__streaming__';

export function ChatView({ chatId: initialChatId, initialMessages }: ChatViewProps) {
  const [chatId, setChatId] = useState(initialChatId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    // Optimistic user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    // Streaming placeholder
    const streamingMsg: Message = {
      id: STREAMING_ID,
      role: 'assistant',
      content: '',
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, streamingMsg]);
    setInput('');
    setStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message: trimmed }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            // event type — handled together with data line
          } else if (line.startsWith('data: ')) {
            const raw = line.slice(6);
            try {
              const parsed = JSON.parse(raw) as { text?: string; messageId?: string; chatId?: string; sources?: SourceItem[] };

              if (parsed.text !== undefined) {
                accText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === STREAMING_ID ? { ...m, content: accText } : m
                  )
                );
              } else if (parsed.messageId) {
                // done event — finalize
                if (parsed.chatId) setChatId(parsed.chatId);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === STREAMING_ID
                      ? {
                          ...m,
                          id: parsed.messageId!,
                          content: accText,
                          streaming: false,
                          sources: parsed.sources ?? null,
                        }
                      : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error('[chat] stream error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === STREAMING_ID
            ? { ...m, id: `err-${Date.now()}`, content: 'Fehler beim Laden der Antwort.', streaming: false }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }, [chatId, streaming]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-12">
            {/* Chat icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
            </div>

            <div className="text-center">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Was möchtest du wissen?
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Frage die Payments-Wissensdatenbank — Antworten nur aus verifizierten Quellen.
              </p>
            </div>

            {/* Example prompts */}
            <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground/80 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl py-6 space-y-1">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <div
            className={cn(
              'flex items-end gap-2 rounded-xl border bg-card px-4 py-2 transition-colors',
              streaming ? 'border-primary/30' : 'border-border focus-within:border-primary/50'
            )}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={streaming}
              placeholder="Nachricht eingeben… (Enter zum Senden, Shift+Enter für neue Zeile)"
              className="flex-1 resize-none bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none disabled:opacity-60"
              style={{ maxHeight: '200px' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              aria-label="Senden"
              className={cn(
                'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                input.trim() && !streaming
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {streaming ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 animate-spin" aria-hidden="true">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M9 12h.01M15 12h.01" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1.5 text-center text-xs text-muted-foreground/50">
            Antworten basieren ausschließlich auf der Wissensdatenbank.
          </p>
        </div>
      </div>
    </div>
  );
}
