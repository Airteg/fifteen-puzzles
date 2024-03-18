import { Dimensions } from "react-native";

const window = Dimensions.get("window");
console.log("🚀 ~ window:", window);
const screen = Dimensions.get("screen");
console.log("🚀 ~ screen:", screen);

export const globalStyles = {
  container: {
    padding: 0,
    margin: 0,
    backgroundColor: "skyblue",
    flex: 1,
  },
};
