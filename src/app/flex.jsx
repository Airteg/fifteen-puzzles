import { View, Text } from "react-native";
import styled from "@emotion/native";
import { Dimensions } from "react-native";
import { useWindowSize } from "../hook/hooks";

export default function Flex() {
  const {
    window: { width, height },
  } = useWindowSize();
  // console.log("🚀 ~ height:", height);
  // console.log("🚀 ~ width:", width);
  win = Dimensions.get("window");
  console.log("🚀 ~ win:", win);
  // scr = Dimensions.get("screen");
  // console.log("🚀 ~ scr:", scr);
  return <Cont></Cont>;
}

const Cont = styled.View`
  /* border: solid red 3px; */
  /* flex-grow: 1; */

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const Box = styled.View`
  width: 50px;
  height: 50px;
  border: solid orange 1px;
  align-self: auto;
`;
