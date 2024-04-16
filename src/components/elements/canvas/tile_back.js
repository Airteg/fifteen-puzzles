import {
  Group,
  LinearGradient,
  Path,
  Shadow,
  scale,
  vec,
} from "@shopify/react-native-skia";

export default function TileBack({ cx = 0, cy = 0, scale = 1 }) {
  return (
    <Group transform={[{ scale }, { translateX: cx }, { translateY: cy }]}>
      <Path
        color="#FFFFFF"
        path="M56 0H4C1.8 0 0 1.8 0 4V56C0 58.2 1.8 60 4 60H56C58.2 60 60 58.2 60 56V4C60 1.8 58.2 0 56 0Z"
      >
        <Shadow dx={-3} dy={3} blur={4} color="#00000080" />
        <Shadow dx={3} dy={-3} blur={4} color="#FFFFFF80" />
      </Path>
      <Path path="M55.3.7H4.7C2.5.7.7 2.5.7 4.7V55.3C.7 57.5 2.5 59.3 4.7 59.3H55.3C57.5 59.3 59.3 57.5 59.3 55.3V4.7C59.3 2.5 57.5.7 55.3.7Z">
        <LinearGradient
          start={vec(14, 64)}
          end={vec(45, -4)}
          colors={["#FDFDFD", "#D0D0D0"]}
        />
      </Path>
    </Group>
  );
}
