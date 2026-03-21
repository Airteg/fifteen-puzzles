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
import { Props } from "../types/types";
import {
  SettingsModalHost,
  SettingsModalType,
} from "./components/SettingsModalHost";

const SettingsScreen = ({ navigation }: Props<"Settings">) => {
  const { sw, sh, panelW, snap, S } = useLayoutMetrics();

  // 1. Блокування екрана до завершення навігації (як у GameScreen)
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

  // 2. Стан і блокування модалок
  const [activeModal, setActiveModal] = useState<SettingsModalType | null>(
    null,
  );
  const isModalAnimating = useRef(false);

  // 3. Обчислення єдиного modalFrame
  const modalFrame = useMemo(() => {
    if (!activeModal) return { x: 0, y: 0, width: 0, height: 0 };

    let designWidth = panelW / S; // за замовчуванням ширина панелі
    let designHeight = 400;

    // Метрики конкретно для SOUND модалки згідно Фігми
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
    },
    [isScreenReady],
  );

  const handleCloseModal = useCallback(() => {
    if (isModalAnimating.current) return;
    isModalAnimating.current = true;

    // У майбутньому тут запускатиметься анімація закриття (withTiming),
    // а setActiveModal(null) викликатиметься в її колбеку onEnd через runOnJS.
    // Поки Reanimated анімації немає, закриваємо миттєво і знімаємо лок.
    setActiveModal(null);
    isModalAnimating.current = false;
  }, []);

  const handleModalReady = useCallback(() => {
    // Цей колбек викликає хост, коли модалка повністю "в'їхала" на екран
    isModalAnimating.current = false;
  }, []);

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
          onReady={handleModalReady}
          modalFrame={modalFrame}
          sw={sw}
          sh={sh}
        />
      )}
    </View>
  );
};

export default SettingsScreen;
