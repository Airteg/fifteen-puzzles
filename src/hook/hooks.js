import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

export const useWindowSize = () => {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get("window"),
    screen: Dimensions.get("screen"),
  });

  useEffect(() => {
    const onChange = ({ window, screen }) => {
      setDimensions({ window, screen });
    };

    // Підписуємося на зміни розмірів
    const subscription = Dimensions.addEventListener("change", onChange);

    // Повертаємо функцію для очищення під час демонтажу компонента
    return () => {
      if (typeof subscription === "function") {
        // Для деяких версій React Native
        subscription();
      } else {
        // Для новіших версій React Native
        subscription.remove();
      }
    };
  }, []);

  return dimensions;
};
