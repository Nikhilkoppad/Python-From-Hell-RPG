export type MentorMode = 'comedy' | 'teacher' | 'battle' | 'senior-engineer';
export type MentorLanguage = 'en' | 'hinglish';
export type MentorChatTurn = { role: 'user' | 'assistant'; content: string };
export type MentorContext = {
  mode: MentorMode;
  language?: MentorLanguage;
  lessonTitle: string;
  topic: string;
  userCode: string;
  output: string;
  mastery: number;
  recentMistakes: string[];
  chatHistory?: MentorChatTurn[];
};
export type MentorReply = {
  ok: boolean;
  text: string;
  source: 'configured-provider' | 'local-ollama' | 'local-fallback';
};
export interface MentorProvider {
  ask(context: MentorContext): Promise<string>;
}
function fallback(context: MentorContext): MentorReply {
  const hinglish = context.language === 'hinglish';
  const hasError = /error|traceback|exception/i.test(context.output);
  const text = hasError
    ? hinglish
      ? 'PYTHONSURA: Traceback ne complaint daal di hai. Last useful line padh. Phir code ke us chhote part ko dekh jo ye error bana sakta hai.'
      : 'PYTHONSURA: The traceback has filed a complaint. Read the last useful line first, then inspect the smallest piece of code that could produce it.'
    : context.chatHistory?.length
      ? hinglish
        ? 'PYTHONSURA: Haan, main follow kar raha hoon. Ek hi chhoti change kar aur phir run kar.'
        : 'PYTHONSURA: I am following you. Change one small thing, then run it again.'
      : hinglish
        ? `PYTHONSURA: Jo try kiya woh bata. ${context.topic} ko change karne se pehle bol ki tu expect kya kar raha hai.`
        : `PYTHONSURA: Show me what you tried. For ${context.topic}, tell me what you expect before changing the code.`;
  return { ok: true, text, source: 'local-fallback' };
}
export async function askMentor(
  context: MentorContext,
  provider?: MentorProvider,
): Promise<MentorReply> {
  if (!provider) return fallback(context);
  try {
    return { ok: true, text: await provider.ask(context), source: 'configured-provider' };
  } catch {
    return fallback(context);
  }
}
const localOllamaEndpoint = import.meta.env.DEV ? '/ollama/api' : 'http://127.0.0.1:11434/api';
export function createOllamaProvider(
  endpoint = localOllamaEndpoint,
  model = 'gemma4:latest',
): MentorProvider {
  return {
    async ask(context) {
      const hinglish = context.language === 'hinglish';
      const response = await fetch(`${endpoint.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          options: { temperature: 0.42 },
          messages: [
            {
              role: 'system',
              content: `You are PYTHONSURA, a technically accurate Python tutor with a JARVIS-like personality. Teach a complete beginner one concept at a time. The learner language is ${hinglish ? 'HINGLISH' : 'ENGLISH'}. Respond primarily in that language while keeping Python code and technical terminology accurate. Use context-aware playful roasting, occasional gaalis, memes/emojis and absurd developer humor. Mock the learner's current coding performance, never protected classes or inherent worth. React to the learner's actual last message, code and runtime result. Ask what they tried. Prefer the smallest useful next step. Do not dump a complete solution unless explicitly requested. Distinguish Python language semantics from CPython implementation details and label version-sensitive claims. Maintain continuity using the supplied chat history.`,
            },
            ...(context.chatHistory ?? []),
            { role: 'user', content: JSON.stringify({ ...context, chatHistory: undefined }) },
          ],
        }),
      });
      if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
      const payload = (await response.json()) as { message?: { content?: string } };
      const text = payload.message?.content?.trim();
      if (!text) throw new Error('Ollama returned no text');
      return text;
    },
  };
}
export function createOpenAICompatibleProvider(endpoint: string, model: string): MentorProvider {
  return {
    async ask(context) {
      const hinglish = context.language === 'hinglish';
      const response = await fetch(`${endpoint.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature: 0.42,
          messages: [
            {
              role: 'system',
              content: `You are PYTHONSURA, a technically accurate Python mentor. Respond primarily in ${hinglish ? 'Hinglish' : 'English'}. Ask what the learner tried, teach one concept at a time, roast the current coding mistake playfully, and give the smallest next step. Never attack protected classes or inherent worth. Maintain continuity.`,
            },
            ...(context.chatHistory ?? []),
            { role: 'user', content: JSON.stringify({ ...context, chatHistory: undefined }) },
          ],
        }),
      });
      if (!response.ok) throw new Error(`Mentor provider returned ${response.status}`);
      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = payload.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Mentor provider returned no text');
      return text;
    },
  };
}
