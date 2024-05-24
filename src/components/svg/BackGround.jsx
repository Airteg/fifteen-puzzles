import React from "react";
import { View } from "react-native";
import { Defs, LinearGradient, Path, Rect, Stop, Svg } from "react-native-svg";

const BackGround = ({ path, stroke, strokeWidth, fill }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderColor: "white",
        borderWidth: 1.5,
        borderStyle: "solid",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Svg viewBox={`0 0 420 420`}>
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
        {path ? (
          <Path
            d={path}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
          />
        ) : (
          ""
        )}
      </Svg>
    </View>
  );
};

export default BackGround;
