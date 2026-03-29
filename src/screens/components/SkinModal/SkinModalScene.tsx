import { BoardSkin } from "@/ui/skia/BoardSkin";
import { TileSkin } from "@/ui/skia/TileSkin";
import { hexToShader } from "@/utils/color";
import { Group, RoundedRect, SkFont, Text } from "@shopify/react-native-skia";
import React from "react";
import { SceneProps, normalizeColor } from "./SkinModal.types";
import { useSkinLayout } from "./useSkinLayout";

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
  // console.log("🚀 ~ layout:", layout.boardRects);
  // console.log(
  //   "🚀 ~ layout:\n" +
  //     JSON.stringify(
  //       layout,
  //       (k, v) => (typeof v === "number" ? Number(v.toFixed(1)) : v),
  //       2,
  //     ),
  // );

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
}) => {
  return (
    <Group>
      {/* <RoundedRect
        x={layout.previewX}
        y={layout.previewY}
        width={layout.previewW}
        height={layout.previewW}
        r={layout.previewR}
        color={boardColor}
      /> */}
      <Group
        transform={[
          { translateX: layout.previewX },
          { translateY: layout.previewY },
        ]}
      >
        <BoardSkin
          rect={{ x: 0, y: 0, width: layout.previewW, height: layout.previewW }}
          S={S}
          snap={snap}
          tintColor={hexToShader(boardColor)}
        />
      </Group>

      {layout.previewTileRects.map((tile) => (
        <Group key={`preview-${tile.label}`}>
          <Group transform={[{ translateX: tile.x }, { translateY: tile.y }]}>
            <TileSkin
              rect={{ x: 0, y: 0, width: tile.width, height: tile.width }}
              label={tile.label}
              font={titleFont}
              S={S}
              snap={snap}
              tintColor={hexToShader(tileColor)}
              textColor="#1C2833"
            />
          </Group>
        </Group>
      ))}
    </Group>
  );
};

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
      const miniInset = snap(5 * S);
      const miniTile = snap(10 * S);
      const miniGap = snap(1.5 * S);

      return (
        <Group key={`board-${item.color}`}>
          {/* Іконки Board */}
          <RoundedRect
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            r={snap(8 * S)}
            color={item.color}
          />
          {/* Іконки Tile */}
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
            x={item.x + miniInset + miniTile + miniGap + miniTile + miniGap}
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
              r={snap(9 * S)}
              style={"stroke"}
              strokeWidth={2}
              color="#ff0000"
            />
          )}
        </Group>
      );
    })}
  </Group>
);
