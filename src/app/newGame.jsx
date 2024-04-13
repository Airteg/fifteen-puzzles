import { View } from "react-native";
import styled from "@emotion/native";
import { Canvas, Fill, FitBox, rect } from "@shopify/react-native-skia";
import CanvasContainer from "../components/elements/canvas/canvasContainer.jsx";
import Logo, {
  dim as dimensionsLogo,
} from "../components/elements/canvas/logo.js";
import Test from "../components/elements/canvas/test.js";

export default function NewGame() {
  const { width, height } = dimensionsLogo;
  console.log("🚀 ~ height:", height);
  console.log("🚀 ~ width:", width);
  const CanvasFitComponent = () => {
    return (
      <Canvas style={{ flex: 1 }}>
        <Fill color="lime" />
        <FitBox
          src={rect(0, 0, width, height)}
          dst={rect(0, 0, 50, 50)}
          // fit="fill"
        >
          <Logo />
        </FitBox>
      </Canvas>
    );
  };

  return (
    <ContainerNewGame>
      <CanvasFitComponent />
    </ContainerNewGame>
  );
}

const ContainerNewGame = styled.View`
  border: 2px solid orange;
  flex: 1 1 auto;
`;
