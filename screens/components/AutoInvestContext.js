import React, { createContext, useState } from 'react';

export const AutoInvestContext = createContext();

export const AutoInvestProvider = ({ children }) => {
  const [autoInvest, setAutoInvest] = useState(false);

  return (
    <AutoInvestContext.Provider value={{ autoInvest, setAutoInvest }}>
      {children}
    </AutoInvestContext.Provider>
  );
};
