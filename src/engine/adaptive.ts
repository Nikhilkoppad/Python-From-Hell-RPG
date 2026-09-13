export type AttemptOutcome = 'success' | 'failure' | 'hint' | 'timeout' | 'runtime-error';
export type MasteryRecord = {
  attempts: number;
  successes: number;
  failures: number;
  hintsUsed: number;
  totalMs: number;
  lastOutcome: AttemptOutcome | null;
  mastery: number;
};
export type AdaptiveSignal = {
  mastery: number;
  difficultyDelta: -1 | 0 | 1;
  remediation: boolean;
  message: string;
};
const empty = (): MasteryRecord => ({
  attempts: 0,
  successes: 0,
  failures: 0,
  hintsUsed: 0,
  totalMs: 0,
  lastOutcome: null,
  mastery: 0,
});
export function readMastery(map: Record<string, MasteryRecord>, lessonId: string) {
  return map[lessonId] ? { ...empty(), ...map[lessonId] } : empty();
}
export function signalFor(record: MasteryRecord): AdaptiveSignal {
  const remediation = record.mastery < 45 && record.attempts >= 2;
  const difficultyDelta: -1 | 0 | 1 = remediation
    ? -1
    : record.mastery > 82 && record.attempts >= 2
      ? 1
      : 0;
  const message = remediation
    ? 'The pit is repeating this skill with a smaller challenge.'
    : difficultyDelta === 1
      ? 'Mastery is rising. The engine is increasing the pressure.'
      : record.lastOutcome === 'success'
        ? 'Concept registered. Keep going before the traceback gets ideas.'
        : record.lastOutcome === 'timeout'
          ? 'The runtime timed out. Shrink the search space, then try again.'
          : record.lastOutcome === 'runtime-error'
            ? 'Runtime failure recorded. Read the traceback before changing more code.'
            : 'Failure recorded. Study the error, then attack it again.';
  return { mastery: record.mastery, difficultyDelta, remediation, message };
}
export function recordAttempt(
  map: Record<string, MasteryRecord>,
  lessonId: string,
  outcome: AttemptOutcome,
  elapsedMs: number,
  hintUsed = false,
): { mastery: Record<string, MasteryRecord>; signal: AdaptiveSignal } {
  const current = readMastery(map, lessonId);
  const next = {
    ...current,
    attempts: current.attempts + 1,
    successes: current.successes + (outcome === 'success' ? 1 : 0),
    failures: current.failures + (outcome === 'success' ? 0 : 1),
    hintsUsed: current.hintsUsed + (hintUsed ? 1 : 0),
    totalMs: current.totalMs + Math.max(0, elapsedMs),
    lastOutcome: outcome,
  };
  const accuracy = next.successes / next.attempts;
  const cleanRunBonus = hintUsed ? 0 : outcome === 'success' ? 12 : 0;
  const hintPenalty = hintUsed ? 4 : 0;
  const failurePenalty = outcome === 'success' ? 0 : 10;
  const nextMastery = Math.max(
    0,
    Math.min(
      100,
      current.mastery * 0.72 + accuracy * 28 + cleanRunBonus - hintPenalty - failurePenalty,
    ),
  );
  next.mastery = Number(nextMastery.toFixed(1));
  return { mastery: { ...map, [lessonId]: next }, signal: signalFor(next) };
}
export function recommendedHintIndex(record: MasteryRecord, hintCount: number) {
  if (hintCount <= 1) return 0;
  if (record.failures >= 3) return Math.min(2, hintCount - 1);
  if (record.failures >= 1) return Math.min(1, hintCount - 1);
  return 0;
}
export function masteryPercent(record: MasteryRecord) {
  return Math.round(record.mastery);
}
