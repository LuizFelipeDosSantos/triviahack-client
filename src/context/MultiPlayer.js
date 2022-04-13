import { createContext, useState } from "react";

export const MultiPlayerContext = createContext();

export function MultiPlayer(props) {
  const [multiplayerData, setmultiplayerData] = useState(null);

  const addMultiPlayerDataToContext = (newMultiPlayerData) => {
    setmultiplayerData(newMultiPlayerData);
  };

  const removeMultiPlayerDataFromContext = () => {
    setmultiplayerData(null);
  };

  const updateUsersRoom = (usersRoom) => {
    setmultiplayerData({...multiplayerData, usersRoom: usersRoom});
  }

  return (
    <MultiPlayerContext.Provider
      value={{ multiplayerData, addMultiPlayerDataToContext, removeMultiPlayerDataFromContext, updateUsersRoom }}
    >
      {props.children}
    </MultiPlayerContext.Provider>
  );
}