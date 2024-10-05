import React, { useState, useContext } from "react";
import {
  View,
  ImageBackground,
  Text,
  TextInput,
  // Button,
  Alert,
  ScrollView,
} from "react-native";
import styled, { css } from "@emotion/native";
import { AppContext } from "../global/AppContext.js"; // Ваш контекст, якщо користувач вже зареєстрований
import { dfjccaic, hw } from "../global/global-stiles.js";
import {
  Back,
  BackActive,
  BackgroundShadow,
  ButtonBackShadow,
  ButtonBackShadowActive,
} from "../assets/index.js";
import Button from "../components/elements/jsx/Button.jsx";
import { router } from "expo-router";

const Support = () => {
  const { state } = useContext(AppContext); // Припускаємо, що тут є інформація про реєстрацію
  const [email, setEmail] = useState(state?.user?.email || ""); // Використовуємо email зареєстрованого користувача
  const [message, setMessage] = useState("");

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
      <Title>SUPPOTR</Title>
      <Wrapper>
        <ImageBackground
          source={BackgroundShadow}
          resizeMode="stretch"
          style={{ justifyContent: "center", width: "100%" }}
        >
          <View style={{ padding: 20 }}>
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

            {/* <SubmitButton onPress={handleSubmit} title="Надіслати" /> */}
          </View>
        </ImageBackground>
      </Wrapper>
      <View style={containerStyle.buttons}>
        <View style={containerStyle.bigButton}>
          <Button
            onPress={handleSubmit}
            title="SUBMIT"
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
      </View>
    </Container>
  );
};

export default Support;

// Стили
const Container = styled(ScrollView)`
  /* border: 1px solid lime; */
  flex: 1;
  overflow: hidden;
  /* justify-content: center; */
  background-color: #d5f7ff;
`;

const Title = styled(Text)`
  font-family: Mariupol-Bold;
  font-size: ${hw(45)}px;
  text-align: center;
  color: #216169;
  margin: ${hw(20)}px 0;
`;
const Wrapper = styled(View)`
  /* border: 1px solid coral; */
  width: 100%;
  border-radius: ${hw(8)}px;
  overflow: hidden;
  ${dfjccaic}
`;
const Label = styled(Text)`
  font-family: "Mariupol-Regular";
  font-size: ${hw(16)}px;
  text-align: left;
  color: #216169;
  padding-bottom: 5px;
`;

const InputField = styled(TextInput)`
  height: 40px;
  border: 2px solid #00000020;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #d5f7ff;
  border-radius: 5px;
  font-family: "Mariupol-Regular";
  font-size: ${hw(16)}px;
`;

const TextArea = styled(TextInput)`
  height: 120px;
  border: 2px solid #00000020;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #d5f7ff;
  border-radius: 5px;
  font-family: "Mariupol-Regular";
  font-size: ${hw(16)}px;
`;

const containerStyle = {
  buttons: css`
    padding: 20px;
  `,
  bigButton: css`
    width: 100%;
    height: ${hw(74)}px;
    /* border: solid 1px blue; */
    ${dfjccaic}
    align-self: center;
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
