import React, { useState, useEffect, memo } from "react";
import { Text, Alert } from "react-native";
import { hwN } from "../../../global/global-stiles.js";

const TimerComponent = memo(
  ({ onTimeUp, mode = "countdown", initialTime = 5 }) => {
    // console.log("🚀 ~ initialTime:", initialTime);
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

    return (
      <Text
        style={{
          fontFamily: "KronaOne_400Regular",
          fontSize: hwN(24),
          color: "#305a63",
        }}
      >
        {/* 🕔 {formatTime()} */}
      </Text>
    );
  }
);

export default TimerComponent;
