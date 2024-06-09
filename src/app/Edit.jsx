import { View, Text, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "@emotion/native";
import { Audio } from "expo-av";
import { dfjccaic, hw, platform, ww } from "../global/global-stiles.js";
import axios from "axios";

const Edit = () => {
  const soundRef = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sound/move.aac")
      );
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
      <Button title="Press me" onPress={handlePress} />
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
  /* border: 1px solid darkgreen; */
  ${dfjccaic}
`;
