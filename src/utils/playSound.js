import { Audio } from "expo-av";

export const playSound = async (sound) => {
  // console.log("playSound");
  try {
    const { sound: soundObject } = await Audio.Sound.createAsync(sound);
    await soundObject.playAsync();

    // Звільнення ресурсів після завершення відтворення
    soundObject.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        soundObject.unloadAsync();
      }
    });

    return soundObject;
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};
