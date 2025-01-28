import React, { createContext, useState } from 'react';

export const ConnectionsContext = createContext();

export const ConnectionsProvider = ({ children }) => {
  const [connections, setConnections] = useState({});

  return (
    <ConnectionsContext.Provider value={{ connections, setConnections }}>
      {children}
    </ConnectionsContext.Provider>
  );
};