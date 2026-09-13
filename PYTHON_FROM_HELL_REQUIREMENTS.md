# PYTHON FROM HELL — PRODUCT CONTRACT

This file is the implementation contract for the Python From Hell RPG. Features are considered complete only when the user can actually use them; visual placeholders and click-only fake progress do not count.

## Core identity

Python From Hell is a story-driven Python learning RPG that combines a structured course, browser coding IDE, debugging dungeon, boss battles, interview simulator, project factory, adaptive learning, and a built-in local AI tutor.

The visual identity is premium game/Hell-themed UI: deep black, volcanic red, dark purple, burnt orange, sharp typography, subtle particles and restrained glow. Do not use generic cyberpunk polygons, rotating octagons, or unrelated decorative geometry.

## Progression

The curriculum contains 12 Hell layers, covering Python basics through advanced CPython/runtime topics. The curriculum must be data-driven and extensible.

Layer order:
1. Entrance
2. Condition Pit
3. Loop Abyss
4. Collection Graveyard
5. Function Forge
6. Object Crypt
7. Exception Hell
8. Runtime Hell
9. Concurrency
10. Memory Hell
11. Advanced CPython Deep Hell
12. The Core

The target content set is at least 70 lessons, 8 debugging cases, exactly 30 interview questions, exactly 7 bosses with 21 executable phases, and exactly 6 executable projects.

## Tutor-first lesson loop

Every lesson should feel like a tutor-led adventure rather than a static dashboard:

STORY → ASSESS → TEACH → TRY → FAIL/SUCCEED → ROAST/EXPLAIN → RETRY → MASTERY → XP → UNLOCK

At lesson entry, the tutor should present a short story/mission. A small diagnostic should establish the learner's starting point. Teaching should break the concept into beginner-friendly steps and a tiny example. The learner must then write and execute the challenge themselves. Failed attempts should trigger a roast plus technical explanation and a smaller next step. Successful attempts should continue to be checked until mastery is earned; a lucky single pass must not immediately unlock the lesson.

The tutor should be conversational and always available inside the lesson. It should accept natural-language questions, explain code and errors, teach incrementally, and use playful memes, emojis and occasional profanity while remaining technically accurate and non-discriminatory.

Lesson reward targets: lesson 20 XP, challenge 30 XP, no-hint 15 XP.

## Adaptive learning

Track attempts, successes, failures, hints used, elapsed time, last outcome and mastery. Mastery is stored as a 0–100 percentage in persistence. The adaptive engine may internally normalize to 0–1 but must convert consistently.

Repeated failures should increase support/remediation. Strong repeated success may increase difficulty. Hints are progressive and should not reveal the full answer by default.

## Runtime

Python execution must be isolated in a Web Worker. Required behaviors include stdout/stderr capture, syntax/runtime error reporting, timeout protection, cancellation, worker restart/termination safety, and clean UI state after cancellation.

The browser target is Pyodide/CPython and is separate from CPython implementation lessons.

## Boss battles

Every boss phase must contain executable Python code and must require a successful behavioral evaluation before the next phase can be entered. Phase progress must persist. Boss completion and XP must be protected against duplicate claiming.

Boss reward target: 100 XP.

## Debugging Dungeon

Provide executable broken programs with a behavioral success check. Cases must include bugs such as mutable defaults, off-by-one errors, shadowing, wrong conditions/types, missing returns, indexing and async mistakes.

Debug reward target: 40 XP, claimed once per case.

## Project Factory

Each project must have a real editor, executable starter code, validation requirements and contract tests. Completing a project must be based on a real test pass, not a checklist click.

Projects must cover beginner, intermediate and advanced work.

Project reward target: 150 XP for the standard contract; advanced projects may use a higher domain reward where explicitly defined.

## Interview Battle Arena

Exactly 30 questions should cover fundamentals through advanced Python, runtime behavior, debugging, performance and CPython implementation knowledge. The arena must preserve round and score state, calculate a rank, provide follow-up/explanation feedback, and award its completion reward only once.

Interview reward target: 50 XP.

## Achievements

Support the specified achievement set, including FIRST BLOOD, NO HINTS, BUG SLAYER, LOOP SURVIVOR, FUNCTION SUMMONER, EXCEPTION HANDLER, BOSS SLAYER, JIT JUGGLER, MEMORY MONSTER, INTERVIEW SURVIVOR and PYTHON OVERLORD.

Achievements should be granted by actual completed behavior rather than decorative buttons.

## Persistence

Persist current lesson, completed lessons, XP, level-derived state, achievements, streaks, mastery, attempts, settings, boss phase progress, boss completions, project progress, debug rewards, coding reward state and interview state.

Persistence is versioned and must migrate older save structures safely. Invalid data must fall back to a valid initial state.

## AI mentor

PYTHONSURA supports Comedy, Teacher, Battle and Senior Engineer modes. The built-in path should first use local Ollama when available, with a default local model configured for this project, and then fall back deterministically when no provider is reachable. The mentor receives lesson/challenge/code/error/mastery context and should encourage the learner to try a smaller step before giving a full solution.

## Advanced CPython accuracy

Advanced lessons must distinguish Python language semantics from CPython implementation details and label version-sensitive or experimental behavior honestly. Do not present implementation details as universal Python guarantees.

Current project targets:
- Lesson/reference target: CPython 3.13
- Browser execution target: Pyodide 314.x / CPython 3.14.x

## Accessibility and UX

Support keyboard navigation, visible focus, readable contrast, semantic controls, reduced motion and responsive layouts. Ctrl/Cmd+Enter should run code in coding workspaces where practical. Running workspaces should expose a stop action where execution can otherwise outlive the user's intent. Tutor motion and sound cues must respect the reduced-motion and sound settings.

## Release gate

Before declaring the project finished:

- `npm run verify` passes.
- `npm run build` passes.
- GitHub Actions passes on the latest main commit.
- Active entrypoint uses one implementation only.
- No fake interaction or dead active buttons remain.
- Rewards cannot be farmed by replaying a completed activity.
- Bosses, projects, lessons, debugging and interview flows all execute real logic.
- Tutor-first lesson flow is wired into the active lesson workspace.
- Built-in local AI path and deterministic fallback are wired.
- README matches the shipped architecture.
