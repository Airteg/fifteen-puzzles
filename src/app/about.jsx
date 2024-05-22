import {
  View,
  Text,
  ImageBackground,
  FlatList,
  ScrollView,
} from "react-native";
import styled, { css } from "@emotion/native";
import { router } from "expo-router";
import { useState } from "react";

import { dfjccaic, hw, ww } from "../global/global-stiles.js";
import Button from "../components/elements/jsx/Button.jsx";
import Back from "../assets/png/Back.png";
import BackActive from "../assets/png/BackActive.png";
import BackgroundShadow from "../assets/png/BackgroundShadow.png";
import AboutGameSplash from "../assets/png/ABOUT_GAME_splash.png";

export default function About() {
  return (
    <ContainerAboutGame>
      <SplashBlock>
        <ImageBackground
          source={AboutGameSplash}
          resizeMode="contain"
          style={style.image}
        ></ImageBackground>
      </SplashBlock>
      <TitleBlock>
        <Title>ABOUT GAME</Title>
      </TitleBlock>
      <DescriptionBlock>
        <ImageBackground
          source={BackgroundShadow}
          resizeMode="stretch"
          style={style.image}
        >
          <WrapperImage>
            <Wrapper>
              <ScrollView>
                <Description>{about}</Description>
              </ScrollView>

              <View style={style.smallButton}>
                <Button
                  onPress={() => router.back()}
                  backgroundImage={Back}
                  activeBackgroundImage={BackActive}
                />
              </View>
            </Wrapper>
          </WrapperImage>
        </ImageBackground>
      </DescriptionBlock>
    </ContainerAboutGame>
  );
}

const ContainerAboutGame = styled.View`
  flex: 1 1 auto;
  justify-content: space-between;
  padding-top: ${hw(20)}px;
  margin-bottom: ${hw(34)}px;
  /* border: 2px solid orangered; */
`;
const SplashBlock = styled.View`
  flex: 0.2;
  /* border: 2px solid greenyellow; */
`;
const TitleBlock = styled.View`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  /* border: 2px solid lightblue; */
`;
const Title = styled.Text`
  font-family: Mariupol-Bold;
  font-size: ${hw(45)}px;
  text-align: center;
  color: #216169;
`;
// -----------
const DescriptionBlock = styled.View`
  flex: 1;
  /* border: solid 1px green; */
  ${dfjccaic}
`;
const WrapperImage = styled.View`
  flex: 1;
  width: 100%;
  border-radius: ${hw(8)}px;
  overflow: hidden;
  /* border: solid 1px green; */
  ${dfjccaic}
`;
const Wrapper = styled.View`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /* border: solid 1px red; */
`;
const Description = styled.Text`
  font-family: Mariupol-Bold;
  font-size: ${hw(16)}px;
  text-align: left;
  color: #216169;
`;
const style = {
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
const about = `      Fifteen Tiles is a classic puzzle game that tests your logic and patience. The objective is to rearrange the tiles in numerical order, from 1 to 15, by sliding them through the empty space. Each move allows you to shift only one tile at a time, and the tiles cannot be lifted or rotated. Fifteen Tiles is an engaging and addictive game that promises hours of entertainment. Give it a try and see if you can solve the puzzle! 
      The game features four levels of difficulty, anging from easy to expert, allowing players of all skill levels to challenge themselves. You can also customize your experience by choosing from various tile designs and backgrounds. Additionally, you can keep track of your best times and moves for each level and compare your scores with other players online. 
      Fifteen Tiles is an engaging and addictive game that promises hours of entertainment. Give it a try and see if you can solve the puzzle!`;
