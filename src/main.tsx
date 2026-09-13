import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './ui-polish.css';
import './mobile-polish.css';
import './save-polish.css';
import './interview-polish.css';
import './tutor.css';
import './hellgate.css';
import AppFinal from './AppFinal';
import {HellGateExperience} from './components/HellGateExperience';
import {ErrorBoundary} from './components/ErrorBoundary';
import {createInitialProgress,loadProgress} from './engine/progress';

const HELLGATE_VERSION_KEY='python-from-hell:hellgate:v2';
const PROGRESS_KEY='python-from-hell:rpg-progress:v3';
const ENTERED_KEY='python-from-hell:entered';
function ExperienceRoot(){
 const[ready,setReady]=useState(()=>localStorage.getItem(HELLGATE_VERSION_KEY)==='complete');
 const finish=()=>{localStorage.setItem(HELLGATE_VERSION_KEY,'complete');localStorage.setItem(ENTERED_KEY,'yes');setReady(true)};
 const hasSave=Boolean(loadProgress());
 if(ready)return <AppFinal/>;
 return <HellGateExperience hasSave={hasSave} onComplete={finish} onResume={finish} onStartFresh={()=>{try{localStorage.removeItem(PROGRESS_KEY);localStorage.setItem(HELLGATE_VERSION_KEY,'complete');localStorage.setItem(ENTERED_KEY,'yes')}finally{void createInitialProgress();setReady(true)}}}/>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><ExperienceRoot/></ErrorBoundary></StrictMode>);
