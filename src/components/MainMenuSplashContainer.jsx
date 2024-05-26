import { View, Text } from "react-native";
import { Image } from "expo-image";
import styled from "@emotion/native";
import { hw, ww } from "../global/global-stiles.js";
import menuSplashTemp from "../assets/png/MAIN_MENU_splash_temp.png";

export default function MainMenuSplashContainer() {
  return (
    <Container>
      <Image
        source={menuSplashTemp}
        style={{ width: "100%", height: "100%" }}
        contentFit="contain"
      />
    </Container>
  );
}
const Container = styled.View`
  width: 100%;
  height: ${hw(138)}px;
  /* border: 0.5px solid orange; */
`;
