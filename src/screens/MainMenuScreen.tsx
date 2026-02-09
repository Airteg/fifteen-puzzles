import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { TextScreen } from "../ui/TextScreen";

type Props = NativeStackScreenProps<RootStackParamList, "MainMenu">;

export function MainMenuScreen({ navigation }: Props) {
  return (
    <TextScreen
      title="MAIN MENU (NEW GAME frame)"
      actions={[
        {
          title: "Classic → Game",
          onPress: () => navigation.navigate("Game", { mode: "classic" }),
        },
        {
          title: "Limit Time → Game",
          onPress: () => navigation.navigate("Game", { mode: "limitTime" }),
        },
        { title: "Settings", onPress: () => navigation.navigate("Settings") },
        { title: "About Game", onPress: () => navigation.navigate("About") },
      ]}
      footer={
        <View style={s.linksRow}>
          <Pressable
            onPress={() => {
              /* later: openURL */
            }}
          >
            <Text style={s.link}>Privacy Policy</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              /* later: openURL */
            }}
          >
            <Text style={s.link}>User Agreement</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const s = StyleSheet.create({
  linksRow: { flexDirection: "row", justifyContent: "space-between" },
  link: { textDecorationLine: "underline" },
});
