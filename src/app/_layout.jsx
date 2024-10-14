import { useEffect } from "react";
import styled from "@emotion/native";
import { View } from "react-native";

import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one";
import { useFonts } from "expo-font";
import { useFont } from "@shopify/react-native-skia";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { globalStyles, hwN } from "../global/global-stiles.js";
import { AppProvider } from "../global/AppContext.js";

export let skiaFont; // Створюємо змінну для експорту шрифта

export default function Layout() {
  let [fontsLoaded] = useFonts({
    KronaOne_400Regular,
    "Mariupol-Bold": require("../assets/fonts/Mariupol-Bold.ttf"),
    "Mariupol-Medium": require("../assets/fonts/Mariupol-Medium.ttf"),
    "Mariupol-Regular": require("../assets/fonts/Mariupol-Regular.ttf"),
    MariupolSymbols: require("../assets/fonts/MariupolSymbols.ttf"),
  });

  // Завантажуємо шрифт для Skia
  skiaFont = useFont(KronaOne_400Regular, hwN(24)); // Тепер skiaFont доступний глобально для імпорту

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded && skiaFont) {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded, skiaFont]);

  if (!fontsLoaded || !skiaFont) {
    return null;
  }

  return (
    <AppProvider>
      <SafeAreaProvider>
        <SafeAreaView style={globalStyles.container}>
          <InnerContainer>
            <Header />
            <Slot />
            <Footer />
          </InnerContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </AppProvider>
  );
}

const InnerContainer = styled(View)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
