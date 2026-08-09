import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/app';
import { initializeTheme } from '@/hooks/use-theme';

import '@/styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element (#root) not found');
}

// Must run before the first render — sets the `.dark` class on <html> synchronously so there's
// no light-mode flash for users who prefer, or previously chose, dark.
initializeTheme();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
