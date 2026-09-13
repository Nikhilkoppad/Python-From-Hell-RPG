# PYTHON FROM HELL — MASTER DESIGN SYSTEM

This is the shipped visual/interaction source of truth for the RPG. It applies the design-intelligence principles of UI/UX Pro Max while keeping a product-specific identity instead of copying a generic style.

## Product idea

**A dangerous tutor that turns Python learning into an adventure.** The learner should feel guided, not managed. The lesson is the stage; PYTHONSURA is the character; the editor is the weapon; mastery is the gate.

## North-star interaction

`STORY → DIAGNOSTIC → TEACH → WRITE → RUN → REACT → EXPLAIN → RETRY → MASTER → DESCEND`

Every screen should have one obvious next action. Secondary information should stay collapsed, contextual, or visually quiet.

## Visual language

- Deep black foundation with volcanic red/orange action color and restrained bruised-purple depth.
- High-contrast editorial typography for headings; compact monospace for system labels and code.
- Sharp panels with subtle borders, not floating glass cards everywhere.
- Texture comes from light, shadow, grain-like gradients, restrained motion and interaction—not decorative polygons.
- Avoid generic cyberpunk, rotating octagons, excessive neon, random particles, fake telemetry, and dashboard clutter.

## Lesson composition

1. **Living Classroom** — the lesson fills the screen and makes PYTHONSURA the teacher, not a side widget.
2. **Adventure Scene** — establish where the learner is and why the topic matters.
3. **One diagnostic** — identify the learner's starting mental model.
4. **Micro-teaching** — explain a single idea in tiny bites, with a minimal demonstration.
5. **Disturbance Feed** — unpredictable but harmless teacher/Hell interruptions keep the learner alert and reinforce the theme.
6. **Live Mission** — tell the learner exactly what to write.
7. **Runtime reaction** — show stdout, stderr, timeout, or failure plainly.
8. **Teacher reaction** — PYTHONSURA talks, roasts the code, explains the mistake, and gives the smallest next step.
9. **Conversation** — the learner can ask questions in natural language and the tutor receives code/error/mastery context plus the lesson conversation history.
10. **Repeated proof** — mastery requires successful behavior over multiple attempts.
11. **Descent transition** — the next lesson is earned, not clicked.

## Motion rules

Motion is used for meaning: entering the teacher scene, stage changes, disturbance arrivals, tutor reactions, chat messages, success/failure acknowledgement, and descent transitions. Never animate content that does not benefit from it.

Use reduced-motion support for every non-essential animation. Prefer opacity/transform/layout transitions. Avoid high-frequency decorative animation.

The project uses the open-source `motion` package and imports React features from `motion/react`.

## Tutor personality

PYTHONSURA behaves like a JARVIS-style teacher with developer-Hell humor. It can use playful profanity, memes, emoji reactions, mockery of bad code and exaggerated reactions. It never attacks protected classes or the learner's inherent worth.

The tutor should:
- ask what the learner tried;
- teach one concept at a time;
- demonstrate before demanding code;
- avoid dumping full solutions by default;
- remember conversation context during a lesson;
- use the learner's actual code/error/mastery context;
- adapt support after repeated mistakes;
- speak responses aloud when tutor voice is enabled.

## Disturbance system

The classroom periodically receives a small **Unauthorized Interruption** such as a meme drop, fake incident report, code-review alert, variable escape, senior-engineer call, traceback grave or brain-cell report. Interruptions are short, reversible and never block the learning flow. They should feel like the environment is reacting to the learner rather than playing a static slideshow.

## Information hierarchy

**Primary:** what do I need to understand/do now?

**Secondary:** why this works, current mastery, one hint, teacher chat.

**Tertiary:** system metadata, settings, advanced metrics, implementation notes.

Tertiary information should never compete with the teaching action.

## Voice and feedback

Prefer concrete reactions:
- `THE CRATER WAKES`
- `SHOW ME HOW YOUR BRAIN THINKS`
- `THE IDEA`
- `PYTHONSURA DEMONSTRATES`
- `YOUR TURN, HERETIC`
- `THAT CODE JUST DIED`
- `CONCEPT INSTALLED`

Feedback should say what happened and what to do next. Avoid vague `Something went wrong` messaging.

## Accessibility

Maintain visible focus, strong contrast, keyboard operation, semantic controls, readable type, reduced motion, and live regions for runtime/tutor feedback. Voice is additive; the lesson must remain fully usable without it.

## Responsive behavior

Desktop can expose the full living classroom and teacher conversation. Tablet collapses the disturbance column. Mobile becomes a vertical story → teacher → mission → editor → conversation flow. Do not force dense desktop information architecture onto a phone.

## Design provenance

The methodology was informed by the public UI/UX Pro Max skill by NextLevelBuilder, whose current public skill describes design-system generation, style matching, UX guidelines, responsive guidance, and pre-delivery review. This file is a product-specific implementation, not a copy of that project's assets.
