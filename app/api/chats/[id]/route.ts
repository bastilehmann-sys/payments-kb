export async function PATCH() {
  return Response.json({ error: 'Chat removed' }, { status: 410 });
}
export async function DELETE() {
  return Response.json({ error: 'Chat removed' }, { status: 410 });
}
