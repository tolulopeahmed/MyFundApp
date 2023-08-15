import React, { createContext, useState } from 'react';

export const AutoSaveContext = createContext();

export const AutoSaveProvider = ({ children }) => {
  const [autoSave, setAutoSave] = useState(false);

  return (
    <AutoSaveContext.Provider value={{ autoSave, setAutoSave }}>
      {children}
    </AutoSaveContext.Provider>
  );
};
