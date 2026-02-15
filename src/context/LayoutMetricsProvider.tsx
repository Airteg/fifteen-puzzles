import React, { createContext, useContext, useMemo } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";

type LayoutMetrics = {
  sw: number;
  sh: number;
  S: number;

  // design base
  designW: number;
  designH: number;

  // tokens (design values)
  sideMarginMin: number;
  panelW: number;
  buttonW: number;
  buttonH: number;

  // helpers
  snap: (v: number) => number;
};

const LayoutMetricsContext = createContext<LayoutMetrics | null>(null);

export function LayoutMetricsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width: sw, height: sh } = useWindowDimensions();

  const metrics = useMemo<LayoutMetrics>(() => {
    const designW = 390;
    const designH = 844;

    // uniform scale, no deformation
    const S = Math.min(sw / designW, sh / designH);

    const sideMarginMin = 16;

    const snap = (v: number) => PixelRatio.roundToNearestPixel(v);

    // base tokens in design px, scaled by S
    const panelW = snap(Math.min(sw - 2 * sideMarginMin, 340 * S));
    const buttonW = snap(276 * S);
    const buttonH = snap(58 * S);

    return {
      sw,
      sh,
      S,
      designW,
      designH,
      sideMarginMin,
      panelW,
      buttonW,
      buttonH,
      snap,
    };
  }, [sw, sh]);

  return (
    <LayoutMetricsContext.Provider value={metrics}>
      {children}
    </LayoutMetricsContext.Provider>
  );
}

export function useLayoutMetrics() {
  const ctx = useContext(LayoutMetricsContext);
  if (!ctx)
    throw new Error(
      "useLayoutMetrics must be used within LayoutMetricsProvider",
    );
  return ctx;
}
