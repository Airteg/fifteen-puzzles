import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";
import styled from "@emotion/native";
import { dfjccaic } from "../../global/global-stiles.js";

const Clock = () => {
  return (
    <Wrapper>
      <Svg viewBox="0 0 30 30">
        <Path
          d="M15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30ZM15 27C18.1826 27 21.2348 25.7357 23.4853 23.4853C25.7357 21.2348 27 18.1826 27 15C27 11.8174 25.7357 8.76515 23.4853 6.51472C21.2348 4.26428 18.1826 3 15 3C11.8174 3 8.76515 4.26428 6.51472 6.51472C4.26428 8.76515 3 11.8174 3 15C3 18.1826 4.26428 21.2348 6.51472 23.4853C8.76515 25.7357 11.8174 27 15 27ZM14.0858 16.2008C13.7107 15.8257 13.5 15.317 13.5 14.7866V7.5C13.5 6.67157 14.1716 6 15 6C15.8284 6 16.5 6.67157 16.5 7.5V13.5566C16.5 14.087 16.7107 14.5957 17.0858 14.9708L21.3675 19.2525C21.9515 19.8365 21.9515 20.7835 21.3675 21.3675C20.7835 21.9515 19.8365 21.9515 19.2525 21.3675L14.0858 16.2008Z"
          fill="#216169"
        />
      </Svg>
    </Wrapper>
  );
};

export default Clock;
const Wrapper = styled.View`
  height: 100%;
  margin: 2px;
  aspect-ratio: 1;
  ${dfjccaic}
`;