import { useEffect } from "react";
import styled from "@emotion/native";
import { View } from "react-native";

import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one";
import { useFonts } from "expo-font";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { globalStyles } from "../global/global-stiles.js";
import { AppProvider } from "../global/AppContext.js";

export default function Layout() {
  let [fontsLoaded] = useFonts({
    KronaOne_400Regular,
    "Mariupol-Bold": require("../assets/fonts/Mariupol-Bold.ttf"),
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
