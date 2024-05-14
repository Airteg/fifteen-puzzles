import { View, Text } from "react-native";
import React, { useState } from "react";
import styled, { css } from "@emotion/native";
import Slider from "@react-native-community/slider";

import { dfjccaic, hw, platform, ww } from "../global/global-stiles.js";

import Plan from "../components/Plan.jsx";

const Edit = () => {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [value4, setValue4] = useState(0);
  return (
    <Container>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Text>x1: {value1.toFixed(0)}</Text>
        <Slider
          style={{ width: "100%", height: 15 }}
          minimumValue={0}
          maximumValue={100}
          onValueChange={setValue1}
          value={value1}
        />
        <Text>y1: {value2.toFixed(0)}</Text>
        <Slider
          style={{ width: "100%", height: 15 }}
          minimumValue={0}
          maximumValue={100}
          onValueChange={setValue2}
          value={value2}
        />
        <Text>x2: {value3.toFixed(0)}</Text>
        <Slider
          style={{ width: "100%", height: 15 }}
          minimumValue={0}
          maximumValue={100}
          onValueChange={setValue3}
          value={value3}
        />
        <Text>y2: {value4.toFixed(0)}</Text>
        <Slider
          style={{ width: "100%", height: 15 }}
          minimumValue={0}
          maximumValue={100}
          onValueChange={setValue4}
          value={value4}
        />
      </View>

      <Plan value1={value1} value2={value2} value3={value3} value4={value4} />
    </Container>
  );
};

export default Edit;

const Container = styled.View`
  flex: 1 1 auto;
  width: 100%;
  margin-top: ${hw(43)}px;
  margin-bottom: ${hw(40)}px;
  align-self: center;
  /* border: 1px solid darkgreen; */
  ${dfjccaic}
`;
