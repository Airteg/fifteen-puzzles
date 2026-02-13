import * as SplashScreen from "expo-splash-screen";

let didPrevent = false;
let didHide = false;

export const ensureSplashPrevented = async () => {
  if (didPrevent) return;

  try {
    await SplashScreen.preventAutoHideAsync();
    didPrevent = true;
  } catch (e) {
    console.warn("Splash prevent error:", e);
  }
};

export const hideSplash = async () => {
  if (didHide) return;

  try {
    await SplashScreen.hideAsync();
    didHide = true;
  } catch (e) {
    console.warn("Splash hide error:", e);
  }
};
