# PYTHON FROM HELL RPG

A story-driven Python learning RPG, coding IDE, debugging dungeon, boss gauntlet, interview arena, project factory, and developer-Hell experience.

## What is working

- HellGate onboarding and persistent resume state
- Command Center + curriculum navigation across 12 Hell layers
- Lesson workspace with real browser-side Python execution
- Pyodide Web Worker isolation, runtime errors, and 5-second execution protection
- Data-driven lessons, challenges, boss phases, interview questions, projects, and story events
- Adaptive attempt tracking: successes, failures, hints, time, mastery, remediation-oriented hints
- XP, levels, achievements, streaks, one-time project/boss rewards, and local persistence
- Optional AI mentor through a generic OpenAI-compatible endpoint, with a local fallback when no provider is configured
- Error boundary so a UI crash can recover without silently destroying saved progress
- Responsive game HUD with reduced-motion friendly foundations
- CPython 3.13 implementation-focused lessons explicitly separated from the browser runtime target

## Run

`npm install`

`npm run dev`

`npm run build`

## Runtime targets

The browser execution layer uses the stable Pyodide 314.0.6 distribution, which packages CPython 3.14.2. Advanced implementation lessons separately target CPython 3.13 so version-sensitive internals are not presented as generic Python language guarantees.

## AI mentor

Set `VITE_MENTOR_ENDPOINT` and optionally `VITE_MENTOR_MODEL` to connect an OpenAI-compatible chat endpoint. Without those variables, PYTHONSURA uses a deterministic local fallback and the core learning flow remains usable.

## Architecture

`src/domain` contains curriculum/content schemas. `src/engine` contains progression, adaptive learning, rewards, challenges, streaks, and unlock logic. `src/execution` isolates Python execution. `src/components` contains the interactive workspaces. `src/ai` contains the provider-neutral mentor adapter.

A GitHub Actions workflow builds the project on pushes and pull requests to `main`.
