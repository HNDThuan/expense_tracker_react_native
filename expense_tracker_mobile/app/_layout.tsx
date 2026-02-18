import { StyleSheet, Text, View } from "react-native";
import React, { use } from "react";
import { Stack } from "expo-router";
import { colors } from "@/constants/theme";
import { AuthProvider } from "@/contexts/authContext";
const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.neutral900 },
      }}
    >
      <Stack.Screen
        name="(modals)/profileModal"
        options={{ presentation: "modal" }}
      ></Stack.Screen>
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
