import { Group, Path, Shadow } from "@shopify/react-native-skia";

export default function Smile({ cx = 10, cy = 10, scale = 1 }) {
  return (
    <Group transform={[{ scale }, { translateX: cx }, { translateY: cy }]}>
      {/* ------ Овал обличчя ------ */}
      <Path
        color="#FAFF3F"
        style="fill"
        path="M 0 44 A 44 44 0 1 0 88 44 A 44 44 0 1 0 0 44 "
      >
        <Shadow dx={0} dy={4} blur={4} color="#00000019" />
      </Path>
      <Path
        color="#FAFF3F"
        style="fill"
        path="M 1.5 44 A 42.5 42.5 0 1 0 86.5 44 A 42.5 42.5 0 1 0 1.5 44 "
      >
        <Shadow dx={0} dy={0} blur={5} color="#80909290" inner />
      </Path>
      {/* ------ Елементи обличчя ------ */}
      {/* Посмішка */}
      <Path
        color="#000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
        path="M 49.7 69.5 C 41.7 72.3 24.9 73.1 21.8 54.1 "
      ></Path>
      {/* Ліва брова */}
      <Path
        color="#000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
        path="M 20.4 20.9 C 23.3 15.7 33.1 11.5 39.8 15.9 "
      ></Path>
      {/* Права брова */}
      <Path
        color="#000"
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
        path="M 66.3 29.6 C 73.1 31.1 77.5 38.4 76.3 45.1 "
      ></Path>
      {/* Ліве око */}
      <Path
        color="#000"
        style="stroke"
        strokeWidth={1}
        path="M 26.3 32 A 7.3 7.3 0 1 0 41 32 A 7.3 7.3 0 1 0 26.3 32 "
      />
      <Path
        color="#fff"
        style="fill"
        path="M 26.8 32 A 6.8 6.8 0 1 0 40.5 32 A 6.8 6.8 0 1 0 26.8 32 "
      >
        <Shadow dx={4} dy={4} blur={4} color="#71D4EBd0" inner />
      </Path>
      <Path
        color="#000"
        style="fill"
        path="M 30.7 31.1 A 3.4 3.4 0 1 0 37.5 31.1 A 3.4 3.4 0 1 0 30.7 31.1 "
      ></Path>
      {/* Праве око */}
      <Path
        color="#000"
        style="stroke"
        strokeWidth={1}
        path="M 54.7 45.4 A 7.3 7.3 0 1 0 69.4 45.4 A 7.3 7.3 0 1 0 54.7 45.4 "
      />
      <Path
        color="#fff"
        style="fill"
        path="M 55.2 45.4 A 6.8 6.8 0 1 0 68.9 45.4 A 6.8 6.8 0 1 0 55.2 45.4 "
      >
        <Shadow dx={4} dy={4} blur={4} color="#71D4EBd0" inner />
      </Path>
      <Path
        color="#000"
        style="fill"
        path="M 58.9 44.8 A 3.4 3.4 0 1 0 65.7 44.8 A 3.4 3.4 0 1 0 58.9 44.8"
      />
    </Group>
  );
}
