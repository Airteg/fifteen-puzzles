import { Canvas, Group, useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { styles as globalStyles } from "../styles/globalStyles";
import { Props } from "../types/types";

// Імпортуємо хук для метрик
import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import { TimerSkin } from "@/ui/skia/TimerSkin";
import { hexToShader } from "@/utils/color";

const PADDING = 40;

const AboutScreen = ({ navigation }: Props<"About">) => {
  const [scale, setScale] = useState(1);
  const { buttonW, S, snap } = useLayoutMetrics();

  // Визначаємо розміри таймера за твоїми пропорціями
  const timerWidth = buttonW;
  const timerHeight = snap(buttonW * 0.1812);

  // Канвас тепер адаптується під ширину таймера
  const canvasW = timerWidth + PADDING * 2;
  const canvasH = timerHeight + PADDING * 2;

  // Шрифт: для таймера розмір зазвичай менший за 40. Спробуємо 20 * S.
  const font = useFont(
    require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    snap(20 * S),
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
            width: canvasW * scale,
            height: canvasH * scale,
          }}
        >
          <Group transform={[{ scale: scale }]}>
            <TimerSkin
              x={PADDING}
              y={PADDING}
              width={timerWidth}
              height={timerHeight}
              timeText="⏱ TIME 02:42" // Текст за замовчуванням
              font={font}
              bgColor={hexToShader("#E4FF00")} // Стартовий лимонний колір
              S={S}
              snap={snap}
            />
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
  container: { flex: 1, backgroundColor: "#0d676b" },
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
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
});

export default AboutScreen;
