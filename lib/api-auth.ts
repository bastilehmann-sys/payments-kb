export function validateApiKey(request: Request): boolean {
  const key = process.env.AGENT_API_KEY;
  if (!key) return false;
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return false;
  return header.slice(7) === key;
}
