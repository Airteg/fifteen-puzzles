import { View } from "react-native";
import styled from "@emotion/native";

import { dfjccaic } from "../global/global-stiles.js";
import Test from "../components/elements/jsx/Test3.jsx";

const Edit = () => {
  return (
    <Container>
      <Test />
    </Container>
  );
};
export default Edit;

const Container = styled(View)`
  flex: 1;
  /* border: 0.5px solid darkgreen; */
  ${dfjccaic}
`;
