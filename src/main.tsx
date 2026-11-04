import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getContent } from './content/repository';
import { App } from './ui/app/App';
import { applyVersionReset, loadDevState } from './dev/devTools';
import './ui/styles/global.css';

function renderFatal(message: string) {
  document.getElementById('root')!.innerHTML = `<div style="padding:24px;font-family:sans-serif"><h1>Swechan kunde inte starta</h1><p>${message}</p><p>Din sparade progression påverkas inte.</p></div>`;
}

async function start() {
  try {
    getContent(); // validate bundled content once at startup
  } catch (e) {
    console.error(e);
    renderFatal('Innehållsfilerna är ogiltiga. Kör "npm run validate:content" för detaljer.');
    return;
  }
  try {
    await applyVersionReset(); // development phase: new version = fresh start (restore point kept)
    await loadDevState();
  } catch (e) {
    console.error('startup data step failed', e);
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
void start();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.warn('Service worker registration failed', err));
  });
}
