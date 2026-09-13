import { describe, expect, it } from 'vitest';
import { bosses } from '../domain/bosses';
import { evaluateBossPhase } from './bossRunner';
import type { PythonRunner } from '../execution/PythonRunner';

describe('boss runner', () => {
  const phase = bosses[0].phases[0];
  const runner: PythonRunner = {
    run: async () => ({ stdout: phase.expectedOutput, stderr: '', error: null }),
  } as PythonRunner;

  it('passes a boss phase when the visible result and required concepts are correct', async () => {
    const result = await evaluateBossPhase(phase, phase.starterCode, {
      stdout: phase.expectedOutput,
      stderr: '',
      error: null,
    }, runner);

    expect(result.passed).toBe(true);
    expect(result.reason).toContain('Challenge requirements satisfied');
  });

  it('rejects a boss phase when execution reports an error', async () => {
    const result = await evaluateBossPhase(phase, phase.starterCode, {
      stdout: '',
      stderr: 'boom',
      error: 'SyntaxError: invalid syntax',
    }, runner);

    expect(result.passed).toBe(false);
    expect(result.reason).toBe('SyntaxError: invalid syntax');
  });

  it('rejects source that misses a required boss concept', async () => {
    const result = await evaluateBossPhase(phase, 'print(1)', {
      stdout: phase.expectedOutput,
      stderr: '',
      error: null,
    }, runner);

    expect(result.passed).toBe(false);
    expect(result.reason).toContain('missing required concept');
  });
});
