// src/components/svg/SvgShadow/index.jsx
import { Svg, G, Rect } from "react-native-svg";
import normalizeColor from "./utils/normalizeColor";
import opacityHex from "./utils/opacityHex";

export default function SvgShadow({
  Fgr,
  w,
  h,
  r,
  fill,
  shadowColor = "#00000080",
  blur = 5,
  offsetX = 0,
  offsetY = 0,
}) {
  const figureCount = blur * 2; // Кількість фігур для blur
  const stepScaleY = 1 / (h * 2); // Крок зменшення для scaleY
  const stepScaleX = 1 / (w * 2); // Крок зменшення для scaleX

  // Нормалізуємо колір тіні і виділяємо базову прозорість
  const { baseColor, colorTransparency } = normalizeColor(shadowColor);

  // Розрахунок фіксованої прозорості для кожного шару (в HEX)
  const layerOpacityHex = opacityHex(colorTransparency / figureCount);

  // Розрахунок максимальних розмірів тіньових фігур з урахуванням blur
  const maxBlurWidth = w * (1 + stepScaleX * figureCount);
  console.log("🚀 ~ maxBlurWidth:", maxBlurWidth);
  const maxBlurHeight = h * (1 + stepScaleY * figureCount);
  console.log("🚀 ~ maxBlurHeight:", maxBlurHeight);

  // Розрахунок viewBox з урахуванням blur та offset
  const viewWidth = maxBlurWidth + Math.abs(offsetX) + blur;
  console.log("🚀 ~ viewWidth:", Math.round(viewWidth));
  const viewHeight = maxBlurHeight + Math.abs(offsetY) + blur;
  console.log("🚀 ~ viewHeight:", Math.round(viewHeight));
  // const viewBoxX = -blur / 2 - Math.abs(offsetX) / 2;
  // const viewBoxY = -blur / 2 - Math.abs(offsetY) / 2;
  const viewBoxX = 0;
  const viewBoxY = 0;

  console.log("->");
  console.log("Dim", w, h);
  console.log("blur:", blur, "offsetX:", offsetX, "offsetY:", offsetY);

  console.log("viewBox:", `${viewBoxX} ${viewBoxY} ${viewWidth} ${viewHeight}`);
  console.log(
    "oldDim",
    w,
    h,
    " <---> ",
    "newDim",
    viewWidth - viewBoxX,
    viewHeight - viewBoxY,
  );

  // Масив фігур для тіні з поступовим зменшенням scaleX і scaleY
  const blurElements = Array.from({ length: figureCount }, (_, i) => {
    const scaleX = 1 - stepScaleX * (figureCount - i);
    const scaleY = 1 - stepScaleY * (figureCount - i);

    const { element } = Fgr({
      w,
      h,
      r,
      fill: `${baseColor}${layerOpacityHex}`, // Застосовуємо фіксовану прозорість
    });
    return { element, scaleX, scaleY };
  });
  const blEl = blurElements.map(({ scaleX, scaleY }) => [
    Math.round(scaleX * w * 1000) / 1000,
    Math.round(scaleY * h * 1000) / 1000,
  ]);

  console.log("🚀 ~ blEl:", blEl);

  // Знаходимо найменші значення scaleX і scaleY для найменшої фігури
  const minScaleX = 1 - stepScaleX * figureCount;
  const minScaleY = 1 - stepScaleY * figureCount;

  return (
    <Svg viewBox={`${viewBoxX} ${viewBoxY} ${viewWidth} ${viewHeight}`}>
      {/* Тіньові фігури з однаковою прозорістю та зміщенням */}
      {blurElements.map(({ element, scaleX, scaleY }, index) => (
        <G
          key={index}
          scaleX={scaleX}
          scaleY={scaleY}
          originX={w / 2 + offsetX}
          originY={h / 2 + offsetY}
        >
          {element}
        </G>
      ))}

      {/* Оригінальна фігура з основним кольором з найменшим масштабом, відцентрованим по viewBox */}
      <G
        scaleX={minScaleX}
        scaleY={minScaleY}
        originX={(viewWidth - viewBoxX) / 2}
        originY={(viewHeight - viewBoxY) / 2}
      >
        {Fgr({ w, h, r, fill }).element}
      </G>
      {}
      <Rect
        x={viewBoxX}
        y={viewBoxY}
        width={viewWidth}
        height={viewHeight}
        stroke="red"
        strokeWidth="1"
        fill="none"
      />
    </Svg>
  );
}
