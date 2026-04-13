export async function POST() {
  return Response.json({ error: 'Settings removed' }, { status: 410 });
}
