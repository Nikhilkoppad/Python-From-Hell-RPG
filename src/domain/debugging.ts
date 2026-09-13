export type DebugCase = {
  id: string;
  title: string;
  layer: number;
  brief: string;
  bugType: string;
  brokenCode: string;
  successCheck: (stdout: string, source: string) => boolean;
  hint: string;
  method: string[];
};
export const debuggingCases: DebugCase[] = [
  {
    id: 'mutable-default',
    title: 'THE MUTABLE DEFAULT',
    layer: 5,
    brief: 'A default list remembers old calls.',
    bugType: 'STATE / ALIASING',
    brokenCode:
      'def add_item(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nprint(add_item("fire"))\nprint(add_item("brimstone"))',
    successCheck: (o, s) => o.trim() === "['fire']\n['brimstone']" && /bucket\s*=\s*None/.test(s),
    hint: 'Use None as the sentinel and create a fresh list inside the function.',
    method: [
      'Reproduce the behavior.',
      'Notice state survives across calls.',
      'Identify the mutable default.',
      'Make the smallest fix.',
      'Run again to verify isolation.',
    ],
  },
  {
    id: 'off-by-one',
    title: 'THE INDEX TRAP',
    layer: 3,
    brief: 'The loop reads one position too far.',
    bugType: 'BOUNDARY ERROR',
    brokenCode: 'values = [10, 20, 30]\nfor i in range(len(values) + 1):\n    print(values[i])',
    successCheck: (o) => o.trim() === '10\n20\n30',
    hint: 'Compare the loop boundary with the valid index range.',
    method: [
      'Reproduce the failure.',
      'Find the boundary expression.',
      'Check valid indexes.',
      'Adjust only the boundary.',
      'Run all iterations again.',
    ],
  },
  {
    id: 'shadowing',
    title: 'THE SHADOW BOX',
    layer: 5,
    brief: 'A local name hides a global binding.',
    bugType: 'SCOPE',
    brokenCode: 'count = 10\ndef add():\n    count += 1\n    return count\nprint(add())',
    successCheck: (o) => o.trim() === '11',
    hint: 'Decide whether the function should mutate the enclosing name or use a local value.',
    method: [
      'Read the exception.',
      'Locate the name assignment.',
      'Determine the intended scope.',
      'Use the narrowest correct fix.',
      'Verify the returned value.',
    ],
  },
  {
    id: 'wrong-condition',
    title: 'THE DOOR THAT NEVER OPENS',
    layer: 2,
    brief: 'A condition checks the opposite of the requirement.',
    bugType: 'LOGIC',
    brokenCode: 'hp = 10\nif hp < 0:\n    print("alive")\nelse:\n    print("dead")',
    successCheck: (o) => o.trim() === 'alive',
    hint: 'Translate the requirement into a boolean statement before editing the branch.',
    method: [
      'State the intended rule in plain language.',
      'Evaluate the current condition.',
      'Compare the actual branch to the requirement.',
      'Change one operator.',
      'Retest both outcomes.',
    ],
  },
  {
    id: 'wrong-type',
    title: 'THE TYPE IMPOSTOR',
    layer: 1,
    brief: 'Text is being used like a number.',
    bugType: 'TYPE ERROR',
    brokenCode: 'age = "42"\nprint(age + 8)',
    successCheck: (o) => o.trim() === '50',
    hint: 'The value from input-like text must be converted before numeric addition.',
    method: [
      'Read the exception type.',
      'Inspect the operand types.',
      'Convert at the boundary.',
      'Keep the rest of the expression simple.',
      'Verify the result.',
    ],
  },
  {
    id: 'missing-return',
    title: 'THE SILENT FUNCTION',
    layer: 5,
    brief: 'The function computes a value and then throws it away.',
    bugType: 'RETURN VALUE',
    brokenCode: 'def double(n):\n    n * 2\n\nprint(double(5))',
    successCheck: (o) => o.trim() === '10',
    hint: 'A computed expression is not automatically returned from a function.',
    method: [
      'Inspect what the caller receives.',
      'Find the expression.',
      'Ask where the value leaves the function.',
      'Return it explicitly.',
      'Test the caller.',
    ],
  },
  {
    id: 'bad-index',
    title: 'INDEX OUT OF HELL',
    layer: 4,
    brief: 'The program asks for an element outside the sequence.',
    bugType: 'INDEX ERROR',
    brokenCode: 'loot = ["key", "torch"]\nprint(loot[2])',
    successCheck: (o) => o.trim() === 'torch',
    hint: 'Count from zero and inspect the valid index range.',
    method: [
      'Read the exception.',
      'Count elements.',
      'Map the target item to an index.',
      'Use a valid index.',
      'Run again.',
    ],
  },
  {
    id: 'async-mistake',
    title: 'THE UNAWAITED GHOST',
    layer: 9,
    brief: 'A coroutine is created but its result is never awaited.',
    bugType: 'ASYNC',
    brokenCode:
      'import asyncio\nasync def work():\n    return "done"\n\nasync def main():\n    result = work()\n    print(result)\n\nasyncio.run(main())',
    successCheck: (o) => o.trim() === 'done',
    hint: 'A coroutine object is not the result. Await it inside the async function.',
    method: [
      'Inspect the printed value.',
      'Recognize the coroutine object.',
      'Find where execution should suspend.',
      'Add the smallest await.',
      'Run the event loop again.',
    ],
  },
];
