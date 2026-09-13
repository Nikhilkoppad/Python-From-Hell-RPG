# PYTHON FROM HELL RPG

A story-driven Python learning RPG, browser coding IDE, debugging dungeon, boss gauntlet, interview arena, project factory, adaptive tutor, and developer-Hell experience.

## Current build

- HellGate onboarding with persistent resume state and a real fresh-start reset path
- Command Center + 12-layer curriculum with story signals and adventure progression
- 70 data-driven lessons from Python basics to CPython internals
- Immersive full-screen lesson theatre: STORY → DIAGNOSTIC → TEACH → WRITE → RUN → REACT → EXPLAIN → RETRY → MASTER
- PYTHONSURA is the centre of the lesson rather than a side widget: animated teacher avatar, speech-bubble teaching, micro-lessons, demonstrations, direct missions and repeated mastery gates
- Living classroom disturbances: meme drops, fake incident reports, code-review alerts, escaped-variable warnings, traceback graves, senior-engineer calls and other harmless interruptions
- PYTHONSURA reactions include playful profanity, memes/emojis, mocking bad code and contextual roasts controlled by the roast-intensity setting
- Tutor voice uses the browser speech engine when enabled; voice is additive and the full course remains usable without it
- Motion for React drives teacher entrances, lesson-stage transitions, chat bubbles, disturbances and interaction feedback with reduced-motion support
- Live tutor conversation stays inside the lesson and sends the learner's actual code, runtime output, mastery, mistakes and conversation history to the mentor
- Built-in local Ollama mentor path uses the Vite development proxy at `/ollama/api` and `gemma4:latest`, with a deterministic fallback when Ollama is unavailable
- Tutor modes: Teacher, Comedy, Battle and Senior Engineer
- Progressive hints remain optional and never replace the learning loop with answer dumping
- Every lesson begins with a short story/diagnostic and requires repeated successful behavior checks before mastery unlocks the next lesson
- Browser Python execution in a Web Worker using Pyodide, with a warm worker between sequential runs and automatic teardown on timeout/cancellation
- Execution errors, stderr/stdout capture, timeout protection, cancellation, and worker isolation
- Lesson challenges with required concepts and client-side private behavior harnesses
- Adaptive attempts: successes, failures, timeout/runtime-error classification, hint usage, elapsed time, mastery, remediation-oriented hint progression, and persisted mastery signals
- Lesson draft autosave per lesson so unfinished code survives navigation and refresh
- XP, levels, streaks, achievements, one-time activity rewards, sound effects, motion cues, and versioned local persistence
- Portable v3 save export/import with validation, plus local-save reset
- Seven multi-phase bosses with executable coding gates and persisted phase progress
- Eight debugging dungeon cases with executable fix checks
- 30-question interview battle arena with full rank ladder, explanation/follow-up retry flow, and targeted code tasks
- The Core finale unlocks a dedicated runtime-access cinematic after the final boss is cleared
- Six executable project tracks with contract tests, persistent started/completed state, and one-time completion rewards
- Redundant cosmetic telemetry HUD removed from the active experience so the lesson remains focused on learning
- Responsive desktop/tablet/mobile navigation, keyboard shortcuts, visible focus states, reduced-motion handling, and crash recovery

## Design system

`design-system/MASTER.md` is the visual and interaction source of truth. It applies public UI/UX Pro Max design-intelligence principles to this product while deliberately keeping Python From Hell's own identity. The lesson experience is intentionally living-classroom-first instead of dashboard-first.

## Development

```text
npm install
npm run verify
npm run build
npm run dev
```

`npm run verify` checks all 12 layers, lesson depth, debugging cases, interview questions, executable boss coverage, project contracts, runtime cancellation, adaptive learning wiring, tutor-first lesson gates, lesson drafts, accessibility feedback, save portability, mobile navigation, the single active application entrypoint, local AI wiring, Motion/tutor contracts, disturbance/voice contracts, and other anti-regression rules. GitHub Actions runs verification before the production build.

## Runtime targets

The browser execution layer uses Pyodide 314.0.6 and therefore runs CPython 3.14.2 in WebAssembly. The advanced curriculum separately studies CPython 3.13 implementation details and labels those claims as version-specific.

## AI mentor

PYTHONSURA first tries the built-in local Ollama API through the Vite development proxy at `/ollama/api/chat` using `gemma4:latest`. The tutor sends the ongoing conversation history plus the current code/error/mastery context so replies can be conversational instead of stateless. A deterministic local fallback remains available whenever Ollama is offline. An optional `VITE_MENTOR_ENDPOINT` + `VITE_MENTOR_MODEL` can override the built-in local provider with an OpenAI-compatible service.

## Design research

The public UI/UX Pro Max project is used as design research rather than a runtime dependency. Its public skill documents design-system generation, style matching, UX guidelines, React-oriented stacks, and pre-delivery review. This project keeps its own art direction, interaction rules and information hierarchy. Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.

## Architecture

`src/domain` contains curriculum and experience data. `src/engine` contains progression, rewards, adaptive logic, challenges, streaks, unlocks and audio. `src/execution` isolates browser Python execution. `src/components` contains interactive workspaces, including the tutor-driven lesson theatre and interview battle arena. `src/ai` contains the provider-neutral mentor adapter. Root-level UI polish styles are imported by `src/main.tsx`.

Motion for React is installed from the open-source `motion` package and imported through `motion/react`.

The core loop is:

`STORY → DIAGNOSTIC → TEACH → WRITE → RUN → REACT → EXPLAIN → RETRY → MASTER → XP → UNLOCK → NEW HELL`

## Important limitation

The challenge "private" tests run in the browser bundle, so they improve the learning experience but are not secure server-side hidden tests. A backend can be introduced later when truly tamper-resistant grading is required.
