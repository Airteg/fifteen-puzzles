import React, { useMemo } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Typography } from "@/theme/typography";
import type { OverlayProps } from "./StatisticModal.types";
import { useStatisticLayout } from "./useStatisticLayout";

export function StatisticModalOverlay({
  frame,
  S,
  snap,
  items,
  summary,
  contentHeight,
  onContentHeightChange,
  onBack,
  onResetStatistics,
}: OverlayProps) {
  const layout = useStatisticLayout(frame, S, snap, contentHeight);

  const titleStyle = useMemo(() => Typography.krona.headerTitle(S), [S]);
  const bodyStyle = useMemo(() => Typography.mariupol.body(S), [S]);
  const bodyStrongStyle = useMemo(
    () => [
      Typography.mariupol.body(S),
      {
        fontFamily: "Mariupol-Bold" as const,
      },
    ],
    [S],
  );

  const handleContentLayout = (e: LayoutChangeEvent) => {
    const h = snap(e.nativeEvent.layout.height);
    if (h !== contentHeight) {
      onContentHeightChange(h);
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Заголовок */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: layout.titleTop,
          width: frame.width,
          alignItems: "center",
        }}
      >
        <Text style={titleStyle}>STATISTIC</Text>
      </View>

      {/* Контент, який визначає висоту сцени */}
      <View
        onLayout={handleContentLayout}
        style={{
          position: "absolute",
          left: layout.innerX,
          top: layout.innerY,
          width: layout.innerWidth,
          paddingHorizontal: snap(16 * S),
          paddingTop: snap(16 * S),
          paddingBottom: snap(16 * S),
        }}
        pointerEvents="none"
      >
        <Text
          style={[
            bodyStrongStyle,
            {
              textAlign: "center",
              marginBottom: snap(14 * S),
              color: "#216169",
            },
          ]}
        >
          YOUR LAST 10 GAMES:
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: snap(10 * S),
            paddingHorizontal: snap(14 * S),
            paddingVertical: snap(12 * S),
            marginBottom: snap(14 * S),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: snap(8 * S),
            }}
          >
            <Text style={[bodyStrongStyle, { color: "#216169" }]}>
              RECORD TIME:
            </Text>
            <Text style={[bodyStrongStyle, { color: "#1C2833" }]}>
              {summary.bestTimeText}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={[bodyStrongStyle, { color: "#216169" }]}>
              RECORD STEPS:
            </Text>
            <Text style={[bodyStrongStyle, { color: "#1C2833" }]}>
              {summary.bestMovesText}
            </Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: snap(10 * S),
              paddingVertical: snap(20 * S),
              paddingHorizontal: snap(14 * S),
            }}
          >
            <Text
              style={[
                bodyStyle,
                {
                  textAlign: "center",
                  color: "#5F7C84",
                },
              ]}
            >
              Ви ще не зіграли жодної гри.
            </Text>
          </View>
        ) : (
          <View
            style={{
              rowGap: snap(6 * S),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: snap(8 * S),
                marginBottom: snap(2 * S),
              }}
            >
              <Text
                style={[styles.headerCell, { width: "12%" }, bodyStrongStyle]}
              >
                #
              </Text>
              <Text
                style={[styles.headerCell, { width: "30%" }, bodyStrongStyle]}
              >
                TIME
              </Text>
              <Text
                style={[styles.headerCell, { width: "23%" }, bodyStrongStyle]}
              >
                MOVES
              </Text>
              <Text
                style={[styles.headerCell, { width: "35%" }, bodyStrongStyle]}
              >
                DATE
              </Text>
            </View>

            {items.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: snap(8 * S),
                  minHeight: snap(28 * S),
                  paddingHorizontal: snap(8 * S),
                  paddingVertical: snap(6 * S),
                }}
              >
                <Text style={[styles.cell, { width: "12%" }, bodyStyle]}>
                  {item.rank}
                </Text>
                <Text style={[styles.cell, { width: "30%" }, bodyStyle]}>
                  {item.durationText}
                </Text>
                <Text style={[styles.cell, { width: "23%" }, bodyStyle]}>
                  {item.movesText}
                </Text>
                <Text style={[styles.cell, { width: "35%" }, bodyStyle]}>
                  {item.dateText}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Hit areas кнопок */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reset statistics"
        style={{
          position: "absolute",
          left: layout.resetButtonRect.x,
          top: layout.resetButtonRect.y,
          width: layout.resetButtonRect.width,
          height: layout.resetButtonRect.height,
        }}
        onPress={onResetStatistics}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={{
          position: "absolute",
          left: layout.backButtonRect.x,
          top: layout.backButtonRect.y,
          width: layout.backButtonRect.width,
          height: layout.backButtonRect.height,
        }}
        onPress={onBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerCell: {
    color: "#216169",
  },
  cell: {
    color: "#1C2833",
  },
});
