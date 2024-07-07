import { View, Text } from "react-native";
import styled from "@emotion/native";
import { router } from "expo-router";
import ButtonStyled from "./elements/ButtonStyled.jsx";
import ButtonsWrapperBack from "./elements/ButtonsWrapperBack.jsx";
import { hwN, hw, ww } from "../global/global-stiles.js";

export default function MenuContainer() {
  const height = hwN(302);

  const navigate = (path) => {
    router.push(path);
  };

  return (
    <Wrapper>
      <TextStyled>MENU</TextStyled>
      <CanvasWrapper height={height}>
        <ButtonsWrapperBack height={height} />
        <ButtonsWrapper height={height}>
          <ButtonStyled text="New Game" onPress={() => navigate("/newGame")} />
          <ButtonStyled text="Settings" onPress={() => navigate("/settings")} />
          <ButtonStyled
            text="About"
            // onPress={() => navigate("/about")}
            // onPress={() => navigate("/Edit")}
            onPress={() => navigate("/YouWin")}
          />
        </ButtonsWrapper>
      </CanvasWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.View`
  margin-top: 30px;
`;
const CanvasWrapper = styled.View`
  width: auto;
  height: ${(props) => props.height};

  display: flex;
  justify-content: center;
  align-items: center;
`;
const ButtonsWrapper = styled.View`
  padding-top: ${hw(40)}px;
  padding-bottom: ${hw(40)}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TextStyled = styled.Text`
  font-family: "Mariupol-Bold";
  font-size: 30px;
  margin-bottom: 30px;
  text-align: center;
`;
