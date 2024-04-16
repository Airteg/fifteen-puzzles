import {
  Group,
  LinearGradient,
  Path,
  Rect,
  Shadow,
  scale,
  vec,
} from "@shopify/react-native-skia";

export default function TileBack({ cx = 0, cy = 0, scale = 1 }) {
  return (
    <Group transform={[{ scale }, { translateX: cx }, { translateY: cy }]}>
      <Rect x={0}></Rect>
    </Group>
  );
}
