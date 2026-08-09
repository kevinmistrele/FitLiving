import { useCallback, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'fitliving-theme';

function getPreferredTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Runs once, synchronously, before React mounts (see src/main.tsx) so the right theme class is
// already on <html> before first paint — avoids a light-mode flash for users who prefer, or
// previously chose, dark.
export function initializeTheme() {
  applyTheme(getPreferredTheme());
}

// Shared toggle — the dark palette in src/styles.css (`.dark`) already existed but nothing ever
// switched it on. Persists the choice in localStorage; falls back to `prefers-color-scheme`
// only when the user hasn't chosen yet.
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getPreferredTheme);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
