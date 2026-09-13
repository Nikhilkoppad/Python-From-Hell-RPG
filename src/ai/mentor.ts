export type MentorMode = 'comedy' | 'teacher' | 'battle' | 'senior-engineer';
export type MentorChatTurn = { role: 'user' | 'assistant'; content: string };

export type MentorContext = {
  mode: MentorMode;
  lessonTitle: string;
  topic: string;
  userCode: string;
  output: string;
  mastery: number;
  recentMistakes: string[];
  chatHistory?: MentorChatTurn[];
};

export type MentorReply = { ok: boolean; text: string; source: 'configured-provider' | 'local-ollama' | 'local-fallback' };
export interface MentorProvider { ask(context: MentorContext): Promise<string> }

function fallback(context: MentorContext): MentorReply {
  const hasError = /error|traceback|exception/i.test(context.output);
  const text = hasError
    ? `${context.mode === 'comedy' ? 'PYTHONSURA: The traceback has filed a complaint. ' : 'PYTHONSURA: '}Read the last useful line of the error first. Then inspect the smallest piece of your code that could produce it.`
    : context.chatHistory?.length
      ? `PYTHONSURA: I am following you. Keep the same idea and change one small thing in the code, then run it again.`
      : `PYTHONSURA: Show me what you tried. For ${context.topic}, tell me what you expect this code to do before changing it.`;
  return { ok: true, text, source: 'local-fallback' };
}

export async function askMentor(context: MentorContext, provider?: MentorProvider): Promise<MentorReply> {
  if (!provider) return fallback(context);
  try { const text = await provider.ask(context); return { ok: true, text, source: 'configured-provider' }; }
  catch { return fallback(context); }
}

const localOllamaEndpoint = import.meta.env.DEV ? '/ollama/api' : 'http://127.0.0.1:11434/api';

export function createOllamaProvider(endpoint=localOllamaEndpoint, model='gemma4:latest'): MentorProvider {
  return {
    async ask(context) {
      const response = await fetch(`${endpoint.replace(/\/$/, '')}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          options: { temperature: 0.35 },
          messages: [
            { role: 'system', content: 'You are PYTHONSURA, a technically accurate Python tutor with a JARVIS-like personality. Teach like the learner is a complete beginner. Use playful roasting, occasional profanity, memes/emojis, and absurd developer humor, but never insult protected classes. Never fabricate Python behavior. Ask what the learner tried, explain one concept at a time, then give the smallest useful next step. Do not dump a complete solution unless explicitly requested. Distinguish Python language semantics from CPython implementation details and label version-sensitive claims. Maintain conversational continuity from the supplied chat history. React naturally to the learner’s last message instead of repeating generic advice.' },
            ...(context.chatHistory ?? []),
            { role: 'user', content: JSON.stringify({ ...context, chatHistory: undefined }) },
          ],
        }),
      });
      if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
      const payload = await response.json() as { message?: { content?: string } };
      const text = payload.message?.content?.trim();
      if (!text) throw new Error('Ollama returned no text');
      return text;
    },
  };
}

export function createOpenAICompatibleProvider(endpoint: string, model: string): MentorProvider {
  return {
    async ask(context) {
      const response = await fetch(`${endpoint.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, temperature: 0.4, messages: [
          { role: 'system', content: 'You are PYTHONSURA, a technically accurate Python mentor. Do not invent Python or CPython behavior. Ask what the learner tried, then give the smallest useful hint unless a full solution is explicitly requested. Maintain conversational continuity from the supplied history.' },
          ...(context.chatHistory ?? []),
          { role: 'user', content: JSON.stringify({ ...context, chatHistory: undefined }) },
        ] }),
      });
      if (!response.ok) throw new Error(`Mentor provider returned ${response.status}`);
      const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = payload.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Mentor provider returned no text');
      return text;
    },
  };
}
