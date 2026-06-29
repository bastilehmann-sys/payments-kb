import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getTechnikEntryBySlug } from '@/lib/queries/technik';
import { extractSection } from '@/lib/technik/parse-md';
import { TechnikDetailClient } from './technik-detail-client';
import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.toUpperCase()} — Technik — Payments KB` };
}

export default async function TechnikDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/login');

  const { slug } = await params;
  const entry = await getTechnikEntryBySlug(slug);
  if (!entry) notFound();

  const mdPath = path.join(process.cwd(), 'content', 'gpdb_06_technik.md');
  const mdContent = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf-8') : '';
  const articleMd = extractSection(mdContent, slug) ?? '';

  return <TechnikDetailClient entry={entry} articleMd={articleMd} />;
}
