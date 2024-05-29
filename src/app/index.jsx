import { View } from "react-native";
import styled from "@emotion/native";

import MainMenuSplashContainer from "../components/MainMenuSplashContainer.jsx";
import MenuContainer from "../components/MenuContainer.jsx";
import { hw } from "../global/global-stiles.js";

export default function Home() {
  return (
    <ContainerHome>
      <MainMenuSplashContainer />
      <MenuContainer />
    </ContainerHome>
  );
}

const ContainerHome = styled.View`
  flex: 1 1 auto;
  padding-top: ${hw(30)}px;
`;
