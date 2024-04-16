import { Group, Rect, Shadow } from "@shopify/react-native-skia";

export const dim = { width: 98, height: 98 };
const Test = () => {
  return (
    <Group>
      <Rect style="fill" x={4} y={4} width={90} height={90} color="lime" />
      <Shadow dx={-2} dy={-2} blur={4} color="#000000" />
    </Group>
  );
};

export default Test;
