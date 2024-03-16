import styled, { css } from "@emotion/native";
import { ThemeProvider } from "@emotion/react";

const theme = {
  color: "hotpink",
  backgroundColor: "purple",
};
const emotionLogo =
  "https://cdn.rawgit.com/emotion-js/emotion/main/emotion.png";

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Container
        style={css`
          border-radius: 10px;
        `}
      >
        <Description style={{ fontSize: 45, fontWeight: "bold" }}>
          Emotion Primitives
        </Description>
        <Image
          source={{
            uri: emotionLogo,
            height: 150,
            width: 150,
          }}
        />
      </Container>
    </ThemeProvider>
  );
}
const Container = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin: 50px; */
  border: 5px solid red;
  background-color: ${(props) => props.theme.backgroundColor};
  padding: 10%;
`;
const Description = styled.Text({
  textAlign: "center",
  color: "hotpink",
});
const Image = styled.Image`
  padding: 40px;
`;
