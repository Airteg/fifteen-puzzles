import { View, Text } from "react-native";
import React, { useState } from "react";
import styled, { css } from "@emotion/native";
import { SkiaShadow } from "react-native-skia-shadow";
import { dfjccaic } from "../../../global/global-stiles.js";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import Tile from "./Tile.jsx";

export const shuffleTiles = () => {
  const shuffledTiles = [...Array(16).keys()].sort(() => Math.random() - 0.5);
  return shuffledTiles;
};

const Board = ({ children, color = "#71D4EB" }) => {
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
    <SkiaShadow blur={8} dx={-4} dy={4} color="#17173ecc">
      <OuterContainer>
        <InnerContainer>
          <BackGround />
          <ColorBoard color={color}>
            <TileWrapper>
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
            </TileWrapper>
          </ColorBoard>
        </InnerContainer>
      </OuterContainer>
    </SkiaShadow>
  );
};

export default Board;

const OuterContainer = styled.View`
  width: 90%;
  aspect-ratio: 1;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const InnerContainer = styled.View`
  width: 98%;
  aspect-ratio: 1;
  background-color: none;
  border-radius: 8px;
  ${dfjccaic}
`;
const ColorBoard = styled.View`
  width: 96%;
  aspect-ratio: 1;
  background-color: ${(props) => props.color};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BackGround = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Svg viewBox={`0 0 420 420`}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor="#FDFDFD" stopOpacity="1" />
            <Stop offset="0.35" stopColor="#F4F4F4" stopOpacity="1" />
            <Stop offset="0.65" stopColor="#DCDCDC" stopOpacity="1" />
            <Stop offset="1" stopColor="#D0D0D0" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={420}
          height={420}
          fill="url(#grad)"
          stroke="none"
        />
      </Svg>
    </View>
  );
};
const TileWrapper = styled.View`
  width: 98.5%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: stretch;
  border: 0.5px solid #0000ff;
`;
