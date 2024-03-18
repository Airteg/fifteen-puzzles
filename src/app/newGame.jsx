// src/app/new-game.jsx
import { View, Button } from "react-native";

export default function NewGame() {
  return (
    <View>
      <Button
        title="CLASSIC"
        onPress={() => {
          /* Навігація до CLASSIC гри */
        }}
      />
      <Button
        title="LIMIT TIME"
        onPress={() => {
          /* Навігація до LIMIT TIME гри */
        }}
      />
    </View>
  );
}
