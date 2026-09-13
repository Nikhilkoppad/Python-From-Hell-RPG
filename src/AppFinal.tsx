import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Activity,
  BookOpen,
  Bug,
  ChevronRight,
  Flame,
  Home,
  Play,
  RotateCcw,
  Settings,
  Shield,
  Swords,
  Square,
  Terminal,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { hellLayers } from './domain/curriculum';
import { lessonCatalog } from './domain/lessons';
import { debuggingCases } from './domain/debugging';
import { bosses, type BossPhase } from './domain/bosses';
import { nextStoryEvent } from './domain/story';
import {
  createInitialProgress,
  loadProgress,
  saveProgress,
  claimCodingReward,
  claimDebugReward,
  claimBossReward,
  setBossPhase,
} from './engine/progress';
import { evaluateBossPhase } from './engine/bossRunner';
import { levelFromXp, xpToNext, XP_REWARDS } from './engine/xp';
import { unlockedLayerCount } from './engine/unlocks';
import { LessonWorkspace } from './components/LessonWorkspace';
import { ProjectFactory as ProjectFactoryReal } from './components/ProjectFactory';
import { SettingsPanel } from './components/SettingsPanel';
import { InterviewArena } from './components/InterviewArena';
import { PythonRunner } from './execution/PythonRunner';
import type { Progress } from './types/progress';

export type View =
  | 'command'
  | 'curriculum'
  | 'lesson'
  | 'coding'
  | 'debugging'
  | 'bosses'
  | 'interview'
  | 'projects';
type Cinematic = { title: string; body: string; tag: string };
const PROGRESS_KEY = 'python-from-hell:rpg-progress:v3';
const ENTERED_KEY = 'python-from-hell:entered';
const nav: Array<[View, LucideIcon, string]> = [
  ['command', Home, 'Command Center'],
  ['curriculum', BookOpen, 'Curriculum'],
  ['coding', Terminal, 'Coding Arena'],
  ['debugging', Bug, 'Debugging Dungeon'],
  ['bosses', Swords, 'Boss Battles'],
  ['interview', Shield, 'Interview Arena'],
  ['projects', Trophy, 'Project Factory'],
];

