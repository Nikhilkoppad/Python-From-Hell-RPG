import {useEffect,useState} from 'react';
import {Activity,Brain,Database,Flame,MemoryStick,ShieldAlert} from 'lucide-react';
import {unlockedLayerCount} from '../engine/unlocks';
import type {Progress} from '../types/progress';
const KEY='python-from-hell:rpg-progress:v3';
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null') as Progress|null}catch{return null}}
export function CosmeticHud(){
 const [progress,setProgress]=useState<Progress|null>(()=>read());
 useEffect(()=>{const sync=()=>setProgress(read());window.addEventListener('pfh:progress',sync);return()=>window.removeEventListener('pfh:progress',sync)},[]);
 const p=progress;const latest=p?Object.values(p.attempts).at(-1):undefined;const layer=p?unlockedLayerCount(p.completedLessons):1;const threat=latest?Math.min(99,Math.round(latest.failures*18+latest.hintsUsed*6)):0;const mentalRam=Math.min(99,Math.round((p?Object.keys(p.attempts).length*4:0)+(p?.completedLessons.length??0)*1.2));const stack=Math.max(1,100-Math.round((latest?.failures??0)*8));const refcnt=2+(latest?.attempts??0)%7;const cpu=38+((p?.xp??0)%17);
 const cells=[['ob_refcnt',String(refcnt),Database],['CPU TEMP',`${cpu}°C`,Activity],['MENTAL RAM',`${mentalRam}%`,Brain],['STACK INTEGRITY',`${stack}%`,MemoryStick],['GC THREAT',`${threat}%`,ShieldAlert],['HELL LAYER',String(layer).padStart(2,'0'),Flame]] as const;
 return <div className="cosmetic-hud" aria-label="Cosmetic developer HUD">{cells.map(([label,value,Icon])=><div key={label} className="hud-cell"><Icon size={12}/><div><small>{label}</small><b>{value}</b></div></div>)}<span className="hud-note">COSMETIC TELEMETRY • NOT HARDWARE METRICS</span></div>
}
