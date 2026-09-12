import { useState } from 'react';
import { Flame, Skull, Zap, ChevronRight, BookOpen, Swords, Terminal, Shield } from 'lucide-react';

type GateMode = 'welcome' | 'briefing' | 'entered';

const stats = [
  ['CURRENT LAYER','01','THE ENTRANCE'],
  ['SOUL LEVEL','01','PYTHON INTERN'],
  ['XP','000','NEXT: 100'],
  ['STREAK','0 DAYS','START TODAY'],
] as const;

function App() {
  const [mode, setMode] = useState<GateMode>('welcome');

  if (mode !== 'entered') return <HellGate mode={mode} onEnter={() => setMode('entered')} />;

  return <Dashboard />;
}

function HellGate({ mode, onEnter }: { mode: GateMode; onEnter: () => void }) {
  return (
    <main className="gate-shell">
      <div className="ember-field" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
      <header className="brand"><Flame size={20} /><span>PYTHON <b>FROM HELL</b></span><small>v0.1 // THE DESCENT</small></header>
      <section className="gate-content">
        <div className="eyebrow"><span className="pulse"/> DEVELOPER HELL // GATE 01</div>
        {mode === 'welcome' ? <>
          <h1>WELCOME TO<br/><em>PYTHON FROM HELL.</em></h1>
          <p className="hook">Python is easy.</p>
          <p className="pause">That's what they told you.</p>
          <button className="primary-cta" onClick={() => onEnter()}><span>ENTER HELL</span><ChevronRight size={20}/></button>
          <p className="microcopy">No tutorial hell. No fake progress. You actually have to learn.</p>
        </> : <>
          <h1>THE GATE<br/><em>IS OPEN.</em></h1>
          <p className="pause">Your descent begins with the only command that matters:</p>
          <div className="terminal-card"><span className="prompt">$</span> python <strong>survive.py</strong><span className="cursor">▮</span></div>
          <button className="primary-cta" onClick={onEnter}><span>BEGIN DESCENT</span><ChevronRight size={20}/></button>
        </>}
      </section>
      <footer className="gate-footer"><span>PYTHONSURA // MENTOR ONLINE</span><span>RUNTIME: STANDBY</span><span>12 LAYERS // 1 WAY OUT</span></footer>
    </main>
  );
}

function Dashboard() {
  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand compact"><Flame size={20}/><span>PYTHON <b>FROM HELL</b></span></div>
      <div className="layer-badge"><small>YOU ARE HERE</small><strong>LAYER 01</strong><span>THE ENTRANCE</span></div>
      <nav>
        <a className="active"><Zap size={17}/>Command Center</a><a><BookOpen size={17}/>Curriculum</a><a><Terminal size={17}/>Coding Arena</a><a><Skull size={17}/>Debugging Dungeon</a><a><Swords size={17}/>Boss Battles</a><a><Shield size={17}/>Interview Arena</a>
      </nav>
      <div className="mentor-mini"><div className="avatar">P</div><div><small>MENTOR</small><strong>PYTHONSURA</strong><span>online • judging</span></div></div>
    </aside>
    <section className="dashboard">
      <header className="dash-header"><div><p className="eyebrow">COMMAND CENTER</p><h2>Good morning, <em>heretic.</em></h2></div><button className="settings">MILD ROAST <span>ON</span></button></header>
      <div className="stat-grid">{stats.map(([label,value,sub]) => <div className="stat" key={label}><small>{label}</small><strong>{value}</strong><span>{sub}</span></div>)}</div>
      <section className="next-mission"><div className="mission-copy"><div className="eyebrow"><span className="pulse"/> NEXT MISSION</div><h3>Speak, mortal.</h3><p>Your first lesson: <b>print()</b>, comments, and the terrifying concept of telling a computer what to say.</p><div className="mission-meta"><span>10 MIN</span><span>BEGINNER</span><span>+25 XP</span></div><button className="primary-cta small">START LESSON <ChevronRight size={18}/></button></div><div className="lesson-terminal"><div className="terminal-top"><span/><span/><span/> <label>lesson_01.py</label></div><pre><span className="muted"># The first command</span>{'\n'}print(<span className="string">"hello, hell"</span>){'\n'}<span className="muted"># Congratulations.</span>{'\n'}<span className="muted"># It begins.</span></pre></div></section>
      <section className="lower-grid"><div className="panel"><div className="panel-title"><span>YOUR DESCENT</span><small>1 / 12 LAYERS</small></div><div className="layer-track"><div className="layer done">01</div><div className="connector"/><div className="layer locked">02</div><div className="connector"/><div className="layer locked">03</div><div className="connector"/><div className="layer locked">04</div><div className="connector"/><div className="layer locked">05</div></div><p className="panel-note">Master the basics to unlock the next pit.</p></div><div className="panel status"><div className="panel-title"><span>SOUL STATUS</span><small>SIMULATION</small></div><div className="meter"><span>MENTAL RAM</span><b>08%</b><i><u style={{width:'8%'}}/></i></div><div className="meter"><span>STACK INTEGRITY</span><b>100%</b><i><u style={{width:'100%'}}/></i></div><div className="meter"><span>GC THREAT</span><b>LOW</b><i><u style={{width:'18%'}}/></i></div></div></section>
    </section>
  </main>;
}

export default App;