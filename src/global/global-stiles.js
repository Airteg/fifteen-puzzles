import { css } from "@emotion/native";
import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");
const windowHeight = windowDimensions.height;
const windowWidth = windowDimensions.width;

export const globalStyles = {
  container: css`
    margin: 0;
    padding: 0;
    background-color: skyblue;
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: solid red 5px;
    box-sizing: border-box;
  `,
};

export const hw = (h) => Math.round((h * windowHeight) / 844);
