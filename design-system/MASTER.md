# PYTHON FROM HELL — MASTER DESIGN SYSTEM

Python From Hell is a playable learning world, not a decorated course dashboard.

## Product idea

**A dangerous Python dungeon where the teacher is a character.** The learner is the protagonist. Pythosura is the instructor, judge, demon and boss. Mini-Pythosura is the companion. Code execution is the weapon. Mastery opens the gates.

## North-star experience

`LANGUAGE → CINEMATIC WAKE → EXPLORE → DIAGNOSE → TEACH → TALK → WRITE → RUN → REACT → ROAST → EXPLAIN → RETRY → MASTER → DESCEND`

Every screen should answer: **where am I, what is happening, what do I do next, and why does it matter?** The user should feel that something is happening in a world, not that a web page is changing cards.

## HellGate rules

The first interaction is language selection: English or Hinglish. The choice propagates through story dialogue, teacher dialogue, speech, questions, hints, reactions, roasting, explanations and AI mentor context.

After language selection, the opening is a real-time 3D cinematic scene. The camera is the learner's point of view. Darkness gives way to fire, smoke, fog, ruins, moving silhouettes and environmental sound. Pythosura physically emerges from the ground, reacts, opens his jaw and reveals the dungeon portal. Mini-Pythosura physically enters the scene as the companion.

The scene uses purposeful camera movement, body animation, facial-light cues, environmental lighting, particles and sound. Text is limited to subtitles, essential choices and accessibility copy; it is never the primary carrier of the story.

## 3D direction

Use Three.js for real-time 3D. Prefer a stylized game-real visual language over photorealism: believable depth, fog, warm fire pools, hard shadows and readable character shapes.

Pythosura is a literal 3D demon snake rig with an animated head, glowing eyes, horns, jaw, teeth and portal mouth. Mini-Pythosura is the same character language at companion scale.

Environments should have a reason to exist: cave/ruin architecture, torches, lava, smoke, Python markings, dangerous paths and gates. Avoid decorative geometry whose only purpose is to fill space.

## Sound direction

Sound is part of gameplay. The HellGate uses a layered procedural audio system so the experience does not depend on a pile of external copyrighted assets.

Ambient bed:
- low sub/bass Hell drone
- wind/noise bed
- sparse fire crackle
- occasional chain movement
- distant low creature texture

Interactive SFX:
- ground quake
- heavy impact
- demon roar
- jaw/portal activation
- sparks
- footsteps
- comedic laugh/reaction

Voice:
- browser/local speech synthesis performs character dialogue with different pitch/rate profiles for learner and demon
- Hinglish uses an Indian Hindi voice locale when the browser offers one
- captions remain available because synthesized voice is additive, not a requirement

## Meme + reaction direction

Reactions must be **situation-aware**. The director asks what happened before choosing a line, voice delivery, camera response, animation and temporary meme treatment.

Examples of contexts:
- careless syntax error
- repeated same mistake
- successful recovery
- unexpectedly brilliant answer
- boss pressure
- interview confidence collapse
- suspiciously fast success

Do not place memes on screen randomly. Do not endlessly repeat one tiny fixed meme list. Keep the reaction bank extensible and rotate variants by context and session state.

Comedy rhythm:

`TENSION → SILENCE → CHARACTER LOOK → ABSURD REACTION → ROAST → TECHNICAL EXPLANATION → NEXT MOVE`

## Tutor rules

Pythosura is a literal instructor, not a chatbot widget. He should ask what the learner tried, inspect actual code/output/errors, teach one idea at a time, answer questions, switch explanation strategy when the learner is confused, and require demonstrated mastery.

Teaching modes should include:
1. very simple explanation
2. real-life analogy
3. visual explanation
4. line-by-line code walkthrough
5. interactive manipulation

External learning resources may be surfaced only when they are relevant to the exact confusion.

Profanity is fictional character flavor. It can be strong and context-aware, but it must target the learner's in-game performance or code behavior, not protected traits or inherent worth.

## Lesson gameplay

Each concept follows:

`STORY → DIAGNOSTIC → TEACH → DOUBT → ADAPT → PRACTICE → EXECUTE → REACT → RETRY → PROVE`

The learner does not progress because they clicked a button. Progress requires actual executable behavior and repeated evidence of understanding.

## Visual language

Deep black foundation with volcanic red/orange firelight and restrained bruised-purple depth. Use strong editorial headings, compact monospace system text and clean code typography.

Avoid:
- generic cyberpunk polygons
- rotating octagons
- fake telemetry
- excessive neon
- random particle storms
- dense dashboard widgets
- floating glass-card collections

## Motion rules

Motion has narrative meaning: camera cuts, wake-up reveal, impact, Pythosura emergence, jaw opening, portal activation, character reactions, stage changes, success/failure acknowledgement and descent transitions.

Never animate something merely because animation is available. Respect reduced motion everywhere.

## Information hierarchy

**Primary:** what is happening and what must I do next?

**Secondary:** why it works, tutor explanation, mastery, one hint.

**Tertiary:** settings, metadata and implementation details.

Tertiary information must never compete with the lesson action.

## Responsive behavior

Desktop is a cinematic classroom. Tablet keeps the character and mission dominant. Mobile becomes a vertical cinematic → teacher → mission → editor → conversation sequence.

## Accessibility

Maintain keyboard operation, visible focus, readable contrast, semantic controls, live feedback, reduced motion and a fully usable no-audio path. Voice and sound should enrich the experience, never gate comprehension.

## Design provenance

The public UI/UX Pro Max skill by NextLevelBuilder is used as design research for hierarchy, design-system thinking and pre-delivery review. This file defines Python From Hell's own art direction and interaction system rather than copying external assets.
