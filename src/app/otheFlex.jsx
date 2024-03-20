import { View, Text, StyleSheet } from "react-native";
import React from "react";

const OtheFlex = () => {
  return (
    <View style={stl.cont}>
      <View style={stl.v1} />
      <View style={stl.v2} />
      <View style={stl.v3} />
    </View>
  );
};

export default OtheFlex;

const stl = StyleSheet.create({
  cont: {
    width: "100%",
    height: "100%",
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  v1: {
    width: 10,
    height: 10,
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
    // alignSelf:"flex-end"
  },
  v2: {
    width: 10,
    height: 10,
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
    // alignSelf:"flex-end"
  },
  v3: {
    width: 10,
    height: 10,
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1, // Змінено на числове значення
    // alignSelf:"flex-end"
  },
});
