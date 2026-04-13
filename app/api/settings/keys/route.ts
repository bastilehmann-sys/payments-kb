import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { encrypt } from '@/lib/crypto/cookie-crypto'
import { hasApiKeys } from '@/lib/api-keys/get-keys'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: '/',
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = await hasApiKeys()
  return NextResponse.json(status)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { anthropicKey?: string; openaiKey?: string }
  const res = NextResponse.json({ ok: true })

  if (body.anthropicKey) {
    res.cookies.set('ak_anth', encrypt(body.anthropicKey), COOKIE_OPTS)
  }
  if (body.openaiKey) {
    res.cookies.set('ak_oai', encrypt(body.openaiKey), COOKIE_OPTS)
  }

  return res
}

export async function DELETE() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('ak_anth', '', { ...COOKIE_OPTS, maxAge: 0 })
  res.cookies.set('ak_oai', '', { ...COOKIE_OPTS, maxAge: 0 })
  return res
}
