import { View, Text } from "react-native";
import styled from "@emotion/native";
import ButtonField from "./ButtonField";

export default function MenuContainer() {
  return (
    <Wrapper>
      <TextStyled>MENU</TextStyled>
      <ButtonField labels={["New Game", "Settings", "EDIT"]} />
    </Wrapper>
  );
}
const Wrapper = styled(View)`
  margin-top: 30px;
`;

const TextStyled = styled(Text)`
  font-family: "Mariupol-Bold";
  font-size: 30px;
  margin-bottom: 30px;
  text-align: center;
`;
