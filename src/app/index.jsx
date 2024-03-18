import { View, Pressable, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View>
      <Text>Home page</Text>
      <Pressable onPress={() => router.push("/newGame")}>
        <Text style={styles.text}>New Game</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/settings")}>
        <Text style={styles.text}>Settings</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/about")}>
        <Text style={styles.text}>About</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontFamily: "KronaOne_400Regular",
    fontSize: 20, // Встановіть розмір шрифту за бажанням
    // Додайте інші властивості стилів, якщо потрібно
  },
  // Можете визначити додаткові стилі для інших компонентів тут
});
