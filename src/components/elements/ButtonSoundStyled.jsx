import { View } from "react-native";
import React, { useState } from "react";
import styled from "@emotion/native";
import { dfjccaic, hw, ww } from "../../global/global-stiles.js";
import Sound from "../svg/Sound.jsx";
import { SkiaShadow } from "react-native-skia-shadow";

const ButtonSoundStyled = ({ soundStatus = true }) => {
  const [size, setSize] = useState({ width: 272, height: 220.5 });
  const sound = soundStatus;
  console.log("hw(51", hw(51));
  return (
    <SkiaShadow blur={3} dx={0} dy={0} color="#00000054">
      <Container>
        <WrapperMain
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setSize({ width, height });
            console.log("height", height);
          }}
        >
          <RecursiveWrapper
            size={size}
            depth={10}
            initialBorderWidth={2}
            soundStatus={sound}
          />
        </WrapperMain>
      </Container>
    </SkiaShadow>
  );
};

export default ButtonSoundStyled;

const RecursiveWrapper = ({ size, depth, initialBorderWidth, soundStatus }) => {
  if (depth === 0) return <Sound soundStatus={soundStatus} />;
  const currentBorderWidth = initialBorderWidth + (depth - 1);

  return (
    <Wrapper
      style={{
        width: size.width,
        height: size.height,
        borderWidth: currentBorderWidth,
      }}
    >
      <RecursiveWrapper
        size={size}
        depth={depth - 1}
        initialBorderWidth={initialBorderWidth}
        soundStatus={soundStatus}
      />
    </Wrapper>
  );
};

const Container = styled.View`
  height: ${hw(51)}px;
  aspect-ratio: 1.083;
  border-radius: 6px;
  border: 3px solid #d5f7ff;
  ${dfjccaic}
`;

const WrapperMain = styled.View`
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background-color: #d5f7ff;
  ${dfjccaic}
`;

const Wrapper = styled.View`
  border-color: #00000001;
  border-style: solid;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
`;
