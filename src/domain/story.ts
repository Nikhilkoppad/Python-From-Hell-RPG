export type StoryEvent = {
  id: string;
  trigger: 'enter' | 'layer-unlock' | 'lesson-complete' | 'boss' | 'interview' | 'core';
  title: string;
  speaker: 'PYTHONSURA' | 'SYSTEM' | 'INTERVIEWER';
  lines: string[];
};

export const storyEvents: StoryEvent[] = [
  {
    id: 'gate-open', trigger: 'enter', title: 'THE DESCENT BEGINS', speaker: 'PYTHONSURA',
    lines: ['You wanted practical Python. Adorable.', 'Start small. Survive the first traceback.'],
  },
  {
    id: 'first-blood', trigger: 'lesson-complete', title: 'FIRST BLOOD', speaker: 'SYSTEM',
    lines: ['Lesson cleared.', 'Knowledge acquired. Confidence remains dangerously high.'],
  },
  {
    id: 'layer-two', trigger: 'layer-unlock', title: 'THE CONDITION PIT OPENS', speaker: 'PYTHONSURA',
    lines: ['Congratulations. You have discovered that computers can choose.', 'They can also choose wrong.'],
  },
  {
    id: 'interview-gate', trigger: 'interview', title: 'WELCOME TO THE COLISEUM', speaker: 'INTERVIEWER',
    lines: ['Your résumé has entered the arena.', 'Your first answer decides whether I keep reading.'],
  },
  {
    id: 'the-core', trigger: 'core', title: 'THE CORE IS AWAKE', speaker: 'PYTHONSURA',
    lines: ['The language was the tutorial.', 'Now you meet the implementation.'],
  },
];

export function storyEventFor(trigger: StoryEvent['trigger'], id?: string): StoryEvent | undefined {
  return storyEvents.find((event) => event.trigger === trigger && (!id || event.id === id))
    ?? storyEvents.find((event) => event.trigger === trigger);
}
