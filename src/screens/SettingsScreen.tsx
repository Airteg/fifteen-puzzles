import { useLayoutMetrics } from "@/context/LayoutMetricsProvider";
import SettingsAnimationPlaceholder from "@/ui/animation/placeholders/SettingsAnimationPlaceholder";
import { PanelZone } from "@/ui/PanelZone";
import { ScreenShell } from "@/ui/shell/ScreenShell";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Props } from "../types/types";
import {
  SettingsModalHost,
  SettingsModalType,
} from "./components/SettingsModalHost";

const MODAL_ANIMATION_MS = 200;

const SettingsScreen = ({ navigation }: Props<"Settings">) => {
  const { sw, sh, panelW, snap, S } = useLayoutMetrics();
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

  const modalFrame = useMemo(() => {
    if (!activeModal) return { x: 0, y: 0, width: 0, height: 0 };

    let designWidth = panelW / S;
    let designHeight = 400;

    if (activeModal === "sound") {
      designWidth = 214;
      designHeight = 169;
    }

    const width = snap(designWidth * S);
    const height = snap(designHeight * S);
    const x = (sw - width) / 2;
    const y = (sh - height) / 2;

    return { x, y, width, height };
  }, [sw, sh, panelW, snap, S, activeModal]);

  const handleOpenModal = useCallback(
    (id: SettingsModalType) => {
      if (!isScreenReady || isModalAnimating.current) return;

      isModalAnimating.current = true;
      setActiveModal(id);
      modalOpacity.value = 0;
      modalOpacity.value = withTiming(1, { duration: MODAL_ANIMATION_MS });

      setTimeout(() => {
        isModalAnimating.current = false;
      }, MODAL_ANIMATION_MS);
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
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export default SettingsScreen;
