import { useEffect, useState } from "react";
import styled from "@emotion/native";
import { Dimensions, View, useWindowDimensions } from "react-native";

import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { KronaOne_400Regular } from "@expo-google-fonts/krona-one";
import { useFonts } from "expo-font";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { globalStyles } from "../global/global-stiles.js";

export default function Layout() {
  const { height, width, scale, fontScale } = useWindowDimensions();
  // console.log("🚀 ~ Layout fontScale:", fontScale);
  // console.log("🚀 ~ Layout scale:", scale);
  console.log("🚀 ~ Layout width:", width);
  console.log("🚀 ~ Layout height:", height);
  // console.log("🚀 ~ globalStyles:", globalStyles);

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
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container}>
        <InnerContainer>
          <Header />
          <Slot />
          <Footer />
        </InnerContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const InnerContainer = styled.View`
  border: solid blue 5px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center; */
`;
