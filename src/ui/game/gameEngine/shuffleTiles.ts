const isSolvable = (arr: number[]) => {
  const size = 4;
  const flat = arr.filter((n) => n !== 0);
  let inv = 0;
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inv++;
    }
  }
  const blankIndex = arr.indexOf(0);
  const blankRowFromBottom = size - Math.floor(blankIndex / size); // 1..4

  // Для парної ширини (4): розв’язно якщо:
  // порожня клітинка на парному рядку знизу і кількість інверсій непарна
  // АБО на непарному рядку знизу і кількість інверсій парна
  if (size % 2 === 0) {
    return blankRowFromBottom % 2 === 0 ? inv % 2 === 1 : inv % 2 === 0;
  }
  // (для непарної ширини — парна кількість інверсій)
  return inv % 2 === 0;
};

const isSolved = (arr: number[]) =>
  arr.every((v, i) => (i < arr.length - 1 ? v === i + 1 : v === 0));

const fisherYates = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const shuffleTiles = () => {
  const base = Array.from({ length: 16 }, (_, i) => (i === 15 ? 0 : i + 1));
  let attempt = 0;
  while (true) {
    const candidate = fisherYates([...base]);
    if (!isSolved(candidate) && isSolvable(candidate)) return candidate;
    if (++attempt > 1000) return candidate; // на всяк випадок
  }
};
