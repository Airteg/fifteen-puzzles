import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "@emotion/native";
import { Audio } from "expo-av";
import { dfjccaic, hw } from "../global/global-stiles.js";
import moveSound from "../assets/sound/move.aac";
import ButtonField from "../components/ButtonField";

const Edit = () => {
  // const soundRef = useRef(null);

  // useEffect(() => {
  //   const loadSound = async () => {
  //     const { sound } = await Audio.Sound.createAsync(moveSound);
  //     soundRef.current = sound;
  //   };

  //   loadSound();

  //   return () => {
  //     if (soundRef.current) {
  //       soundRef.current.unloadAsync();
  //     }
  //   };
  // }, []);

  // const handlePress = async () => {
  //   if (soundRef.current) {
  //     await soundRef.current.replayAsync();
  //   }
  // };
  // const size = 110;

  return (
    <Container>
      {/* <Part1> */}
      <ButtonField
        labels={["New Game", "SOUND", "LIMIT TIME", "Blkjhg", "back"]}
      />
      {/* </Part1> */}
    </Container>
  );
};

export default Edit;

const Container = styled(View)`
  flex: 1;
  /* border: 0.5px solid darkgreen; */
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
  /* flex: 0.6; */
  width: 100%;
  justify-content: center;
  border: 1px solid red;
  background-color: #0f0;
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
