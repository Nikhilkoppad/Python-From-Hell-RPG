import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './ui-polish.css';
import './mobile-polish.css';
import './save-polish.css';
import './interview-polish.css';
import './tutor.css';
import AppFinal from './AppFinal';
import {ErrorBoundary} from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><AppFinal/></ErrorBoundary></StrictMode>);
