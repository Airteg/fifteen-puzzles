import { View, ImageBackground } from "react-native";
import styled, { css } from "@emotion/native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";

import { dfjccaic, hw, ww } from "../global/global-stiles.js";
import Button from "../components/elements/jsx/Button.jsx";

import {
  SETTINGS,
  ButtonBackShadow,
  ButtonBackShadowActive,
  Back,
  BackActive,
  BackgroundShadow,
} from "../assets";
import { AppContext } from "../global/AppContext.js";

export default function Settings() {
  const { state, setSound, setThemeColor } = useContext(AppContext);
  const router = useRouter();
  const navigate = (path) => {
    router.push(path);
  };
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
        <Title>SETTING</Title>
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
                    setThemeColor(
                      state.themeColor === "light" ? "dark" : "light"
                    )
                  }
                  title={`SCIN ${
                    state.themeColor === "light" ? "DARK" : "LIGHT"
                  }`}
                  backgroundImage={ButtonBackShadow}
                  activeBackgroundImage={ButtonBackShadowActive}
                />
              </View>
              <View style={containerStyle.bigButton}>
                <Button
                  onPress={() => setSound(!state.sound)}
                  title={`SOUND ${state.sound ? "ON" : "OFF"}`}
                  backgroundImage={ButtonBackShadow}
                  activeBackgroundImage={ButtonBackShadowActive}
                />
              </View>
              <View style={containerStyle.bigButton}>
                <Button
                  onPress={() => router.push("/GameLimitTime")}
                  title="STATISTIC"
                  backgroundImage={ButtonBackShadow}
                  activeBackgroundImage={ButtonBackShadowActive}
                />
              </View>
              <View style={containerStyle.bigButton}>
                <Button
                  onPress={() => navigate("/support")}
                  title="SUPPORT"
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
    </ContainerSetting>
  );
}

const ContainerSetting = styled.View`
  /* border: 2px solid orangered; */
  flex: 1 1 auto;
  justify-content: space-between;
  padding-top: ${hw(54)}px;
  margin-bottom: ${hw(34)}px;
`;
const SplashBlock = styled(View)`
  flex: 0.2;
`;
const TitleBlock = styled.View`
  flex: 0.2;
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
  height: ${hw(380)}px;
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
const ModalView = styled.View`
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
