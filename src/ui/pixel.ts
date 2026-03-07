import { PixelRatio } from "react-native";

// для контролю цієї магії в твоєму проекті існує файл pixel.ts і функція snap.
// Використовує PixelRatio.roundToNearestPixel(v).
// Що вона робить фізично? Вона бере твої ігрові координати і підганяє їх так,
// щоб край твоєї плитки завжди потрапляв рівно на межу фізичного пікселя,
// а не зависав між ними (що призвело б до "мильного", розмитого краю).

export const snap = (v: number) => PixelRatio.roundToNearestPixel(v);

export type Rect = { x: number; y: number; width: number; height: number };

export const snapRect = (r: Rect): Rect => ({
  x: snap(r.x),
  y: snap(r.y),
  width: snap(r.width),
  height: snap(r.height),
});
