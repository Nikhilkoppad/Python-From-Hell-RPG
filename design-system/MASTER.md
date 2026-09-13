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
- Texture comes from light, shadow, grain-like gradients, and motion—not decorative polygons.
- Avoid generic cyberpunk, rotating octagons, excessive neon, random particles, fake telemetry, and dashboard clutter.

## Lesson composition

1. **Adventure Log** — establish where the learner is and why the topic matters.
2. **One diagnostic** — identify the learner's starting mental model.
3. **One concept lesson** — explain a single idea in plain language.
4. **Concept Loom** — visually connect the idea to behavior.
5. **Live Mission** — tell the learner exactly what to write.
6. **Runtime reaction** — show stdout, stderr, timeout, or failure plainly.
7. **PYTHONSURA reaction** — roast, explain, and give the smallest next step.
8. **Repeated proof** — mastery requires successful behavior over multiple attempts.
9. **Descent transition** — the next lesson is earned, not clicked.

## Motion rules

Motion is used for meaning: entering the tutor, changing lesson stage, revealing the concept path, acknowledging success/failure, and making chat feel alive. Never animate content that does not benefit from it.

Use reduced-motion support for every non-essential animation. Prefer opacity/transform/layout transitions. Avoid continuous high-frequency decoration.

The project uses the open-source `motion` package and imports React features from `motion/react`.

## Tutor personality

PYTHONSURA behaves like a JARVIS-style teacher with developer-Hell humor. It can use playful profanity, memes, emoji reactions, mockery of the code and exaggerated reactions. It never attacks protected classes or the learner's inherent worth.

The tutor should:
- ask what the learner tried;
- teach one concept at a time;
- avoid dumping full solutions by default;
- remember conversation context during a lesson;
- use the learner's actual code/error/mastery context;
- adapt support after repeated mistakes.

## Information hierarchy

**Primary:** what do I need to understand/do now?

**Secondary:** why this works, current mastery, one hint.

**Tertiary:** system metadata, settings, advanced metrics, implementation notes.

Tertiary information should never compete with the teaching action.

## Voice and feedback

Prefer concrete reactions:
- `THE CRATER WAKES`
- `FIRST, I CHECK YOUR BRAIN`
- `GOOD. NOW I TEACH`
- `YOUR TURN, HERETIC`
- `NOPE. WE ARE NOT DONE YET`
- `CONCEPT MASTERED`

Feedback should say what happened and what to do next. Avoid vague `Something went wrong` messaging.

## Accessibility

Maintain visible focus, strong contrast, keyboard operation, semantic controls, readable type, reduced motion, and live regions for runtime/tutor feedback.

## Responsive behavior

Desktop can expose the full lesson cockpit. Tablet collapses secondary columns. Mobile becomes a vertical story → tutor → editor flow. Do not force dense desktop information architecture onto a phone.

## Design provenance

The methodology was informed by the public UI/UX Pro Max skill by NextLevelBuilder, whose current public skill describes design-system generation, style matching, UX guidelines, responsive guidance, and pre-delivery review. This file is a product-specific implementation, not a copy of that project's assets.
