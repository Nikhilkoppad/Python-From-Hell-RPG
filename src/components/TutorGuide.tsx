import {useEffect,useMemo,useRef,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Brain,ChevronRight,MessageCircle,Mic,MicOff,Play,Send,Sparkles,Zap} from 'lucide-react';
import type {Lesson} from '../domain/lessons';
import type {AttemptStats,RoastIntensity} from '../types/progress';
import {askMentor,createOllamaProvider,type MentorMode,MentorChatTurn} from '../ai/mentor';
import {playSfx} from '../engine/audio';

type Stage='story'|'assess'|'teach'|'try'|'retry'|'mastered';
type Props={lesson:Lesson;stats?:AttemptStats;output:string;message:string;userCode:string;sound:boolean;roastIntensity:RoastIntensity;completed:boolean;onHintUsed:()=>void;onAdvance:()=>void};
type Chat={role:'user'|'assistant';text:string};
type Disturbance={emoji:string;title:string;text:string};

const STORY:Record<number,string>={
  1:'You wake inside the CPython Execution Crater. Broken scripts crawl through the smoke. PYTHONSURA drops from the ceiling like an angry production incident: “You want Python? Fine. I will teach you before the interpreter eats you.”',
  2:'The floor splits into branching paths. PYTHONSURA draws a glowing decision tree in the air: “Python is not reading your mind. You tell it what happens next.”',
  3:'A corridor repeats forever. PYTHONSURA stares at you, then at the loop: “Someone forgot the exit condition. Congratulations. You found production.”',
  4:'Cursed containers rise from the dark. “Stop stabbing data structures at random,” PYTHONSURA says. “Learn which beast fits the job.”',
  5:'You enter the Function Forge. “Write it once. Call it ten times. Stop copy-pasting your own damn bug,” PYTHONSURA grins.',
  6:'The Object Crypt opens. “State plus behavior. No magic. Learn the mechanism, then make it obey you.”',
  7:'Tracebacks cover the floor. “Errors are evidence. Read the damn evidence,” PYTHONSURA says, kicking a traceback toward you.',
  8:'You descend into Runtime Hell. “Separate Python the language from CPython the machine. They are cousins, not twins.”',
  9:'Timelines collide. Threads race through one doorway. “Timing bugs do not care how confident you are.”',
  10:'Objects leave reference trails in the dark. “Learn who keeps them alive. Memory does not forgive vibes.”',
  11:'Opcodes and frames surround you. “Version labels or get wrecked by reality,” PYTHONSURA says.',
  12:'The Core opens. “You are not here to memorize Python anymore. You are here to command it.”',
};

const DISTURBANCES:Disturbance[]=[
  {emoji:'🚨',title:'PYTHON INTERRUPT',text:'Your code has been intercepted by the Department of Suspicious Indentation.'},
  {emoji:'📡',title:'MEME DROP',text:'Breaking news: a developer just said “it works on my machine.” The machine is now on trial.'},
  {emoji:'🧨',title:'VARIABLE ESCAPED',text:'A variable has left its assigned scope. PYTHONSURA is hunting it with a debugger.'},
  {emoji:'📞',title:'SENIOR ENGINEER CALL',text:'Explain the next line without saying “it just works.” You have 10 seconds. Good luck, soldier.'},
  {emoji:'🪦',title:'TRACEBACK GRAVE',text:'Something died. Do not guess. Read the last useful line of the traceback.'},
  {emoji:'🤡',title:'CODE REVIEW ALERT',text:'Someone reviewed your code and replied: “Interesting.” This is not a compliment.'},
  {emoji:'🧠',title:'BRAIN CELL REPORT',text:'Two neurons have connected. Do not scare them. Keep the concept tiny.'},
  {emoji:'🔥',title:'HELL WEATHER',text:'The runtime temperature is emotionally unsafe. Your job remains: write one correct line.'},
];

