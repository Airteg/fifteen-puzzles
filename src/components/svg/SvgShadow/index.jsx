import React from "react";
import { Svg } from "react-native-svg";

const SvgShadow = ({ SvgElement }) => {
  // Логування елемента та його пропсів
  console.log("🚀 ~ SvgElement props:", SvgElement.props);

  // Рендеримо SVG
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100">
      {SvgElement}
    </Svg>
  );
};

export default SvgShadow;
