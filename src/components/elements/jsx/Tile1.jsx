import { Pressable, Text } from "react-native";
import React, { memo } from "react";
import styled from "@emotion/native";
import { SkiaShadow } from "react-native-skia-shadow";
import { hwN } from "../../../global/global-stiles.js";
import BackGround from "../../svg/BackGround.jsx";

const Tile = memo(({ width, height, number, onPress }) => {
  if (number === 0) {
    return <Size style={{ width, height, backgroundColor: "transparent" }} />;
  }
  return (
    <Size style={{ width, height }} onPress={onPress}>
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
    </Size>
  );
});

export default React.memo(Tile);

const Size = styled(Pressable)`
  background-color: #ffffff;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  margin: 0.25%;
  aspect-ratio: 1;
`;
