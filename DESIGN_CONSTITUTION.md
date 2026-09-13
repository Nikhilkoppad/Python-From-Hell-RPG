# Python From Hell — Design Constitution

Python From Hell is a cinematic developer-Hell RPG, not a generic SaaS dashboard.

## Style
- Preserve ember-orange, abyss-black, ash, smoke, and restrained bruised-purple depth.
- Use condensed display typography for titles and stats.
- Use JetBrains Mono for code, telemetry, labels, and system readouts.
- Prefer layered dark surfaces, thin borders, restrained glass, and strong hierarchy.
- Orange is for actions, progress, alerts, and focal points — never long body text.
- Never introduce rotating octagons, random polygons, decorative telemetry, excessive neon, or animation without narrative/gameplay purpose.

## Tokens
- Views use semantic design tokens; do not introduce arbitrary colors, spacing, radii, shadows, or durations.
- Keep the three token layers: primitives -> semantic -> component.
- Follow the 4/8 spacing scale and consistent shape/elevation.
- Preserve existing class names and behavior unless a change is explicitly required.

## Components
- Primary: filled ember action with dark text.
- Secondary: outlined action.
- Ghost: low-emphasis action.
- Danger: explicit destructive action.
- Controls have at least a 44px hit area where practical.
- Icon-only controls have accessible names and tooltips where useful.
- States must include hover, pressed, disabled, loading, and error where applicable.

## Motion
- 90ms micro, 160ms short, 260ms medium, 400ms long.
- Use emphasized easing for entrances and exit easing for dismissals.
- Motion communicates hierarchy and gameplay state; it does not decorate every element.
- Respect prefers-reduced-motion by removing shakes, parallax, autoplay, and continuous decorative loops.
- A shake means impact/arrival, a portal transition means descent, a gate opening means mastery, and an instructor reaction means learner behavior.

## Accessibility
- Target WCAG 2.2 AA.
- Body text: minimum 4.5:1 contrast.
- Large text: minimum 3:1.
- UI boundaries and focus indicators: minimum 3:1.
- Never remove focus outlines without a visible replacement.
- Preserve logical DOM/tab order.
- Focused controls must remain visible and usable.
- Never rely on color alone to communicate state.

## UX
- One clear primary action per view.
- Make the next mission obvious.
- Show runtime states: loading, running, passed, failed, timeout, cancelled, and retry.
- Preserve progress and make destructive actions explicit.
- Real code execution and behavioral validation outrank checklist completion.
- Pythonsura is the instructor, not decorative chatbot chrome.

## Review gate
Before shipping a change, check:
- contrast and focus visibility;
- keyboard navigation and hit targets;
- reduced motion;
- mobile layout;
- loading, empty, and error states;
- duplicate or dead interactions;
- arbitrary styling;
- reward farming;
- real execution/validation;
- consistency with PYTHON_FROM_HELL_REQUIREMENTS.md.
