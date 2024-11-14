import { useState, useEffect } from 'react';
import { lightTheme, darkTheme, Theme } from '../styles/themes/theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    if (localTheme) {
      setTheme(localTheme === 'dark' ? darkTheme : lightTheme);
      setIsDarkMode(localTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? lightTheme : darkTheme;
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
    window.localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  return { theme, isDarkMode, toggleTheme };
};
