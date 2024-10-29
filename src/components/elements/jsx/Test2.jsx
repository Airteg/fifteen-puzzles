import React from "react";
import { View } from "react-native";
import styled from "@emotion/native";
import { Svg, Rect, G } from "react-native-svg";
import { color, ww } from "../../../global/global-stiles.js";

export default function Test() {
  const initialSize = ww(60); // розмір найбільшого квадрата
  const squareCount = 6; // кількість квадратів
  console.log("🚀 ~ squareCount:", squareCount);
  const initialRadius = initialSize * 0.08;
  const squares = Array.from(
    { length: squareCount },
    (_, i) => initialSize - i,
  );

  return (
    <Container>
      <SvgContainer width={initialSize}>
        <SvgStyled viewBox={`0 0 ${initialSize} ${initialSize}`}>
          {squares.map((_, index) => {
            const isLast = index === squares.length - 1;
            const fill = isLast ? color.MAIN_COLOR : "#00000004";
            const scaleFactor = 1 - index * 0.03; // поступове зменшення масштабу
            console.log("🚀 ~ scaleFactor:", scaleFactor);
            return (
              <G
                key={index}
                scale={scaleFactor}
                originX={initialSize / 2} // Центр по осі X
                originY={initialSize / 2} // Центр по осі Y
              >
                <Rect
                  x={0} // Центруємо по осі X
                  y={0} // Центруємо по осі Y
                  width={initialSize}
                  height={initialSize}
                  rx={initialRadius * scaleFactor * scaleFactor} // Радіус заокруглення
                  stroke="none"
                  fill={fill}
                  strokeWidth={0}
                />
                <Rect x={0} y={0} width={w} height={h} rx={r} fill={fill} />
              </G>
            );
          })}
        </SvgStyled>
      </SvgContainer>
    </Container>
  );
}

const Container = styled(View)`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
`;
const SvgContainer = styled(View)`
  width: ${(props) => ww(props.width)}px;
  height: ${(props) => ww(props.width)}px;
  /* border: 1px solid green; */
`;
const SvgStyled = styled(Svg)``;
