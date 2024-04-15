import { View, Text } from "react-native";
import styled, { css } from "@emotion/native";
import CanvasContainer from "../components/elements/canvas/canvasContainer.jsx";
import Logo, { dim } from "../components/elements/canvas/logoOnPlash.js";
// import Test, { dim } from "../components/elements/canvas/test.js";
import { useState } from "react";

export default function NewGame() {
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  return (
    <ContainerNewGame>
      <OuterWrapper>
        <Wrapper
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setWrapperSize({ width, height });
            console.log("Wrapper Size", wrapperSize);
          }}
        >
          <CanvasContainer
            // canvasElement
            children={<Text></Text>}
            dimCanvasElement={dim}
            containerStyle={containerStyle.css}
          />
        </Wrapper>
      </OuterWrapper>
    </ContainerNewGame>
  );
}

const ContainerNewGame = styled.View`
  border: 2px solid orange;
  flex: 1 1 auto;
`;
const Wrapper = styled.View`
  width: 250px;
  height: 250px;
  overflow: visible;
  /* border: #000 solid 0.5px; */
  /* padding: 7px; */
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;
const containerStyle = {
  css: css`
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};
const OuterWrapper = styled.View`
  border: #e09b9b solid 2px;
  border-radius: 6px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
