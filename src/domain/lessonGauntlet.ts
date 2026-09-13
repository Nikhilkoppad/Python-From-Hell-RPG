export type GauntletStep = { id: number; tier: string; name: string; prompt: string };
export const LESSON_GAUNTLET: GauntletStep[] = [
  {
    id: 1,
    tier: 'RECOGNIZE',
    name: 'SPOT THE IDEA',
    prompt: 'Point your brain at the concept. What is Python being asked to do?',
  },
  {
    id: 2,
    tier: 'PREDICT',
    name: 'PREDICT THE RESULT',
    prompt: 'Before running anything, predict what the next code should do.',
  },
  {
    id: 3,
    tier: 'COPY NOTHING',
    name: 'WRITE FROM MEMORY',
    prompt: 'Close the explanation and write the smallest spell you can remember.',
  },
  {
    id: 4,
    tier: 'TRACE',
    name: 'TRACE ONE LINE',
    prompt: 'Choose one line and explain what changes because of it.',
  },
  {
    id: 5,
    tier: 'REPAIR',
    name: 'FIX THE BROKEN SPELL',
    prompt: 'Expect one mistake. Find it before the runtime has to yell.',
  },
  {
    id: 6,
    tier: 'VARIATION',
    name: 'CHANGE ONE THING',
    prompt: 'Change one value or condition and predict the new behavior.',
  },
  {
    id: 7,
    tier: 'WHY',
    name: 'DEFEND THE CHOICE',
    prompt: 'Explain why your chosen Python construct fits this job.',
  },
  {
    id: 8,
    tier: 'EDGE',
    name: 'EDGE CASE',
    prompt: 'What happens at the boundary, empty case, zero case, or missing input?',
  },
  {
    id: 9,
    tier: 'DEBUG',
    name: 'READ THE EVIDENCE',
    prompt: 'Use the runtime result as evidence. Do not guess what failed.',
  },
  {
    id: 10,
    tier: 'REBUILD',
    name: 'REBUILD SMALLER',
    prompt: 'Delete unnecessary code and keep only the part that proves the concept.',
  },
  {
    id: 11,
    tier: 'TRANSFER',
    name: 'NEW EXAMPLE',
    prompt: 'Apply the same idea to a different tiny example.',
  },
  {
    id: 12,
    tier: 'OUTPUT',
    name: 'PREDICT THEN RUN',
    prompt: 'Write your expected output first. Then execute and compare.',
  },
  {
    id: 13,
    tier: 'BUG HUNT',
    name: 'MAKE A CONTROLLED BUG',
    prompt: 'Intentionally break the concept, observe the failure, then repair it.',
  },
  {
    id: 14,
    tier: 'COMPOSE',
    name: 'PAIR TWO IDEAS',
    prompt: 'Use this concept with one earlier Python idea without losing clarity.',
  },
  {
    id: 15,
    tier: 'REASON',
    name: 'EXPLAIN THE MACHINE',
    prompt: 'Describe what Python must know or do internally for your code to work.',
  },
  {
    id: 16,
    tier: 'INTERVIEW',
    name: 'ANSWER UNDER PRESSURE',
    prompt: 'Give the one-sentence interview explanation before touching the keyboard.',
  },
  {
    id: 17,
    tier: 'REAL WORLD',
    name: 'PRODUCTION SCENARIO',
    prompt: 'Imagine this code is in production. What failure or misuse would you guard against?',
  },
  {
    id: 18,
    tier: 'REFACTOR',
    name: 'MAKE IT CLEARER',
    prompt: 'Improve readability without changing the behavior you are proving.',
  },
  {
    id: 19,
    tier: 'MASTER',
    name: 'TEACH IT BACK',
    prompt: 'Explain the concept as if you were teaching a beginner who knows nothing.',
  },
  {
    id: 20,
    tier: 'GATE',
    name: 'FINAL PROOF',
    prompt: 'One clean, independent execution. Prove you own the concept instead of borrowing it.',
  },
];
export const GAUNTLET_SIZE = LESSON_GAUNTLET.length;
export function gauntletStepForAttempts(attempts: number) {
  return LESSON_GAUNTLET[Math.min(Math.max(attempts, 0), LESSON_GAUNTLET.length - 1)];
}
