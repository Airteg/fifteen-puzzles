// TODO Не враховані скорочені надписи, відносні координати

export const getBounds = (element) => {
  // console.log("getBounds->element.type:", element.type.displayName);
  switch (element.type.displayName) {
    case "Rect": {
      const { x, y, width, height } = element.props;

      return {
        x: parseFloat(x),
        y: parseFloat(y),
        width: parseFloat(width),
        height: parseFloat(height),
      };
    }
    case "Circle": {
      const { cx, cy, r } = element.props;
      return {
        width: parseFloat(cx) + parseFloat(r),
        height: parseFloat(cy) + parseFloat(r),
      };
    }
    case "Ellipse": {
      const { rx, ry, cx, cy } = element.props;
      return {
        width: parseFloat(cx) + parseFloat(rx),
        height: parseFloat(cy) + parseFloat(ry),
      };
    }
    case "Polygon":
    case "Polyline": {
      const points = element.props.points
        .split(" ")
        .map((point) => point.split(",").map(parseFloat));
      const xs = points.map(([x]) => x);
      const ys = points.map(([, y]) => y);
      return { width: Math.max(...xs), height: Math.max(...ys) };
    }
    case "Path": {
      const { d } = element.props;
      // console.log("🚀 ~ d:", d);

      // Розбираємо атрибут `d`, щоб знайти межі
      const pathCommands = d.match(
        /[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g,
      );

      // console.log("🚀 ~ pathCommands:", pathCommands);

      let x = 0,
        y = 0;
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      pathCommands.forEach((command) => {
        const type = command[0];
        const values = command
          .slice(1)
          .trim()
          .split(/[\s,]+/)
          .map(parseFloat);

        // Оновлюємо координати залежно від типу команди
        switch (type) {
          case "M": // MoveTo (абсолютні координати)
          case "L": // LineTo (абсолютні координати)
            [x, y] = values;
            break;
          case "H": // Horizontal LineTo
            x = values[0];
            break;
          case "V": // Vertical LineTo
            y = values[0];
            break;
          case "C": // Cubic Bezier Curve
            [x, y] = values.slice(-2);
            break;
          case "S": // Smooth Cubic Bezier Curve
            [x, y] = values.slice(-2);
            break;
          case "Q": // Quadratic Bezier Curve
            [x, y] = values.slice(-2);
            break;
          case "T": // Smooth Quadratic Bezier Curve
            [x, y] = values;
            break;
          case "A": // Arc
            [x, y] = values.slice(-2);
            break;
          case "Z": // ClosePath
            break;
          default:
            break;
        }

        // Оновлюємо межі
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });

      return { width: maxX - minX, height: maxY - minY };
    }
    default:
      return { width: 100, height: 100 }; // Значення за замовчуванням
  }
};
