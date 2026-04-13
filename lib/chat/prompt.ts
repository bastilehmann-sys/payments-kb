export const SYSTEM_PROMPT = `Du bist der Assistent für die Global Payments Wissensdatenbank.

Antworte AUSSCHLIESSLICH basierend auf den bereitgestellten Quellen.
Erfinde keine Fakten. Wenn die Quellen keine Antwort enthalten, sage das explizit: "Keine Quelle in der Datenbank gefunden."

Zitiere relevante Quellen am Ende deiner Antwort als Liste im Format:
Quellen:
- [doc_slug § heading]

Antworte auf Deutsch. Formatiere Antworten in Markdown wenn sinnvoll (Listen, Tabellen, Codeblöcke für Formatbeispiele).`;

export function buildUserContext(chunks: { heading: string | null; doc_slug: string; content: string }[]): string {
  const parts = chunks.map((c, i) =>
    `<source id="${i + 1}" doc="${c.doc_slug}" heading="${c.heading ?? ''}">\n${c.content}\n</source>`
  );
  return `Quellen:\n${parts.join('\n\n')}`;
}
