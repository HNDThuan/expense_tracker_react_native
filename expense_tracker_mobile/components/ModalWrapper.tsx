import { Dimensions, StyleSheet, Text, View, Platform } from "react-native";
import React from "react";
import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  const inset = useSafeAreaInsets();
  const isIos = Platform.OS === "ios";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          paddingTop: isIos ? inset.top : Math.max(inset.top, 20),
          paddingBottom: isIos ? inset.bottom : Math.max(inset.bottom, 15),
        },
        style && style,
      ]}
    >
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
