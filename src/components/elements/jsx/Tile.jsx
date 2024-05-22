import { View, Pressable, Text } from "react-native";
import React, { memo } from "react";
import styled from "@emotion/native";
import { SkiaShadow } from "react-native-skia-shadow";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { hwN } from "../../../global/global-stiles.js";

const Tile = memo(({ width, height, number, onPress }) => {
  // console.log("const Tile");
  if (number === 0) {
    return <Size style={{ width, height, backgroundColor: "transparent" }} />;
  }
  return (
    <Size style={{ width, height }} onPress={onPress}>
      <SkiaShadow blur={4} dx={-2} dy={2} color="#00000090">
        <SkiaShadow blur={4} dx={4} dy={-4} color="#ffffff90">
          <Size
            onPress={onPress}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
          >
            <BackGround />
            <Text
              style={{
                fontFamily: "KronaOne_400Regular",
                fontSize: hwN(25),
                color: "#305a63",
              }}
            >
              {number}
            </Text>
          </Size>
        </SkiaShadow>
      </SkiaShadow>
    </Size>
  );
});

export default React.memo(Tile);

const Size = styled.Pressable`
  background-color: #ffffff;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  margin: 0.25%;
  aspect-ratio: 1;
`;
const BackGround = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderColor: "white",
        borderWidth: 1.5,
        borderStyle: "solid",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Svg viewBox={`0 0 420 420`}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor="#FDFDFD" stopOpacity="1" />
            <Stop offset="0.35" stopColor="#F4F4F4" stopOpacity="1" />
            <Stop offset="0.65" stopColor="#DCDCDC" stopOpacity="1" />
            <Stop offset="1" stopColor="#D0D0D0" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={420}
          height={420}
          fill="url(#grad)"
          stroke="none"
        />
      </Svg>
    </View>
  );
};
