export type ChallengeKind = 'output' | 'function' | 'debug' | 'concept';

export type ChallengeTest = {
  id: string;
  description: string;
  code: string;
  expectedOutput: string;
};

export type Challenge = {
  id: string;
  lessonId: string;
  kind: ChallengeKind;
  title: string;
  prompt: string;
  starterCode: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  hints: string[];
  tests: ChallengeTest[];
};

export const entranceChallenges: Challenge[] = [
  {
    id: 'ch_print_hello',
    lessonId: 'l1_print',
    kind: 'output',
    title: 'THE FIRST INCANTATION',
    prompt: 'Make the runtime say exactly: hello, hell',
    starterCode: '# Your first spell\nprint(\"hello, hell\")',
    difficulty: 1,
    hints: ['The print() function sends text to stdout.', 'Keep the text inside quotes.', 'The required text is exactly: hello, hell'],
    tests: [{ id: 'basic-output', description: 'prints the target phrase', code: 'print("hello, hell")', expectedOutput: 'hello, hell' }],
  },
  {
    id: 'ch_variables',
    lessonId: 'l1_variables',
    kind: 'output',
    title: 'BIND A NAME TO POWER',
    prompt: 'Create a variable named soul and print it.',
    starterCode: '# Give the value a name\nsoul = 13\nprint(soul)',
    difficulty: 1,
    hints: ['Assignment binds a value to a name.', 'Use = for assignment.', 'The variable must be named soul.'],
    tests: [{ id: 'variable-output', description: 'prints the assigned value', code: 'soul = 13\nprint(soul)', expectedOutput: '13' }],
  },
  {
    id: 'ch_types',
    lessonId: 'l1_types',
    kind: 'output',
    title: 'NAME YOUR TYPE',
    prompt: 'Print the type name of the value 42.',
    starterCode: 'value = 42\nprint(type(value).__name__)',
    difficulty: 2,
    hints: ['type(x) tells you the runtime type of x.', 'A type object has a __name__ attribute.', 'For 42, the type name is int.'],
    tests: [{ id: 'type-output', description: 'prints the runtime type name', code: 'value = 42\nprint(type(value).__name__)', expectedOutput: 'int' }],
  },
];

export function getChallenge(id: string): Challenge | undefined {
  return entranceChallenges.find((challenge) => challenge.id === id);
}
