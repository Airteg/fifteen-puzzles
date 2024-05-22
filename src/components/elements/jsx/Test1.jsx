import { StyleSheet, View } from "react-native";

const Test = ({ width, height }) => {
  return (
    <View styles={styles.container}>
      <View styles={styles.timer}></View>
      <View styles={styles.game}></View>
      <View styles={styles.buttons}></View>
      <View styles={styles.title}></View>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timer: "",
  game: "",
  buttons: "",
  title: "",
});
