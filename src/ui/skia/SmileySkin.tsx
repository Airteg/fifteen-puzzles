import { Circle, Group, Path, Shadow, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";

type Props = {
  // size - це вже розрахований розмір ззовні (наприклад, snap(88 * S))
  size?: number;
};

// Константа, на якій базувався твій дизайн
const BASE_DESIGN_SIZE = 88;

export function SmileySkin({ size = BASE_DESIGN_SIZE }: Props) {
  // Вираховуємо, у скільки разів треба збільшити/зменшити смайлик
  const scale = size / BASE_DESIGN_SIZE;

  const faceR = BASE_DESIGN_SIZE / 2;
  const cx = faceR;
  const cy = faceR;

  // Парсимо шляхи лише один раз
  const featuresFacePath = useMemo(() => {
    return Skia.Path.MakeFromSVGString(
      "M20.4 20.9C23.3 15.7 33.1 11.5 39.8 15.9 M66.3 29.6C73.1 31.1 77.5 38.4 76.3 45.1",
    );
  }, []);

  const mouthPath = useMemo(() => {
    return Skia.Path.MakeFromSVGString(
      "M49.7 69.5C41.7 72.3 24.9 73.1 21.8 54.1",
    );
  }, []);

  // Якщо парсинг чомусь не вдався (наприклад, помилка в рядку), Skia поверне null
  if (!featuresFacePath || !mouthPath) return null;

  return (
    // Масштабуємо всю групу. Точка масштабування за замовчуванням (0,0) - лівий верхній кут
    <Group transform={[{ scale: scale }]}>
      <Circle cx={cx} cy={cy} r={faceR} color="#FAFF3F">
        <Circle cx={cx} cy={cy} r={faceR - 3} color="#FAFF3F">
          <Shadow dx={0} dy={0} blur={7} color="#a6ac2e" inner />
        </Circle>
        <Shadow dx={0} dy={4} blur={4} color="rgba(0, 0, 0, 0.25)" />
      </Circle>

      <LeftEye />
      <RightEye />

      {/* Передаємо вже готові об'єкти шляхів */}
      <Path
        path={featuresFacePath}
        color="#000000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
      />

      <Path
        path={mouthPath}
        color="#000000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
      />
    </Group>
  );
}

const LeftEye = () => {
  const lEyeCx = 33;
  const lEyeCy = 31;
  const eyeR = 6.5;
  return (
    <Group>
      <Circle cx={lEyeCx} cy={lEyeCy} r={eyeR} color="#FFFFFF">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle>
      <Circle
        cx={lEyeCx}
        cy={lEyeCy}
        r={eyeR}
        color="#000000"
        style="stroke"
        strokeWidth={1}
      />
      <Circle cx={lEyeCx + 0.5} cy={lEyeCy - 0.7} r={3.3} color="#000000" />
    </Group>
  );
};

const RightEye = () => {
  const rEyeCx = 63;
  const rEyeCy = 45;
  const eyer = 6.5;
  return (
    <Group>
      <Circle cx={rEyeCx} cy={rEyeCy} r={eyer} color="#FFFFFF">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle>
      <Circle
        cx={rEyeCx}
        cy={rEyeCy}
        r={eyer}
        color="#000000"
        style="stroke"
        strokeWidth={1}
      />
      <Circle cx={rEyeCx + 0.5} cy={rEyeCy - 0.7} r={3.3} color="#000000" />
    </Group>
  );
};
