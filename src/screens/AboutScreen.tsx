import { Canvas, Group, useFont } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { styles as globalStyles } from "../styles/globalStyles";
import { Props } from "../types/types";

// Імпортуємо наш новий компонент
import { SmileySkin } from "@/ui/skia/SmileySkin";

const BASE_SIZE = 88;
// Квадратний розмір для кнопки "Назад" (зазвичай дорівнює buttonH, наприклад 58)
const BUTTON_SIZE = 58;
// Відступи, щоб тінь (яка має розмиття 11px) не обрізалася краями Canvas
const PADDING = 20;
// Загальний базовий розмір канвасу
const CANVAS_SIZE = BASE_SIZE + PADDING * 2;
const testRect = {
  x: PADDING,
  y: PADDING,
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
};
const AboutScreen = ({ navigation }: Props<"About">) => {
  const [scale, setScale] = useState(1);

  // Завантажуємо шрифт для перевірки тексту на плитці
  // Використовуємо Krona One згідно з твоєю структурою файлів
  const font = useFont(
    require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    40,
  );

  const handleZoomIn = () => setScale((s) => Math.min(5, s + 0.5));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.5));
  const handleReset = () => setScale(1);

  return (
    <View style={[globalStyles.container, localStyles.container]}>
      {/* 1. Верхня панель: Движок масштабування */}
      <View style={localStyles.controls}>
        <Text style={localStyles.scaleText}>Масштаб: {scale.toFixed(1)}x</Text>
        <View style={localStyles.row}>
          <Button title="  -  " onPress={handleZoomOut} />
          <View style={{ width: 15 }} />
          <Button title=" 1x " onPress={handleReset} />
          <View style={{ width: 15 }} />
          <Button title="  +  " onPress={handleZoomIn} />
        </View>
      </View>

      {/* 2. Центральна зона: Тестовий стенд */}
      <View style={localStyles.testArea}>
        <Canvas
          style={{
            width: CANVAS_SIZE * scale,
            height: CANVAS_SIZE * scale,
          }}
        >
          <Group
            transform={[
              { translateX: PADDING * scale },
              { translateY: PADDING * scale },
              { scale: scale },
            ]}
          >
            {/* <SkiaIconButtonSkin
              rect={testRect}
              pressed={false} 
            /> */}
            <SmileySkin />
          </Group>
        </Canvas>
      </View>

      {/* 3. Нижня панель: Навігація */}
      <View style={localStyles.footer}>
        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#0d676b",
  },
  controls: {
    paddingTop: 20,
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
  row: {
    flexDirection: "row",
  },
  testArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "yellow",
    // borderWidth: 1,
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
});

export default AboutScreen;
