import { useGameState } from "@/context/GameStateProvider";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Props } from "../types/types";
import { styles as globalStyles } from "../styles/globalStyles"; // Якщо хочеш перевикористати стилі кнопок

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const StatisticScreen = ({ navigation }: Props<"Statistic">) => {
  const { bestGames } = useGameState();
  const stats = useMemo(
    () =>
      [...bestGames].sort(
        (a, b) => a.durationMs - b.durationMs || a.moves - b.moves,
      ),
    [bestGames],
  );

  return (
    // 1. Оверлей (Темний фон на весь екран)
    // Pressable тут дозволяє закрити вікно, якщо клікнути повз нього
    <Pressable style={styles.overlay} onPress={() => navigation.goBack()}>
      {/* 2. Саме модальне вікно (Білий квадрат) */}
      {/* Pressable тут потрібен, щоб клік по білому вікну НЕ закривав його */}
      <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <Text style={styles.modalTitle}>📊 Статистика</Text>

        {/* Список (ScrollView, якщо список довгий) */}
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={true} // явно вмикаємо полосу (за замовчуванням true)
          // якщо потрібно додати padding/margin всередині
        >
          {stats.length === 0 ? (
            <Text style={styles.emptyText}>Ще немає жодного результату.</Text>
          ) : (
            stats.map((item, index) => (
              <View key={item.id} style={styles.row}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <View style={styles.resultBody}>
                  <Text style={styles.metaLabel}>Start</Text>
                  <Text style={styles.metaValue}>{item.startedAt}</Text>
                  <Text style={styles.metaLabel}>Duration</Text>
                  <Text style={styles.metaValue}>
                    {formatDuration(item.durationMs)}
                  </Text>
                  <Text style={styles.metaLabel}>Moves</Text>
                  <Text style={styles.metaValue}>{item.moves}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Кнопка Закрити */}
        <Pressable
          style={[globalStyles.button, styles.closeButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.btnText}>Закрити</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

export default StatisticScreen;

// Локальні стилі для модалки
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Напівпрозорий чорний
    justifyContent: "center", // Центруємо по вертикалі
    alignItems: "center", // Центруємо по горизонталі
  },
  modalView: {
    width: "85%", // Ширина вікна
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    // Тіні для iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Тінь для Android
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  listContainer: {
    width: "100%",
    marginBottom: 20,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f8fbff",
    borderRadius: 14,
  },
  rank: {
    fontWeight: "bold",
    color: "#2f6ea2",
    width: 34,
    fontSize: 16,
  },
  resultBody: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7c8d",
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 14,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#667085",
    paddingVertical: 16,
  },
  closeButton: {
    marginTop: 10,
    width: "100%", // Кнопка на всю ширину модалки
    backgroundColor: "#ff5252", // Червоний колір для закриття
  },
});
