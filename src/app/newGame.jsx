import { View, Text, ImageBackground } from "react-native";
import styled, { css } from "@emotion/native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { dfjccaic, hw, ww } from "../global/global-stiles.js";
import Button from "../components/elements/jsx/Button.jsx";
import {
  NewGameSplash,
  ButtonBackShadow,
  ButtonBackShadowActive,
  Back,
  BackActive,
  BackgroundShadow,
} from "../assets";

export default function NewGame() {
  const router = useRouter();
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
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
        <ImageBackground
          source={BackgroundShadow}
          resizeMode="stretch"
          style={containerStyle.image}
        >
          <WrapperImage>
            <Wrapper>
              <View style={containerStyle.bigButton}>
                <Button
                  onPress={() =>
                    router.push("/Game?mode=elapsed&initialTime=0")
                  }
                  title="CLASSIC"
                  backgroundImage={ButtonBackShadow}
                  activeBackgroundImage={ButtonBackShadowActive}
                />
              </View>
              <View style={containerStyle.bigButton}>
                <Button
                  onPress={() =>
                    router.push("/Game?mode=countdown&initialTime=120")
                  }
                  title="LIMIT TIME"
                  backgroundImage={ButtonBackShadow}
                  activeBackgroundImage={ButtonBackShadowActive}
                />
              </View>
              <View style={containerStyle.smallButton}>
                <Button
                  onPress={() => router.back()}
                  backgroundImage={Back}
                  activeBackgroundImage={BackActive}
                />
              </View>
            </Wrapper>
          </WrapperImage>
        </ImageBackground>
      </ButtonBlock>
    </ContainerNewGame>
  );
}

const ContainerNewGame = styled.View`
  /* border: 2px solid orangered; */
  flex: 1 1 auto;
  justify-content: space-between;
  padding-top: ${hw(54)}px;
  margin-bottom: ${hw(34)}px;
`;
const SplashBlock = styled.View`
  flex: 0.91;
`;
const TitleBlock = styled.View`
  flex: 0.26;
  justify-content: center;
  align-items: center;
`;
const Title = styled.Text`
  font-family: Mariupol-Bold;
  font-size: ${hw(45)}px;
  text-align: center;
  color: #216169;
`;
// -----------
const ButtonBlock = styled.View`
  flex: 1;
  /* border: solid 1px green; */
  ${dfjccaic}
`;
const WrapperImage = styled.View`
  flex: 1;
  width: 100%;
  border-radius: ${hw(8)}px;
  overflow: hidden;
  ${dfjccaic}
`;
const Wrapper = styled.View`
  width: ${ww(276)}px;
  height: ${hw(232)}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /* border: solid 1px red; */
`;
const containerStyle = {
  image: css`
    flex: 1;
    justify-content: center;
    width: 100%;
  `,
  bigButton: css`
    width: 100%;
    height: ${hw(74)}px;
    /* border: solid 1px blue; */
    ${dfjccaic}
  `,
  smallButton: css`
    width: ${hw(64)}px;
    height: ${hw(64)}px;
    display: flex;
    justify-content: center;
    align-self: flex-end;
    /* border: solid 1px blue; */
  `,
};
