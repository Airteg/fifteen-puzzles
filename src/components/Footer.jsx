import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";
import { usePathname } from "expo-router";
import { hw } from "../global/global-stiles.js";

export default function Footer() {
  const currentPath = usePathname();
  return (
    <ContainerFooter>
      {currentPath === "/Game" ? (
        ""
      ) : (
        <>
          <TextCont>Privacy Policy</TextCont>
          <TextCont>User Agreement</TextCont>
        </>
      )}
    </ContainerFooter>
  );
}

const ContainerFooter = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* border: 1px solid teal; */
  height: ${hw(22)}px;
`;
const TextCont = styled.Text`
  font-family: "Mariupol-Bold";
  font-size: ${hw(16)}px;
  text-align: right;
  color: #216169;
`;
