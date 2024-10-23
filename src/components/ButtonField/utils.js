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

export const handleButtonAction = (
  label,
  { sound, themeColor, setSound, setThemeColor, router },
) => {
  console.log("----Utils sound", sound);
  switch (label) {
    case "New Game":
      router.push("/newGame");
      console.log("Navigating to ", label, " screen...");
      // Логіка переходу на інший екран
      break;
    case "Settings":
      router.push("/settings");
      console.log("Navigating to ", label, " screen...");
      // Логіка переходу на інший екран
      break;
    case "About":
      router.push("/about");
      console.log("Navigating to ", label, " screen...");
      // Логіка переходу на інший екран
      break;
    case "SUPPORT":
      router.push("/support");
      console.log("Navigating to ", label, " screen...");
      // Логіка переходу на інший екран
      break;
    case "EDIT":
      router.push("/Edit");
      console.log("Navigating to ", label, " screen...");
      // Логіка переходу на інший екран
      break;
    case "CLASSIC":
      router.push("/Game?mode=elapsed&initialTime=0");
      console.log("Navigating to ", label, " screen...");
      // Логіка переходу на інший екран
      break;
    case "LIMIT TIME":
      router.push("/Game?mode=countdown&initialTime=120");
      console.log("Navigating to ", label, " screen...");
      // Логіка переходу на інший екран
      break;
    case "SOUND":
      setSound(!sound);
      `Theme changed to ${sound === "light" ? "dark" : "light"}`;
      break;
    case "SKIN":
      setThemeColor(themeColor === "light" ? "dark" : "light");
      console.log(
        `Theme changed to ${themeColor === "light" ? "dark" : "light"}`,
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
