/**
 * Перетворює HEX-колір на масив [R, G, B, A] у діапазоні від 0.0 до 1.0 для GPU.
 * Підтримує формати: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 */
export function hexToShader(hex: string): [number, number, number, number] {
  let cleanHex = hex.replace("#", "");

  // Підтримка коротких форматів (#1C2 -> 11CC22, #1C28 -> 11CC2288)
  if (cleanHex.length === 3 || cleanHex.length === 4) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Якщо альфа-канал відсутній (довжина 6), додаємо FF (100% непрозорість)
  if (cleanHex.length === 6) {
    cleanHex += "ff";
  }

  // Запобіжник для некоректних форматів
  if (cleanHex.length !== 8) {
    console.warn(`Некоректний формат HEX: ${hex}`);
    return [0, 0, 0, 1]; // Повертаємо чорний колір за замовчуванням
  }

  // Розбиваємо на пари та конвертуємо в діапазон 0.0 - 1.0
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  const a = parseInt(cleanHex.slice(6, 8), 16) / 255;

  return [r, g, b, a];
}
