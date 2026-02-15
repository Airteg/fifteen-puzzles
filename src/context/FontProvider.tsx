import { SkFont, useFont } from "@shopify/react-native-skia";
import { useFonts } from "expo-font";
import React, { createContext, ReactNode, useContext, useMemo } from "react";

import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";

type SkiaFonts = {
  button: SkFont | null; // 24 * S
  title: SkFont | null; // 32 * S
  body: SkFont | null; // 16 * S
};

interface FontContextType {
  skiaFonts: SkiaFonts;
  isReady: boolean;
}

const FontContext = createContext<FontContextType | null>(null);

const KRONA_TTF = require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf");

export const FontProvider = ({ children }: { children: ReactNode }) => {
  // 1) RN fonts (Text)
  const [expoFontsLoaded] = useFonts({
    KronaOne: KRONA_TTF,
    "Mariupol-Bold": require("../../assets/fonts/Mariupol-Bold.ttf"),
    "Mulish-Regular": require("../../assets/fonts/Mulish/static/Mulish-Regular.ttf"),
  });

  // 2) Layout metrics (uniform scale S)
  const { S, snap } = useLayoutMetrics();

  // 3) Skia fonts (render in Canvas)
  // useFont loads and caches by (ttf,size)
  const buttonFont = useFont(KRONA_TTF, snap(24 * S));
  const titleFont = useFont(KRONA_TTF, snap(32 * S));
  const bodyFont = useFont(KRONA_TTF, snap(16 * S));

  const skiaFonts = useMemo<SkiaFonts>(
    () => ({
      button: buttonFont,
      title: titleFont,
      body: bodyFont,
    }),
    [buttonFont, titleFont, bodyFont],
  );

  // Ready when RN fonts + all Skia fonts are ready
  const isReady = !!(expoFontsLoaded && buttonFont && titleFont && bodyFont);

  return (
    <FontContext.Provider value={{ skiaFonts, isReady }}>
      {children}
    </FontContext.Provider>
  );
};

// New: get all fonts
export const useSkiaFonts = () => {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error("useSkiaFonts must be used within a FontProvider");
  return ctx.skiaFonts;
};

// Backward-compatible: old hook returns button font
export const useSkiaFont = () => {
  const fonts = useSkiaFonts();
  return fonts.button;
};

export const useFontReady = () => {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error("useFontReady must be used within a FontProvider");
  return ctx.isReady;
};
