export const shuffleTiles = () => {
  const shuffledTiles = [...Array(16).keys()].sort(() => Math.random() - 0.5);
  return shuffledTiles;
};
