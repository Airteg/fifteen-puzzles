import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Action = { title: string; onPress: () => void };

export function TextScreen(props: {
  title: string;
  actions?: Action[];
  footer?: React.ReactNode;
}) {
  return (
    <View style={s.root}>
      <Text style={s.title}>{props.title}</Text>

      <View style={s.actions}>
        {(props.actions ?? []).map((a) => (
          <Pressable key={a.title} style={s.btn} onPress={a.onPress}>
            <Text style={s.btnText}>{a.title}</Text>
          </Pressable>
        ))}
      </View>

      {props.footer ? <View style={s.footer}>{props.footer}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center" },
  actions: { marginTop: 24, gap: 12, width: "100%", maxWidth: 360 },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  btnText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  footer: { position: "absolute", bottom: 18, left: 24, right: 24 },
});
