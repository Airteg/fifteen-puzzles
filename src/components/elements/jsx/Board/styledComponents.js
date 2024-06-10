import { View } from "react-native";
import styled from "@emotion/native";

import { dfjccaic } from "../../../../global/global-stiles.js";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";

export const Container = styled.View`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
export const OuterContainer = styled.View`
  width: 90%;
  aspect-ratio: 1;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const InnerContainer = styled.View`
  width: 98%;
  aspect-ratio: 1;
  background-color: none;
  border-radius: 8px;
  ${dfjccaic}
`;

export const ColorBoard = styled.View`
  width: 96%;
  aspect-ratio: 1;
  background-color: ${(props) => props.color};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BackGround = () => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <Svg viewBox="0 0 420 420">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#FDFDFD" stopOpacity="1" />
          <Stop offset="0.35" stopColor="#F4F4F4" stopOpacity="1" />
          <Stop offset="0.65" stopColor="#DCDCDC" stopOpacity="1" />
          <Stop offset="1" stopColor="#D0D0D0" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x={0}
        y={0}
        width={420}
        height={420}
        fill="url(#grad)"
        stroke="none"
      />
    </Svg>
  </View>
);

export const TileWrapper = styled.View`
  width: 98.5%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: stretch;
`;
