import AsyncStorage from "@react-native-async-storage/async-storage";

export const setSoundStatus = async (status) => {
  try {
    await AsyncStorage.setItem("soundStatus", JSON.stringify(status));
  } catch (e) {
    console.error("Failed to save the sound status.", e);
  }
};

export const getSoundStatus = async () => {
  try {
    const soundStatus = await AsyncStorage.getItem("soundStatus");
    return soundStatus !== null ? JSON.parse(soundStatus) : true; // За замовчуванням звук увімкнений
  } catch (e) {
    console.error("Failed to load the sound status.", e);
    return true; // За замовчуванням звук увімкнений
  }
};
