import { hwN, wwN } from "../../global/global-stiles.js";

export const isButtonPressed = (touch, btn) => {
  const { x, y } = touch;
  return (
    x >= btn.x + (btn.label === "back" ? wwN(276) - hwN(58) : 0) &&
    x <= btn.x + wwN(276) &&
    y >= btn.y &&
    y <= btn.y + hwN(58)
  );
};
// utils.js
export const handleButtonAction = (
  label,
  { state, setSound, setThemeColor, router }
) => {
  switch (label) {
    case "New Game":
      console.log("Navigating to 'New Game' screen...");
      // Логіка переходу на інший екран
      break;

    case "soundToggle":
      setSound(!state.sound);
      console.log(`Sound ${state.sound ? "OFF" : "ON"}`);
      break;

    case "themeToggle":
      setThemeColor(state.themeColor === "light" ? "dark" : "light");
      console.log(
        `Theme changed to ${state.themeColor === "light" ? "dark" : "light"}`
      );
      break;

    case "back":
      router.back();
      console.log("Navigating back...");
      // Логіка переходу назад
      break;

    default:
      console.log(`No action defined for ${label}`);
      break;
  }
};
