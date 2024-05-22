import styled from "@emotion/native";
import { View } from "react-native";
import { SkiaShadow } from "react-native-skia-shadow";
import {
  Svg,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Circle,
  Path,
  G,
  RadialGradient,
} from "react-native-svg";
import { wwN } from "../../global/global-stiles.js";

const BackBoard = ({
  size = { x: wwN(390), y: wwN(390) },
  margin = wwN(57),
  radius = 16,
  background = "#d5f7ff",
  value1,
  value2,
  value3,
  value4,
}) => {
  const tSize = {
    w: (size.x - 2 * margin).toString(),
    // w: "200",
    h: (size.y - 2 * margin).toString(),
  };
  console.log("🚀 ~  ~  ~  ~  ~  ~  ~ ");
  console.log("🚀 ~ tSize:", tSize, "size", size);
  const backgroundPlan = "#71D4EB";
  // const angle = value3;
  // const x2 = Math.cos((angle * Math.PI) / 180).toFixed(2); // cos(25°)
  // const y2 = Math.sin((angle * Math.PI) / 180).toFixed(2); // sin(25°)

  return (
    // <SkiaShadow blur={4} dx={-6} dy={6} color="#00000060">
    //   <SkiaShadow blur={4} dx={6} dy={-6} color="#ffffff">
    <Container backgroundPlan={backgroundPlan} width={tSize.w}></Container>
    //   </SkiaShadow>
    // </SkiaShadow>
  );
};
export default BackBoard;

const Container = styled.View`
  width: ${(props) => props.width}px;
  aspect-ratio: 1;
  border: 1px solid #1500ff;
  background-color: ${(props) => props.backgroundPlan};
`;
