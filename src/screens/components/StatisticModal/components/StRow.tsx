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

  const resolvedTextColor = textColor ?? (isHeader ? "#D5F7FF" : "#1C2833");

  return (
    <View
      style={[
        styles.row,
        {
          minHeight: snap(28 * S),
          paddingHorizontal: snap(8 * S),
          paddingVertical: snap(6 * S),
          backgroundColor,
          borderRadius: radius,
        },
      ]}
    >
      <View style={[styles.cellWrap, { width: "12%" }]}>
        <Text
          style={[baseTextStyle, styles.text, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {values[0]}
        </Text>
      </View>

      <View style={[styles.cellWrap, { width: "30%" }]}>
        <Text
          style={[baseTextStyle, styles.text, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {values[1]}
        </Text>
      </View>

      <View style={[styles.cellWrap, { width: "23%" }]}>
        <Text
          style={[baseTextStyle, styles.text, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {values[2]}
        </Text>
      </View>

      <View style={[styles.cellWrap, { width: "35%" }]}>
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
    alignItems: "center",
  },
  cellWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
