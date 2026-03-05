import {
  Canvas,
  Group,
  Image,
  Path,
  RoundedRect,
  Text,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLayoutMetrics } from "../../context/LayoutMetricsProvider";

export const AppGameHeader = () => {
  const { S, snap } = useLayoutMetrics();
  const [isMuted, setIsMuted] = useState(false);

  // Завантаження ресурсів
  const logoImg = useImage(require("../../../assets/images/logo.png"));
  const fontKrona = useFont(
    require("../../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    snap(18 * S),
  );

  const toggleSound = () => setIsMuted(!isMuted);

  // Спрощені шляхи для динаміка
  const soundPath = "M5 9v6h4l5 5V4L9 9H5z";
  const wavePath = "M18 12c0-2.5-1.5-4.5-3.5-5.5v11c2-1 3.5-3 3.5-5.5z";

  return (
    <View style={{ height: snap(100 * S), width: "100%" }}>
      <Canvas style={{ flex: 1 }}>
        {/* Логотип PNG */}
        {logoImg && (
          <Image
            image={logoImg}
            x={snap(15 * S)}
            y={snap(15 * S)}
            width={snap(60 * S)}
            height={snap(60 * S)}
          />
        )}

        {/* Текст заголовка */}
        {fontKrona && (
          <Group
            transform={[
              { translateX: snap(85 * S) },
              { translateY: snap(40 * S) },
            ]}
          >
            <Text text="FIFTEEN" font={fontKrona} color="black" />
            <Text
              y={snap(22 * S)}
              text="TILES"
              font={fontKrona}
              color="black"
            />
          </Group>
        )}

        {/* Кнопка звуку (права частина) */}
        <Group
          transform={[
            { translateX: snap(310 * S) },
            { translateY: snap(25 * S) },
          ]}
        >
          {/* Світла підкладка іконки */}
          <RoundedRect
            x={0}
            y={0}
            width={snap(45 * S)}
            height={snap(45 * S)}
            r={snap(8 * S)}
            color="#E1F5FE"
          />
          <Group
            transform={[
              { translateX: snap(8 * S) },
              { translateY: snap(8 * S) },
              { scale: 1.3 * S },
            ]}
          >
            <Path path={soundPath} color={isMuted ? "#455A64" : "#D4E157"} />
            {!isMuted && (
              <Path
                path={wavePath}
                color="#455A64"
                strokeWidth={1}
                style="stroke"
              />
            )}
            {isMuted && (
              <Path
                path="M3 3l18 18"
                color="#455A64"
                strokeWidth={2}
                style="stroke"
              />
            )}
          </Group>
        </Group>
      </Canvas>

      <Pressable
        onPress={toggleSound}
        style={[
          styles.soundHitbox,
          {
            right: snap(20 * S),
            top: snap(25 * S),
            width: snap(45 * S),
            height: snap(45 * S),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  soundHitbox: { position: "absolute", backgroundColor: "transparent" },
});
