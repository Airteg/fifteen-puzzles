import { View } from "react-native";
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from "react";
import styled from "@emotion/native";
import { SkiaShadow } from "react-native-skia-shadow";
import { Audio } from "expo-av";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";

import { dfjccaic } from "../../../../global/global-stiles.js";
import { AppContext } from "../../../../global/AppContext.js";
import moveSound from "../../../../assets/sound/move.aac";
import { shuffleTiles } from "../../../../utils/shuffleTiles.js";
import Tile from "../Tile.jsx";

const Board = ({ color = "#71D4EB" }) => {
  const { state } = useContext(AppContext);
  const [tiles, setTiles] = useState(shuffleTiles());
  const soundRef = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(moveSound);
        soundRef.current = sound;
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playMoveSound = async () => {
    if (!state.sound) return; // Якщо звук вимкнений, не відтворювати звук
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleTileClick = useCallback(
    async (clickedIndex) => {
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

        await playMoveSound(); // Виклик функції для відтворення звуку
      }
    },
    [tiles, state.sound]
  );

  return (
    <Container>
      <SkiaShadow blur={8} dx={-4} dy={4} color="#17173ecc">
        <OuterContainer>
          <InnerContainer>
            <BackGround />
            <ColorBoard color={color}>
              <TileWrapper>
                {tiles.map((number, index) => (
                  <Tile
                    key={index}
                    width="24%"
                    height="24%"
                    number={number}
                    onPress={() => handleTileClick(index)}
                  />
                ))}
              </TileWrapper>
            </ColorBoard>
          </InnerContainer>
        </OuterContainer>
      </SkiaShadow>
    </Container>
  );
};

export default Board;

const Container = styled.View`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

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

const BackGround = () => (
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
    <Svg viewBox="0 0 420 420">
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

const TileWrapper = styled.View`
  width: 98.5%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: stretch;
`;
