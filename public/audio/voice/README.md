# Local voice assets

The game loads scripted dialogue from this folder:

`/audio/voice/{language}/{actor}/{line-id}.mp3`

Languages: `en`, `hinglish`  
Actors: `pythosura`, `learner`, `narrator`, `boss`, `system`

## Generate the job manifest

Run:

`npm run prepare:voice`

This creates text job files and `voice-generation-manifest.json`. Use a local TTS engine to render each job to the matching `.mp3` path. The runtime never falls back to browser `speechSynthesis`.

## Voice direction

- **Pythosura:** adult male demon, deep/warm, sarcastic, theatrical, controlled menace; natural Hinglish when selected.
- **Learner:** younger adult, conversational, nervous/confused under pressure.
- **Narrator:** cinematic, calm, ominous.
- **Boss:** intimidating, forceful, angry when the player fails.
- **System:** restrained, synthetic/cinematic, not robotic speech.

Keep delivery human and expressive. Avoid cartoon effects, exaggerated monster growls, or generic AI-assistant cadence.

Binary audio is intentionally not committed by the text-only GitHub editing workflow; generated local audio should be added to this directory when the chosen TTS pipeline is run.
