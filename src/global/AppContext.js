import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  sound: true,
  gameResult: null,
  themeColor: "light",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SOUND":
      return { ...state, sound: action.payload };
    case "SET_GAME_RESULT":
      return { ...state, gameResult: action.payload };
    case "SET_THEME_COLOR":
      return { ...state, themeColor: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadSettings = async () => {
      const sound = await AsyncStorage.getItem("soundStatus");
      const gameResult = await AsyncStorage.getItem("gameResult");
      const themeColor = await AsyncStorage.getItem("themeColor");
      if (sound !== null) {
        dispatch({ type: "SET_SOUND", payload: JSON.parse(sound) });
      }
      if (gameResult !== null) {
        dispatch({ type: "SET_GAME_RESULT", payload: JSON.parse(gameResult) });
      }
      if (themeColor !== null) {
        dispatch({ type: "SET_THEME_COLOR", payload: themeColor });
      }
    };
    loadSettings();
  }, []);

  const setSound = async (status) => {
    await AsyncStorage.setItem("soundStatus", JSON.stringify(status));
    dispatch({ type: "SET_SOUND", payload: status });
  };

  const setGameResult = async (result) => {
    await AsyncStorage.setItem("gameResult", JSON.stringify(result));
    dispatch({ type: "SET_GAME_RESULT", payload: result });
  };

  const setThemeColor = async (color) => {
    await AsyncStorage.setItem("themeColor", color);
    dispatch({ type: "SET_THEME_COLOR", payload: color });
  };

  return (
    <AppContext.Provider
      value={{ state, setSound, setGameResult, setThemeColor }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
