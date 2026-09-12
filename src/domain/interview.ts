export type InterviewQuestion = {
  id: string;
  tier: 'fundamentals' | 'intermediate' | 'advanced' | 'runtime';
  prompt: string;
  expectedPoints: string[];
  followUp: string;
};

export const interviewQuestions: InterviewQuestion[] = [
  { id: 'i01', tier: 'fundamentals', prompt: 'What is the difference between == and is?', expectedPoints: ['== compares equality', 'is tests object identity'], followUp: 'Why can two equal objects be distinct objects?' },
  { id: 'i02', tier: 'intermediate', prompt: 'Why are mutable default arguments dangerous?', expectedPoints: ['default evaluated once at function definition', 'mutable state can persist across calls'], followUp: 'Show the None-sentinel pattern.' },
  { id: 'i03', tier: 'intermediate', prompt: 'What problem does a generator solve?', expectedPoints: ['lazy iteration', 'yields values over time', 'avoids materializing the full sequence'], followUp: 'What changes when next() is called?' },
  { id: 'i04', tier: 'advanced', prompt: 'How do decorators transform a function?', expectedPoints: ['callable receives another callable', 'returns a replacement/wrapper callable', 'binding occurs at definition time'], followUp: 'Why is functools.wraps useful?' },
  { id: 'i05', tier: 'advanced', prompt: 'What is the difference between method lookup and inheritance?', expectedPoints: ['inheritance supplies attributes through the hierarchy', 'method lookup follows MRO rules'], followUp: 'Why does Python use a method resolution order?' },
  { id: 'i06', tier: 'runtime', prompt: 'Why must advanced CPython claims be version-labelled?', expectedPoints: ['CPython is one implementation of Python', 'implementation details can change between releases', 'language specification and implementation behavior differ'], followUp: 'What source would you inspect before making a CPython internals claim?' },
];
