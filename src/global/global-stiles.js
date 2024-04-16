import { css } from "@emotion/native";
import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");
const windowHeight = windowDimensions.height;
const windowWidth = windowDimensions.width;
//Висота вікна, текст
export const hw = (h) => Math.round((h * windowHeight) / 844).toString();
//Ширина вікна, текст
export const ww = (w) => Math.round((w * windowWidth) / 390).toString();
//Висота вікна, число
export const hwN = (h) => Math.round((h * windowHeight) / 844);
//Ширина вікна, число
export const wwN = (w) => Math.round((w * windowWidth) / 390);
export const dfjccaic = `display: flex;
  justify-content: center;
  align-items: center;`;

export const globalStyles = {
  container: css`
    margin: 0;
    padding-left: ${ww(25)}px;
    padding-right: ${ww(25)}px;
    background-color: #d5f7ff;
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: solid red 2px;
    box-sizing: border-box;
  `,
};
