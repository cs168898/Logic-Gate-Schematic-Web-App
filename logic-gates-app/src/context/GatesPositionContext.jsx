import { createContext, useState } from "react";

export const GatesPositionContext = createContext(null);

export const GatesPositionProvider = ({ children }) => {
  const [gatePositions, setGatePositions] = useState({});

  return (
    <GatesPositionContext.Provider value={{ gatePositions, setGatePositions }}>
      {children}
    </GatesPositionContext.Provider>
  );
};
