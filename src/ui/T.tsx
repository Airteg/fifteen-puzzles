import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { Typography } from "@/theme/typography";
import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";

type Variant = "title" | "subtitle" | "body" | "kronaButton";

type Props = TextProps & {
  v: Variant;
  style?: TextStyle | TextStyle[];
};

export function T({ v, style, ...rest }: Props) {
  const { S } = useLayoutMetrics();

  const base =
    v === "title"
      ? Typography.mariupol.screenTitle(S)
      : v === "subtitle"
        ? Typography.mariupol.headerSubtitle(S)
        : v === "kronaButton"
          ? Typography.krona.buttonLabel(S)
          : Typography.mariupol.body(S);

  return <Text {...rest} style={[base, style]} />;
}
