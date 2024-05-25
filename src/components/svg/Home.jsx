import { View } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";
import styled from "@emotion/native";
import { dfjccaic } from "../../global/global-stiles.js";

const Home = () => {
  return (
    <Wrapper>
      <Svg viewBox="0 0 30 30">
        <Path
          d="M 15.6 1.2 C 15.4 1.1 15.2 1 15 1 C 14.8 1 14.5 1.1 14.4 1.2 L 0 12.4 L 1.2 14 L 3 12.6 V 25 C 3 25.5 3.2 26 3.6 26.4 C 4 26.8 4.5 27 5 27 H 25 C 25.5 27 26 26.8 26.4 26.4 C 26.8 26 27 25.5 27 25 V 12.6 L 28.8 14 L 30 12.4 L 15.6 1.2 Z M 17 25 H 13 V 17 H 17 V 25 Z M 19 25 V 17 C 19 16.5 18.8 16 18.4 15.6 C 18 15.2 17.5 15 17 15 H 13 C 12.5 15 12 15.2 11.6 15.6 C 11.2 16 11 16.5 11 17 V 25 H 5 V 11.1 L 15 3.3 L 25 11.1 V 25 H 19 Z"
          fill="#216169"
        />
      </Svg>
    </Wrapper>
  );
};

export default Home;
const Wrapper = styled.View`
  height: 100%;
  margin: 2px;
  aspect-ratio: 1;
  ${dfjccaic}
`;
