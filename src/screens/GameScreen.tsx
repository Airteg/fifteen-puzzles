import { useSkiaFonts } from "@/context/FontProvider"; // [cite: 31]
import { RnghSmoke } from "@/test/RnghSmoke";
import { GameBoardView } from "@/ui/game/GameBoardView";
import { View } from "react-native";
import { styles } from "../styles/globalStyles";
import { Props } from "../types/types";

const GameScreen = ({ navigation, route }: Props<"Game">) => {
  const { level } = route.params;
  const { title: tileFont } = useSkiaFonts(); // Беремо Krona для плиток [cite: 21, 32]

  return (
    <View style={[styles.container, { backgroundColor: "#D5F7FF" }]}>
      <GameBoardView tileFont={tileFont} />
      {/* <RnghSmoke /> */}
    </View>
  );
};

export default GameScreen;
