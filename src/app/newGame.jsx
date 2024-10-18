import { View, Text, ImageBackground } from "react-native";
import styled, { css } from "@emotion/native";

import { dfjccaic, hw, ww } from "../global/global-stiles.js";

import { NewGameSplash } from "../assets";
import ButtonField from "../components/ButtonField/index.jsx";

export default function NewGame() {
  return (
    <ContainerNewGame>
      <SplashBlock>
        <ImageBackground
          source={NewGameSplash}
          resizeMode="contain"
          style={containerStyle.image}
        />
      </SplashBlock>
      <TitleBlock>
        <Title>NEW GAME</Title>
      </TitleBlock>
      <ButtonBlock>
        <ButtonField labels={["CLASSIC", "LIMIT TIME", "back"]} />
      </ButtonBlock>
    </ContainerNewGame>
  );
}

const ContainerNewGame = styled(View)`
  /* border: 2px solid orangered; */
  flex: 1 1 auto;
  justify-content: space-between;
  padding-top: ${hw(54)}px;
  margin-bottom: ${hw(34)}px;
`;
const SplashBlock = styled(View)`
  flex: 0.91;
`;
const TitleBlock = styled(View)`
  flex: 0.26;
  justify-content: center;
  align-items: center;
`;
const Title = styled(Text)`
  font-family: Mariupol-Bold;
  font-size: ${hw(45)}px;
  text-align: center;
  color: #216169;
`;
// -----------
const ButtonBlock = styled(View)`
  flex: 1;
  /* border: solid 1px green; */
  ${dfjccaic}
`;

const containerStyle = {
  image: css`
    flex: 1;
    justify-content: center;
    width: 100%;
  `,
};
