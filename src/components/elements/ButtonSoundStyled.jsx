import { View } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { dfjccaic, hw, hwN } from "../../global/global-stiles.js";
import Sound from "../svg/Sound.jsx";
import { SkiaShadow } from "react-native-skia-shadow";

const ButtonSoundStyled = ({ soundStatus = true }) => {
  const size = { width: hwN(51) * 1.083 - 3, height: hwN(51) - 3 };
  return (
    <SkiaShadow blur={4} dx={0} dy={0} color="#00000054">
      <Container>
        <WrapperMain>
          <RecursiveWrapper
            size={size}
            depth={10}
            initialBorderWidth={2}
            soundStatus={soundStatus}
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
  height: ${hw(51)}px;
  aspect-ratio: 1.083;
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
