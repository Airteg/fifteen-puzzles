import { View, Text } from "react-native";
import React from "react";
import {
  Box,
  Circle,
  Group,
  Paint,
  Shadow,
  circle,
  rect,
  rrect,
  vec,
} from "@shopify/react-native-skia";
import { wwN } from "../../../global/global-stiles.js";

export default function Smile({ cx = 0, cy = 0 }) {
  const x = cx - 44,
    y = cy - 44;

  const width = 256;
  const height = 256;
  const strokeWidth = 10;
  const c = vec(width / 2, height / 2);
  const r = (width - strokeWidth) / 2;

  return (
    <Group>
      {/* Овал обличчя */}
      <Circle cx={cx} cy={cy} r={88} color="#FAFF3F">
        <Shadow dx={0} dy={4} blur={4} color="#00000019" />
      </Circle>
      <Circle cx={cx} cy={cy} r={88 - 6} color="#FAFF3F">
        <Shadow dx={0} dy={0} blur={10} color="#80909249" inner />
      </Circle>
      {/* Ліве око */}
      <Group>
        <Circle cx={x + 30.56 - 7.335} cy={y + 22.12} r={14.67} color="#fff">
          <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
        </Circle>
        <Circle cx={x + 30.56 - 7.335} cy={y + 22.12} r={14.67} color="#fff">
          <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
        </Circle>
      </Group>
      {/* Праве око */}
      <Circle cx={x + 30.56 - 7.335} cy={y + 22.12} r={14.67} color="#fff">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle>
      <Circle cx={x + 30.56 - 7.335} cy={y + 22.12} r={14.67} color="#fff">
        <Shadow dx={4} dy={4} blur={4} color="#71D4EB" inner />
      </Circle>
      {/* Ліва брова */}
      <Group></Group>
      {/* Права брова */}
      <Group></Group>
      {/* Посмішка */}
      <Group></Group>
    </Group>
  );
}
