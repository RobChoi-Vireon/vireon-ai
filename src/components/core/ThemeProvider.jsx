import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // This default is a fallback, will be synced on mount.

  useEffect(() => {
    // Sync React state with the theme that was set by the anti-FOUC script.
    const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(initialTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // Save to localStorage for the anti-FOUC script to use on next load.
      localStorage.setItem('vireon-theme', newTheme);
      // Update the class on the root element for an instant theme switch.
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};