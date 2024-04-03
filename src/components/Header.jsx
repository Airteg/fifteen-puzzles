import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Logo from "../assets/png/LogoSizeS.png";
import { hw } from "../global/global-stiles.js";

export default function Header() {
  let a = 44;
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.logoCont}>
        <Image source={Logo} style={{ width: "100%", height: "100%" }} />
      </View>
      <View style={headerStyles.textCont}>
        <Text style={headerStyles.title}>FIFTEEN TILES</Text>
        <Text style={headerStyles.fsDescription}>A classic game</Text>
        <Text style={headerStyles.fsDescription}>that doesn’t get boring</Text>
      </View>
    </View>
  );
}
const headerStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  textCont: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontFamily: "KronaOne_400Regular",
    fontSize: hw(24),
    textAlign: "right",
    color: "#216169",
  },
  fsDescription: {
    fontFamily: "Mariupol-Regular",
    fontSize: hw(16),
    textAlign: "right",
    color: "#216169",
  },
  image: {
    width: hw(60),
    height: hw(60),
  },
  logoCont: {
    width: hw(80),
    height: hw(80),
  },
});
