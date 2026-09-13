export const ACHIEVEMENTS = {
  FIRST_BLOOD: 'FIRST BLOOD',
  NO_HINTS: 'NO HINTS',
  BUG_SLAYER: 'BUG SLAYER',
  LOOP_SURVIVOR: 'LOOP SURVIVOR',
  FUNCTION_SUMMONER: 'FUNCTION SUMMONER',
  EXCEPTION_HANDLER: 'EXCEPTION HANDLER',
  BOSS_SLAYER: 'BOSS SLAYER',
  JIT_JUGGLER: 'JIT JUGGLER',
  MEMORY_MONSTER: 'MEMORY MONSTER',
  INTERVIEW_SURVIVOR: 'INTERVIEW SURVIVOR',
  PYTHON_OVERLORD: 'PYTHON OVERLORD',
} as const;
export function grantAchievement(achievements: string[], name: string) {
  return achievements.includes(name) ? achievements : [...achievements, name];
}
