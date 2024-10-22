import React, { useRef, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Video } from "expo-av";

import winner from "../../../assets/video/big_buck_bunny.mp4";

export default function GameResultVideo() {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  // Функція для обробки статусу відео
  const handlePlaybackStatusUpdate = (status) => {
    setStatus(() => status);
    if (status.didJustFinish && !status.isLooping) {
      // Показуємо повідомлення, коли відео завершилося
      Alert.alert("Кінець", "Відео завершилося.");
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        // source={{
        //   uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        // }}
        source={require("../../../assets/video/winner_converted.mp4")}
        // source={winner}
        useNativeControls
        resizeMode="contain"
        isLooping={false} // Забороняємо зациклення
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
});
