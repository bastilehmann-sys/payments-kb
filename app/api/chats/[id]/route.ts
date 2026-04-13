import { auth } from '@/auth';
import { renameChat, deleteChat } from '@/lib/queries/chats';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as { title?: string };
  if (!body.title?.trim()) {
    return Response.json({ error: 'Title required' }, { status: 400 });
  }
  await renameChat(id, body.title.slice(0, 60));
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await deleteChat(id);
  return Response.json({ ok: true });
}