export default function AppFinal() {
  const [progress, setProgress] = useState<Progress>(
    () => loadProgress() ?? createInitialProgress(),
  );
  const [view, setView] = useState<View>('command');
  const [lessonId, setLessonId] = useState(progress.currentLessonId);
  const [entered, setEntered] = useState(() => localStorage.getItem(ENTERED_KEY) === 'yes');
  const [settings, setSettings] = useState(false);
  const [cinematic, setCinematic] = useState<Cinematic | null>(null);
  const [seenAchievements, setSeenAchievements] = useState(progress.achievements.length);
  const [coreSeen, setCoreSeen] = useState(progress.completedBosses.includes('cpython-core'));
  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => {
    if (progress.achievements.length > seenAchievements) {
      const newest = progress.achievements[progress.achievements.length - 1];
      setCinematic({
        tag: 'ACHIEVEMENT UNLOCKED',
        title: newest,
        body: 'Another piece of the runtime has surrendered. Keep descending.',
      });
      setSeenAchievements(progress.achievements.length);
    }
  }, [progress.achievements.length, progress.achievements, seenAchievements]);
  useEffect(() => {
    if (progress.completedBosses.includes('cpython-core') && !coreSeen) {
      setCoreSeen(true);
      setCinematic({
        tag: 'THE CORE',
        title: 'RUNTIME ACCESS GRANTED',
        body: 'You did not merely finish the descent. You reached the machinery underneath Python. The Core is open.',
      });
    }
  }, [progress.completedBosses, coreSeen]);
  const unlocked = unlockedLayerCount(progress.completedLessons);
  const lesson =
    lessonCatalog.find((l) => l.id === lessonId) ??
    lessonCatalog.find((l) => l.layer === unlocked) ??
    lessonCatalog[0];
  const navigate = (next: View) => {
    setView(next);
    if (next === 'bosses') {
      const boss = bosses.find(
        (b) => b.layer <= unlocked && !progress.completedBosses.includes(b.id),
      );
      if (boss) setCinematic({ tag: 'BOSS CHAMBER', title: boss.name, body: boss.intro });
    } else if (next === 'interview')
      setCinematic({
        tag: 'INTERVIEW BATTLE ARENA',
        title: 'THE INTERVIEWER DEMON',
        body: 'Thirty questions. Weak answers trigger a smaller retry. No partial credit for vibes.',
      });
  };
  const openLesson = (id: string) => {
    setLessonId(id);
    setProgress((p) => ({ ...p, currentLessonId: id }));
    setView('lesson');
  };
  const enterHell = () => {
    localStorage.setItem(ENTERED_KEY, 'yes');
    setEntered(true);
    setCinematic({
      tag: 'FULL 5D PHYSICAL MOTION REALITY',
      title: 'WELCOME TO THE DESCENT',
      body: 'CPython 3.13 Execution Crater has closed behind you. PYTHONSURA is online. Your first lesson is waiting.',
    });
  };
  if (!entered)
    return (
      <HellGate
        hasSave={Boolean(loadProgress())}
        onResume={enterHell}
        onStartFresh={() => {
          localStorage.removeItem(PROGRESS_KEY);
          setProgress(createInitialProgress());
          localStorage.setItem(ENTERED_KEY, 'yes');
          setEntered(true);
          setCinematic({
            tag: 'DESCENT RESET',
            title: 'FRESH SOUL DETECTED',
            body: 'Your old run has been erased. The crater does not care about your regrets.',
          });
        }}
      />
    );
  return (
    <div className="app-shell">
      <Sidebar view={view} unlocked={unlocked} onNavigate={navigate} />
      <main className="main-stage">
        <Topbar progress={progress} onSettings={() => setSettings(true)} />
        {view === 'command' && (
          <CommandCenter
            progress={progress}
            unlocked={unlocked}
            onLesson={openLesson}
            onNavigate={navigate}
          />
        )}{' '}
        {view === 'curriculum' && (
          <Curriculum
            unlocked={unlocked}
            completed={progress.completedLessons}
            onLesson={openLesson}
          />
        )}{' '}
        {view === 'lesson' && (
          <LessonWorkspace
            lesson={lesson}
            progress={progress}
            setProgress={setProgress}
            onBack={() => setView('command')}
            onNextLesson={openLesson}
          />
        )}{' '}
        {view === 'coding' && <CodingArena progress={progress} setProgress={setProgress} />}{' '}
        {view === 'debugging' && <DebuggingDungeon progress={progress} setProgress={setProgress} />}{' '}
        {view === 'bosses' && (
          <BossChamber progress={progress} unlocked={unlocked} setProgress={setProgress} />
        )}{' '}
        {view === 'interview' && <InterviewArena progress={progress} setProgress={setProgress} />}{' '}
        {view === 'projects' && (
          <ProjectFactoryReal progress={progress} setProgress={setProgress} />
        )}
      </main>
      {settings && (
        <SettingsPanel
          progress={progress}
          setProgress={setProgress}
          onClose={() => setSettings(false)}
        />
      )}{' '}
      {cinematic && <CinematicOverlay cinematic={cinematic} onClose={() => setCinematic(null)} />}
    </div>
  );
}
function CinematicOverlay({ cinematic, onClose }: { cinematic: Cinematic; onClose: () => void }) {
  return (
    <div
      className="cinematic-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={cinematic.tag}
      onClick={onClose}
    >
      <div className="cinematic-card" onClick={(e) => e.stopPropagation()}>
        <div className="cinematic-mark">
          <span className="pulse" /> {cinematic.tag}
        </div>
        <h2>{cinematic.title}</h2>
        <p>{cinematic.body}</p>
        <button className="primary-cta small" onClick={onClose}>
          CONTINUE <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
function HellGate({
  hasSave,
  onResume,
  onStartFresh,
}: {
  hasSave: boolean;
  onResume: () => void;
  onStartFresh: () => void;
}) {
  return (
    <main className="gate-shell">
      <div className="ember-field" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <header className="brand">
        <Flame size={20} />
        <span>
          PYTHON <b>FROM HELL</b>
        </span>
        <small>v1.0 // PLAYABLE DESCENT</small>
      </header>
      <section className="gate-content">
        <div className="eyebrow">
          <span className="pulse" /> DEVELOPER HELL // GATE 01
        </div>
        <h1>
          WELCOME TO
          <br />
          <em>PYTHON FROM HELL.</em>
        </h1>
        <p className="hook">Python is easy.</p>
        <p className="pause">That's what they told you.</p>
        <div className="gate-actions">
          {hasSave && (
            <button className="primary-cta" onClick={onResume}>
              RESUME DESCENT <ChevronRight size={20} />
            </button>
          )}
          <button className={hasSave ? 'gate-secondary' : 'primary-cta'} onClick={onStartFresh}>
            <RotateCcw size={18} />
            {hasSave ? 'START FRESH' : 'ENTER HELL'} <ChevronRight size={18} />
          </button>
        </div>
        <p className="microcopy">
          No fake progress. No fake buttons. The runtime judges your code.
        </p>
      </section>
      <footer className="gate-footer">
        <span>PYTHONSURA // MENTOR ONLINE</span>
        <span>PYTHON RUNTIME: READY</span>
        <span>12 LAYERS // 1 WAY OUT</span>
      </footer>
    </main>
  );
}
function Sidebar({
  view,
  unlocked,
  onNavigate,
}: {
  view: View;
  unlocked: number;
  onNavigate: (v: View) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand compact">
        <Flame size={20} />
        <span>
          PYTHON <b>FROM HELL</b>
        </span>
      </div>
      <div className="layer-badge">
        <small>YOU ARE HERE</small>
        <strong>LAYER {String(unlocked).padStart(2, '0')}</strong>
        <span>{hellLayers[unlocked - 1]?.name ?? 'THE CORE'}</span>
      </div>
      <nav>
        {nav.map(([id, Icon, label]) => (
          <button
            key={id}
            className={view === id ? 'active' : ''}
            aria-current={view === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mentor-mini">
        <div className="avatar">P</div>
        <div>
          <small>MENTOR</small>
          <strong>PYTHONSURA</strong>
          <span>online • judging</span>
        </div>
      </div>
    </aside>
  );
}
function Topbar({ progress, onSettings }: { progress: Progress; onSettings: () => void }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">COMMAND NETWORK</p>
        <h2>
          Good morning, <em>heretic.</em>
        </h2>
      </div>
      <div className="top-stats">
        <span>
          LVL <b>{String(levelFromXp(progress.xp)).padStart(2, '0')}</b>
        </span>
        <span>
          XP <b>{progress.xp}</b>
        </span>
        <span>
          STREAK <b>{progress.streak}</b>
        </span>
        <button title="Settings" aria-label="Open game settings" onClick={onSettings}>
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
function CommandCenter({
  progress,
  unlocked,
  onLesson,
  onNavigate,
}: {
  progress: Progress;
  unlocked: number;
  onLesson: (id: string) => void;
  onNavigate: (v: View) => void;
}) {
  const next =
    lessonCatalog.find((l) => !progress.completedLessons.includes(l.id)) ??
    lessonCatalog[lessonCatalog.length - 1];
  const story = nextStoryEvent(progress.completedLessons.length);
  const records = Object.values(progress.attempts);
  const mastery = records.length
    ? Math.round(records.reduce((a, b) => a + b.mastery, 0) / records.length)
    : 0;
  const boss = bosses.find((b) => b.layer <= unlocked && !progress.completedBosses.includes(b.id));
  const recent = [
    ...progress.completedLessons.slice(-3).reverse(),
    ...progress.completedBosses.slice(-2).reverse(),
  ].slice(0, 5);
  return (
    <div className="page">
      <section className="hero-panel">
        <div>
          <div className="eyebrow">
            <span className="pulse" /> NEXT MISSION
          </div>
          <h1>{next.title}</h1>
          <p>{next.brief}</p>
          <div className="mission-meta">
            <span>{next.minutes} MIN</span>
            <span>{next.difficulty}</span>
            <span>+{XP_REWARDS.lesson} XP</span>
          </div>
          <button className="primary-cta small" onClick={() => onLesson(next.id)}>
            <Play size={15} /> START LESSON
          </button>
        </div>
        <CodePreview code={next.starterCode} />
      </section>
      <div className="stat-grid">
        <Stat
          label="HELL LAYER"
          value={`0${unlocked}`}
          sub={hellLayers[unlocked - 1]?.name ?? 'THE CORE'}
        />
        <Stat
          label="SOUL LEVEL"
          value={String(levelFromXp(progress.xp)).padStart(2, '0')}
          sub={progress.interview.rank}
        />
        <Stat label="XP TO NEXT" value={String(xpToNext(progress.xp))} sub="KEEP DIGGING" />
        <Stat
          label="MASTERY"
          value={`${mastery}%`}
          sub={`${progress.completedLessons.length} LESSONS CLEARED`}
        />
      </div>
      <div className="feature-grid">
        <Feature
          icon={BookOpen}
          title="WHAT SHOULD I DO NEXT?"
          text="Adaptive route starts at the next unfinished lesson."
          action="OPEN MISSION"
          onClick={() => onLesson(next.id)}
        />
        <Feature
          icon={Bug}
          title="DEBUGGING DUNGEON"
          text="Repair real broken programs under a behavioral check."
          action="ENTER DUNGEON"
          onClick={() => onNavigate('debugging')}
        />
        <Feature
          icon={Swords}
          title="BOSS BATTLES"
          text={boss ? `${boss.name} is waiting.` : 'No boss currently available.'}
          action="ENTER CHAMBER"
          onClick={() => onNavigate('bosses')}
        />
      </div>
      <div className="dashboard-grid">
        <div className="panel story-panel">
          <div className="panel-title">
            <span>STORY SIGNAL</span>
            <small>{story?.id ?? 'CORE'}</small>
          </div>
          <h3>{story?.title ?? 'The Core is listening.'}</h3>
          <p>{story?.text ?? 'Keep descending. The runtime has not forgotten you.'}</p>
        </div>
        <div className="panel activity-panel">
          <div className="panel-title">
            <span>
              <Activity size={14} /> RECENT ACTIVITY
            </span>
            <small>{progress.achievements.length} ACHIEVEMENTS</small>
          </div>
          {recent.length ? (
            <div className="activity-list">
              {recent.map((item) => (
                <div key={item}>
                  <span className="activity-dot" />
                  <b>{item.replaceAll('-', ' ').toUpperCase()}</b>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-activity">Your first successful run will leave a mark here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="stat">
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{sub}</span>
    </div>
  );
}
function Feature({
  icon: Icon,
  title,
  text,
  action,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button className="feature" onClick={onClick}>
      <Icon />
      <small>{title}</small>
      <p>{text}</p>
      <b>
        {action} <ChevronRight size={14} />
      </b>
    </button>
  );
}
function CodePreview({ code }: { code: string }) {
  return (
    <div className="lesson-terminal">
      <div className="terminal-top">
        <span />
        <span />
        <span />
        <label>lesson.py</label>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
function Curriculum({
  unlocked,
  completed,
  onLesson,
}: {
  unlocked: number;
  completed: string[];
  onLesson: (id: string) => void;
}) {
  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <div className="eyebrow">THE DESCENT</div>
          <h1>12 LAYERS OF HELL</h1>
        </div>
        <span>{completed.length} LESSONS CLEARED</span>
      </div>
      <div className="curriculum-grid">
        {hellLayers.map((layer) => {
          const ls = lessonCatalog.filter((l) => l.layer === layer.number);
          const cleared = ls.filter((l) => completed.includes(l.id)).length;
          return (
            <article
              key={layer.id}
              className={`layer-card ${layer.number <= unlocked ? 'open' : 'locked'}`}
            >
              <div className="layer-number">{String(layer.number).padStart(2, '0')}</div>
              <div>
                <small>
                  LAYER {String(layer.number).padStart(2, '0')} · {cleared}/{ls.length}
                </small>
                <h3>{layer.name}</h3>
                <p>{layer.tagline}</p>
                <div className="topic-list">
                  {layer.topics.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                {layer.number <= unlocked ? (
                  <button
                    onClick={() => {
                      const id = ls.find((l) => !completed.includes(l.id))?.id ?? ls[0]?.id;
                      if (id) onLesson(id);
                    }}
                  >
                    ENTER LAYER <ChevronRight size={14} />
                  </button>
                ) : (
                  <span className="locked-label">LOCKED — CLEAR CURRENT LAYER</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
function useRunner() {
  const [runner] = useState(() => new PythonRunner());
  useEffect(() => () => runner.dispose(), [runner]);
  return runner;
}
function CodingArena({
  progress,
  setProgress,
}: {
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
}) {
  const [code, setCode] = useState(
    'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("heretic"))',
  );
  const [out, setOut] = useState('');
  const [running, setRunning] = useState(false);
  const rewarded = progress.codingRewards > 0;
  const runner = useRunner();
  const run = async () => {
    if (running) return;
    setRunning(true);
    const r = await runner.run(code);
    if (r.cancelled) {
      setRunning(false);
      return;
    }
    setOut(
      r.error
        ? `ERROR\n${r.error}`
        : r.stderr
          ? `${r.stdout ? `${r.stdout}\n` : ''}${r.stderr}`
          : r.stdout || '(no output)',
    );
    setRunning(false);
    if (!r.error && !r.stderr && !rewarded) setProgress((p) => claimCodingReward(p));
  };
  const stop = () => {
    if (running) runner.stop();
  };
  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <div className="eyebrow">CODING ARENA</div>
          <h1>WRITE. RUN. SURVIVE.</h1>
        </div>
        <span>{rewarded ? 'FIRST PRACTICE REWARD CLAIMED' : '+20 XP FOR FIRST CLEAN RUN'}</span>
      </div>
      <div className="arena">
        <textarea
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Coding arena editor"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              void run();
            }
          }}
        />
        <div className="arena-side">
          <div className="editor-actions">
            {running ? (
              <button className="run-btn" onClick={stop}>
                <Square size={14} /> STOP
              </button>
            ) : (
              <button className="run-btn" onClick={() => void run()}>
                RUN PYTHON <Play size={15} />
              </button>
            )}
            <button
              onClick={() => {
                setCode('');
                setOut('');
              }}
            >
              <RotateCcw size={14} /> CLEAR
            </button>
          </div>
          <div className={`terminal-output ${out.startsWith('ERROR') ? 'error' : ''}`}>
            <div>OUTPUT</div>
            <pre>{out || 'Your output will appear here.'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
function DebuggingDungeon({
  progress,
  setProgress,
}: {
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
}) {
  const [index, setIndex] = useState(0);
  const current = debuggingCases[index];
  const [code, setCode] = useState(current.brokenCode);
  const [result, setResult] = useState('');
  const [running, setRunning] = useState(false);
  const cleared = progress.debugRewards.includes(current.id);
  const runner = useRunner();
  useEffect(() => {
    setCode(current.brokenCode);
    setResult('');
  }, [current.id, current.brokenCode]);
  const run = async () => {
    if (running || cleared) return;
    setRunning(true);
    const r = await runner.run(code);
    if (r.cancelled) {
      setRunning(false);
      return;
    }
    const output = r.error
      ? `ERROR\n${r.error}`
      : r.stderr
        ? `${r.stdout ? `${r.stdout}\n` : ''}${r.stderr}`
        : r.stdout || '(no output)';
    setResult(output);
    setRunning(false);
    if (!r.error && current.successCheck(r.stdout, code))
      setProgress((p) => claimDebugReward(p, current.id));
  };
  const stop = () => {
    if (running) runner.stop();
  };
  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            DEBUGGING DUNGEON // CASE {String(index + 1).padStart(2, '0')}
          </div>
          <h1>{current.title}</h1>
        </div>
        <button
          className="back-btn"
          onClick={() => setIndex((i) => (i + 1) % debuggingCases.length)}
        >
          NEXT CASE →
        </button>
      </div>
      <p className="lead">
        {current.brief} <b>{current.bugType}</b>
      </p>
      <div className="debug-grid">
        <section className="broken">
          <div className="trace-label">BROKEN PROGRAM</div>
          <textarea
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-label={`${current.title} Python program`}
          />
          <div className="editor-actions">
            {running ? (
              <button className="run-btn" onClick={stop}>
                <Square size={14} /> STOP
              </button>
            ) : (
              <button className="run-btn" disabled={cleared} onClick={() => void run()}>
                {cleared ? 'CASE CLEARED' : 'RUN & INSPECT'}
              </button>
            )}
          </div>
          <div className="terminal-output">
            <div>TRACE</div>
            <pre>{result || 'Reproduce the failure first.'}</pre>
          </div>
        </section>
        <section className="method">
          <span>PYTHONSURA // DEBUGGING METHOD</span>
          <h2>Don't patch the symptom.</h2>
          <ol>
            {current.method.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="hint-box">
            <span>HINT</span>
            <p>{current.hint}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
function BossChamber({
  progress,
  unlocked,
  setProgress,
}: {
  progress: Progress;
  unlocked: number;
  setProgress: Dispatch<SetStateAction<Progress>>;
}) {
  const boss = bosses.find((b) => b.layer <= unlocked && !progress.completedBosses.includes(b.id));
  const phaseIndex = boss
    ? Math.min(progress.bossPhaseProgress[boss.id] ?? 0, boss.phases.length - 1)
    : 0;
  const phase = boss?.phases[phaseIndex] as BossPhase | undefined;
  const [code, setCode] = useState(phase?.starterCode ?? '');
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState('');
  const [running, setRunning] = useState(false);
  const [cleared, setCleared] = useState(false);
  const runner = useRunner();
  useEffect(() => {
    setCode(phase?.starterCode ?? '');
    setOutput('');
    setMessage('');
    setCleared(false);
  }, [boss?.id, phaseIndex]);
  if (!boss)
    return (
      <div className="page">
        <div className="panel">
          <h2>NO BOSS AVAILABLE.</h2>
          <p>Clear the current layer. The demons are educationally patient.</p>
        </div>
      </div>
    );
  const run = async () => {
    if (running || cleared) return;
    setRunning(true);
    const visible = await runner.run(code);
    if (visible.cancelled) {
      setRunning(false);
      setMessage('Execution cancelled. No phase progress was recorded.');
      return;
    }
    const judged = await evaluateBossPhase(phase!, code, visible, runner);
    setOutput(
      visible.error
        ? `ERROR\n${visible.error}`
        : visible.stderr
          ? `${visible.stdout ? `${visible.stdout}\n` : ''}${visible.stderr}`
          : visible.stdout || '(no output)',
    );
    setMessage(judged.reason);
    setCleared(judged.passed);
    setRunning(false);
  };
  const stop = () => {
    if (running) runner.stop();
  };
  const advance = () => {
    if (!cleared) return;
    if (phaseIndex < boss.phases.length - 1) {
      setProgress((p) => setBossPhase(p, boss.id, phaseIndex + 1));
      setCleared(false);
    } else setProgress((p) => claimBossReward(p, boss.id, boss.rewardXp));
  };
  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <div className="eyebrow">BOSS CHAMBER // LAYER {boss.layer}</div>
          <h1>{boss.name}</h1>
        </div>
        <span>
          PHASE {phaseIndex + 1}/{boss.phases.length}
        </span>
      </div>
      <div className="boss-panel">
        <div className="boss-sigil">
          <Swords size={60} />
          <span>{boss.name}</span>
        </div>
        <div>
          <div className="eyebrow">{boss.title}</div>
          <p>{boss.intro}</p>
          <h2>{phase!.name}</h2>
          <p>{phase!.objective}</p>
          <small>CONCEPT // {phase!.concept}</small>
          <textarea
            className="boss-editor"
            spellCheck={false}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCleared(false);
            }}
            aria-label="Boss phase Python code"
          />
          <div className="editor-actions">
            {running ? (
              <button className="run-btn" onClick={stop}>
                <Square size={14} /> STOP
              </button>
            ) : (
              <button className="run-btn" disabled={cleared} onClick={() => void run()}>
                {cleared ? 'PHASE CLEARED' : 'RUN CHALLENGE'} <Play size={14} />
              </button>
            )}
            <button onClick={() => setCode(phase!.starterCode)}>
              <RotateCcw size={14} /> RESET
            </button>
          </div>
          <div className="terminal-output">
            <div>JUDGEMENT</div>
            <pre>{output || 'The boss is waiting.'}</pre>
          </div>
          {message && (
            <div className={`feedback ${cleared ? 'success-row' : ''}`} aria-live="polite">
              {message}
            </div>
          )}
          <button className="primary-cta small" disabled={!cleared} onClick={advance}>
            {phaseIndex + 1 === boss.phases.length ? 'DEAL FINAL BLOW' : 'ENTER NEXT PHASE'}{' '}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
