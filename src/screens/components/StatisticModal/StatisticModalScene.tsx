import { PanelSurface } from "@/ui/skia/PanelSurface";
import { SkiaButtonSkin } from "@/ui/skia/SkiaButtonSkin";
import { SkiaIconButtonSkin } from "@/ui/skia/SkiaIconButtonSkin";
import {
  Group,
  RoundedRect,
  Text,
  type SkFont,
} from "@shopify/react-native-skia";
import React from "react";
import type { SceneProps, StatisticItemVm } from "./StatisticModal.types";
import { useStatisticLayout } from "./useStatisticLayout";

const OUTER_COLOR = "#71D4EB";
const INNER_COLOR = "#D5F7FF";
const CARD_COLOR = "#FFFFFF";
const TITLE_COLOR = "#216169";
const BODY_COLOR = "#1C2833";
const MUTED_COLOR = "#5F7C84";
const DIVIDER_COLOR = "rgba(33, 97, 105, 0.12)";

function textXCentered(
  font: SkFont | null | undefined,
  text: string,
  w: number,
) {
  if (!font) return 0;
  return (w - font.measureText(text).width) / 2;
}

export function StatisticModalScene({
  frame,
  S,
  snap,
  titleFont,
  bodyFont,
  summary,
  items,
}: SceneProps) {
  const layout = useStatisticLayout(frame, S, snap, items.length);

  const titleText = "STATISTIC";
  const titleX = textXCentered(titleFont, titleText, frame.width);

  return (
    <Group transform={[{ translateX: frame.x }, { translateY: frame.y }]}>
      {/* Зовнішня панель */}
      <PanelSurface
        rect={{ x: 0, y: 0, width: frame.width, height: frame.height }}
      />

      {/* Заголовок */}
      {titleFont && (
        <Text
          x={titleX}
          y={layout.titleY}
          text={titleText}
          font={titleFont}
          color={TITLE_COLOR}
        />
      )}

      {/* Внутрішній контейнер */}
      <RoundedRect
        x={layout.innerInset}
        y={layout.innerY}
        width={layout.innerW}
        height={layout.innerH}
        r={layout.innerR}
        color={INNER_COLOR}
      />

      {/* Підзаголовок */}
      {titleFont && (
        <Text
          x={textXCentered(titleFont, "YOUR LAST 10 GAMES:", frame.width)}
          y={layout.sectionTitleY}
          text="YOUR LAST 10 GAMES:"
          font={titleFont}
          color={BODY_COLOR}
        />
      )}

      {/* Summary card */}
      <RoundedRect
        x={layout.summaryX}
        y={layout.summaryY}
        width={layout.summaryW}
        height={layout.summaryH}
        r={layout.summaryR}
        color={CARD_COLOR}
      />

      {titleFont && (
        <>
          <Text
            x={layout.summaryLabelX}
            y={layout.summaryRow1Y}
            text="RECORD TIME:"
            font={titleFont}
            color={BODY_COLOR}
          />
          <Text
            x={layout.summaryLabelX}
            y={layout.summaryRow2Y}
            text="RECORD STEPS:"
            font={titleFont}
            color={BODY_COLOR}
          />
        </>
      )}

      {titleFont && (
        <>
          <Text
            x={layout.summaryValueColX}
            y={layout.summaryRow1Y}
            text={summary.bestTimeText}
            font={titleFont}
            color={TITLE_COLOR}
          />
          <Text
            x={layout.summaryValueColX}
            y={layout.summaryRow2Y}
            text={summary.bestMovesText}
            font={titleFont}
            color={TITLE_COLOR}
          />
        </>
      )}

      {/* Заголовки колонок */}
      {bodyFont && (
        <>
          <Text
            x={layout.rankColX}
            y={layout.listY + layout.listHeaderH}
            text="#"
            font={bodyFont}
            color={MUTED_COLOR}
          />
          <Text
            x={layout.timeColX}
            y={layout.listY + layout.listHeaderH}
            text="TIME"
            font={bodyFont}
            color={MUTED_COLOR}
          />
          <Text
            x={layout.movesColX}
            y={layout.listY + layout.listHeaderH}
            text="MOVES"
            font={bodyFont}
            color={MUTED_COLOR}
          />
          <Text
            x={layout.dateColX}
            y={layout.listY + layout.listHeaderH}
            text="DATE"
            font={bodyFont}
            color={MUTED_COLOR}
          />
        </>
      )}

      {/* Рядки */}
      {items.map((item, index) => (
        <StatisticRow
          key={item.id}
          item={item}
          rowY={layout.rows[index]?.y ?? 0}
          rowX={layout.listX}
          rowW={layout.listW}
          rowH={layout.rowH}
          rankColX={layout.rankColX}
          timeColX={layout.timeColX}
          movesColX={layout.movesColX}
          dateColX={layout.dateColX}
          bodyFont={bodyFont}
          snap={snap}
          S={S}
        />
      ))}

      {/* Кнопка reset */}
      {titleFont && (
        <SkiaButtonSkin
          rect={layout.resetButtonRect}
          title="СКИНУТИ СТАТИСТИКУ"
          font={titleFont}
          pressed={false}
        />
      )}

      {/* Кнопка back — та сама іконкова, що у settings/new game */}
      <Group>
        <SkiaIconButtonSkin rect={layout.backButtonRect} pressed={false} />
      </Group>
    </Group>
  );
}

function StatisticRow({
  item,
  rowX,
  rowY,
  rowW,
  rowH,
  rankColX,
  timeColX,
  movesColX,
  dateColX,
  bodyFont,
  snap,
  S,
}: {
  item: StatisticItemVm;
  rowX: number;
  rowY: number;
  rowW: number;
  rowH: number;
  rankColX: number;
  timeColX: number;
  movesColX: number;
  dateColX: number;
  bodyFont?: SkFont | null;
  snap: (v: number) => number;
  S: number;
}) {
  return (
    <Group>
      <RoundedRect
        x={rowX}
        y={rowY}
        width={rowW}
        height={rowH}
        r={snap(8 * S)}
        color={CARD_COLOR}
      />
      <RoundedRect
        x={rowX}
        y={rowY + rowH - 1}
        width={rowW}
        height={1}
        r={0}
        color={DIVIDER_COLOR}
      />

      {bodyFont && (
        <>
          <Text
            x={rankColX}
            y={rowY + rowH - snap(8 * S)}
            text={String(item.rank)}
            font={bodyFont}
            color={TITLE_COLOR}
          />
          <Text
            x={timeColX}
            y={rowY + rowH - snap(8 * S)}
            text={item.durationText}
            font={bodyFont}
            color={BODY_COLOR}
          />
          <Text
            x={movesColX}
            y={rowY + rowH - snap(8 * S)}
            text={item.movesText}
            font={bodyFont}
            color={BODY_COLOR}
          />
          <Text
            x={dateColX}
            y={rowY + rowH - snap(8 * S)}
            text={item.dateText}
            font={bodyFont}
            color={BODY_COLOR}
          />
        </>
      )}
    </Group>
  );
}
