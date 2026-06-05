import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);
