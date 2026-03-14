import { Canvas, Group, Rect, useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { styles as globalStyles } from "../styles/globalStyles";
import type { Props } from "../types/types";

// Імпортуємо хук для метрик
import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { IconButtonSkin } from "@/ui/skia/IconButtonSkin";

const cW = 300;
const cH = 550;

const AboutScreen = ({ navigation }: Props<"About">) => {
  const [scale, setScale] = useState(1);
  const { S, snap } = useLayoutMetrics();

  const figureW = 80;
  const figureH = 99;
  // Ділимо на 2, бо потім масштабуватимемо всю групу, а не окремі елементи.
  const figureX = (cW - figureW) / (2 * scale);
  const figureY = (cH - figureH) / (2 * scale);

  // Шрифт:
  const font = useFont(
    require("../../assets/fonts/Mariupol-Medium.ttf"),
    snap(14 * S),
  );

  const handleZoomIn = () => setScale((s) => Math.min(5, s + 0.5));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.5));
  const handleReset = () => setScale(1);

  return (
    <View style={[globalStyles.container, localStyles.container]}>
      <View style={localStyles.controls}>
        <Text style={localStyles.scaleText}>Масштаб: {scale.toFixed(1)}x</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button title="  -  " onPress={handleZoomOut} />
          <Button title=" 1x " onPress={handleReset} />
          <Button title="  +  " onPress={handleZoomIn} />
        </View>
      </View>

      <View style={localStyles.testArea}>
        <Canvas
          style={{
            width: cW,
            height: cH,
          }}
        >
          <Rect
            x={0}
            y={0}
            width={cW}
            height={cH}
            color="#ff0000"
            style="stroke"
            strokeWidth={2}
          />
          <Group transform={[{ scale: scale }]}>
            {font && (
              <IconButtonSkin
                frame={{
                  x: figureX / scale,
                  y: figureY / scale,
                  width: 80,
                  height: 99,
                }}
                type="restart"
                label="RESTART"
                font={font}
              />
            )}
          </Group>
        </Canvas>
      </View>

      <View style={localStyles.footer}>
        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d676b", padding: 0 },
  controls: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  scaleText: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  testArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
});

export default AboutScreen;
