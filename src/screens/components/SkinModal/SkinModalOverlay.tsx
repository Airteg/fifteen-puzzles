import { useGameState } from "@/context/GameStateProvider";
import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import { ModalProps, normalizeColor } from "./SkinModal.types";
import { useSkinLayout } from "./useSkinLayout";

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
