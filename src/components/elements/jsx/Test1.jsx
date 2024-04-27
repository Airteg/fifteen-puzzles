import styled, { css } from "@emotion/native";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

const Test = ({ width, height }) => {
  return (
    <Size style={{ width, height }}>
      <LGShadow />
      <Container>
        <ContainerColor></ContainerColor>
      </Container>
    </Size>
  );
};

export default Test;

const Size = styled.View`
  background-color: #ffffff;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
`;
const Container = styled.View`
  width: 93%;
  height: 93%;
  border-radius: 5px;
  background-color: #ffffff;
  border: 1px solid #ffffffa7;
`;

const ContainerColor = () => (
  <LinearGradient
    start={{ x: 1, y: 0 }}
    end={{ x: 0.5, y: 0.8 }}
    colors={["#b0b0b087", "#dddddd", "#f0f0f0"]}
    locations={[0.0, 0.35, 1]}
    style={linearGradientStyle.background}
  />
);
const LGShadow = () => (
  <LinearGradient
    start={{ x: 1, y: 0 }}
    end={{ x: 0, y: 0.8 }}
    colors={["#ffffff4f", "#eeeeeed3", "#999999fb"]}
    locations={[0, 0.52, 1]}
    style={linearGradientStyle.shadow}
  />
);
const linearGradientStyle = {
  background: css`
    flex: 1;
    border-radius: 5px;
  `,
  shadow: css`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 6px;
  `,
};
