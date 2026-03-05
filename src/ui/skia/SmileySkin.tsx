import { Circle, Group, Path, Shadow, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";

type Props = {
  size: number;
};

export function SmileySkin({ size }: Props) {
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
        <Shadow dx={0} dy={4} blur={4} color="rgba(0, 0, 0, 0.25)" />
        <Shadow dx={0} dy={0} blur={10} color="#809092" inner />
      </Circle>

      {/* Ліве око (Ellipse 7) */}
      <Circle cx={lEyeCx} cy={lEyeCy} r={eyeR} color="#FFFFFF">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle>
      {/* Обведення лівого ока */}
      <Circle
        cx={lEyeCx}
        cy={lEyeCy}
        r={eyeR}
        color="#000000"
        style="stroke"
        strokeWidth={1}
      />
      {/* Ліва зіниця (Ellipse 8) */}
      <Circle cx={lPupilCx} cy={lPupilCy} r={pupilR} color="#000000" />

      {/* Праве око (Ellipse 6) */}
      <Circle cx={rEyeCx} cy={rEyeCy} r={eyeR} color="#FFFFFF">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle>
      {/* Обведення правого ока */}
      <Circle
        cx={rEyeCx}
        cy={rEyeCy}
        r={eyeR}
        color="#000000"
        style="stroke"
        strokeWidth={1}
      />
      {/* Права зіниця (Ellipse 9) */}
      <Circle cx={rPupilCx} cy={rPupilCy} r={pupilR} color="#000000" />

      {/* Рот та брови (Vectors 24, 25, 26) */}
      <Path
        path={paths.mouth}
        color="#000000"
        style="stroke"
        strokeWidth={3}
        strokeCap="round"
      />
      <Path
        path={paths.leftBrow}
        color="#000000"
        style="stroke"
        strokeWidth={3}
        strokeCap="round"
      />
      <Path
        path={paths.rightBrow}
        color="#000000"
        style="stroke"
        strokeWidth={3}
        strokeCap="round"
      />
    </Group>
  );
}
