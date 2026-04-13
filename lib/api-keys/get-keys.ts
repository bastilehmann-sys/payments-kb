import { cookies } from 'next/headers'
import { decrypt } from '@/lib/crypto/cookie-crypto'

export type ApiKeys = { anthropic: string; openai: string }

export async function getApiKeys(): Promise<ApiKeys> {
  const c = await cookies()
  const a = c.get('ak_anth')?.value
  const o = c.get('ak_oai')?.value
  if (!a || !o) throw new Error('API-Keys fehlen — bitte unter /settings eintragen')
  return { anthropic: decrypt(a), openai: decrypt(o) }
}

export async function hasApiKeys(): Promise<{ anthropic: boolean; openai: boolean }> {
  const c = await cookies()
  return { anthropic: !!c.get('ak_anth'), openai: !!c.get('ak_oai') }
}
