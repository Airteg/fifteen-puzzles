import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from "react";
import { SkiaShadow } from "react-native-skia-shadow";
import { Audio } from "expo-av";
import { router } from "expo-router"; // Додано імпорт router
import { AppContext } from "../../../../global/AppContext.js";
import moveSound from "../../../../assets/sound/move.aac";
import { shuffleTiles } from "../../../../utils/shuffleTiles.js";
import Tile from "../Tile1.jsx";
import {
  ColorBoard,
  Container,
  InnerContainer,
  OuterContainer,
  TileWrapper,
} from "./styledComponents.js";

const WINNING_COMBINATION = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
];
// const WINNING_COMBINATION = [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 13, 15, 0,
// ];

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
  // const checkForWin = (tiles) => {
  //   if (JSON.stringify(tiles) === JSON.stringify(WINNING_COMBINATION)) {
  //     console.log("Congratulations! You've won the game!");
  //     router.push("/YouWin"); // Перехід на екран YouWin
  //   }
  // };
  const checkForWin = (tiles) => {
    // console.log("🚀 ~ tiles:", tiles);

    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] !== WINNING_COMBINATION[i]) {
        return false;
      }
    }
    router.push("/YouWin");
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

        checkForWin(newTiles);
      }
    },
    [tiles, state.sound]
  );

  return (
    <Container>
      <SkiaShadow blur={8} dx={-4} dy={4} color="#17173ecc">
        <OuterContainer>
          <InnerContainer>
            <ColorBoard color={color}>
              <TileWrapper>
                {tiles.map((number, index) => (
                  <Tile
                    key={index}
                    width="24.5%"
                    height="24.5%"
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
