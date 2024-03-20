import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";

export default function Footer() {
  return (
    <ContainerFooter>
      <Text
        style={{
          fontFamily: "Mariupol-Bold",
          fontSize: 20,
          fontStyle: "italic",
          color: "orangered",
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
  border: 1px solid teal;
`;
