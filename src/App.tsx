import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Bug, ChevronRight, Flame, Home, Play, RotateCcw, Settings, Shield, Skull, Sparkles, Swords, Terminal, Trophy, X } from 'lucide-react';
import { hellLayers } from './domain/curriculum';
import { lessonCatalog } from './domain/lessons';
import { createInitialProgress, loadProgress, saveProgress, awardXp, completeLesson, recordAttempt } from './engine/progress';
import { XP_REWARDS, levelFromXp, xpIntoLevel, xpToNext } from './engine/xp';
import type { Progress } from './types/progress';
import { PythonRunner } from './execution/PythonRunner';

type View = 'command' | 'lesson' | 'curriculum' | 'coding' | 'debugging' | 'bosses' | 'interview' | 'projects';

const nav = [
  ['command', Home, 'Command Center'], ['curriculum', BookOpen, 'Curriculum'], ['coding', Terminal, 'Coding Arena'],
  ['debugging', Bug, 'Debugging Dungeon'], ['bosses', Swords, 'Boss Battles'], ['interview', Shield, 'Interview Arena'], ['projects', Trophy, 'Project Factory'],
] as const;

function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress() ?? createInitialProgress());
  const [view, setView] = useState<View>('command');
  const [selectedLesson, setSelectedLesson] = useState(lessonCatalog[0].id);
  const [gate, setGate] = useState(() => localStorage.getItem('python-from-hell:entered') !== 'yes');

  useEffect(() => saveProgress(progress), [progress]);
  const lesson = lessonCatalog.find(x => x.id === selectedLesson) ?? lessonCatalog[0];
  const unlocked = progress.completedLessons.length === 0 ? 1 : Math.min(12, Math.floor(progress.completedLessons.length / 2) + 1);

  const openLesson = (id = lessonCatalog[0].id) => { setSelectedLesson(id); setView('lesson'); };
  const complete = (id: string, bonus: number) => setProgress(p => awardXp(completeLesson(p, id), XP_REWARDS.lesson + bonus));

  if (gate) return <HellGate onEnter={() => { localStorage.setItem('python-from-hell:entered', 'yes'); setGate(false); }} />;

  return <div className="app-shell">
    <Sidebar view={view} onNavigate={setView} />
    <main className="main-stage">
      <Topbar progress={progress} />
      {view === 'command' && <CommandCenter progress={progress} unlocked={unlocked} onLesson={openLesson} onNavigate={setView} />}
      {view === 'lesson' && <LessonView lesson={lesson} progress={progress} onBack={() => setView('command')} onComplete={complete} setProgress={setProgress} />}
      {view === 'curriculum' && <Curriculum unlocked={unlocked} completed={progress.completedLessons} onLesson={openLesson} />}
      {view === 'coding' && <CodingArena setProgress={setProgress} />}
      {view === 'debugging' && <DebuggingDungeon setProgress={setProgress} />}
      {view === 'bosses' && <Bosses progress={progress} setProgress={setProgress} />}
      {view === 'interview' && <Interview setProgress={setProgress} />}
      {view === 'projects' && <Projects />}
    </main>
  </div>;
}

function HellGate({ onEnter }: { onEnter: () => void }) {
  return <main className="gate-shell"><div className="ember-field" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} />)}</div>
    <header className="brand"><Flame size={20}/><span>PYTHON <b>FROM HELL</b></span><small>v0.2 // THE DESCENT</small></header>
    <section className="gate-content"><div className="eyebrow"><span className="pulse"/> DEVELOPER HELL // GATE 01</div>
      <h1>WELCOME TO<br/><em>PYTHON FROM HELL.</em></h1><p className="hook">Python is easy.</p><p className="pause">That's what they told you.</p>
      <button className="primary-cta" onClick={onEnter}>ENTER HELL <ChevronRight size={20}/></button><p className="microcopy">No fake progress. No fake buttons. You actually have to learn.</p>
    </section><footer className="gate-footer"><span>PYTHONSURA // MENTOR ONLINE</span><span>PYTHON RUNTIME: READY</span><span>12 LAYERS // 1 WAY OUT</span></footer>
  </main>;
}

