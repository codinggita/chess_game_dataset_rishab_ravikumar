import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';
import { ThemeContext } from './ThemeContext';

export default function ThemeWrapper({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('chessiq_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chessiq_theme', theme);
    } catch {
      // localStorage unavailable — silently ignore
    }
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const muiTheme = useMemo(() => (theme === 'dark' ? darkTheme : lightTheme), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
