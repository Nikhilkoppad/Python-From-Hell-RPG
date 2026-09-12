import {Activity,Brain,Database,Flame,MemoryStick,ShieldAlert} from 'lucide-react';
import type {Progress} from '../types/progress';

type Props={progress:Progress;layer:number};
export function CosmeticHud({progress,layer}:Props){
 const latestAttempt=Object.values(progress.attempts).at(-1);
 const threat=latestAttempt?Math.min(99,Math.round(latestAttempt.failures*18+(latestAttempt.hintsUsed*6))):0;
 const mentalRam=Math.min(99,Math.round((progress.attempts?Object.keys(progress.attempts).length*4:0)+progress.completedLessons.length*1.2));
 const stack=Math.max(1,100-Math.round((latestAttempt?.failures??0)*8));
 const refcnt=2+(latestAttempt?.attempts??0)%7;
 const cpu=(38+(progress.xp%17));
 const cells=[
  ['ob_refcnt',String(refcnt),Database],
  ['CPU TEMP',`${cpu}°C`,Activity],
  ['MENTAL RAM',`${mentalRam}%`,Brain],
  ['STACK INTEGRITY',`${stack}%`,MemoryStick],
  ['GC THREAT',`${threat}%`,ShieldAlert],
  ['HELL LAYER',String(layer).padStart(2,'0'),Flame]
 ] as const;
 return <div className="cosmetic-hud" aria-label="Cosmetic developer HUD">{cells.map(([label,value,Icon])=><div key={label} className="hud-cell"><Icon size={12}/><div><small>{label}</small><b>{value}</b></div></div>)}<span className="hud-note">COSMETIC TELEMETRY • NOT HARDWARE METRICS</span></div>;
}
