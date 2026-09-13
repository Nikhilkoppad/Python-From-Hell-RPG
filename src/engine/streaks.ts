export type StreakState = { current: number; longest: number; lastActiveDate: string | null };
export function todayKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function dayNumber(key: string): number {
  return Date.parse(`${key}T00:00:00Z`);
}
export function touchStreak(state: StreakState, now = new Date()): StreakState {
  const today = todayKey(now);
  if (state.lastActiveDate === today) return state;
  if (!state.lastActiveDate)
    return { current: 1, longest: Math.max(1, state.longest), lastActiveDate: today };
  const deltaDays = Math.round((dayNumber(today) - dayNumber(state.lastActiveDate)) / 86400000);
  const current = deltaDays === 1 ? state.current + 1 : 1;
  return { current, longest: Math.max(state.longest, current), lastActiveDate: today };
}
export function updateStreak<
  T extends { streak: number; longestStreak: number; lastActiveDate: string | null },
>(state: T, now = new Date()): T {
  const next = touchStreak(
    { current: state.streak, longest: state.longestStreak, lastActiveDate: state.lastActiveDate },
    now,
  );
  return {
    ...state,
    streak: next.current,
    longestStreak: next.longest,
    lastActiveDate: next.lastActiveDate,
  };
}
export function streakBonus(current: number): number {
  if (current >= 30) return 30;
  if (current >= 14) return 20;
  if (current >= 7) return 15;
  if (current >= 3) return 10;
  return current > 1 ? 5 : 0;
}
