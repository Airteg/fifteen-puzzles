import React from "react";
import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import { SkiaShadow } from "react-native-skia-shadow";

const ProfilePicture = ({ size }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: "https://avatars.githubusercontent.com/u/13810855" }}
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
};

const Test = ({ title = "Button" }) => {
  return (
    <Pressable style={styles.button}>
      <SkiaShadow color="#333" blur={4} dx={5} dy={5} borderRadius={2}>
        <ProfilePicture size={30} />
      </SkiaShadow>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};
export default Test;
const styles = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    // alignItems: "center",
    borderTopLeftRadius: 38,
    borderBottomRightRadius: 32,
  },
  text: {
    color: "black",
    fontSize: 18,
    marginLeft: 16,
  },
  container: {
    // overflow: "hidden",
    borderRadius: 3,
    borderColor: "green",
    borderStyle: "solid",
    borderWidth: 0,
  },
  image: {
    aspectRatio: 1,
  },
});
