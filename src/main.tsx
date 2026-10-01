import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { AuthProvider } from '@descope/react-sdk';
import App from './App.tsx';
import './index.css';
import { initGlobalClickSound } from './utils/sound';
import { LanguageProvider } from './utils/LanguageContext';

initGlobalClickSound();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider projectId="P3K6LwIDJRlYK19nBi2yewOjmo22">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
);
