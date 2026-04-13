import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getApiKeys } from '@/lib/api-keys/get-keys'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let keys: { anthropic: string; openai: string }
  try {
    keys = await getApiKeys()
  } catch {
    return NextResponse.json({ error: 'API-Keys fehlen' }, { status: 400 })
  }

  const results = {
    anthropic: 'error' as 'ok' | 'error',
    openai: 'error' as 'ok' | 'error',
    errors: {} as Record<string, string>,
  }

  // Test Anthropic
  try {
    const client = new Anthropic({ apiKey: keys.anthropic })
    await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'ping' }],
    })
    results.anthropic = 'ok'
  } catch (err) {
    results.errors.anthropic = err instanceof Error ? err.message : String(err)
  }

  // Test OpenAI
  try {
    const client = new OpenAI({ apiKey: keys.openai })
    await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'ping',
    })
    results.openai = 'ok'
  } catch (err) {
    results.errors.openai = err instanceof Error ? err.message : String(err)
  }

  if (Object.keys(results.errors).length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (results as any).errors
  }

  return NextResponse.json(results)
}
