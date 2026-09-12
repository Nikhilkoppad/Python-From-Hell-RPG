import type {Progress} from '../types/progress';
const KEY='python-from-hell:rpg-progress:v1';
export function createInitialProgress():Progress{return{version:1,currentLayer:1,currentLessonId:'l1_print',completedLessons:[],xp:0,streak:0,mastery:{},achievements:[],settings:{roastIntensity:'SAVAGE',sound:false,reducedMotion:false}}}
export function loadProgress():Progress|null{try{const raw=localStorage.getItem(KEY);if(!raw)return null;const p=JSON.parse(raw);if(p?.version!==1||!Array.isArray(p.completedLessons)||typeof p.xp!=='number')return null;return p as Progress}catch{return null}}
export function saveProgress(p:Progress){try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}
export function awardXp(p:Progress,amount:number):Progress{return{...p,xp:p.xp+amount}}
export function recordAttempt(p:Progress,lessonId:string,success:boolean):Progress{const old=p.mastery[lessonId]??0;return{...p,mastery:{...p.mastery,[lessonId]:Math.max(0,Math.min(100,old+(success?20:-8)))}}}
export function completeLesson(p:Progress,id:string):Progress{if(p.completedLessons.includes(id))return p;return{...p,currentLessonId:id,completedLessons:[...p.completedLessons,id],mastery:{...p.mastery,[id]:100}}}
