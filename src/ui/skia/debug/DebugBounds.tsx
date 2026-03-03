import { Rect } from "@shopify/react-native-skia";

type Props = {
  rect: { x: number; y: number; width: number; height: number };
  SHADOW_BLUR: number;
};

export default function DebugBounds({ rect, SHADOW_BLUR }: Props) {
  if (!__DEV__) return null;
  return (
    <Rect
      x={rect.x - 0.5 - SHADOW_BLUR}
      y={rect.y - 0.5 - SHADOW_BLUR}
      width={rect.width + SHADOW_BLUR * 2 + 2}
      height={rect.height + SHADOW_BLUR * 2 + 2}
      color="#FF0000"
      style="stroke"
      strokeWidth={0.5}
    />
  );
}
