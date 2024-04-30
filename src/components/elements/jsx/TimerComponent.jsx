import React, { useState, useEffect, memo } from "react";
import { Text, Alert } from "react-native";

const TimerComponent = memo(({ onTimeUp }) => {
  const [time, setTime] = useState(120); // Таймер в секундах (2 хвилини)

  useEffect(() => {
    const timerId =
      time > 0 ? setInterval(() => setTime(time - 1), 1000) : null;

    if (time === 0) {
      clearInterval(timerId);
      onTimeUp();
    }

    return () => clearInterval(timerId);
  }, [time, onTimeUp]);

  return (
    <Text>{`Time: ${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${
      time % 60
    }`}</Text>
  );
});

export default TimerComponent;
