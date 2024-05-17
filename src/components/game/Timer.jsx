import { View, Text } from "react-native";
import React from "react";
import styled from "@emotion/native";
import TimerComponent from "../elements/jsx/TimerComponent.jsx";
import { dfjccaic, ww } from "../../global/global-stiles.js";

const Timer = ({ onTimeUp, mode, initialTime }) => {
  console.log("🚀 ~ initialTime:", initialTime);
  return (
    <Container>
      <TimerComponent
        mode={mode}
        initialTime={initialTime}
        onTimeUp={onTimeUp}
      />
    </Container>
  );
};

export default Timer;

const Container = styled.View`
  flex: 0.11;
  width: 90%;
  border-radius: 8px;
  border: 3px solid white;
  background-color: #80ff86;

  padding: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
