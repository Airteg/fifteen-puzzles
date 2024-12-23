import styled from "@emotion/native";
import React from "react";
import { View } from "react-native";
import { Svg, G, Rect } from "react-native-svg";
import { getBounds } from "./utils/countView.jsx";

const SvgShadow = ({
  SvgElement,
  blur = 4,
  offsetX = 0,
  offsetY = 0,
  width = 100,
  height = 200,
}) => {
  console.log("-------------------------");
  // створємо клон із модифікованими пропсами:
  const SvgElementClone = React.cloneElement(SvgElement, {
    fill: "#00000005",
  });

  const { width: viewWidth, height: viewHeight } = getBounds(SvgElement);

  // Перевіряємо, чи атрибут fill задано
  if (!SvgElement.props.fill) {
    console.warn(
      `⚠️ SvgElement is missing the "fill" property. \nReceived element of type "${SvgElement.type.name}".`,
    );
  }
  const maxScale = (a) => (a === 0 ? 1 : (a + blur * 2) / a);
  const figureCount = blur * 2; // Кількість фігур для blur
  const stepScaleY = (maxScale(width) - 1) / (blur * 2); // Крок зменшення для scaleY
  const stepScaleX = (maxScale(height) - 1) / (blur * 2); // Крок зменшення для scaleX

  // Масив фігур для тіні з поступовим зменшенням scaleX і scaleY
  const blurElements = Array.from({ length: figureCount }, (_, i) => {
    const scaleX = 1 - stepScaleX * (figureCount - (i + 1));
    const scaleY = 1 - stepScaleY * (figureCount - (i + 1));
    // console.log("🚀 ~ i:", i, "scaleX:", scaleX, "scaleY:", scaleY);
    return { SvgElementClone, scaleX, scaleY };
  });

  // Розрахунок розмірів Shadow
  const shadowWidth = width + 2 * blur,
    shadowHeight = height + 2 * blur,
    shadowScaleX = shadowWidth / width,
    shadowScaleY = shadowHeight / height;

  // Логування елемента та його пропсів
  console.log("🚀 ~ width:", width, "height:", height);
  console.log("🚀 ~ offsetX:", offsetX, "offsetY:", offsetY, "blur:", blur);
  // console.log("🚀 ~ SvgElement fill:", SvgElement.props.fill);
  // console.log("🚀 ~ SvgElement type:", SvgElement.type.name);
  // console.log("🚀 ~ SvgShadow fill:", SvgElementClone.props.fill);
  // console.log("🚀 ~ SvgShadow type:", SvgElementClone.type.name);
  console.log("🚀 ~ getBounds-> viewBox: 0 0", viewWidth, viewHeight);
  console.log("🚀 ~ shadowWidth:", shadowWidth, "shadowHeight:", shadowHeight);
  console.log("🚀 ~ offsetX:", offsetX - blur, "offsetY:", offsetY - blur);
  console.log("🚀 ~ scaleX:", shadowScaleX, "scaleY:", shadowScaleY);

  // Рендеримо SVG
  return (
    <Container>
      <Shadow
        width={shadowWidth}
        height={shadowHeight}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        offsetX={offsetX - blur}
        offsetY={offsetY - blur}
        blur={blur}
      >
        {blurElements
          .slice() // Робимо копію масиву, щоб не змінити оригінальний `blurElements`
          .reverse() // Змінюємо порядок елементів
          .map(({ SvgElementClone, scaleX, scaleY }, index) => {
            console.log(
              "scaleX",
              scaleX * shadowWidth,
              "scaleY",
              scaleY * shadowHeight,
            );
            return (
              <G
                key={index}
                scaleX={scaleX}
                scaleY={scaleY}
                originX={viewWidth / 2}
                originY={viewHeight / 2}
              >
                {SvgElementClone}
              </G>
            );
          })}
        <Rect
          x={0}
          y={0}
          width={viewWidth}
          height={viewHeight}
          fill="none"
          strokeWidth={5}
          stroke="cyan"
        />
      </Shadow>
      <SvgMain viewBox={`0 0 ${viewWidth} ${viewHeight}`}>{SvgElement}</SvgMain>
    </Container>
  );
};

export default SvgShadow;
const Container = styled(View)`
  width: 100%;
  height: 100%;
  overflow: visible;
  /* border: 1px solid orangered; */
`;

// TODO Якщо фігура менша ніж width та height потрібно маніпулювати viewBox
const SvgMain = styled(Svg)``;

const Shadow = styled(Svg)`
  top: ${(props) => props.offsetY.toString()}px;
  left: ${(props) => props.offsetX.toString()}px;
  position: absolute;
`;
