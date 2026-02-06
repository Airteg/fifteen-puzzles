import { View, Text, ImageBackground } from "react-native";
import styled, { css } from "@emotion/native";
import { dfjccaic, hw } from "../global/global-stiles.js";
import { SETTINGS } from "../assets";
import ButtonField from "../components/ButtonField/index.jsx";

export default function Settings() {
  return (
    <ContainerSetting>
      <SplashBlock>
        <ImageBackground
          source={SETTINGS}
          resizeMode="contain"
          style={containerStyle.image}
        />
      </SplashBlock>
      <TitleBlock>
        <Title>SETTINGS</Title>
      </TitleBlock>

      <ButtonBlock>
        <ButtonField
          labels={["SKIN", "SOUND", "STATISTIC", "SUPPORT", "back"]}
        />
      </ButtonBlock>
    </ContainerSetting>
  );
}

const ContainerSetting = styled(View)`
  /* border: 2px solid orangered; */
  flex: 1 1 auto;
  justify-content: space-between;
  padding-top: ${hw(54)}px;
  margin-bottom: ${hw(34)}px;
`;
const SplashBlock = styled(View)`
  flex: 0.2;
`;
const TitleBlock = styled(View)`
  flex: 0.2;
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
const ModalView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin: 20px;
  padding: 20px;
  border-radius: 20px;
  /* shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 2px;
  }
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5; */
`;
