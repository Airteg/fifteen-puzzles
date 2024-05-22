import { View, Alert } from "react-native";
import styled from "@emotion/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Timer,
  PlayingField,
  ButtonsField,
  TitleGameField,
} from "../components/game/index.js";
import { hw } from "../global/global-stiles.js";

export const handleTimeUp = () => {
  Alert.alert("GAME OVER", "Your time is up!", [
    { text: "OK", onPress: () => router.push("/YouLose") },
  ]);
};
export default function Game() {
  const { mode, initialTime } = useLocalSearchParams(); // Отримуємо параметри з URL

  const router = useRouter(); // Використовуємо роутер для навігації

  return (
    <GameContainer>
      {console.log("~~~~~~ Game ~~~~~")}
      <Timer
        mode={mode || "countdown"}
        initialTime={Number(initialTime)}
        onTimeUp={handleTimeUp}
      />
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