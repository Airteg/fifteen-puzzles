import {
  useLayoutDevice,
  useSettingsLayout,
} from "@/context/LayoutSnapshotProvider";
import SettingsAnimationPlaceholder from "@/ui/animation/placeholders/SettingsAnimationPlaceholder";
import { PanelZone } from "@/ui/PanelZone";
import { ScreenShell } from "@/ui/shell/ScreenShell";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Props } from "../types/types";
import {
  SettingsModalHost,
  SettingsModalType,
} from "./components/SettingsModalHost";

const MODAL_ANIMATION_MS = 200;

const SettingsScreen = ({ navigation }: Props<"Settings">) => {
  const { screenW: sw, screenH: sh } = useLayoutDevice();
  const settingsLayout = useSettingsLayout();
  const modalOpacity = useSharedValue(0);

  const [isScreenReady, setIsScreenReady] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () =>
      setIsScreenReady(true),
    );
    const fallbackTimer = setTimeout(() => setIsScreenReady(true), 400);

    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, [navigation]);

  const [activeModal, setActiveModal] = useState<SettingsModalType | null>(
    null,
  );
  const isModalAnimating = useRef(false);

  const modalFrame =
    activeModal === "sound"
      ? settingsLayout.modalSoundFrame
      : settingsLayout.modalDefaultFrame;

  const handleOpenModal = useCallback(
    (id: SettingsModalType) => {
      if (!isScreenReady || isModalAnimating.current) return;

      isModalAnimating.current = true;
      modalOpacity.value = 0; // 1. Фіксуємо прозорість на 0
      setActiveModal(id); // 2. Тригеримо монтування Canvas

      // 3. Відкладаємо старт анімації на 50 мс.
      // За цей час Skia встигне зрендерити модалку "в тіні", без фризів для юзера.
      setTimeout(() => {
        modalOpacity.value = withTiming(1, { duration: MODAL_ANIMATION_MS });
      }, 50);

      // 4. Знімаємо блокування модалки з урахуванням затримки
      setTimeout(() => {
        isModalAnimating.current = false;
      }, MODAL_ANIMATION_MS + 50);
    },
    [isScreenReady, modalOpacity],
  );

  const handleCloseModal = useCallback(() => {
    if (isModalAnimating.current) return;

    isModalAnimating.current = true;
    modalOpacity.value = withTiming(0, { duration: MODAL_ANIMATION_MS });

    setTimeout(() => {
      setActiveModal(null);
      isModalAnimating.current = false;
    }, MODAL_ANIMATION_MS);
  }, [modalOpacity]);

  const handlePress = useCallback(
    (id: string) => {
      if (!isScreenReady || isModalAnimating.current) return;

      switch (id) {
        case "skin":
        case "sound":
        case "statistic":
          handleOpenModal(id);
          break;
        case "support":
          navigation.navigate("Support");
          break;
        case "back":
          navigation.goBack();
          break;
      }
    },
    [handleOpenModal, navigation, isScreenReady],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#D5F7FF" }}>
      {isScreenReady ? (
        <>
          <ScreenShell
            title="SETTINGS"
            animationHeightDesign={100}
            headerToAnimationGapDesign={24}
            animationToTitleGapDesign={16}
            titleToContentGapDesign={24}
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
              onPress={handlePress}
            />
          </ScreenShell>

          {activeModal && (
            <SettingsModalHost
              activeModal={activeModal}
              onClose={handleCloseModal}
              modalFrame={modalFrame}
              sw={sw}
              sh={sh}
              modalOpacity={modalOpacity}
            />
          )}
        </>
      ) : null}
    </View>
  );
};

export default SettingsScreen;
