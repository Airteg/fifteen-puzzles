import { Button, Text, View } from "react-native";
import { styles } from "../styles/globalStyles";
import { Props } from "../types/types";

const GameScreen = ({ navigation, route }: Props<"Game">) => {
  const { level } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: "#e0f7fa" }]}>
      <Text style={styles.title}>🎮 Гра: Рівень {level}</Text>
      <Text style={styles.text}>Тут відбувається магія...</Text>

      <View style={{ gap: 10, marginTop: 20, width: "100%" }}>
        <Button
          title="Наступний рівень (Push)"
          onPress={() => navigation.push("Game", { level: level + 1 })}
        />

        <Button
          title="Я виграв! (Replace)"
          onPress={() => navigation.replace("Win", { score: level * 100 })}
        />

        <Button title="Назад (GoBack)" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};
export default GameScreen;
