import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Typography } from "@/theme/typography";

type CellValue = string | number;

type Props = {
  S: number;
  snap: (v: number) => number;
  values: [CellValue, CellValue, CellValue, CellValue];
  isHeader?: boolean;
  backgroundColor?: string;
  textColor?: string;
  radius?: number;
};

const makeBg = (alpha: number) => `rgba(113, 212, 235, ${alpha})`;

export function StRow({
  S,
  snap,
  values,
  isHeader = false,
  backgroundColor = "transparent",
  textColor,
  radius = 0,
}: Props) {
  const baseTextStyle = useMemo(
    () =>
      isHeader
        ? [
            Typography.mariupol.body(S),
            { fontFamily: "Mariupol-Bold" as const },
          ]
        : Typography.mariupol.body(S),
    [S, isHeader],
  );

  const resolvedTextColor = textColor ?? (isHeader ? "#ffffff" : "#1C2833");

  const alfa = typeof values[0] === "number" && values[0] % 2 === 0 ? 0.6 : 0;

  return (
    <View
      style={[
        styles.row,
        {
          minHeight: snap(28 * S),
          borderRadius: radius,
          backgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.cellWrap,
          { width: "12%", backgroundColor: makeBg(alfa + 0.3) },
        ]}
      >
        <Text
          style={[baseTextStyle, styles.text, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {values[0]}
        </Text>
      </View>

      <View
        style={[
          styles.cellWrap,
          {
            width: "30%",
            borderTopLeftRadius: values[0] === 1 ? 12 : 0,
            backgroundColor: makeBg(alfa),
          },
        ]}
      >
        <Text
          style={[baseTextStyle, styles.text, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {values[1]}
        </Text>
      </View>

      <View
        style={[
          styles.cellWrap,
          { width: "23%", backgroundColor: makeBg(alfa) },
        ]}
      >
        <Text
          style={[baseTextStyle, styles.text, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {values[2]}
        </Text>
      </View>

      <View
        style={[
          styles.cellWrap,
          { width: "35%", backgroundColor: makeBg(alfa) },
        ]}
      >
        <Text
          style={[baseTextStyle, styles.text, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {values[3]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
  },
  cellWrap: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    marginVertical: 6,
  },
});
