import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles/globalStyles";
import { Props } from "../types/types";

const SupportScreen = ({ navigation }: Props<"Support">) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <View style={{ gap: 12, width: "100%" }}>
        <TextInput
          placeholder="Ваш Email"
          style={{
            borderWidth: 1,
            padding: 10,
            width: "100%",
            marginBottom: 20,
          }}
        />
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          placeholder="Опишіть вашу проблему"
          style={{
            borderWidth: 1,
            padding: 10,
            width: "100%",
            marginBottom: 20,
          }}
        />

        <Pressable onPress={() => {}} style={styles.button}>
          <Text style={styles.btnText}>Send</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.btnText}>GoBack</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default SupportScreen;
