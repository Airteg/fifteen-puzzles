import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { hw } from "../global/global-stiles.js";

export default function Footer() {
  return (
    <ContainerFooter>
      <Text
        style={{
          fontFamily: "Mariupol-Bold",
          fontSize: parseInt(hw(16), 10),
          color: "#216169",
        }}
      >
        Foottteeerrr
      </Text>
    </ContainerFooter>
  );
}

const ContainerFooter = styled.View`
  display: flex;
  flex-direction: row;
  /* border: 1px solid teal; */
  height: ${hw(22)}px;
`;
