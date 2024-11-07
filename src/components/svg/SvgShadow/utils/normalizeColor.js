// src/components/svg/SvgShadow/utils/normalizeColor.js

/**
 * Функція для нормалізації кольору до формату #rrggbb
 * @param {string} color - Колір у форматі #rgb, #rrggbb, #rgba або #rrggbbaa
 * @param {number} figureCount - Кількість фігур для тіні (з використанням blur)
 * @returns {{ baseColor: string, colorTransparency: number }} - Об'єкт із нормалізованим кольором #rrggbb і прозорістю для тіні
 */
function normalizeColor(color, figureCount = 1) {
  // console.log("🚀 ~ color:", color);

  // Регулярний вираз для валідації кольору
  const hexPattern = /^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;

  // Перевірка коректності кольору
  if (!hexPattern.test(color)) {
    console.error(`Некоректний формат кольору: ${color}`);
    return { baseColor: "#000000", colorTransparency: 1 };
  }

  // Видаляємо прозорість і отримуємо базовий колір #rgb або #rrggbb
  let baseColor = color.slice(
    0,
    color.length === 9 ? 7 : color.length === 5 ? 4 : color.length,
  );

  // Якщо колір у форматі #rgb, перетворюємо його в #rrggbb
  if (baseColor.length === 4) {
    baseColor = `#${baseColor[1]}${baseColor[1]}${baseColor[2]}${baseColor[2]}${baseColor[3]}${baseColor[3]}`;
  }

  // Обчислюємо прозорість, якщо вона є в початковому кольорі;
  // якщо ні, встановлюємо її як 1 (повна непрозорість)
  let colorTransparency = 1;
  if (color.length === 9 || color.length === 5) {
    const alphaHex = color.slice(-2);
    colorTransparency = parseInt(alphaHex, 16) / 255;
  }

  return { baseColor, colorTransparency };
}

export default normalizeColor;
