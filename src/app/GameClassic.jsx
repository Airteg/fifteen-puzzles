import { View, Text, ImageBackground, Alert } from "react-native";
import styled, { css } from "@emotion/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Timer,
  PlayingField,
  ButtonsField,
  TitleGameField,
} from "../components/game/";
import { hw } from "../global/global-stiles.js";

export default function GameClassic() {
  const handleTimeUp = () => {
    Alert.alert("GAME OVER", "Your time is up!", [
      { text: "OK", onPress: () => router.push("/YouLose") },
    ]);
  };
  // onTimeUp, mode = 'countdown', initialTime = 3600
  return (
    <GameContainer>
      {console.log("~~~~~~ GameClassic ~~~~~")}
      <Timer />
      <PlayingField />
      <ButtonsField />
      <TitleGameField />
    </GameContainer>
  );
}

const GameContainer = styled.View`
  flex: 1 1 auto;
  margin-top: ${hw(43)}px;
  margin-bottom: ${hw(63)}px;
  width: 100%;
  align-self: center;
  border: 1px solid yellowgreen;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