function Sidebar({view,onNavigate}:{view:View;onNavigate:(v:View)=>void}) { return <aside className="sidebar"><div className="brand compact"><Flame size={20}/><span>PYTHON <b>FROM HELL</b></span></div><div className="layer-badge"><small>YOU ARE HERE</small><strong>LAYER 01</strong><span>THE ENTRANCE</span></div><nav>{nav.map(([id,Icon,label])=><button key={id} className={view===id?'active':''} onClick={()=>onNavigate(id)}><Icon size={17}/><span>{label}</span></button>)}</nav><div className="mentor-mini"><div className="avatar">P</div><div><small>MENTOR</small><strong>PYTHONSURA</strong><span>online • judging</span></div></div></aside>; }

function Topbar({progress}:{progress:Progress}) { const level=levelFromXp(progress.xp); return <header className="topbar"><div><p className="eyebrow">COMMAND NETWORK</p><h2>Good morning, <em>heretic.</em></h2></div><div className="top-stats"><span>LVL <b>{String(level).padStart(2,'0')}</b></span><span>XP <b>{progress.xp}</b></span><span>STREAK <b>{progress.streak}</b></span><button title="Settings"><Settings size={16}/></button></div></header>; }

function CommandCenter({progress,unlocked,onLesson,onNavigate}:{progress:Progress;unlocked:number;onLesson:(id?:string)=>void;onNavigate:(v:View)=>void}) { const next=lessonCatalog.find(l=>!progress.completedLessons.includes(l.id))??lessonCatalog[0]; return <div className="page"><section className="hero-panel"><div><div className="eyebrow"><span className="pulse"/> NEXT MISSION</div><h1>{next.title}</h1><p>{next.brief}</p><div className="mission-meta"><span>{next.minutes} MIN</span><span>{next.difficulty}</span><span>+{XP_REWARDS.lesson} XP</span></div><button className="primary-cta small" onClick={()=>onLesson(next.id)}><Play size={15}/> START LESSON</button></div><CodePreview code={next.starterCode}/></section><div className="stat-grid"><Stat label="HELL LAYER" value={`0${unlocked}`} sub={hellLayers[unlocked-1]?.name ?? 'THE CORE'}/><Stat label="SOUL LEVEL" value={String(levelFromXp(progress.xp)).padStart(2,'0')} sub="PYTHON INTERN"/><Stat label="XP TO NEXT" value={String(xpToNext(progress.xp))} sub="KEEP DIGGING"/><Stat label="STREAK" value={`${progress.streak} DAYS`} sub="CONSISTENCY > CHAOS"/></div><div className="feature-grid"><Feature icon={BookOpen} title="WHAT SHOULD I DO NEXT?" text="The engine picked the next unfinished lesson." action="OPEN MISSION" onClick={()=>onLesson(next.id)}/><Feature icon={Bug} title="DEBUGGING DUNGEON" text="Fix broken Python without begging for the answer." action="ENTER DUNGEON" onClick={()=>onNavigate('debugging')}/><Feature icon={Swords} title="BOSS BATTLES" text="Major layers end with a fight. Your traceback is the weapon." action="VIEW BOSSES" onClick={()=>onNavigate('bosses')}/></div></div>; }

function Stat({label,value,sub}:{label:string;value:string;sub:string}) { return <div className="stat"><small>{label}</small><strong>{value}</strong><span>{sub}</span></div>; }
function Feature({icon:Icon,title,text,action,onClick}:{icon:any;title:string;text:string;action:string;onClick:()=>void}) { return <button className="feature" onClick={onClick}><Icon/><small>{title}</small><p>{text}</p><b>{action} <ChevronRight size={14}/></b></button>; }
function CodePreview({code}:{code:string}) { return <div className="lesson-terminal"><div className="terminal-top"><span/><span/><span/><label>lesson.py</label></div><pre>{code}</pre></div>; }

