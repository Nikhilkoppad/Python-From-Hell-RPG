import {
  recordAttempt,
  type AttemptOutcome,
  type AdaptiveSignal,
  type MasteryRecord,
} from './adaptive';
import { XP_REWARDS } from './xp';

export type LessonRunInput = {
  lessonId: string;
  outcome: AttemptOutcome;
  elapsedMs: number;
  hintUsed: boolean;
};

export type LessonFlowResult = {
  mastery: Record<string, MasteryRecord>;
  signal: AdaptiveSignal;
  xpEarned: number;
};

export function processLessonAttempt(
  mastery: Record<string, MasteryRecord>,
  input: LessonRunInput,
): LessonFlowResult {
  const tracked = recordAttempt(
    mastery,
    input.lessonId,
    input.outcome,
    input.elapsedMs,
    input.hintUsed,
  );
  let xpEarned = 0;
  if (input.outcome === 'success') {
    xpEarned += XP_REWARDS.challenge;
    if (!input.hintUsed) xpEarned += XP_REWARDS.noHint;
  } else if (input.outcome === 'failure' || input.outcome === 'runtime-error') {
    xpEarned += XP_REWARDS.challenge > 10 ? 5 : 0;
  } else if (input.outcome === 'timeout') {
    xpEarned += 2;
  }
  return { ...tracked, xpEarned };
}
