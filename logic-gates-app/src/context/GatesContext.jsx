import { createContext, useState } from "react";

export const GatesContext = createContext(null); // Ensure a valid default value

export const GatesProvider = ({ children }) => {
  const [gates, setGates] = useState([]);

  return (
    <GatesContext.Provider value={{ gates, setGates }}>
      {children}
    </GatesContext.Provider>
  );
};
