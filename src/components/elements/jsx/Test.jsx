import styled from "@emotion/native";
import { View } from "react-native";
import LGr from "./LGr.jsx";
import { topRight } from "@shopify/react-native-skia";

const a = 0.3;
const computeSize = (size) => Math.min(size.width, size.height) * a;

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
        overflow: "visible",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Column
        width={`${size.rw.width}px`}
        height={`100%`}
        bgColor={"transparent"}
      >
        <Square size={`${size.sq}px`} bgColor="transparent">
          <LGr params={[1, 1, 0, 0]} style={{ width: "150%" }} />
        </Square>
        <Remainder
          width={`${size.rw.width}px`}
          height={`${size.rw.height}px`}
          bgColor="transparent"
        >
          <LGr
            params={[1, 0, -1, 0]}
            style={[
              {
                width: "200%",
                height: "100%",
                position: "absolute",
                top: 0,
                right: 0,
              },
            ]}
          />
        </Remainder>
        <Square size={`${size.sq}px`} bgColor="transparent">
          <LGr params={[1.5, 0.5, 0.3, 1.3]} />
        </Square>
      </Column>
      <Column
        width={`${size.rc.width}px`}
        height={`${size.rc.height}px`}
        bgColor="transparent"
      >
        <Remainder
          width={`${size.rc.width}px`}
          height={`${size.sq}px`}
          bgColor="transparent"
        />
        <Remainder
          width={`${size.rc.width}px`}
          height={`${size.rc.height}px`}
          bgColor="blue"
        />
        <Remainder
          width={`${size.rc.width}px`}
          height={`${size.sq}px`}
          bgColor="transparent"
        />
      </Column>
      <Column
        width={`${size.rw.width}px`}
        height={`100%`}
        bgColor="transparent"
      >
        <Square size={`${size.sq}px`} bgColor="transparent" />
        <Remainder
          width={`${size.rw.width}px`}
          height={`${size.rw.height}px`}
          bgColor="transparent"
        />
        <Square size={`${size.sq}px`} bgColor="transparent" />
      </Column>
    </View>
  );
};

export default Test;

const Square = styled.View`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background-color: ${(props) => props.bgColor || "red"};
  overflow: visible;
`;

const Remainder = styled.View`
  /* width: ${(props) => props.width};
  height: ${(props) => props.height}; */
  align-self: stretch;
  background-color: ${(props) => props.bgColor};
  overflow: visible;
`;

const Column = styled.View`
  width: ${(props) => props.width};
  background-color: ${(props) => props.bgColor};
  overflow: visible;

  flex-direction: "column";
  justify-content: "space-between";
`;
