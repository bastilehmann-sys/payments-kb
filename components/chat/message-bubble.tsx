'use client';

import { Markdown } from '@/components/browse/markdown';
import { SourcePills } from './source-pills';

type SourceItem = {
  chunk_id: string;
  doc_slug: string;
  heading: string | null;
  doc_section: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceItem[] | null;
  streaming?: boolean;
};

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-3 text-sm text-foreground ring-1 ring-primary/20">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 py-2">
      <div className="max-w-[85%] space-y-1">
        {/* Avatar dot */}
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="rounded-2xl rounded-tl-sm bg-card px-4 py-3 ring-1 ring-border">
              {message.content ? (
                <Markdown content={message.content} />
              ) : null}
              {message.streaming && !message.content && (
                <span className="inline-block h-4 w-0.5 animate-pulse bg-primary" />
              )}
              {message.streaming && message.content && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
              )}
            </div>

            {!message.streaming && message.sources && message.sources.length > 0 && (
              <div className="px-1">
                <SourcePills sources={message.sources} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
