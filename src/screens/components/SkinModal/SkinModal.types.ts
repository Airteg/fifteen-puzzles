import type { SkFont } from "@shopify/react-native-skia";

export type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HitRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ModalProps = {
  frame: Frame;
  S: number;
  snap: (v: number) => number;
};

export type SceneProps = ModalProps & {
  titleFont: SkFont | null;
  boardColor?: string;
  tileColor?: string;
};

export function normalizeColor(color?: string) {
  return (color ?? "").trim().toLowerCase();
}
