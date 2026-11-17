import '@fontsource/barlow/latin-400.css';
import '@fontsource/barlow/latin-500.css';
import '@fontsource/barlow/latin-600.css';
import '@fontsource/barlow/latin-700.css';
import '@fontsource/barlow/latin-ext-400.css';
import '@fontsource/barlow/latin-ext-500.css';
import '@fontsource/barlow/latin-ext-600.css';
import '@fontsource/barlow/latin-ext-700.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/barlow-condensed/latin-ext-700.css';
import '@fontsource/barlow-condensed/latin-ext-800.css';
import './styles/index.css';
import './i18n';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { initTheme } from './stores/uiStore';

initTheme();
async function enableMocking() {
  const { USE_MOCKS } = await import('./api/config');
  if (!import.meta.env.DEV || !USE_MOCKS) return;
  const { startMockWorker } = await import('./mocks/browser');
  return startMockWorker();
}

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});