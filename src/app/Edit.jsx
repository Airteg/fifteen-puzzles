import { View, Image } from "react-native";
// import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/native";
import { Audio } from "expo-av";
import { dfjccaic, hw } from "../global/global-stiles.js";
import moveSound from "../assets/sound/move.aac";

import SvgLogo from "../components/svg/Logo.jsx";
import {
  Circle,
  ClipPath,
  Defs,
  ForeignObject,
  G,
  LinearGradient,
  RadialGradient,
  Filter,
  FeColorMatrix,
  Ellipse,
  Polygon,
  Text,
  Mask,
  Rect,
  Stop,
  Svg,
  SvgXml,
  Use,
} from "react-native-svg";
import Test from "../components/svg/Test";

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
      {/* <Test /> */}
      <TestContainer>
        <SvgLogo />
      </TestContainer>
    </Container>
  );
};

export default Edit;

const Container = styled(View)`
  flex: 1;
  border: 1px solid darkgreen;
  ${dfjccaic}
`;
const TestContainer = styled(View)`
  border: 1px solid red;
  width: 250px;
  height: 250px;
  overflow: visible;
`;
