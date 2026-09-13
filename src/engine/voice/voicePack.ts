import type { VoiceActor, VoiceLanguage, VoiceLine } from './VoiceManager';

export type VoicePackLineId =
  | 'hellgate/wake_learner'
  | 'hellgate/arrival_pythosura'
  | 'hellgate/portal_pythosura'
  | 'hellgate/portal_learner'
  | 'hellgate/guide_pythosura'
  | 'hellgate/guide_forced';

export const VOICE_PACK_VERSION = 'v1';

export const VOICE_PACK: Record<
  VoicePackLineId,
  { actor: VoiceActor; en: string; hinglish: string }
> = {
  'hellgate/wake_learner': {
    actor: 'learner',
    en: 'BC, what the hell happened? Did I shake my way into Hell?',
    hinglish: 'BC, ye kya hogaya? Hila-hila ke nark pahunch gaya kya main?',
  },
  'hellgate/arrival_pythosura': {
    actor: 'pythosura',
    en: 'Another idiot. Came here to die? Ha ha ha.',
    hinglish: 'Ek aur chutiya... marne aaya hai? Ha ha ha.',
  },
  'hellgate/portal_pythosura': {
    actor: 'pythosura',
    en: 'Enter the dungeon at your own risk.',
    hinglish: 'Enter the dungeon at your own risk.',
  },
  'hellgate/portal_learner': {
    actor: 'learner',
    en: 'You are not seriously asking me to walk into your mouth.',
    hinglish: 'Tu serious hai? Main tere muh ke andar jaaun?',
  },
  'hellgate/guide_pythosura': {
    actor: 'pythosura',
    en: 'Come on, idiot. I am your guide now.',
    hinglish: 'Aa chutiye. Ab main tera guide hoon.',
  },
  'hellgate/guide_forced': {
    actor: 'pythosura',
    en: 'You are really arguing with the only creature who knows the exit. Genius.',
    hinglish: 'Haan bilkul. Exit jaanta bhi nahi, attitude full hai. Genius.',
  },
};

export function getVoiceLine(id: VoicePackLineId, language: VoiceLanguage): VoiceLine {
  const entry = VOICE_PACK[id];
  return {
    id,
    text: language === 'hinglish' ? entry.hinglish : entry.en,
    actor: entry.actor,
    language,
    priority: 'high',
  };
}

export const HELLGATE_VOICE_IDS = Object.keys(VOICE_PACK) as VoicePackLineId[];
