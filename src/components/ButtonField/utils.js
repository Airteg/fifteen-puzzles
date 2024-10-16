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
