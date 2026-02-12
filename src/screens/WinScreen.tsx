import { Button, Text, View } from "react-native";
import { styles } from "../styles/globalStyles";
import { Props } from "../types/types";

const WinScreen = ({ navigation, route }: Props<"Win">) => {
  const { score } = route.params;

  const playAgain = () => {
    // ВАЖЛИВО:
    // reset задає весь стек вручну.
    // Ми будуємо стек як: Home -> Game(level=1)
    navigation.reset({
      index: 1, // активним буде routes[1] тобто Game
      routes: [{ name: "Home" }, { name: "Game", params: { level: 1 } }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: "#fff9c4" }]}>
      <Text style={styles.title}>🏆 Перемога!</Text>
      <Text style={styles.text}>Твій рахунок: {score}</Text>

      <View style={{ gap: 12, width: "100%" }}>
        <Button
          title="Зіграти ще раз (Reset → Home -> Game)"
          onPress={playAgain}
        />

        <Button
          title="В головне меню (PopToTop)"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </View>
  );
};

export default WinScreen;
