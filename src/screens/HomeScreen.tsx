import { styles } from "@/styles/globalStyles";
import { PanelZone } from "@/ui/PanelZone";
import { T } from "@/ui/T";
import { AppHeader } from "@/ui/header/AppHeader";
import { View } from "react-native";
import { Props } from "../types/types";

const HomeScreen = ({ navigation }: Props<"Home">) => {
  return (
    <View style={styles.container}>
      <AppHeader />
      <T v="title">MENU</T>

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
