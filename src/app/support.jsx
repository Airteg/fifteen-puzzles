import { View, ImageBackground, Text, TextInput, Alert } from "react-native";
import styled, { css } from "@emotion/native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";

import { dfjccaic, hw, ww } from "../global/global-stiles.js";
import Button from "../components/elements/jsx/Button.jsx";

import {
  SUPPORT,
  ButtonBackShadow,
  ButtonBackShadowActive,
  Back,
  BackActive,
  BackgroundShadow,
} from "../assets";
import { AppContext } from "../global/AppContext.js";

export default function Support() {
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
    <ContainerSetting>
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
      <ButtonBlock>
        <ImageBackground
          source={BackgroundShadow}
          resizeMode="stretch"
          style={containerStyle.image}
        >
          <WrapperImage>
            <Wrapper>
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
                  onPress={() => navigate("/support")}
                  title="SEND INFORMATIONS"
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
            </Wrapper>
          </WrapperImage>
        </ImageBackground>
      </ButtonBlock>
    </ContainerSetting>
  );
}

const ContainerSetting = styled.View`
  border: 2px solid orangered;
  flex: 1;
  justify-content: space-between;
  padding-top: ${hw(54)}px;
  margin-bottom: ${hw(34)}px;
`;
const Wrapper = styled.View`
  width: ${ww(340)}px;
  height: ${hw(380)}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px red;
`;
const SplashBlock = styled.View`
  flex: 0.2;
`;
const TitleBlock = styled.View`
  flex: 0.2;
  justify-content: center;
  align-items: center;
`;
const Title = styled.Text`
  font-family: Mariupol-Bold;
  font-size: ${hw(45)}px;
  text-align: center;
  color: #216169;
`;
// -----------
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
  background-color: #ebfbff;
  border-radius: 5px;
`;
const ButtonBlock = styled.View`
  flex: 1;

  ${dfjccaic}
`;
const WrapperImage = styled.View`
  flex: 1;
  border: solid 1px green;
  width: 100%;
  border-radius: ${hw(8)}px;
  overflow: hidden;
  ${dfjccaic}
`;

const containerStyle = {
  image: css`
    flex: 1;
    justify-content: center;
    width: 100%;
  `,
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
const ModalView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin: 20px;
  padding: 20px;
  border-radius: 20px;
  /* shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 2px;
  }
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5; */
`;