const QUICK_PROMPTS=['Explain like I am five.','Why does this work?','Roast my code.','Give me one tiny hint.'];
const DISTRACTORS=['It changes CPU temperature.','It always mutates the original object.','It is guaranteed by every Python implementation.'];

function roast(line:string,intensity:RoastIntensity){
  if(intensity==='MILD')return `PYTHONSURA: ${line}`;
  if(intensity==='SAVAGE')return `PYTHONSURA: ${line} One mistake is survivable. Repeating it without reading the error is a lifestyle choice.`;
  return `PYTHONSURA: ${line} Your traceback has developed a personal grudge. Read it before touching another damn line.`;
}

function lessonTip(lesson:Lesson){
  const topic=lesson.topic.toLowerCase();
  if(/print/.test(topic))return 'Think value → call → output. Give Python a thing, then watch what comes back.';
  if(/variable|assignment|binding/.test(topic))return 'Think name → object. A variable is a label pointing at an object, not a tiny storage box.';
  if(/if|comparison|logical/.test(topic))return 'Think fact → decision → path. First decide what is true; then let Python choose the branch.';
  if(/loop|range|iteration|break|continue/.test(topic))return 'Think start → repeat → update → stop. A loop without an exit is just a production incident with better punctuation.';
  if(/list|tuple|set|dict|collection|slice/.test(topic))return 'Pick the data structure first. Then choose the operation that matches the job instead of stabbing at it randomly.';
  if(/function|parameter|argument|return|scope|recursion|lambda|decorator|generator/.test(topic))return 'Think input → behavior → output. Keep the spell small enough that you can explain every line out loud.';
  if(/exception|error|raise|finally|try/.test(topic))return 'Think failure → evidence → recovery. The traceback is the snitch. Listen to the snitch.';
  if(/class|object|inherit|polymorphism|encapsulation|descriptor|mro/.test(topic))return 'Think state + behavior + lookup. Objects are mechanisms, not decorative boxes.';
  if(/async|thread|process|lock|race|concurrency|task/.test(topic))return 'Think who runs when and what state is shared. Timing bugs do not care about confidence.';
  if(/memory|gc|refcount|bytecode|cpython|jit|runtime/.test(topic))return 'Think language guarantee first, CPython implementation detail second. Version labels save careers.';
  return `Predict what ${lesson.topic} does before typing.`;
}

function teacherBites(lesson:Lesson){
  return [
    {label:'THE IDEA',title:lesson.topic,body:lesson.explanation,action:'NEXT — SHOW ME'},
    {label:'WATCH ONE',title:'PYTHONSURA DEMONSTRATES',body:`${lessonTip(lesson)} Watch the tiny spell, then close your eyes and tell me what each line is doing.`,action:'I CAN EXPLAIN IT'},
    {label:'YOUR TURN',title:'ONE SMALL MISSION',body:`Write the smallest code that proves you understand ${lesson.topic}. I will run it, judge it, roast it, and teach the part you missed.`,action:'ENTER THE ARENA'},
  ];
}