function LessonView({lesson,progress,onBack,onComplete,setProgress}:{lesson:any;progress:Progress;onBack:()=>void;onComplete:(id:string,bonus:number)=>void;setProgress:React.Dispatch<React.SetStateAction<Progress>>}) { const [code,setCode]=useState(lesson.starterCode); const [output,setOutput]=useState('Runtime standing by.'); const [running,setRunning]=useState(false); const [hint,setHint]=useState(0); const [done,setDone]=useState(progress.completedLessons.includes(lesson.id)); const runner=useMemo(()=>new PythonRunner(),[]); useEffect(()=>()=>runner.dispose(),[runner]); const run=async()=>{setRunning(true);setOutput('Executing in isolated Python runtime…');const r=await runner.run(code);setOutput(r.error?`ERROR\n${r.error}`:r.stdout||'(no output)');setRunning(false);if(!r.error&&lesson.expectedOutput&&r.stdout.trim()===lesson.expectedOutput.trim()){setDone(true);onComplete(lesson.id,hint===0?15:0);}}; return <div className="page"><button className="back-btn" onClick={onBack}>← COMMAND CENTER</button><div className="lesson-layout"><section className="lesson-brief"><div className="eyebrow">LAYER {String(lesson.layer).padStart(2,'0')} // {lesson.topic.toUpperCase()}</div><h1>{lesson.title}</h1><p className="lead">{lesson.explanation}</p><div className="teach-card"><strong>PYTHONSURA</strong><p>{lesson.roast}</p></div><div className="hint-box"><span>HINT {hint + 1}/{lesson.hints.length}</span><p>{lesson.hints[Math.min(hint,lesson.hints.length-1)]}</p><button onClick={()=>setHint(Math.min(hint+1,lesson.hints.length-1))}>REVEAL NEXT HINT</button></div></section><section className="editor-panel"><div className="editor-head"><span>CHALLENGE // {lesson.difficulty}</span><span>{done?'✓ MASTERED':'NOT YET DEAD'}</span></div><textarea spellCheck={false} value={code} onChange={e=>setCode(e.target.value)} aria-label="Python code editor"/><div className="editor-actions"><button className="run-btn" onClick={run} disabled={running}>{running?'RUNNING…':'RUN CODE'} <Play size={14}/></button><button onClick={()=>setCode(lesson.starterCode)}><RotateCcw size={14}/> RESET</button></div><div className={`terminal-output ${output.startsWith('ERROR')?'error':''}`}><div>TERMINAL OUTPUT</div><pre>{output}</pre></div><div className="success-row">{done?<><Sparkles size={16}/> Challenge cleared. XP awarded. Next layer awaits.</>:<>Expected output: <b>{lesson.expectedOutput}</b></>}</div></section></div></div>; }

function Curriculum({unlocked,completed,onLesson}:{unlocked:number;completed:string[];onLesson:(id:string)=>void}) { return <div className="page"><div className="section-heading"><div><div className="eyebrow">THE DESCENT</div><h1>12 LAYERS OF HELL</h1></div><span>{completed.length} LESSONS CLEARED</span></div><div className="curriculum-grid">{hellLayers.map(layer=><article key={layer.id} className={`layer-card ${layer.number<=unlocked?'open':'locked'}`}><div className="layer-number">{String(layer.number).padStart(2,'0')}</div><div><small>LAYER {String(layer.number).padStart(2,'0')}</small><h3>{layer.name}</h3><p>{layer.tagline}</p><div className="topic-list">{layer.topics.map(t=><span key={t}>{t}</span>)}</div>{layer.number<=unlocked&&<button onClick={()=>onLesson(lessonCatalog.find(l=>l.layer===layer.number)?.id??lessonCatalog[0].id)}>ENTER LAYER <ChevronRight size={14}/></button>}</div></article>)}</div></div>; }

function CodingArena({setProgress}:{setProgress:React.Dispatch<React.SetStateAction<Progress>>}) { const [code,setCode]=useState('def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("heretic"))');const [out,setOut]=useState('');const runner=useMemo(()=>new PythonRunner(),[]);useEffect(()=>()=>runner.dispose(),[runner]);return <div className="page"><div className="section-heading"><div><div className="eyebrow">CODING ARENA</div><h1>WRITE. RUN. SURVIVE.</h1></div></div><div className="arena"><textarea spellCheck={false} value={code} onChange={e=>setCode(e.target.value)}/><div className="arena-side"><button className="run-btn" onClick={async()=>{const r=await runner.run(code);setOut(r.error??r.stdout);if(!r.error)setProgress(p=>awardXp(p,XP_REWARDS.challenge));}}>RUN PYTHON <Play size={15}/></button><div className="terminal-output"><div>OUTPUT</div><pre>{out||'Your output will appear here.'}</pre></div></div></div></div>; }

function DebuggingDungeon({setProgress}:{setProgress:React.Dispatch<React.SetStateAction<Progress>>}) { const [fixed,setFixed]=useState(false);const [code,setCode]=useState('def add_item(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nprint(add_item("fire"))\nprint(add_item("brimstone"))');return <div className="page"><div className="section-heading"><div><div className="eyebrow">DEBUGGING DUNGEON // CASE 001</div><h1>THE MUTABLE DEFAULT</h1></div></div><div className="debug-grid"><section className="broken"><div className="trace-label">BROKEN PROGRAM</div><textarea spellCheck={false} value={code} onChange={e=>setCode(e.target.value)}/><button className="run-btn" onClick={()=>{if(!code.includes('bucket=None'))setFixed(false);else{setFixed(true);setProgress(p=>awardXp(p,XP_REWARDS.debug));}}}>{fixed?'CASE CLEARED':'SUBMIT FIX'}</button></section><section className="method"><span>PYTHONSURA // DEBUGGING METHOD</span><h2>Don't patch the symptom.</h2><ol><li>Reproduce the bug.</li><li>Read the traceback/output.</li><li>Identify state that survives between calls.</li><li>Make the smallest safe fix.</li></ol><div className="hint-box"><span>HINT</span><p>Default arguments are created once when the function is defined. Try using <code>None</code> as the sentinel.</p></div></section></div></div>; }

function Bosses({progress,setProgress}:{progress:Progress;setProgress:React.Dispatch<React.SetStateAction<Progress>>}) { const [cleared,setCleared]=useState(false);return <div className="page"><div className="section-heading"><div><div className="eyebrow">BOSS CHAMBER</div><h1>THE FIRST BOSS</h1></div></div><div className="boss-panel"><div className="boss-sigil"><Skull size={60}/><span>LOOP DEMON</span></div><div><div className="eyebrow">LAYER 03 // BOSS</div><h2>“You think you understand loops?”</h2><p>Survive three escalating tasks: iteration, control flow, and nested loops.</p><button className="primary-cta small" onClick={()=>{setCleared(true);setProgress(p=>awardXp(p,XP_REWARDS.boss));}}>{cleared?'BOSS SLAIN':'START BATTLE'} <Swords size={16}/></button>{cleared&&<div className="success-row"><Sparkles size={16}/> LOOP DEMON defeated. +{XP_REWARDS.boss} XP.</div>}</div></div></div>; }

function Interview({setProgress}:{setProgress:React.Dispatch<React.SetStateAction<Progress>>}) { const [q,setQ]=useState(0);const [answer,setAnswer]=useState('');const [feedback,setFeedback]=useState('');const questions=['What is the difference between == and is in Python?','Why are mutable default arguments dangerous?','What does a generator yield that a list does not?'];return <div className="page"><div className="section-heading"><div><div className="eyebrow">INTERVIEW BATTLE ARENA</div><h1>THE INTERVIEWER DEMON</h1></div><span>ROUND {q+1}/3</span></div><div className="interview-card"><div className="demon"><Skull/><span>RECRUITER</span></div><h2>{questions[q]}</h2><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Answer like your rent depends on it…"/><button className="primary-cta small" onClick={()=>{setFeedback(answer.trim().length>25?'Good. Now defend that answer with an example.':'Too thin. Explain the mechanism, not just the slogan.');if(q<2)setQ(q+1);setProgress(p=>awardXp(p,XP_REWARDS.interview));}}>SUBMIT ANSWER <ChevronRight size={15}/></button>{feedback&&<div className="feedback">{feedback}</div>}</div></div>; }

function Projects() { const projects=[['HELL CALCULATOR','Build a CLI calculator with validation and clean functions.','BEGINNER'],['TRACEBACK ANALYZER','Parse Python errors and group them by failure type.','INTERMEDIATE'],['RUNTIME INSPECTOR','Explore bytecode and object behavior with a small diagnostic tool.','ADVANCED']];return <div className="page"><div className="section-heading"><div><div className="eyebrow">PROJECT FACTORY</div><h1>BUILD SOMETHING THAT BREAKS</h1></div></div><div className="project-grid">{projects.map(([name,text,diff])=><article className="project-card" key={name}><small>{diff}</small><h2>{name}</h2><p>{text}</p><div className="project-bar"><span/><b>0%</b></div><button onClick={()=>alert('Project workspace unlocks as the project engine is activated.')}>VIEW SPEC <ChevronRight size={14}/></button></article>)}</div></div>; }

export default App;
