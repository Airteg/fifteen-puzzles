import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { hw } from "../global/global-stiles.js";
import LottieView from "lottie-react-native";
import Salute from "../assets/json/Confety.json";

const YouWin = () => {
  return (
    <ContainerAboutGame>
      <LottieView source={Salute} autoPlay loop={false} style={{ flex: 1 }} />
    </ContainerAboutGame>
  );
};

export default YouWin;

const ContainerAboutGame = styled.View`
  flex: 1 1 auto;
  justify-content: space-between;
  padding-top: ${hw(20)}px;
  margin-bottom: ${hw(34)}px;
  /* border: 2px solid orangered; */
  background-color: #00000060;
`;
