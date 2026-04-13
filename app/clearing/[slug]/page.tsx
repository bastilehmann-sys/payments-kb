import { getDocumentBySlug } from '@/lib/queries/documents';
import { Markdown } from '@/components/browse/markdown';
import { Toc } from '@/components/browse/toc';
import { extractToc } from '@/lib/browse/toc';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocumentBySlug(slug);
  return {
    title: doc ? `${doc.title} — Payments KB` : 'Dokument nicht gefunden',
  };
}

export default async function DocumentPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/login');

  const { slug } = await params;
  const doc = await getDocumentBySlug(slug);
  if (!doc || doc.section !== 'clearing') notFound();

  const toc = extractToc(doc.content_md);

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/clearing" className="hover:text-foreground transition-colors">
            Clearing
          </Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="truncate text-foreground">{doc.title}</span>
        </nav>

        <h1 className="mb-8 font-heading text-2xl font-semibold text-foreground">{doc.title}</h1>
        <Markdown content={doc.content_md} />
      </div>

      {toc.length > 0 && (
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-20">
            <Toc entries={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
