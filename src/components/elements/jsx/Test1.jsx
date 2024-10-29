import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
  ReduceMotion,
} from "react-native-reanimated";
import { wwN } from "../../../global/global-stiles.js";

const duration = 1500;

export default function Test({ width = wwN(300) }) {
  console.log("🚀 ~ width:", width);
  const defaultAnim = useSharedValue(width / 2 - 40);
  console.log("🚀 ~ defaultAnim:", defaultAnim.value);
  const linear = useSharedValue(width / 2 - 40);
  console.log("🚀 ~ linear:", linear.value);

  const animatedDefault = useAnimatedStyle(() => ({
    transform: [{ translateX: defaultAnim.value }],
  }));
  const animatedChanged = useAnimatedStyle(() => ({
    transform: [{ translateX: linear.value }],
  }));

  React.useEffect(() => {
    linear.value = withRepeat(
      // highlight-next-line
      withTiming(-linear.value, {
        duration,
        easing: Easing.back(3),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    );
    defaultAnim.value = withRepeat(
      // highlight-next-line
      withTiming(-defaultAnim.value, {
        duration,
      }),
      -1,
      true,
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedDefault]}>
        <Text style={styles.text}>inout</Text>
      </Animated.View>

      <Animated.View style={[styles.box, animatedChanged]}>
        <Text style={styles.text}>linear</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    // borderColor: "black",
    // borderWidth: 2,
    // borderStyle: "solid",
  },
  box: {
    height: 80,
    width: 80,
    margin: 20,
    borderWidth: 1,
    borderColor: "#b58df1",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#b58df1",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
