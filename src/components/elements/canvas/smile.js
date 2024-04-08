import { View, Text } from "react-native";
import React from "react";
import {
  Box,
  Circle,
  Group,
  Line,
  Paint,
  Path,
  Shadow,
  circle,
  rect,
  rrect,
  scale,
  translate,
  vec,
} from "@shopify/react-native-skia";
import { wwN } from "../../../global/global-stiles.js";

export default function Smile({ cx = 10, cy = 10, scale = 1 }) {
  return (
    <Group transform={[{ scale: 2 }, { translateX: cx }, { translateY: cy }]}>
      {/* ------ Овал обличчя ------ */}
      <Path
        color="#000"
        style="stroke"
        path="M 0 44 A 44 44 0 1 0 88 44 A 44 44 0 1 0 0 44 "
      ></Path>
      <Path
        color="#000"
        style="stroke"
        path="M 1.5 44 A 42.5 42.5 0 1 0 86.5 44 A 42.5 42.5 0 1 0 1.5 44 "
      ></Path>

      <Path
        color="#000"
        style="stroke"
        path="M 49.7 69.5 C 41.7 72.3 24.9 73.1 21.8 54.1 "
      ></Path>

      <Path
        color="#000"
        style="stroke"
        path="M 20.4 20.9 C 23.3 15.7 33.1 11.5 39.8 15.9 "
      ></Path>
      <Path
        color="#000"
        style="stroke"
        path="M 66.3 29.6 C 73.1 31.1 77.5 38.4 76.3 45.1 "
      ></Path>
      <Path
        color="#000"
        style="stroke"
        path="M 54.7 45.4 A 7.3 7.3 0 1 0 69.4 45.4 A 7.3 7.3 0 1 0 54.7 45.4 "
      ></Path>
      <Path
        color="#000"
        style="stroke"
        path="M 55.2 45.4 A 6.8 6.8 0 1 0 68.9 45.4 A 6.8 6.8 0 1 0 55.2 45.4 "
      ></Path>
      <Path
        color="#000"
        style="stroke"
        path="M 26.3 32 A 7.3 7.3 0 1 0 41 32 A 7.3 7.3 0 1 0 26.3 32 "
      ></Path>
      <Path
        color="#000"
        style="stroke"
        path="M 26.8 32 A 6.8 6.8 0 1 0 40.5 32 A 6.8 6.8 0 1 0 26.8 32 "
      ></Path>
      <Path
        color="#000"
        style="stroke"
        path="M 30.7 31.1 A 3.4 3.4 0 1 0 37.5 31.1 A 3.4 3.4 0 1 0 30.7 31.1 "
      ></Path>

      <Path
        color="#000"
        style="stroke"
        path="M 58.9 44.8 A 3.4 3.4 0 1 0 65.7 44.8 A 3.4 3.4 0 1 0 58.9 44.8"
      />

      {/* ------ Елементи обличчя ------ */}

      {/* Праве око */}

      {/* Ліва брова */}

      {/* Права брова */}

      {/* Посмішка */}
    </Group>
  );
}
