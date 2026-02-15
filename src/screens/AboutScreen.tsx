import {
  Canvas,
  Group,
  rect,
  RoundedRect,
  rrect,
  Shadow,
} from "@shopify/react-native-skia";
import { Button, View } from "react-native";
import { styles } from "../styles/globalStyles";
import { Props } from "../types/types";

const AboutScreen = ({ navigation }: Props<"About">) => {
  const width = 276;
  const height = 58;
  const r = 8;
  const strokeWidth = 3;

  // Створюємо об'єкт Rounded Rect (SkRRect)
  const buttonRect = rrect(rect(0, 0, width, height), r, r);
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0d676b",
        },
      ]}
    >
      <Canvas style={{ width: 300, height: 100 }}>
        {/* 1. Малюємо основу з зовнішньою тінню */}
        <RoundedRect
          x={10}
          y={10}
          width={width}
          height={height}
          r={r}
          color="#D5F7FF"
        >
          <Shadow dx={0} dy={0} blur={10} color="rgba(0, 0, 0, 0.25)" />
        </RoundedRect>

        {/* 2. Малюємо внутрішню тінь (через Group clip) */}
        <Group clip={rrect(rect(10, 10, width, height), r, r)}>
          {/* Малюємо той самий прямокутник, але тепер тільки з внутрішньою тінню */}
          <RoundedRect
            x={10}
            y={10}
            width={width}
            height={height}
            r={r}
            color="#D5F7FF"
          >
            <Shadow dx={0} dy={0} blur={10} color="rgba(0, 0, 0, 0.5)" inner />
          </RoundedRect>
        </Group>

        {/* 3. Бордер (Stroke) поверх усього */}
        <RoundedRect
          x={10}
          y={10}
          width={width}
          height={height}
          r={r}
          color="#D5F7FF"
          style="stroke"
          strokeWidth={3}
        />
      </Canvas>
      <View style={{ marginTop: 20 }}>
        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};
export default AboutScreen;
