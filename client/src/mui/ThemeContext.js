import { createContext, useContext } from 'react';

/* ── Dark mode only per PRD Rule #5 ── */
export const ThemeContext = createContext({
  theme: 'dark',
});

export const useThemeMode = () => useContext(ThemeContext);
