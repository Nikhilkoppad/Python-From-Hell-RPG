import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Volume2, VolumeX, Globe, ChevronRight, Skull, Zap } from 'lucide-react';
import { HellWorld3D, type HellScenePhase } from './HellWorld3D';
import { hellAudio } from '../engine/hellAudio';
import { voiceLine, voiceManager } from '../engine/voice/VoiceManager';
import '../hellgate.css';

export type ExperienceLanguage = 'en' | 'hinglish';
const LANGUAGE_KEY = 'python-from-hell:language:v1';
const ENTERED_KEY = 'python-from-hell:entered';
export function getExperienceLanguage(): ExperienceLanguage {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === 'hinglish' ? 'hinglish' : 'en';
  } catch {
    return 'en';
  }
}
export function setExperienceLanguage(language: ExperienceLanguage) {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {}
}
type Phase = 'language' | 'wake' | 'arrival' | 'choice' | 'portal' | 'guide' | 'forced' | 'launch';
type Props = {
  hasSave?: boolean;
  onComplete: () => void;
  onResume?: () => void;
  onStartFresh?: () => void;
};
const copy = {
  en: {
    langKicker: 'FIRST: CHOOSE YOUR VOICE',
    langTitle: 'WHO IS GOING TO TEACH YOU?',
    langBody:
      'This choice controls the entire adventure — dialogue, teacher voice, roasts, questions, memes and story.',
    eng: 'ENGLISH',
    engDesc: 'Pure English. Same demon. Same brutality.',
    hi: 'HINGLISH',
    hiDesc: 'Desi Python Hell. Hindi/Hinglish throughout.',
    lock: 'LOCK LANGUAGE',
    resume: 'RESUME MY DESCENT',
    fresh: 'START A NEW DESCENT',
    wakeKicker: 'SOMETHING IS VERY WRONG',
    wakeTitle: 'WHERE THE HELL AM I?',
    wakeBody:
      'Darkness. A heartbeat. Distant screams. Chains. Fire. You slowly realise the ground beneath you is not your bedroom.',
    wakeButton: 'OPEN YOUR EYES',
    learner: 'BC, what the hell happened? Did I shake my way into Hell?',
    arrivalKicker: 'THE GROUND BREAKS',
    arrivalTitle: 'PYTHONSURA',
    arrivalBody:
      'The ground violently splits. A colossal demon snake tears upward through smoke and fire. It stares directly into you.',
    arrivalLine: '“Another idiot. Came here to die? Ha ha ha.”',
    chance: 'One chance. Survive my Python Dungeon, and I will show you the way out.',
    accept: 'ACCEPT THE DUNGEON',
    reject: 'I WANT OUT',
    forced: 'Nice try. There is no “out” button in Hell.',
    portalTitle: 'THE MOUTH IS THE GATE',
    portalBody:
      'Pythosura opens an enormous jaw. A living black portal burns behind rows of teeth.',
    portalLine: '“Enter the dungeon at your own risk.”',
    learnerPortal: 'You are not seriously asking me to walk into your mouth.',
    demonPortal: '“Stop talking. Get inside.”',
    enter: 'ENTER THE MOUTH',
    guideTitle: 'MINI-PYTHOSURA',
    guideBody:
      'Inside the portal, a tiny Python demon crawls from a broken line of code and lands on your shoulder.',
    guideLine: '“Come on, idiot. I am your guide now.”',
    guideAccept: 'FINE. GUIDE ME',
    guideReject: 'I WORK ALONE',
    guideForced: 'You are really arguing with the only creature who knows the exit. Genius.',
    launchKicker: 'THE DUNGEON HAS YOU',
    launchTitle: 'WELCOME TO PYTHON HELL',
    launchBody:
      'From here on, I teach until you understand. You code until you can prove it. The gates open only when your brain earns them.',
    launch: 'ENTER THE DUNGEON',
  },
  hinglish: {
    langKicker: 'SABSE PEHLE: APNI LANGUAGE CHUN',
    langTitle: 'KAUN SIKHAYEGA TUJHE PYTHON?',
    langBody:
      'Ye setting poori adventure control karegi — dialogue, teacher voice, gaali, roast, sawal, memes aur story.',
    eng: 'ENGLISH',
    engDesc: 'Pure English. Same demon. Same brutality.',
    hi: 'HINGLISH',
    hiDesc: 'Desi Python Hell. Full Hinglish throughout.',
    lock: 'LANGUAGE LOCK KAR',
    resume: 'PURANA DESCENT CONTINUE KAR',
    fresh: 'NAYA DESCENT SHURU KAR',
    wakeKicker: 'KUCH BAKWAAS HO GAYI HAI',
    wakeTitle: 'BC… MAIN KAHAN AA GAYA?',
    wakeBody:
      'Andhera. Heartbeat. Door se cheekh. Chains. Fire. Dheere-dheere samajh aata hai — ye bedroom nahi hai.',
    wakeButton: 'AANKHEIN KHOLO',
    learner: 'BC, ye kya hogaya? Hila-hila ke nark pahunch gaya kya main?',
    arrivalKicker: 'ZAMEEN PHAT TI HAI',
    arrivalTitle: 'PYTHONSURA',
    arrivalBody:
      'Zameen literally phat jaati hai. Smoke aur fire ke beech se ek giant demon snake bahar nikalta hai aur seedha tujhe ghoorta hai.',
    arrivalLine: '“Ek aur chutiya... marne aaya hai? Ha ha ha.”',
    chance: 'Ek chance. Mera Python Dungeon survive kar, phir bahar ka raasta dikhaunga.',
    accept: 'DUNGEON ACCEPT KAR',
    reject: 'BC MUJHE BAHAR NIKAAL',
    forced: 'Haan haan. Hell mein exit button bhi chahiye tujhe.',
    portalTitle: 'MUH HI GATE HAI',
    portalBody:
      'Pythosura apna giant muh kholta hai. Daanton ke peeche ek kaala zinda portal jal raha hai.',
    portalLine: '“Enter the dungeon at your own risk.”',
    learnerPortal: 'Tu serious hai? Main tere muh ke andar jaaun?',
    demonPortal: '“Bakchodi band kar. Andar ghus.”',
    enter: 'MUH MEIN GHUS',
    guideTitle: 'MINI-PYTHOSURA',
    guideBody:
      'Portal ke andar ek chhota Python demon broken code line se bahar nikalta hai aur tere kandhe par baith jaata hai.',
    guideLine: '“Aa chutiye. Ab main tera guide hoon.”',
    guideAccept: 'THEEK HAI, GUIDE KAR',
    guideReject: 'MAIN AKELA JAUNGA',
    guideForced: 'Haan bilkul. Exit jaanta bhi nahi, attitude full hai. Genius.',
    launchKicker: 'DUNGEON NE PAKAD LIYA',
    launchTitle: 'PYTHON HELL MEIN SWAGAT HAI',
    launchBody:
      'Ab se rule simple hai: samajh aane tak main sikhaunga. Prove karne tak tu code karega. Gate dimaag se khulega.',
    launch: 'DUNGEON MEIN GHUS',
  },
};

