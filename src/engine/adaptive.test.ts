import { describe, expect, it } from 'vitest';
import {
  masteryPercent,
  readMastery,
  recordAttempt,
  recommendedHintIndex,
  signalFor,
  type MasteryRecord,
} from './adaptive';

const fresh: MasteryRecord = {
  attempts: 0,
  successes: 0,
  failures: 0,
  hintsUsed: 0,
  totalMs: 0,
  lastOutcome: null,
  mastery: 0,
};

describe('adaptive engine', () => {
  it('creates a fresh mastery record for an unknown lesson', () => {
    expect(readMastery({}, 'lesson-1')).toEqual(fresh);
  });

  it('rewards clean success and keeps mastery bounded', () => {
    const result = recordAttempt({}, 'lesson-1', 'success', 1000);
    expect(result.mastery['lesson-1'].mastery).toBe(40);
    expect(result.mastery['lesson-1'].successes).toBe(1);
    expect(result.mastery['lesson-1'].failures).toBe(0);
    expect(result.mastery['lesson-1'].totalMs).toBe(1000);
  });

  it('penalizes failure and records the correct outcome', () => {
    const afterSuccess = recordAttempt({}, 'lesson-1', 'success', 1000);
    const result = recordAttempt(afterSuccess.mastery, 'lesson-1', 'failure', 2000);
    expect(result.mastery['lesson-1'].lastOutcome).toBe('failure');
    expect(result.mastery['lesson-1'].failures).toBe(1);
    expect(result.mastery['lesson-1'].mastery).toBe(32.8);
  });

  it('tracks hints and applies a hint penalty', () => {
    const result = recordAttempt({}, 'lesson-1', 'success', 1000, true);
    expect(result.mastery['lesson-1'].mastery).toBe(24);
    expect(result.mastery['lesson-1'].hintsUsed).toBe(1);
  });

  it('requests remediation after repeated low mastery', () => {
    const record = { ...fresh, attempts: 2, mastery: 30, lastOutcome: 'failure' as const };
    expect(signalFor(record).remediation).toBe(true);
    expect(signalFor(record).difficultyDelta).toBe(-1);
  });

  it('raises difficulty only after repeated high mastery', () => {
    const record = { ...fresh, attempts: 2, mastery: 90, lastOutcome: 'success' as const };
    expect(signalFor(record).difficultyDelta).toBe(1);
  });

  it('selects deeper hints as failures accumulate', () => {
    expect(recommendedHintIndex({ ...fresh, failures: 0 }, 3)).toBe(0);
    expect(recommendedHintIndex({ ...fresh, failures: 1 }, 3)).toBe(1);
    expect(recommendedHintIndex({ ...fresh, failures: 3 }, 3)).toBe(2);
  });

  it('rounds mastery for presentation', () => {
    expect(masteryPercent({ ...fresh, mastery: 87.6 })).toBe(88);
  });
});
