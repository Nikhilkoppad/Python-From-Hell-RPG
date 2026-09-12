export type HellLayer = { id: string; number: number; name: string; tagline: string; status: 'available' | 'locked'; topics: string[] };

export const hellLayers: HellLayer[] = [
  { id: 'entrance', number: 1, name: 'THE ENTRANCE', tagline: 'Where innocent syntax comes to die.', status: 'available', topics: ['print()', 'variables', 'strings', 'numbers', 'booleans', 'input()', 'type conversion'] },
  { id: 'condition-pit', number: 2, name: 'THE CONDITION PIT', tagline: 'Every branch leads somewhere.', status: 'locked', topics: ['if', 'elif', 'else', 'comparisons', 'logic', 'nested conditions'] },
  { id: 'loop-abyss', number: 3, name: 'THE LOOP ABYSS', tagline: 'There is no escape. Only iteration.', status: 'locked', topics: ['for', 'while', 'range', 'break', 'continue', 'nested loops'] },
  { id: 'collection-graveyard', number: 4, name: 'COLLECTION GRAVEYARD', tagline: 'Where indexes go to get out of range.', status: 'locked', topics: ['lists', 'tuples', 'sets', 'dictionaries', 'slicing'] },
  { id: 'function-forge', number: 5, name: 'FUNCTION FORGE', tagline: 'Parameters. Scope. Consequences.', status: 'locked', topics: ['functions', 'arguments', 'return', 'scope', 'closures'] },
  { id: 'object-crypt', number: 6, name: 'OBJECT CRYPT', tagline: 'Everything is an object. Good luck.', status: 'locked', topics: ['classes', 'objects', 'inheritance', 'polymorphism', 'encapsulation'] },
  { id: 'exception-hell', number: 7, name: 'EXCEPTION HELL', tagline: 'The traceback knows what you did.', status: 'locked', topics: ['exceptions', 'try', 'except', 'finally', 'raise', 'debugging'] },
  { id: 'runtime-hell', number: 8, name: 'PYTHON RUNTIME', tagline: 'Now the language starts showing its teeth.', status: 'locked', topics: ['iterators', 'generators', 'decorators', 'context managers', 'imports', 'MRO'] },
  { id: 'concurrency', number: 9, name: 'CONCURRENCY', tagline: 'Two threads. Three bugs. One headache.', status: 'locked', topics: ['threads', 'processes', 'locks', 'races', 'asyncio'] },
  { id: 'memory', number: 10, name: 'MEMORY HELL', tagline: 'References have consequences.', status: 'locked', topics: ['identity', 'equality', 'reference counting', 'GC', 'object lifetime'] },
  { id: 'cpython', number: 11, name: 'CPYTHON DEEP HELL', tagline: 'Implementation details. Finally.', status: 'locked', topics: ['bytecode', 'dis', 'PyObject', 'allocators', 'interpreter internals'] },
  { id: 'core', number: 12, name: 'THE CORE', tagline: 'Explain the runtime. Survive the interview.', status: 'locked', topics: ['free-threading', 'JIT concepts', 'performance', 'C extensions', 'runtime architecture'] },
];
