import {
  Circle,
  Group,
  Path,
  Shadow,
  size,
  Skia,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

type Props = {
  size?: number;
};

export function SmileySkin({ size = 88 }: Props) {
  // Допоміжна функція для конвертації відсотків із CSS у пікселі відносно поточного розміру
  const pct = (val: number) => (size * val) / 100;

  // Центр та радіус жовтого обличчя
  const faceR = size / 2;
  const cx = faceR;
  const cy = faceR;

  // Радіус та координати очей (з урахуванням зсувів із CSS)
  const eyeW = 16.67;
  const eyeR = pct(eyeW / 2);

  const lEyeCx = pct(27.01 + eyeW / 2);
  const lEyeCy = pct(25.14 + eyeW / 2);

  const rEyeCx = pct(59.2 + eyeW / 2);
  const rEyeCy = pct(40.31 + eyeW / 2);

  // Координати зіниць
  const pupilW = 7.78;
  const pupilR = pct(pupilW / 2);

  const lPupilCx = pct(33.53 + pupilW / 2);
  const lPupilCy = pct(30.15 + pupilW / 2);

  const rPupilCx = pct(65.56 + pupilW / 2);
  const rPupilCy = pct(45.62 + pupilW / 2);

  // Створюємо векторні шляхи для рота та брів
  const paths = useMemo(() => {
    // Рот
    const mouth = Skia.Path.Make();
    mouth.moveTo(pct(25), pct(55));
    // Використовуємо квадратичну криву Безьє (quadTo) для плавної посмішки
    mouth.quadTo(pct(40), pct(80), pct(55), pct(65));

    // Ліва брова
    const leftBrow = Skia.Path.Make();
    leftBrow.moveTo(pct(23), pct(20));
    leftBrow.quadTo(pct(35), pct(10), pct(43), pct(15));

    // Права брова
    const rightBrow = Skia.Path.Make();
    rightBrow.moveTo(pct(65), pct(30));
    rightBrow.quadTo(pct(80), pct(28), pct(85), pct(40));

    return { mouth, leftBrow, rightBrow };
  }, [size]);

  return (
    <Group>
      {/* Основне обличчя (Ellipse 2) */}
      <Circle cx={cx} cy={cy} r={faceR} color="#FAFF3F">
        <Circle cx={cx} cy={cy} r={faceR - 3} color="#FAFF3F">
          <Shadow dx={0} dy={0} blur={10} color="#a6ac2e" inner />
        </Circle>
        <Shadow dx={0} dy={4} blur={4} color="rgba(0, 0, 0, 0.25)" />
      </Circle>

      {/* Праве око (Ellipse 6) */}
      {/* <Circle cx={rEyeCx} cy={rEyeCy} r={eyeR} color="#FFFFFF">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle> */}
      {/* Обведення правого ока */}
      {/* <Circle
        cx={rEyeCx}
        cy={rEyeCy}
        r={eyeR}
        color="#000000"
        style="stroke"
        strokeWidth={1}
      /> */}
      {/* Права зіниця (Ellipse 9) */}
      {/* <Circle cx={rPupilCx} cy={rPupilCy} r={pupilR} color="#000000" /> */}

      {/* Рот та брови (Vectors 24, 25, 26) */}
      <LeftEye />
      <Mouth />
      <LeftBrow />
      <RightBrow />
    </Group>
  );
}

const LeftEye = () => {
  const lEyeCx = 14.68;
  const lEyeCy = 25.14;
  return (
    <Group>
      {/* Ліве око (Ellipse 7) */}
      <Circle cx={lEyeCx} cy={lEyeCy} r={size / 10} color="#FFFFFF">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle>
      {/* Обведення лівого ока */}
      <Circle
        cx={lEyeCx}
        cy={lEyeCy}
        r={7.34}
        color="#000000"
        style="stroke"
        strokeWidth={1}
      />
      {/* Ліва зіниця (Ellipse 8) */}
      <Circle cx={0} cy={0} r={3.42} color="#000000" />
    </Group>
  );
};

const leftBrowPaths = "m 1 7.9 c 3 -5.3 12.8 -9.5 19.5 -5";
const LeftBrow = () => {
  return (
    <Group transform={[{ translateX: 18 }, { translateY: 16 }, { scale: 1 }]}>
      <Path
        path={leftBrowPaths}
        color="#000000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
      />
    </Group>
  );
};

const rightBrowPaths = "m 1 1 c 6.8 1.5 11.2 8.8 10 15.5";
const RightBrow = () => {
  return (
    <Group transform={[{ translateX: 65 }, { translateY: 30 }, { scale: 1 }]}>
      <Path
        path={rightBrowPaths}
        color="#000000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
      />
    </Group>
  );
};

const mouthPaths = "m28.9 16.5C20.9 19.2 4.1 20 1 1";
const Mouth = () => {
  return (
    <Group transform={[{ translateX: 20 }, { translateY: 55 }, { scale: 1 }]}>
      <Path
        path={mouthPaths}
        color="#000000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
      />
    </Group>
  );
};
