import { G, Svg } from "react-native-svg";

export default function SvgShadow({ Fgr, w, h, r, fill }) {
  const { w: width, h: height, element } = Fgr({ w, h, r, fill }); // передаємо пропси в `Fgr`

  return (
    <Svg viewBox={`0 0 ${width} ${height}`}>
      <G>{element}</G>
    </Svg>
  );
}
