import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

import { SplashScreen } from "../screens/SplashScreen";
import { MainMenuScreen } from "../screens/MainMenuScreen";
import { GameScreen } from "../screens/GameScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AboutScreen } from "../screens/AboutScreen";
import { SupportScreen } from "../screens/SupportScreen";

import { SkinModal } from "../screens/modals/SkinModal";
import { SoundModal } from "../screens/modals/SoundModal";
import { StatisticModal } from "../screens/modals/StatisticModal";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      {/* Main flow */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MainMenu"
        component={MainMenuScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About Game" }}
      />

      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: "Support" }}
      />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="SkinModal"
          component={SkinModal}
          options={{ title: "Skin" }}
        />
        <Stack.Screen
          name="SoundModal"
          component={SoundModal}
          options={{ title: "Sound" }}
        />
        <Stack.Screen
          name="StatisticModal"
          component={StatisticModal}
          options={{ title: "Statistic" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
