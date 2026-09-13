import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './ui-polish.css';
import './mobile-polish.css';
import './save-polish.css';
import './interview-polish.css';
import './tutor.css';
import AppFinal from './AppFinal';
import {HellGateExperience} from './components/HellGateExperience';
import {ErrorBoundary} from './components/ErrorBoundary';

const HELLGATE_VERSION_KEY='python-from-hell:hellgate:v2';

function ExperienceRoot(){
 const [ready,setReady]=useState(()=>localStorage.getItem(HELLGATE_VERSION_KEY)==='complete');
 return ready?<AppFinal/>:<HellGateExperience onComplete={()=>{localStorage.setItem(HELLGATE_VERSION_KEY,'complete');setReady(true)}}/>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><ExperienceRoot/></ErrorBoundary></StrictMode>);
