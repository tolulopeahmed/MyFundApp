// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: {
      primary: isDarkMode ? '#fff' : '#4C28BC',
      background: isDarkMode ? '#121212' : '#F5F1FF',
      text: isDarkMode ? '#fff' : '#4C28BC',
      // Add more color definitions as needed
    },
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