const voiceIds = {
  wakeLearner: 'hellgate/wake_learner',
  arrivalPythosura: 'hellgate/arrival_pythosura',
  portalPythosura: 'hellgate/portal_pythosura',
  portalLearner: 'hellgate/portal_learner',
  guidePythosura: 'hellgate/guide_pythosura',
  guideForced: 'hellgate/guide_forced',
};

function speak(
  text: string,
  enabled: boolean,
  language: ExperienceLanguage,
  actor: 'demon' | 'learner' = 'demon',
  id?: string,
) {
  if (!enabled) return;
  const lineId =
    id ??
    `dynamic/${actor}/${text
      .slice(0, 24)
      .replace(/[^a-z0-9]+/gi, '_')
      .toLowerCase()}`;
  void voiceManager.play(
    voiceLine(lineId, text, actor === 'demon' ? 'pythosura' : 'learner', language, {
      priority: 'high',
    }),
  );
}

export function HellGateExperience({ hasSave = false, onComplete, onResume, onStartFresh }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('language');
  const [language, setLanguage] = useState<ExperienceLanguage>(getExperienceLanguage());
  const [sound, setSound] = useState(true);
  const [shake, setShake] = useState(false);
  const t = copy[language];
  useEffect(() => {
    hellAudio.setMuted(!sound);
    voiceManager.setEnabled(sound);
    return () => {
      hellAudio.setMuted(true);
      voiceManager.stop();
    };
  }, [sound]);
  useEffect(() => {
    if (phase === 'wake') speak(t.learner, sound, language, 'learner', voiceIds.wakeLearner);
  }, [phase, language, sound, t.learner]);
  useEffect(() => {
    if (phase === 'portal') speak(t.portalLine, sound, language, 'demon', voiceIds.portalPythosura);
  }, [phase, language, sound, t.portalLine]);
  useEffect(() => {
    if (phase === 'guide') speak(t.guideLine, sound, language, 'demon', voiceIds.guidePythosura);
  }, [phase, language, sound, t.guideLine]);
  const go = (next: Phase) => {
    hellAudio.startAmbience();
    if (next === 'arrival' || next === 'choice') {
      hellAudio.quake();
      setShake(true);
      window.setTimeout(() => setShake(false), 480);
    }
    if (next === 'portal') hellAudio.impact();
    if (next === 'guide') hellAudio.portal();
    setPhase(next);
  };
  const choose = (l: ExperienceLanguage) => {
    setLanguage(l);
    setExperienceLanguage(l);
    hellAudio.startAmbience();
    go('wake');
  };
  const complete = () => {
    localStorage.setItem(ENTERED_KEY, 'yes');
    voiceManager.stop();
    hellAudio.dispose();
    onComplete();
  };
  const scenePhase: HellScenePhase =
    phase === 'language' ? 'wake' : phase === 'forced' ? 'guide' : phase;
  const onBeat = (beat: string) => {
    if (!sound) return;
    if (beat === 'emerge') {
      hellAudio.quake();
      hellAudio.roar();
      speak(t.arrivalLine, true, language, 'demon', voiceIds.arrivalPythosura);
    }
    if (beat === 'portal') hellAudio.portal();
  };
  return (
    <main className={`hellgate-cinematic ${shake ? 'scene-shake' : ''}`}>
      <HellWorld3D phase={scenePhase} reducedMotion={Boolean(reduced)} onBeat={onBeat} />
      <div className="cinema-vignette" />
      <div className="cinema-grain" />
      <div className="cinema-ui">
        <header className="cinema-top">
          <span className="cinema-brand">
            PYTHON <b>FROM HELL</b>
          </span>
          <span className="cinema-status">HELLGATE // {phase.toUpperCase()}</span>
          <button
            onClick={() => setSound((v) => !v)}
            aria-label={sound ? 'Mute Hell ambience' : 'Enable Hell ambience'}
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </header>
        <AnimatePresence mode="wait">
          {phase === 'language' && (
            <motion.section
              key="language"
              className="cinema-card language-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cinema-kicker">
                <Globe size={14} /> {t.langKicker}
              </div>
              <h1>{t.langTitle}</h1>
              <p>{t.langBody}</p>
              <div className="voice-choice">
                <button
                  className={language === 'en' ? 'chosen' : ''}
                  onClick={() => {
                    setLanguage('en');
                    setExperienceLanguage('en');
                  }}
                >
                  <strong>🇬🇧 {t.eng}</strong>
                  <span>{t.engDesc}</span>
                </button>
                <button
                  className={language === 'hinglish' ? 'chosen' : ''}
                  onClick={() => {
                    setLanguage('hinglish');
                    setExperienceLanguage('hinglish');
                  }}
                >
                  <strong>🇮🇳 {t.hi}</strong>
                  <span>{t.hiDesc}</span>
                </button>
              </div>
              <button className="cinema-action" onClick={() => choose(language)}>
                {t.lock}
                <ChevronRight />
              </button>
              {hasSave && (
                <div className="return-choice">
                  <button onClick={onResume}>{t.resume}</button>
                  <button onClick={onStartFresh}>{t.fresh}</button>
                </div>
              )}
            </motion.section>
          )}
          {phase === 'wake' && (
            <motion.section
              key="wake"
              className="cinema-caption wake-caption"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cinema-kicker">{t.wakeKicker}</div>
              <h1>{t.wakeTitle}</h1>
              <p>{t.wakeBody}</p>
              <div className="cinema-soundline">
                SCREAMS · CHAINS · WIND · FIRE · DISTANT DEMONS
              </div>
              <div className="cinema-dialogue">{t.learner}</div>
              <button
                className="cinema-action"
                onClick={() => {
                  speak(t.learner, sound, language, 'learner', voiceIds.wakeLearner);
                  go('arrival');
                }}
              >
                {t.wakeButton}
                <ChevronRight />
              </button>
            </motion.section>
          )}
          {phase === 'arrival' && (
            <motion.section
              key="arrival"
              className="cinema-caption demon-caption"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cinema-kicker">{t.arrivalKicker}</div>
              <div className="demon-name">
                <Skull size={15} /> PYTHONSURA
              </div>
              <h1>{t.arrivalTitle}</h1>
              <p>{t.arrivalBody}</p>
              <blockquote>{t.arrivalLine}</blockquote>
              <p className="cinema-chance">{t.chance}</p>
              <div className="cinema-actions">
                <button
                  className="cinema-action"
                  data-story-action="ACCEPT THE DESCENT"
                  onClick={() => go('portal')}
                >
                  {t.accept}
                  <Zap />
                </button>
                <button className="cinema-ghost" onClick={() => go('choice')}>
                  {t.reject}
                </button>
              </div>
            </motion.section>
          )}
          {phase === 'choice' && (
            <motion.section
              key="choice"
              className="cinema-caption"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="cinema-kicker">PYTHONSURA IS LAUGHING</div>
              <h1>NO EXIT.</h1>
              <p>{t.forced}</p>
              <button className="cinema-action" onClick={() => go('portal')}>
                {t.accept}
                <ChevronRight />
              </button>
            </motion.section>
          )}
          {phase === 'portal' && (
            <motion.section
              key="portal"
              className="cinema-caption portal-caption"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cinema-kicker">{t.portalTitle}</div>
              <h1>LOOK AT THE TEETH.</h1>
              <p>{t.portalBody}</p>
              <blockquote>{t.portalLine}</blockquote>
              <div className="cinema-dialogue">{t.learnerPortal}</div>
              <div className="demon-line">{t.demonPortal}</div>
              <button
                className="cinema-action"
                onClick={() => {
                  speak(t.learnerPortal, sound, language, 'learner', voiceIds.portalLearner);
                  window.setTimeout(
                    () => speak(t.demonPortal, sound, language, 'demon', voiceIds.portalPythosura),
                    1200,
                  );
                  go('guide');
                }}
              >
                <Zap />
                {t.enter}
              </button>
            </motion.section>
          )}
          {phase === 'guide' && (
            <motion.section
              key="guide"
              className="cinema-caption guide-caption"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="cinema-kicker">PYTHON DUNGEON // COMPANION DETECTED</div>
              <div className="mini-tag">🐍 MINI-PYTHOSURA</div>
              <h1>{t.guideTitle}</h1>
              <p>{t.guideBody}</p>
              <blockquote>{t.guideLine}</blockquote>
              <div className="cinema-actions">
                <button className="cinema-action" onClick={() => go('launch')}>
                  {t.guideAccept}
                  <ChevronRight />
                </button>
                <button
                  className="cinema-ghost"
                  onClick={() => {
                    speak(t.guideForced, sound, language, 'demon', voiceIds.guideForced);
                    go('forced');
                  }}
                >
                  {t.guideReject}
                </button>
              </div>
            </motion.section>
          )}
          {phase === 'forced' && (
            <motion.section
              key="forced"
              className="cinema-caption guide-caption"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cinema-kicker">GUIDE CONTRACT // NON-NEGOTIABLE</div>
              <div className="mini-tag">🐍 MINI-PYTHOSURA</div>
              <h1>FINE. YOU'RE GETTING A GUIDE.</h1>
              <blockquote>{t.guideForced}</blockquote>
              <button className="cinema-action" onClick={() => go('launch')}>
                ACCEPT THE LITTLE BASTARD <ChevronRight />
              </button>
            </motion.section>
          )}
          {phase === 'launch' && (
            <motion.section
              key="launch"
              className="cinema-caption launch-caption"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="rift-mark" />
              <div className="cinema-kicker">{t.launchKicker}</div>
              <h1>{t.launchTitle}</h1>
              <p>{t.launchBody}</p>
              <div className="rules">
                <span>01 // PYTHONSURA TEACHES</span>
                <span>02 // YOU WRITE</span>
                <span>03 // RUNTIME JUDGES</span>
                <span>04 // MASTERY OPENS THE GATE</span>
              </div>
              <button className="cinema-action massive" onClick={complete}>
                {t.launch}
                <ChevronRight />
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <div className="cinema-subtitle" aria-live="polite">
        {phase === 'arrival'
          ? t.arrivalLine
          : phase === 'portal'
            ? t.demonPortal
            : phase === 'guide'
              ? t.guideLine
              : phase === 'forced'
                ? t.guideForced
                : phase === 'wake'
                  ? t.learner
                  : ''}
      </div>
    </main>
  );
}
