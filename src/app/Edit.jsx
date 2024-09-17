import { View, Text, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "@emotion/native";
import { Audio } from "expo-av";
import { dfjccaic, hw, platform, ww } from "../global/global-stiles.js";
import moveSound from "../assets/sound/move.aac";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import Test3 from "../components/elements/jsx/test3.jsx";

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
  return (
    <Container>
      <TestContainer>
        <Test3 />
      </TestContainer>
    </Container>
  );
};

export default Edit;

const Container = styled.View`
  flex: 1 1 auto;
  width: 100%;
  margin-top: ${hw(43)}px;
  margin-bottom: ${hw(40)}px;
  align-self: center;
  border: 1px solid darkgreen;
  ${dfjccaic}
`;
const TestContainer = styled(View)`
  border: 1px solid red;
  width: 150px;
  height: 150px;
  overflow: visible;
`;
