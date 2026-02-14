import { PixelRatio } from "react-native";

export const snap = (v: number) => PixelRatio.roundToNearestPixel(v);

export type Rect = { x: number; y: number; width: number; height: number };

export const snapRect = (r: Rect): Rect => ({
  x: snap(r.x),
  y: snap(r.y),
  width: snap(r.width),
  height: snap(r.height),
});
