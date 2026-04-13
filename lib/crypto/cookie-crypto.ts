import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto'

const KEY = scryptSync(process.env.NEXTAUTH_SECRET!, 'payments-kb-salt', 32)
const ALGO = 'aes-256-gcm'

export function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGO, KEY, iv)
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64url')
}

export function decrypt(b64: string): string {
  const buf = Buffer.from(b64, 'base64url')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const enc = buf.subarray(28)
  const decipher = createDecipheriv(ALGO, KEY, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}
