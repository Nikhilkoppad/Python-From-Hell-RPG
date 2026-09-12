import {useMemo,useState} from 'react';
import {ChevronRight,Code2,ShieldCheck,Skull} from 'lucide-react';
import {interviewQuestions} from '../domain/interview';
import {claimInterviewReward} from '../engine/progress';
import {grantAchievement,ACHIEVEMENTS} from '../engine/achievements';
import type {Progress} from '../types/progress';
import type {Dispatch,SetStateAction} from 'react';

type Props={progress:Progress;setProgress:Dispatch<SetStateAction<Progress>>};
type Rank={name:string;min:number};

const RANKS:Rank[]=[
 {name:'PYTHON INTERN',min:0},
 {name:'HELL TOURIST',min:.2},
 {name:'CODE IMP',min:.35},
 {name:'PYTHON HERETIC',min:.5},
 {name:'RUNTIME REAPER',min:.65},
 {name:'DEBUGGING DEMON',min:.78},
 {name:'CPYTHON NECROMANCER',min:.9},
 {name:'PYTHON OVERLORD',min:.96},
];
const CODE_TASKS:Record<string,string>={
 i09:'Write a function that uses a None sentinel instead of a mutable default argument.',
 i17:'Write a tiny generator that yields three values without building a list.',
 i19:'Write a minimal decorator that logs a function call and preserves metadata.',
 i21:'Show a tiny multiple-inheritance example and print the MRO.',
 i26:'Write a one-line snippet that prints the current interpreter bytecode for a function.',
 i28:'Show a tiny example that creates a reference cycle.',
 i29:'Show how you would detect whether the current CPython build is free-threaded.',
 i30:'Show how you would check whether the running interpreter exposes experimental JIT support.',
};
function rankFor(pct:number){return [...RANKS].reverse().find(rank=>pct>=rank.min)?.name??RANKS[0].name}
function hitsFor(answer:string,points:string[]){const normalized=answer.toLowerCase();return points.reduce((hits,point)=>{const terms=point.toLowerCase().split(/\s+/).filter(word=>word.length>4);return hits+(terms.length&&terms.every(word=>normalized.includes(word))?1:0)},0)}
function pctFor(score:number,round:number){return round?score/(round*2):0}

