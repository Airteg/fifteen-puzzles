import { View, Text, ImageBackground, Alert } from "react-native";
import styled, { css } from "@emotion/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { dfjccaic, hw, hwN, ww } from "../global/global-stiles.js";
import Button from "../components/elements/jsx/Button.jsx";
import { PlanForTileY, HOME_Active, HOME, RESTART } from "../assets";
import Board from "../components/Board.jsx";

export default function GameClassic() {
  const [time, setTime] = useState(6000); // Таймер в секундах (2 хвилини)

  useEffect(() => {
    const timer =
      time > 0 &&
      setInterval(() => {
        setTime(time - 1);
      }, 1000);

    if (time === 0) {
      Alert.alert("GAME OVER", "Your time is up!", [
        { text: "OK", onPress: () => router.push("/YouLose") },
      ]);
    }

    return () => clearInterval(timer);
  }, [time]);
  return (
    <View style={style.container}>
      <View style={style.timer}>
        <Text>{`Time: ${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${
          time % 60
        }`}</Text>
      </View>
      <View style={style.game.Container}>
        <View style={style.game.Plan}>
          <ImageBackground
            source={PlanForTileY}
            resizeMode="contain"
            style={style.image}
          >
            <View style={style.game.Order}>
              <Board />
            </View>
          </ImageBackground>
        </View>
      </View>
      <View style={style.button.Home}>
        <View>
          <Button
            onPress={() => router.push("/")}
            title="CLASSIC"
            backgroundImage={HOME}
            activeBackgroundImage={HOME_Active}
          />
        </View>
      </View>
      <View style={style.title}></View>
    </View>
  );
}

const style = {
  container: css`
    flex: 1 1 auto;
    margin-top: ${hw(43)}px;
    margin-bottom: ${hw(40)}px;
    width: 100%;
    align-self: center;
    border: 1px solid green;
    ${dfjccaic}
  `,
  // 1
  timer: {
    Container: css`
      flex: 0.2;
      width: 100%;
      border: 2px solid brown;
    `,
    Wrapper: css``,
    Text: css``,
  },
  // 2
  game: {
    Container: css`
      flex: 1;
      border: 2px solid darkgoldenrod;
      width: 100%;
    `,
    Image: css`
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    `,
    Plan: css`
      align-self: center;
      /* border: solid 2px lime; */
    `,
    Order: css`
      width: 85%;
      height: 85%;
      /* border: solid 3px green; */
      ${dfjccaic}
    `,
  },
  // 3
  button: {
    Home: css`
      flex: 0.2;
      width: 85%;
      border: 2px solid orange;
    `,
    Wrapper: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `,
    operationButton: css`
      width: ${hw(99 / 1.2375)}px;
      height: ${hw(99)}px;
      border: solid 1px blue;
    `,
  },
  // 4
  title: css`
    flex: 0.2;
    border: 2px solid lightcoral;
  `,

  bigButton: css``,
};
