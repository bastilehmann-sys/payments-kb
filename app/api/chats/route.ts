import { auth } from '@/auth';
import { listChats, createChat } from '@/lib/queries/chats';

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await listChats();
  return Response.json({ chats: rows });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as { title?: string };
  const title = (body.title ?? 'Neuer Chat').slice(0, 60);
  const chat = await createChat(title);
  return Response.json({ chat }, { status: 201 });
}