export function InterviewArena({progress,setProgress}:Props){
 const done=progress.interview.round>=interviewQuestions.length;
 const [answer,setAnswer]=useState('');
 const [retry,setRetry]=useState(false);
 const [feedback,setFeedback]=useState('');
 const [attemptScore,setAttemptScore]=useState(0);
 const [answered,setAnswered]=useState(false);
 const q=interviewQuestions[Math.min(progress.interview.round,interviewQuestions.length-1)];
 const codeTask=useMemo(()=>CODE_TASKS[q?.id], [q?.id]);
 if(done){
  const pct=pctFor(progress.interview.score,interviewQuestions.length);
  return <div className="page"><div className="panel interview-finish"><div className="eyebrow">ARENA COMPLETE</div><h2>YOU SURVIVED THE INTERVIEW DEMON.</h2><p>Final rank: <b>{progress.interview.rank}</b> · Score: <b>{progress.interview.score}/{interviewQuestions.length*2}</b> · Accuracy: <b>{Math.round(pct*100)}%</b></p><div className="interview-ranks">{RANKS.map(rank=><span key={rank.name} className={progress.interview.rank===rank.name?'current':''}>{rank.name}</span>)}</div>{!progress.interview.rewarded&&<button className="primary-cta small" onClick={()=>setProgress(p=>claimInterviewReward(p))}>CLAIM SURVIVAL REWARD +50 XP <ChevronRight size={15}/></button>}</div></div>
 }
 const submit=()=>{
  if(!answer.trim()||answered)return;
  const hits=hitsFor(answer,q.expectedPoints);
  setAttemptScore(hits>=2?2:hits>0?1:0);
  if(hits>=2){
   setFeedback(`${q.roast} Strong answer. Mechanism verified.`);
   setAnswered(true);
   setProgress(p=>{const score=p.interview.score+2;const round=Math.min(p.interview.round+1,interviewQuestions.length);const rank=rankFor(pctFor(score,round));return{...p,interview:{...p.interview,round,score,rank},achievements:round===interviewQuestions.length?grantAchievement(p.achievements,ACHIEVEMENTS.INTERVIEW_SURVIVOR):p.achievements}});
   return;
  }
  setRetry(true);
  setFeedback(`${q.roast} Too thin. ${hits?'You found part of the mechanism.':'Nothing important landed.'} The demon will give you one smaller retry.`);
  setAnswer('');
 };
 const submitRetry=()=>{
  if(!answer.trim()||answered)return;
  const hits=hitsFor(answer,q.expectedPoints);
  const earned=hits>0?1:0;
  const codeBonus=codeTask&&answer.includes('\n')?1:0;
  const finalScore=Math.min(1,earned+codeBonus);
  setAttemptScore(finalScore);
  setFeedback(finalScore?`${q.roast} Retry accepted for ${finalScore} point.`:`${q.roast} The retry still missed the mechanism. Moving on.`);
  setAnswered(true);
  setProgress(p=>{const score=p.interview.score+finalScore;const round=Math.min(p.interview.round+1,interviewQuestions.length);const rank=rankFor(pctFor(score,round));return{...p,interview:{...p.interview,round,score,rank},achievements:round===interviewQuestions.length?grantAchievement(p.achievements,ACHIEVEMENTS.INTERVIEW_SURVIVOR):p.achievements}});
 };
 const advance=()=>{setAnswer('');setRetry(false);setFeedback('');setAttemptScore(0);setAnswered(false)};
 const pct=pctFor(progress.interview.score,Math.max(1,progress.interview.round));
 const progressNow=Math.round(pct*100);
 return <div className="page"><div className="section-heading"><div><div className="eyebrow">INTERVIEW BATTLE ARENA</div><h1>THE INTERVIEWER DEMON</h1></div><span>ROUND {progress.interview.round+1}/{interviewQuestions.length} · {progressNow}% · {progress.interview.rank}</span></div><div className="interview-card"><div className="demon"><Skull/><span>{q.tier.toUpperCase()}</span><small>{q.id.toUpperCase()}</small></div><div className="interview-scorebar"><span>RANK PATH</span><b>{rankFor(pctFor(progress.interview.score,Math.max(1,progress.interview.round)))}</b></div><h2>{retry?`RETRY: ${q.followUp}`:q.prompt}</h2><p className="interview-rule">{retry?'Explanation first. Then give the smallest correct answer you can.':'Explain the mechanism, not just the definition.'}</p>{retry&&<div className="interview-explain"><ShieldCheck size={15}/><span>A strong answer should cover: {q.expectedPoints.join(' · ')}.</span></div>}{retry&&codeTask&&<div className="interview-code-task"><div><Code2 size={15}/><span>CODE TASK</span></div><p>{codeTask}</p></div>}<textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder={retry?(codeTask?'Write the snippet and explain why it works…':'Answer the follow-up precisely…'):'Answer with reasoning, not vibes…'} disabled={answered}/><div className="interview-actions">{retry?<button className="primary-cta small" disabled={!answer.trim()||answered} onClick={submitRetry}>RETRY FOR 1 POINT <ChevronRight size={15}/></button>:<button className="primary-cta small" disabled={!answer.trim()||answered} onClick={submit}>SUBMIT ANSWER <ChevronRight size={15}/></button>}{answered&&<button className="gate-secondary" onClick={advance}>{progress.interview.round>=interviewQuestions.length?'VIEW RESULT':'NEXT QUESTION'} <ChevronRight size={15}/></button>}</div>{feedback&&<div className={`feedback ${attemptScore>0?'success-row':''}`} aria-live="polite">{feedback}</div>}<p className="followup-note">The interview is scored live. Weak answers trigger the smaller retry instead of silently skipping the lesson.</p></div></div>
}
