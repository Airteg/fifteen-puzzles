import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Typography } from "@/theme/typography";
import { StRow } from "./components/StRow";
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
  const {
    button,
    listRect,
    outer: { c: BG },
  } = useStatisticLayout(frame, S, snap);

  const bodyStyle = useMemo(() => Typography.mariupol.body(S), [S]);

  return (
    <View
      style={[
        // __debugBorder("#00f"),
        {
          width: "100%",
          height: "100%",
        },
      ]}
      pointerEvents="box-none"
    >
      <ScrollView
        style={[
          // __debugBorder("orange", 1),
          {
            position: "absolute",
            left: listRect.x,
            top: listRect.y,
            width: listRect.w,
            height: listRect.h,
            borderRadius: listRect.r,
          },
        ]}
        contentContainerStyle={{
          paddingBottom: snap(8 * S),
        }}
        onContentSizeChange={(_, height) => onContentHeightChange(height)}
        showsVerticalScrollIndicator
      >
        {items.length === 0 ? (
          <View
            style={{
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
              You haven&apos;t played any games yet.
            </Text>
          </View>
        ) : (
          <View
            style={{
              rowGap: snap(0),
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                backgroundColor: BG,
                borderTopLeftRadius: listRect.r,
                borderTopRightRadius: listRect.r,
              }}
            >
              <StRow
                S={S}
                snap={snap}
                values={["#", "TIME", "MOVES", "DATE"]}
                isHeader
              />
            </View>

            {items.map((item) => (
              <StRow
                key={item.id}
                S={S}
                snap={snap}
                values={[
                  item.rank,
                  item.durationText,
                  item.movesText,
                  item.dateText,
                ]}
              />
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
