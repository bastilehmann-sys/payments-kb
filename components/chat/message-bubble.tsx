// Chat removed — lookup-only mode
export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: unknown;
  streaming?: boolean;
};
export function MessageBubble() { return null; }
