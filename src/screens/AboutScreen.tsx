import { Button, Text, View } from "react-native";
import { styles } from "../styles/globalStyles";
import { Props } from "../types/types";

const AboutScreen = ({ navigation }: Props<"About">) => {
  return (
    <View style={[styles.container, { backgroundColor: "#f3e5f5" }]}>
      <Text style={styles.title}>ℹ️ Про гру</Text>
      <Text style={styles.text}>
        Це навчальний приклад @react-navigation: Stack + params + типізація.
      </Text>

      <Button title="Назад" onPress={() => navigation.goBack()} />
    </View>
  );
};
export default AboutScreen;
