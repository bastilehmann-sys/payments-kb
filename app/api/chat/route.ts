export async function POST() {
  return Response.json({ error: 'Chat removed' }, { status: 410 });
}
