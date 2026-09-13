export type VoiceActor='pythosura'|'learner'|'narrator'|'boss'|'system';
export type VoiceLanguage='en'|'hinglish';
export type VoicePriority='low'|'normal'|'high'|'critical';
export type VoiceLine={id:string;text:string;actor:VoiceActor;language:VoiceLanguage;priority?:VoicePriority;volume?:number};

type QueuedLine={line:VoiceLine;resolve:(played:boolean)=>void};

class VoiceManager{
 private cache=new Map<string,HTMLAudioElement>();
 private current?:HTMLAudioElement;
 private queue:QueuedLine[]=[];
 private enabled=true;
 private masterVolume=.9;
 private generation=0;
 private unlocked=false;
 private unlockHandler?:()=>void;

 private getPath(line:VoiceLine){return `/audio/voice/${line.language}/${line.actor}/${line.id}.mp3`}

 setEnabled(enabled:boolean){this.enabled=enabled;if(!enabled){this.stop();this.queue=[]}}
 setVolume(volume:number){this.masterVolume=Math.max(0,Math.min(1,volume));if(this.current)this.current.volume=Math.max(0,Math.min(1,this.masterVolume))}
 isEnabled(){return this.enabled}

 unlock(){
  if(this.unlocked||typeof window==='undefined')return;
  this.unlocked=true;
  if(this.unlockHandler){window.removeEventListener('pointerdown',this.unlockHandler);window.removeEventListener('keydown',this.unlockHandler);this.unlockHandler=undefined}
  void this.drain();
 }
 installAutoplayUnlock(){
  if(typeof window==='undefined'||this.unlocked||this.unlockHandler)return;
  this.unlockHandler=()=>this.unlock();
  window.addEventListener('pointerdown',this.unlockHandler,{once:true,passive:true});
  window.addEventListener('keydown',this.unlockHandler,{once:true,passive:true});
 }

 stop(){this.generation++;if(this.current){this.current.pause();this.current.currentTime=0;this.current=undefined}}

 private playNow(line:VoiceLine,generation:number):Promise<boolean>{
  if(!this.enabled||generation!==this.generation)return Promise.resolve(false);
  const path=this.getPath(line);let audio=this.cache.get(path);
  if(!audio){audio=new Audio(path);audio.preload='auto';this.cache.set(path,audio)}
  audio.volume=Math.max(0,Math.min(1,this.masterVolume*(line.volume??1)));
  this.current=audio;
  return new Promise(resolve=>{
   const cleanup=()=>{audio?.removeEventListener('ended',ended);audio?.removeEventListener('error',failed)};
   const ended=()=>{cleanup();if(this.current===audio)this.current=undefined;resolve(true)};
   const failed=()=>{cleanup();if(this.current===audio)this.current=undefined;console.warn(`[VoiceManager] Missing/unplayable voice asset: ${path}`);resolve(false)};
   audio.addEventListener('ended',ended,{once:true});audio.addEventListener('error',failed,{once:true});
   void audio.play().then(()=>{this.unlocked=true}).catch(()=>{cleanup();if(this.current===audio)this.current=undefined;resolve(false)})
  })
 }

 private async drain(){
  if(this.current||!this.enabled||!this.unlocked)return;
  while(this.queue.length&&this.enabled&&this.unlocked){
   const item=this.queue.shift()!;
   const played=await this.playNow(item.line,this.generation);
   item.resolve(played);
  }
 }

 async play(line:VoiceLine):Promise<boolean>{
  if(!this.enabled||typeof window==='undefined')return false;
  const priority=line.priority??'normal';
  if(priority==='critical'){
   this.stop();
   this.queue=[];
   if(!this.unlocked){this.queue.push({line,resolve:()=>{}});this.installAutoplayUnlock();return false}
   return this.playNow(line,this.generation);
  }
  return new Promise(resolve=>{this.queue.push({line,resolve});this.installAutoplayUnlock();void this.drain()})
 }

 preload(line:VoiceLine){
  if(typeof window==='undefined')return;
  const path=this.getPath(line);if(this.cache.has(path))return;
  const audio=new Audio(path);audio.preload='auto';this.cache.set(path,audio)
 }

 preloadMany(lines:VoiceLine[]){lines.forEach(line=>this.preload(line))}
 clearCache(){this.stop();this.cache.clear();this.queue=[]}
 async speak(line:VoiceLine){return this.play(line)}
}

export const voiceManager=new VoiceManager();

export function voiceLine(id:string,text:string,actor:VoiceActor,language:VoiceLanguage,options:{priority?:VoicePriority;volume?:number}={}):VoiceLine{return{id,text,actor,language,priority:options.priority??'normal',volume:options.volume??1}}
export function stopVoice(){voiceManager.stop()}
