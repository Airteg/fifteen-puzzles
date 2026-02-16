import React from "react";
import { Pressable, View } from "react-native";
import { T } from "@/ui/T";

type Props = {
  onPrivacy?: () => void;
  onAgreement?: () => void;
};

export function HomeFooterLinks({ onPrivacy, onAgreement }: Props) {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Pressable onPress={onPrivacy} hitSlop={10}>
        <T v="body">Privacy Policy</T>
      </Pressable>

      <Pressable onPress={onAgreement} hitSlop={10}>
        <T v="body">User Agreement</T>
      </Pressable>
    </View>
  );
}
