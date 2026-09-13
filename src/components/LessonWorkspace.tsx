import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Play, RotateCcw, Sparkles, ShieldCheck, Square } from 'lucide-react';
import type { Lesson } from '../domain/lessons';
import type { Progress } from '../types/progress';
import { evaluateLessonChallenge } from '../engine/challengeRunner';
import { PythonRunner } from '../execution/PythonRunner';
import { claimLessonReward, completeLesson, recordAttempt } from '../engine/progress';
import { XP_REWARDS } from '../engine/xp';
import { playSfx } from '../engine/audio';
import { TutorGuide } from './TutorGuide';

type Props = {
  lesson: Lesson;
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
  onBack: () => void;
  onNextLesson: (id: string) => void;
};
const DRAFTS_KEY = 'python-from-hell:lesson-drafts:v1';
const LESSON_IDS = [
  'l1_print',
  'l1_comments',
  'l1_variables',
  'l1_strings',
  'l1_numbers',
  'l1_booleans',
  'l1_input',
  'l1_conversion',
  'l2_if',
  'l2_comparison',
  'l2_logical',
  'l2_nested',
  'l3_for',
  'l3_while',
  'l3_range',
  'l3_break',
  'l3_continue',
  'l4_lists',
  'l4_tuples',
  'l4_sets',
  'l4_dicts',
  'l4_slicing',
  'l5_functions',
  'l5_params',
  'l5_defaults',
  'l5_args_kwargs',
  'l5_scope',
  'l5_lambda',
  'l5_return',
  'l5_recursion',
  'l6_classes',
  'l6_init',
  'l6_methods',
  'l6_inheritance',
  'l6_polymorphism',
  'l6_encapsulation',
  'l7_try',
  'l7_except',
  'l7_finally',
  'l7_raise',
  'l7_custom',
  'l7_context',
  'l8_modules',
  'l8_import',
  'l8_iterators',
  'l8_generators',
  'l8_decorators',
  'l8_descriptors',
  'l9_threads',
  'l9_lock',
  'l9_race',
  'l9_async',
  'l9_tasks',
  'l9_process',
  'l10_refcount',
  'l10_gc',
  'l10_cycle',
  'l10_copy',
  'l10_memory_profile',
  'l10_slots',
  'l11_bytecode',
  'l11_frames',
  'l11_eval',
  'l11_gil',
  'l11_free_threading',
  'l11_jit',
  'l11_cpython_build',
  'l11_extensions',
  'l12_core_arch',
  'l12_object_model',
  'l12_ceval',
  'l12_interview',
  'l12_final',
];
function loadDraft(id: string, starter: string) {
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}') as Record<string, unknown>;
    return typeof drafts[id] === 'string' ? (drafts[id] as string) : starter;
  } catch {
    return starter;
  }
}
function saveDraft(id: string, code: string) {
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}') as Record<string, unknown>;
    drafts[id] = code;
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {}
}
function clearDraft(id: string) {
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}') as Record<string, unknown>;
    delete drafts[id];
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {}
}
export function LessonWorkspace({ lesson, progress, setProgress, onBack, onNextLesson }: Props) {
  const stats = progress.attempts[lesson.id];
  const [code, setCode] = useState(() => loadDraft(lesson.id, lesson.starterCode));
  const [output, setOutput] = useState('Runtime standing by.');
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [message, setMessage] = useState('');
  const [privateChecked, setPrivateChecked] = useState(false);
  const [hintsThisAttempt, setHintsThisAttempt] = useState(0);
  const runner = useMemo(() => new PythonRunner(), []);
  useEffect(() => () => runner.dispose(), [runner]);
  useEffect(() => {
    setCode(loadDraft(lesson.id, lesson.starterCode));
    setOutput('Runtime standing by.');
    setMessage('');
    setPrivateChecked(false);
    setHintsThisAttempt(0);
    setStartedAt(Date.now());
  }, [lesson.id, lesson.starterCode]);
  const done = progress.completedLessons.includes(lesson.id);
  const updateCode = (value: string) => {
    setCode(value);
    saveDraft(lesson.id, value);
  };
  const onHintUsed = () => setHintsThisAttempt((value) => value + 1);
  const run = async () => {
    if (running || done) return;
    setRunning(true);
    setMessage('');
    setPrivateChecked(false);
    setOutput('PYTHONSURA is watching the runtime…');
    const result = await runner.run(code);
    if (result.cancelled) {
      setRunning(false);
      setMessage('Execution cancelled. No attempt was recorded.');
      setStartedAt(Date.now());
      return;
    }
    const elapsed = Date.now() - startedAt;
    const judged = await evaluateLessonChallenge(lesson, code, result, runner);
    const success = judged.passed;
    const outcome = result.timedOut
      ? 'timeout'
      : success
        ? 'success'
        : result.error
          ? 'runtime-error'
          : 'failure';
    const hintUsed = hintsThisAttempt > 0;
    const tracked = recordAttempt(progress, lesson.id, success, hintUsed, elapsed, outcome);
    const record = tracked.attempts[lesson.id];
    const mastered = success && record.successes >= 3 && record.mastery >= 82;
    const reason = result.error ? `ERROR: ${result.error}` : judged.reason;
    setOutput(
      result.error
        ? `ERROR\n${result.error}`
        : result.stderr
          ? `${result.stdout ? result.stdout + '\n' : ''}${result.stderr}`
          : result.stdout || '(no output)',
    );
    setPrivateChecked(Boolean(judged.hiddenChecked));
    if (progress.settings.sound)
      playSfx(outcome !== 'success' ? 'fail' : mastered ? 'success' : 'enter');
    setProgress((p) => {
      if (!success || !mastered)
        return recordAttempt(p, lesson.id, success, hintUsed, elapsed, outcome);
      const completed = completeLesson(
        record
          ? {
              ...p,
              attempts: { ...p.attempts, [lesson.id]: record },
              mastery: { ...p.mastery, [lesson.id]: record.mastery },
            }
          : p,
        lesson.id,
      );
      const cleanXp = hintUsed ? 0 : XP_REWARDS.noHint;
      return claimLessonReward(
        completed,
        lesson.id,
        XP_REWARDS.lesson + XP_REWARDS.challenge + cleanXp,
        !hintUsed,
      );
    });
    setMessage(
      mastered
        ? `CONCEPT MASTERED — ${judged.reason}`
        : success
          ? `PASS — ${judged.reason} Mastery is ${Math.round(record.mastery)}%. I am making you prove it again.`
          : `${reason} Attempt ${record.attempts} recorded.`,
    );
    setRunning(false);
    setHintsThisAttempt(0);
    setStartedAt(Date.now());
  };
  const stop = () => {
    if (!running) return;
    runner.stop();
    setOutput('ERROR\nExecution stopped by user.');
    setMessage('Execution cancelled. No attempt was recorded.');
    setRunning(false);
    setStartedAt(Date.now());
  };
  const reset = () => {
    clearDraft(lesson.id);
    setCode(lesson.starterCode);
    setOutput('Runtime standing by.');
    setMessage('Starter spell restored.');
    setPrivateChecked(false);
    setHintsThisAttempt(0);
    setStartedAt(Date.now());
  };
  const index = LESSON_IDS.indexOf(lesson.id);
  const nextLesson = index >= 0 ? LESSON_IDS[index + 1] : undefined;
  return (
    <div className="page lesson-page">
      <div className="lesson-breadcrumb">
        <span>THE DESCENT</span>
        <b>WARD {String(lesson.layer).padStart(2, '0')}</b>
        <span>MISSION {String(index + 1).padStart(2, '0')}</span>
        <button className="lesson-exit" onClick={onBack}>
          EXIT LESSON
        </button>
      </div>
      <TutorGuide
        lesson={lesson}
        stats={stats}
        output={output}
        message={message}
        userCode={code}
        sound={progress.settings.sound}
        roastIntensity={progress.settings.roastIntensity}
        completed={done}
        onHintUsed={onHintUsed}
        onAdvance={() => (nextLesson ? onNextLesson(nextLesson) : onBack())}
      />
      <section className="editor-panel lesson-editor">
        <div className="editor-head">
          <span>LIVE PYTHON SPELL</span>
          <span>
            {done ? '✓ CONCEPT MASTERED' : running ? 'PYTHONSURA IS WATCHING' : 'YOUR MOVE'}
          </span>
        </div>
        <textarea
          spellCheck={false}
          value={code}
          onChange={(e) => updateCode(e.target.value)}
          aria-label="Python code editor"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              void run();
            }
          }}
        />
        <div className="editor-actions">
          {running ? (
            <button className="run-btn" onClick={stop}>
              <Square size={14} /> STOP
            </button>
          ) : (
            <button className="run-btn" onClick={() => void run()} disabled={done}>
              {done ? 'MASTERED' : 'RUN SPELL'} <Play size={14} />
            </button>
          )}
          <button onClick={reset}>
            <RotateCcw size={14} /> RESET
          </button>
          <span className="shortcut">CTRL/CMD + ENTER</span>
        </div>
        <div className={`terminal-output ${output.startsWith('ERROR') ? 'error' : ''}`}>
          <div>RUNTIME RESULT</div>
          <pre>{output}</pre>
        </div>
        {message && (
          <div className={`feedback ${done ? 'success-row' : ''}`} aria-live="polite">
            <Sparkles size={15} />
            {message}
          </div>
        )}
        <div className="success-row">
          <span>
            Target: <b>{lesson.expectedOutput || 'behavior test'}</b>
          </span>
          {privateChecked && (
            <span>
              Behavior verified <ShieldCheck size={15} />
            </span>
          )}
          {hintsThisAttempt > 0 && (
            <span>
              {hintsThisAttempt} hint{hintsThisAttempt === 1 ? '' : 's'} used
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
