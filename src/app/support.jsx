import React, { useState, useContext } from "react";
import {
  View,
  ImageBackground,
  Text,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import styled, { css } from "@emotion/native";
import { AppContext } from "../global/AppContext.js"; // Ваш контекст, якщо користувач вже зареєстрований
import { dfjccaic, hw, ww, wwN } from "../global/global-stiles.js";
import {
  Back,
  BackActive,
  BackgroundShadow,
  ButtonBackShadow,
  ButtonBackShadowActive,
  SUPPORT,
} from "../assets";
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
    setEmail("");
    setMessage("");
  };

  return (
    <Container>
      <SplashBlock>
        <ImageBackground
          source={SUPPORT}
          resizeMode="contain"
          style={containerStyle.image}
        />
      </SplashBlock>
      <TitleBlock>
        <Title>SUPPORT</Title>
      </TitleBlock>
      <Wrapper>
        <ImageBackground
          source={BackgroundShadow}
          resizeMode="stretch"
          style={{ justifyContent: "center", width: "100%" }}
        >
          <View style={{ paddingVertical: 10, paddingHorizontal: wwN(28) }}>
            {/* Поле електронної пошти тільки для незареєстрованих користувачів */}
            {!state?.user && (
              <>
                <Label>Enter your email:</Label>
                <InputField
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </>
            )}

            <Label>Describe the problems:</Label>
            <TextArea
              placeholder="Description of the problem"
              value={message}
              onChangeText={setMessage}
              multiline={true}
            />

            {/* <SubmitButton onPress={handleSubmit} title="Надіслати" /> */}
          </View>
          <View style={{ paddingVertical: 0, paddingHorizontal: wwN(21) }}>
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
        </ImageBackground>
      </Wrapper>
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
const SplashBlock = styled(View)`
  /* flex: 0.2; */
  height: 15%;
`;
const TitleBlock = styled(View)`
  /* border: 1px solid coral; */
  justify-content: center;
  align-items: center;
`;
const Title = styled(Text)`
  font-family: Mariupol-Bold;
  font-size: ${hw(45)}px;
  text-align: center;
  color: #216169;
  /* margin: ${hw(20)}px 0; */
`;
const Wrapper = styled(View)`
  /* flex: 0.6; */
  /* border: 1px solid coral; */
  width: 100%;
  border-radius: ${hw(8)}px;
  overflow: hidden;
  ${dfjccaic}
`;
const Label = styled(Text)`
  font-family: "Mariupol-Bold";
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
  image: css`
    flex: 1;
    justify-content: center;
    width: 100%;
  `,
  buttons: css`
    /* padding: 20px 9px; */
    ${dfjccaic}/* border: solid 1px blue; */
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
    margin-right: ${ww(3)}px;
    /* border: solid 1px blue; */
  `,
};
