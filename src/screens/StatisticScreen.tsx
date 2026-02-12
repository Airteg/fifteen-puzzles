import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Props } from "../types/types";
import { styles as globalStyles } from "../styles/globalStyles"; // Якщо хочеш перевикористати стилі кнопок

const StatisticScreen = ({ navigation }: Props<"Statistic">) => {
  // Фейкові дані для прикладу
  const stats = [
    { id: 1, name: "Master", score: 1200 },
    { id: 2, name: "Vadym", score: 950 },
    { id: 3, name: "Player 1", score: 800 },
    { id: 4, name: "Noob", score: 100 },
    { id: 5, name: "Test", score: 50 },
  ];

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
        <View style={styles.listContainer}>
          {stats.map((item, index) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.score}>{item.score}</Text>
            </View>
          ))}
        </View>

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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rank: {
    fontWeight: "bold",
    color: "#888",
    width: 30,
  },
  name: {
    flex: 1,
    color: "#333",
  },
  score: {
    fontWeight: "bold",
    color: "#2196f3",
  },
  closeButton: {
    marginTop: 10,
    width: "100%", // Кнопка на всю ширину модалки
    backgroundColor: "#ff5252", // Червоний колір для закриття
  },
});
