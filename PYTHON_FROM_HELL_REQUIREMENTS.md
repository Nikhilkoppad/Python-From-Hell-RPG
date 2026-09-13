# PYTHON FROM HELL — PRODUCT CONTRACT

This file is the implementation contract for the Python From Hell RPG. Features are complete only when the learner can actually use them. Visual placeholders, click-only progress and generic dashboard filler do not count.

## Core identity

Python From Hell is a story-driven Python survival RPG. The learner wakes in Hell, is confronted by the Python demon Pythonsura, enters a Python dungeon, learns under pressure, writes real code, survives failures, and opens the next gate through demonstrated mastery.

The experience must feel like a game with a story, not like an educational SaaS dashboard. Story, instructor personality, real learning, gameplay and feedback take priority over decorative UI.

## HellGate opening story

First launch must begin with a cinematic HellGate sequence. The learner wakes in darkness and hears a chaotic soundscape represented by restrained audio/visual cues: screaming, shouting, metal, demons and distant chaos. The ground then shakes and Pythonsura erupts from the ground.

The opening dialogue establishes:
- learner shock at waking in Hell;
- Pythonsura's brutal but funny introduction;
- a single chance to escape by surviving the Python Dungeon;
- accept/reject tension;
- Pythonsura's giant mouth as the portal into the dungeon;
- the learner's frightened/comedic reaction;
- Pythonsura's reply;
- a miniature Pythonsura guide appearing inside the dungeon;
- accept/reject guide choice, with the guide becoming mandatory if rejected;
- language selection before the descent begins.

The opening should use purposeful motion only: ground shake for Pythonsura's arrival, portal/mouth motion for dungeon entry, and scene transitions for story beats. No random polygon or dashboard animation.

## Language

Learners choose English or Hinglish during HellGate. The choice persists locally and controls Pythonsura's story dialogue, roasts, reactions and tutor conversation throughout the experience. Technical Python teaching remains accurate and readable.

## Dungeon environment

The learner should understand where they are, what they must do, why the current task matters, and what happens after success or failure. Dungeon visuals may use cave darkness, torches, fog, Python marks, gated paths and restrained creature motion when those elements support story or gameplay.

## Instructor: Pythonsura

Pythonsura is not a chatbot beside a lesson. Pythonsura IS the instructor and personality of the learning experience.

Personality: intelligent, sarcastic, impatient, funny, brutal, technically accurate, occasionally encouraging, and strongly Indian/Hinglish when Hinglish is selected. Roasts must be contextual, usually aimed at the learner's current coding performance or mistake rather than random abuse. Never attack protected classes or inherent worth.

Pythonsura must:
- teach at baby-level when needed;
- ask what the learner tried;
- explain one concept at a time;
- demonstrate before demanding implementation;
- answer natural-language questions during a lesson;
- remember the ongoing conversation during the lesson;
- react to actual code, stdout, stderr, timeout and errors;
- explain why a failure happened;
- provide the smallest useful next step;
- use memes, emoji reactions and occasional profanity as contextual comedy;
- switch among Teacher, Comedy, Battle and Senior Engineer modes;
- optionally speak tutor dialogue using browser speech synthesis when enabled.

## Tutor-first learning loop

Every concept follows:

STORY → DIAGNOSTIC → TEACH → DOUBT CHECK → ADAPTIVE RE-TEACH → CHALLENGE → REAL EXECUTION → CONTEXTUAL ROAST → EXPLANATION → RETRY → MASTERY → GATE OPENS

After the diagnostic, Pythonsura adjusts the teaching approach. Learners can explicitly say they do not understand and choose the kind of help needed: syntax, core idea, example/analogy, visual explanation or practice. The instructor must change teaching strategy rather than simply repeat the same paragraph.

Teaching strategies should include, where useful:
- simple explanation;
- real-life analogy;
- visual flow or relationship explanation;
- line-by-line code breakdown;
- interactive modification and execution;
- relevant external reference material when a concept needs additional study.

