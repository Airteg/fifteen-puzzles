import { Pressable, Text, View } from "react-native";
import { Props } from "../types/types";
import { styles } from "../styles/globalStyles";

const SettingsScreen = ({ navigation }: Props<"Settings">) => {
  return (
    <View style={[styles.container, { backgroundColor: "#e0f7fa" }]}>
      <Text style={styles.title}>🎮 Settings </Text>

      <View style={{ gap: 10, marginTop: 20, width: "100%" }}>
        <Pressable onPress={() => {}} style={styles.button}>
          <Text style={styles.btnText}>SKIN</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.button}>
          <Text style={styles.btnText}>Sound ON/OFF</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Statistic");
          }}
          style={styles.button}
        >
          <Text style={styles.btnText}>STATISTIC</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Support");
          }}
          style={styles.button}
        >
          <Text style={styles.btnText}>SUPORT</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.btnText}>GoBack</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default SettingsScreen;
