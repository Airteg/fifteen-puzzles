import { View, Text } from "react-native";
import React, { useState } from "react";
import styled from "@emotion/native";
import TimerComponent from "../elements/jsx/TimerComponent.jsx";
import { dfjccaic, ww } from "../../global/global-stiles.js";

const Timer = ({ onTimeUp, mode, initialTime }) => {
  let r = 0,
    g = 240,
    b = 0;
  const [color, setColor] = useState(`#80FF85`);
  const changeColor = (time) => {
    if (mode === "countdown") {
      switch (time) {
        case 60:
          setColor("#FAFF3F");
          break;
        case 30:
          setColor("rgb(255, 197, 75)");
          break;
        case 10:
          setColor("#FF7474");
          break;
      }
    }
  };
  return (
    <Container color={color}>
      <TimerComponent
        mode={mode}
        initialTime={initialTime}
        onTimeUp={onTimeUp}
        changeColor={changeColor}
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
  background-color: ${(props) => props.color};

  padding: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
