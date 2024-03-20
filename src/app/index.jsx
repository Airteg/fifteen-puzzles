import { View, Pressable, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import styled from "@emotion/native";
import Flex from "./flex.jsx";

export default function Home() {
  return (
    <ContainerHome>
      {/* <Text style={{ fontFamily: "Mariupol-Bold", fontSize: 30 }}>
        Home page
      </Text>
      <Pressable onPress={() => router.push("/newGame")}>
        <Text style={styles.text}>New Game</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/settings")}>
        <Text style={styles.text}>Settings</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/about")}>
        <Text style={styles.text}>About</Text>
      </Pressable> */}
      <Flex />
      {/* <OtheFlex /> */}
    </ContainerHome>
  );
}

const ContainerHome = styled.View`
  border: 5px solid purple;
  flex: 1 1 auto;
`;

const styles = StyleSheet.create({
  text: {
    fontFamily: "KronaOne_400Regular",
    fontSize: 20, // Встановіть розмір шрифту за бажанням
    // Додайте інші властивості стилів, якщо потрібно
  },
  // Можете визначити додаткові стилі для інших компонентів тут
});
