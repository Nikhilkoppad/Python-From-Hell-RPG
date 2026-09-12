# PYTHON FROM HELL RPG

A story-driven Python learning RPG, browser coding IDE, debugging dungeon, boss gauntlet, interview arena, project factory, adaptive mentor, and developer-Hell experience.

## Current build

- HellGate onboarding with persistent resume state
- Command Center + 12-layer curriculum
- 70 data-driven lessons from Python basics to CPython internals
- Browser Python execution in a Web Worker using Pyodide
- Execution errors, stderr/stdout capture, timeout protection, and worker isolation
- Lesson challenges with required concepts and client-side private behavior harnesses
- Adaptive attempts: successes, failures, hint usage, elapsed time, mastery, remediation-oriented hint progression
- XP, levels, streaks, achievements, one-time activity rewards, and versioned local persistence
- Seven multi-phase bosses across major Hell layers
- Eight debugging dungeon cases with executable fix checks
- 30-question interview battle arena across fundamentals, advanced Python, and runtime topics
- Six project tracks from beginner CLI work to CPython runtime inspection
- PYTHONSURA AI mentor with optional OpenAI-compatible endpoint and deterministic offline fallback
- Functional settings for roast intensity, sound preference, reduced motion, and local-save reset
- Story signals, responsive layout, keyboard shortcuts, visible focus states, reduced-motion handling, and crash recovery

## Development

```text
npm install
npm run verify
npm run build
npm run dev
```

`npm run verify` checks that all 12 layers, the expected lesson depth, debugging cases, interview gauntlet, and active application wiring are present. GitHub Actions runs verification before the production build.

## Runtime targets

The browser execution layer uses the stable Pyodide 0.29.3 distribution and therefore runs CPython 3.14.2 in WebAssembly. The advanced curriculum separately studies CPython 3.13 implementation details and labels those claims as version-specific.

## AI mentor

Set `VITE_MENTOR_ENDPOINT` and optionally `VITE_MENTOR_MODEL` for an OpenAI-compatible `/chat/completions` endpoint. Without those variables, PYTHONSURA stays available through a deterministic local fallback, so the learning loop does not depend on an external AI service.

## Architecture

`src/domain` contains curriculum and experience data. `src/engine` contains progression, rewards, adaptive logic, challenges, streaks, and unlocks. `src/execution` isolates browser Python execution. `src/components` contains interactive workspaces. `src/ai` contains the provider-neutral mentor adapter.

The core loop is:

`STORY → LEARN → TRY → FAIL/SUCCEED → ROAST → EXPLAIN → RETRY → MASTER → XP → UNLOCK → NEW HELL`

## Important limitation

The challenge "private" tests run in the browser bundle, so they improve the learning experience but are not secure server-side hidden tests. A backend can be introduced later when truly tamper-resistant grading is required.
