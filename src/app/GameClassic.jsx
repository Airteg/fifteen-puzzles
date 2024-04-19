import { View, Text, ImageBackground } from "react-native";
import styled, { css } from "@emotion/native";
import { router } from "expo-router";
import { useState } from "react";

import { dfjccaic, hw, hwN, ww } from "../global/global-stiles.js";
import Button from "../components/elements/jsx/Button.jsx";
import { HOME, HOME_Active, PlanForTileY } from "../assets";

export default function GameClassic() {
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  return (
    <View style={style.container}>
      <View style={style.timer}></View>
      <View
        style={style.game}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          const a = width > height ? height : width;
          setWrapperSize({ width: a, height: a });
          console.log("Game size", wrapperSize);
        }}
      >
        <View
          style={{
            width: wrapperSize.width,
            height: wrapperSize.width,
            ...style.gamePlan,
          }}
        >
          <ImageBackground
            source={PlanForTileY}
            resizeMode="stretch"
            style={style.image}
          >
            <View style={style.gameOrder}></View>
          </ImageBackground>
        </View>
      </View>
      <View style={style.buttonHome}></View>
      <View style={style.title}></View>
    </View>
  );
}

const style = {
  container: css`
    flex: 1 1 auto;
    margin-top: ${hw(43)}px;
    margin-bottom: ${hw(40)}px;
    width: 90%;
    align-self: center;
  `,
  timer: css`
    flex: 0.3;
    border: 2px solid red;
  `,
  game: css`
    flex: 1;
    border: 2px solid red;
  `,
  gamePlan: css`
    align-self: center;
  `,
  gameOrder: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1vmin;
  `,
  buttonHome: css`
    flex: 0.4;
    border: 2px solid red;
  `,
  title: css`
    flex: 0.3;
    border: 2px solid red;
  `,

  image: css`
    flex: 1;
    justify-content: center;
    /* width: 100%; */
  `,
  bigButton: css``,
  operationButton: css`
    width: ${hw(99 / 1.2375)}px;
    height: ${hw(99)}px;
    border: solid 1px blue;
  `,
};
