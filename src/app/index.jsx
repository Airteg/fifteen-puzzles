import { View, Pressable, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import styled from "@emotion/native";
import Flex from "./flex.jsx";
import ButtonStyled from "../components/elements/ButtonStyled.jsx";
import Shadow from "../components/elements/Shadow.jsx";

export default function Home() {
  return (
    <ContainerHome>
      {/* <Text style={{ fontFamily: "Mariupol-Bold", fontSize: 30 }}>
        Home page
      </Text>
      <ButtonStyled text="New Game" />
      <ButtonStyled text="Setting" />
      <ButtonStyled text="About" /> */}
    </ContainerHome>
  );
}
// onPress={() => router.push("/newGame")
const ContainerHome = styled.View`
  border: 2px solid purple;
  flex: 1 1 auto;
`;

const styles = StyleSheet.create({
  text: {
    fontFamily: "KronaOne_400Regular",
    fontSize: 20,
  },
});
