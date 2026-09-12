import type {Dispatch,SetStateAction} from 'react';
import type {Progress} from '../types/progress';
import {playSfx} from '../engine/audio';
import {SaveTransferPanel} from './SaveTransferPanel';

type Props={progress:Progress;setProgress:Dispatch<SetStateAction<Progress>>;onClose:()=>void};
export function SettingsPanel({progress,setProgress,onClose}:Props){
 const update=<K extends keyof Progress['settings']>(key:K,value:Progress['settings'][K])=>setProgress(p=>({...p,settings:{...p.settings,[key]:value}}));
 const toggleSound=(enabled:boolean)=>{update('sound',enabled);if(enabled)playSfx('achievement')};
 const reset=()=>{localStorage.removeItem('python-from-hell:rpg-progress:v3');localStorage.removeItem('python-from-hell:rpg-progress:v2');localStorage.removeItem('python-from-hell:rpg-progress:v1');localStorage.removeItem('python-from-hell:entered');location.reload()};
 return <div className="settings-overlay" role="dialog" aria-modal="true" aria-label="Game settings"><section className="settings-panel"><div className="panel-title"><span>HELL SETTINGS</span><button className="back-btn" onClick={onClose}>CLOSE</button></div><h2>Control the suffering.</h2><label>ROAST INTENSITY<select value={progress.settings.roastIntensity} onChange={e=>update('roastIntensity',e.target.value as Progress['settings']['roastIntensity'])}><option value="MILD">MILD</option><option value="SAVAGE">SAVAGE</option><option value="APOCALYPSE">APOCALYPSE</option></select></label><label className="toggle-row"><span>SOUND EFFECTS</span><input type="checkbox" checked={progress.settings.sound} onChange={e=>toggleSound(e.target.checked)}/></label><label className="toggle-row"><span>REDUCED MOTION</span><input type="checkbox" checked={progress.settings.reducedMotion} onChange={e=>update('reducedMotion',e.target.checked)}/></label><SaveTransferPanel progress={progress} setProgress={setProgress}/><button className="danger-button" onClick={reset}>ERASE LOCAL SAVE</button></section></div>;
}
