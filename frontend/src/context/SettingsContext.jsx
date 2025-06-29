import React, { createContext, useState, useEffect, useContext } from 'react';

// Helper function to get initial state from localStorage or use a default
const getInitialState = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => getInitialState('editorTheme', 'monokai'));
  const [language, setLanguage] = useState(() => getInitialState('editorLanguage', 'javascript'));
  const [fontSize, setFontSize] = useState(() => getInitialState('editorFontSize', 14));

  // Effect to save theme to localStorage
  useEffect(() => {
    localStorage.setItem('editorTheme', JSON.stringify(theme));
  }, [theme]);

  // Effect to save language to localStorage
  useEffect(() => {
    localStorage.setItem('editorLanguage', JSON.stringify(language));
  }, [language]);

  // Effect to save font size to localStorage
  useEffect(() => {
    localStorage.setItem('editorFontSize', JSON.stringify(fontSize));
  }, [fontSize]);

  const value = {
    theme,
    setTheme,
    language,
    setLanguage,
    fontSize,
    setFontSize,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context easily
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};