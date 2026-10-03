import { createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

const THEME_KEY = 'taskflow_theme';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Icon colors can't use className, so provide them here (lighter tones on dark surfaces)
  const colors = {
    primary: isDark ? '#818cf8' : '#4f46e5',
    muted: '#9ca3af',
    danger: isDark ? '#f87171' : '#ef4444',
    success: isDark ? '#4ade80' : '#16a34a',
  };

  // On startup, restore the saved choice (if there is one)
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (!cancelled && (saved === 'light' || saved === 'dark')) setColorScheme(saved);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function setTheme(mode) {
    setColorScheme(mode); // switches every dark: class instantly
    AsyncStorage.setItem(THEME_KEY, mode).catch(() => {});
  }

  return (
    <ThemeContext.Provider value={{ isDark: colorScheme === 'dark', setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}