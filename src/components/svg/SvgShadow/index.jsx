// src/components/svg/SvgShadow/index.jsx
import { Svg, G, Rect } from "react-native-svg";
import normalizeColor from "./utils/normalizeColor";
import opacityHex from "./utils/opacityHex";

export default function SvgShadow({
  Fgr,
  w = 100,
  h = 60,
  r,
  fill,
  shadowColor = "#00000080",
  blur = 5,
  offsetX = 0,
  offsetY = 0,
}) {
  const maxScale = (a) => (a === 0 ? 1 : (a + blur * 2) / a);

  console.log("->");
  console.log("MaxScaleX", maxScale(w));
  console.log("stepScaleX", (maxScale(w) - 1) / (blur * 4));
  console.log("MaxScaleY", maxScale(h));
  console.log("stepScaleY", (maxScale(h) - 1) / (blur * 4));
  console.log("new Width shadow", w * maxScale(w));
  console.log("new Height shadow", h * maxScale(h));

  const figureCount = blur * 2; // Кількість фігур для blur
  const stepScaleY = (maxScale(h) - 1) / (blur * 4); // Крок зменшення для scaleY
  const stepScaleX = (maxScale(w) - 1) / (blur * 4); // Крок зменшення для scaleX

  // Нормалізуємо колір тіні і виділяємо базову прозорість
  const { baseColor, colorTransparency } = normalizeColor(shadowColor);

  // Розрахунок фіксованої прозорості для кожного шару (в HEX)
  const layerOpacityHex = opacityHex(colorTransparency / figureCount);

  // Розрахунок максимальних розмірів тіньових фігур з урахуванням blur
  const maxBlurWidth = w * (1 + stepScaleX * figureCount);

  const maxBlurHeight = h * (1 + stepScaleY * figureCount);

  // Розрахунок viewBox з урахуванням blur та offset
  const viewWidth = maxBlurWidth + Math.abs(offsetX) + blur;

  const viewHeight = maxBlurHeight + Math.abs(offsetY) + blur;

  // const viewBoxX = -blur / 2 - Math.abs(offsetX) / 2;
  // const viewBoxY = -blur / 2 - Math.abs(offsetY) / 2;
  const viewBoxX = 0;
  const viewBoxY = 0;

  console.log("Dim w, h:", w, h);
  console.log("blur:", blur, "offsetX:", offsetX, "offsetY:", offsetY);

  // Масив фігур для тіні з поступовим зменшенням scaleX і scaleY
  const blurElements = Array.from({ length: figureCount }, (_, i) => {
    const scaleX = 1 - stepScaleX * (figureCount - (i + 1));
    const scaleY = 1 - stepScaleY * (figureCount - (i + 1));

    const { element } = Fgr({
      w,
      h,
      r,
      fill: `${baseColor}${layerOpacityHex}`, // Застосовуємо фіксовану прозорість
    });
    console.log("🚀 ~ i:", i, "w:", w * scaleX, "h:", h * scaleY);

    return { element, scaleX, scaleY };
  });

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
