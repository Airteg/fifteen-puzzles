import { View } from "react-native";
import styled from "@emotion/native";

import { dfjccaic } from "../../../../global/global-stiles.js";
import { Defs, LinearGradient, G, Path, Stop, Svg } from "react-native-svg";

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
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={"0 0 60 60"}
      fill="none"
      // {...props}
    >
      <G filter="url(#a)">
        <Path
          fill="url(#b)"
          d="M 55.859 0.101 H 4.14 a 4.04 4.04 0 0 0 -4.04 4.04 V 55.86 a 4.04 4.04 0 0 0 4.04 4.04 H 55.86 a 4.04 4.04 0 0 0 4.04 -4.04 V 4.14 a 4.04 4.04 0 0 0 -4.04 -4.04 Z"
        />
        <Path
          fill="url(#c)"
          d="M 55.252 0.707 H 4.747 a 4.04 4.04 0 0 0 -4.04 4.04 v 50.505 a 4.04 4.04 0 0 0 4.04 4.04 h 50.505 a 4.04 4.04 0 0 0 4.04 -4.04 V 4.747 a 4.04 4.04 0 0 0 -4.04 -4.04 Z"
        />
      </G>
      <Defs>
        <LinearGradient
          id="b"
          x1={19.772}
          x2={52.23}
          y1={70.808}
          y2={1.194}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.17} stopColor="#A4B3BD" />
          <Stop offset={0.73} stopColor="#EEF1F3" />
          <Stop offset={0.85} stopColor="#fff" />
        </LinearGradient>
        <LinearGradient
          id="c"
          x1={20.111}
          x2={51.891}
          y1={70.079}
          y2={1.923}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FDFDFD" />
          <Stop offset={0.3} stopColor="#F4F4F4" />
          <Stop offset={0.79} stopColor="#DCDCDC" />
          <Stop offset={1} stopColor="#D0D0D0" />
        </LinearGradient>
      </Defs>
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
