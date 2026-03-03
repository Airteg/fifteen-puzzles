import SettingsAnimationPlaceholder from "@/ui/animation/placeholders/SettingsAnimationPlaceholder";
import PanelZone from "@/ui/PanelZone";
import { ScreenShell } from "@/ui/shell/ScreenShell";
import { Props } from "../types/types";

const SettingsScreen = ({ navigation }: Props<"Settings">) => {
  return (
    <ScreenShell
      title="SETTINGS"
      animationHeightDesign={100} // приклад
      headerToAnimationGapDesign={24} // приклад
      animationToTitleGapDesign={16} // приклад
      titleToContentGapDesign={24} // приклад
      animation={<SettingsAnimationPlaceholder />}
      footerBottomGapDesign={24}
    >
      <PanelZone
        buttons={[
          { id: "skin", title: "SKIN" },
          { id: "sound", title: "SOUND" },
          { id: "statistic", title: "STATISTIC" },
          { id: "support", title: "SUPPORT" },
          { id: "back", title: "back" },
        ]}
        onPress={(id) => {
          if (id === "skin") navigation.navigate("About");
          if (id === "sound") navigation.navigate("About");
          if (id === "statistic") navigation.navigate("About");
          if (id === "support") navigation.navigate("About");
          if (id === "back") navigation.goBack();
        }}
      />
    </ScreenShell>
  );
};
export default SettingsScreen;
