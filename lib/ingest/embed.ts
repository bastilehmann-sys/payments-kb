import OpenAI from 'openai';

export async function embed(texts: string[], apiKey: string): Promise<number[][]> {
  const client = new OpenAI({ apiKey });
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += 100) {
    const batch = texts.slice(i, i + 100);
    const res = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch,
    });
    out.push(...res.data.map(d => d.embedding));
  }
  return out;
}
