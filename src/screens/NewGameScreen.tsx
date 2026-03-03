import { PanelZone } from "@/ui/PanelZone";
import HomeAnimationPlaceholder from "@/ui/animation/placeholders/HomeAnimationPlaceholder";
import { ScreenShell } from "@/ui/shell/ScreenShell";
import { Props } from "../types/types";
import { HomeFooterLinks } from "./components/HomeFooterLinks";

const NewGame = ({ navigation }: Props<"NewGame">) => {
  return (
    <ScreenShell
      title="NEW GAME"
      animationHeightDesign={210} // приклад
      headerToAnimationGapDesign={24} // приклад
      animationToTitleGapDesign={16} // приклад
      titleToContentGapDesign={24} // приклад
      animation={<HomeAnimationPlaceholder />}
      footer={<HomeFooterLinks />}
      footerBottomGapDesign={24}
    >
      <PanelZone
        buttons={[
          { id: "classic", title: "CLASSIC" },
          { id: "limitTime", title: "LIMIT TIME" },
          { id: "back", title: "back" },
        ]}
        onPress={(id) => {
          if (id === "classic") navigation.navigate("About");
          if (id === "limitTime") navigation.navigate("About");
          if (id === "back") navigation.goBack();
        }}
      />
    </ScreenShell>
  );
};
export default NewGame;
