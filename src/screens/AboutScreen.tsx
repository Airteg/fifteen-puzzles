import { Canvas, Group, Rect, useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { styles as globalStyles } from "../styles/globalStyles";
import type { Props } from "../types/types";

// Імпортуємо хук для метрик
import { useLayoutRenderHelpers } from "@/context/LayoutSnapshotProvider";
import { Frame } from "@/ui/skia/Frame";
import { hexToShader } from "@/utils/color";

const cW = 350; // ширина Canvas
const cH = 550; // висота Canvas

const AboutScreen = ({ navigation }: Props<"About">) => {
  const { S, snap } = useLayoutRenderHelpers();
  const [scale, setScale] = useState(1);
  // const fiveImage = useImage(require("../../assets/images/logo5.png"));
  console.log("--------------------------------");
  console.log("Canvas: ", cW, "X", cH);
  console.log("Масштаб:", scale);

  // ===========================
  // Геометрія фігури, яку ми будемо масштабувати.
  // Вона не залежить від масштабу, бо ми трансформуватимемо всю групу цілком.
  const figureW = 200;
  const figureH = 400;
  const fW = figureW * scale;
  const fH = figureH * scale;
  // ===========================

  console.log("Розмір фігури:", figureW, "X", figureH);
  console.log("Масштабована фігура:", figureW * scale, "X", figureH * scale);

  // Ділимо на 2, бо потім масштабуватимемо всю групу, а не окремі елементи.
  const fX = cW / 2 - fW / 2;
  const fY = cH / 2 - fH / 2;
  console.log("Початкова координата. X:", fX, "Y: ", fY);

  // Шрифт:
  const font = useFont(
    require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    snap(11 * S * scale),
  );

  const handleZoomIn = () => setScale((s) => Math.min(cW / figureW, s + 0.5));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.5));
  const handleReset = () => setScale(1);

  // if (!fiveImage) return null;
  console.log('hexToShader("#eafa0900")', hexToShader("#eafa0900"));
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
          {/* Прямокутник, що окреслює межі Canvas для візуалізації координатної системи Skia. 
          Він не масштабуватиметься разом з фігурою, 
          оскільки знаходиться поза групою, яка трансформується. */}
          <Rect
            x={0}
            y={0}
            width={cW}
            height={cH}
            color="#ff0000"
            style="stroke"
            strokeWidth={2}
          />
          <Group transform={[{ translateX: fX - 10 }, { translateY: fY - 10 }]}>
            <Frame
              width={figureW}
              height={figureH}
              cornerRadius={10}
              borderThickness={10}
              borderColor={hexToShader("#D5F7FF")}
              bgColor={hexToShader("#0000")}
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
  // container: { flex: 1, backgroundColor: "#0d676b", padding: 0 },
  container: { flex: 1, backgroundColor: "#7f6161", padding: 0 },
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
    backgroundColor: "#71D4EB",
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
});

export default AboutScreen;
