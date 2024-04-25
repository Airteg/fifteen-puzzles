import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import styled, { css } from "@emotion/native";
import { dfjccaic, hw, platform } from "../global/global-stiles.js";
import Test from "../components/elements/jsx/Test.jsx";

const colors = ["#00000032", "transparent"];

const size = { width: 150, height: 100 };
const Edit = ({ width = 180, height = 100 }) => {
  const Block = styled.View`
    width: auto;
    height: auto;
    border: 0.5px solid red;
  `;
  return (
    <Container>
      <Block>
        <Test width={200} height={150} />
        {/* <Content></Content> */}
      </Block>
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
const Shadow = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Content = styled.View`
  width: 100%;
  height: 100%;
  background-color: #d5f7ff;
  border: #d5f7ff;
`;

const styles = {
  glob: css`
    border: 1px solid lime;
  `,
  wrapLeft: css`
    flex: 0.1;
    height: 100%;
    border: 0.5px solid navy;
    display: flex;
  `,
  wrapCenter: css`
    flex: 0.8;
    height: 100%;
    border: 0.5px solid navy;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  wrapRight: css`
    flex: 0.1;
    height: 100%;
    border: 0.5px solid navy;
  `,
  left: css`
    flex: 0.8;
  `,
  leftTop: css`
    flex: 0.1;
  `,
  top: css`
    flex: 0.1;
  `,
  leftBot: css`
    flex: 0.1;
  `,
  bot: css`
    flex: 0.1;
  `,
  right: css`
    flex: 0.8;
  `,
  rightTop: css`
    flex: 0.1;
  `,
  rightBot: css`
    flex: 0.1;
  `,
  innerShadow: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `,
};
