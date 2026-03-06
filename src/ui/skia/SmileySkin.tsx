import { Circle, Group, Path, Shadow, Skia } from "@shopify/react-native-skia";
import React from "react";

/** * 1. Константи винесені в глобальну область.
 * Парсимо шляхи ОДИН раз при ініціалізації файлу.
 */
const BASE_DESIGN_SIZE = 88;
const FACE_R = BASE_DESIGN_SIZE / 2;
const CX = FACE_R;
const CY = FACE_R;

// Константи очей
const EYE_R = 6.5;
const PUPIL_R = 3.3;
const L_EYE_CX = 33;
const L_EYE_CY = 31;
const R_EYE_CX = 63;
const R_EYE_CY = 45;

// Парсимо SVG рядки один раз
const FEATURES_PATH = Skia.Path.MakeFromSVGString(
  "M20.4 20.9C23.3 15.7 33.1 11.5 39.8 15.9 M66.3 29.6C73.1 31.1 77.5 38.4 76.3 45.1",
);
const MOUTH_PATH = Skia.Path.MakeFromSVGString(
  "M49.7 69.5C41.7 72.3 24.9 73.1 21.8 54.1",
);

type Props = {
  size?: number;
};

/**
 * Окремі компоненти для очей тепер використовують глобальні константи
 */
const LeftEye = () => (
  <Group>
    <Circle cx={L_EYE_CX} cy={L_EYE_CY} r={EYE_R} color="#FFFFFF">
      <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
    </Circle>
    <Circle
      cx={L_EYE_CX}
      cy={L_EYE_CY}
      r={EYE_R}
      color="#000000"
      style="stroke"
      strokeWidth={1}
    />
    <Circle
      cx={L_EYE_CX + 0.5}
      cy={L_EYE_CY - 0.7}
      r={PUPIL_R}
      color="#000000"
    />
  </Group>
);

const RightEye = () => (
  <Group>
    <Circle cx={R_EYE_CX} cy={R_EYE_CY} r={EYE_R} color="#FFFFFF">
      <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
    </Circle>
    <Circle
      cx={R_EYE_CX}
      cy={R_EYE_CY}
      r={EYE_R}
      color="#000000"
      style="stroke"
      strokeWidth={1}
    />
    <Circle
      cx={R_EYE_CX + 0.5}
      cy={R_EYE_CY - 0.7}
      r={PUPIL_R}
      color="#000000"
    />
  </Group>
);

export function SmileySkin({ size = BASE_DESIGN_SIZE }: Props) {
  // Розрахунок масштабу — єдина операція всередині компонента
  const scale = size / BASE_DESIGN_SIZE;

  if (!FEATURES_PATH || !MOUTH_PATH) return null;

  return (
    <Group transform={[{ scale: scale }]}>
      {/* Обличчя з внутрішньою та зовнішньою тінями */}
      <Circle cx={CX} cy={CY} r={FACE_R} color="#FAFF3F">
        <Circle cx={CX} cy={CY} r={FACE_R - 3} color="#FAFF3F">
          <Shadow dx={0} dy={0} blur={7} color="#a6ac2e" inner />
        </Circle>
        <Shadow dx={0} dy={4} blur={4} color="rgba(0, 0, 0, 0.25)" />
      </Circle>

      <LeftEye />
      <RightEye />

      <Path
        path={FEATURES_PATH}
        color="#000000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
      />

      <Path
        path={MOUTH_PATH}
        color="#000000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
      />
    </Group>
  );
}
