import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Typography } from "@/theme/typography";
import type { OverlayProps } from "./StatisticModal.types";
import { useStatisticLayout } from "./useStatisticLayout";

export function StatisticModalOverlay({
  S,
  frame,
  items,
  snap,
  onContentHeightChange,
  onBack,
  onResetStatistics,
}: OverlayProps) {
  const { button, listRect } = useStatisticLayout(frame, S, snap);

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

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <ScrollView
        style={{
          position: "absolute",
          left: listRect.x + 10,
          top: listRect.y + 10,
          width: listRect.w - 20,
          height: listRect.h,
          borderRadius: listRect.r,
          backgroundColor: "#f0ffee",
        }}
        contentContainerStyle={{
          paddingBottom: snap(8 * S),
        }}
        onContentSizeChange={(_, height) => onContentHeightChange(height)}
        showsVerticalScrollIndicator
      >
        {items.length === 0 ? (
          <View
            style={{
              backgroundColor: "#FFFFFF00",
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
                backgroundColor: "#f6bcbc",
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
                  backgroundColor: "#FFFFFF00",
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
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reset statistics"
        style={{
          position: "absolute",
          left: button.x,
          top: button.y,
          width: button.size,
          height: button.size,
        }}
        onPress={onResetStatistics}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={{
          position: "absolute",
          left: button.x + button.size * 2,
          top: button.y,
          width: button.size,
          height: button.size,
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
