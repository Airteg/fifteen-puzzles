import React, { memo } from "react";
import styled, { css } from "@emotion/native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Pressable, Text } from "react-native";
import { hw } from "../../../global/global-stiles.js";

const Tile = memo(({ width, height, number, onPress }) => {
  if (number === 0) {
    return <Size style={{ width, height, backgroundColor: "transparent" }} />;
  }
  // console.log("width", width);
  return (
    <Size style={{ width, height }} onPress={onPress}>
      {/* {console.log("Render Tile", number)} */}
      <LGShadow />
      <Container>
        <ContainerColor>
          <Text style={linearGradientStyle.number}>{number}</Text>
        </ContainerColor>
      </Container>
    </Size>
  );
});

export default Tile;

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
const Container = styled.View`
  width: 93%;
  height: 93%;
  border-radius: 5px;
  background-color: #ffffff;
  /* border: 0.5px solid #ffffffa7; */
`;

const ContainerColor = ({ children }) => (
  <LinearGradient
    start={{ x: 1, y: 0 }}
    end={{ x: 0.5, y: 0.8 }}
    colors={["#b0b0b087", "#dddddd", "#f0f0f0"]}
    locations={[0.0, 0.35, 1]}
    style={linearGradientStyle.background}
  >
    {children}
  </LinearGradient>
);
const LGShadow = () => (
  <LinearGradient
    start={{ x: 1, y: 0 }}
    end={{ x: 0, y: 0.8 }}
    colors={["#ececec", "#e5e5e5eb", "#27272730"]}
    locations={[0, 0.52, 1]}
    style={linearGradientStyle.shadow}
  />
);
const linearGradientStyle = {
  background: css`
    flex: 1;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
  `,
  shadow: css`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  number: css`
    font-family: KronaOne_400Regular;
    /* font-family: Mariupol-Bold; */
    font-size: ${hw(25)}px;
    color: #305a63;
    z-index: 10;
  `,
};
