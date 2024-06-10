import { View } from "react-native";
import React from "react";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";
import styled from "@emotion/native";
import { dfjccaic } from "../../global/global-stiles.js";

const Sound = ({ soundStatus }) => {
  if (!soundStatus)
    return (
      <Wrapper>
        <Svg viewBox="0 0 32 28">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0.1" stopColor="#216169" stopOpacity="1" />
              <Stop offset="0.4" stopColor="#367e88" stopOpacity="1" />
              <Stop offset="0.8" stopColor="#216169" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 0 19.5 V 9 H 6.5 L 15 0 V 28 L 6.5 19.5 H 0 Z M 22.4 6.3 C 22.3 6 22 5.9 21.8 6.1 C 21.5 6.2 21.4 6.5 21.6 6.7 L 25.8 15.2 L 21.6 23.3 C 21.4 23.5 21.5 23.8 21.8 23.9 C 22 24.1 22.3 24 22.4 23.7 L 26.4 16.3 L 30.1 23.7 C 30.2 24 30.5 24.1 30.7 23.9 C 31 23.8 31.1 23.5 30.9 23.3 L 26.9 15.2 L 31.4 6.7 C 31.6 6.5 31.5 6.2 31.2 6.1 C 31 5.9 30.7 6 30.6 6.3 L 26.4 14.2 L 22.4 6.3 Z"
            fill="url(#grad)"
          />
        </Svg>
      </Wrapper>
    );
  return (
    <Wrapper>
      <Svg viewBox="0 0 34 28">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0.1" stopColor="#e6eb3c" stopOpacity="1" />
            <Stop offset="0.4" stopColor="#fbff8f" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#e6eb3c" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d="M 0 19.5 V 9 H 6.5 L 15 0 V 28 L 6.5 19.5 H 0 Z"
          fill="url(#grad)"
          stroke="#000"
        />
        <Path
          d="M 21 3 C 25 11.9 25 16.7 21 25 M 30 6 C 32.6 12.5 32.7 16 30 22"
          fill="none"
          stroke="#000"
          strokeWidth={2}
        />
      </Svg>
    </Wrapper>
  );
};

export default Sound;

const Wrapper = styled.View`
  width: 80%;
  height: 80%;
  margin: 2px;
  /* aspect-ratio: 1; */
  ${dfjccaic}
`;
