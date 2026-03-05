import { PanelZone } from "@/ui/PanelZone";
import HomeAnimation from "@/ui/animation/placeholders/HomeAnimation";
import { ScreenShell } from "@/ui/shell/ScreenShell";
import { Props } from "../types/types";
import { HomeFooterLinks } from "./components/HomeFooterLinks";

const HomeScreen = ({ navigation }: Props<"Home">) => {
  return (
    <ScreenShell
      title="MENU"
      animationHeightDesign={210} // приклад
      headerToAnimationGapDesign={24} // приклад
      animationToTitleGapDesign={16} // приклад
      titleToContentGapDesign={24} // приклад
      animation={<HomeAnimation />}
      footer={<HomeFooterLinks />}
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
          if (id === "new") navigation.navigate("NewGame");
        }}
      />
    </ScreenShell>
  );
};
export default HomeScreen;
