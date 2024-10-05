import React, { useState, useContext } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import styled, { css } from "@emotion/native";
import { AppContext } from "../global/AppContext.js"; // Ваш контекст, якщо користувач вже зареєстрований
import { useRouter } from "expo-router";

import Button from "../components/elements/jsx/Button.jsx";
import {
  ButtonBackShadow,
  ButtonBackShadowActive,
  Back,
  BackActive,
} from "../assets/index.js";
import { dfjccaic, hw } from "../global/global-stiles.js";

const Support = () => {
  const { state } = useContext(AppContext); // Припускаємо, що тут є інформація про реєстрацію
  const [email, setEmail] = useState(state?.user?.email || ""); // Використовуємо email зареєстрованого користувача
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!email) {
      Alert.alert("Помилка", "Будь ласка, введіть вашу електронну пошту.");
      return;
    }

    if (!message) {
      Alert.alert("Помилка", "Будь ласка, введіть опис проблеми.");
      return;
    }

    // Логіка для надсилання повідомлення на сервер або email
    Alert.alert("Успіх", "Ваше повідомлення надіслано. Дякуємо за відгук!");
    // Очистити поля після відправлення
    setMessage("");
  };

  return (
    <Container>
      <WrapperImage>
        <Title>Support</Title>
        {/* Поле електронної пошти тільки для незареєстрованих користувачів */}
        {!state?.user && (
          <>
            <Label>Ваш Email:</Label>
            <InputField
              placeholder="Введіть вашу електронну пошту"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </>
        )}
        <Label>Опишіть вашу проблему:</Label>
        <TextArea
          placeholder="Опис проблеми"
          value={message}
          onChangeText={setMessage}
          multiline={true}
        />
        <View style={containerStyle.bigButton}>
          <Button
            onPress={handleSubmit}
            title="SUPPORT"
            backgroundImage={ButtonBackShadow}
            activeBackgroundImage={ButtonBackShadowActive}
          />
        </View>
        <View style={containerStyle.smallButton}>
          <Button
            onPress={() => router.back()}
            backgroundImage={Back}
            activeBackgroundImage={BackActive}
          />
        </View>
      </WrapperImage>
    </Container>
  );
};

export default Support;

// Стили
const Container = styled(View)`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: #d5f7ff;
`;
const WrapperImage = styled(View)`
  flex: 1;
  width: 100%;
  border-radius: ${hw(8)}px;
  overflow: hidden;
  ${dfjccaic}
`;
const Title = styled(Text)`
  font-family: KronaOne_400Regular;
  font-size: ${hw(24)}px;
  color: #216169;
  text-align: center;
`;

const Label = styled(Text)`
  font-family: "Mariupol-Regular";
  font-size: ${hw(16)}px;
  text-align: left;
  color: #216169;
`;

const InputField = styled(TextInput)`
  height: 40px;
  border: 1px solid #baf2ff;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #ebfbff;
  border-radius: 5px;
`;

const TextArea = styled(TextInput)`
  height: 120px;
  border: 1px solid #baf2ff;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #ebfbff;
  border-radius: 5px;
`;

const containerStyle = {
  bigButton: css`
    width: 100%;
    height: ${hw(74)}px;
    /* border: solid 1px blue; */
    ${dfjccaic}
  `,
  smallButton: css`
    width: ${hw(64)}px;
    height: ${hw(64)}px;
    display: flex;
    justify-content: center;
    align-self: flex-end;
    /* border: solid 1px blue; */
  `,
};
