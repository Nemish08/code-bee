import React, { createContext, useState, useContext } from 'react';

// 1. Create context
const HeaderContext = createContext();

// 2. Create provider
export const HeaderProvider = ({ children }) => {
  const [flag, setFlag] = useState(true);

  return (
    <HeaderContext.Provider value={{ flag, setFlag }}>
      {children}
    </HeaderContext.Provider>
  );
};

// 3. Custom hook to use context
export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
