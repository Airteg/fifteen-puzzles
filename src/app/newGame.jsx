import { View, Text } from "react-native";
import styled, { css } from "@emotion/native";
import CanvasContainer from "../components/elements/canvas/canvasContainer.jsx";
import Logo, {
  dim as dimensionsLogo,
} from "../components/elements/canvas/logo.js";

export default function NewGame() {
  return (
    <ContainerNewGame>
      <Wrapper>
        <CanvasContainer
          canvasElement={<Logo />}
          children={<Text>sert wert</Text>}
          dimCanvasElement={dimensionsLogo}
          containerStyle={containerStyle.css}
        />
      </Wrapper>
    </ContainerNewGame>
  );
}

const ContainerNewGame = styled.View`
  border: 2px solid orange;
  flex: 1 1 auto;
`;
const Wrapper = styled.View`
  width: 100px;
  height: 150px;
`;
const containerStyle = {
  css: css`
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};
