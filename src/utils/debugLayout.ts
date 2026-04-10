import { ViewStyle } from "react-native";

export function logLayout(label: string, value: unknown) {
  console.log(
    `🚀 ~ ${label}:\n` +
      JSON.stringify(
        value,
        (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
        2,
      ),
  );
}

export const __debugBorder = (
  color: string = "#ff00aa",
  width: number = 1,
  radius?: number,
): ViewStyle => {
  const style: ViewStyle = {
    borderColor: color,
    borderWidth: width,
  };

  if (radius !== undefined) {
    style.borderRadius = radius;
  }

  return style;
};