A failed challenge must not merely unlock a harder challenge. Repeated failure triggers remediation and easier targeted practice before difficulty rises again.

## Challenge gauntlet

Each concept should expose a substantial progressive mastery gauntlet, approximately 20 challenge opportunities when practical. The progression should move through understanding, syntax, simple implementation, output prediction, debugging, edge cases, logic, interview reasoning and real-world application. Appropriate stages must require actual code execution rather than repetitive multiple-choice questions.

A concept is not mastered by one lucky answer. Repeated successful behavioral proofs are required before the dungeon gate opens.

## Adaptive learning

Track attempts, successes, failures, hints used, elapsed time, last outcome and mastery. Mastery is stored as a 0–100 percentage. Repeated failures increase support and remediation; strong repeated success may increase difficulty.

## Runtime

Python execution must be isolated in a Web Worker with stdout/stderr capture, syntax/runtime errors, timeout protection, cancellation, safe worker restart and clean UI state after cancellation.

## Boss battles

Every boss phase contains executable Python code and requires successful behavioral evaluation before the next phase can be entered. Phase progress persists. Boss rewards cannot be duplicated.

Boss reward target: 100 XP.

## Debugging Dungeon

Provide executable broken programs with behavioral success checks, including mutable defaults, off-by-one errors, shadowing, wrong conditions/types, missing returns, indexing and async/concurrency mistakes.

Debug reward target: 40 XP, claimed once per case.

## Project Factory

Every project has a real editor, executable starter code, validation requirements and contract tests. Completion requires a real test pass, not a checklist click.

Project reward target: 150 XP for the standard contract.

## Interview Battle Arena

Exactly 30 questions cover fundamentals through advanced Python, runtime behavior, debugging, performance and CPython implementation knowledge. The arena preserves round and score state, provides explanations/follow-up retries, calculates the full rank ladder, and awards completion only once.

Interview reward target: 50 XP.

## Achievements

Support FIRST BLOOD, NO HINTS, BUG SLAYER, LOOP SURVIVOR, FUNCTION SUMMONER, EXCEPTION HANDLER, BOSS SLAYER, JIT JUGGLER, MEMORY MONSTER, INTERVIEW SURVIVOR and PYTHON OVERLORD. Achievements must come from real completed behavior.

## Persistence

Persist current lesson, completed lessons, XP, streaks, mastery, attempts, settings, boss phase progress, boss completions, project progress, debug rewards, coding reward state and interview state. Language choice and HellGate completion must persist locally. Invalid data must fall back safely.

## Visual and interaction rules

Use a premium game aesthetic: deep black, volcanic red/orange, restrained bruised-purple depth, strong editorial headings and compact monospace system labels. Texture should come from lighting, shadow, grain-like gradients and purposeful motion.

Do not use:
- generic cyberpunk layouts;
- rotating octagons or random polygons;
- decorative telemetry that does not affect gameplay;
- excessive particles or neon;
- generic dashboard widgets that compete with the lesson;
- animations without narrative/gameplay purpose.

Every animation should explain itself: shaking ground means a demon arrived, a portal transition means entering a dungeon, a gate opening means mastery, a scene freeze means assessment, and an instructor reaction means the learner did something.

Motion for React is acceptable and preferred for meaningful stage/feedback transitions. Reduced-motion behavior must be respected.

## Release gate

Before declaring the project finished:
- `npm run verify` passes;
- `npm run build` passes;
- GitHub Actions passes on the latest main commit;
- only one active application implementation remains;
- no fake interaction or dead active buttons remain;
- rewards cannot be farmed;
- lessons, debugging, bosses, interviews and projects execute real logic;
- HellGate story and language flow are wired;
- Pythonsura is the instructor, not decorative chatbot chrome;
- local AI and deterministic fallback are wired;
- README matches the shipped architecture.
