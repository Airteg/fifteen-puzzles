import { SkFont, useFont } from "@shopify/react-native-skia";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, ReactNode, useContext, useEffect } from "react";

// Запобігаємо авто-прихованню сплеш-скріна до повної готовності
SplashScreen.preventAutoHideAsync();

interface FontContextType {
  skiaFont: SkFont | null;
  isReady: boolean;
}

const FontContext = createContext<FontContextType>({
  skiaFont: null,
  isReady: false,
});

export const FontProvider = ({ children }: { children: ReactNode }) => {
  // 1. Завантаження для системного рендерингу (React Native View)
  // Використовуємо шляхи згідно з вашим tree /f
  const [expoFontsLoaded] = useFonts({
    KronaOne: require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    "Mariupol-Bold": require("../../assets/fonts/Mariupol-Bold.ttf"),
    "Mulish-Regular": require("../../assets/fonts/Mulish/static/Mulish-Regular.ttf"),
  });

  // 2. Завантаження для Skia Engine (Canvas)
  // 24px — базовий розмір для кнопок меню
  const skiaFont = useFont(
    require("../../assets/fonts/Krona_One/KronaOne-Regular.ttf"),
    24,
  );

  const isReady = !!(expoFontsLoaded && skiaFont);

  useEffect(() => {
    if (isReady) {
      // Коли обидва рушії готові, приховуємо Splash Screen
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <FontContext.Provider value={{ skiaFont, isReady }}>
      {children}
    </FontContext.Provider>
  );
};

// Хук для використання в Skia компонентах
export const useSkiaFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useSkiaFont must be used within a FontProvider");
  }
  return context.skiaFont;
};
// Хук для використання в RN компонентах
export const useFontReady = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFontReady must be used within a FontProvider");
  }
  return context.isReady;
};
