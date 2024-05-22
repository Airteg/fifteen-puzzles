import React, { useState, useEffect, memo } from "react";
import { Text, Alert } from "react-native";
import styled from "@emotion/native";
import Clock from "../../svg/Clock.jsx";
import { dfjccaic, hwN } from "../../../global/global-stiles.js";

const TimerComponent = memo(
  ({ onTimeUp, mode = "countdown", initialTime = 5 }) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
      let timerId;

      if (mode === "countdown") {
        if (time > 0) {
          timerId = setInterval(() => {
            setTime((prevTime) => {
              const newTime = prevTime - 1;
              if (newTime <= 0) {
                clearInterval(timerId);
                onTimeUp();
              }
              return newTime;
            });
          }, 1000);
        } else {
          clearInterval(timerId);
          onTimeUp();
        }
      } else if (mode === "elapsed") {
        timerId = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      }

      return () => clearInterval(timerId);
    }, [time, onTimeUp, mode]);

    const formatTime = () => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
      <Wrapper>
        <Clock />
        <Text
          style={{
            fontFamily: "KronaOne_400Regular",
            fontSize: hwN(18),
            color: "#305a63",
          }}
        >
          {formatTime()}
        </Text>
      </Wrapper>
    );
  }
);

export default TimerComponent;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  ${dfjccaic}
  flex-direction: row;
`;
