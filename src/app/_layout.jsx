import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { globalStyles } from "../global/global-stiles.js";
import { useFonts } from "expo-font";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one";
import { useEffect } from "react";

export default function Layout() {
  let [fontsLoaded] = useFonts({
    KronaOne_400Regular,
    "Mariupol-Bold": require("../assets/fonts/Mariupol-Bold.ttf"), // Переконайтеся, що шлях вказано правильно
    "Mariupol-Medium": require("../assets/fonts/Mariupol-Medium.ttf"),
    "Mariupol-Regular": require("../assets/fonts/Mariupol-Regular.ttf"),
    MariupolSymbols: require("../assets/fonts/MariupolSymbols.ttf"),
  });
  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null; // або ваш Splash Screen
  }
  console.log("🚀 ~ global:", globalStyles);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container}>
        <Header />
        <Slot />
        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
