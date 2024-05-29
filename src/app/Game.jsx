import { View, Alert } from "react-native";
import { useState } from "react";
import styled from "@emotion/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Timer,
  Board,
  ButtonsField,
  TitleGameField,
} from "../components/game/index.js";
import { hw, windowHeight } from "../global/global-stiles.js";

export default function Game() {
  const [reloadKey, setReloadKey] = useState(0);
  const { mode, initialTime } = useLocalSearchParams();
  const router = useRouter();
  const onRestart = () => {
    console.log("Restart triggered");
    setReloadKey((prevKey) => prevKey + 1);
  };
  const margin = (130 * (windowHeight - 592)) / windowHeight;

  const handleTimeUp = () => {
    Alert.alert("GAME OVER", "Your time is up!", [
      { text: "OK", onPress: () => router.push("/YouLose") },
    ]);
  };

  return (
    <GameContainer margin={margin}>
      {console.log("~~~~~~ Game ~~~~~")}
      <Timer
        key={`timer-${reloadKey}`}
        mode={mode || "countdown"}
        initialTime={Number(initialTime)}
        onTimeUp={handleTimeUp}
      />
      <Board key={`board-${reloadKey}`} />
      <ButtonsField onRestart={onRestart} />
      <TitleGameField />
    </GameContainer>
  );
}

const GameContainer = styled.View`
  flex: 1 1 auto;
  margin-top: ${(props) => props.margin}px;
  margin-bottom: ${(props) => props.margin}px;
  width: 100%;
  align-self: center;
  /* border: 1px solid yellowgreen; */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
