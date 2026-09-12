import type { Challenge, ChallengeTest } from '../domain/challenges';

export type ChallengeRun = {
  stdout: string;
  stderr: string;
  error: string | null;
};

export type EvaluationResult = {
  passed: boolean;
  passedTests: number;
  totalTests: number;
  feedback: string;
};

function normalize(value: string): string {
  return value.replace(/\r\n/g, '\n').trim();
}

export function evaluateOutput(challenge: Challenge, run: ChallengeRun): EvaluationResult {
  if (run.error) {
    return {
      passed: false,
      passedTests: 0,
      totalTests: challenge.tests.length,
      feedback: `Runtime error: ${run.error}`,
    };
  }
  const expected = challenge.tests[0]?.expectedOutput ?? '';
  const passed = normalize(run.stdout) === normalize(expected);
  return {
    passed,
    passedTests: passed ? 1 : 0,
    totalTests: challenge.tests.length,
    feedback: passed
      ? 'Clean execution. The runtime obeyed your command.'
      : `Output mismatch. Expected ${JSON.stringify(expected)} but received ${JSON.stringify(normalize(run.stdout))}.`,
  };
}

export function buildVisibleTest(test: ChallengeTest): string {
  return `# ${test.description}\n${test.code}`;
}
