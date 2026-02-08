import { StyleSheet, Text, View } from "react-native";
import React, { use } from "react";
import { Stack } from "expo-router";
import { colors } from "@/constants/theme";
const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.neutral900 },
      }}
    ></Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
