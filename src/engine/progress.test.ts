import { describe, expect, it } from 'vitest';
import {
  claimBossReward,
  claimCodingReward,
  claimDebugReward,
  claimInterviewReward,
  claimLessonReward,
  completeLesson,
  createInitialProgress,
  recordAttempt,
  setBossPhase,
} from './progress';

describe('progress engine', () => {
  it('creates a valid fresh save state', () => {
    const progress = createInitialProgress();

    expect(progress.version).toBe(3);
    expect(progress.currentLessonId).toBe('l1_print');
    expect(progress.xp).toBe(0);
    expect(progress.unlockedBosses).toEqual(['loop-demon']);
    expect(progress.settings.reducedMotion).toBe(false);
  });

  it('records attempts and keeps mastery mirrored in the save state', () => {
    const progress = createInitialProgress();
    const next = recordAttempt(progress, 'l1_print', true, false, 1000);

    expect(next.attempts.l1_print).toMatchObject({
      attempts: 1,
      successes: 1,
      failures: 0,
      totalMs: 1000,
      mastery: 40,
      lastOutcome: 'success',
    });
    expect(next.mastery.l1_print).toBe(40);
    expect(next).not.toBe(progress);
  });

  it('completes a lesson without duplicating it', () => {
    const progress = createInitialProgress();
    const completed = completeLesson(progress, 'l1_print');
    const repeated = completeLesson(completed, 'l1_print');

    expect(completed.completedLessons).toEqual(['l1_print']);
    expect(completed.mastery.l1_print).toBe(100);
    expect(completed.attempts.l1_print.lastOutcome).toBe('success');
    expect(repeated).toBe(completed);
  });

  it('claims each lesson reward only once', () => {
    const progress = createInitialProgress();
    const rewarded = claimLessonReward(progress, 'l1_print', 25);
    const repeated = claimLessonReward(rewarded, 'l1_print', 25);

    expect(rewarded.lessonRewards).toEqual(['l1_print']);
    expect(rewarded.xp).toBe(25);
    expect(repeated).toBe(rewarded);
  });

  it('awards coding, debug, boss, and interview rewards without farming', () => {
    const progress = createInitialProgress();
    const coding = claimCodingReward(progress);
    const codingAgain = claimCodingReward(coding);
    const debug = claimDebugReward(codingAgain, 'mutable-default');
    const debugAgain = claimDebugReward(debug, 'mutable-default');
    const boss = claimBossReward(debugAgain, 'loop-demon', 100);
    const bossAgain = claimBossReward(boss, 'loop-demon', 100);
    const interview = claimInterviewReward(bossAgain);
    const interviewAgain = claimInterviewReward(interview);

    expect(coding.xp).toBe(20);
    expect(codingAgain).toBe(coding);
    expect(debug.debugRewards).toEqual(['mutable-default']);
    expect(debugAgain).toBe(debug);
    expect(boss.completedBosses).toEqual(['loop-demon']);
    expect(boss.achievements.length).toBeGreaterThan(debug.achievements.length);
    expect(bossAgain).toBe(boss);
    expect(interview.interview.rewarded).toBe(true);
    expect(interviewAgain).toBe(interview);
  });

  it('clamps boss phase progress at zero', () => {
    const progress = createInitialProgress();

    expect(setBossPhase(progress, 'loop-demon', -4).bossPhaseProgress['loop-demon']).toBe(0);
    expect(setBossPhase(progress, 'loop-demon', 2).bossPhaseProgress['loop-demon']).toBe(2);
  });
});
