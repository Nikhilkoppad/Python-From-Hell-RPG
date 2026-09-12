# PYTHON FROM HELL RPG

A story-driven Python learning RPG, coding arena, debugging dungeon, interview simulator and developer-Hell experience.

## Current build

- HellGate onboarding
- Real multi-view command center/curriculum/lesson/coding/debugging/boss/interview/project flows
- Pyodide Web Worker Python execution with timeout protection
- Versioned local progress persistence
- XP, levels, mastery and rewards
- Responsive dark game HUD

## Run

`npm install`

`npm run dev`

## Runtime note

The first Python execution downloads Pyodide from its CDN. The worker isolates user code from the main UI and kills execution after five seconds. A later offline-packaging phase can bundle the runtime locally.
