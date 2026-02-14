import "react-native-gesture-handler";
import type * as React from "react";

declare module "react-native-gesture-handler" {
  interface GestureHandlerRootViewProps {
    children?: React.ReactNode;
  }
}
