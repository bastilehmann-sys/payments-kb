// Chat removed — lookup-only mode
export type RetrievedChunk = {
  chunk_id: string;
  content: string;
  heading: string | null;
  doc_slug: string;
  doc_title: string;
  doc_section: string;
  score: number;
};
export async function retrieve(_query: string, _k?: number): Promise<RetrievedChunk[]> {
  return [];
}
