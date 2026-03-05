import { PanelZone } from "@/ui/PanelZone";
import NewGameAnimation from "@/ui/animation/placeholders/NewGameAnimation";
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
      animation={<NewGameAnimation />}
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
          if (id === "classic")
            // Виправляємо "GameScreen" на "Game", щоб збігалося з RootNavigator
            navigation.navigate("Game", { mode: "classic" });
          if (id === "limitTime")
            navigation.navigate("Game", { mode: "limitTime" });
          if (id === "back") navigation.goBack();
        }}
      />
    </ScreenShell>
  );
};
export default NewGame;
