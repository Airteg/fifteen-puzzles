import styled from "@emotion/native";
import { View } from "react-native";

const a = 0.2;
const computeSize = (size) => Math.min(size.width, size.height) * a;

const Square = styled.View`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background-color: ${(props) => props.bgColor || "red"};
`;

const Remainder = styled.View`
  /* width: ${(props) => props.width};
  height: ${(props) => props.height}; */
  align-self: stretch;
  background-color: ${(props) => props.bgColor};
`;

const Column = styled.View`
  width: ${(props) => props.width};
  background-color: ${(props) => props.bgColor};

  flex-direction: "column";
  justify-content: "space-between";
`;

const Test = ({ width, height }) => {
  const s = computeSize({ width, height });
  const size = {
    sq: s,
    rw: { width: s, height: height - 2 * s },
    rc: { width: width - 2 * s, height: height - 2 * s },
    rg: { width: s / a - 2 * s, height: s },
  };

  console.log("size", size);
  return (
    <View
      style={{
        width,
        height,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Column
        width={`${size.rw.width}px`}
        height={`100%`}
        bgColor={"#4e93ae80"}
      >
        <Square size={`${size.sq}px`} bgColor="red" />
        <Remainder
          width={`${size.rw.width}px`}
          height={`${size.rw.height}px`}
          bgColor="lightgreen"
        />
        <Square size={`${size.sq}px`} bgColor="red" />
      </Column>
      <Column
        width={`${size.rc.width}px`}
        height={`${size.rc.height}px`}
        bgColor={"#24782f80"}
      >
        <Remainder
          width={`${size.rc.width}px`}
          height={`${size.sq}px`}
          bgColor="lightgreen"
        />
        <Remainder
          width={`${size.rc.width}px`}
          height={`${size.rc.height}px`}
          bgColor="blue"
        />
        <Remainder
          width={`${size.rc.width}px`}
          height={`${size.sq}px`}
          bgColor="lightgreen"
        />
      </Column>
      <Column
        width={`${size.rw.width}px`}
        height={`100%`}
        bgColor={"#a34eae80"}
      >
        <Square size={`${size.sq}px`} bgColor="red" />
        <Remainder
          width={`${size.rw.width}px`}
          height={`${size.rw.height}px`}
          bgColor="lightgreen"
        />
        <Square size={`${size.sq}px`} bgColor="red" />
      </Column>
    </View>
  );
};

export default Test;
