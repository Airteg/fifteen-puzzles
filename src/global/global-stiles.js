import { css } from "@emotion/native";
import { Dimensions, Platform } from "react-native";

const windowDimensions = Dimensions.get("window");
console.log("🚀 ~ windowDimensions:", windowDimensions);
export const windowHeight = windowDimensions.height;
export const windowWidth = windowDimensions.width;

//Висота вікна -> текст
export const hw = (h) =>
  (Math.round((h * 1000 * windowHeight) / 844) / 1000).toString();
//Ширина вікна -> текст
export const ww = (w) =>
  (Math.round((w * 1000 * windowWidth) / 390) / 1000).toString();
//Висота вікна -> число
export const hwN = (h) => Math.round((h * 1000 * windowHeight) / 844) / 1000;
//Ширина вікна -> число
export const wwN = (w) => Math.round((w * 1000 * windowWidth) / 390) / 1000;

export const dfjccaic = `display: flex;
  justify-content: center;
  align-items: center;`;
export const platform = Platform.OS === "ios";

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
    /* border: solid red 2px; */
  `,
};
