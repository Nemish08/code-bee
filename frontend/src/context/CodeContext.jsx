// src/context/CodeContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSettings } from './SettingsContext'; // We need the language

// 1. Create the context
const CodeContext = createContext();

// 2. Create the Provider component
// This component will hold the state and logic for the code editor.
export const CodeProvider = ({ children, problem }) => {
//   const { language } = useSettings();
  const [myCode, setMyCode] = useState('');

  
  const value = {
    myCode,
    setMyCode,
  };

  return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
};

// 3. Create a custom hook for easy consumption
export const useCode = () => {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};