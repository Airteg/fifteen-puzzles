import { Pressable, Text, View } from "react-native";
import { Props } from "../types/types";
import { styles } from "../styles/globalStyles";
import { ScreenShell } from "@/ui/shell/ScreenShell";
import SettingsAnimationPlaceholder from "@/ui/animation/placeholders/SettingsAnimationPlaceholder";
import PanelZone from "@/ui/PanelZone";

const SettingsScreen = ({ navigation }: Props<"Settings">) => {
  return (
    <ScreenShell
      title="SETTINGS"
      animationHeightDesign={210} // приклад
      headerToAnimationGapDesign={24} // приклад
      animationToTitleGapDesign={16} // приклад
      titleToContentGapDesign={24} // приклад
      animation={<SettingsAnimationPlaceholder />}
      footerBottomGapDesign={24}
    >
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
    </ScreenShell>
  );
};
export default SettingsScreen;
