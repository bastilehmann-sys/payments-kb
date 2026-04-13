import { auth } from '@/auth';
import { getApiKeys } from '@/lib/api-keys/get-keys';
import { reindex } from '@/lib/ingest/reindex';

// Allow up to 5 minutes for long-running reindex on Vercel
export const maxDuration = 300;

export async function POST() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let openai: string;
  try {
    const keys = await getApiKeys();
    openai = keys.openai;
  } catch {
    return Response.json(
      { error: 'API-Keys fehlen — bitte unter /settings eintragen' },
      { status: 428 }
    );
  }

  try {
    const result = await reindex({ openaiKey: openai });
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
    console.error('[admin/reindex] error:', err);
    return Response.json({ error: message }, { status: 500 });
  }
}
