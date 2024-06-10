import { View } from "react-native";
import { Image } from "expo-image";
import styled from "@emotion/native";
import { hw } from "../global/global-stiles.js";
import menuSplashTemp from "../assets/png/MAIN_MENU_splash_temp.png";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function MainMenuSplashContainer() {
  return (
    <Container>
      <Image
        source={menuSplashTemp}
        style={{ width: "100%", height: "100%" }}
        placeholder={{ blurhash }}
        contentFit="contain"
      />
    </Container>
  );
}
const Container = styled.View`
  width: 100%;
  height: ${hw(138)}px;
  /* border: 0.5px solid orange; */
`;
