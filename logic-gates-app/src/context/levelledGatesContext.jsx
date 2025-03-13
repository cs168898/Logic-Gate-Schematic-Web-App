import { createContext, useState } from "react";

export const LevelledGatesContext = createContext(null);

export const levelledGatesContextProvider = ({ children }) => {
  const [levelledGates, setLevelledGates] = useState({});

  return (
    <LevelledGatesContext.Provider value={{ levelledGates, setLevelledGates }}>
      {children}
    </LevelledGatesContext.Provider>
  );
};
