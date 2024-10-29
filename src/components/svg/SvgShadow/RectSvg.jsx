import { Rect } from "react-native-svg";

export default function RectSvg({ w, h, r, fill }) {
  return {
    w,
    h,
    element: <Rect x={0} y={0} width={w} height={h} rx={r} fill={fill} />,
  };
}
