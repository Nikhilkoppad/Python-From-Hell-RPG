import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './ui-polish.css';
import AppV2 from './AppV2';
import {ErrorBoundary} from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><AppV2/></ErrorBoundary></StrictMode>);
