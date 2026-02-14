import { styles } from "@/styles/globalStyles";
import { PanelZone } from "@/ui/PanelZone";
import { Text, View } from "react-native";
import { Props } from "../types/types";

const HomeScreen = ({ navigation }: Props<"Home">) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 menu</Text>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <PanelZone
          buttons={[
            { id: "about", title: "ABOUT GAME" },
            { id: "settings", title: "SETTINGS" },
            { id: "new", title: "NEW GAME" },
          ]}
          onPress={(id) => {
            if (id === "about") navigation.navigate("About");
            if (id === "settings") navigation.navigate("Settings");
            if (id === "new") navigation.navigate("Game", { level: 1 });
          }}
        />
      </View>
    </View>
  );
};
export default HomeScreen;
