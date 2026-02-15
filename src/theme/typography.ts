import { PixelRatio, TextStyle } from "react-native";

const snap = (v: number) => PixelRatio.roundToNearestPixel(v);

// Colors
const colorDarkBlue = "#216169";

// Helpers
const ls = (fontSize: number) => snap(fontSize * 0.04); // 0.04em

export const Typography = {
  // RN UI typography (Mariupol)
  mariupol: {
    screenTitle: (scale = 1): TextStyle => {
      const fs = snap(32 * scale);
      return {
        fontFamily: "Mariupol-Bold",
        fontSize: fs,
        lineHeight: snap(40 * scale),
        letterSpacing: ls(fs),
        color: colorDarkBlue,
        textAlign: "center",
        includeFontPadding: false,
      };
    },
    headerSubtitle: (scale = 1): TextStyle => {
      const fs = snap(16 * scale);
      return {
        fontFamily: "Mariupol-Regular",
        fontSize: fs,
        lineHeight: snap(22 * scale),
        letterSpacing: 0,
        color: colorDarkBlue,
        textAlign: "center",
        includeFontPadding: false,
      };
    },
    body: (scale = 1): TextStyle => {
      const fs = snap(16 * scale);
      return {
        fontFamily: "Mariupol-Regular",
        fontSize: fs,
        lineHeight: snap(22 * scale),
        letterSpacing: 0,
        color: colorDarkBlue,
        includeFontPadding: false,
      };
    },
  },

  // Krona namespace (mostly for Skia, but available for RN if ever needed)
  krona: {
    buttonLabel: (scale = 1): TextStyle => {
      const fs = snap(24 * scale);
      return {
        fontFamily: "KronaOne",
        fontSize: fs,
        lineHeight: snap(30 * scale),
        letterSpacing: ls(fs),
        color: colorDarkBlue,
        textAlign: "center",
        includeFontPadding: false,
      };
    },
  },
};
