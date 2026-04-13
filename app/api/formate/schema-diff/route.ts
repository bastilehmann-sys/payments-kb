import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { promises as fs } from 'fs';
import path from 'path';
import { schemaDiff } from '@/lib/xml/schema-diff';

const ALLOWED_PREFIX = '/samples/formate/';

function isSafePath(p: string): boolean {
  return p.startsWith(ALLOWED_PREFIX) && !p.includes('..');
}

function resolvePublicPath(urlPath: string): string {
  // urlPath is like /samples/formate/pain.001.001.03.xml
  // public dir is at <root>/public
  return path.join(process.cwd(), 'public', urlPath);
}

export async function GET(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const a = searchParams.get('a');
  const b = searchParams.get('b');

  if (!a || !b) {
    return NextResponse.json({ error: 'Missing query params a and b' }, { status: 400 });
  }

  // LFI guard: both paths must start with /samples/formate/
  if (!isSafePath(a) || !isSafePath(b)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  let xmlA: string;
  let xmlB: string;
  try {
    xmlA = await fs.readFile(resolvePublicPath(a), 'utf-8');
  } catch {
    return NextResponse.json({ error: `File not found: ${a}` }, { status: 404 });
  }
  try {
    xmlB = await fs.readFile(resolvePublicPath(b), 'utf-8');
  } catch {
    return NextResponse.json({ error: `File not found: ${b}` }, { status: 404 });
  }

  const diff = schemaDiff(xmlA, xmlB);

  return NextResponse.json({
    added:  diff.added,
    removed: diff.removed,
    common: diff.common.length,
    total:  diff.total,
  });
}
