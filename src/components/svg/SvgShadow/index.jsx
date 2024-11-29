import { View } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { ww } from "../../../global/global-stiles.js";

const SvgShadow = ({
  Fgr,
  w = 100,
  h = 60,
  r,
  fill,
  shadowColor = "#00000080",
  blur = 5,
  offsetX = 0,
  offsetY = 0,
}) => {
  return (
    <>
      {/* <ShadowBlock /> */}
      <Figure width={w} height={h} />
    </>
  );
};

export default SvgShadow;
const Container = styled(View)`
  width: 100%;
  height: 100%;
  position: relative; /* Контекст для позиціонування дочірніх елементів */
  background-color: lightblue;
  /* border: 2px solid orange; */
  /* overflow: hidden; */
`;

const Figure = styled(View)`
  width: ${(props) => {
    console.log("props.width", props.width);
    return props.width;
  }}px;
  height: ${(props) => props.height}px;
  /* background-color: yellow; */
  background-color: none;
  border: 1px solid lime;
  position: absolute;
  top: 0; /* Центруємо по вертикалі */
  left: 0; /* Центруємо по горизонталі */
  /* transform: translate(0px, 0px); Зміщення вліво і вгору */
`;

const ShadowBlock = styled(View)`
  width: 120px;
  height: 120px;
  background-color: green;
  position: absolute;
  top: -10px; /* Центруємо по вертикалі */
  left: -10px; /* Центруємо по горизонталі */
  transform: translate(0px, 0px); /* Зміщення вправо і вниз */
`;
