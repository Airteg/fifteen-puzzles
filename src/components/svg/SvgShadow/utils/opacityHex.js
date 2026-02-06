/**
 * Перетворює значення непрозорості на 2-значний HEX-формат.
 * @param {number} opacity - Значення прозорості від 0 до 1
 * @returns {string} Двозначне HEX-подання прозорості.
 */
export default function opacityHex(opacity) {
  // console.log(
  //   "🚀 ~ opacity:",
  //   Math.round(opacity * 255)
  //     .toString(16)
  //     .padStart(2, "0"),
  // );
  return Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
}
