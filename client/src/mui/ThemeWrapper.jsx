import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';

/* ── ThemeWrapper ──
   Reads ui.theme from Redux store and applies the correct MUI theme.
   Also syncs the .light class on <html> for CSS variable switching.
*/

export default function ThemeWrapper({ children }) {
  const themeMode = useSelector((state) => state.ui?.theme || 'dark');

  const activeTheme = useMemo(
    () => (themeMode === 'light' ? lightTheme : darkTheme),
    [themeMode],
  );

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
