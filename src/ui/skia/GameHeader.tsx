import {
  Group,
  Path,
  Rect,
  RoundedRect,
  Shadow,
  Skia,
  type SkImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

import { LogoSkin } from "./LogoSkin";

const SOUND_ON_SVG =
  "M0 19.5V9H6.5L15 0V28L6.5 19.5H0ZM21 3c4 8.9 4 13.7 0 22M30 6c2.6 6.5 2.7 10 0 16";
const SOUND_OFF_SVG =
  "M.5 20V9.5H7l8.5-9v28L7 20H.5ZM22.4 5.8c-.1-.3-.4-.4-.6-.2-.3.1-.4.4-.2.6l4.2 8.5-4.2 8.1c-.2.2-.1.5.2.6.2.2.5.1.6-.2l4-7.4 3.7 7.4c.1.3.4.4.6.2.3-.1.4-.4.2-.6l-4-8.1 4.5-8.5c.2-.2.1-.5-.2-.6-.2-.2-.5-.1-.6.2l-4.2 7.9-4-7.9Z";

type Props = {
  hX: number;
  hY: number;
  hW: number;
  hH: number;
  fiveImage: SkImage;
  sound?: boolean;
};

export const GameHeader: React.FC<Props> = ({
  hX,
  hY,
  hW,
  hH,
  fiveImage,
  sound = true,
}) => {
  const wSound = hH * 0.65;
  const hSound = hH * 0.6;
  const xSound = hX + hW - wSound;
  const ySound = hY + (hH - hSound) / 2;

  const soundPath = useMemo(() => {
    const svgStr = sound ? SOUND_ON_SVG : SOUND_OFF_SVG;
    const origW = sound ? 40 : 31;
    const origH = 28;

    const p = Skia.Path.MakeFromSVGString(svgStr);
    if (!p) return { P: undefined, C: "transparent" };

    const scale = (hSound * 0.5) / origH;

    const m = Skia.Matrix();
    m.translate((wSound - origW * scale) / 2, (hSound - origH * scale) / 2);
    m.scale(scale, scale);

    p.transform(m);

    return {
      P: p,
      C: sound ? "#FAFF3F" : "#216169",
    };
  }, [sound, wSound, hSound]);

  return (
    <Group>
      <Rect x={hX} y={hY} width={hW} height={hH} color="transparent">
        <RoundedRect
          x={hX}
          y={hY}
          width={hH}
          height={hH}
          r={hH * 0.06}
          color="#D5F7FF"
        >
          <Shadow inner dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
          <Shadow dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
        </RoundedRect>
        <RoundedRect
          x={hX}
          y={hY}
          width={hH}
          height={hH}
          r={hH * 0.06}
          style="stroke"
          color="#D5F7FF"
          strokeWidth={3}
        />
      </Rect>

      <LogoSkin
        frame={{
          x: hX + 0.1 * hH,
          y: hY + 0.1 * hH,
          width: hH * 0.8,
          height: hH * 0.8,
        }}
        fiveImage={fiveImage}
      />

      <Group transform={[{ translateX: xSound }, { translateY: ySound }]}>
        <RoundedRect
          x={0}
          y={0}
          width={wSound}
          height={hSound}
          r={hH * 0.06}
          color="#D5F7FF"
        >
          <Shadow inner dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
          <Shadow dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.3)" />
        </RoundedRect>

        <RoundedRect
          x={0}
          y={0}
          width={wSound}
          height={hSound}
          r={hH * 0.06}
          style="stroke"
          strokeWidth={3}
          color="#D5F7FF"
        />

        {soundPath.P && <Path path={soundPath.P} color={soundPath.C} />}
        {soundPath.P && (
          <Path
            path={soundPath.P}
            color="000"
            style="stroke"
            strokeWidth={0.5}
          />
        )}
      </Group>
    </Group>
  );
};
