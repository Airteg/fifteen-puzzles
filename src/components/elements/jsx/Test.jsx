import { StyleSheet, Button, View } from "react-native";
import { Video } from "expo-av";
import React from "react";

export default function GameResultVideo() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={setStatus}
      />
      <View style={styles.buttons}>
        {/* <Button
          title="Play from 5s"
          onPress={() => video.current.playFromPositionAsync(5000)}
        /> */}
        {/* <Button
          title={status.isLooping ? "Set to not loop" : "Set to loop"}
          onPress={() => video.current.setIsLoopingAsync(!status.isLooping)}
        /> */}
      </View>
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
  buttons: {
    margin: 16,
  },
});
