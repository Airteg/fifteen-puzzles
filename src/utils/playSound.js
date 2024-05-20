import { Audio } from "expo-av";

export const playSound = async (sound) => {
  const { sound: soundObject } = await Audio.Sound.createAsync(sound);
  await soundObject.playAsync();
  // Звільнення ресурсів після завершення відтворення
  soundObject.setOnPlaybackStatusUpdate((status) => {
    if (!status.isPlaying) {
      soundObject.unloadAsync();
    }
  });
};
