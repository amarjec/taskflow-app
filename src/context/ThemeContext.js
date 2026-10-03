import { createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

const THEME_KEY = 'taskflow_theme';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { colorScheme, setColorScheme } = useColorScheme();

  // On startup, restore the saved choice (if there is one)
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') setColorScheme(saved);
      })
      .catch(() => {}); // if loading fails, just keep the system theme
  }, []);

  function setTheme(mode) {
    setColorScheme(mode); // switches every dark: class instantly
    AsyncStorage.setItem(THEME_KEY, mode).catch(() => {});
  }

  return (
    <ThemeContext.Provider value={{ isDark: colorScheme === 'dark', setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}