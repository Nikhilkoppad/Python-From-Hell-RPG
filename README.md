# PYTHON FROM HELL RPG

A story-driven Python learning RPG, coding IDE, debugging dungeon, boss gauntlet, interview arena, project factory, and developer-Hell experience.

## What is working

- HellGate onboarding and persistent resume state
- Command Center + curriculum navigation across 12 Hell layers
- 70+ data-driven lessons spanning fundamentals through CPython internals
- Lesson workspace with browser-side Python execution in an isolated Web Worker
- Pyodide runtime errors and 5-second execution protection
- Executable lesson challenges with concept requirements and private behavior harnesses
- Adaptive attempt tracking: successes, failures, hints, time, mastery and remediation-oriented hints
- XP, levels, achievements, streaks, one-time project/boss rewards and local persistence
- Seven boss encounters with multi-phase progression
- 30-question interview gauntlet
- Six project tracks with milestone persistence
- Optional AI mentor through a generic OpenAI-compatible endpoint, with deterministic local fallback
- Error boundary so a UI crash can recover without silently destroying saved progress
- Responsive game HUD with reduced-motion foundations
- CPython implementation lessons explicitly separated from the browser runtime target
- Automated content verification in CI before the TypeScript/Vite build

## Run

`npm install`

`npm run verify`

`npm run dev`

`npm run build`

## Runtime targets

The browser execution layer uses Pyodide 314.0.6, the current stable Pyodide release, which packages CPython 3.14.2. Advanced implementation lessons separately target CPython 3.13 so version-sensitive internals are not presented as generic Python language guarantees.

## AI mentor

Set `VITE_MENTOR_ENDPOINT` and optionally `VITE_MENTOR_MODEL` to connect an OpenAI-compatible chat endpoint. Without those variables, PYTHONSURA uses a deterministic local fallback and the core learning flow remains usable.

## Architecture

`src/domain` contains curriculum/content schemas. `src/engine` contains progression, adaptive learning, rewards, challenges, streaks and unlock logic. `src/execution` isolates Python execution. `src/components` contains interactive workspaces. `src/ai` contains the provider-neutral mentor adapter.

GitHub Actions runs `npm run verify` and then `npm run build` on pushes and pull requests to `main`.
