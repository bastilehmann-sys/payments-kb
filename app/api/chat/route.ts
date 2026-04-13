import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@/auth';
import { db } from '@/db/client';
import { chats, messages } from '@/db/schema';
import { getApiKeys } from '@/lib/api-keys/get-keys';
import { retrieve } from '@/lib/chat/retrieve';
import { SYSTEM_PROMPT, buildUserContext } from '@/lib/chat/prompt';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let apiKeys;
  try {
    apiKeys = await getApiKeys();
  } catch {
    return Response.json({ error: 'API keys missing' }, { status: 428 });
  }

  const body = await req.json() as { chatId: string | null; message: string };
  const { message } = body;
  let { chatId } = body;

  if (!message?.trim()) {
    return Response.json({ error: 'Message required' }, { status: 400 });
  }

  // Create or load chat
  if (!chatId) {
    const title = message.slice(0, 60);
    const [newChat] = await db.insert(chats).values({ title }).returning({ id: chats.id });
    chatId = newChat.id;
  }

  // Insert user message
  await db.insert(messages).values({
    chat_id: chatId,
    role: 'user',
    content: message,
  });

  // Retrieve relevant chunks
  const chunks = await retrieve(message, apiKeys.openai, 8);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        const line = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(line));
      }

      try {
        const client = new Anthropic({ apiKey: apiKeys.anthropic });

        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-5',
          max_tokens: 2000,
          system: [
            { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
            { type: 'text', text: buildUserContext(chunks), cache_control: { type: 'ephemeral' } },
          ],
          messages: [{ role: 'user', content: message }],
        });

        let fullText = '';

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const text = event.delta.text;
            fullText += text;
            send('delta', { text });
          }
        }

        // Save assistant message
        const sources = chunks.map((c) => ({
          chunk_id: c.chunk_id,
          doc_slug: c.doc_slug,
          heading: c.heading,
          doc_section: c.doc_section,
        }));

        const [savedMsg] = await db
          .insert(messages)
          .values({
            chat_id: chatId!,
            role: 'assistant',
            content: fullText,
            sources,
          })
          .returning({ id: messages.id });

        // Update chat updated_at
        await db
          .update(chats)
          .set({ updated_at: new Date() })
          .where(eq(chats.id, chatId!));

        send('done', {
          messageId: savedMsg.id,
          chatId,
          sources,
        });
      } catch (err) {
        console.error('[chat/stream]', err);
        send('error', { message: 'Streaming-Fehler' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
