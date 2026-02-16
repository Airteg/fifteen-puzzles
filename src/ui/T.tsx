import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { Typography } from "@/theme/typography";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

type Variant =
  | "title"
  | "subtitle"
  | "body"
  | "kronaButton"
  | "headerTitle"
  | "headerDesc";

type Props = TextProps & {
  v: Variant;
  style?: TextStyle | TextStyle[];
};

export function T({ v, style, ...rest }: Props) {
  const { S } = useLayoutMetrics();

  const base =
    v === "headerTitle"
      ? Typography.krona.headerTitle(S)
      : v === "headerDesc"
        ? Typography.mariupol.headerDesc(S)
        : v === "title"
          ? Typography.mariupol.screenTitle(S)
          : v === "subtitle"
            ? Typography.mariupol.headerSubtitle(S)
            : v === "kronaButton"
              ? Typography.krona.buttonLabel(S)
              : Typography.mariupol.body(S);

  return <Text {...rest} style={[base, style]} />;
}
