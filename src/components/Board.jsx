import React, { useState } from "react";
import styled, { css } from "@emotion/native";
import { View, Text, ImageBackground, Pressable } from "react-native";
import Tile from "./elements/jsx/Tile";
import Plan from "./Plan.jsx";

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
      {/* {tiles.map((number, index) => {
        return (
          <Tile
            key={index}
            width="23.7%"
            height="23.7%"
            number={number}
            onPress={() => handleTileClick(index)}
          />
        );
      })} */}
    </View>
  );
};

export default Board;

const styles = {
  board: css`
    width: 100%;
    height: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    align-items: center;
    /* border: 1px solid navy; */
  `,
  tile: css`
    width: 25%;
    height: 25%;
    margin: 0%;
    justify-content: center;
    align-items: center;
    /* border: 1px red solid; */
  `,
  emptyTile: css`
    background-color: transparent;
  `,
  tileText: css`
    font-size: 20px;
    color: black;
  `,
  image: css`
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  `,
};