function speak(text:string,enabled:boolean){
  if(!enabled||typeof window==='undefined'||!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text.replace(/[`*_#]/g,''));
  utterance.rate=.96;utterance.pitch=1.02;utterance.volume=.9;
  window.speechSynthesis.speak(utterance);
}

export function TutorGuide({lesson,stats,output,message,userCode,sound,roastIntensity,completed,onHintUsed,onAdvance}:Props){
  const reduced=useReducedMotion();
  const [stage,setStage]=useState<Stage>('story');
  const [answer,setAnswer]=useState<number|null>(null);
  const [teachStep,setTeachStep]=useState(0);
  const [input,setInput]=useState('');
  const [chats,setChats]=useState<Chat[]>([]);
  const [asking,setAsking]=useState(false);
  const [mode,setMode]=useState<MentorMode>('teacher');
  const [voice,setVoice]=useState(true);
  const [disturbance,setDisturbance]=useState(0);
  const lastMessage=useRef(message);
  const bites=useMemo(()=>teacherBites(lesson),[lesson]);
  const mastery=Math.round(stats?.mastery??0);
  const attempts=stats?.attempts??0;
  const successes=stats?.successes??0;
  const current=DISTURBANCES[disturbance%DISTURBANCES.length];
  const optionSet=useMemo(()=>[lesson.explanation.split('. ')[0],DISTRACTORS[(lesson.layer+lesson.title.length)%DISTRACTORS.length],'It is only visual formatting.','It never changes program behavior.'],[lesson]);
  const meme=completed||stage==='mastered'?'🧠🔥 BRAIN CELLS: DANGEROUS':attempts===0?'🧠 2 BRAIN CELLS ONLINE':stats?.lastOutcome==='runtime-error'?'💀 TRACEBACK GOT YOUR ASS':stats?.lastOutcome==='failure'?'🤡 YOU WROTE THAT ON PURPOSE?':'🫠 PYTHON IS JUDGING YOU';

  useEffect(()=>{setStage('story');setAnswer(null);setTeachStep(0);setInput('');setChats([]);setDisturbance(0);lastMessage.current=''},[lesson.id]);
  useEffect(()=>{if(completed)setStage('mastered');else if(stats?.lastOutcome)setStage('retry')},[completed,stats?.lastOutcome]);
  useEffect(()=>{const timer=window.setInterval(()=>setDisturbance(v=>{if(sound)playSfx('enter');return v+1}),7200);return()=>window.clearInterval(timer)},[sound]);
  useEffect(()=>{
    if(message&&message!==lastMessage.current){
      lastMessage.current=message;
      if(!completed)speak(stats?.lastOutcome==='success'?'Good. That run was correct, but I need you to prove you understand it.':roast(message,roastIntensity),voice);
    }
  },[message,completed,roastIntensity,stats?.lastOutcome,voice]);

  const transition=(next:Stage)=>{setStage(next);if(sound)playSfx(next==='mastered'?'success':next==='teach'?'enter':'enter');const lines:Record<Stage,string>={story:'Welcome to the crater.',assess:'Before I teach you, I need to see how you think.',teach:bites[teachStep]?.body??'',try:'Your turn. One tiny spell. No copying.',retry:'Nope. We are not leaving until your brain understands this.',mastered:'Excellent. That concept is now installed.',};speak(lines[next],voice);};

  const pick=(i:number)=>{setAnswer(i);if(i===0){setTeachStep(0);transition('teach')}else{if(sound)playSfx('fail');setStage('assess');speak(roast('Nope. That is not the idea. But good — now I know what to teach you.',roastIntensity),voice)}};

  const ask=async(textOverride?:string)=>{
    const text=(textOverride??input).trim();if(!text||asking)return;
    setAsking(true);setChats(c=>[...c,{role:'user',text}]);setInput('');
    const history:MentorChatTurn[]=chats.map(c=>({role:c.role,content:c.text}));
    const reply=await askMentor({mode,lessonTitle:lesson.title,topic:lesson.topic,userCode,output:`${output}\n${message}\nLearner: ${text}`,mastery,recentMistakes:stats?.lastOutcome&&stats.lastOutcome!=='success'?[stats.lastOutcome]:[],chatHistory:history},createOllamaProvider('/ollama/api','gemma4:latest'));
    setChats(c=>[...c,{role:'assistant',text:reply.text}]);
    setAsking(false);speak(reply.text,voice);
  };

  const quickAsk=(prompt:string)=>{void ask(prompt)};
  const revealHint=()=>{if(!lesson.hints.length)return;onHintUsed();const nextIndex=Math.min((stats?.hintsUsed??0),lesson.hints.length-1);setChats(c=>[...c,{role:'assistant',text:`NUDGE: ${lesson.hints[nextIndex]}`}]);speak(`Tiny hint: ${lesson.hints[nextIndex]}`,voice)};
  const teachNext=()=>{if(teachStep<bites.length-1){const next=teachStep+1;setTeachStep(next);if(sound)playSfx('enter');speak(bites[next].body,voice)}else transition('try')};

  return <section className="tutor-shell" aria-label="PYTHONSURA living tutor">
    <div className="tutor-scanline" aria-hidden="true"/>
    <div className="tutor-header">
      <div className="tutor-avatar-wrap">
        <motion.div className="tutor-avatar" animate={reduced?undefined:{boxShadow:['0 0 18px #ff5c3930','0 0 44px #ff5c3960','0 0 18px #ff5c3930']}} transition={{duration:2.8,repeat:Infinity}}>
          <Brain size={23}/><span className="avatar-eye eye-one"/><span className="avatar-eye eye-two"/>
        </motion.div>
        <div><small>PYTHONSURA // LIVE TEACHER</small><strong>JARVIS FOR PYTHON</strong></div>
      </div>
      <div className="tutor-controls"><span className="ai-live"><i/> GEMMA 4 // LOCAL</span><button onClick={()=>setVoice(v=>!v)} title={voice?'Mute tutor voice':'Enable tutor voice'}>{voice?<Mic size={13}/>:<MicOff size={13}/>} {voice?'VOICE':'MUTED'}</button></div>
    </div>

    <div className="tutor-stagebar"><span>LESSON {lesson.title.toUpperCase()}</span><div>{['STORY','CHECK','TEACH','TRY','MASTER'].map(label=><b key={label} className={['story','assess','teach','try','retry','mastered'].indexOf(stage)>=['STORY','CHECK','TEACH','TRY','TRY','MASTER'].indexOf(label)?'lit':''}>{label}</b>)}</div><span>{attempts?`ATTEMPT ${attempts+1}`:'FIRST RUN'}</span></div>

    <div className="tutor-theatre">
      <div className="teacher-scene">
        <AnimatePresence mode="wait">
          <motion.div key={`${stage}-${teachStep}`} className="teacher-speech" initial={reduced?{opacity:0}:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={reduced?{opacity:0}:{opacity:0,y:-8}} transition={{duration:.28}}>
            <div className="speech-meta"><span>{stage==='story'?'OPENING SCENE':stage==='assess'?'DIAGNOSTIC':stage==='teach'?bites[teachStep].label:stage==='try'?'LIVE COACHING':stage==='retry'?'POST-MORTEM':'VICTORY'}</span><em>{meme}</em></div>
            <h2>{stage==='story'?'THE CRATER WAKES':stage==='assess'?'SHOW ME HOW YOUR BRAIN THINKS':stage==='teach'?bites[teachStep].title:stage==='try'?'YOUR TURN, HERETIC':stage==='retry'?'THAT CODE JUST DIED':'CONCEPT INSTALLED'}</h2>
            <p>{stage==='story'?STORY[lesson.layer]:stage==='assess'?'I am not grading you. I am measuring the exact size of the hole in your knowledge so I can fill it properly.':stage==='teach'?bites[teachStep].body:stage==='try'?'Write the code yourself. Tell me what you expect before you press Run. When it fails, bring me the evidence.':stage==='retry'?`${roast(lesson.roast,roastIntensity)} ${message||'Change one small thing and run it again. I am not dumping the answer on you.'}`:'You proved the behavior repeatedly. Next lesson unlocked. Try not to become emotionally attached to one correct answer.'}</p>
            {stage==='teach'&&teachStep===1&&<div className="teacher-example"><span>THE TINY SPELL</span><pre>{lesson.starterCode}</pre></div>}
            {stage==='retry'&&<div className="teacher-repair"><span>RECOVERY PLAN</span><b>1. Read the error → 2. Explain the mistake → 3. Change one thing → 4. Run again.</b></div>}
          </motion.div>
        </AnimatePresence>
        <div className="teacher-quickbar">
          {stage==='story'&&<button className="primary-teacher-action" onClick={()=>transition('assess')}><Play size={14}/> BEGIN THE TRIAL</button>}
          {stage==='assess'&&<span>Pick one. Wrong answers only make PYTHONSURA smarter about how to teach you.</span>}
          {stage==='teach'&&<button className="primary-teacher-action" onClick={teachNext}>{bites[teachStep].action} <ChevronRight size={15}/></button>}
          {stage==='try'&&<button className="secondary-teacher-action" onClick={revealHint}><Sparkles size={14}/> NEED A TINY NUDGE?</button>}
          {stage==='retry'&&<button className="primary-teacher-action" onClick={()=>transition('try')}>BACK TO THE CODE <ChevronRight size={15}/></button>}
          {stage==='mastered'&&<button className="primary-teacher-action" onClick={onAdvance}>DESCEND TO THE NEXT WARD <ChevronRight size={15}/></button>}
        </div>
      </div>

      <AnimatePresence mode="wait"><motion.aside key={current.title+disturbance} className="disturbance-card" initial={{opacity:0,x:24,rotate:1}} animate={{opacity:1,x:0,rotate:0}} exit={{opacity:0,x:-10}} transition={{duration:.32}}><span className="disturbance-emoji">{current.emoji}</span><small>{current.title}</small><p>{current.text}</p></motion.aside></AnimatePresence>
    </div>

    {stage==='assess'&&<motion.div className="assessment-card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><div className="assessment-title"><span>ONE QUESTION. ZERO SHAME.</span><strong>What is the key idea behind <em>{lesson.topic}</em>?</strong></div>{optionSet.map((option,index)=><motion.button key={option} whileHover={reduced?undefined:{x:5}} whileTap={reduced?undefined:{scale:.99}} onClick={()=>pick(index)} className={`assessment-option ${answer===index?(index===0?'correct':'wrong'):''}`}>{String.fromCharCode(65+index)}<span>{option}</span></motion.button>)}</motion.div>}

    <div className="meme-strip" aria-label="Hell classroom reactions">{[meme,current.emoji,'💀','🫠','🔥','🧠'].map((item,index)=><motion.span key={`${item}-${index}`} animate={reduced?undefined:{y:[0,-3,0]}} transition={{duration:1.9+index*.18,repeat:Infinity,ease:'easeInOut',delay:index*.08}}>{item}</motion.span>)}</div>

    <div className="tutor-chat-live">
      <div className="chat-live-head"><div><MessageCircle size={14}/><span>TALK TO PYTHONSURA</span><small>Ask anything. Seriously.</small></div><div className="mode-pills">{(['teacher','comedy','battle','senior-engineer'] as MentorMode[]).map(item=><button key={item} className={mode===item?'active':''} onClick={()=>setMode(item)}>{item.replace('-',' ')}</button>)}</div></div>
      <div className="quick-prompts">{QUICK_PROMPTS.map(prompt=><button key={prompt} onClick={()=>quickAsk(prompt)}>{prompt}</button>)}</div>
      <div className="chat-log-live" aria-live="polite">{chats.length===0&&<p>Try: “what is a variable?”, “why am I wrong?”, “show me a tiny example”, “roast this code”, or just swear at Python.</p>}{chats.map((chat,index)=><motion.div key={`${chat.role}-${index}`} className={`chat-bubble ${chat.role}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><b>{chat.role==='user'?'YOU':'PYTHONSURA'}</b><span>{chat.text}</span></motion.div>)}</div>
      <div className="chat-live-input"><input value={input} onChange={event=>setInput(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();void ask()}}} placeholder="Talk to your teacher…"/><button onClick={()=>void ask()} disabled={asking||!input.trim()}>{asking?'THINKING…':<><Send size={14}/> ASK</>}</button></div>
      <div className="chat-live-foot"><span><Zap size={11}/> Real code + error + mastery context</span><span>{sound?'Sound on':'Sound off'} · {voice?'Tutor voice on':'Tutor voice muted'}</span></div>
    </div>
  </section>;
}
