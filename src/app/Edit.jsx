import { View, Image } from "react-native";
// import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "@emotion/native";
import { Audio } from "expo-av";
import { dfjccaic, hw, hwN, wwN } from "../global/global-stiles.js";
import moveSound from "../assets/sound/move.aac";

import SvgLogo from "../components/svg/Logo.jsx";

import Test from "../components/svg/TestCanvase";
import Logo from "../components/elements/canvas/Logo.jsx";
import Button from "../components/elements/jsx/Button.jsx";
import { Back, BackActive } from "../assets/index.js";
import { router } from "expo-router";
import BlueBackground from "../components/elements/canvas/blueBackground";

const Edit = () => {
  const soundRef = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(moveSound);
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handlePress = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };
  const size = 110;
  return (
    <Container>
      <Part1>
        <BlueBackground width={wwN(340 - 2)} height={hwN(489)} />
      </Part1>
      <Part2>
        <View style={containerStyle.smallButton}>
          <Button
            onPress={() => router.back()}
            backgroundImage={Back}
            activeBackgroundImage={BackActive}
          />
        </View>
      </Part2>
    </Container>
  );
};

export default Edit;

const Container = styled(View)`
  flex: 1;
  border: 0.5px solid darkgreen;
  ${dfjccaic}
`;
const TestContainer = styled(View)`
  /* border: 0.5px solid red; */
  width: ${(props) => {
    return props.size.toString();
  }}px;
  height: ${(props) => props.size.toString()}px;
  overflow: visible;
`;
const Part1 = styled(View)`
  flex: 0.8;
  width: 100%;
  justify-content: center;
  /* border: 1px solid black; */
`;
const Part2 = styled(View)`
  flex: 0.2;
  justify-content: flex-end;
  align-self: flex-end;
`;
const containerStyle = {
  image: css`
    flex: 1;
    justify-content: center;
    width: 100%;
  `,
  bigButton: css`
    align-self: flex-end;
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
