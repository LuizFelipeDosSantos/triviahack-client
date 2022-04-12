import { createContext, useState } from "react";

export const MultiPlayerContext = createContext();

export function MultiPlayer(props) {
  const [multiplayerData, setmultiplayerData] = useState(null);

  const addMultiPlayerDataToContext = (newMultiPlayerData) => {
    if (multiplayerData) return
    setmultiplayerData(newMultiPlayerData);
  };

  const removeMultiPlayerDataFromContext = () => {
    setmultiplayerData(null);
  };

  return (
    <MultiPlayerContext.Provider
      value={{ multiplayerData, addMultiPlayerDataToContext, removeMultiPlayerDataFromContext }}
    >
      {props.children}
    </MultiPlayerContext.Provider>
  );
}