import { LinearGradient } from "expo-linear-gradient";

const LGr = ({
  params: [
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    startColor = "#00000080",
    endColor = "transparent",
  ],
}) => {
  return (
    <LinearGradient
      colors={[startColor, endColor]}
      start={{ x: startX, y: startY }}
      end={{ x: endX, y: endY }}
      style={{ flex: 1, position: "absolute", transformOrigin: "top right" }}
    />
  );
};

export default LGr;
