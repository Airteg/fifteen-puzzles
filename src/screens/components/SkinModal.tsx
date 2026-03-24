import { useGameState } from "@/context/GameStateProvider";
import { THEME_PALETTE } from "@/theme/themePalette";
import { Group, RoundedRect, SkFont, Text } from "@shopify/react-native-skia";
import React, { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";

type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ModalProps = {
  frame: Frame;
  S: number;
  snap: (v: number) => number;
};

type SceneProps = ModalProps & {
  titleFont: SkFont | null;
  boardColor?: string;
  tileColor?: string;
};

type HitRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function normalizeColor(color?: string) {
  return (color ?? "").trim().toLowerCase();
}

function useSkinLayout(frame: Frame, S: number, snap: (v: number) => number) {
  return useMemo(() => {
    const titleY = snap(42 * S);

    const innerInset = snap(16 * S);
    const innerY = snap(60 * S);
    const innerW = frame.width - innerInset * 2;
    const innerH = frame.height - innerY - innerInset;
    const innerR = snap(8 * S);

    const leftColX = innerInset + snap(10 * S);
    const leftColY = innerY + snap(12 * S);
    const tileSwatchSize = snap(26 * S);
    const tileSwatchGap = snap(8 * S);

    const tileRects: (HitRect & { color: string })[] = THEME_PALETTE.tile.map(
      (color, index) => ({
        color,
        x: leftColX,
        y: leftColY + index * (tileSwatchSize + tileSwatchGap),
        width: tileSwatchSize,
        height: tileSwatchSize,
      }),
    );

    const previewX = leftColX + tileSwatchSize + snap(18 * S);
    const previewY = innerY + snap(16 * S);
    const previewW = innerW - (previewX - innerInset) - snap(12 * S);
    const previewH = snap(176 * S);
    const previewR = snap(18 * S);

    const previewInset = snap(12 * S);
    const previewTileSize = snap(46 * S);
    const previewTileGap = snap(8 * S);

    const previewTileRects: (HitRect & { label: string })[] = [
      {
        label: "1",
        x: previewX + previewInset,
        y: previewY + previewInset,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "2",
        x: previewX + previewInset + previewTileSize + previewTileGap,
        y: previewY + previewInset,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "3",
        x: previewX + previewInset + 2 * (previewTileSize + previewTileGap),
        y: previewY + previewInset,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "4",
        x: previewX + previewInset,
        y: previewY + previewInset + previewTileSize + previewTileGap,
        width: previewTileSize,
        height: previewTileSize,
      },
      {
        label: "5",
        x: previewX + previewInset + previewTileSize + previewTileGap,
        y: previewY + previewInset + previewTileSize + previewTileGap,
        width: previewTileSize,
        height: previewTileSize,
      },
    ];

    const boardPaletteSize = snap(42 * S);
    const boardPaletteGap = snap(12 * S);
    const boardPaletteY = previewY + previewH + snap(20 * S);

    const totalBoardPaletteW =
      THEME_PALETTE.board.length * boardPaletteSize +
      (THEME_PALETTE.board.length - 1) * boardPaletteGap;

    const boardPaletteX =
      previewX + Math.max(0, (previewW - totalBoardPaletteW) / 2);

    const boardRects: (HitRect & { color: string })[] = THEME_PALETTE.board.map(
      (color, index) => ({
        color,
        x: boardPaletteX + index * (boardPaletteSize + boardPaletteGap),
        y: boardPaletteY,
        width: boardPaletteSize,
        height: boardPaletteSize,
      }),
    );

    return {
      titleY,
      innerInset,
      innerY,
      innerW,
      innerH,
      innerR,
      tileRects,
      previewX,
      previewY,
      previewW,
      previewH,
      previewR,
      previewTileRects,
      boardRects,
    };
  }, [frame.width, frame.height, S, snap]);
}

export function SkinModalScene({
  frame,
  S,
  snap,
  titleFont,
  boardColor = "#133D44",
  tileColor = "#71D4EB",
}: SceneProps) {
  const layout = useSkinLayout(frame, S, snap);

  const titleText = "SKIN";
  const titleX = titleFont
    ? (frame.width - titleFont.measureText(titleText).width) / 2
    : 0;

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      {titleFont && (
        <Text
          x={titleX}
          y={layout.titleY}
          text={titleText}
          font={titleFont}
          color="#488B8F"
        />
      )}

      <RoundedRect
        x={layout.innerInset}
        y={layout.innerY}
        width={layout.innerW}
        height={layout.innerH}
        r={layout.innerR}
        color="#E1F5FE"
      />

      {/* Ліва палітра плиток — простий скелет */}
      {layout.tileRects.map((item) => {
        const selected =
          normalizeColor(item.color) === normalizeColor(tileColor);

        return (
          <Group key={`tile-${item.color}`}>
            <RoundedRect
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              r={snap(6 * S)}
              color={item.color}
            />
            {selected && (
              <RoundedRect
                x={item.x - snap(3 * S)}
                y={item.y - snap(3 * S)}
                width={item.width + snap(6 * S)}
                height={item.height + snap(6 * S)}
                r={snap(8 * S)}
                color="rgba(33,97,105,0.20)"
              />
            )}
          </Group>
        );
      })}

      {/* Основна preview-дошка — заглушка, але з реальними кольорами */}
      <RoundedRect
        x={layout.previewX}
        y={layout.previewY}
        width={layout.previewW}
        height={layout.previewH}
        r={layout.previewR}
        color={boardColor}
      />

      {layout.previewTileRects.map((tile) => {
        const textX = titleFont
          ? tile.x + (tile.width - titleFont.measureText(tile.label).width) / 2
          : tile.x + snap(12 * S);

        const textY = titleFont
          ? tile.y + tile.height / 2 + titleFont.getSize() / 2.8
          : tile.y + snap(26 * S);

        return (
          <Group key={`preview-${tile.label}`}>
            <RoundedRect
              x={tile.x}
              y={tile.y}
              width={tile.width}
              height={tile.height}
              r={snap(8 * S)}
              color={tileColor}
            />
            {titleFont && (
              <Text
                x={textX}
                y={textY}
                text={tile.label}
                font={titleFont}
                color="#216169"
              />
            )}
          </Group>
        );
      })}

      {/* Нижня палітра дошок — також простий скелет */}
      {layout.boardRects.map((item) => {
        const selected =
          normalizeColor(item.color) === normalizeColor(boardColor);
        const miniInset = snap(7 * S);
        const miniTile = snap(10 * S);
        const miniGap = snap(4 * S);

        return (
          <Group key={`board-${item.color}`}>
            <RoundedRect
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              r={snap(10 * S)}
              color={item.color}
            />
            <RoundedRect
              x={item.x + miniInset}
              y={item.y + miniInset}
              width={miniTile}
              height={miniTile}
              r={snap(3 * S)}
              color={tileColor}
            />
            <RoundedRect
              x={item.x + miniInset + miniTile + miniGap}
              y={item.y + miniInset}
              width={miniTile}
              height={miniTile}
              r={snap(3 * S)}
              color={tileColor}
            />
            <RoundedRect
              x={item.x + miniInset}
              y={item.y + miniInset + miniTile + miniGap}
              width={miniTile}
              height={miniTile}
              r={snap(3 * S)}
              color={tileColor}
            />

            {selected && (
              <RoundedRect
                x={item.x - snap(3 * S)}
                y={item.y - snap(3 * S)}
                width={item.width + snap(6 * S)}
                height={item.height + snap(6 * S)}
                r={snap(12 * S)}
                color="rgba(33,97,105,0.20)"
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
}

export function SkinModalOverlay({ frame, S, snap }: ModalProps) {
  const { settings, updateSettings } = useGameState();
  const layout = useSkinLayout(frame, S, snap);

  const handleTileColorPress = useCallback(
    (color: string) => {
      if (normalizeColor(settings.tileColor) === normalizeColor(color)) return;
      updateSettings({ tileColor: color });
    },
    [settings.tileColor, updateSettings],
  );

  const handleBoardColorPress = useCallback(
    (color: string) => {
      if (normalizeColor(settings.boardColor) === normalizeColor(color)) return;
      updateSettings({ boardColor: color });
    },
    [settings.boardColor, updateSettings],
  );

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: frame.width,
        height: frame.height,
      }}
      pointerEvents="box-none"
    >
      {/* Hit-area для вибору кольору плиток */}
      {layout.tileRects.map((item) => (
        <Pressable
          key={`tile-hit-${item.color}`}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
          }}
          accessibilityRole="button"
          accessibilityLabel={`Tile color ${item.color}`}
          onPress={() => handleTileColorPress(item.color)}
        />
      ))}

      {/* Hit-area для вибору кольору дошки */}
      {layout.boardRects.map((item) => (
        <Pressable
          key={`board-hit-${item.color}`}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
          }}
          accessibilityRole="button"
          accessibilityLabel={`Board color ${item.color}`}
          onPress={() => handleBoardColorPress(item.color)}
        />
      ))}
    </View>
  );
}
