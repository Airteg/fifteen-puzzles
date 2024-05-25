import React, { useState } from "react";
import styled, { css } from "@emotion/native";
import { View, Text, ImageBackground, Pressable } from "react-native";
import Tile from "./elements/jsx/Tile";
import Plan from "./Plan.jsx";
import { dfjccaic } from "../global/global-stiles.js";

export const shuffleTiles = () => {
  const shuffledTiles = [...Array(16).keys()].sort(() => Math.random() - 0.5);
  return shuffledTiles;
};

const Board = () => {
  const [tiles, setTiles] = useState(shuffleTiles());

  const handleTileClick = (clickedIndex) => {
    const emptyIndex = tiles.indexOf(0);
    const clickedRow = Math.floor(clickedIndex / 4);
    const clickedCol = clickedIndex % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    if (clickedRow === emptyRow || clickedCol === emptyCol) {
      const newTiles = [...tiles];
      const step =
        clickedRow === emptyRow
          ? clickedCol < emptyCol
            ? 1
            : -1
          : clickedIndex < emptyIndex
          ? 4
          : -4;

      for (let i = emptyIndex; i !== clickedIndex; i -= step) {
        newTiles[i] = newTiles[i - step];
      }
      newTiles[clickedIndex] = tiles[emptyIndex];
      setTiles(newTiles);
    }
  };

  return (
    <View style={styles.board}>
      <Plan />
      {/* <TileWrapper>
        {tiles.map((number, index) => {
          return (
            <Tile
              key={index}
              width="24%"
              height="24%"
              number={number}
              onPress={() => handleTileClick(index)}
            />
          );
        })}
      </TileWrapper> */}
    </View>
  );
};

export default Board;

const TileWrapper = styled.View`
  width: 89%;
  /* margin: 10%; */
  aspect-ratio: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  /* border: 3px solid #0000ff; */
`;
const styles = {
  board: css`
    width: 100%;
    height: 100%;
    border: 3px solid green;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
};
