/**
 * Перетворює звичайний HEX-колір (з або без #) та альфа-канал
 * на масив [R, G, B, A] у діапазоні від 0.0 до 1.0 для GPU.
 */
export function hexToShader(
  hex: string,
  alpha: number = 1.0,
): [number, number, number, number] {
  let cleanHex = hex.replace("#", "");

  // Підтримка короткого формату (#FFF -> FFFFFF)
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return [r / 255, g / 255, b / 255, alpha];
}
