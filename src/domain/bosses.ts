export type Boss = {
  id: string;
  layer: number;
  name: string;
  title: string;
  intro: string;
  phases: Array<{ name: string; objective: string; concept: string }>;
  rewardXp: number;
};

export const bosses: Boss[] = [
  { id: 'loop-demon', layer: 3, name: 'LOOP DEMON', title: 'There is no exit condition.', intro: 'Survive iteration, control flow, and nested loops.', phases: [
    { name: 'THE COUNT', objective: 'Use range() to produce the exact sequence.', concept: 'iteration' },
    { name: 'THE ESCAPE', objective: 'Stop at the correct moment without skipping valid work.', concept: 'break / continue' },
    { name: 'THE LABYRINTH', objective: 'Control a nested loop without duplicating output.', concept: 'nested loops' },
  ], rewardXp: 100 },
  { id: 'function-lord', layer: 5, name: 'FUNCTION LORD', title: 'Return with something useful.', intro: 'Parameters, defaults, scope, and closures are now weapons.', phases: [
    { name: 'THE CONTRACT', objective: 'Match parameters to arguments correctly.', concept: 'parameters' },
    { name: 'THE SCOPE', objective: 'Predict which binding a function resolves.', concept: 'scope' },
    { name: 'THE CLOSURE', objective: 'Preserve state without global variables.', concept: 'closures' },
  ], rewardXp: 100 },
  { id: 'memory-reaper', layer: 10, name: 'MEMORY REAPER', title: 'References never forget.', intro: 'Separate Python semantics from CPython implementation behavior.', phases: [
    { name: 'IDENTITY', objective: 'Distinguish identity from equality.', concept: 'is vs ==' },
    { name: 'LIFETIME', objective: 'Predict when an object can become unreachable.', concept: 'object lifetime' },
    { name: 'THE COLLECTOR', objective: 'Explain cyclic garbage collection without hand-waving.', concept: 'GC' },
  ], rewardXp: 150 },
  { id: 'cpython-core', layer: 12, name: 'CPYTHON CORE DEMON', title: 'Explain the machine beneath the language.', intro: 'Advanced runtime questions require exact version labels.', phases: [
    { name: 'BYTECODE', objective: 'Inspect bytecode and explain what it represents.', concept: 'dis / bytecode' },
    { name: 'OBJECTS', objective: 'Describe PyObject-level concepts without conflating them with the language spec.', concept: 'PyObject' },
    { name: 'RUNTIME', objective: 'Connect interpreter execution, memory, and concurrency concepts.', concept: 'runtime architecture' },
  ], rewardXp: 250 },
];

export function bossForLayer(layer: number): Boss | undefined {
  return bosses.find((boss) => boss.layer === layer);
}
