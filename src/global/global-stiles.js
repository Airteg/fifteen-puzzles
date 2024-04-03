import { css } from "@emotion/native";
import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");
const windowHeight = windowDimensions.height;
const windowWidth = windowDimensions.width;
export const hw = (h) => Math.round((h * windowHeight) / 844).toString();
export const ww = (w) => Math.round((w * windowWidth) / 844).toString();

export const globalStyles = {
  container: css`
    margin: 0;
    padding-left: ${ww(25)}px;
    padding-right: ${ww(25)}px;
    background-color: skyblue;
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: solid red 5px;
    box-sizing: border-box;
  `,
};
