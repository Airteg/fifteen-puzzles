import { View, Text } from "react-native";
import React from "react";

export default function Header() {
  return (
    <View>
      <Text
        style={{
          fontFamily: "Mariupol-Bold",
          fontSize: 20,
          fontStyle: "italic",
          color: "orangered",
        }}
      >
        Header
      </Text>
    </View>
  );
}
