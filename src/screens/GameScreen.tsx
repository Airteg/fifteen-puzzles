import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useSkiaFonts } from "@/context/FontProvider";
import { GameBoardView } from "@/ui/game/GameBoardView";
import { styles } from "../styles/globalStyles";
import { Props } from "../types/types";

const GameScreen = ({ navigation, route }: Props<"Game">) => {
  // Беремо шрифт Krona для плиток (визначено в FontProvider)
  const { title: tileFont } = useSkiaFonts();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#D5F7FF",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {/* Показуємо дошку тільки коли шрифт завантажився, інакше - лоадер */}
      {tileFont ? (
        <GameBoardView tileFont={tileFont} />
      ) : (
        <ActivityIndicator size="large" color="#0d676b" />
      )}
    </View>
  );
};

export default GameScreen;
