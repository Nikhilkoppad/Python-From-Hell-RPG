# PYTHON FROM HELL RPG

A story-driven Python survival RPG where the learner wakes in Hell, meets the Python demon Pythonsura, enters a dungeon, learns under pressure, writes real code, survives mistakes, and earns the next gate through mastery.

## The experience

The product is intentionally **a game with a learning system**, not a generic education dashboard.

### HellGate opening

First launch is a cinematic sequence:

`DARKNESS → HELL SOUNDS → GROUND SHAKE → PYTHONSURA ARRIVES → ONE CHANCE TO ESCAPE → GIANT MOUTH PORTAL → MINI-PYTHONSURA GUIDE → LANGUAGE CHOICE → DUNGEON`

Pythonsura establishes the story and personality before teaching begins. The learner chooses **English** or **Hinglish**; that choice persists and controls Pythonsura's narrative dialogue, roasts and mentor conversation while technical Python teaching remains accurate.

Motion is purposeful: the ground shakes when Pythonsura arrives, the mouth/portal opens for dungeon entry, scene transitions mark story beats, and reduced-motion support disables non-essential motion.

## Living Classroom

Inside a lesson, the entire screen becomes Pythonsura's classroom.

`STORY → DIAGNOSTIC → MICRO-TEACH → DOUBT CHECK → ADAPTIVE RE-TEACH → PROGRESSIVE TRIAL → REAL EXECUTION → REACTION → ROAST → EXPLAIN → RETRY → MASTERY → GATE`

Pythonsura is the instructor, not a chatbot card beside the content. The learner can ask natural-language questions at any point, see demonstrations, choose a different teaching strategy, use progressive hints, and talk back to the tutor.

### Pythonsura teaching modes

- Teacher
- Comedy
- Battle
- Senior Engineer

The tutor can teach with simple explanations, analogies, visual flows, code walkthroughs and interactive practice. After repeated confusion, the learner is redirected into remediation instead of being pushed into harder content.

## Reactions and disturbances

The dungeon is deliberately alive without becoming visual noise. Compact contextual interruptions include Python Police, Senior Calls, Code Review alerts, Traceback Funerals, Meme Transmissions, Brain Cell alerts, Variable Riots and Snake Fact Checks.

Roasts are tied to the current coding event or mistake. The comedy can include playful profanity and Indian-style Hinglish, while avoiding attacks on protected classes or the learner's inherent worth. A roast should lead into a useful explanation or next action.

## Progressive challenge gauntlet

Every lesson exposes a **20-step mastery opportunity ladder** covering recognition, prediction, memory, tracing, repair, variation, edge cases, debugging, transfer, interview reasoning, production thinking, refactoring, teaching-back and final proof.

The current implementation uses those 20 stages to progressively frame and stress the lesson's real executable challenge. A future version can add distinct per-stage validators where more granular grading is valuable.

A single lucky pass never unlocks a lesson. Repeated successful behavioral proofs are required before progression.

## Runtime

Browser Python execution runs in a Web Worker using Pyodide, with stdout/stderr capture, syntax/runtime errors, timeout protection, cancellation and worker isolation. The worker stays warm across ordinary sequential executions and is terminated on cancellation/timeout.

## Curriculum

- 12 Hell layers
- 70 data-driven lessons
- 8+ debugging cases
- 30-question Interview Battle Arena
- 7 bosses with 21 executable phases
- 6 executable projects

The curriculum moves from Python basics through control flow, collections, functions, objects, exceptions, runtime behavior, concurrency, memory, advanced CPython and The Core.

## Adaptive learning

Attempts, successes, failures, hints, elapsed time, last outcome and mastery are persisted. Repeated failure increases support and remediation; strong repeated success can increase difficulty. Lesson drafts survive navigation and refresh.

## AI mentor

Pythonsura first uses the local Ollama path through the Vite development proxy:

`/ollama/api/chat` → `gemma4:latest`

The tutor receives the learner's lesson, topic, code, runtime output, mastery, recent mistakes and conversation history. When local AI is unavailable, a deterministic local fallback keeps the teaching loop usable.

## Persistence and progression

The app persists lessons, mastery, attempts, XP, streaks, achievements, boss progress, projects, interview state, settings, language choice and HellGate completion. Save export/import supports portable v3 saves with validation.

## Visual direction

Deep black, volcanic red/orange, restrained bruised-purple depth, strong story typography and compact monospace system labels. Dungeon texture comes from lighting, smoke-like gradients, cracks, portals and purposeful motion.

Deliberately avoided: generic cyberpunk polygons, rotating octagons, random geometric decoration, fake telemetry, excessive particles, dashboard clutter and unexplained futuristic widgets.

## Design system

`design-system/MASTER.md` is the visual/interaction source of truth. It uses design-intelligence principles associated with UI/UX Pro Max while keeping Python From Hell's own identity, narrative rules and hierarchy. Motion for React is installed from the open-source `motion` package and imported through `motion/react`.

## Development

```text
npm install
npm run verify
npm run build
npm run dev
```

`npm run verify` checks content coverage, the story-first HellGate, bilingual tutor propagation, the living classroom, 20-step gauntlet, local AI wiring, real runtime controls, adaptive learning, save portability, accessibility, interview/boss/project contracts and anti-regression rules. GitHub Actions runs verification before the production build.

## Important limitation

The challenge "private" tests run in the browser bundle, so they improve the learning experience but are not secure server-side hidden tests. A backend can be introduced later when truly tamper-resistant grading is required.
