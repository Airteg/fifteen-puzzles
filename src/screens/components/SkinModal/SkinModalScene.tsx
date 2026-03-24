import React from "react";
import { Group, RoundedRect, Text, SkFont } from "@shopify/react-native-skia";
import { useSkinLayout } from "./useSkinLayout";
import { SceneProps, normalizeColor } from "./SkinModal.types";

// --- Локальні підкомпоненти для чистоти рендеру ---

const TilePaletteGroup = ({
  layout,
  tileColor,
  snap,
  S,
}: {
  layout: ReturnType<typeof useSkinLayout>;
  tileColor: string;
  snap: (v: number) => number;
  S: number;
}) => (
  <Group>
    {layout.tileRects.map((item) => {
      const selected = normalizeColor(item.color) === normalizeColor(tileColor);
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
  </Group>
);

const PreviewBoardGroup = ({
  layout,
  boardColor,
  tileColor,
  titleFont,
  snap,
  S,
}: {
  layout: ReturnType<typeof useSkinLayout>;
  boardColor: string;
  tileColor: string;
  titleFont: SkFont | null;
  snap: (v: number) => number;
  S: number;
}) => (
  <Group>
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
  </Group>
);

const BoardPaletteGroup = ({
  layout,
  boardColor,
  tileColor,
  snap,
  S,
}: {
  layout: ReturnType<typeof useSkinLayout>;
  boardColor: string;
  tileColor: string;
  snap: (v: number) => number;
  S: number;
}) => (
  <Group>
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

// --- Головний компонент ---

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

      <TilePaletteGroup
        layout={layout}
        tileColor={tileColor}
        snap={snap}
        S={S}
      />
      <PreviewBoardGroup
        layout={layout}
        boardColor={boardColor}
        tileColor={tileColor}
        titleFont={titleFont}
        snap={snap}
        S={S}
      />
      <BoardPaletteGroup
        layout={layout}
        boardColor={boardColor}
        tileColor={tileColor}
        snap={snap}
        S={S}
      />
    </Group>
  );
}
