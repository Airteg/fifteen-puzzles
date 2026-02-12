import { Pressable, Text, View } from "react-native";
import { Props } from "../types/types";
import { styles } from "../styles/globalStyles";

const HomeScreen = ({ navigation }: Props<"Home">) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 menu</Text>

      <View style={{ gap: 12, width: "100%" }}>
        <Pressable
          onPress={() => navigation.navigate("Game", { level: 1 })}
          style={styles.button}
        >
          <Text style={styles.btnText}>New Game (Рівень 1)</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("About")}
          style={styles.button}
        >
          <Text style={styles.btnText}>About Game</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={styles.button}
        >
          <Text style={styles.btnText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default HomeScreen;
