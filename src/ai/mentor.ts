export type MentorMode = 'comedy' | 'teacher' | 'battle' | 'senior-engineer';

export type MentorContext = {
  mode: MentorMode;
  lessonTitle: string;
  topic: string;
  userCode: string;
  output: string;
  mastery: number;
  recentMistakes: string[];
};

export type MentorReply = {
  ok: boolean;
  text: string;
  source: 'configured-provider' | 'local-fallback';
};

export interface MentorProvider {
  ask(context: MentorContext): Promise<string>;
}

function fallback(context: MentorContext): MentorReply {
  const hasError = /error|traceback|exception/i.test(context.output);
  const text = hasError
    ? `${context.mode === 'comedy' ? 'PYTHONSURA: The traceback has filed a complaint.' : 'PYTHONSURA:'} Read the last useful line of the error first. Then inspect the smallest piece of your code that could produce it.`
    : `PYTHONSURA: Show me what you tried. For ${context.topic}, explain what you expect this code to do before changing it.`;
  return { ok: true, text, source: 'local-fallback' };
}

export async function askMentor(context: MentorContext, provider?: MentorProvider): Promise<MentorReply> {
  if (!provider) return fallback(context);
  try {
    const text = await provider.ask(context);
    return { ok: true, text, source: 'configured-provider' };
  } catch {
    return fallback(context);
  }
}

export function createOpenAICompatibleProvider(endpoint: string, model: string): MentorProvider {
  return {
    async ask(context) {
      const response = await fetch(`${endpoint.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          messages: [
            { role: 'system', content: 'You are PYTHONSURA, a technically accurate Python mentor. Do not invent Python or CPython behavior. Ask what the learner tried, then give the smallest useful hint unless a full solution is explicitly requested.' },
            { role: 'user', content: JSON.stringify(context) },
          ],
        }),
      });
      if (!response.ok) throw new Error(`Mentor provider returned ${response.status}`);
      const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = payload.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Mentor provider returned no text');
      return text;
    },
  };
}
