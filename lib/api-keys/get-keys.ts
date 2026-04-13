// API keys removed — lookup-only mode
export type ApiKeys = { anthropic: string; openai: string };
export async function getApiKeys(): Promise<ApiKeys> {
  throw new Error('API keys not available in lookup-only mode');
}
export async function hasApiKeys(): Promise<{ anthropic: boolean; openai: boolean }> {
  return { anthropic: false, openai: false };
}
