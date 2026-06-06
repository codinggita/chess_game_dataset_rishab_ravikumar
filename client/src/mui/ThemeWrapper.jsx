import { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { ThemeContext } from './ThemeContext';

/* ── Dark mode only — PRD Rule #5 ── */
export default function ThemeWrapper({ children }) {
  const ctx = useMemo(() => ({ theme: 'dark' }), []);

  return (
    <ThemeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
