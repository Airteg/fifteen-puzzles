import {
  useLayoutDevice,
  useSettingsLayout,
} from "@/context/LayoutSnapshotProvider";
import SettingsAnimation from "@/ui/animation/placeholders/SettingsAnimation";
import { PanelZone } from "@/ui/PanelZone";
import { ScreenShell } from "@/ui/shell/ScreenShell";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
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
  const [activeModal, setActiveModal] = useState<SettingsModalType | null>(
    null,
  );

  const isModalAnimating = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      cancelAnimation(modalOpacity);
    };
  }, [modalOpacity]);

  const scheduleUnlock = useCallback((delayMs: number) => {
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
    }

    unlockTimerRef.current = setTimeout(() => {
      isModalAnimating.current = false;
      unlockTimerRef.current = null;
    }, delayMs);
  }, []);

  const handleOpenModal = useCallback(
    (id: Exclude<SettingsModalType, "statistic">) => {
      if (!isScreenReady || isModalAnimating.current || activeModal === id) {
        return;
      }

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      isModalAnimating.current = true;
      setActiveModal(id);
      cancelAnimation(modalOpacity);
      modalOpacity.value = 0;
      modalOpacity.value = withTiming(1, { duration: MODAL_ANIMATION_MS });
      scheduleUnlock(MODAL_ANIMATION_MS);
    },
    [activeModal, isScreenReady, modalOpacity, scheduleUnlock],
  );

  const handleCloseModal = useCallback(() => {
    if (isModalAnimating.current || !activeModal) return;

    isModalAnimating.current = true;
    cancelAnimation(modalOpacity);
    modalOpacity.value = withTiming(0, { duration: MODAL_ANIMATION_MS });

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setActiveModal(null);
      isModalAnimating.current = false;
      closeTimerRef.current = null;
    }, MODAL_ANIMATION_MS);
  }, [activeModal, modalOpacity]);

  const handlePress = useCallback(
    (id: string) => {
      if (!isScreenReady || isModalAnimating.current) return;

      switch (id) {
        case "skin":
        case "sound":
          handleOpenModal(id);
          break;
        case "statistic":
          navigation.navigate("Statistic");
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
            animation={<SettingsAnimation />}
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

          <SettingsModalHost
            activeModal={activeModal}
            onClose={handleCloseModal}
            defaultFrame={settingsLayout.modalDefaultFrame}
            soundFrame={settingsLayout.modalSoundFrame}
            sw={sw}
            sh={sh}
            modalOpacity={modalOpacity}
          />
        </>
      ) : null}
    </View>
  );
};

export default SettingsScreen;
