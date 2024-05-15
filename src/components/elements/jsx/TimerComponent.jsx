import React, { useState, useEffect, memo } from "react";
import { Text, Alert } from "react-native";

const TimerComponent = memo(
  ({ onTimeUp, mode = "countdown", initialTime = 3600 }) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
      let timerId;

      if (mode === "countdown") {
        timerId = time > 0 ? setInterval(() => setTime(time - 1), 1000) : null;
        if (time === 0) {
          clearInterval(timerId);
          onTimeUp();
        }
      } else if (mode === "elapsed") {
        timerId = setInterval(() => setTime(time + 1), 1000);
      }

      return () => clearInterval(timerId);
    }, [time, onTimeUp, mode]);

    const formatTime = () => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return <Text>{formatTime()}</Text>;
  }
);

export default TimerComponent;
