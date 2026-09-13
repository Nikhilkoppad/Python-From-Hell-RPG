# QA Status

## Current verification state

- Vitest is explicitly configured for Node-based engine tests under `src/**/*.test.ts`.
- CI release gate runs `npm run verify`, `npm run lint`, `npm run test`, `npm run format:check`, and `npm run build`.
- Browser/manual gameplay verification is still required before calling the release gate complete.
- Generated voice MP3 binaries are intentionally outside the text-only GitHub workflow; browser playback must be verified from the local voice pack.

## Recent automated evidence

- The latest GitHub `Format source` workflow completed successfully.
- Full CI results for the new Vitest configuration are pending the next CI run.
