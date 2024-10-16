import React from "react";
import { Group, Path, Shadow } from "@shopify/react-native-skia";
import { dim, color as systemColor } from "../../global/global-stiles.js";

const BackButton = ({ x, y, height, color }) => (
  <Group
    transform={[
      { translateX: x + (dim.BUTTON_WIDTH - height) + (height - 20) / 2 },
      { translateY: y + (height - 17.03) / 2 },
    ]}
  >
    <Path
      path="m19.9979 16.9594c-2.4732-2.9679-4.5932-4.6638-6.5011-5.0878-1.9079-.424-3.7452-.4946-5.4411-.212V17.03L0 8.2677 8.0557 0v5.0878c3.1799 0 5.8651 1.1306 8.1264 3.3919 2.1906 2.2612 3.5332 5.0878 3.8159 8.409z"
      color={color}
      strokeWidth={1}
    >
      <Shadow dx={0} dy={0} blur={4} color={systemColor.SHADOW_COLOR} inner />
    </Path>
    <Path
      path="m19.9979 16.9594c-2.4732-2.9679-4.5932-4.6638-6.5011-5.0878-1.9079-.424-3.7452-.4946-5.4411-.212V17.03L0 8.2677 8.0557 0v5.0878c3.1799 0 5.8651 1.1306 8.1264 3.3919 2.1906 2.2612 3.5332 5.0878 3.8159 8.409z"
      style="stroke"
      color={systemColor.TEXT_COLOR}
      strokeWidth={1.5}
    >
      <Shadow dx={0} dy={0} blur={4} color={systemColor.SHADOW_COLOR} inner />
    </Path>
  </Group>
);
export default React.memo(BackButton);
