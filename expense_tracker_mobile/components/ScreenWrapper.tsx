import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";

const { height } = Dimensions.get("window");
const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "android" ? 20 : height * 0.06; // Adjust for status bar height
  return (
    <View
      style={[
        style,
        { paddingTop: paddingTop, flex: 1, backgroundColor: colors.neutral900 },
      ]}
    >
      <StatusBar barStyle="light-content" />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
